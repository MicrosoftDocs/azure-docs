---
title: Agentic app with Microsoft Agent Framework or Foundry Agent Service (.NET)
description: Learn how to quickly deploy a production-ready, agentic web application using .NET with Azure App Service, Microsoft Agent Framework, and Foundry Agent Service.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 08/27/2026
ms.custom:
  - devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Tutorial: Build an agentic web app in Azure App Service with Microsoft Agent Framework or Foundry Agent Service (.NET)

This tutorial demonstrates how to add agentic capability to an existing data-driven ASP.NET Core CRUD application. It does this using two different approaches: Microsoft Agent Framework and Foundry Agent Service.

If your web application already has useful features, like shopping, hotel booking, or data management, it's relatively straightforward to add agent functionality to your web application by wrapping those functionalities as tools (for [Microsoft Agent Framework](/agent-framework/overview/agent-framework-overview)) or as an OpenAPI endpoint (for [Foundry Agent Service](/azure/ai-foundry/agents/overview?view=foundry&preserve-view=true)). In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent in an App Service app.

### [Microsoft Agent Framework](#tab/agentframework)


:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/microsoft-agent-framework.png" alt-text="Screenshot showing the Microsoft Agent Framework agent chat interface with a conversation about task management.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/foundry-agent-service.png" alt-text="Screenshot of a chat completion session with a Foundry agent.":::

-----

Both Microsoft Agent Framework and Foundry Agent Service enable you to build agentic web applications with AI-driven capabilities. The following table shows some of the considerations and trade-offs:

| Consideration      | Microsoft Agent Framework      | Foundry Agent Service         |
|--------------------|-------------------------------|----------------------------------------|
| Performance        | Fast (runs locally)            | Slower (managed, remote service)       |
| Development        | Full code, maximum control     | Low code, rapid integration            |
| Testing            | Manual/unit tests in code      | Built-in playground for quick testing  |
| Scalability        | App-managed                    | Azure-managed, autoscaled             |
| Security guardrails | Custom implementation required | Built-in content safety and moderation |
| Identity     | Custom implementation required | Built-in agent ID and authentication   |
| Enterprise     | Custom integration required    | Built-in Microsoft 365/Teams deployment and Microsoft 365 integrated tool calls.      |

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Convert existing app functionality into tools for Microsoft Agent Framework.
> * Add the tools to a Microsoft Agent Framework agent and use it in a web app.
> * Convert existing app functionality into an OpenAPI endpoint for Foundry Agent Service.
> * Call a Foundry agent in a web app.
> * Assign the required permissions for managed identity connectivity.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent).

2. Select the **Code** button, select the **Codespaces** tab, and select **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured development environment in your browser.

4. Run the application locally:

   ```bash
   dotnet run
   ```

5. When you see **Your application running on port 5280 is available**, select **Open in Browser** and add a few tasks.

## Review the agent code

Both approaches use the same implementation pattern, where the agent is initialized as a service (in Program.cs) in a provider and injected into the respective Blazor component.

### [Microsoft Agent Framework](#tab/agentframework)

The `AgentFrameworkProvider` is initialized in *Services/AgentFrameworkProvider.cs*. The initialization code does the following: 

- Creates an `IChatClient` from Azure OpenAI using the `AzureOpenAIClient`.
- Gets the `TaskCrudTool` instance that encapsulates the functionality of the CRUD application (in *Tools/TaskCrudTool.cs*). The `Description` attributes on the tool methods help the agent determine how to call them.
- Creates an AI agent using `CreateAIAgent()` with instructions and tools registered via `AIFunctionFactory.Create()`.
- Creates a thread for the agent to persist conversation across navigation.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Services/AgentFrameworkProvider.cs" range="43-71" highlight="2-6,9,12-24,27" :::

Each time the user sends a message, the Blazor component (in *Components/Pages/AgentFrameworkAgent.razor*) calls `Agent.RunAsync()` with the user input and the agent thread. The agent thread keeps track of the chat history.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Components/Pages/AgentFrameworkAgent.razor" range="76" :::

### [Foundry Agent Service](#tab/aifoundry)

The `FoundryAgentProvider` provider is initialized in *Services/FoundryAgentProvider.cs*. The initialization code does the following:

- Creates an `AIProjectClient` using the Foundry project endpoint.
- Gets an existing agent from Microsoft Foundry by name.
- Creates a conversation for the browser session.
- Gets a `ProjectResponsesClient` for the agent and conversation.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Services/FoundryAgentProvider.cs" range="56-71" highlight="2,5,8,11,14" :::

This initialization code doesn't define any functionality for the agent, because you would typically build the agent in the Foundry portal. As part of the example scenario, it also follows the OpenAPI pattern shown in [Add an App Service app as a tool in Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md), and makes its CRUD functionality available as an OpenAPI endpoint. This lets you add it to the agent later as a callable tool.

The OpenAPI code is defined in *Program.cs*. For example, the "get tasks" API defines the operation ID with *WithName()*, as required by the [OpenAPI spec tool in Microsoft Foundry](/azure/ai-foundry/agents/how-to/tools/openapi-spec#prerequisites), and `WithDescription()` helps the agent determine how to call the API:

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Program.cs" range="46-53" highlight="7-8" :::

Each time the user sends a message, the Blazor component (in *Components/Pages/FoundryAgent.razor*) calls `ResponseClient.CreateResponseAsync()` with the user input. The response client uses the conversation ID to keep track of the chat history.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Components/Pages/FoundryAgent.razor" range="73-75" :::

-----

## Deploy the sample application

The sample repository contains an Azure Developer CLI (AZD) template, which creates an App Service app and deploys your sample application. The App Service system-assigned managed identity is retained for outbound Azure AI calls. A separate user-assigned managed identity and federated identity credential let App Service authentication act as the generated Microsoft Entra application without a client secret.

1. In the terminal, sign in to Azure by using Azure Developer CLI:

   ```bash
   azd auth login
   ```

   Follow the instructions to complete the authentication process.

1. Deploy the Azure App Service app by using the AZD template:

   ```bash
   azd up
   ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Enter a new environment name:     | Type a unique name. |
    |Select an Azure Subscription to use: | Select the subscription. |
    |Pick a resource group to use: | Select **Create a new resource group**. |
    |Select a location to create the resource group in:| Select **Sweden Central**.|
    |Enter a name for the new resource group:| Type **Enter**.|

1. In the AZD output, find the URL of your app and navigate to it in the browser. Also copy the **Foundry OpenAPI managed identity audience** value for later. The output looks like this:

    <pre>
    Deploying services (azd deploy)

      (✓) Done: Deploying service web
      - Endpoint: &lt;URL>

    Foundry OpenAPI managed identity audience:
        api://&lt;generated-client-id>
    </pre>

1. When Microsoft prompts you, sign in by using an account in the deployment tenant, and verify that the task list loads.

1. In the same authenticated browser, append `/openapi/v1.json` to the App Service endpoint. Copy or save the generated OpenAPI schema for later.

    > [!NOTE]
    > App Service authentication returns an HTTP 302 redirect for unauthenticated browser requests. This sample contains both a browser UI and APIs, so the redirect provides a usable sign-in experience. API-only apps commonly use HTTP 401 instead.

## Create and configure the Microsoft Foundry resource

### [Microsoft Agent Framework](#tab/agentframework)

[!INCLUDE [create-model](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-model.md)]

### [Foundry Agent Service](#tab/aifoundry)

[!INCLUDE [create-agent-managed-identity](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-agent-managed-identity.md)]

-----

## Assign required permissions

### [Microsoft Agent Framework](#tab/agentframework)

[!INCLUDE [configure-model-permissions](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/configure-model-permissions.md)]

### [Foundry Agent Service](#tab/aifoundry)

[!INCLUDE [configure-agent-permissions](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/configure-agent-permissions.md)]

-----

## Configure connection variables in your sample application

1. Open *appsettings.json*. Using the values you copied earlier from the Foundry portal, configure the following variables: 

    ### [Microsoft Agent Framework](#tab/agentframework)

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `AzureOpenAIEndpoint`         | Azure OpenAI endpoint (copied from the Foundry portal home page). |
    | `ModelDeployment`             | Model name in the deployment (copied from the model playground in the new Foundry portal). |
    
    > [!NOTE]
    > To keep the tutorial simple, you'll use these variables in appsettings.json instead of overwriting them with app settings in App Service.

    ### [Foundry Agent Service](#tab/aifoundry)

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `FoundryProjectEndpoint`      | Microsoft Foundry project endpoint from the new Foundry portal. |
    | `FoundryAgentName`            | Agent name (from the agent playground in the Foundry portal). |
    
    -----

    > [!NOTE]
    > To keep the tutorial simple, you'll use these variables in appsettings.json instead of overwriting them with app settings in App Service.

1. Sign in to Azure with the Azure CLI:

    ```bash
    az login
    ```

    This allows the Azure Identity client library in the sample code to receive an authentication token for the logged in user. Remember that you added the required role for this user earlier.

1. Run the application locally:

   ```bash
   dotnet run
   ```

1. When you see **Your application running on port 5280 is available**, select **Open in Browser**.

1. Validate both pivots separately:

    - **Microsoft Agent Framework:** Select **Microsoft Agent Framework Agent**, and ask the agent to create a task. Microsoft Agent Framework calls the in-process task tool.
    - **Foundry Agent Service:** Select **Foundry Agent Service**, and ask the agent to create a task. The remote Foundry agent calls the deployed, protected `/api/tasks` endpoint with managed identity.

    The task that the Foundry agent creates appears in the deployed App Service instance, not the local in-memory database. The Foundry OpenAPI tool always uses the server URL embedded in the OpenAPI schema.

1. Back in the GitHub codespace, deploy your app changes.

   ```bash
   azd up
   ```

1. Navigate to the deployed application again and test the chat agents.

### [Microsoft Agent Framework](#tab/agentframework)


:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/microsoft-agent-framework.png" alt-text="Screenshot showing the deployed Microsoft Agent Framework agent successfully managing tasks in the web app.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/foundry-agent-service.png" alt-text="Screenshot of a chat completion session with a Foundry Agent Service agent.":::

-----

[!INCLUDE [rag-faq](includes/foundry-iq-rag-faq.md)]

## Clean up resources

When you're done with the application, you can delete the App Service resources to avoid incurring further costs:

```bash
azd down --purge
```

Then, delete the Foundry resource if you created it separately.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-foundry/agents/overview?view=foundry&preserve-view=true)
- [Microsoft Agent Framework documentation](/agent-framework/overview/agent-framework-overview)
