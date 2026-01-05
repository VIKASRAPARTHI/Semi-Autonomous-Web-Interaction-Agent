import asyncio
from playwright.async_api import async_playwright
import base64
from repository import log_repo, agent_repo
from models import LogSchema
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AgentService")

class AgentService:
    def __init__(self, agent_id: str = "default", event_callback=None):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.is_running = False
        self.agent_id = agent_id
        self.event_callback = event_callback
        self.stream_task = None

    async def _emit_event(self, event_type: str, data: dict):
        if self.event_callback:
            await self.event_callback(event_type, data)
        
        # Persist to DB (skip VIDEO_FRAME to avoid DB overload)
        if event_type in ["INFO", "NAVIGATE", "ACTION", "ERROR", "OBSERVATION", "SCREENSHOT"]:
             msg = data.get("message", "")
             if not msg and event_type == "NAVIGATE": msg = f"Navigated to {data.get('url')}"
             
             try:
                 # Only save to DB if database is connected
                 if db.db is not None:
                     log_entry = LogSchema(
                         agent_id=self.agent_id,
                         type=event_type,
                         message=msg,
                         detail=str(data)
                     )
                     await log_repo.create_log(log_entry)
             except Exception as e:
                 # Silently fail if database isn't available
                 logger.debug(f"Could not persist log (DB may not be connected): {e}")

    async def start(self, headless: bool = True):
        await self._emit_event("INFO", {"message": "Starting browser service..."})
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=headless)
        self.page = await self.browser.new_page()
        self.is_running = True
        logger.info("Browser started")
        await self._emit_event("INFO", {"message": "Browser session initialized"})
        
        # Start video streaming in background
        self.stream_task = asyncio.create_task(self._video_stream_loop())

    async def stop(self):
        self.is_running = False
        
        # Cancel video stream
        if self.stream_task:
            self.stream_task.cancel()
            try:
                await self.stream_task
            except asyncio.CancelledError:
                pass
        
        if self.page:
            await self.page.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        await self._emit_event("INFO", {"message": "Session ended"})

    async def navigate(self, url: str):
        if not self.page:
            raise Exception("Browser not started")
        
        await self._emit_event("NAVIGATE", {"message": f"Navigating to {url}"})
        try:
            await self.page.goto(url, timeout=30000, wait_until="domcontentloaded")
            await self._emit_event("INFO", {"message": "Page loaded successfully"})
            
            return True, "Navigation successful"
        except Exception as e:
            await self._emit_event("ERROR", {"message": "Navigation failed", "detail": str(e)})
            return False, str(e)
            
    async def get_page_content(self):
        if not self.page:
            return ""
        return await self.page.content()

    async def execute_action(self, action: dict):
        action_type = action.get("type")
        target = action.get("target")
        reason = action.get("reason")
        
        await self._emit_event("ACTION", {"message": f"Executing {action_type}", "detail": reason})
        
        try:
            if action_type == "NAVIGATE":
                if target:
                    # Handle relative URLs
                    if target.startswith('/'):
                        current_url = self.page.url
                        from urllib.parse import urlparse
                        parsed = urlparse(current_url)
                        target = f"{parsed.scheme}://{parsed.netloc}{target}"
                    elif not target.startswith('http'):
                        # Skip invalid URLs
                        await self._emit_event("INFO", {"message": f"Skipping invalid URL: {target}"})
                        return
                    
                    await self.navigate(target)
                else:
                    await self._emit_event("ERROR", {"message": "Navigation failed", "detail": "No target URL provided"})
            
            elif action_type == "CLICK":
                if target:
                    await self._emit_event("INFO", {"message": f"Clicking element: {target}"})
                    await self.page.click(target, timeout=5000)
                    await asyncio.sleep(1)
                
            elif action_type == "WAIT":
                await asyncio.sleep(2)
                
            else:
                 await self._emit_event("INFO", {"message": f"Unknown action: {action_type}"})
                 
        except Exception as e:
            await self._emit_event("ERROR", {"message": f"Action {action_type} failed", "detail": str(e)})
    
    async def _video_stream_loop(self):
        """Continuously capture and stream video frames"""
        logger.info("Starting video stream...")
        frame_count = 0
        
        while self.is_running:
            try:
                if not self.page:
                    await asyncio.sleep(0.5)
                    continue
                
                # Capture frame as JPEG for better compression
                screenshot = await self.page.screenshot(
                    type="jpeg",
                    quality=60
                )
                b64_img = base64.b64encode(screenshot).decode('utf-8')
                
                # Emit video frame
                if self.event_callback:
                    await self.event_callback("VIDEO_FRAME", {
                        "message": b64_img,
                        "frame": frame_count
                    })
                
                frame_count += 1
                
                # 10 FPS = 100ms between frames
                await asyncio.sleep(0.1)
                
            except asyncio.CancelledError:
                logger.info("Video stream cancelled")
                break
            except Exception as e:
                logger.error(f"Frame capture error: {e}")
                await asyncio.sleep(0.5)
        
        logger.info(f"Video stream stopped. Total frames: {frame_count}")
