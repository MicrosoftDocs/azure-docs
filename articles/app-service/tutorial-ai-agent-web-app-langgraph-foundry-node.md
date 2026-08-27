---
title: Agentic app with LangGraph or Foundry Agent Service (Node.js)
description: Learn how to quickly deploy a production-ready, agentic web application using Node.js with Azure App Service, LangGraph, and Foundry Agent Service.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: javascript
ms.topic: tutorial
ms.date: 08/25/2026
ms.custom:
  - devx-track-javascript
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Node.js)

This tutorial demonstrates how to add agentic capability to an existing data-driven Express.js CRUD application. It does this using two different approaches: LangGraph and Foundry Agent Service.

If your web application already has useful features, like shopping, hotel booking, or data management, it's relatively straightforward to add agent functionality to your web application by wrapping those functionalities in a plugin (for LangGraph) or as an OpenAPI endpoint (for Foundry Agent Service). In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent in an App Service app.

### [LangGraph](#tab/langgraph)

:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-node/langgraph-agent.png" alt-text="Screenshot of a chat completion session with a LangGraph agent.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-node/foundry-agent.png" alt-text="Screenshot of a chat completion session with a Microsoft Foundry agent.":::

-----

Both LangGraph and Foundry Agent Service enable you to build agentic web applications with AI-driven capabilities. LangGraph is similar to Microsoft Semantic Kernel and is an SDK, but Semantic Kernel doesn't support JavaScript currently. The following table shows some of the considerations and trade-offs:

| Consideration      | LangGraph                | Foundry Agent Service         |
|--------------------|-------------------------------|----------------------------------------|
| Performance        | Fast (runs locally)            | Slower (managed, remote service)       |
| Development        | Full code, maximum control     | Low code, rapid integration            |
| Testing            | Manual/unit tests in code      | Built-in playground for quick testing  |
| Scalability        | App-managed                    | Azure-managed, autoscaled             |
| Security guardrails | Custom implementation required | Built-in content safety and moderation |
| Identity     | Custom implementation required | Built-in agent ID and authentication   |
| Enterprise     | Custom integration required    | Built-in Microsoft 365/Teams deployment and Microsoft 365 integrated tool calls.      |

In the deployed app, App Service authentication requires Microsoft Entra sign-in for both the browser UI and the APIs. LangGraph runs inside App Service and calls the task service directly. Foundry Agent Service runs remotely and calls the protected task API through its OpenAPI tool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Convert existing app functionality into a plugin for LangGraph.
> * Add the plugin to a LangGraph agent and use it in a web app.
> * Convert existing app functionality into an OpenAPI endpoint for Foundry Agent Service.
> * Call a Foundry agent in a web app.
> * Assign the required permissions for managed identity connectivity.
> * Protect an App Service web app and its APIs with Microsoft Entra ID.
> * Configure a Foundry OpenAPI tool to call protected App Service APIs with managed identity.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-agentic-langgraph-foundry-node](https://github.com/Azure-Samples/app-service-agentic-langgraph-foundry-node).

2. Select the **Code** button, select the **Codespaces** tab, and select **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured development environment in your browser.

4. Run the application locally:

    ```bash
    npm install
    npm run build
    npm start
    ```

5. When you see **Your application running on port 3000 is available**, select **Open in Browser** and add a few tasks.

    The agents aren't fully configured so they don't work yet. You'll configure them later.

## Review the agent code

Both approaches use the same implementation pattern, where the agent is initialized on application start, and responds to user messages by POST requests.

### [LangGraph](#tab/langgraph)

The `LangGraphTaskAgent` is initialized in the constructor in *src/agents/LangGraphTaskAgent.ts*. The initialization code does the following: 

- Configures the [AzureChatOpenAI](https://js.langchain.com/docs/integrations/llms/azure/) client using environment variables.
- Creates the prebuilt ReAct agent with a set of CRUD tools for task management (see [LangGraph: How to use the prebuilt ReAct agent](https://langchain-ai.github.io/langgraphjs/how-tos/create-react-agent)).
- Sets up memory management (see [LangGraph: How to add memory to the prebuilt ReAct agent](https://langchain-ai.github.io/langgraphjs/how-tos/react-memory/)).

:::code language="typescript" source="~/app-service-agentic-langgraph-foundry-node/src/agents/LangGraphTaskAgent.ts" range="23-143" highlight="13-21,24-37,106-117" :::

The deployed sample is protected by App Service authentication and uses one server-selected LangGraph thread. When you process user messages, the agent invokes `invoke()` with the user's message and the server-managed thread ID:

```typescript
private readonly conversationThreadId = 'authenticated-conversation';

const result = await this.agent.invoke(
    {
        messages: [
            { role: 'user', content: message }
        ]
    },
    {
        configurable: {
            thread_id: this.conversationThreadId
        }
    }
);
```

### [Foundry Agent Service](#tab/aifoundry)

The `FoundryTaskAgent` uses a lazy initialization pattern in *src/agents/FoundryTaskAgent.ts*. The initialization code does the following:

- Creates an `AIProjectClient` using Azure credentials.
- Gets an OpenAI client from the project client.
- Retrieves the agent by name.
- Creates one server-managed conversation for the App Service-authenticated sample experience.

:::code language="typescript" source="~/app-service-agentic-langgraph-foundry-node/src/agents/FoundryTaskAgent.ts" range="65-76" highlight="2-4,7-9" :::

This initialization code doesn't define any functionality for the agent, because you would typically build the agent in the Foundry portal. As part of the example scenario, it also follows the OpenAPI pattern shown in [Add an App Service app as a tool in Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md), and makes its CRUD functionality available as an OpenAPI endpoint. This lets you add it to the agent later as a callable tool.

The OpenAPI code is defined in *src/routes/api.ts*. For example, the "GET /api/tasks" route defines `operationId` in the JSDoc Swagger comments, as required by the [OpenAPI spec tool in Microsoft Foundry](/azure/ai-foundry/agents/how-to/tools/openapi-spec#prerequisites), and `description` helps the agent determine how to call the API:

:::code language="typescript" source="~/app-service-agentic-langgraph-foundry-node/src/routes/api.ts" range="69-87" highlight="1-10" :::

When processing user messages, the agent is invoked by adding the user's message to the conversation and calling `responses.create()` with the agent reference:

:::code language="typescript" source="~/app-service-agentic-langgraph-foundry-node/src/agents/FoundryTaskAgent.ts" range="106-119" highlight="2-4,7-14" :::

-----

## Deploy the sample application

The sample repository contains an Azure Developer CLI (AZD) template, which creates an App Service app and deploys your sample application. The template enables a system-assigned managed identity for outbound Azure AI calls and configures App Service authentication with Microsoft Entra ID. For more information about the underlying authentication configuration, see [Secure OpenAPI endpoints for Foundry Agent Service](configure-authentication-ai-foundry-openapi-tool.md).

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

1. In the AZD output, find the URL of your app. Also copy the **Foundry OpenAPI managed identity audience** value for later. The output looks like this:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;URL>

    Foundry OpenAPI managed identity audience:
    api://&lt;generated-client-id>
    </pre>

1. Open the App Service endpoint from the AZD output.

1. When Microsoft prompts you, sign in by using an account in the deployment tenant, and verify that the task list loads.

1. In the same authenticated browser, open the autogenerated OpenAPI schema at `https://<app-name>.azurewebsites.net/api/schema`.

1. Copy or save the generated OpenAPI schema. You use it in the Foundry Agent Service pivot.

    > [!NOTE]
    > App Service authentication returns an HTTP 302 redirect for unauthenticated browser requests. This sample contains both a browser UI and APIs, so the redirect provides a usable sign-in experience. API-only apps commonly use HTTP 401 instead.

    You now have an authenticated App Service app. Its system-assigned managed identity is used for outbound Foundry calls. A separate user-assigned managed identity provides secretless credentials for App Service authentication.

## Create and configure the Microsoft Foundry resource

### [LangGraph](#tab/langgraph)

[!INCLUDE [create-model](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-model.md)]

### [Foundry Agent Service](#tab/aifoundry)

[!INCLUDE [create-agent-managed-identity](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-agent-managed-identity.md)]

-----

## Assign required permissions

### [LangGraph](#tab/langgraph)

[!INCLUDE [configure-model-permissions](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/configure-model-permissions.md)]

### [Foundry Agent Service](#tab/aifoundry)

[!INCLUDE [configure-agent-permissions](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/configure-agent-permissions.md)]

-----

## Configure connection variables in your sample application

1. Open *.env*. Using the values you copied earlier from the Foundry portal, configure the following variables: 

    ### [LangGraph](#tab/langgraph)

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `AZURE_OPENAI_ENDPOINT`         | Azure OpenAI endpoint (copied from the Foundry portal home page). |
    | `AZURE_OPENAI_DEPLOYMENT_NAME`             | Model name in the deployment (copied from the model playground in the new Foundry portal). |
    
    > [!NOTE]
    > To keep the tutorial simple, you'll use these variables in *.env* instead of overwriting them with app settings in App Service.

    ### [Foundry Agent Service](#tab/aifoundry)

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `AZURE_AI_FOUNDRY_PROJECT_ENDPOINT`      | Microsoft Foundry project endpoint from the new Foundry portal. |
    | `AZURE_AI_FOUNDRY_AGENT_NAME`            | Agent name (from the agent playground in the Foundry portal). |
    
    -----
    
    > [!NOTE]
    > To keep the tutorial simple, you'll use these variables in *.env* instead of overwriting them with app settings in App Service.

    The values in *.env* configure the app's outbound connection to Foundry. `AZURE_AI_FOUNDRY_ACCOUNT_CLIENT_ID` configures the separate inbound Foundry-to-App-Service OpenAPI connection and is stored in the AZD environment.

App Service authentication runs in Azure, not in the local Express process, so the local testing workflow remains unchanged.

1. Sign in to Azure with the Azure CLI:

    ```bash
    az login
    ```

    This allows the Azure Identity client library in the sample code to receive an authentication token for the logged in user. Remember that you added the required role for this user earlier.

1. Run the application locally:

    ```bash
    npm run build
    npm start
    ```

1. When you see **Your application running on port 3000 is available**, select **Open in Browser**.

1. Validate both pivots separately:

    - **LangGraph:** Select **LangGraph Agent**, and ask the agent to create a task. LangGraph calls the in-process task tool.
    - **Foundry Agent Service:** Select **Foundry Agent**, and ask the agent to create a task. The remote Foundry agent calls the deployed, protected `/api/tasks` endpoint with managed identity.

    The task that the Foundry agent creates appears in the deployed App Service instance, not the local in-memory database. The Foundry OpenAPI tool always uses the server URL embedded in the OpenAPI schema.

1. Back in the GitHub codespace, deploy your app changes.

   ```bash
   azd up
   ```

1. Navigate to the deployed application, sign in, and test both pivots. Create and list tasks with the **LangGraph Agent**, and then create and list tasks with the **Foundry Agent**. Verify that both pivots update the task list.

### [LangGraph](#tab/langgraph)


:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-node/langgraph-agent.png" alt-text="Screenshot of a chat completion session with a LangGraph agent.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-node/foundry-agent.png" alt-text="Screenshot of a chat completion session with a Microsoft Foundry agent.":::

-----

[!INCLUDE [rag-faq](includes/foundry-iq-rag-faq.md)]

### Which managed identity does each connection use?

| Direction | Identity |
| --- | --- |
| App Service calls Foundry | App Service system-assigned identity |
| Foundry OpenAPI tool calls `/api/tasks` | Parent Foundry resource system-assigned identity |

The project endpoint selects the project and agent. It doesn't determine the identity that the hosted OpenAPI tool uses.

## Clean up resources

When you're done with the application, you can delete the App Service resources to avoid incurring further costs:

```bash
azd down --purge
```

Then, delete the Foundry resource if you created it separately.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-foundry/agents/overview)
- [LangGraph.js - Quickstart](https://docs.langchain.com/oss/javascript/langgraph/quickstart)
- [Azure AI Projects client library for JavaScript](/javascript/api/overview/azure/ai-projects-readme)
