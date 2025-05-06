```markdown
---
title: "Tutorial: Spring Boot chatbot with SLM extension"
description: "Learn how to deploy a Spring Boot application integrated with a Phi-3 sidecar extension on Azure App Service."
author: "cephalin"
ms.author: "cephalin"
ms.date: "2025-05-06"
ms.topic: tutorial
ms.service: app-service
---

# Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (Spring Boot)

This tutorial guides you through deploying a Spring Boot-based chatbot application integrated with the Phi-3 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

Hosting your own small language model (SLM) offers several advantages:

- By hosting the model yourself, you maintain full control over your data. This ensures sensitive information is not exposed to third-party services, which is critical for industries with strict compliance requirements.
- Self-hosted models can be fine-tuned to meet specific use cases or domain-specific requirements. 
- Hosting the model close to your application or users minimizes network latency, resulting in faster response times and a better user experience.
- You can scale the deployment based on your specific needs and have full control over resource allocation, ensuring optimal performance for your application.
- Hosting your own model allows for greater flexibility in experimenting with new features, architectures, or integrations without being constrained by third-party service limitations.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription.
- A [GitHub account](https://github.com/).

## Deploy the sample application

1. In the browser, navigate to the [sample application repository](https://github.com/cephalin/sidecar-samples).
2. Start a new Codespace from the repository.
1. Log in with your Azure account:

    ```azurecli
    az login
    ```
    
1. Open the terminal in the Codespace and run the following commands:

    ```azurecli
    cd springapp
    ./mvnw clean package
    az webapp up --sku P3MV3 --runtime "JAVA:21-java21" --os-type linux
    ```

## Add the Phi-3 sidecar extension

In this section, you add the Phi-3 sidecar extension to your FastAPI application hosted on Azure App Service.

1. Navigate to the Azure portal and go to your app's management page.
2. In the left-hand menu, select **Deployment** > **Deployment Center**.
3. On the **Containers** tab, select **Add** > **Sidecar extension**.
4. In the sidecar extension options, select **AI: phi-3-mini-4k-instruct-q4-gguf (Experimental)**.
5. Provide a name for the sidecar extension.
6. Select **Save** to apply the changes.
7. Wait a few minutes for the sidecar extension to deploy. Keep selecting **Refresh** until the **Status** column shows **Running**.

## Test the chatbot

1. In your app's management page, in the left-hand menu, select **Overview**.
1. Under **Default domain**, select the URL to open your web app in a browser.
1. Verify that the chatbot application is running and responding to user inputs.

    :::image type="content" source="media/tutorial-ai-slm-dotnet/fashion-store-assistant-live.png" alt-text="screenshot showing the fashion assistant app running in the browser.":::

## How the sample application works

The sample application demonstrates how to integrate a Java service with the SLM sidecar extension. The `ReactiveSLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in https://github.com/cephalin/sidecar-samples/blob/webstacks/springapp/src/main/java/com/example/springapp/service/ReactiveSLMService.java, you see that:

- The service reads the URL from `fashion.assistant.api.url`, which is set in *application.properties* and has the value of `http://localhost:11434/v1/chat/completions`.

    ```java
    public ReactiveSLMService(@Value("${fashion.assistant.api.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();
    }
    ```
- The POST payload includes the system message and the prompt that's built from the selected product and the user query.

    ```java
    JSONObject requestJson = new JSONObject();
    JSONArray messages = new JSONArray();
    
    JSONObject systemMessage = new JSONObject();
    systemMessage.put("role", "system");
    systemMessage.put("content", "You are a helpful assistant.");
    messages.put(systemMessage);
    
    JSONObject userMessage = new JSONObject();
    userMessage.put("role", "user");
    userMessage.put("content", prompt);
    messages.put(userMessage);
    
    requestJson.put("messages", messages);
    requestJson.put("stream", true);
    requestJson.put("cache_prompt", false);
    requestJson.put("n_predict", 2048);
    
    String requestBody = requestJson.toString();
    ```

- The reactive POST request streams the response line by line. Each line is parsed to extract the generated content (or token).

    ```java
    return webClient.post()
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(requestBody))
            .accept(MediaType.TEXT_EVENT_STREAM)
            .retrieve()
            .bodyToFlux(String.class)
            .filter(line -> !line.equals("[DONE]"))
            .map(this::extractContentFromResponse)
            .filter(content -> content != null && !content.isEmpty())
            .map(content -> content.replace(" ", "\u00A0"));
    ```

## Next steps
