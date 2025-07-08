---
title: Agentic app with Semantic Kernel or Azure AI Foundry (.NET)
description: Learn how to quickly deploy a production-ready, agentic web application using .NET with Azure App Service, Microsoft Semantic Kernel, and Azure AI Foundry Agent Service.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 06/25/2025
ms.custom:
  - devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Azure AI Foundry Agent Service (.NET)

This tutorial demonstrates how to add agentic capability to an existing data-driven CRUD application. It does this using two different approaches: Microsoft Semantic Kernel and Azure AI Foundry Agent Service.

If your web application already has useful features, like shopping, hotel booking, or data management, it's relatively straightforward to add agent functionality to your web application by wrapping those functionalities in a plugin (for Semantic Kernel) or as an OpenAPI endpoint (for AI Foundry Agent Service). In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent in an App Service app.

### [Semantic Kernel](#tab/semantickernel)


:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/semantic-kernel-agent.png" alt-text="Screenshot of a chat completion session with a semantic kernel agent.":::

### [Azure AI Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/ai-foundry-agent.png" alt-text="Screenshot of a chat completion session with an Azure AI Foundry agent.":::

-----

Both Semantic Kernel and Azure AI Foundry Agent Service enable you to build agentic web applications with AI-driven capabilities. The following table shows some of the considerations and trade-offs:

| Consideration      | Semantic Kernel                | Azure AI Foundry Agent Service         |
|--------------------|-------------------------------|----------------------------------------|
| Performance        | Fast (runs locally)            | Slower (managed, remote service)       |
| Development        | Full code, maximum control     | Low code, rapid integration            |
| Testing            | Manual/unit tests in code      | Built-in playground for quick testing  |
| Scalability        | App-managed                    | Azure-managed, auto-scaled             |

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Convert existing app functionality into a plugin for Semantic Kernel.
> * Add the plugin to a Semantic Kernel agent and use it in a web app.
> * Convert existing app functionaltiy into an OpenAPI endpoint for Azure AI Foundry Agent Service.
> * Call an Azure AI Foundry agent in a web app.
- Assign the required permissions for managed identity connectivity.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/free/dotnet).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent).

2. Select the **Code** button, select the **Codespaces** tab, and click **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured VS Code environment in your browser.

4. Run the application locally:

   ```bash
   dotnet run
   ```

5. When you see **Your application running on port 5280 is available**, select **Open in Browser** and add a few tasks.

## Review the agent code

Both approaches use the same implementation pattern, where the agent is initialized as a service (in Program.cs) in a provider and injected into the respective Blazor component.

### [Semantic Kernel](#tab/semantickernel)

The `SemanticKernelAgentProvider` is initialized in *Services/SemanticKernelAgentProvider.cs*. The initialization code does the following: 

- Creates a kernel with chat completion.
- Adds a kernel plugin that encapsulates the functionality of the CRUD application (in *Plugins/TaskCrudPlugin.cs*). The only interesting parts of the plugin are the `KernelFunction` attributes on the method definitions and the `Description` attributes that help the kernel call the plugin intelligently.
- Creates a [chat completion agent](/semantic-kernel/frameworks/agent/agent-types/chat-completion-agent?pivots=programming-language-csharp), and configures it to let the AI model automatically invoke functions (`FunctionChoiceBehavior = FunctionChoiceBehavior.Auto()`).

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Services/SemanticKernelAgentProvider.cs" range="20-67" highlight="18-44" :::

### [Azure AI Foundry Agent Service](#tab/aifoundry)

The `FoundryAgentProvider` provider is initialized in *Services/FoundryAgentProvider.cs*. The initialization code does the following:

- Creates a new agents client.
- Creates a new thread.
- Gets the named agent, specified by the agent ID. 

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Services/FoundryAgentProvider.cs" range="22-55" highlight="18,21,30" :::

This initialization code doesn't define any functionality for the agent, because you would typically build the agent in the Azure AI Foundry portal. As part of the example scenario, it also follows the OpenAPI pattern shown in [Add an App Service app as a tool in Azure AI Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md), and makes its CRUD functionality available as an OpenAPI endpoint. This lets you add it to the agent later as a callable tool.

The OpenAPI code is defined in *Program.cs*. For example, the "get tasks" API defines the operation ID with *WithName()*, as required by the [OpenAPI spec tool in Azure AI Foundry](/azure/ai-foundry/agents/how-to/tools/openapi-spec#prerequisites), and `WithDescription()` helps the agent determine how to call the API:

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-ai-foundry-agent/Program.cs" range="46-51" highlight="5-6" :::

-----

## Deploy the sample application

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
    |Select a location to create the resource group in:| Select any region. The resources will actually be created in **East US 2**.|
    |Enter a name for the new resource group:| Type **Enter**.|

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;URL>
    </pre>

1. Select the **OpenAPI schema** item to open the autogenerated OpenAPI schema at the default `/openapi/v1.json` path. You need this schema later.

1. After successful deployment, you'll see a URL for your deployed application.

    You now have an App Service app with a system-assigned managed identity.

## Create and configure the Azure AI Foundry resource

1. In the [Azure AI Foundry portal](https://ai.azure.com), deploy a model of your choice (see [Quickstart: Get started with Azure AI Foundry](/azure/ai-foundry/quickstarts/get-started-code?tabs=azure-ai-foundry&pivots=fdp-project)). A project and a default agent are created for you in the process.

1. From the left menu, select **Overview**.

1. Select **Azure AI Foundry** and copy the URL in **Azure AI Foundry project endpoint**.

1. Select **Azure OpenAI** and copy the URL in **Azure OpenAI endpoint** for later.

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/foundry-project-endpoints.png" alt-text="Screenshot showing how to copy the OpenAI endpoint and the foundry project endpoint in the foundry portal.":::

1. From the left menu, select **Agents**, then select the default agent.

1. From the **Setup** pane, copy **Agent ID**, as well as the model name in **Deployment**.

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/foundry-agent-id-model.png" alt-text="Screenshot showing how to copy the agent ID and the model deployment name in the foundry portal.":::

1. In the **Setup** pane, add an action with the OpenAPI spec tool. Use the OpenAPI schema that you get from the deployed web app and **anonymous** authentication. For detailed steps, see [How to use the OpenAPI spec tool](/azure/ai-foundry/agents/how-to/tools/openapi-spec-samples?pivots=portal).

    Your application code is already configured to include the server's `url` and `operationId`, which are needed by the agent. For more information, see [How to use Azure AI Foundry Agent Service with OpenAPI Specified Tools: Prerequisites](/azure/ai-foundry/agents/how-to/tools/openapi-spec#prerequisites).

1. Select **Try in playground** and test your AI Foundry agent with prompts like "*Show me all the tasks*" and "*Please add a task.*"

    If you get a valid response, the agent is making tool calls to the OpenAPI endpoint on your deployed web app.

## Assign required permissions

1. At the upper right corner of the foundry portal, select the name of the resource, then select **Resource Group** to open it in the Azure portal. 

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/go-to-azure-portal.png" alt-text="Screenshot showing how to quickly go to the resource group view for the foundry resource in the Azure portal.":::

1. Add a role for each of the two resources for the App Service app's manage identity using the following table:

    | Target resource                | Required role                       | Needed for              |
    |--------------------------------|-------------------------------------|-------------------------|
    | Azure AI Foundry               | Cognitive Services OpenAI User      | The chat completion service in the semantic kernel. |
    | Azure AI Foundry Project       | Azure AI User                       | Reading and calling the AI Foundry agent. |

    For instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Configure connection variables in your sample application

1. Open *appsettings.json*. Using the values you copied earlier from the AI Foundry portal, configure the following variables: 

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `AzureOpenAIEndpoint`         | Azure OpenAI endpoint (copied from the Overview page). This is needed by the Semantic Kernel agent. |
    | `ModelDeployment`             | Model name in the deployment (copied from the Agents setup pane). This is needed by the Semantic Kernel agent. |
    | `AzureAIFoundryProjectEndpoint` | Azure AI Foundry project endpoint (copied from Overview page). This is needed for the Azure AI Foundry Agent Service. |
    | `AzureAIFoundryAgentId`       | Agent ID (copied from the Agents setup pane). This is needed to invoke an existing Azure AI Foundry agent. |
    
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

1. Select the **Semantic Kernel Agent** link and the **Azure AI Foundry Agent** link to try out the chat interface. If you get a response, your application is connecting successfully to the Azure AI Foundry resource.

1. Back in the GitHub codespace, deploy your app changes.

   ```bash
   azd up
   ```

1. Navigate to the deployed application again and test the chat agents.

### [Semantic Kernel](#tab/semantickernel)


:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/semantic-kernel-agent.png" alt-text="Screenshot of a chat completion session with a semantic kernel agent.":::

### [Azure AI Foundry Agent Service](#tab/aifoundry)

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/ai-foundry-agent.png" alt-text="Screenshot of a chat completion session with an Azure AI Foundry agent.":::

-----

## Clean up resources

When you're done with the application, you can delete the App Service resources to avoid incurring further costs:

```bash
azd down --purge
```

Sind the AZD template doesn't include the Azure AI Foundry resources, you need to delete them manually if you want.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Azure AI Foundry Agent Service?](/azure/ai-foundry/agents/overview)
- [Introduction to Semantic Kernel](/semantic-kernel/overview/)
