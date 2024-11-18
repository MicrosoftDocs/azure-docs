---
title: Deploy your first AI application to Azure Container Apps
description: Use azd automation tool to deploy a sample AI application to Azure Container Apps.
services: container-apps
author:
ms.author: sonwan
ms.service: azure-container-apps
ms.topic: quickstart
ms.date:
ms.custom:
---

# Deploy your first AI application to Azure Container Apps

The sample project is an AI application that uses Azure Container Apps and Azure Open AI. The application provides AI assitant functionality in a Spring Pet Clinic application.

- Deploy the sample AI application using azd automation tool.
- General architecture of the AI application.
- Key code changes to implement the AI application.

The following screenshot shows how the AI assistant can help you.

:::image type="content" source="media/first-ai-application/chat-diag.png" alt-text="Screenshot of AI chat.":::

## Prepare your environment

For running this lab with all the needed tooling, there are 2 options available:

- [Using a GitHub codespace](#using-a-github-codespace)
- [Install all the tools in your local environment](#install-all-the-tools-in-your-local-environment)

All the steps of this lab have been tested in the GitHub CodeSpace. This is the preferred option.

### Using a GitHub codespace

The [Spring Petclinic AI repo](https://github.com/Azure-Samples/spring-petclinic-ai) contains a dev container environment for developers. This environment contains all the needed tools for running this sample. In case you want to use this dev container you can use a [GitHub CodeSpace](https://github.com/features/codespaces) in case your GitHub account is enabled for Codespaces.

1. Navigate to the [GitHub repository of this sample](https://github.com/Azure-Samples/spring-petclinic-ai) and select Fork.
   {: .note }
   > In case you are using a GitHub EMU account, it might be you are not able to fork a public repository. In that case, create a new repository with the same name, clone the original repository, add your new repository as a remote and push to this new remote.

1. Make sure your own username is indicated as the fork `Owner`

1. Select **Create fork**. This will create a copy or fork of this project in your own account.

1. Navigate to the newly forked GitHub project.

1. Select **Code** and next **Codespaces**.

1. Select **Create a codespace**.

Your codespace will now get created in your browser window. Once creation is done, you can start executing the next steps. See [Deploy your first AI application](#deploy-your-first-ai-application).

### Install all the tools in your local environment

* Install Tools

   | Requirement  | Instructions |
   |--|--|
   | Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* + *User Access Administrator* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
   | GitHub Account | Get one for [free](https://github.com/join). |
   | git | Install [git](https://git-scm.com/downloads) |
   | Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
   | Java | Install the [JDK](/java/openjdk/install), recommend 17, or later|
   | Maven | Install the [Maven](https://maven.apache.org/download.cgi).|
   | Azd | Install [Azd](/azure/developer/azure-developer-cli/install-azd).|

* Install extensions

   ```bash
   az extension add -n containerapp -y
   ```

* Clone the repository

   ```bash
   cd workspaces
   git clone https://github.com/<your-github-account>/spring-petclinic-ai.git
   cd spring-petclinic-ai
   ```

Your environment is nwo ready to run the next steps. See [Deploy your first AI application](#deploy-your-first-ai-application).

## Deploy your first AI application

{: .note }
> This template uses [Azure OpenAI Service](/azure/ai-services/openai/overview) deployment mododules **gpt-4o** and **text-embedding-ada-002** which may not be available in all Azure regions. Check for [up-to-date region availability](/azure/ai-services/openai/concepts/models#standard-deployment-model-availability) and select a region during deployment accordingly

We recommend using region **East US**, **East US 2**, **North Central US**, **South Central US**, **Sweden Central**, **West US** and **West US 3**.

* Login to azd with command

  ```bash
  azd auth login
  ```

* Run command to auto deploy

  ```bash
  azd up
  ```

  Fill the variables required:

  ```text
  ? Enter a new environment name: <your-env-name>
  ? Select an Azure Subscription to use: <your-subscription-name>
  ? Select an Azure location to use: <your-region>
  ```

  It takes about 15 minutes to get your first AI application ready. Sample output:

  ```text
  (✓) Done: Resource group: rg-first-ai (5.977s)
  (✓) Done: Virtual Network: vnet-first-ai (7.357s)
  (✓) Done: Container Registry: crb36onby7z5ooc (25.742s)
  (✓) Done: Azure OpenAI: openai-first-ai (25.324s)
  (✓) Done: Azure AI Services Model Deployment: openai-first-ai/text-embedding-ada-002 (42.909s)
  (✓) Done: Azure AI Services Model Deployment: openai-first-ai/gpt-4o (44.21s)
  (✓) Done: Container Apps Environment: aca-env-first-ai (3m1.361s)
  (✓) Done: Container App: petclinic-ai (22.701s)

  INFO: Deploy finish succeed!
  INFO: App url: petclinic-ai.<cluster>.<region>.azurecontainerapps.io

  Packaging services (azd package)

  (✓) Done: Packaging service petclinic-ai

  Deploying services (azd deploy)

  (✓) Done: Deploying service petclinic-ai
  - Endpoint: https://petclinic-ai.<cluster>.<region>.azurecontainerapps.io/

  SUCCESS: Your up workflow to provision and deploy to Azure completed in 17 minutes 40 seconds.
  ```

* Try the AI application

  Open the App url from the deploy output:

  ```text
  INFO: Deploy finish succeed!
  INFO: App url: https://petclinic-ai.<cluster>.<region>.azurecontainerapps.io
  ```

  And your will see the petclinic page and chat with the AI assistant

  :::image type="content" source="media/first-ai-application/chat-diag.png" alt-text="Screenshot of AI chat assitant.":::

  You can get help by having a natural language chat with the AI assistant. The AI assistant can assist you with the following tasks:
  - Querying the registered pet owners
  - Adding a new pet owner
  - Updating the pet owner's information
  - Adding a new pet
  - Querying the vets' information

  Please note that the capabilities of the AI assistant depend on the model you deploy in Azure OpenAI.

## General architecture structure

Here is the architecture structure of the first AI application on Azure Container Apps:

:::image type="content" source="media/first-ai-application/arch-chart.png" alt-text="The architecture structure of first AI application.":::

The key component of this sample:
- [Azure Container Apps Environment](/azure/container-apps/environment), to run the container apps instances.
- [Azure OpenAI Service](/azure/ai-services/openai/overview).
- [Azure Container Registry](/azure/container-registry/container-registry-intro), to build and save images for the application.
- [Azure Container Apps](/azure/container-apps/overview) instance for this application.
- [Managed Identities](/entra/identity/managed-identities-azure-resources/overview) for security connections.

Read the [bicep scripts](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/infra/bicep/main.bicep) to learn more about the deployment of the structure.

## How to implement the first AI application

This sample is an AI chat assistent based on Retrieval Augmented Generation(RAG), it uses Spring AI SDKs to connect to Azure OpenAI service.

### Concept

Here we introduce some key concept on how to implement an AI application.

1. Spring AI

   [Spring AI](https://spring.io/projects/spring-ai) is an application framework for AI engineering. Its goal is to apply to the AI domain Spring ecosystem design principles such as portability and modular design and promote using POJOs as the building blocks of an application to the AI domain.

   There is another popular AI framework [langchain4j](https://docs.langchain4j.dev/intro), and you may find the samples in [Spring PetClinic With OpenAI and Langchain4j](https://github.com/Azure-Samples/spring-petclinic-langchain4j).

1. RAG in Azure OpenAI

   RAG with Azure OpenAI allows developers to use supported AI chat models that can reference specific sources of information to ground the response. Adding this information allows the model to reference both the specific data provided and its pretrained knowledge to provide more effective responses.

   Azure OpenAI enables RAG by connecting pretrained models to your own data sources. Azure OpenAI on your data utilizes the search ability of Azure AI Search to add the relevant data chunks to the prompt. Once your data is in a AI Search index, Azure OpenAI on your data goes through the following steps:

   - Receive user prompt.
   - Determine relevant content and intent of the prompt.
   - Query the search index with that content and intent.
   - Insert search result chunk into the Azure OpenAI prompt, along with system message and user prompt.
   - Send entire prompt to Azure OpenAI.
   - Return response and data reference (if any) to the user.

   By default, Azure OpenAI on your data encourages, but doesn't require, the model to respond only using your data. This setting can be unselected when connecting your data, which may result in the model choosing to use its pretrained knowledge over your data.

   See more from [Spring AI Chat Client](https://docs.spring.io/spring-ai/reference/api/chatclient.html) and [Implement Retrieval Augmented Generation (RAG) with Azure OpenAI Service ](/training/modules/use-own-data-azure-openai).

### Code implementation

Some introduction to the code for readers to understand the flows of the first AI application.

1. The Rest Controller to talk to ChatClient

   In [PetclinicChatClient](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java), we implement the rest function /chat, in this function, we call the chatClient with user inputs.

   ```java
   return this.chatClient.prompt().user(u -> u.text(query)).call().content();
   ```

1. We use [ChatConfiguration](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ChatConfiguration.java) to customize the chatClient.

   Some key configuration of the chatClient, see function `ChatClientCustomizer`:
   - Client to connect to Azure OpenAI. Both api-key and managed identity supported.
   - ChatModel. Deployment gpt-4o and temperature 0.7 is setted in configuration file.
   - VectorStore. This is used to store the semantic vectors (embeddings).
   - System Prompt. Customize AI behavior and enhance performance.
   - Functions. Customized functions for OpenAI to interact with bussiness system, this is the AI capabilities to your bussiness.
   - Advisors. Provides a flexible and powerful way to intercept, modify, and enhance AI-driven interactions in your Spring applications.

1. Functions

   The bean names of `java.util.Function`s defined in the application context. We implemented some functions in [AIFunctionConfiguration](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/AIFunctionConfiguration.java).

   - The @Description annotation of these functions help the AI models to understand the functions.
   - The function body varies depending on your bussiness requirements.

1. Advisors

   See more from [Spring AI advisors](https://docs.spring.io/spring-ai/reference/api/advisors.html).

   In this simple example, we implement a [ModeledQuestionAnswerAdvisor](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ModeledQuestionAnswerAdvisor.java). First a call to AI to generate a new user prompt and then use the AI-refined user prompt to retrieve again. We find this will improve the quality of the response.

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. 

Two simple options to clean up the resources:

1. Use the [Azure portal](https://portal.azure.com?azure-portal=true). Find the resource group of this sample, and delete the resource group directly.

1. Delete the resource group by using Azure CLI, use the following commands:

   ```azurecli
   az group delete --name <resource-group-name>
   ```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about developing in Java on Container Apps](java-overview.md)
