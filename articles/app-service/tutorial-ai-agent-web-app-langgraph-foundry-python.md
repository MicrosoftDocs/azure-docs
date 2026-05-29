---
title: Agentic app with LangGraph or Foundry Agent Service (Python)
description: Learn how to quickly deploy a production-ready, agentic web application using Python with Azure App Service, LangGraph, and Foundry Agent Service.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: python
ms.topic: tutorial
ms.date: 12/12/2025
ms.custom:
  - devx-track-python
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Python)

This tutorial demonstrates how to add agentic capability to an existing data-driven FastAPI CRUD application. It does this using two different approaches: LangGraph and Foundry Agent Service.

If your web application already has useful features, like shopping, hotel booking, or data management, it's relatively straightforward to add agent functionality to your web application by wrapping those functionalities in a plugin (for LangGraph) or as an OpenAPI endpoint (for Foundry Agent Service). In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent in an App Service app.

### [LangGraph](#tab/langgraph)


:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-python/langgraph-agent.png" alt-text="Screenshot of a chat completion session with a LangGraph agent.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-python/foundry-agent.png" alt-text="Screenshot of a chat completion session with a Microsoft Foundry agent.":::

-----

Both LangGraph and Foundry Agent Service enable you to build agentic web applications with AI-driven capabilities. LangGraph is similar to Microsoft Agent Framework and is an SDK. The following table shows some of the considerations and trade-offs:

| Consideration      | LangGraph or Microsoft Agent Framework   | Foundry Agent Service         |
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
> * Convert existing app functionality into a plugin for LangGraph.
> * Add the plugin to a LangGraph agent and use it in a web app.
> * Convert existing app functionality into an OpenAPI endpoint for Foundry Agent Service.
> * Call a Foundry agent in a web app.
> * Assign the required permissions for managed identity connectivity.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-agentic-langgraph-foundry-python](https://github.com/Azure-Samples/app-service-agentic-langgraph-foundry-python).

2. Select the **Code** button, select the **Codespaces** tab, and select **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured development environment in your browser.

4. Run the application locally:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn src.app:app --host 0.0.0.0 --port 3000
    ```

5. When you see **Your application running on port 3000 is available**, select **Open in Browser** and add a few tasks.

    The agents aren't fully configured so they don't work yet. You'll configure them later.

## Review the agent code

Both approaches use the same implementation pattern, where the agent is initialized on application start, and responds to user messages by POST requests.

### [LangGraph](#tab/langgraph)

The `LangGraphTaskAgent` is initialized in the constructor in *src/agents/langgraph_task_agent.py*. The initialization code does the following: 

- Configures the [AzureChatOpenAI](https://python.langchain.com/docs/integrations/chat/azure_chat_openai/) client using environment variables.
- Creates the prebuilt ReAct agent with memory and a set of CRUD tools for task management (see [LangGraph quickstart](https://langchain-ai.github.io/langgraph/agents/agents)).

:::code language="python" source="~/app-service-agentic-langgraph-foundry-python/src/agents/langgraph_task_agent.py" range="58-82" highlight="7-12,15-21,24" :::

When processing user messages, the agent is invoked using `ainvoke()` with the user's message and a thread ID for conversation continuity:

:::code language="python" source="~/app-service-agentic-langgraph-foundry-python/src/agents/langgraph_task_agent.py" range="178-181" :::

### [Foundry Agent Service](#tab/aifoundry)

The `FoundryTaskAgent` is initialized in the constructor of *src/agents/foundry_task_agent.py*. The initialization code does the following:

- Creates an `AIProjectClient` using Azure credentials.
- Gets an OpenAI client from the project client.
- Retrieves the agent from Foundry by name.
- Creates a new conversation for the session.

:::code language="python" source="~/app-service-agentic-langgraph-foundry-python/src/agents/foundry_task_agent.py" range="41-60" highlight="2-5,8,11,18" :::

This initialization code doesn't define any functionality for the agent, because you would typically build the agent in the Foundry portal. As part of the example scenario, it also follows the OpenAPI pattern shown in [Add an App Service app as a tool in Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md), and makes its CRUD functionality available as an OpenAPI endpoint. This lets you add it to the agent later as a callable tool.

The OpenAPI code is defined in *src/routes/api.py*. For example, the "GET /tasks" route defines a custom `operation_id` parameter, as required by the [OpenAPI spec tool in Microsoft Foundry](/azure/ai-foundry/agents/how-to/tools/openapi-spec#prerequisites), and `description` helps the agent determine how to call the API:

:::code language="python" source="~/app-service-agentic-langgraph-foundry-python/src/routes/api.py" range="27-42" highlight="4-5" :::

When processing user messages, the agent is invoked by adding the user's message to the conversation and calling `responses.create()` with the agent reference:

:::code language="python" source="~/app-service-agentic-langgraph-foundry-python/src/agents/foundry_task_agent.py" range="84-95" highlight="2-5,8-12" :::

-----

## Deploy the sample application

The sample repository contains an Azure Developer CLI (AZD) template, which creates an App Service app with managed identity and deploys your sample application.

1. In the terminal, log into Azure using Azure Developer CLI:

   ```bash
   azd auth login
   ```

   Follow the instructions to complete the authentication process.

4. Deploy the Azure App Service app with the AZD template:

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

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;URL>
    </pre>

1. Open the autogenerated OpenAPI schema at the `https://....azurewebsites.net/openapi.json` path. You need this schema later.

    You now have an App Service app with a system-assigned managed identity.

## Create and configure the Microsoft Foundry resource

### [LangGraph](#tab/langgraph)

[!INCLUDE [create-model](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-model.md)]

### [Foundry Agent Service](#tab/aifoundry)

[!INCLUDE [create-agent](includes/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/create-agent.md)]

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
    | `AZURE_OPENAI_ENDPOINT`         | Azure OpenAI endpoint (copied from the classic Foundry portal). |
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

1. Select the **LangGraph Agent** link and the **Foundry Agent** link to try out the chat interface. If you get a response, your application is connecting successfully to the Microsoft Foundry resource.

1. Back in the GitHub codespace, deploy your app changes.

   ```bash
   azd up
   ```

1. Navigate to the deployed application again and test the chat agents.

### [LangGraph](#tab/langgraph)


:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-python/langgraph-agent.png" alt-text="Screenshot of a chat completion session with a LangGraph agent.":::

### [Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-langgraph-foundry-python/foundry-agent.png" alt-text="Screenshot of a chat completion session with a Microsoft Foundry agent.":::

-----

## Clean up resources

When you're done with the application, you can delete the App Service resources to avoid incurring further costs:

```bash
azd down --purge
```

Since the AZD template doesn't include the Microsoft Foundry resources, you need to delete them manually if you want.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-foundry/agents/overview)
- [LangGraph - Quickstart](https://langchain-ai.github.io/langgraph/agents/agents/)
- [Azure AI Projects client library for Python](/python/api/overview/azure/ai-projects-readme)
