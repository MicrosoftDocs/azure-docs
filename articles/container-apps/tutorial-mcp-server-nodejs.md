---
title: 'Tutorial: Deploy a Node.js MCP server to Azure Container Apps'
description: Learn how to build and deploy a Node.js MCP server to Azure Container Apps and connect to it from GitHub Copilot Chat in Visual Studio Code.
#customer intent: As a developer, I want to deploy a Node.js MCP server as a container app so that I can expose custom tools and connect to them from GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/18/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Deploy a Node.js MCP server to Azure Container Apps

In this tutorial, you build a Model Context Protocol (MCP) server that exposes task-management tools by using Express and the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). You deploy the server to Azure Container Apps and connect to it from GitHub Copilot Chat in VS Code.

In this tutorial, you:

> [!div class="checklist"]
> - Create an Express app that exposes MCP tools
> - Test the MCP server locally with GitHub Copilot
> - Containerize and deploy the app to Azure Container Apps
> - Connect GitHub Copilot to the deployed MCP server

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- [Node.js 20 LTS](https://nodejs.org/) or later.
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional - only needed to test the container locally).

## Create the app scaffold

In this section, you create a new Node.js project with Express and the MCP TypeScript SDK.

1. Create the project directory and initialize it:

    ```bash
    mkdir tasks-mcp-server && cd tasks-mcp-server
    npm init -y
    ```

1. Install dependencies:

    ```bash
    npm install @modelcontextprotocol/sdk express zod
    npm install -D typescript @types/node @types/express tsx
    ```

1. Create `tsconfig.json`:

    ```json
    {
        "compilerOptions": {
            "target": "ES2022",
            "module": "Node16",
            "moduleResolution": "Node16",
            "outDir": "./dist",
            "rootDir": "./src",
            "strict": true,
            "esModuleInterop": true,
            "declaration": true
        },
        "include": ["src/**/*"]
    }
    ```

    This configuration targets ES2022 with Node.js module resolution, outputs compiled files to `dist/`, and enables strict type checking.

1. Update `package.json` to enable ES modules and add build and start scripts. Add or replace the `type` and `scripts` fields:

    ```json
    {
        "type": "module",
        "scripts": {
            "build": "tsc",
            "start": "node dist/index.js",
            "dev": "tsx watch src/index.ts"
        }
    }
    ```

    > [!IMPORTANT]
    > Set `"type": "module"`. The MCP server code uses top-level `await`, which is only supported in ES modules.

1. Create `src/taskStore.ts` for the in-memory data store:

    ```typescript
    export interface TaskItem {
        id: number;
        title: string;
        description: string;
        isComplete: boolean;
        createdAt: string;
    }

    class TaskStore {
        private tasks: TaskItem[] = [
            {
                id: 1,
                title: "Buy groceries",
                description: "Milk, eggs, bread",
                isComplete: false,
                createdAt: new Date().toISOString(),
            },
            {
                id: 2,
                title: "Write docs",
                description: "Draft the MCP tutorial",
                isComplete: true,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
        ];
        private nextId = 3;

        getAll(): TaskItem[] {
            return [...this.tasks];
        }

        getById(id: number): TaskItem | undefined {
            return this.tasks.find((t) => t.id === id);
        }

        create(title: string, description: string): TaskItem {
            const task: TaskItem = {
                id: this.nextId++,
                title,
                description,
                isComplete: false,
                createdAt: new Date().toISOString(),
            };
            this.tasks.push(task);
            return task;
        }

        toggleComplete(id: number): TaskItem | undefined {
            const task = this.tasks.find((t) => t.id === id);
            if (!task) return undefined;
            task.isComplete = !task.isComplete;
            return task;
        }

        delete(id: number): boolean {
            const index = this.tasks.findIndex((t) => t.id === id);
            if (index < 0) return false;
            this.tasks.splice(index, 1);
            return true;
        }
    }

    export const store = new TaskStore();
    ```

    The `TaskItem` interface defines the task data shape. The `TaskStore` class manages an in-memory array prepopulated with sample data and provides methods to list, find, create, toggle, and delete tasks. A module-level singleton is exported for use by the MCP tools.

## Define the MCP tools

Next, you define the MCP server with tool registrations that expose the task store to AI clients.

1. Create `src/index.ts`:

    ```typescript
    import express, { Request, Response } from "express";
    import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
    import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
    import { z } from "zod";
    import { store } from "./taskStore.js";
    
    const app = express();
    app.use(express.json());
    
    // Health endpoint for Container Apps probes
    app.get("/health", (_req: Request, res: Response) => {
        res.json({ status: "healthy" });
    });
    
    // Create the MCP server
    const mcpServer = new McpServer({
        name: "TasksMCP",
        version: "1.0.0",
    });
    
    // Register tools
    mcpServer.tool("list_tasks", "List all tasks with their ID, title, description, and completion status.", {}, async () => {
        return {
            content: [{ type: "text", text: JSON.stringify(store.getAll(), null, 2) }],
        };
    });
    
    mcpServer.tool(
        "get_task",
        "Get a single task by its numeric ID.",
        { task_id: z.number().describe("The numeric ID of the task to retrieve") },
        async ({ task_id }) => {
            const task = store.getById(task_id);
            return {
                content: [
                    {
                        type: "text",
                        text: task ? JSON.stringify(task, null, 2) : `Task with ID ${task_id} not found.`,
                    },
                ],
            };
        }
    );
    
    mcpServer.tool(
        "create_task",
        "Create a new task with the given title and description. Returns the created task.",
        {
            title: z.string().describe("A short title for the task"),
            description: z.string().describe("A detailed description of what the task involves"),
        },
        async ({ title, description }) => {
            const task = store.create(title, description);
            return {
                content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
            };
        }
    );
    
    mcpServer.tool(
        "toggle_task_complete",
        "Toggle a task's completion status between complete and incomplete.",
        { task_id: z.number().describe("The numeric ID of the task to toggle") },
        async ({ task_id }) => {
            const task = store.toggleComplete(task_id);
            const msg = task
                ? `Task ${task.id} is now ${task.isComplete ? "complete" : "incomplete"}.`
                : `Task with ID ${task_id} not found.`;
            return { content: [{ type: "text", text: msg }] };
        }
    );
    
    mcpServer.tool(
        "delete_task",
        "Delete a task by its numeric ID.",
        { task_id: z.number().describe("The numeric ID of the task to delete") },
        async ({ task_id }) => {
            const deleted = store.delete(task_id);
            const msg = deleted ? `Task ${task_id} deleted.` : `Task with ID ${task_id} not found.`;
            return { content: [{ type: "text", text: msg }] };
        }
    );
    
    // Mount the MCP streamable HTTP transport
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    
    app.post("/mcp", async (req: Request, res: Response) => {
        await transport.handleRequest(req, res, req.body);
    });
    
    app.get("/mcp", async (req: Request, res: Response) => {
        await transport.handleRequest(req, res);
    });
    
    app.delete("/mcp", async (req: Request, res: Response) => {
        await transport.handleRequest(req, res);
    });
    
    // Connect the transport to the MCP server
    await mcpServer.connect(transport);
    
    // Start the Express server
    const PORT = parseInt(process.env.PORT || "3000", 10);
    app.listen(PORT, () => {
        console.log(`MCP server running on http://localhost:${PORT}/mcp`);
    });
    ```

    Key points:
    - `McpServer` from the TypeScript SDK defines the MCP server with tool registrations.
    - `StreamableHTTPServerTransport` handles the MCP streamable HTTP protocol. Setting `sessionIdGenerator: undefined` runs the server in stateless mode.
    - Tools use [Zod](https://zod.dev/) schemas to define input parameters with descriptions.
    - A separate `/health` endpoint is required for Container Apps health probes.

## Test the MCP server locally

Before deploying to Azure, verify the MCP server works by running it locally and connecting from GitHub Copilot.

1. Start the development server:

    ```bash
    npx tsx src/index.ts
    ```

1. Open VS Code, open **Copilot Chat**, and select **Agent** mode.

1. Select the **Tools** button, and then select **Add More Tools...** > **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. Enter the server URL: `http://localhost:3000/mcp`

    > [!NOTE]
    > The local development server defaults to port 3000. When containerized, the Dockerfile sets the `PORT` environment variable to 8080 to match the Container Apps target port.

1. Enter a server ID: `tasks-mcp`

1. Select **Workspace Settings**.

1. Test with a prompt: **"Show me all tasks"**

1. Select **Continue** when Copilot requests tool invocation confirmation.

You should see Copilot return the list of tasks from your in-memory store.

> [!TIP]
> Try other prompts like "Create a task to review the PR", "Mark task 1 as complete", or "Delete task 2".

## Containerize the application

Package the application as a Docker container so you can test it locally before deploying to Azure.

1. Create a `Dockerfile`:

    ```dockerfile
    FROM node:20-slim AS build
    WORKDIR /app
    COPY package*.json .
    RUN npm ci
    COPY tsconfig.json .
    COPY src/ src/
    RUN npm run build

    FROM node:20-slim
    WORKDIR /app
    COPY package*.json .
    RUN npm ci --omit=dev
    COPY --from=build /app/dist ./dist
    ENV PORT=8080
    EXPOSE 8080
    CMD ["node", "dist/index.js"]
    ```

    The multi-stage build compiles TypeScript in the first stage, then creates a production image with only runtime dependencies and the compiled JavaScript output. The `PORT` environment variable is set to 8080 to match the Container Apps target port.

1. Verify locally:

    ```bash
    docker build -t tasks-mcp-server .
    docker run -p 8080:8080 tasks-mcp-server
    ```

    Confirm: `curl http://localhost:8080/health`

## Deploy to Azure Container Apps

After you containerize the application, deploy it to Azure Container Apps by using Azure CLI. The `az containerapp up` command builds the container image in the cloud, so you don't need Docker on your machine for this step.

1. Set environment variables:

    ```azurecli
    RESOURCE_GROUP="mcp-tutorial-rg"
    LOCATION="eastus"
    ENVIRONMENT_NAME="mcp-env"
    APP_NAME="tasks-mcp-server-node"
    ```

1. Create a resource group:

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create a Container Apps environment:

    ```azurecli
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

1. Configure CORS to allow GitHub Copilot requests:

    ```azurecli
    az containerapp ingress cors enable \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --allowed-origins "*" \
        --allowed-methods "GET,POST,DELETE,OPTIONS" \
        --allowed-headers "*"
    ```

    > [!NOTE]
    > For production, replace the wildcard `*` origins with specific trusted origins. See [Secure MCP servers on Container Apps](mcp-authentication.md) for guidance.

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

1. In your project, create or update `.vscode/mcp.json`:

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

1. If the server doesn't appear automatically, select the **Tools** button and verify `tasks-mcp-server` is listed. Select **Start** if needed.

1. Test with a prompt like **"List all my tasks"** to confirm the deployed MCP server responds.

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

- **Authentication and authorization**: Secure your MCP server by using Microsoft Entra ID. See [Secure MCP servers on Container Apps](mcp-authentication.md).
- **Input validation**: Zod schemas provide type safety, but add business-rule validation for tool parameters. Consider libraries like [zod-express-middleware](https://www.npmjs.com/package/zod-express-middleware) for request-level validation.
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
- [Deploy an MCP server to Container Apps (Python)](tutorial-mcp-server-python.md)
- [Deploy an MCP server to Container Apps (Java)](tutorial-mcp-server-java.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
