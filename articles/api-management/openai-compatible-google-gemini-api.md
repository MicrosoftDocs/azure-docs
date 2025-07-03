---
title: Import OpenAI-Compatible Google Gemini API - Azure API Management
description: How to import an OpenAI-compatible Google Gemini model as a REST API in Azure API Management and manage a chat completions endpoint
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 07/03/2025
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to
---

# Import an OpenAI-compatible Google Gemini API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows you how to import an OpenAI-compatible Google Gemini API to access models such as `gemini-2.0-flash`. For these models, Azure API Management can manage an OpenAI-compatible chat completions endpoint.

Learn more about managing AI APIs in API Management:

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)
* [Importing and managing OpenAI-compatible language model APIs in Azure API Management](openai-compatible-llm-api.md)

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An API key for the Gemini API. If you don't have one, create it at [Google AI Studio](https://aistudio.google.com/apikey) and store it in a safe location.

## Import language model API using the portal



## Import an OpenAI-compatible Gemini model

1. Create an API key for the Gemini API at [Google AI Studio](https://aistudio.google.com/apikey) and store it in a safe location.
1. Note the following base URL from the [Gemini OpenAI compatibility documentation](https://ai.google.dev/gemini-api/docs/openai).

    `https://generativelanguage.googleapis.com/v1beta/openai`

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **Language Model API**.
1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. In **URL**, enter the following base URL base URL from the [Gemini OpenAI compatibility documentation](https://ai.google.dev/gemini-api/docs/openai):
         `https://generativelanguage.googleapis.com/v1beta/openai`

1. In **Path**, append a path that your API Management instance uses to route requests to the Gemini API endpoints.
1. In **Type**, select **Create OpenAI API**.
1. In **Access key**, enter the following:
    1. **Header name**: *Authorization*.
    1. **Header value (key)**: `Bearer` followed by your API key for the Gemini API .
1. On the remaining tabs, optionally configure policies to manage token consumption, semantic caching, and AI content safety. For details, see [Import an OpenAI-compatible language model API](openai-compatible-llm-api.md).

    :::image type="content" source="media/openai-compatible-llm-api/gemini-import.png" alt-text="Screenshot of importing a Gemini LLM API in the portal.":::
1. Select **Create**.

### Test Gemini model

After importing the API, you can test the chat completions endpoint for the API.

1. Select the API that you created in the previous step.
1. Select the **Test** tab.
1. Select the `POST  Creates a model response for the given chat conversation` operation, which is a `POST` request to the `/chat/completions` endpoint.
1. In the **Request body** section, enter the following JSON to specify the model and an example prompt. In this example, the `gemini-2.0-flash` model is used.

    ```json
    {
        "model": "gemini-2.0-flash",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant"
            },
            {
                "role": "user",
                "content": "How are you?"
            }
        ],
        "max_tokens": 50
    }
    ```
    
    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your language model token consumption.

    :::image type="content" source="media/openai-compatible-google-gemini-api/gemini-test.png" alt-text="Screenshot of testing a Gemini LLM API in the portal.":::

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
