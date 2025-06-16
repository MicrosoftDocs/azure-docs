---
title: Integrate web app with OpenAPI in Azure AI Foundry Agent Service
description: Empower your existing web apps by integrating their capabilities into Azure AI Foundry Agent Service with OpenAPI, enabling AI agents to perform real-world tasks.
author: cephalin
ms.author: cephalin
ms.date: 06/16/2025
ms.topic: tutorial
ms.custom:
  - devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
---

# Add an App Service app as a OpenAPI tool in Azure AI Foundry Agent Service (.NET)

In this tutorial, you'll learn how to expose your app's functionality through OpenAPI, add it as a tool to Azure AI Foundry Agent Service, and interact with your app using natural language in the agents playground. 

If your web application already has useful features, like shopping, hotel booking, or data management, it's easy to make those capabilities available to an AI agent in Azure AI Foundry Agent Service. By simply adding an OpenAPI schema to your app, you enable the agent to understand and use your app's capabilities when it responds to users' prompts. This means anything your app can do, your AI agent can do too, with minimal effort beyond creating an OpenAPI endpoint for your app. In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent through conversational AI.

:::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-openapi-dotnet/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool.":::

> [!div class="checklist"]
> * Add OpenAPI functionality to your web app.
> * Make sure OpenAPI schema compatible with Azure AI Foundry Agent Service.
> * Register your app as an OpenAPI tool in Azure AI Foundry Agent Service.
> * Test your agent in the the agents playground.

## Prerequisites

This tutorial assumes you're working with the sample used in [Tutorial: Deploy an ASP.NET Core and Azure SQL Database app to Azure App Service](tutorial-dotnetcore-sqldb-app.md). 

At a minimum, open the [sample application](https://github.com/Azure-Samples/msdocs-app-service-sqldb-dotnetcore) in GitHub Codespaces and deploy the app by running `azd up`.

## Add OpenAPI functionality to your web app

> [!TIP]
> You can make all the following changes by telling GitHub Copilot in Agent mode:
>
> `I'd like to add OpenAPI functionality to all the methods in Controllers/TodosController.cs, but I don't want to change the existing functionality with MVC. Please also generate the server URL and operation ID in the schema.`

1. In the codespace terminal, add the NuGet [Swashbuckle](/aspnet/core/tutorials/getting-started-with-swashbuckle) packages to your project:

    ```dotnetcli
    dotnet add package Swashbuckle.AspNetCore --version 6.5.0
    dotnet add package Swashbuckle.AspNetCore.Annotations --version 6.5.0
    ```
    
1. In *Controllers/TodosController.cs*, add the following API methods. To make them compatible with the Azure AI Foundry Agent Service, you must specify the `OperationId` property in the `SwaggerOperation` attribute (see [How to use Azure AI Foundry Agent Service with OpenAPI Specified Tools: Prerequisites](/azure/ai-services/agents/how-to/tools/openapi-spec#prerequisites)).

    ```csharp
    // POST: api/todos
    [HttpPost("api/todos")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Creates a new todo item.", Description = "Creates a new todo item and returns it.", OperationId = "CreateTodo")]
    public async Task<IActionResult> CreateTodo([FromBody] Todo todo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _context.Add(todo);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTodo), new { id = todo.ID }, todo);
    }
    
    // PUT: api/todos/{id}
    [HttpPut("api/todos/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [SwaggerOperation(Summary = "Updates a todo item.", Description = "Updates an existing todo item by ID.", OperationId = "UpdateTodo")]
    public async Task<IActionResult> UpdateTodo(int id, [FromBody] Todo todo)
    {
        // Use the id from the URL fragment only, ignore mismatching check
        if (!TodoExists(id))
        {
            return NotFound();
        }
        todo.ID = id;
        _context.Entry(todo).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    // DELETE: api/todos/{id}
    [HttpDelete("api/todos/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [SwaggerOperation(Summary = "Deletes a todo item.", Description = "Deletes a todo item by ID.", OperationId = "DeleteTodo")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.Todo.FindAsync(id);
        if (todo == null)
        {
            return NotFound();
        }
        _context.Todo.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    ```
    
1. At the top of *Controllers/TodosController.cs*, add the following usings:

    ```csharp
    using Microsoft.AspNetCore.Http;
    using Swashbuckle.AspNetCore.Annotations;
    ```
    
    This code is duplicating the functionality of the existing controller, which is unnecessary, but you'll keep it for simplicity. A best practice would be to move the app logic to a service class, then call the service methods both from the MVC actions and from the API methods.

1. In *Program.cs*, register the Swagger generator service. This enables OpenAPI documentation for your API, which lets Azure AI Foundry Agent Service understand your APIs. Be sure to specify the server URL. Azure AI Foundry Agent Service needs a schema that contains the server URL.

    ```csharp
    builder.Services.AddSwaggerGen(c =>
    {
        c.EnableAnnotations();
        var websiteHostname = Environment.GetEnvironmentVariable("WEBSITE_HOSTNAME");
        if (!string.IsNullOrEmpty(websiteHostname))
        {
            c.AddServer(new Microsoft.OpenApi.Models.OpenApiServer { Url = $"https://{websiteHostname}" });
        }
    });
    ```

1. In *Program.cs*, enable the Swagger middleware. This middleware serves the generated OpenAPI documentation at runtime, making it accessible via a browser.

    ```csharp
    app.UseSwagger();
    app.UseSwaggerUI();
    ```
    
1. In the codespace terminal, run the application with `dotnet run`.

1. Select **Open in Browser**.

1. Navigate to the Swagger UI by adding `/swagger/index.html` to the URL.

1. Confirm that the API operations work by trying them out. in the Swagger UI.

1. Back in the codespace terminal, deploy your changes by committing your changes (GitHub Actions method) or run `azd up` (Azure Developer CLI method).

1. Once your changes are deployed, navigate to https://<your-app's-url>/swagger/v1/swagger.json and copy the schema for later.

## Create an agent in Azure AI Foundry

1. Create an agent in the Azure AI Foundry portal by following the steps at:[Quickstart: Create a new agent](/azure/ai-services/agents/quickstart?pivots=ai-foundry-portal).

    Note the [models you can use and the available regions](/azure/ai-services/agents/concepts/model-region-support#azure-openai-models). 

1. Select the new agent and add an action with the OpenAPI 3.0 specified tool by following the steps at [How to use the OpenAPI spec tool](/azure/ai-services/agents/how-to/tools/openapi-spec-samples?pivots=portal).

1. In the **Define schema** page, paste the schema that you copied earlier. Review and save the action.

## Test the agent

1. If the agents playground isn't already opened in the foundry portal, select the agent and select **Try in playground**.

1. In **Instructions**, give some simple instructions, like *"Please use the todosApp tool to help manage tasks."*

1. Chat with the agent with the following prompt suggestions:

    - Show me all the tasks.
    - Create a task called "Come up with three lettuce jokes."
    - Change that to "Come up with three knock-knock jokes."
    
    :::image type="content" source="media/tutorial-ai-integrate-azure-ai-agent-openapi-dotnet/agents-playground.png" alt-text="Screenshot showing the agents playground in the middle of a conversation that takes actions by using the OpenAPI tool.":::

## More resources

[Integrate AI into your Azure App Service applications](overview-ai-integration.md)
[What is Azure AI Foundry Agent Service?](/azure/ai-services/agents/overview)