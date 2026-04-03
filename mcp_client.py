# mcp_client.py

import requests

MCP_URL = "http://localhost:8000/mcp"

def call_tool(tool, args):
    try:
        res = requests.post(MCP_URL, json={
            "tool": tool,
            "args": args
        })
        if res.status_code != 200:
            return {"error": f"Server error: {res.status_code}", "detail": res.text}
        return res.json().get("result", res.json())
    except requests.exceptions.ConnectionError:
        return {"error": "MCP server not running. Start it with: python mcp_server.py"}
    except Exception as e:
        return {"error": str(e)}