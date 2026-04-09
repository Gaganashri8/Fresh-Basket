## 🛒 Fresh-Cart: Autonomous Multi-Agent Shopping System



## Fresh-Cart  is an intelligent, autonomous shopping platform powered by a multi-agent AI system that transforms vague user intents into optimized, real-world purchase decisions.

Instead of manually comparing prices across stores, Fresh-Cart:

* Understands user intent
* Retrieves past behavior and preferences
* Detects inconsistencies in pricing
* Automatically builds the cheapest possible cart across multiple shops



Modern shopping platforms:

* Show static prices
* Do not remember user habits
* Fail to detect abnormal price spikes
* Require manual comparison across stores

Fresh-Cart solves this using autonomous agents that think, remember, and act.





 🤖 Multi-Agent System

Fresh-Cart is powered by three specialized agents

## 1️⃣ Orchestrator Agent

* Acts as the brain of the system
* Understands vague user input
* Breaks tasks into smaller actions
* Delegates work to other agents



2️⃣ Memory Agent

* Maintains both semantic + structured memory
* Converts vague queries into real product data
* Retrieves latest prices and detects anomalies



3️⃣ Checkout Agent

* Optimizes the final cart
* Combines best prices across shops
* Produces the lowest-cost purchase plan**

🔄 End-to-End Workflow

 Step 1: Receive Vague User Prompt

Orchestrator Agent


* Detects ambiguity
* Initiates intelligent workflow

 🔵 Step 2: Execute Semantic RAG

Memory Agent (L1 Cache - Vector Memory)

* Performs semantic search using vector database
* Maps vague intent → actual items:

```
KAG_001 → Eggs  
KAG_002 → Flour  
KAG_003 → Garlic  
KAG_004 → Cheddar  
```



 🟡 Step 3: Query Facts & Verify Time

Memory Agent (L2 Cache - SQLite Memory)

* Executes structured SQL queries:

```
SELECT * FROM items 
WHERE item_id = ? 
ORDER BY last_updated DESC 
LIMIT 1;
```

* Retrieves:

  * Latest price
  * Shop location
  * Stock availability

 Ensures outdated data is ignored
 Maintains **temporal accuracy**



 🔴 Step 4: Perform Agentic Checkout

Checkout Agent (via Orchestrator)**

* Combines all item data
* Computes cheapest combination across stores:

Example:

* Eggs → Shop B
* Garlic → Shop A
* Flour → Shop C

Produces minimum total cost cart



 🟣 Step 5: Final Output

* Displays optimized cart
* Provides reasoning
* Asks for user confirmation



Contradiction Detection (Key Innovation)

Fresh-Cart doesn’t just fetch data — it **questions it**.



System flags:


⚠️ Price anomaly detected


Instead of blindly trusting it.



 🏗️ System Architecture

```
User Input
   ↓
Orchestrator Agent
   ↓
Memory Agent
   ├── Semantic Memory (Vector DB)
   └── Structured Memory (SQLite)
   ↓
Checkout Agent
   ↓
Optimized Cart + Explanation
```

 📂 Project Structure

```
memory_agent/
│
├── agents/
│   ├── memory_agent.py
│   ├── contradiction_engine.py
│   ├── semantic_retriever.py
│   └── langgraph_flow.py
│
├── db/
│   ├── models.py
│   └── queries.py
│
├── seed_data.py
├── test_agent.py
├── requirements.txt
└── README.md
```



⚙️ Tech Stack
🧠 AI & Agents

* Google Gemini API
* LangGraph (workflow orchestration)
* RAG (Retrieval Augmented Generation)

 🗄️ Data Layer

* SQLite (structured memory)
* ChromaDB (vector memory)

🧩 Backend

* Python
* FastAPI (optional integration)





 Conclusion

Fresh-Cart redefines online shopping by introducing:
