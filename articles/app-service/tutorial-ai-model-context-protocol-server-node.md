---
title: Web app as MCP server in GitHub Copilot Chat agent mode (Node.js)
description: Empower GitHub Copilot Chat with your existing Node.js web apps by integrating their capabilities as Model Context Protocol servers, enabling Copilot Chat to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 11/10/2025
ms.topic: tutorial
ms.custom:
  - devx-track-javascript
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.service: azure-app-service
---

# Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Node.js)

In this tutorial, you'll learn how to expose an Express.js app's functionality through Model Context Protocol (MCP), add it as a tool to GitHub Copilot, and interact with your app using natural language in Copilot Chat agent mode.

:::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-intro.png" alt-text="Screenshot showing GitHub Copilot calling Todos MCP server hosted in Azure App Service.":::

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available for:

- Any [application that supports MCP integration](https://modelcontextprotocol.io/clients), such as GitHub Copilot Chat agent mode in Visual Studio Code or in GitHub Codespaces. 
- A custom agent that accesses remote tools by using an [MCP client](https://modelcontextprotocol.io/quickstart/client#node).

By adding an MCP server to your web app, you enable an agent to understand and use your app's capabilities when it responds to user prompts. This means anything your app can do, the agent can do too.

> [!div class="checklist"]
> * Add an MCP server to your web app.
> * Test the MCP server locally in GitHub Copilot Chat agent mode.
> * Deploy the MCP server to Azure App Service and connect to it in GitHub Copilot Chat.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Deploy a Node.js + MongoDB web app to Azure](tutorial-nodejs-mongodb-app.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app) in GitHub Codespaces and deploy the app by running `azd up`.

## Add MCP server to your web app

1. In the codespace terminal, add the required npm packages to your project:

    ```bash
    npm install @modelcontextprotocol/sdk@latest zod
    ```
    
1. 1. Open *routes/index.js*. For simplicity of the scenario, you'll add all of your MCP server code here.

1. At the top of *routes/index.js*, add the following requires: 

    ```javascript
    const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
    const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
    const { z } = require('zod');
    ```
    

1. At the bottom of the file, above `module.exports = router;` add the following route for the MCP server. 

    ```javascript
    router.post('/api/mcp', async function(req, res, next) {
      try {
        // Stateless server instance for each request
        const server = new McpServer({
          name: "task-crud-server", 
          version: "1.0.0"
        });
    
        // Register tools
        server.registerTool(
          "create_task",
          {
            description: 'Create a new task',
            inputSchema: { taskName: z.string().describe('Name of the task to create') },
          },
          async ({ taskName }) => {
            const task = new Task({
              taskName: taskName,
              createDate: new Date(),
            });
            await task.save();
            return { content: [ { type: 'text', text: `Task created: ${JSON.stringify(task)}` } ] };
          }
        );
    
        server.registerTool(
          "get_tasks",
          {
            description: 'Get all tasks'
          },
          async () => {
            const tasks = await Task.find();
            return { content: [ { type: 'text', text: `All tasks: ${JSON.stringify(tasks, null, 2)}` } ] };
          }
        );
    
        server.registerTool(
          "get_task",
          {
            description: 'Get a task by ID',
            inputSchema: { id: z.string().describe('Task ID') },
          },
          async ({ id }) => {
            try {
              const task = await Task.findById(id);
              if (!task) {
                  throw new Error();
              }
              return { content: [ { type: 'text', text: `Task: ${JSON.stringify(task)}` } ] };
            } catch (error) {
                return { content: [ { type: 'text', text: `Task not found with ID: ${id}` } ], isError: true };
            }
          }
        );
    
        server.registerTool(
          "update_task",
          {
            description: 'Update a task',
            inputSchema: {
              id: z.string().describe('Task ID'),
              taskName: z.string().optional().describe('New task name'),
              completed: z.boolean().optional().describe('Task completion status')
            },
          },
          async ({ id, taskName, completed }) => {
            try {
              const updateData = {};
              if (taskName !== undefined) updateData.taskName = taskName;
              if (completed !== undefined) {
                updateData.completed = completed;
                if (completed === true) {
                  updateData.completedDate = new Date();
                }
              }
    
              const task = await Task.findByIdAndUpdate(id, updateData);
              if (!task) {
                throw new Error();
              }
              return { content: [ { type: 'text', text: `Task updated: ${JSON.stringify(task)}` } ] };
            } catch (error) {
              return { content: [ { type: 'text', text: `Task not found with ID: ${id}` } ], isError: true };
            }
          }
        );
    
        server.registerTool(
          "delete_task",
          {
            description: 'Delete a task',
            inputSchema: { id: z.string().describe('Task ID to delete') },
          },
          async ({ id }) => {
            try {
              const task = await Task.findByIdAndDelete(id);
              if (!task) {
                throw new Error();
              }
              return { content: [ { type: 'text', text: `Task deleted successfully: ${JSON.stringify(task)}` } ] };
            } catch (error) {
              return { content: [ { type: 'text', text: `Task not found with ID: ${id}` } ], isError: true };
            }
          }
        );
    
        // Create fresh transport for this request
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        
        // Clean up when request closes
        res.on('close', () => {
          transport.close();
          server.close();
        });
        
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });
    ```

    This route sets your MCP server endpoint to `<url>/api/mcp` and uses the stateless mode pattern in the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

    - `server.registerTool()` adds a [tool](https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#tools) to the MCP server with its implementation.
    - The SDK uses [zod](https://www.npmjs.com/package/zod) for input validation.
    - `description` in the configuration object and `describe()` in `inputSchema` provide human-readable descriptions for tools and input. They help the calling agent to understand how to use the tools and their parameters.
    
    This route duplicates the create-read-update-delete (CRUD) functionality of the existing routes, which is unnecessary, but you'll keep it for simplicity. A best practice would be to move the app logic to a module, then call the module from all routes.

## Test the MCP server locally
    
1. In the codespace terminal, run the application with `npm start`.

1. Select **Open in Browser**, then add a task. 

    Leave `npm start` running. Your MCP server is running at `http://localhost:3000/api/mcp` now.

1. Back in the codespace, open Copilot Chat, then select **Agent** mode in the prompt box.

1. Select the **Tools** button, then select **Add More Tools...** in the dropdown.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/add-model-context-protocol-tool.png" alt-text="Screenshot showing how to add an MCP server in GitHub Copilot Chat agent mode.":::

1. Select **Add MCP Server**.

1. Select **HTTP (HTTP or Server-Sent Events)**.

1. In **Enter Server URL**, type *http://localhost:3000/api/mcp*.

1. In **Enter Server ID**, type *todos-mcp* or any name you like.

1. Select **Workspace Settings**.

1. In a new Copilot Chat window, type something like *"Show me the todos."*

1. By default, GitHub Copilot shows you a security confirmation when you invoke an MCP server. Select **Continue**.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-confirmation.png" alt-text="Screenshot showing the default security message from an MCP invocation in GitHub Copilot Chat.":::

    You should now see a response that indicates that the MCP tool call is successful.

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-call-success.png" alt-text="Screenshot showing that the response from the MCP tool call in the GitHub Copilot Chat window.":::

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

    :::image type="content" source="media/tutorial-ai-model-context-protocol-server-dotnet/model-context-protocol-server-start.png" alt-text="Screenshot showing how to manually start an MCP server from the local mcp.json file.":::

1. Start a new GitHub Copilot Chat window. You should be able to view, create, update, and delete tasks in the Copilot agent.
    
## Security best practices

When your MCP server is called by an agent powered by large language models (LLM), be aware of [prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) attacks. Consider the following security best practices:

- **Authentication and Authorization**: Secure your MCP server with Microsoft Entra authentication to ensure only authorized users or agents can access your tools. See [Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md) for a step-by-step guide.
- **Input Validation and Sanitization**: The example code in this tutorial uses [zod](https://www.npmjs.com/package/zod) for input validation, ensuring that incoming data matches the expected schema. For additional security, consider:
    - Validating and sanitizing all user input before processing, especially for fields used in database queries or output.
    - Escaping output in responses to prevent cross-site scripting (XSS) if your API is consumed by browsers.
    - Applying strict schemas and default values in your models to avoid unexpected data.
- **HTTPS:** The sample relies on Azure App Service, which enforces HTTPS by default and provides free TLS/SSL certificates to encrypt data in transit.
- **Least Privilege Principle**: Expose only the necessary tools and data required for your use case. Avoid exposing sensitive operations unless necessary.
- **Rate Limiting and Throttling**: Use [API Management](/azure/api-management/api-management-sample-flexible-throttling) or custom middleware to prevent abuse and denial-of-service attacks.
- **Logging and Monitoring**: Log access and usage of MCP endpoints for auditing and anomaly detection. Monitor for suspicious activity.
- **CORS Configuration**: Restrict cross-origin requests to trusted domains if your MCP server is accessed from browsers. For more information, see [Enable CORS](app-service-web-tutorial-rest-api.md#enable-cors).
- **Regular Updates**: Keep your dependencies up to date to mitigate known vulnerabilities.

## More resources

[Integrate AI into your Azure App Service applications](overview-ai-integration.md)
