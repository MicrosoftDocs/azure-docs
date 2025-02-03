---
title: Introduction to the Java PetClinic AI Sample in Azure Container Apps
description: "Explains the architecture of AI applications deployed to Azure Container Apps."
author: KarlErickson
ms.author: sonwan
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 02/03/2025
ms.custom: devx-track-java, devx-track-extended-java
#customer intent: As a developer, I want to understand the architecture of AI applications deployed to Azure Container Apps.
---

# Introduction to the Java PetClinic AI sample

In this tutorial, you explore the architecture of AI applications in Azure Container Apps and learn how to deploy these AI applications.

## Architecture of the AI app in Azure Container Apps

The following diagram shows the architecture of the AI application in Azure Container Apps:

:::image type="complex" source="media/first-java-ai-application/architecture-chart.png" alt-text="Diagram of the architecture of the AI application, which includes a Container Apps environment, an API gateway, Entra ID for authentication, and other components." lightbox="media/first-java-ai-application/architecture-chart.png":::
   Diagram that shows the architecture of the AI application. Users access the system through authentication managed by Entra ID. The Azure Container App environment contains an API gateway that enables routing for and communication with the application. The API gateway uses managed identities to securely interact with Azure Container Registry and cognitive services. The API gateway also handles communication with external users. A virtual network between the API gateway and external systems provides secure and isolated network connectivity.
:::image-end:::

The following are the key components of this sample application:

- [Azure Container Apps Environment](/azure/container-apps/environment), to run the container apps instances.
- [Azure OpenAI Service](/azure/ai-services/openai/overview).
- [Azure Container Registry](/azure/container-registry/container-registry-intro), to build and save images for the application.
- [Azure Container Apps](/azure/container-apps/overview) instance for this application.
- [Managed Identities](/entra/identity/managed-identities-azure-resources/overview) for security connections.

To learn more about the deployment of the structure, read the [bicep scripts](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/infra/bicep/main.bicep) in the [`spring-petclinic-ai`](https://github.com/Azure-Samples/spring-petclinic-ai/) repo.

## Apply your changes

If there are some changes to the code, apply the updates to Azure by using these commands:

```azurecli
azd package
azd deploy
```

## Implement the first application

The application introduced in this article is an AI chat assistant that uses Retrieval Augmented Generation (RAG). To connect to Azure OpenAI Service, the application uses Spring AI SDKs.

### Key concepts

This quickstart, which implements an AI application, uses the following key concepts:

- [Spring AI](https://spring.io/projects/spring-ai). This Spring application framework is used for AI engineering. Its goal is to apply Spring ecosystem design principles to the AI domain. [Langchain4j](https://docs.langchain4j.dev/intro) is another popular AI framework that has its own PetClinic sample in the [`spring-petclinic-langchain4j`
](https://github.com/Azure-Samples/spring-petclinic-langchain4j) repo. For more information, see [Chat Client API](https://docs.spring.io/spring-ai/reference/api/chatclient.html).

- RAG with Azure OpenAI. RAG allows developers to use supported AI chat models that can reference specific sources of information to ground the response. Adding this information allows the model to reference both the specific data provided and its pretrained knowledge to provide more effective responses. Azure OpenAI enables RAG by connecting pretrained models to your own data sources through the following steps:

    1. Receive the user prompt.
    1. Determine the relevant content and intent of the prompt.
    1. Query the search index with that content and intent.
    1. Insert a search result chunk into the Azure OpenAI prompt, along with the system message and the user prompt.
    1. Send the entire prompt to Azure OpenAI.
    1. Return the response and data reference (if any) to the user.

    For more information, see [Implement Retrieval Augmented Generation (RAG) with Azure OpenAI Service](/training/modules/use-own-data-azure-openai).

### Code implementation

The following information is an introduction to the code for readers to understand the flow of this first AI application:

1. The REST controller to talk to `ChatClient`. In [`PetclinicChatClient.java`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java), we implement the REST function `/chat`. To call `chatClient` with user inputs, use the following command:

    ```java
    return this.chatClient.prompt().user(u -> u.text(query)).call().content();
    ```

1. We use [`ChatConfiguration.java`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ChatConfiguration.java) to customize `chatClient`. The following are some key configurations of `chatClient`:

    - The client connects to Azure OpenAI. Both API key authentication and managed identity authentication are supported.
    - For `ChatModel`, deployment `gpt-4o` and temperature `0.7` are set in the configuration file.
    - `VectorStore`. The vector database stores mathematical representations of our documents, known as *embeddings*. The vector data is used by the chat API to find documents relevant to a user's question.
    - System prompt. Customize AI behavior and enhance performance.
    - Functions. Customized functions for OpenAI to interact with business system, these functions define the AI capabilities to your business.
    - Advisors. Provide a flexible and powerful way to intercept, modify, and enhance AI-driven interactions in your Spring applications.

    The following code example uses the `ChatClientCustomizer` function:

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

1. Functions. The bean names of the `java.util.Function` functions defined in the application context. The functions are the interface between AI models and your business system. There are sample functions in [`AIFunctionConfiguration.java`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/AIFunctionConfiguration.java) to talk to the PetClinic application. Keep in mind the following details about these functions:
    - The `@Description` annotations to functions help the AI models understand the functions in a natural language.
    - The function body varies depending on your business requirements.

1. The following are details about how we use advisors:
    - `QuestionAnswerAdvisor`. In this first AI application, we implement [`ModeledQuestionAnswerAdvisor.java`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ModeledQuestionAnswerAdvisor.java). First we call the AI models to generate a new user prompt, and then we use the AI-refined user prompt to retrieve again. This two-step user prompt improves the quality of the response.
    - `PromptChatMemoryAdvisor`. By using this advisor, we add chat memory into the prompt and provide a conversation history to the chat model. AI can remember the context of the chat and improve the chat quality.
    - For more information, see [Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html).

Refer to the source code for more details.

## Related content

- [Launch your first Java AI application to Azure Container Apps](first-java-ai-application.md).
