# tools.py

from langchain.tools import tool
from mcp_client import call_tool

@tool
def signup_tool(user_id: str, name: str, password: str, address: str, phone: str) -> str:
    """Sign up a new user. Requires user_id, name, password, address, and phone."""
    return str(call_tool("signup", {
        "user_id": user_id,
        "name": name,
        "password": password,
        "address": address,
        "phone": phone
    }))

@tool
def login_tool(user_id: str, password: str) -> str:
    """Log in an existing user. Requires user_id and password."""
    return str(call_tool("login", {
        "user_id": user_id,
        "password": password
    }))

@tool
def get_products_tool() -> str:
    """Get the list of all available products in the store. No parameters needed."""
    return str(call_tool("get_products", {}))

@tool
def add_to_cart_tool(user_id: str, product_id: int, quantity: int) -> str:
    """Add a product to the user's cart. Requires user_id, product_id (integer), and quantity."""
    return str(call_tool("add_to_cart", {
        "user_id": user_id,
        "product_id": product_id,
        "quantity": quantity
    }))

@tool
def view_cart_tool(user_id: str) -> str:
    """View the contents of the user's cart. Requires user_id."""
    return str(call_tool("view_cart", {"user_id": user_id}))

@tool
def get_cart_tool(user_id: str) -> str:
    """Fetch the cart of a specific user with product details and total. Requires user_id."""
    return str(call_tool("get_cart", {"user_id": user_id}))

@tool
def get_orders_tool(user_id: str) -> str:
    """Get all orders made by a specific user. Requires user_id."""
    return str(call_tool("get_orders", {"user_id": user_id}))

@tool
def checkout_tool(user_id: str) -> str:
    """Checkout and complete the purchase for the user. Requires user_id."""
    return str(call_tool("checkout", {"user_id": user_id}))