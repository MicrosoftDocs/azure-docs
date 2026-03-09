---
title: 'Tutorial: Deploy a .NET MCP server to Azure Container Apps'
description: Learn how to build and deploy a .NET MCP server to Azure Container Apps and connect to it from GitHub Copilot Chat in Visual Studio Code.
#customer intent: As a developer, I want to deploy a .NET MCP server as a container app so that I can expose custom tools and connect to them from GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/18/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Deploy a .NET MCP server to Azure Container Apps

In this tutorial, you build a Model Context Protocol (MCP) server that exposes task-management tools by using ASP.NET Core and the [ModelContextProtocol.AspNetCore](https://www.nuget.org/packages/ModelContextProtocol.AspNetCore) NuGet package. You deploy the server to Azure Container Apps and connect to it from GitHub Copilot Chat in VS Code.

In this tutorial, you:

> [!div class="checklist"]
> - Create an ASP.NET Core app that exposes MCP tools
> - Test the MCP server locally with GitHub Copilot
> - Containerize and deploy the app to Azure Container Apps
> - Connect GitHub Copilot to the deployed MCP server

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional - only needed to test the container locally).

## Create the app scaffold

In this section, you create a new ASP.NET Core project and configure it as an MCP server.

1. Create a new ASP.NET Core Web API project:

    ```bash
    dotnet new web -n TasksMcpServer
    cd TasksMcpServer
    ```

1. Add the MCP server NuGet package:

    ```dotnetcli
    dotnet add package ModelContextProtocol.AspNetCore --prerelease
    ```

1. Replace the contents of `Program.cs` with the following code:

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddMcpServer()
        .WithHttpTransport()
        .WithToolsFromAssembly();

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    builder.Services.AddSingleton<TaskStore>();

    var app = builder.Build();

    app.UseCors();

    app.MapGet("/health", () => Results.Ok("healthy"));
    app.MapMcp("/mcp");

    app.Run();
    ```

    Key points:
    - `AddMcpServer().WithHttpTransport().WithToolsFromAssembly()` registers the MCP server and discovers all classes marked with `[McpServerToolType]`.
    - `MapMcp("/mcp")` mounts the streamable HTTP endpoint at `/mcp`.
    - `AddSingleton<TaskStore>()` registers the in-memory data store you create in the next section.
    - You add a `/health` endpoint separately for Azure Container Apps health probes. MCP endpoints return JSON-RPC responses that aren't suitable as health checks.
    - You enable CORS because GitHub Copilot in VS Code makes cross-origin requests to MCP servers.

## Define the MCP tools

Next, define the task-management data store and the MCP tools that expose it to AI clients.

1. Create a file named `TaskStore.cs` for the in-memory data store:

    ```csharp
    namespace TasksMcpServer;

    public record TaskItem(int Id, string Title, string Description, bool IsComplete, DateTime CreatedAt);

    public class TaskStore
    {
        private readonly List<TaskItem> _tasks = new()
        {
            new(1, "Buy groceries", "Milk, eggs, bread", false, DateTime.UtcNow),
            new(2, "Write docs", "Draft the MCP tutorial", true, DateTime.UtcNow.AddDays(-1)),
        };

        private int _nextId = 3;

        public List<TaskItem> GetAll() => _tasks.ToList();

        public TaskItem? GetById(int id) => _tasks.FirstOrDefault(t => t.Id == id);

        public TaskItem Create(string title, string description)
        {
            var task = new TaskItem(_nextId++, title, description, false, DateTime.UtcNow);
            _tasks.Add(task);
            return task;
        }

        public TaskItem? ToggleComplete(int id)
        {
            var index = _tasks.FindIndex(t => t.Id == id);
            if (index < 0) return null;
            var old = _tasks[index];
            var updated = old with { IsComplete = !old.IsComplete };
            _tasks[index] = updated;
            return updated;
        }

        public bool Delete(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task is null) return false;
            _tasks.Remove(task);
            return true;
        }
    }
    ```

    The `TaskItem` record defines the data model with five properties. The `TaskStore` class manages an in-memory list prepopulated with sample data and provides methods to list, find, create, toggle, and delete tasks.

1. Create a file named `TasksMcpTools.cs` with the MCP tool definitions:

    ```csharp
    using System.ComponentModel;
    using ModelContextProtocol.Server;

    namespace TasksMcpServer;

    [McpServerToolType]
    public class TasksMcpTools
    {
        private readonly TaskStore _store;

        public TasksMcpTools(TaskStore store)
        {
            _store = store;
        }

        [McpServerTool, Description("Lists all tasks with their ID, title, description, and completion status.")]
        public List<TaskItem> ListTasks()
        {
            return _store.GetAll();
        }

        [McpServerTool, Description("Gets a single task by its ID.")]
        public TaskItem? GetTask(
            [Description("The numeric ID of the task to retrieve")] int id)
        {
            return _store.GetById(id);
        }

        [McpServerTool, Description("Creates a new task with the given title and description. Returns the created task.")]
        public TaskItem CreateTask(
            [Description("A short title for the task")] string title,
            [Description("A detailed description of what the task involves")] string description)
        {
            return _store.Create(title, description);
        }

        [McpServerTool, Description("Toggles a task's completion status between complete and incomplete.")]
        public string ToggleTaskComplete(
            [Description("The numeric ID of the task to toggle")] int id)
        {
            var task = _store.ToggleComplete(id);
            return task is not null
                ? $"Task {task.Id} is now {(task.IsComplete ? "complete" : "incomplete")}."
                : $"Task with ID {id} not found.";
        }

        [McpServerTool, Description("Deletes a task by its ID.")]
        public string DeleteTask(
            [Description("The numeric ID of the task to delete")] int id)
        {
            return _store.Delete(id)
                ? $"Task {id} deleted."
                : $"Task with ID {id} not found.";
        }
    }
    ```

    The `[McpServerToolType]` attribute marks the class as an MCP tool provider. Each `[McpServerTool]` method becomes an invocable tool. Use `[Description]` attributes to help the AI model understand each tool's purpose and parameters.

## Test the MCP server locally

Before deploying to Azure, verify the MCP server works by running it locally and connecting from GitHub Copilot.

1. Run the application:

    ```bash
    dotnet run
    ```

    The server starts on `http://localhost:5000` (or the port shown in the console output). The MCP endpoint is at `http://localhost:5000/mcp`.

1. Open VS Code, then open **Copilot Chat** and select **Agent** mode.

1. Select the **Tools** button, and then select **Add More Tools...** > **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. Enter the server URL: `http://localhost:5000/mcp`

1. Enter a server ID: `tasks-mcp`

1. Select **Workspace Settings**.

1. In a new Copilot Chat prompt, type: **"Show me all tasks"**

1. GitHub Copilot shows a confirmation before invoking the MCP tool. Select **Continue**.

You should see Copilot return the list of tasks from your in-memory store.

> [!TIP]
> Try other prompts like "Create a task to review the PR", "Mark task 1 as complete", or "Delete task 2".

## Containerize the application

Package the application as a Docker container so you can test it locally before deploying to Azure.

1. Create a `Dockerfile` in the project root:

    ```dockerfile
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /src
    COPY *.csproj .
    RUN dotnet restore
    COPY . .
    RUN dotnet publish -c Release -o /app

    FROM mcr.microsoft.com/dotnet/aspnet:8.0
    WORKDIR /app
    COPY --from=build /app .
    ENV ASPNETCORE_URLS=http://+:8080
    EXPOSE 8080
    ENTRYPOINT ["dotnet", "TasksMcpServer.dll"]
    ```

    The multi-stage build uses the SDK image to restore, build, and publish the app, then copies only the published output to a smaller ASP.NET runtime image. The `ASPNETCORE_URLS` environment variable configures the app to listen on port 8080.

1. Verify the container builds and runs locally:

    ```bash
    docker build -t tasks-mcp-server .
    docker run -p 8080:8080 tasks-mcp-server
    ```

    Confirm the health endpoint responds: `curl http://localhost:8080/health`

## Deploy to Azure Container Apps

After you containerize the application, deploy it to Azure Container Apps by using Azure CLI. The `az containerapp up` command builds the container image in the cloud, so you don't need Docker on your machine for this step.

1. Set environment variables:

    ```azurecli
    RESOURCE_GROUP="mcp-tutorial-rg"
    LOCATION="eastus"
    ENVIRONMENT_NAME="mcp-env"
    APP_NAME="tasks-mcp-server"
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
- **Input validation**: Always validate tool parameters. Use data annotations or FluentValidation in ASP.NET Core. See [Model validation in ASP.NET Core](/aspnet/core/mvc/models/validation).
- **HTTPS**: Azure Container Apps enforces HTTPS by default with automatic TLS certificates.
- **Least privilege**: Expose only the tools your use case requires. Avoid tools that perform destructive operations without confirmation.
- **CORS**: Restrict allowed origins to trusted domains in production.
- **Logging and monitoring**: Log MCP tool invocations for auditing. Use Azure Monitor and Log Analytics.

## Clean up resources

If you don't plan to continue using this application, delete the resource group to remove all the resources that you created in this tutorial:

```azurecli
az group delete --resource-group $RESOURCE_GROUP --yes --no-wait
```

## Next step

> [!div class="nextstepaction"]
> [Secure MCP servers on Container Apps](mcp-authentication.md)

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Deploy an MCP server to Container Apps (Python)](tutorial-mcp-server-python.md)
- [Deploy an MCP server to Container Apps (Node.js)](tutorial-mcp-server-nodejs.md)
- [Deploy an MCP server to Container Apps (Java)](tutorial-mcp-server-java.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
- [ModelContextProtocol.AspNetCore NuGet package](https://www.nuget.org/packages/ModelContextProtocol.AspNetCore)
- [MCP C# SDK](https://github.com/modelcontextprotocol/csharp-sdk)
