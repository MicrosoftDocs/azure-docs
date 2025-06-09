---
title: "Tutorial: ASP.NET Core chatbot with SLM extension"
description: "Learn how to deploy a ASP.NET Core application integrated with a Phi-4 sidecar extension on Azure App Service."
author: cephalin
ms.author: cephalin
ms.date: 05/07/2025
ms.topic: tutorial
ms.custom:
  - build-2025
---

# Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (ASP.NET Core)

This tutorial guides you through deploying a ASP.NET Core chatbot application integrated with the Phi-4 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

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
    cd use_sidecar_extension/dotnetapp
    az webapp up --sku P3MV3 --os-type linux
    ```

This startup command is a common setup for deploying ASP.NET Core applications to Azure App Service. For more information, see [Quickstart: Deploy an ASP.NET web app](quickstart-dotnetcore.md).

[!INCLUDE [phi-4-extension-create-test](includes/tutorial-ai-slm/phi-4-extension-create-test.md)]

## How the sample application works

The sample application demonstrates how to integrate a .NET service with the SLM sidecar extension. The `SLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in [use_sidecar_extension/dotnetapp/Services/SLMService.cs](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/use_sidecar_extension/dotnetapp/Services/SLMService.cs), you see that:

- The service reads the URL from `fashion.assistant.api.url`, which is set in *appsettings.json* and has the value of `http://localhost:11434/v1/chat/completions`.

    ```csharp
    public SLMService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiUrl = configuration["FashionAssistantAPI:Url"] ?? "httpL//localhost:11434";
    }
    ```

- The POST payload includes the system message and the prompt that's built from the selected product and the user query.

    ```csharp
    var requestPayload = new
    {
        messages = new[]
        {
            new { role = "system", content = "You are a helpful assistant." },
            new { role = "user", content = prompt }
        },
        stream = true,
        cache_prompt = false,
        n_predict = 150
    };
    ```

- The POST request streams the response line by line. Each line is parsed to extract the generated content (or token).

    ```csharp
    var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
    response.EnsureSuccessStatusCode();

    var stream = await response.Content.ReadAsStreamAsync();
    using var reader = new StreamReader(stream);

    while (!reader.EndOfStream)
    {
        var line = await reader.ReadLineAsync();
        line = line?.Replace("data: ", string.Empty).Trim();
        if (!string.IsNullOrEmpty(line) && line != "[DONE]")
        {
            var jsonObject = JsonNode.Parse(line);
            var responseContent = jsonObject?["choices"]?[0]?["delta"]?["content"]?.ToString();
            if (!string.IsNullOrEmpty(responseContent))
            {
                yield return responseContent;
            }
        }
    }
    ```

[!INCLUDE [faq](includes/tutorial-ai-slm/faq.md)]

## Next steps

[Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md)
