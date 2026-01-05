import motor.motor_asyncio
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "agent_os"

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None

    def connect(self):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        self.db = self.client[DB_NAME]
        print(f"Connected to MongoDB at {MONGO_URL}")

    def close(self):
        if self.client:
            self.client.close()

db = Database()

async def get_database():
    return db.db
