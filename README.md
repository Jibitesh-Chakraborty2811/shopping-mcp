# Shopping MCP Application

A full-stack shopping application with an AI-powered chat assistant using Model Context Protocol (MCP).

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │     │  Streamlit App  │     │   MCP Server    │
│   (Frontend)    │────▶│  (AI Assistant) │────▶│   (Backend)     │
│   Port: 5173    │     │   Port: 8501    │     │   Port: 8000    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **MCP Server (FastAPI)**: Backend server with MCP tools and REST APIs
- **Streamlit App**: AI chat assistant using LangChain agent
- **React App**: Modern shopping frontend with product catalog, cart, and orders

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

## Setup Instructions

### Step 1: Create and Activate Virtual Environment

```bash
# Navigate to project directory
cd /Users/I528974/Desktop/dissertation/shopping-mcp

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Step 2: Install Python Dependencies

```bash
# With virtual environment activated
pip install fastapi uvicorn streamlit langchain langgraph langchain-openai pydantic requests
```

### Step 3: Install React App Dependencies

```bash
cd frontend
npm install
cd ..
```

## Running the Application

You need to run **3 separate terminals** for the full application.

---

### Terminal 1: Run MCP Server (Backend)

```bash
cd /Users/I528974/Desktop/dissertation/shopping-mcp
source venv/bin/activate
uvicorn mcp_server:app --reload --port 8000
```

The MCP server will be available at: `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- MCP Endpoint: `POST http://localhost:8000/mcp`
- REST APIs: `http://localhost:8000/api/*`

---

### Terminal 2: Run Streamlit App (AI Assistant)

```bash
cd /Users/I528974/Desktop/dissertation/shopping-mcp
source venv/bin/activate
streamlit run app.py
```

The Streamlit app will be available at: `http://localhost:8501`

---

### Terminal 3: Run React App (Frontend)

```bash
cd /Users/I528974/Desktop/dissertation/shopping-mcp/frontend
npm run dev
```

The React app will be available at: `http://localhost:5173`

---

## Demo Accounts

| Username | Password  | Description |
|----------|-----------|-------------|
| john123  | pass123   | Has items in cart and 1 order |
| jane456  | jane@123  | Has items in cart, no orders |
| bob789   | bob2024   | Empty cart, 2 orders |

## Features

### React App
- 🔐 Login/Signup
- 🛍️ Browse products
- 🛒 Add to cart with quantity
- 📦 Place orders (COD)
- 📋 View order history
- 💬 Chat with AI assistant (popup modal)

### AI Assistant (Streamlit)
- Natural language shopping assistance
- Browse products
- Add items to cart
- Checkout orders
- View cart and orders

## API Endpoints

### MCP Endpoint
```
POST /mcp
Body: { "tool": "tool_name", "args": { ... } }
```

### REST APIs

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Carts
- `GET /api/carts` - Get all carts
- `GET /api/carts/{user_id}` - Get user's cart
- `POST /api/carts/{user_id}` - Add item to cart
- `PUT /api/carts/{user_id}` - Update cart
- `DELETE /api/carts/{user_id}` - Clear cart
- `DELETE /api/carts/{user_id}/{product_id}` - Remove item

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{user_id}` - Get user's orders
- `POST /api/orders/{user_id}` - Create order
- `DELETE /api/orders/{user_id}` - Delete all user orders
- `DELETE /api/orders/{user_id}/{index}` - Delete specific order

## Project Structure

```
shopping-mcp/
├── mcp_server.py      # FastAPI backend with MCP tools & REST APIs
├── agent.py           # LangChain agent configuration
├── tools.py           # LangChain tool definitions
├── mcp_client.py      # HTTP client for MCP server
├── app.py             # Streamlit chat interface
├── requirements.txt   # Python dependencies (optional)
├── README.md          # This file
└── frontend/          # React application
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── hooks/
    ├── package.json
    └── vite.config.js
```

## Troubleshooting

### CORS Issues
The MCP server has CORS enabled for all origins. If you still face issues, try a hard refresh (`Cmd+Shift+R` on Mac).

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :8000  # or :8501, :5173
kill -9 <PID>
```

### Module Not Found
Make sure you've activated the virtual environment:
```bash
source venv/bin/activate
```

## Quick Start (All Commands)

```bash
# Terminal 1 - Backend
cd /Users/I528974/Desktop/dissertation/shopping-mcp && source venv/bin/activate && uvicorn mcp_server:app --reload --port 8000

# Terminal 2 - AI Assistant
cd /Users/I528974/Desktop/dissertation/shopping-mcp && source venv/bin/activate && streamlit run app.py

# Terminal 3 - Frontend
cd /Users/I528974/Desktop/dissertation/shopping-mcp/frontend && npm run dev
```

## License

MIT
