---
title:  AI Applications in Azure Container Apps
description: "Explains the architecture and deployment of AI applications in Azure Container Apps."
author: KarlErickson
ms.author: sonwan
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 12/12/2024
ms.custom: devx-track-java, devx-track-extended-java
#customer intent: As a developer, I want to understand the architecture of AI applications in Azure Container Apps so that I can deploy my AI applications in that environment.
---

# AI applications in Azure Container Apps

In this tutorial, you explore the architecture of AI applications in Azure Container Apps and learn how to deploy these applications.

## Prerequisites

## General architecture structure

The following diagram shows the architecture of the AI application on Azure Container Apps:

:::image type="complex" source="media/first-ai-application/architecture-chart.png" alt-text="Diagram of the architecture of the AI application." lightbox="media/first-ai-application/architecture-chart.png":::
   Diagram that shows the architecture of the AI application. Users access the system through authentication managed by Entra ID. The Azure Container App environment contains an API gatewway that enables routing for and communication with the application. The API gateway uses managed identities to securely interact with the Azure Container Registry and with Azure Cognitive Services. The API gateway also handles communication with external users. A virtual network between the API gateway and external systems provides secure and isolated network connectivity.
:::image-end:::

The following are the key components of this sample application:

- [Azure Container Apps Environment](/azure/container-apps/environment), to run the container apps instances.
- [Azure OpenAI Service](/azure/ai-services/openai/overview).
- [Azure Container Registry](/azure/container-registry/container-registry-intro), to build and save images for the application.
- [Azure Container Apps](/azure/container-apps/overview) instance for this application.
- [Managed Identities](/entra/identity/managed-identities-azure-resources/overview) for security connections.

Read the [bicep scripts](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/infra/bicep/main.bicep) to learn more about the deployment of the structure.

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

    1. Receive the user prompt.
    1. Determine the relevant content and intent of the prompt.
    1. Query the search index with that content and intent.
    1. Insert a search result chunk into the Azure OpenAI prompt, along with system message and user prompt.
    1. Send the entire prompt to Azure OpenAI.
    1. Return the response and data reference (if any) to the user.

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

## Related content

- [Java on Azure Container Apps overview](first-ai-application.md)
