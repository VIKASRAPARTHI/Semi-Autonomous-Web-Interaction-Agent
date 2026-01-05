import asyncio
from agent_service import AgentService

async def test():
    print("Creating AgentService...")
    service = AgentService(agent_id="test-123")
    
    try:
        print("Starting browser...")
        await service.start(headless=True)
        print("✓ Browser started successfully")
        
        print("Waiting 3 seconds for video stream...")
        await asyncio.sleep(3)
        
        print("Navigating to example.com...")
        await service.navigate("https://example.com")
        print("✓ Navigation successful")
        
        print("Waiting 5 seconds...")
        await asyncio.sleep(5)
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        print("Stopping service...")
        await service.stop()
        print("✓ Test complete")

if __name__ == "__main__":
    asyncio.run(test())
