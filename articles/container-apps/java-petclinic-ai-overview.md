---
title: Introduction to the Java PetClinic AI Sample in Azure Container Apps
description: Explains the architecture of AI applications deployed to Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: sonwan
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 02/12/2025
ms.custom: devx-track-java, devx-track-extended-java
#customer intent: As a developer, I want to understand the architecture of AI applications deployed to Azure Container Apps.
---

# Java PetClinic AI sample in Container Apps overview

The Spring PetClinic sample is a classic reference application that demonstrates the use of Spring Boot with Java. This tutorial features an AI-enhanced version built on Azure Container Apps that extends the traditional PetClinic management system with modern AI capabilities.

The application you build in this tutorial is an AI chat assistant that uses Retrieval Augmented Generation (RAG). To connect to Azure OpenAI Service, the application uses Spring AI SDKs to support the web application. For more information on RAG, see [Implement Retrieval Augmented Generation (RAG) with Azure OpenAI Service](/training/modules/use-own-data-azure-openai).

The application features many different services working together to introduce the AI-related features to the Spring PetClinic sample.

## Architecture of the AI app in Azure Container Apps

The following diagram shows the architecture of the AI application in Azure Container Apps:

:::image type="complex" source="media/java-ai-application/architecture-chart.png" alt-text="Diagram of the architecture of the AI application, which includes a Container Apps environment, an API gateway, Entra ID for authentication, and other components." lightbox="media/java-ai-application/architecture-chart.png":::
   Diagram that shows the architecture of the AI application. Users access the system through authentication managed by Entra ID. The Azure Container App environment contains an API gateway that enables routing for and communication with the application. The API gateway uses managed identities to securely interact with Azure Container Registry and cognitive services. The API gateway also handles communication with external users. A virtual network between the API gateway and external systems provides secure and isolated network connectivity.
:::image-end:::

The application's API gateway, hosted in the Azure Container Apps environment, serves as the central entry point for all external requests.

This gateway performs the following functions:

- Routes and manages communication between application components.
- Authenticates users through Microsoft Entra ID.
- Secures access to Azure Container Registry and cognitive services using managed identities.
- Handles all incoming external user requests.

The gateway operates within a dedicated virtual network, ensuring secure and isolated communication between the application and external systems.

The following table describes the key components and services featured in the application:

| Service or feature                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Azure Container Apps](/azure/container-apps/overview)                            | A fully managed, serverless container platform for building and deploying modern apps. Handles autoscaling, traffic splitting, and revision management of containerized applications.                                                                                                                                                                                                                                                 |
| [Azure Container Apps environment](/azure/container-apps/environment)             | A secure boundary around a group of container apps that share networking, scaling, and management configurations. Provides the foundational runtime for a container apps deployment.                                                                                                                                                                                                                                                   |
| [Azure OpenAI Service](/azure/ai-services/openai/overview)                        | Provides REST API access to OpenAI's ChatGPT, embeddings, and powerful language models like GPT-4. Enables AI capabilities with enterprise-grade security and compliance features.                                                                                                                                                                                                                                                   |
| [Azure Container Registry](/azure/container-registry/container-registry-intro)    | A private Docker registry service for storing and managing container images. Supports automated container builds, vulnerability scanning, and geo-replication.                                                                                                                                                                                                                                                                       |
| [Managed Identities](/entra/identity/managed-identities-azure-resources/overview) | Provides Azure services with automatically managed identities in Azure AD. Eliminates the need for credential management by allowing secure service-to-service authentication without storing credentials in code.                                                                                                                                                                                                                   |
| [Spring AI](https://spring.io/projects/spring-ai)                                 | Spring framework for AI engineering that applies AI design principles to the Spring ecosystem. Alternatively, [Langchain4j](https://docs.langchain4j.dev/intro) is another AI framework with its own PetClinic sample in [spring-petclinic-langchain4j](https://github.com/Azure-Samples/spring-petclinic-langchain4j). For more information, see [Chat Client API](https://docs.spring.io/spring-ai/reference/api/chatclient.html).|

For more information on the infrastructure as code elements of the application, see the [bicep scripts](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/infra/bicep/main.bicep) in the [Bring your first AI app in Azure Container Apps](https://github.com/Azure-Samples/spring-petclinic-ai/) repository.

## Code implementation

The following sections provide an introduction to the code to help you understand the flow of this first AI application.

### Making REST calls

The `ChatClient` controller is responsible for communicating with the chat client endpoint. The syntax for submitting a prompt in [PetclinicChatClient.java](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java) includes the object `chatClient` to submit user input.

```java
return this.chatClient.prompt().user(u -> u.text(query)).call().content();
```

### Chat customizations

The [`ChatConfiguration`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ChatConfiguration.java) class customizes requests sent to `chatClient`. The following list describes some key configuration settings of `chatClient`:

- Connections authentication: The client connects to Azure OpenAI. Both API key authentication and managed identity authentication are supported.
- Configuration settings location: For `ChatModel`, deployment `gpt-4o` and temperature `0.7` are set in the configuration file.
- Vector database: The vector database stores mathematical representations of source documents, known as *embeddings*. The vector data is used by the chat API to find documents relevant to a user's question.
- System prompt: Customize AI behavior and enhance performance.
- API endpoints: The application features customized Azure Functions endpoints so that OpenAI can interact with the application.
- Advisors: Advisors provide a flexible and powerful way to intercept, modify, and enhance AI-driven interactions in your Spring applications.

### Example

The following code example shows how the  `ChatClientCustomizer` class loads configuration information:

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

### API endpoints

The beans defined under `java.util.Function` are functions defined in the application context. These functions are the interface between the AI models and the PetClinic application.

There are sample functions in [AIFunctionConfiguration.java](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/AIFunctionConfiguration.java) that communicate with the PetClinic application. Keep in mind the following details about these functions:

- The `@Description` annotations to functions help the AI models understand the functions in a natural language.
- The function body varies, depending on your business requirements.

### Advisors

Advisors are components that modify or enhance AI prompts, which act as middleware for prompt processing.

This application uses two different advisors:

- [`QuestionAnswerAdvisor`](https://github.com/Azure-Samples/spring-petclinic-ai/blob/main/src/main/java/org/springframework/samples/petclinic/genai/ModeledQuestionAnswerAdvisor.java) calls the AI models to generate a new user query that includes the results from the search vector, before finalizing the prompt.
- `PromptChatMemoryAdvisor` adds chat memory into the prompt and provides a conversation history to the chat model. With this context, the AI model can remember the context of the chat and improve the chat quality.

For more information, see [Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html).

## Next steps

> [!div class="nextstepaction"]
> [Deploy an AI-enabled instance of the Spring PetClinic on Azure Container Apps](java-petclinic-ai-tutorial.md)
