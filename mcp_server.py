# mcp_server.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Shopping MCP Server", description="MCP Server with REST APIs for Shopping App")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

products = {
    1: {"name": "iPhone", "price": 80000},
    2: {"name": "Laptop", "price": 60000},
    3: {"name": "Headphones", "price": 3000}
}

# Dummy user data
user_info = {
    "john123": {
        "name": "John Doe",
        "password": "pass123",
        "address": "123 Main Street, New York, NY 10001",
        "phone": "9876543210"
    },
    "jane456": {
        "name": "Jane Smith",
        "password": "jane@123",
        "address": "456 Oak Avenue, Los Angeles, CA 90001",
        "phone": "8765432109"
    },
    "bob789": {
        "name": "Bob Wilson",
        "password": "bob2024",
        "address": "789 Pine Road, Chicago, IL 60601",
        "phone": "7654321098"
    }
}

# Dummy cart data
carts_per_user = {
    "john123": [
        {"product_id": 1, "quantity": 1},
        {"product_id": 3, "quantity": 2}
    ],
    "jane456": [
        {"product_id": 2, "quantity": 1}
    ]
    # bob789 has an empty cart
}

# Dummy orders data
orders = {
    "john123": [
        {
            "order_details": [
                {"product_id": 2, "quantity": 1}
            ],
            "status": "PLACED_COD"
        }
    ],
    "bob789": [
        {
            "order_details": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 3, "quantity": 1}
            ],
            "status": "PLACED_COD"
        },
        {
            "order_details": [
                {"product_id": 2, "quantity": 1}
            ],
            "status": "PLACED_COD"
        }
    ]
    # jane456 has no orders yet
}

TOOLS = {}

def tool(name):
    def decorator(func):
        TOOLS[name] = func
        return func
    return decorator

@tool("signup")
def signup(user_id, name, password, address, phone):
    if user_id in user_info:
        return {"error": "User exists"}
    user_info[user_id] = {
        "name": name,
        "password": password,
        "address": address,
        "phone": phone
    }
    return {"message": "Signup successful"}

@tool("login")
def login(user_id, password):
    user = user_info.get(user_id)
    if not user or user["password"] != password:
        return {"error": "Invalid credentials"}
    return {"message": "Login successful"}

@tool("get_products")
def get_products():
    return products

@tool("add_to_cart")
def add_to_cart(user_id, product_id, quantity):
    carts_per_user.setdefault(user_id, []).append({
        "product_id": product_id,
        "quantity": quantity
    })
    return {"message": "Added to cart"}

@tool("view_cart")
def view_cart(user_id):
    return carts_per_user.get(user_id, [])

@tool("get_cart")
def get_cart(user_id):
    """Fetch the cart of a specific user"""
    cart = carts_per_user.get(user_id, [])
    if not cart:
        return {"message": "Cart is empty", "cart": []}
    # Enrich cart with product details
    enriched_cart = []
    for item in cart:
        product = products.get(item["product_id"])
        if product:
            enriched_cart.append({
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"],
                "subtotal": product["price"] * item["quantity"]
            })
    total = sum(item["subtotal"] for item in enriched_cart)
    return {"cart": enriched_cart, "total": total}

@tool("get_orders")
def get_orders(user_id):
    """Get all orders made by a specific user"""
    user_orders = orders.get(user_id, [])
    if not user_orders:
        return {"message": "No orders found", "orders": []}
    return {"orders": user_orders, "total_orders": len(user_orders)}

@tool("checkout")
def checkout(user_id):
    cart = carts_per_user.get(user_id, [])
    if not cart:
        return {"message": "Cart empty"}
    order = {"order_details": cart, "status": "PLACED_COD"}
    orders.setdefault(user_id, []).append(order)
    carts_per_user[user_id] = []
    return {"message": "Order placed", "order": order}

class MCPRequest(BaseModel):
    tool: str
    args: dict

@app.post("/mcp")
def handle_mcp(req: MCPRequest):
    func = TOOLS.get(req.tool)
    if not func:
        return {"error": "Tool not found"}
    return {"result": func(**req.args)}


# ========================================
# PYDANTIC MODELS FOR REST APIs
# ========================================

class ProductModel(BaseModel):
    name: str
    price: int

class ProductCreateModel(BaseModel):
    product_id: int
    name: str
    price: int

class UserModel(BaseModel):
    name: str
    password: str
    address: str
    phone: str

class UserCreateModel(BaseModel):
    user_id: str
    name: str
    password: str
    address: str
    phone: str

class CartItemModel(BaseModel):
    product_id: int
    quantity: int

class OrderModel(BaseModel):
    order_details: List[CartItemModel]
    status: str = "PLACED_COD"


# ========================================
# REST APIs - PRODUCTS
# ========================================

@app.get("/api/products")
def api_get_all_products():
    """Get all products"""
    return {"products": products}

@app.get("/api/products/{product_id}")
def api_get_product(product_id: int):
    """Get a specific product by ID"""
    if product_id not in products:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product_id": product_id, **products[product_id]}

@app.post("/api/products")
def api_create_product(product: ProductCreateModel):
    """Create a new product"""
    if product.product_id in products:
        raise HTTPException(status_code=400, detail="Product already exists")
    products[product.product_id] = {"name": product.name, "price": product.price}
    return {"message": "Product created", "product_id": product.product_id, **products[product.product_id]}

@app.put("/api/products/{product_id}")
def api_update_product(product_id: int, product: ProductModel):
    """Update an existing product"""
    if product_id not in products:
        raise HTTPException(status_code=404, detail="Product not found")
    products[product_id] = {"name": product.name, "price": product.price}
    return {"message": "Product updated", "product_id": product_id, **products[product_id]}

@app.delete("/api/products/{product_id}")
def api_delete_product(product_id: int):
    """Delete a product"""
    if product_id not in products:
        raise HTTPException(status_code=404, detail="Product not found")
    deleted = products.pop(product_id)
    return {"message": "Product deleted", "product_id": product_id, **deleted}


# ========================================
# REST APIs - USERS
# ========================================

@app.get("/api/users")
def api_get_all_users():
    """Get all users (passwords hidden)"""
    safe_users = {uid: {k: v for k, v in info.items() if k != "password"} for uid, info in user_info.items()}
    return {"users": safe_users}

@app.get("/api/users/{user_id}")
def api_get_user(user_id: str):
    """Get a specific user by ID (password hidden)"""
    if user_id not in user_info:
        raise HTTPException(status_code=404, detail="User not found")
    safe_user = {k: v for k, v in user_info[user_id].items() if k != "password"}
    return {"user_id": user_id, **safe_user}

@app.post("/api/users")
def api_create_user(user: UserCreateModel):
    """Create a new user"""
    if user.user_id in user_info:
        raise HTTPException(status_code=400, detail="User already exists")
    user_info[user.user_id] = {
        "name": user.name,
        "password": user.password,
        "address": user.address,
        "phone": user.phone
    }
    return {"message": "User created", "user_id": user.user_id}

@app.put("/api/users/{user_id}")
def api_update_user(user_id: str, user: UserModel):
    """Update an existing user"""
    if user_id not in user_info:
        raise HTTPException(status_code=404, detail="User not found")
    user_info[user_id] = {
        "name": user.name,
        "password": user.password,
        "address": user.address,
        "phone": user.phone
    }
    return {"message": "User updated", "user_id": user_id}

@app.delete("/api/users/{user_id}")
def api_delete_user(user_id: str):
    """Delete a user"""
    if user_id not in user_info:
        raise HTTPException(status_code=404, detail="User not found")
    user_info.pop(user_id)
    # Also clean up their cart and orders
    carts_per_user.pop(user_id, None)
    orders.pop(user_id, None)
    return {"message": "User deleted", "user_id": user_id}


# ========================================
# REST APIs - CARTS
# ========================================

@app.get("/api/carts")
def api_get_all_carts():
    """Get all carts"""
    return {"carts": carts_per_user}

@app.get("/api/carts/{user_id}")
def api_get_cart(user_id: str):
    """Get cart for a specific user"""
    cart = carts_per_user.get(user_id, [])
    # Enrich with product details
    enriched_cart = []
    total = 0
    for item in cart:
        product = products.get(item["product_id"])
        if product:
            subtotal = product["price"] * item["quantity"]
            enriched_cart.append({
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"],
                "subtotal": subtotal
            })
            total += subtotal
    return {"user_id": user_id, "cart": enriched_cart, "total": total}

@app.post("/api/carts/{user_id}")
def api_add_to_cart(user_id: str, item: CartItemModel):
    """Add item to user's cart"""
    if item.product_id not in products:
        raise HTTPException(status_code=404, detail="Product not found")
    carts_per_user.setdefault(user_id, []).append({
        "product_id": item.product_id,
        "quantity": item.quantity
    })
    return {"message": "Item added to cart", "user_id": user_id}

@app.put("/api/carts/{user_id}")
def api_update_cart(user_id: str, cart: List[CartItemModel]):
    """Replace entire cart for a user"""
    carts_per_user[user_id] = [{"product_id": item.product_id, "quantity": item.quantity} for item in cart]
    return {"message": "Cart updated", "user_id": user_id}

@app.delete("/api/carts/{user_id}")
def api_clear_cart(user_id: str):
    """Clear user's cart"""
    carts_per_user[user_id] = []
    return {"message": "Cart cleared", "user_id": user_id}

@app.delete("/api/carts/{user_id}/{product_id}")
def api_remove_from_cart(user_id: str, product_id: int):
    """Remove a specific product from user's cart"""
    if user_id not in carts_per_user:
        raise HTTPException(status_code=404, detail="Cart not found")
    original_len = len(carts_per_user[user_id])
    carts_per_user[user_id] = [item for item in carts_per_user[user_id] if item["product_id"] != product_id]
    if len(carts_per_user[user_id]) == original_len:
        raise HTTPException(status_code=404, detail="Product not in cart")
    return {"message": "Item removed from cart", "user_id": user_id, "product_id": product_id}


# ========================================
# REST APIs - ORDERS
# ========================================

@app.get("/api/orders")
def api_get_all_orders():
    """Get all orders"""
    return {"orders": orders}

@app.get("/api/orders/{user_id}")
def api_get_user_orders(user_id: str):
    """Get all orders for a specific user"""
    user_orders = orders.get(user_id, [])
    return {"user_id": user_id, "orders": user_orders, "total_orders": len(user_orders)}

@app.post("/api/orders/{user_id}")
def api_create_order(user_id: str, order: Optional[OrderModel] = None):
    """Create an order (from cart if no order body provided)"""
    if order:
        # Create order from provided data
        new_order = {
            "order_details": [{"product_id": item.product_id, "quantity": item.quantity} for item in order.order_details],
            "status": order.status
        }
    else:
        # Create order from cart
        cart = carts_per_user.get(user_id, [])
        if not cart:
            raise HTTPException(status_code=400, detail="Cart is empty")
        new_order = {"order_details": cart, "status": "PLACED_COD"}
        carts_per_user[user_id] = []  # Clear cart after checkout
    
    orders.setdefault(user_id, []).append(new_order)
    return {"message": "Order created", "user_id": user_id, "order": new_order}

@app.delete("/api/orders/{user_id}")
def api_delete_all_user_orders(user_id: str):
    """Delete all orders for a user"""
    if user_id not in orders:
        raise HTTPException(status_code=404, detail="No orders found for user")
    deleted_count = len(orders[user_id])
    orders[user_id] = []
    return {"message": f"Deleted {deleted_count} orders", "user_id": user_id}

@app.delete("/api/orders/{user_id}/{order_index}")
def api_delete_order(user_id: str, order_index: int):
    """Delete a specific order by index"""
    if user_id not in orders or order_index >= len(orders[user_id]):
        raise HTTPException(status_code=404, detail="Order not found")
    deleted = orders[user_id].pop(order_index)
    return {"message": "Order deleted", "user_id": user_id, "order": deleted}