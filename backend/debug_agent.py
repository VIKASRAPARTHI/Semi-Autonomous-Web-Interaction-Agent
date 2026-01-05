import asyncio
import sys

async def test_agent():
    sys.path.insert(0, '.')
    from agent_service import AgentService
    from decision_engine import DecisionEngine
    from database import db
    
    # Connect DB
    db.connect()
    
    agent_id = "test-debug"
    url = "https://news.ycombinator.com"
    
    service = AgentService(agent_id=agent_id)
    engine = DecisionEngine()
    
    try:
        print("1. Starting browser...")
        await service.start(headless=True)
        print("✓ Browser started")
        
        print("2. Navigating to URL...")
        await service.navigate(url)
        print(f"✓ Navigated to {url}")
        
        print("3. Setting current URL in engine...")
        engine.set_current_url(url)
        print(f"✓ Engine URL set")
        
        print("4. Getting page content...")
        content = await service.get_page_content()
        print(f"✓ Got content ({len(content)} chars)")
        
        print("5. Analyzing content...")
        analysis = engine.analyze(content)
        print(f"✓ Analysis: {analysis['link_count']} links, {analysis['unvisited_link_count']} unvisited")
        
        print("6. Deciding next action...")
        action = engine.decide_next_action(analysis)
        print(f"✓ Action: {action['type']} - {action.get('reason', '')}")
        
        print("7. Executing action...")
        await service.execute_action(action)
        print("✓ Action executed")
        
        print("\n✅ All steps completed successfully!")
        
    except Exception as e:
        print(f"\n❌ ERROR at step:")
        import traceback
        traceback.print_exc()
    finally:
        await service.stop()
        db.close()

if __name__ == "__main__":
    asyncio.run(test_agent())
