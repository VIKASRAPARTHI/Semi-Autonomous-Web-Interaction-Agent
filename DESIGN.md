# Design Explanation

## Core Design Decisions & Trade-offs

### 1. Heuristic-Based Decision Making
**Choice:** Simple heuristics instead of LLM integration.

**Why:**
- (+) Instant decisions (no API latency)
- (+) Zero cost, no external dependencies
- (+) Deterministic and debuggable
- (-) Can't understand page semantics
- (-) No visual analysis capability

**Rationale:** Proves the architecture works. DecisionEngine is swappable - can upgrade to LLM later.

### 2. Random Link Selection
**Choice:** Random selection among unvisited links.

**Why:**
- (+) Explores diverse paths each run
- (+) Unbiased - finds unexpected issues
- (+) Simple and fast
- (-) Inefficient - may explore trivial pages first
- (-) No goal-orientation

**Rationale:** Valid testing strategy that discovers edge cases targeted testing might miss.

### 3. Bounded Exploration Loop
**Choice:** Fixed 20-iteration loop instead of unbounded exploration.

**Why:**
- (+) Guaranteed termination
- (+) Predictable resource usage
- (-) Arbitrary limit
- (-) Doesn't adapt to site complexity

**Rationale:** Safer for demo. Production would use adaptive stopping conditions.

### 4. MongoDB Over SQL
**Choice:** NoSQL database for agent data.

**Why:**
- (+) Flexible schema for varied log structures
- (+) Fast writes for high-frequency logging
- (+) JSON-native
- (-) No joins or transactions
- (-) Complex queries require aggregation

**Rationale:** Agent logs are semi-structured and write-heavy. Flexibility > relational benefits.

### 5. WebSocket Streaming
**Choice:** Real-time video via WebSocket instead of HTTP polling.

**Why:**
- (+) Low latency, instant updates
- (+) Efficient (one connection)
- (+) Bidirectional communication
- (-) More complex than HTTP
- (-) Connection management overhead

**Rationale:** Real-time experience is essential for live agent dashboard.

### 6. Playwright Over Selenium
**Choice:** Modern browser automation tool.

**Why:**
- (+) Async API matches FastAPI
- (+) Better performance
- (+) Built-in screenshot support
- (-) Smaller community
- (-) Less mature ecosystem

**Rationale:** Async architecture and performance critical for real-time agent.

## Current Limitations

### 1. Agent Premature Completion (Critical Bug)
**Problem:** Agents complete in 2-3 seconds instead of exploring 20 pages.

**Status:** Logic works (proven by debug script), but background task execution fails.

**Impact:** No pages explored, no video stream, no insights generated.

### 2. No Form Interaction
**Missing:** Can't fill forms, test login flows, or submit data.

**Impact:** Misses major user journeys (auth, search, checkout).

### 3. No Issue Classification
**Missing:** All errors logged equally, no severity or categorization.

**Impact:** Hard to prioritize findings or identify critical issues.

### 4. Single Domain Only
**Missing:** Can't follow external flows (OAuth, payment gateways).

**Impact:** Misses multi-domain user journeys.

### 5. No Visual Regression
**Missing:** Screenshots captured but not compared across runs.

**Impact:** Can't detect UI changes or visual bugs.

### 6. Limited Observability
**Missing:** No metrics, tracing, or performance monitoring.

**Impact:** Hard to debug and track agent performance.

## Next Steps (Priority Order)

### Immediate (1-2 days)
1. **Fix agent completion bug** - Critical for demo
2. **Add error handling** - Proper exception catching and recovery
3. **Basic metrics** - Track exploration rate and errors

### Short-term (1 week)
1. **LLM integration** - GPT-4 Vision for intelligent decisions
2. **Form interaction** - Detect and fill forms with test data
3. **Button clicking** - Handle JavaScript-heavy SPAs

### Medium-term (2-3 weeks)
1. **Issue classification** - Categorize by type and severity
2. **Visual regression** - Compare screenshots, generate diffs
3. **Performance monitoring** - Track load times, identify slow pages
4. **Multi-agent coordination** - Run parallel agents, aggregate findings

### Long-term (1+ month)
1. **Reinforcement learning** - Train agent to find bugs faster
2. **Anomaly detection** - Learn normal behavior, flag unusual patterns
3. **Production infrastructure** - Docker, Kubernetes, CI/CD integration
4. **Advanced reporting** - Natural language summaries, visualizations

## Architecture Improvements Needed

**Current Issues:**
- Tight coupling (AgentService knows about database)
- No abstraction layer for browser automation
- Monolithic decision engine

**Better Approach:**
- Dependency injection and service layer pattern
- Browser interface with adapter pattern
- Strategy pattern for pluggable decision makers
- Clear separation: API → Service → Domain → Infrastructure

## Conclusion

The project demonstrates **autonomous web exploration with runtime decision-making**. The architecture is sound and extensible. Main blocker is the agent completion bug - once fixed, the system can be enhanced with LLM intelligence, form interaction, and production features.

**Key Insight:** Intelligent testing doesn't require perfect AI. Simple heuristics can discover issues that scripted tests miss, as long as the agent can observe, decide, and act autonomously.
