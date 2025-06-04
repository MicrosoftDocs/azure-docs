---
title: "Tutorial: Spring Boot chatbot with SLM extension"
description: "Learn how to deploy a Spring Boot application integrated with a Phi-4 sidecar extension on Azure App Service."
author: cephalin
ms.author: cephalin
ms.date: 05/07/2025
ms.topic: tutorial
ms.custom:
  - build-2025
---

# Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Spring Boot)

This tutorial guides you through deploying a Spring Boot-based chatbot application integrated with the Phi-4 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

[!INCLUDE [advantages](includes/tutorial-ai-slm/advantages.md)]

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription.
- A [GitHub account](https://github.com/).

## Deploy the sample application

1. In the browser, navigate to the [sample application repository](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar).
2. Start a new Codespace from the repository.
1. Log in with your Azure account:

    ```azurecli
    az login
    ```
    
1. Open the terminal in the Codespace and run the following commands:

    ```azurecli
    cd use_sidecar_extension/springapp
    ./mvnw clean package
    az webapp up --sku P3MV3 --runtime "JAVA:21-java21" --os-type linux
    ```

[!INCLUDE [phi-4-extension-create-test](includes/tutorial-ai-slm/phi-4-extension-create-test.md)]

## How the sample application works

The sample application demonstrates how to integrate a Java service with the SLM sidecar extension. The `ReactiveSLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in [use_sidecar_extension/springapp/src/main/java/com/example/springapp/service/ReactiveSLMService.java](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/use_sidecar_extension/springapp/src/main/java/com/example/springapp/service/ReactiveSLMService.java), you see that:

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

[!INCLUDE [faq](includes/tutorial-ai-slm/faq.md)]

## Next steps

[Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md)
