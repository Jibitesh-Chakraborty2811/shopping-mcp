# agent.py

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import InMemorySaver

from tools import (
    signup_tool,
    login_tool,
    get_products_tool,
    add_to_cart_tool,
    view_cart_tool,
    get_cart_tool,
    get_orders_tool,
    checkout_tool
)

# ------------------------
# LLM (YOUR CONFIG)
# ------------------------

llm = ChatOpenAI(
    model="qwen/qwen3.6-plus:free",
    openai_api_key="<Your-API-Key>",
    openai_api_base="https://openrouter.ai/api/v1",
    temperature=0
)

# ------------------------
# TOOLS
# ------------------------

tools = [
    signup_tool,
    login_tool,
    get_products_tool,
    add_to_cart_tool,
    view_cart_tool,
    get_cart_tool,
    get_orders_tool,
    checkout_tool
]

# ------------------------
# SYSTEM PROMPT
# ------------------------

system_prompt = """You are a smart shopping assistant.

RULES:
- Maintain conversation context
- Remember user actions
- Always use tools for operations
- Ask for login if not logged in
- Use product list before adding items
- Never hallucinate product_id
"""

# ------------------------
# AGENT WITH MEMORY
# ------------------------

agent = create_agent(
    llm,
    tools=tools,
    checkpointer=InMemorySaver(),
    system_prompt=system_prompt,
)
