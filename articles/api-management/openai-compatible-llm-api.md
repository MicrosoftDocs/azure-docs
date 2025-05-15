---
title: Import an LLM API as REST API - Azure API Management
description: How to import an OpenAI-compatible LLM API or other AI model as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/14/2025
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an LLM API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[INTRO]

Learn more about managing AI APIs in API Management:

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A self-hosted LLM with an API endpoint. You can use an OpenAI-compatible LLM that's exposed by an inference provider such as [Hugging Face Text Generation Inference (TGI)](hhttps://huggingface.co/docs/text-generation-inference/en/index). Alternatively, you can access an LLM through a provider such as [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html).
    > [!NOTE]
    > API Management policies such as [llm-token-limit](llm-token-limit-policy.md) and [llm-emit-token-metric](llm-emit-token-metric-policy.md) are supported for APIs available through the [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api) or with OpenAI-compatible models served through third-party inference providers.


## Import LLM API using the portal

Jse the following steps to import an LLM API directly to API Management. 

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

Depending on the API type you select to import, API Management automatically configures different operations to call the API: 

* **OpenAI-compatible API** - Operations for the LLM API's chat completion endpoint
* **Passthrough API** - Wildcard operations for standard verbs `GET`, `HEAD`, `OPTIONS`, and `TRACK`. When you call the API, append any required path or parameters to the API request to pass a request to an LLM API endpoint.

For an OpenAI-compatible API, you can optionally configure policies to help you monitor and manage the API.

To import an LLM API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **OpenAI API**.

    :::image type="content" source="media/openai-compatible-llm-api/openai-api.png" alt-text="Screenshot of creating an OpenAI-compatible API in the portal." :::

1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. Enter the **URL** to the LLM API endpoint.
    1. Optionally select one or more **Products**l to associate with the API.  
    1. In **Path**, append a path that your API Management instance uses to access the LLM API endpoints.
    1. In **Type**, select either **Create OpenAI API** or **Create a passthrough API**.   
    1. In **Access key**, optionally enter the authorization header name and API key used to access the LLM API. 
    1. Select **Next**.
1. On the **Manage token consumption** tab, optionally enter settings or accept defaults that define the following policies to help monitor and manage the API:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-token-metric-policy.md) 
1. On the **Apply semantic caching** tab, optionally enter settings or accept defaults that define the policies to help optimize performance and reduce latency for the API:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
1. On the **AI content safety**, optionally enter settings or accept defaults to configure [Azure AI Content Safety](llm-content-safety-policy.md) for the API. 
1. Select **Review**.
1. After settings are validated, select **Create**. 


## Test the LLM API

To ensure that your LLM API is working as expected, test it in the API Management test console. 
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model in the LLM API.
    The page displays fields for parameters and headers.
1. Enter parameters and headers as needed. Depending on the operation, you may need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your Azure OpenAI API token consumption.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
