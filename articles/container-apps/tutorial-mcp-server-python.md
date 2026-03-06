---
title: 'Tutorial: Deploy a Python MCP server to Azure Container Apps'
description: Learn how to build and deploy a Python MCP server to Azure Container Apps and connect to it from GitHub Copilot Chat in Visual Studio Code.
#customer intent: As a developer, I want to deploy a Python MCP server as a container app so that I can expose custom tools and connect to them from GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Deploy a Python MCP server to Azure Container Apps

In this tutorial, you build a Model Context Protocol (MCP) server that exposes task-management tools by using FastAPI and the [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk). You deploy the server to Azure Container Apps and connect to it from GitHub Copilot Chat in VS Code.

In this tutorial, you:

> [!div class="checklist"]
> - Create a FastAPI app that exposes MCP tools
> - Test the MCP server locally with GitHub Copilot
> - Containerize and deploy the app to Azure Container Apps
> - Connect GitHub Copilot to the deployed MCP server

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- [Python 3.10](https://www.python.org/downloads/) or later.
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional - only needed to test the container locally).

## Create the app scaffold

In this section, you create a new Python project with FastAPI and the MCP Python SDK.

1. Create the project directory and set up a virtual environment:

    ```bash
    mkdir tasks-mcp-server && cd tasks-mcp-server
    python -m venv .venv
    source .venv/bin/activate
    ```

1. Create `requirements.txt`:

    ```text
    fastapi>=0.115.0
    uvicorn>=0.30.0
    mcp[cli]>=1.2.0
    ```

1. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

1. Create `task_store.py` for the in-memory data store:

    ```python
    from dataclasses import dataclass, field
    from datetime import datetime, timezone


    @dataclass
    class TaskItem:
        id: int
        title: str
        description: str
        is_complete: bool = False
        created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

        def to_dict(self) -> dict:
            return {
                "id": self.id,
                "title": self.title,
                "description": self.description,
                "is_complete": self.is_complete,
                "created_at": self.created_at.isoformat(),
            }


    class TaskStore:
        def __init__(self):
            self._tasks: list[TaskItem] = [
                TaskItem(1, "Buy groceries", "Milk, eggs, bread"),
                TaskItem(2, "Write docs", "Draft the MCP tutorial", True),
            ]
            self._next_id = 3

        def get_all(self) -> list[dict]:
            return [t.to_dict() for t in self._tasks]

        def get_by_id(self, task_id: int) -> dict | None:
            task = next((t for t in self._tasks if t.id == task_id), None)
            return task.to_dict() if task else None

        def create(self, title: str, description: str) -> dict:
            task = TaskItem(self._next_id, title, description)
            self._next_id += 1
            self._tasks.append(task)
            return task.to_dict()

        def toggle_complete(self, task_id: int) -> dict | None:
            task = next((t for t in self._tasks if t.id == task_id), None)
            if task is None:
                return None
            task.is_complete = not task.is_complete
            return task.to_dict()

        def delete(self, task_id: int) -> bool:
            task = next((t for t in self._tasks if t.id == task_id), None)
            if task is None:
                return False
            self._tasks.remove(task)
            return True


    # For demonstration only — not thread-safe.
    store = TaskStore()
    ```

    The `TaskItem` dataclass defines the data model with a `to_dict()` method for serialization. The `TaskStore` class manages an in-memory list prepopulated with sample data and provides CRUD methods. The module-level `store` singleton is shared across the application for simplicity.

## Define the MCP tools

In this section, you define the MCP tools that the AI model can invoke and mount the MCP server in your FastAPI application.

1. Create `mcp_server.py`:

    ```python
    from mcp.server.fastmcp import FastMCP
    from task_store import store

    mcp = FastMCP("TasksMCP", stateless_http=True)


    @mcp.tool()
    async def list_tasks() -> list[dict]:
        """List all tasks with their ID, title, description, and completion status."""
        return store.get_all()


    @mcp.tool()
    async def get_task(task_id: int) -> dict | None:
        """Get a single task by its numeric ID.

        Args:
            task_id: The numeric ID of the task to retrieve.
        """
        return store.get_by_id(task_id)


    @mcp.tool()
    async def create_task(title: str, description: str) -> dict:
        """Create a new task with the given title and description. Returns the created task.

        Args:
            title: A short title for the task.
            description: A detailed description of what the task involves.
        """
        return store.create(title, description)


    @mcp.tool()
    async def toggle_task_complete(task_id: int) -> str:
        """Toggle a task's completion status between complete and incomplete.

        Args:
            task_id: The numeric ID of the task to toggle.
        """
        task = store.toggle_complete(task_id)
        if task:
            status = "complete" if task["is_complete"] else "incomplete"
            return f"Task {task['id']} is now {status}."
        return f"Task with ID {task_id} not found."


    @mcp.tool()
    async def delete_task(task_id: int) -> str:
        """Delete a task by its numeric ID.

        Args:
            task_id: The numeric ID of the task to delete.
        """
        if store.delete(task_id):
            return f"Task {task_id} deleted."
        return f"Task with ID {task_id} not found."
    ```

    Key points:
    - `FastMCP("TasksMCP", stateless_http=True)` creates an MCP server using the stateless HTTP pattern in the Python SDK. The streamable HTTP endpoint defaults to the `/mcp` subpath.
    - Each `@mcp.tool()` function becomes an invocable tool. The function docstring and parameter annotations help the AI model understand how to use each tool.

1. Create `app.py`. This file defines the FastAPI application that mounts the MCP server:

    ```python
    from contextlib import AsyncExitStack, asynccontextmanager

    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    from mcp_server import mcp


    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with AsyncExitStack() as stack:
            await stack.enter_async_context(mcp.session_manager.run())
            yield


    app = FastAPI(lifespan=lifespan)
    app.mount("/", mcp.streamable_http_app())


    @app.get("/health")
    async def health():
        return JSONResponse({"status": "healthy"})
    ```

    The MCP server app mounts at the root (`/`). The SDK's streamable HTTP endpoint defaults to `/mcp`, so the full endpoint path is `/mcp`.

    A separate `/health` endpoint is used for Container Apps health probes. MCP endpoints expect JSON-RPC POST requests and aren't suitable as health checks.

## Test the MCP server locally

Before deploying to Azure, verify the MCP server works by running it locally and connecting from GitHub Copilot.

1. Start the application:

    ```bash
    uvicorn app:app --reload --port 8080
    ```

1. Open VS Code, then open **Copilot Chat** and select **Agent** mode.

1. Select the **Tools** button, and then select **Add More Tools...** > **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. Enter the server URL: `http://localhost:8080/mcp`

1. Enter a server ID: `tasks-mcp`

1. Select **Workspace Settings**.

1. In a new Copilot Chat prompt, type: **"Show me all tasks"**

1. Select **Continue** when Copilot prompts for MCP tool confirmation.

You should see the task list returned from your in-memory store.

> [!TIP]
> Try other prompts like "Create a task to review the PR", "Mark task 1 as complete", or "Delete task 2".

## Containerize the application

Package the application as a Docker container so you can test it locally before deploying to Azure.

1. Create a `Dockerfile`:

    ```dockerfile
    FROM python:3.12-slim

    WORKDIR /app

    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    COPY . .

    EXPOSE 8080
    CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
    ```

    The Dockerfile uses a Python 3.12 slim base image, installs dependencies from `requirements.txt`, then copies the application code. Uvicorn serves the FastAPI app on port 8080.

1. Verify the container builds and runs locally:

    ```bash
    docker build -t tasks-mcp-server .
    docker run -p 8080:8080 tasks-mcp-server
    ```

    Confirm the health endpoint responds: `curl http://localhost:8080/health`

## Deploy to Azure Container Apps

After you containerize the application, deploy it to Azure Container Apps by using the Azure CLI. The `az containerapp up` command builds the container image in the cloud, so you don't need Docker on your machine for this step.

1. Set environment variables:

    ```azurecli
    RESOURCE_GROUP="mcp-tutorial-rg"
    LOCATION="eastus"
    ENVIRONMENT_NAME="mcp-env"
    APP_NAME="tasks-mcp-server-py"
    ```

1. Create a resource group and Container Apps environment:

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION

    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
    ```

1. Deploy the container app:

    ```azurecli
    az containerapp up \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $ENVIRONMENT_NAME \
        --source . \
        --ingress external \
        --target-port 8080
    ```

1. Configure CORS:

    ```azurecli
    az containerapp ingress cors enable \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --allowed-origins "*" \
        --allowed-methods "GET,POST,DELETE,OPTIONS" \
        --allowed-headers "*"
    ```

    > [!NOTE]
    > For production, replace wildcard origins with specific trusted origins. See [Secure MCP servers on Container Apps](mcp-authentication.md).

1. Verify the deployment:

    ```azurecli
    APP_URL=$(az containerapp show \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query "properties.configuration.ingress.fqdn" -o tsv)

    curl https://$APP_URL/health
    ```

## Connect GitHub Copilot to the deployed server

Now that the MCP server is running in Azure, configure VS Code to connect GitHub Copilot to the deployed endpoint.

1. Create or update `.vscode/mcp.json`:

    ```json
    {
        "servers": {
            "tasks-mcp-server": {
                "type": "http",
                "url": "https://<your-app-fqdn>/mcp"
            }
        }
    }
    ```

    Replace `<your-app-fqdn>` with the FQDN from the deployment output.

1. In VS Code, open Copilot Chat in Agent mode.

1. Verify `tasks-mcp-server` appears in the Tools list. Select **Start** if needed.

1. Test with a prompt like **"Create a task to deploy the staging environment"**.

## Configure scaling for interactive use

By default, Azure Container Apps can scale to zero replicas. For MCP servers that serve interactive clients like Copilot, cold starts cause noticeable delays. Set a minimum replica count to keep at least one instance running:

```azurecli
az containerapp update \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --min-replicas 1
```

## Security considerations

This tutorial uses an unauthenticated MCP server for simplicity. Before running an MCP server in production, review the following recommendations. When an agent powered by large language models (LLMs) calls your MCP server, be aware of [prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) attacks.

- **Authentication and authorization**: Secure your MCP server with Microsoft Entra ID. See [Secure MCP servers on Container Apps](mcp-authentication.md).
- **Input validation**: Always validate tool parameters. Use [Pydantic](https://docs.pydantic.dev/) to enforce data validation on tool inputs.
- **HTTPS**: Azure Container Apps enforces HTTPS by default with automatic TLS certificates.
- **Least privilege**: Expose only the tools your use case requires. Avoid tools that perform destructive operations without confirmation.
- **CORS**: Restrict allowed origins to trusted domains in production.
- **Logging and monitoring**: Log MCP tool invocations for auditing. Use Azure Monitor and Log Analytics.

## Clean up resources

If you don't plan to continue using this application, delete the resource group to remove all the resources you created in this tutorial:

```azurecli
az group delete --resource-group $RESOURCE_GROUP --yes --no-wait
```

## Next step

> [!div class="nextstepaction"]
> [Secure MCP servers on Container Apps](mcp-authentication.md)

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Deploy an MCP server to Container Apps (.NET)](tutorial-mcp-server-dotnet.md)
- [Deploy an MCP server to Container Apps (Node.js)](tutorial-mcp-server-nodejs.md)
- [Deploy an MCP server to Container Apps (Java)](tutorial-mcp-server-java.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
