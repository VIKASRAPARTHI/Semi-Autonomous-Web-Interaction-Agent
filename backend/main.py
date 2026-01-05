from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
from typing import List, Optional
from datetime import datetime

from agent_service import AgentService
from decision_engine import DecisionEngine
from database import db
from repository import agent_repo, log_repo
from models import AgentSchema, LogSchema

app = FastAPI(title="Agent OS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    db.close()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()
active_agent = None
running_tasks = set()  # Track background tasks to prevent garbage collection

class AgentStartRequest(BaseModel):
    url: str
    autonomy_level: str = "passive"

async def run_agent_loop(url: str, agent_id: str, autonomy_level: str):
    global active_agent
    
    print(f"[DEBUG] Starting agent loop for {agent_id}")
    
    # Update status to RUNNING
    await agent_repo.update_status(agent_id, "RUNNING")
    print(f"[DEBUG] Status set to RUNNING")
    
    async def broadcast_event(event_type, data):
        # Broadcast to UI
        await manager.broadcast({
            "type": event_type, 
            "message": data.get("message", ""), 
            "detail": str(data),
            "agent_id": agent_id
        })

    service = AgentService(agent_id=agent_id, event_callback=broadcast_event)
    active_agent = service
    engine = DecisionEngine()
    
    print(f"[DEBUG] Service and engine created")
    
    try:
        print(f"[DEBUG] Starting browser...")
        await service.start()
        print(f"[DEBUG] Browser started, navigating to {url}")
        await service.navigate(url)
        print(f"[DEBUG] Navigation complete")
        
        # Set initial URL in decision engine
        engine.set_current_url(url)
        
        # Exploration Loop (20 steps for meaningful exploration)
        print(f"[DEBUG] Starting exploration loop (20 iterations)")
        for i in range(20):
            print(f"[DEBUG] Iteration {i+1}/20")
            if not service.is_running: 
                print(f"[DEBUG] Service stopped running, breaking loop")
                break
            
            # Update current URL in decision engine
            current_url = service.page.url if service.page else url
            engine.set_current_url(current_url)
            
            content = await service.get_page_content()
            await agent_repo.increment_stats(agent_id, pages_explored=1)
            
            analysis = engine.analyze(content)
            
            await service._emit_event("OBSERVATION", {
                "message": "Page Analyzed",
                "detail": f"Found {analysis['link_count']} links ({analysis['unvisited_link_count']} unvisited), {analysis['button_count']} buttons."
            })
            
            action = engine.decide_next_action(analysis)
            
            await service._emit_event("ANALYSIS", {
                "message": f"Deciding next move: {action['type']}",
                "detail": action.get('reason', '')
            })
            
            # EXECUTE THE ACTION
            await service.execute_action(action)
            
            await asyncio.sleep(3)  # Wait between actions 
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"AGENT ERROR: {error_detail}")  # Log to console
        await agent_repo.update_status(agent_id, "FAILED")
        await service._emit_event("ERROR", {"message": "Runtime Error", "detail": str(e)})
    finally:
        await service.stop()
        await agent_repo.update_status(agent_id, "COMPLETED")
        active_agent = None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/agent/start")
async def start_agent(request: AgentStartRequest):
    global active_agent
    if active_agent:
        return {"status": "error", "message": "Agent already running"}
    
    # Create Agent in DB
    new_agent = AgentSchema(target_url=request.url, autonomy_level=request.autonomy_level)
    await agent_repo.create_agent(new_agent)
    
    # Use asyncio.create_task for long-running background execution
    task = asyncio.create_task(run_agent_loop(request.url, new_agent.id, request.autonomy_level))
    running_tasks.add(task)
    task.add_done_callback(running_tasks.discard)  # Clean up when done
    return {"status": "started", "agent_id": new_agent.id, "target": request.url}

@app.post("/agent/stop")
async def stop_agent():
    global active_agent
    if active_agent:
        active_agent.is_running = False
    return {"status": "stopping"}

# --- Data APIs ---

@app.get("/agents")
async def get_agents():
    return await agent_repo.get_all_agents()

@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    agent = await agent_repo.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@app.get("/logs")
async def get_logs(agent_id: Optional[str] = None, limit: int = 50):
    return await log_repo.get_logs(agent_id, limit)

@app.get("/dashboard/stats")
async def get_stats():
    agents = await agent_repo.get_all_agents()
    total_agents = len(agents)
    total_active = sum(1 for a in agents if a['status'] == 'RUNNING')
    
    # Aggregate pages explored
    total_pages = sum(a.get('stats', {}).get('pages_explored', 0) for a in agents)
    
    return {
        "active_agents": total_active,
        "total_agents": total_agents,
        "pages_explored": total_pages,
        "efficiency_score": 92 # Placeholder or calc
    }
