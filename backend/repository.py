from database import db
from models import AgentSchema, LogSchema
from datetime import datetime

class AgentRepository:
    async def create_agent(self, agent: AgentSchema):
        agent_dict = agent.dict()
        await db.db.agents.insert_one(agent_dict)
        return agent

    async def get_all_agents(self):
        agents = []
        cursor = db.db.agents.find({})
        async for document in cursor:
            # document["id"] = document["_id"] # Map _id to id - REMOVED
            if "_id" in document:
                del document["_id"]
            agents.append(document)
        return agents

    async def get_agent(self, agent_id: str):
        document = await db.db.agents.find_one({"id": agent_id})
        if document:
            # document["id"] = document["_id"] - REMOVED
            if "_id" in document:
                del document["_id"]
        return document

    async def update_status(self, agent_id: str, status: str):
        await db.db.agents.update_one(
            {"id": agent_id},
            {"$set": {"status": status, "last_run": datetime.utcnow()}}
        )

    async def increment_stats(self, agent_id: str, pages_explored: int = 0, issues_found: int = 0):
        await db.db.agents.update_one(
            {"id": agent_id},
            {"$inc": {"stats.pages_explored": pages_explored, "stats.issues_found": issues_found}}
        )

class LogRepository:
    async def create_log(self, log: LogSchema):
        log_dict = log.dict()
        await db.db.logs.insert_one(log_dict)
        return log

    async def get_logs(self, agent_id: str = None, limit: int = 100):
        query = {}
        if agent_id:
            query["agent_id"] = agent_id
        
        logs = []
        cursor = db.db.logs.find(query).sort("timestamp", -1).limit(limit)
        async for document in cursor:
            # document["id"] = document["_id"] - REMOVED
            if "_id" in document:
                del document["_id"]
            logs.append(document)
        return logs

agent_repo = AgentRepository()
log_repo = LogRepository()
