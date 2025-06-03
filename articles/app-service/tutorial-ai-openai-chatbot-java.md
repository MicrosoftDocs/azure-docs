---
title: Intelligent app with Azure OpenAI (Spring Boot)
description: Learn how to build and deploy a Java web app to Azure App Service that connects to Azure OpenAI using managed identity.
author: cephalin
ms.author: cephalin
ms.date: 05/19/2025
ms.topic: tutorial
ms.custom:
  - devx-track-java
  - linux-related-content
  - build-2025
ms.collection: ce-skilling-ai-copilot
---

# Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (Spring Boot)

In this tutorial, you'll build an intelligent AI application by integrating Azure OpenAI with a Java Spring Boot application and deploying it to Azure App Service. You'll create a Spring Boot controller that sends a query to Azure OpenAI and sends the response to the browser.

> [!TIP]
> While this tutorial uses Spring Boot, the core concepts of building a chat application with Azure OpenAI apply to any Java web application. If you're using a different hosting option on App Service, such as Tomcat or JBoss EAP, you can adapt the authentication patterns and Azure SDK usage shown here to your preferred framework.

:::image type="content" source="media/tutorial-ai-openai-chatbot-java/chat-in-browser.png" alt-text="Screenshot showing a chatbot running in Azure App Service.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure OpenAI resource and deploy a language model.
> * Build a Spring Boot application that connects to Azure OpenAI.
> * Use dependency injection to configure the Azure OpenAI client.
> * Deploy the application to Azure App Service.
> * Implement passwordless secure authentication both in the development environment and in Azure.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [GitHub account](https://github.com/join) for using GitHub Codespaces

## 1. Create an Azure OpenAI resource

[!INCLUDE [tutorial-ai-openai-chatbot/create-openai-resource](includes/tutorial-ai-openai-chatbot/create-openai-resource.md)]

## 2. Create and set up a Spring Boot web app

1. In your Codespace terminal, clone the Spring Boot REST sample to the workspace and try running it the first time.

    ```bash
    git clone https://github.com/rd-1-2022/rest-service .
    mvn spring-boot:run
    ```

    You should see a notification in GitHub Codespaces indicating that the app is available at a specific port. Select **Open in browser** to launch the app in a new browser tab. When you see the white label error page, the Spring Boot app is working.

2. Back in the Codespace terminal, stop the app with Ctrl+C.

3. Open *pom.xml* and add the following dependencies:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-openai</artifactId>
        <version>1.0.0-beta.16</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-core</artifactId>
        <version>1.55.3</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.16.0</version>
        <scope>compile</scope>
    </dependency>
    ```

4. In the same directory as Application.java (*src/main/java/com/example/restservice*) add a Java file called *ChatController.java* and copy the following content into it:

    ```java
    package com.example.restservice;
    
    import java.util.ArrayList;
    import java.util.List;
    
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;
    import org.springframework.web.bind.annotation.RequestParam;
    
    import com.azure.ai.openai.OpenAIAsyncClient;
    import com.azure.ai.openai.models.ChatChoice;
    import com.azure.ai.openai.models.ChatCompletionsOptions;
    import com.azure.ai.openai.models.ChatRequestMessage;
    import com.azure.ai.openai.models.ChatRequestUserMessage;
    import com.azure.ai.openai.models.ChatResponseMessage;
    import com.azure.core.credential.TokenCredential;
    import com.azure.identity.DefaultAzureCredentialBuilder;
    
    @Configuration
    class AzureConfig {
        // Reads the endpoint from environment variable AZURE_OPENAI_ENDPOINT
        @Value("${azure.openai.endpoint}")
        private String openAiEndpoint;
    
        // Provides a credential for local dev and production
        @Bean
        public TokenCredential tokenCredential() {
            return new DefaultAzureCredentialBuilder().build();
        }
    
        // Configures the OpenAIAsyncClient bean
        @Bean
        public OpenAIAsyncClient openAIClient(TokenCredential tokenCredential) {
            return new com.azure.ai.openai.OpenAIClientBuilder()
                    .endpoint(openAiEndpoint)
                    .credential(tokenCredential)
                    .buildAsyncClient();
        }
    }
    
    @Controller
    public class ChatController {
        private final OpenAIAsyncClient openAIClient;
    
        // Inject the OpenAIAsyncClient bean
        public ChatController(OpenAIAsyncClient openAIClient) {
            this.openAIClient = openAIClient;
        }
    
        @RequestMapping(value = "/", method = RequestMethod.GET)
        public String chatFormOrWithMessage(Model model, @RequestParam(value = "userMessage", required = false) String userMessage) {
            String aiResponse = null;
            if (userMessage != null && !userMessage.isBlank()) {
    
                // Create a list of chat messages
                List<ChatRequestMessage> chatMessages = new ArrayList<>();
                chatMessages.add(new ChatRequestUserMessage(userMessage));
    
                // Send the chat completion request
                String deploymentName = "gpt-4o-mini";
                StringBuilder serverResponse = new StringBuilder();
                var chatCompletions = openAIClient.getChatCompletions(
                    deploymentName, 
                    new ChatCompletionsOptions(chatMessages)
                ).block();
                if (chatCompletions != null) {
                    for (ChatChoice choice : chatCompletions.getChoices()) {
                        ChatResponseMessage message = choice.getMessage();
                        serverResponse.append(message.getContent());
                    }
                }
                aiResponse = serverResponse.toString();
            }
            model.addAttribute("aiResponse", aiResponse);
            return "chat";
        }
    }
    ```

    > [!TIP]
    > To minimize the files in this tutorial, the code combines the Spring `@Configuration` and `@Controller` classes in one file. In production, you would normally separate configuration and business logic for maintainability.

5. Under *src/main/resources*, create a *templates* directory, and add a *chat.html* with the following content for the chat interface:

    ```html
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <title>Azure OpenAI Chat</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
    <div class="container py-4">
        <h2 class="mb-4">Azure OpenAI Chat</h2>
        <form action="/" method="get" class="d-flex mb-3">
            <input name="userMessage" class="form-control me-2" type="text" placeholder="Type your message..." autocomplete="off" required />
            <button class="btn btn-primary" type="submit">Send</button>
        </form>
        <div class="mb-3">
            <div th:if="${aiResponse}" class="alert alert-info">AI: <span th:text="${aiResponse}"></span></div>
        </div>
    </div>
    </body>
    </html>
    ```

5. In the terminal, retrieve your OpenAI endpoint:

    ```bash
    az cognitiveservices account show \
      --name $OPENAI_SERVICE_NAME \
      --resource-group $RESOURCE_GROUP \
      --query properties.endpoint \
      --output tsv
    ```

6. Run the app again by adding `AZURE_OPENAI_ENDPOINT` with its value from the CLI output:

   ```bash
   AZURE_OPENAI_ENDPOINT=<output-from-previous-cli-command> mvn spring-boot:run
   ```

7. Select **Open in browser** to launch the app in a new browser tab. 

8. Type a message in the textbox and select "**Send**, and give the app a few seconds to reply with the message from Azure OpenAI.

The application uses [DefaultAzureCredential](/azure/developer/java/sdk/authentication/credential-chains#defaultazurecredential-overview), which automatically uses your Azure CLI signed in user for token authentication. Later in this tutorial, you'll deploy your web app to Azure App Service and configure it to securely connect to your Azure OpenAI resource using managed identity. The same `DefaultAzureCredential` in your code can detect the managed identity and use it for authentication. No extra code is needed.

## 3. Deploy to Azure App Service and configure OpenAI connection

Now that your app works locally, let's deploy it to Azure App Service and set up a service connection to Azure OpenAI using managed identity.

1. Create a deployment package with Maven.

    ```bash
    mvn clean package
    ```

2. First, deploy your app to Azure App Service using the Azure CLI command `az webapp up`. This command creates a new web app and deploys your code to it:

    ```bash
    az webapp up \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --name $APPSERVICE_NAME \
      --plan $APPSERVICE_NAME \
      --sku B1 \
      --runtime "JAVA:21" \
      --os-type Linux \
      --track-status false
    ```

   This command might take a few minutes to complete. It creates a new web app in the same resource group as your OpenAI resource.

3. After the app is deployed, create a service connection between your web app and the Azure OpenAI resource using managed identity:

    ```bash
    az webapp connection create cognitiveservices \
      --resource-group $RESOURCE_GROUP \
      --name $APPSERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP \
      --account $OPENAI_SERVICE_NAME \
      --system-identity
    ```

   This command creates a connection between your web app and the Azure OpenAI resource by: 

    - Generating system-assigned managed identity for the web app.
    - Adding the Cognitive Services OpenAI Contributor role to the managed identity for the Azure OpenAI resource.
    - Adding the `AZURE_OPENAI_ENDPOINT` app setting to your web app.

4. Open the deployed web app in the browser. 

    ```azurecli
    az webapp browse
    ```    

5. Type a message in the textbox and select "**Send**, and give the app a few seconds to reply with the message from Azure OpenAI.

    :::image type="content" source="media/tutorial-ai-openai-chatbot-java/chat-in-browser.png" alt-text="Screenshot showing a chatbot running in Azure App Service.":::

Your app is now deployed and connected to Azure OpenAI with managed identity. Note that is it accessing the `AZURE_OPENAI_ENDPOINT` app setting through the [@Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) injection.

## Frequently asked questions

- [Why does the sample use `@Configuration` and Spring beans for the OpenAI client?](#why-does-the-sample-use-configuration-and-spring-beans-for-the-openai-client)
- [What if I want to connect to OpenAI instead of Azure OpenAI?](#what-if-i-want-to-connect-to-openai-instead-of-azure-openai)
- [Can I connect to Azure OpenAI with an API key instead?](#can-i-connect-to-azure-openai-with-an-api-key-instead)
- [How does DefaultAzureCredential work in this tutorial?](#how-does-defaultazurecredential-work-in-this-tutorial)

### Why does the sample use `@Configuration` and Spring beans for the OpenAI client?

Using a Spring bean for the `OpenAIAsyncClient` ensures that:

- All configuration properties (like the endpoint) are loaded and injected by Spring.
- The credential and client are created after the application context is fully initialized.
- Dependency injection is used, which is the standard and most robust pattern in Spring applications.

The asynchronous client is more robust, especially when using `DefaultAzureCredential` with Azure CLI authentication. The synchronous `OpenAIClient` can encounter issues with token acquisition in some local development scenarios. Using the asynchronous client avoids these issues and is the recommended approach.

---

### What if I want to connect to OpenAI instead of Azure OpenAI?

To connect to OpenAI instead, use the following code:

```java
OpenAIClient client = new OpenAIClientBuilder()
    .credential(new KeyCredential(<openai-api-key>))
    .buildClient();
```

For more information, see [OpenAI API authentication](https://platform.openai.com/docs/api-reference/authentication).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

---

### Can I connect to Azure OpenAI with an API key instead?

Yes, you can connect to Azure OpenAI using an API key instead of managed identity. This approach is supported by the Azure OpenAI SDKs and Semantic Kernel. 

- For details on using API keys with Semantic Kernel: [Semantic Kernel C# Quickstart](/semantic-kernel/get-started/quick-start-guide?pivots=programming-language-java).
- For details on using API keys with the Azure OpenAI client library: [Quickstart: Get started using chat completions with Azure OpenAI Service](/azure/ai-services/openai/chatgpt-quickstart?pivots=programming-language-java).

When working with connection secrets in App Service, you should use [Key Vault references](app-service-key-vault-references.md) instead of storing secrets directly in your codebase. This ensures that sensitive information remains secure and is managed centrally.

---

### How does DefaultAzureCredential work in this tutorial?

The `DefaultAzureCredential` simplifies authentication by automatically selecting the best available authentication method:

- **During local development**: After you run `az login`, it uses your local Azure CLI credentials.
- **When deployed to Azure App Service**: It uses the app's managed identity for secure, passwordless authentication.

This approach lets your code run securely and seamlessly in both local and cloud environments without modification.

## Next steps

- [Tutorial: Build a Retrieval Augmented Generation with Azure OpenAI and Azure AI Search (Spring Boot)](tutorial-ai-openai-search-java.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Spring Boot)](tutorial-ai-slm-spring-boot.md)
- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource)
- [Configure Azure App Service](/azure/app-service/configure-common)
- [Enable managed identity for your app](overview-managed-identity.md)
- [Configure Java on Azure App Service](/azure/app-service/configure-language-java)
