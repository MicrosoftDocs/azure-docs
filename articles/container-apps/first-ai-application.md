---
title: Launch your first AI application to Azure Container Apps
description: Use the azd automation tool to deploy a sample AI application to Azure Container Apps.
services: container-apps
author:
ms.author: sonwan
ms.service: azure-container-apps
ms.topic: quickstart
ms.date:
ms.custom:
---

# Launch your first AI application to Azure Container Apps

This quickstart shows you how to launch your first AI application to Azure Container Apps. The article demonstrates how to deploy a sample AI chat assistant application based on the Spring PetClinic application to run on Azure Container Apps. The application uses the [Azure OpenAI Service](/azure/ai-services/openai/overview) and demonstrates how to automate deployment using the Azure Developer CLI (azd).

In this quickstart you deploy an AI-enabled application to Azure Container Apps, explore its architecture, and learn how to implement your first AI application in Azure Container Apps. The following screenshot shows the AI assistant:

:::image type="content" source="media/first-ai-application/home-with-chatbot.png"  alt-text="Screenshot of home." lightbox="media/first-ai-application/home-with-chatbot.png":::

## Prerequisites

- Azure account. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). To perform this quickstart, you need the **Contributor** and **User Access Administrator** roles, or the **Owner** role. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current).

- GitHub account. Get one for [free](https://github.com/join).

- [git](https://git-scm.com/downloads).

- [Azure CLI](/cli/azure/install-azure-cli).

- The [Microsoft Build of Open JDK](/java/openjdk/install). We recommend version 17.

- [Maven](https://maven.apache.org/download.cgi).

- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd). |

## General architecture structure

The following diagram shows the architecture of the AI application on Azure Container Apps:

:::image type="complex" source="media/first-ai-application/architecture-chart.png" alt-text="Diagram of the architecture of the AI application." lightbox="media/first-ai-application/architecture-chart.png":::
   Diagram that shows the architecture of the AI application. Users access the system through authentication managed by Entra ID. The Azure Container App environment contains an API gatewway that enables routing for and communication with the application. The API gateway uses managed identities to securely interact with the Azure Container Registry and with Azure Cognitive Services. The API gateway also handles communication with external users. A virtual network between the API gateway and external systems provides secure and isolated network connectivity.
:::image-end:::

The key components of this sample:

- [Azure Container Apps Environment](/azure/container-apps/environment), to run the container apps instances.
- [Azure OpenAI Service](/azure/ai-services/openai/overview).
- [Azure Container Registry](/azure/container-registry/container-registry-intro), to build and save images for the application.
- [Azure Container Apps](/azure/container-apps/overview) instance for this application.
- [Managed Identities](/entra/identity/managed-identities-azure-resources/overview) for security connections.

Read the [bicep scripts](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/infra/bicep/main.bicep) to learn more about the deployment of the structure.

## Install the extensions

Install the extensions by using the following command:

```bash
   az extension add -n containerapp --upgrade
```

## Prepare the project

To prepare the project, clone the [spring-petclinic-ai](https://github.com/Azure-Samples/spring-petclinic-ai) repository by using the following command:

```bash
git clone https://github.com/Azure-Samples/spring-petclinic-ai.git
```

## Deploy your application

> [!NOTE]
> This template uses [Azure OpenAI Service](/azure/ai-services/openai/overview) deployment modules **gpt-4o** and **text-embedding-ada-002**, which may not be available in all Azure regions. Check for [up-to-date region availability](/azure/ai-services/openai/concepts/models#standard-deployment-model-availability) and select a region during deployment accordingly.

We recommend using region **East US**, **East US 2**, **North Central US**, **South Central US**, **Sweden Central**, **West US**, or **West US 3**.

To deploy your application, use the following steps:

1. Log in to azd by using the following command:

    ```azurecli
    azd auth login
    ```

1. Auto deploy by using the following command:

   ```azurecli
   azd up
   ```

1. When the system prompts you, enter `first-ai` for the environment name. After that, enter values for your Azure Subscription and Azure location, substituting your actual values for the placeholders in the following prompt:

    ```azurecli
    ? Enter a new environment name: first-ai
    ? Select an Azure Subscription to use: <SUBSCRIPTION>
    ? Select an Azure location to use: <REGION>
    ```

It takes about 15 minutes to get your first AI application ready. The following is typical output:

```azurecli
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

## Try your application

Now you can start using your application. Open the app by selecting the URL from the deploy output:

```
INFO: Deploy finish succeed!
INFO: App url: https://petclinic-ai.<cluster>.<region>.azurecontainerapps.io
```

The Petclinic page and AI assistant assistant appear. You can get help by having a natural language chat with the AI assistant, which can assist you with the following tasks:

- Querying the registered pet owners
- Adding a new pet owner
- Updating the pet owner's information
- Adding a new pet
- Querying the vets' information

The following image shows a chat where the user asks the AI assistant to register a new owner with a pet to the PetClinic, and the AI assistant then performs these tasks:

:::image type="content" source="media/first-ai-application/add-new-item.png" alt-text="Screenshot of AI chat assistant adding new item.":::

The capabilities of the AI assistant depend on the model you deploy in Azure OpenAI and the implementation of the defined functions.

## Apply your changes

If there are some changes to the code, apply the updates to Azure by using these commands:

```azurecli
   azd package
   azd deploy
```

## Implement the first application

This sample is an AI chat assistant based on Retrieval Augmented Generation (RAG). It uses Spring AI SDKs to connect to Azure OpenAI service.

### Concept

This quickstart, which implements an AI application, uses the following key concepts:

- [Spring AI](https://spring.io/projects/spring-ai). This is an application framework for AI engineering. Its goal is to apply Spring ecosystem design principles to the AI domain. [langchain4j](https://docs.langchain4j.dev/intro) is another popular AI framework that has its own PetClinic sample. For more information on the the Spring PetClinic With OpenAI and Langchain4j, see the [spring-petclinic-langchain4j
](https://github.com/Azure-Samples/spring-petclinic-langchain4j) repo.

- RAG with Azure OpenAI. RAG allows developers to use supported AI chat models that can reference specific sources of information to ground the response. Adding this information allows the model to reference both the specific data provided and its pretrained knowledge to provide more effective responses. Azure OpenAI enables RAG by connecting pretrained models to your own data sources. Azure OpenAI uses your data in the following steps:

- Receive the user prompt.
- Determine the relevant content and intent of the prompt.
- Query the search index with that content and intent.
- Insert a search result chunk into the Azure OpenAI prompt, along with system message and user prompt.
- Send the entire prompt to Azure OpenAI.
- Return the response and data reference (if any) to the user.

For more information, see [Spring AI Chat Client](https://docs.spring.io/spring-ai/reference/api/chatclient.html) and [Implement Retrieval Augmented Generation (RAG) with Azure OpenAI Service](/training/modules/use-own-data-azure-openai).

### Code implementation

Some introduction to the code for readers to understand the flows of this first AI application.

1. The Rest Controller to talk to ChatClient
   In [PetclinicChatClient](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java), we implement the rest function `/chat`. We call the chatClient with user inputs.

   ```java
   return this.chatClient.prompt().user(u -> u.text(query)).call().content();
   ```

1. We use [ChatConfiguration](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ChatConfiguration.java) to customize the chatClient.

   Some key configuration of the chatClient, see function `ChatClientCustomizer`:

   - Client to connect to Azure OpenAI. Both api-key and managed identity supported.
   - ChatModel. Deployment `gpt-4o` and temperature `0.7` are set in configuration file.
   - VectorStore. The vector database stores mathematical representations of our documents, known as embeddings. The vectore data is used by the Chat API to find documents relevant to a user's question.
   - System Prompt. Customize AI behavior and enhance performance.
   - Functions. Customized functions for OpenAI to interact with business system, these functions define the AI capabilities to your business.
   - Advisors. Provides a flexible and powerful way to intercept, modify, and enhance AI-driven interactions in your Spring applications.

   ```java
   @Bean
   public ChatClientCustomizer chatClientCustomizer(VectorStore vectorStore, ChatModel model) {
       ChatMemory chatMemory = new InMemoryChatMemory();

       return b -> b.defaultSystem(systemResource)
           .defaultFunctions("listOwners", "listVets", "addPetToOwner", "addOwnerToPetclinic")
           .defaultAdvisors(new PromptChatMemoryAdvisor(chatMemory),
               new ModeledQuestionAnswerAdvisor(vectorStore, SearchRequest.defaults(), model));
   }
   ```

1. Functions

   The bean names of `java.util.Function`s defined in the application context. The functions are the interface between AI models and your business system. Here are some samples functions in [AIFunctionConfiguration](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/AIFunctionConfiguration.java), to talk to the petclinic application.
   - The `@Description` annotations to functions help the AI models to understand the functions in a natural language.
   - The function body varies depending on your business requirements.

1. Advisors

   See more from [Spring AI advisors](https://docs.spring.io/spring-ai/reference/api/advisors.html).

   - QuestionAnswerAdvisor. In this first AI application, we implement a [ModeledQuestionAnswerAdvisor](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ModeledQuestionAnswerAdvisor.java). First a call to AI models to generate a new user prompt and then use the AI-refined user prompt to retrieve again. This two-steps user prompts improve the quality of the response.
   - PromptChatMemoryAdvisor. Using this advisor we're adding chat memory into the prompt and providing a conversation history to the chat model. AI can remember the context of the chat and improve the chat quality.

Please refer to the source code for more details.

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to retain these resources. When you no longer need the resources, delete the resource group, which also deletes its resources.

### [Azure portal](#tab/azure-portal)

To delete the resources, use the [Azure portal](https://portal.azure.com?azure-portal=true) to find the resource group of this sample, and delete the resource group directly.

### [Azure CLI](#tab/azure-cli)

To delete the resource group, use following command:

```azurecli
   az group delete --name rg-first-ai
```

---

## Related content

- [Java on Azure Container Apps overview](java-overview.md)
