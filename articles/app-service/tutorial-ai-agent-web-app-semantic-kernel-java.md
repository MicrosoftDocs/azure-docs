---
title: Agentic app with Semantic Kernel (Java)
description: Learn how to quickly deploy a production-ready, agentic web application using Java with Azure App Service and Microsoft Semantic Kernel.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 07/16/2025
ms.custom:
  - devx-track-java
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel (Spring Boot)

This tutorial demonstrates how to add agentic capability to an existing data-driven Spring Boot WebFlux CRUD application. It does this using Microsoft Semantic Kernel.

If your web application already has useful features, like shopping, hotel booking, or data management, it's relatively straightforward to add agent functionality to your web application by wrapping those functionalities in a plugin (for Semantic Kernel). In this tutorial, you start with a simple to-do list app. By the end, you'll be able to create, update, and manage tasks with an agent in an App Service app.

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-java/semantic-kernel-agent.png" alt-text="Screenshot of a chat completion session with a semantic kernel agent.":::

> [!NOTE]
> Azure AI Foundry Agent Service currently doesn't have a Java SDK, so isn't included in the scope of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Convert existing app functionality into a plugin for Semantic Kernel.
> * Add the plugin to a Semantic Kernel agent and use it in a web app.
> * Assign the required permissions for managed identity connectivity.

## Prerequisites

- An Azure account with an active subscription - [Create an account for free](https://azure.microsoft.com/free/java).
- GitHub account to use GitHub Codespaces - [Learn more about GitHub Codespaces](https://docs.github.com/codespaces/overview).

## Open the sample with Codespaces

The easiest way to get started is by using GitHub Codespaces, which provides a complete development environment with all required tools preinstalled.

[![Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/app-service-agentic-semantic-kernel-java)

1. Navigate to the GitHub repository at [https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-java](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-java).

2. Select the **Code** button, select the **Codespaces** tab, and select **Create codespace on main**.

3. Wait a few moments for your Codespace to initialize. When ready, you'll see a fully configured development environment in your browser.

4. Run the application locally:

   ```bash
   mvn spring-boot:run
   ```

5. When you see **Your application running on port 8080 is available**, select **Open in Browser** and add a few tasks.

## Review the agent code

The Semantic Kernel agent is initialized in [src/main/java/com/example/crudtaskswithagent/controller/AgentController.java](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-java/blob/main/src/main/java/com/example/crudtaskswithagent/controller/AgentController.java), when the user enters the first prompt in a new browser session. 

You can find the initialization code in the `SemanticKernelAgentService` constructor (in [src/main/java/com/example/crudtaskswithagent/service/SemanticKernelAgentService.java](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-java/blob/main/src/main/java/com/example/crudtaskswithagent/service/SemanticKernelAgentService.java)). The initialization code does the following: 

- Creates a kernel with chat completion.
- Adds a kernel plugin that encapsulates the functionality of the CRUD application (in *src/main/java/com/example/crudtaskswithagent/plugin/TaskCrudPlugin.java*). The interesting parts of the plugin are the `DefineKernelFunction` annotations on the method declarations and the `description` and `returnType` parameters that help the kernel call the plugin intelligently.
- Creates a [chat completion agent](/semantic-kernel/frameworks/agent/agent-types/chat-completion-agent?pivots=programming-language-java), and configures it to let the AI model automatically invoke functions (`FunctionChoiceBehavior.auto(true)`).
- Creates an agent thread that automatically manages the chat history.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-java/src/main/java/com/example/crudtaskswithagent/service/SemanticKernelAgentService.java" range="38-90" highlight="11-48,58" :::

Each time the prompt is received, the server code uses `ChatCompletionAgent.invokeAsync()` to invoke the agent with the user prompt and the agent thread. The agent thread keeps track of the chat history.

:::code language="csharp" source="~/app-service-agentic-semantic-kernel-java/src/main/java/com/example/crudtaskswithagent/service/SemanticKernelAgentService.java" range="109-158" highlight="8" :::

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
    |Select a location to create the resource group in:| Select any region. The resources will actually be created in **East US 2**.|
    |Enter a name for the new resource group:| Type **Enter**.|

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: &lt;URL>
    </pre>

1. After successful deployment, you'll see a URL for your deployed application.

    You now have an App Service app with a system-assigned managed identity.

## Create and configure the Azure AI Foundry resource

1. In the [Azure AI Foundry portal](https://ai.azure.com), deploy a model of your choice (see [Quickstart: Get started with Azure AI Foundry](/azure/ai-foundry/quickstarts/get-started-code?tabs=azure-ai-foundry&pivots=fdp-project)). A project and a model deployment are created for you in the process.

1. From the left menu, select **Overview**.

1. Select **Azure OpenAI** and copy the URL in **Azure OpenAI endpoint** for later.

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-java/foundry-openai-endpoint.png" alt-text="Screenshot showing how to copy the OpenAI endpoint in the foundry portal.":::

1. Select **Models + endpoints** and copy the name of the model deployment for later.

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-java/foundry-model-deployment.png" alt-text="Screenshot showing how to copy the model deployment name in the foundry portal.":::

## Assign required permissions

1. At the upper right corner of the foundry portal, select the name of the resource, then select **Resource Group** to open it in the Azure portal. 

    :::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/go-to-azure-portal.png" alt-text="Screenshot showing how to quickly go to the resource group view for the foundry resource in the Azure portal.":::

1. Add a role for each of the two resources for the App Service app's manage identity using the following table:

    | Target resource                | Required role                       | Needed for              |
    |--------------------------------|-------------------------------------|-------------------------|
    | Azure AI Foundry               | Cognitive Services OpenAI User      | The chat completion service in the semantic kernel. |

    For instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Configure connection variables in your sample application

1. Open *src/main/resources/application.properties*. Using the values you copied earlier from the AI Foundry portal, configure the following variables: 

    | Variable                      | Description                                              |
    |-------------------------------|----------------------------------------------------------|
    | `azure.openai.endpoint`         | Azure OpenAI endpoint (copied from the Overview page). This is needed by the Semantic Kernel agent. |
    | `azure.openai.deployment`             | Model name in the deployment (copied from the Models + endpoints page). This is needed by the Semantic Kernel agent. |
    
    > [!NOTE]
    > To keep the tutorial simple, you'll use these variables in *src/main/resources/application.properties* instead of overwriting them with app settings in App Service.

1. Sign in to Azure with the Azure CLI:

    ```bash
    az login
    ```

    This allows the Azure Identity client library in the sample code to receive an authentication token for the logged in user. Remember that you added the required role for this user earlier.

1. Run the application locally:

   ```bash
   mvn spring-boot:run
   ```

1. When you see **Your application running on port 8080 is available**, select **Open in Browser**.

1. Try out the chat interface. If you get a response, your application is connecting successfully to the Azure AI Foundry resource.

1. Back in the GitHub codespace, deploy your app changes.

   ```bash
   azd up
   ```

1. Navigate to the deployed application again and test the chat agents.

:::image type="content" source="media/tutorial-ai-agent-web-app-semantic-kernel-java/semantic-kernel-agent.png" alt-text="Screenshot of a chat completion session with a semantic kernel agent.":::

## Clean up resources

When you're done with the application, you can delete the App Service resources to avoid incurring further costs:

```bash
azd down --purge
```

Since the AZD template doesn't include the Azure AI Foundry resources, you need to delete them manually if you want.

## More resources

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Introduction to Semantic Kernel](/semantic-kernel/overview/)
