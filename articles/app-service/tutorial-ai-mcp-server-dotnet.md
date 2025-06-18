---
title: Web app as MCP server in GitHub Copilot Chat agent mode
description: Empower GitHub Copilot Chat with your existing web apps by integrating their capabilities as Model Context Protocol servers, enabling Copilot Chat to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 06/17/2025
ms.topic: tutorial
ms.custom:
  - devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
---

# Integrate an App Service app as an MCP Server for GitHub Copilot Chat (.NET)

In this tutorial, you'll learn how to expose your app's functionality through Model Context Protocol (MCP), add it as a tool to GitHub Copilot, and interact with your app using natural language in Copilot Chat agent mode.

:::image type="content" source="media/tutorial-ai-mcp-server-dotnet/mcp-call-intro.png" alt-text="Screenshot showing GitHub Copilot calling Todos MCP server hosted in Azure App Service.":::

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available for:

- Any [application that supports MCP integration](https://modelcontextprotocol.io/clients), such as GitHub Copilot Chat agent mode in Visual Studio Code or in GitHub Codespaces. 
- A custom agent that accesses remote tools by using an [MCP client](https://modelcontextprotocol.io/quickstart/client#c).

By adding an MCP server to your web app, you enable an agent to understand and use your app's capabilities when it responds to user prompts. This means anything your app can do, the agent can do too.

> [!div class="checklist"]
> * Add an MCP server to your web app.
> * Test the MCP server locally in GitHub Copilot Chat agent mode.
> * Deploy the MCP server to Azure App Service and connect to it in GitHub Copilot Chat.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Deploy an ASP.NET Core and Azure SQL Database app to Azure App Service](tutorial-dotnetcore-sqldb-app.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore) in GitHub Codespaces and deploy the app by running `azd up`.

## Add MCP server to your web app

1. In the codespace terminal, add the NuGet `ModelContextProtocol.AspNetCore` package to your project:

    ```dotnetcli
    dotnet add package ModelContextProtocol.AspNetCore --prerelease
    ```
    
1. Create an McpServer folder, and create a *TodosMcpTool.cs* in it with the following code.

    ```csharp
    using DotNetCoreSqlDb.Data;
    using DotNetCoreSqlDb.Models;
    using Microsoft.EntityFrameworkCore;
    using System.ComponentModel;
    using ModelContextProtocol.Server;
    
    namespace DotNetCoreSqlDb.McpServer
    {
        [McpServerToolType]
        public class TodosMcpTool
        {
            private readonly MyDatabaseContext _db;
    
            public TodosMcpTool(MyDatabaseContext db)
            {
                _db = db;
            }
    
            [McpServerTool, Description("Creates a new todo with a description and creation date.")]
            public async Task<string> CreateTodoAsync(
                [Description("Description of the todo")] string description,
                [Description("Creation date of the todo")] DateTime createdDate)
            {
                var todo = new Todo
                {
                    Description = description,
                    CreatedDate = createdDate
                };
                _db.Todo.Add(todo);
                await _db.SaveChangesAsync();
                return $"Todo created: {todo.Description} (Id: {todo.ID})";
            }
    
            [McpServerTool, Description("Reads all todos, or a single todo if an id is provided.")]
            public async Task<List<Todo>> ReadTodosAsync(
                [Description("Id of the todo to read (optional)")] string? id = null)
            {
                if (!string.IsNullOrWhiteSpace(id) && int.TryParse(id, out int todoId))
                {
                    var todo = await _db.Todo.FindAsync(todoId);
                    if (todo == null) return new List<Todo>();
                    return new List<Todo> { todo };
                }
                var todos = await _db.Todo.OrderBy(t => t.ID).ToListAsync();
                return todos;
            }
    
            [McpServerTool, Description("Updates the specified todo fields by id.")]
            public async Task<string> UpdateTodoAsync(
                [Description("Id of the todo to update")] string id,
                [Description("New description (optional)")] string? description = null,
                [Description("New creation date (optional)")] DateTime? createdDate = null)
            {
                if (!int.TryParse(id, out int todoId))
                    return "Invalid todo id.";
                var todo = await _db.Todo.FindAsync(todoId);
                if (todo == null) return $"Todo with Id {todoId} not found.";
                if (!string.IsNullOrWhiteSpace(description)) todo.Description = description;
                if (createdDate.HasValue) todo.CreatedDate = createdDate.Value;
                await _db.SaveChangesAsync();
                return $"Todo {todo.ID} updated.";
            }
    
            [McpServerTool, Description("Deletes a todo by id.")]
            public async Task<string> DeleteTodoAsync(
                [Description("Id of the todo to delete")] string id)
            {
                if (!int.TryParse(id, out int todoId))
                    return "Invalid todo id.";
                var todo = await _db.Todo.FindAsync(todoId);
                if (todo == null) return $"Todo with Id {todoId} not found.";
                _db.Todo.Remove(todo);
                await _db.SaveChangesAsync();
                return $"Todo {todo.ID} deleted.";
            }
        }
    }
    ```

    The code above makes tools available for the MCP server by using the following specific attributes:

    - `[McpServerToolType]`: Marks the `TodosMcpTool` class as an MCP server tool type. It signals to the MCP framework that this class contains methods that should be exposed as callable tools.
    - `[McpServerTool]`: Marks a method as a callable action for the MCP server.
    - `[Description]`: These provide human-readable descriptions for methods and parameters. It helps the calling agent to understand how to use the actions and their parameters.
    
    This code is duplicating the functionality of the existing `TodosController`, which is unnecessary, but you'll keep it for simplicity. A best practice would be to move the app logic to a service class, then call the service methods both from `TodosController` and from `TodosMcpTool`.

1. In *Program.cs*, register the MCP server service and the CORS service. 

    ```csharp
    builder.Services.AddMcpServer()
        .WithHttpTransport() // With streamable HTTP
        .WithToolsFromAssembly(); // Add all classes marked with [McpServerToolType]
    
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
    ```

    When you [use streamable HTTP with the MCP server](https://mcp-framework.com/docs/Transports/http-stream-transport/), you need to enable Cross-Origin Resource Sharing (CORS) if you want to test it with client browser tools or GitHub Copilot (both in Visual Studio Code and in GitHub Codespaces).

1. In *Program.cs*, enable the MCP and CORS middleware.

    ```csharp
    app.MapMcp("/api/mcp");
    app.UseCors();
    ```

    This code sets your MCP server endpoint to `<url>/api/mcp`.

## Test the MCP server locally
    
1. In the codespace terminal, run the application with `dotnet run`.

1. Select **Open in Browser**, then add a tasks. 

    Leave `dotnet run` running. Your MCP server is running at `http://localhost:5093/api/mcp` now.

1. Back in the codespace, open Copilot Chat, then select **Agent** mode in the prompt box.

1. Select the **Tools** button, then select **Add More Tools...** in the dropdown.

    :::image type="content" source="media/tutorial-ai-mcp-server-dotnet/add-mcp-tool.png" alt-text="Screenshot showing how to add an MCP server in GitHub Copilot Chat agent mode.":::

1. Select **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. In **Enter Server URL**, type *http://localhost:5093/api/mcp*.

1. In **Enter Server ID**, type *todos-mcp* or any name you like.

1. Select **Workspace Settings**.

1. In a new Copilot Chat window, type something like *"Show me the todos."*

1. By default, GitHub Copilot shows you a security confirmation when you invoke an MCP server. Select **Continue**.

    :::image type="content" source="media/tutorial-ai-mcp-server-dotnet/mcp-call-confirmation.png" alt-text="Screenshot showing the default security message from an MCP invocation in GitHub Copilot Chat.":::

    You should now see a response that indicates that the MCP tool call is successful.

    :::image type="content" source="media/tutorial-ai-mcp-server-dotnet/mcp-call-success.png" alt-text="Screenshot showing that the response from the MCP tool call in the GitHub Copilot Chat window.":::

## Deploy your MCP server to App Service

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. In the AZD output, find the URL of your app. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;app-url>
    </pre>

1. Once `azd up` finishes, open *.vscode/mcp.json*. Change the URL to `<app-url>/api/mcp`. 

1. Above your modified MCP server configuration, select **Start**.

    :::image type="content" source="media/tutorial-ai-mcp-server-dotnet/mcp-server-start.png" alt-text="Screenshot showing how to manually start an MCP server from the local mcp.json file.":::

1. Start a new GitHub Copilot Chat window. You should be able to view, create, update, and delete tasks in the Copilot agent.

    > [!TIP]
    > You can deactivate the confirmation message by adding a *.vscode/settings.json* with the following JSON:
    >
    > ```json
    > {
    >     "chat.tools.autoApprove": true
    > }
    > ```
    
## More resources

[Integrate AI into your Azure App Service applications](overview-ai-integration.md)