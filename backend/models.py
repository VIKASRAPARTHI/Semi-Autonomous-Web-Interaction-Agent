from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

class AgentSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = "New Agent"
    target_url: str
    autonomy_level: str
    status: str = "IDLE" # IDLE, RUNNING, PAUSED, COMPLETED, FAILED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_run: Optional[datetime] = None
    stats: dict = {"pages_explored": 0, "issues_found": 0}

class LogSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    agent_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    type: str # INFO, NAVIGATE, ACTION, ERROR, OBSERVATION
    message: str
    detail: Optional[str] = None
    meta: Optional[str] = None
