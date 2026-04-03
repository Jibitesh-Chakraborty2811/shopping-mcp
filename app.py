# app.py

import streamlit as st
import uuid
from agent import agent

st.title("🛒 MCP Shopping Assistant (With Memory)")

# ------------------------
# SESSION STATE
# ------------------------

if "messages" not in st.session_state:
    st.session_state.messages = []

# Generate a unique thread_id for each browser session
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(uuid.uuid4())

if "user_id" not in st.session_state:
    st.session_state.user_id = None

# ------------------------
# DISPLAY EXISTING CHAT FIRST
# ------------------------

for role, msg in st.session_state.messages:
    with st.chat_message(role):
        st.write(msg)

# ------------------------
# CHAT INPUT
# ------------------------

user_input = st.chat_input("Ask something...")

if user_input:
    # Display user message immediately
    st.session_state.messages.append(("user", user_input))
    with st.chat_message("user"):
        st.write(user_input)

    context = f"""
    Current user_id: {st.session_state.user_id}
    User says: {user_input}
    """

    # Show a spinner while waiting for response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                response = agent.invoke(
                    {"messages": [{"role": "user", "content": context}]},
                    {"configurable": {"thread_id": st.session_state.thread_id}}
                )

                # Extract the output from the response
                output = response["messages"][-1].content

                # crude login detection
                if "Login successful" in output:
                    # Extract user_id from previous message (simple approach)
                    if "user" in user_input:
                        st.session_state.user_id = user_input.split()[-1]

                st.session_state.messages.append(("assistant", output))
                st.write(output)

            except Exception as e:
                error_msg = f"❌ Error: {str(e)}"
                st.session_state.messages.append(("assistant", error_msg))
                st.error(error_msg)