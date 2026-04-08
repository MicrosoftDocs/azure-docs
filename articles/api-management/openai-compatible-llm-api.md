---
title: Import Language Model API - Azure API Management
description: How to import an OpenAI-compatible language model or a non-OpenAI-compatible AI model as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 02/26/2026
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to
---

# Import a language model API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can import OpenAI-compatible language model endpoints to your API Management instance, or import non-compatible models as passthrough APIs. For example, manage self-hosted LLMs or those hosted on inference providers other than Foundry Tools. Use AI gateway policies and other API Management capabilities to simplify integration, improve observability, and enhance control over model endpoints.

Learn more about managing AI APIs in API Management:

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Language model API types

API Management supports two language model API types. Choose the option that matches your model deployment, which determines how clients call the API and how requests get route to the AI service.

* **OpenAI-compatible** - Language model endpoints compatible with OpenAI's API. Examples include [Hugging Face Text Generation Inference (TGI)](https://huggingface.co/docs/text-generation-inference/en/index) and [Google Gemini API](openai-compatible-google-gemini-api.md).

    API Management configures a chat completions endpoint. 

* **Passthrough** - Language model endpoints not compatible with OpenAI's API. Examples include models deployed in [Amazon Bedrock](amazon-bedrock-passthrough-llm-api.md) or other providers.

    API Management configures wildcard operations for common HTTP verbs. Clients can append paths to wildcard operations, and API Management passes requests to the backend.  

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A self-hosted or non-Azure-provided language model deployment with an API endpoint.  


## Import language model API by using the portal

Importing the LLM API automatically configures:

* A [backend](backends.md) resource and [set-backend-service](set-backend-service-policy.md) policy that direct requests to the LLM endpoint.
* (optionally) Access using an access key (protected as a secret [named value](api-management-howto-properties.md)).
* (optionally) Policies to monitor and manage the API.

To import a language model API:

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **Language Model API**.

    :::image type="content" source="media/openai-compatible-llm-api/openai-api.png" alt-text="Screenshot of creating an OpenAI-compatible API in the portal." :::

1. On the **Configure API** tab:
    1. Enter a **Display name** and **Description** (optional).
    1. Enter the LLM API **URL**.
    1. Select one or more **Products** to associate with the API (optional).  
    1. In **Path**, append the path to access the LLM API.
    1. Select either **Create OpenAI API** or **Create a passthrough API**. See [Language model API types](#language-model-api-types).
    1. Enter the authorization header name and API key (if required). 
    1. Select **Next**.

    :::image type="content" source="media/openai-compatible-llm-api/configure-api.png" alt-text="Screenshot of language model API configuration in the portal.":::

1. On the **Manage token consumption** tab, enter settings or accept defaults for the following policies:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-emit-token-metric-policy.md) 
1. On the **Apply semantic caching** tab, enter settings or accept defaults for the policy to optimize performance and reduce latency:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
1. On the **AI content safety** tab, enter settings or accept defaults to configure Azure AI Content Safety to block unsafe content:
    * [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review**.
1. After validation, select **Create**. 

API Management creates the API and configures operations for the LLM endpoints. By default, the API requires an API Management subscription.

## Test the LLM API

Verify your LLM API in the test console. 
1. Select the API you created.
1. Select the **Test** tab.
1. Select an operation compatible with the model deployment.
    Fields for parameters and headers appear.
1. Enter parameters and headers. Depending on the operation, configure or update a **Request body** as needed.
    > [!NOTE]
    > The test console automatically adds an **Ocp-Apim-Subscription-Key** header (using the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription)), which provides access to every API. To display it, select the "eye" icon next to **HTTP Request**.
1. Select **Send**.

    When the test succeeds, the backend returns data including token usage metrics to monitor language model consumption.

## Related content

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)