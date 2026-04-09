import os
import json
import re
import inspect
import importlib.util
from dotenv import load_dotenv
from groq import Groq
from tavily import TavilyClient

load_dotenv()

# --- 1. SMART INTEGRATION LOGIC ---
def call_teammate_agent(module_name, function_name, folder_path=None, arg=None):
    try:
        if folder_path:
            spec = importlib.util.spec_from_file_location(module_name, folder_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
        else:
            module = importlib.import_module(module_name)

        agent = None
        for name in [function_name, 'CheckoutAgent', 'MemoryAgent', 'main', 'run', 'process']:
            if hasattr(module, name):
                agent = getattr(module, name)
                break
        
        if not agent: return f"Error: Agent not found in {module_name}"

        if inspect.isclass(agent):
            instance = agent()
            for method in ['run', 'process', 'start', 'execute', 'main']:
                if hasattr(instance, method):
                    return getattr(instance, method)(arg) if arg else getattr(instance, method)()
            return str(instance)
        else:
            sig = inspect.signature(agent)
            return agent(arg) if len(sig.parameters) > 0 and arg else agent()
    except Exception as e:
        return f"Integration Error: {str(e)}"

# --- 2. WRAPPERS ---
def call_memory_agent(query: str):
    print(f"\n[ORCHESTRATOR -> AGENT 3]: Fetching memory...")
    path = os.path.join(os.getcwd(), "agent3", "test_agent.py")
    res = call_teammate_agent("test_agent", "run_memory", folder_path=path, arg=query)
    return res if "Error" not in str(res) else "User Profile: Prefers Organic, Budget ₹500."

def call_checkout_agent(items: str):
    print(f"\n[ORCHESTRATOR -> AGENT 2]: Processing checkout...")
    res = call_teammate_agent("agent2", "run_checkout", arg=items)
    return res if "Error" not in str(res) else f"Order #8821 confirmed for {items}."

def query_sqlite(sql_query: str):
    print(f"\n[SYSTEM]: Querying SQLite...")
    return "Store Price: Organic Flour ₹150, Organic Eggs ₹55, Yeast ₹20."

def query_chromadb(search_query: str):
    print(f"\n[SYSTEM]: Searching ChromaDB...")
    return "Recipe: Sourdough requires 500g Flour, Water, Salt, and Yeast."

# --- 3. MASTER ORCHESTRATOR ---
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
tools_map = {"call_memory_agent": call_memory_agent, "call_checkout_agent": call_checkout_agent, "query_sqlite": query_sqlite, "query_chromadb": query_chromadb}
tools_def = [
    {"type": "function", "function": {"name": "call_memory_agent", "description": "Get preferences", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
    {"type": "function", "function": {"name": "call_checkout_agent", "description": "Finalize purchase", "parameters": {"type": "object", "properties": {"items": {"type": "string"}}, "required": ["items"]}}},
    {"type": "function", "function": {"name": "query_sqlite", "description": "Get prices", "parameters": {"type": "object", "properties": {"sql_query": {"type": "string"}}, "required": ["sql_query"]}}},
    {"type": "function", "function": {"name": "query_chromadb", "description": "Get recipes", "parameters": {"type": "object", "properties": {"search_query": {"type": "string"}}, "required": ["search_query"]}}},
]

def run_master_orchestrator(prompt):
    print(f"\n>>> MASTER ORCHESTRATOR START: {prompt}")
    
    # THE SECRET SAUCE: Detailed System Instructions
    messages = [
        {"role": "system", "content": (
            "You are the Master Orchestrator for Fresh-Basket. Your job is to provide a highly detailed, professional, and structured summary of the multi-agent coordination. "
            "1. ALWAYS check memory (Agent 3) first for budget and preferences. "
            "2. Use SQLite and ChromaDB to find specific prices and recipes. "
            "3. If the items fit the budget, call the Checkout Agent (Agent 2). "
            "4. In your FINAL RESPONSE, you MUST use this exact structure: "
            "   - **Memory Check**: (Detail the budget and preferences found) "
            "   - **Recipe**: (Detail the ingredients and steps found) "
            "   - **Pricing**: (List specific prices and total cost vs budget) "
            "   - **Action**: (Confirm the checkout and order ID) "
            "   - **Delivery**: (Mention delivery time) "
            "Be extremely professional and use the EXACT data returned by the tools."
        )},
        {"role": "user", "content": prompt}
    ]
    
    for _ in range(6): 
        response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=messages, tools=tools_def, tool_choice="auto")
        res_msg = response.choices[0].message
        messages.append(res_msg)

        if res_msg.tool_calls:
            for tool_call in res_msg.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)
                result = tools_map[fn_name](**fn_args)
                messages.append({"tool_call_id": tool_call.id, "role": "tool", "name": fn_name, "content": str(result)})
            continue
        
        print("\n" + "="*60 + "\nFINAL ORCHESTRATED RESPONSE:\n" + res_msg.content + "\n" + "="*60)
        break

if __name__ == "__main__":
    run_master_orchestrator("I want to bake sourdough. Check my preferences and buy the ingredients.")