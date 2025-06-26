---
title: Import OpenAI-Compatible Language Model API - Azure API Management
description: How to import an OpenAI-compatible language model or a non-Azure-provided AI model as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/15/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an OpenAI-compatible language model API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can import OpenAI-compatible language model endpoints to your API Management instance as APIs. For example, you might want to manage an LLM that you self-host, or that's hosted on an inference provider other than Azure AI services. Use AI gateway policies and other capabilities in API Management to simplify integration, improve observability, and enhance control over the model endpoints.

Learn more about managing AI APIs in API Management:

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Language model API types

API Management supports two types of language model APIs for this scenario. Choose the option suitable for your model deployment. The option determines how clients call the API and how the API Management instance routes requests to the AI service.

* **OpenAI-compatible** - Language model endpoints that are compatible with OpenAI's API. Examples include certain models exposed by inference providers such as [Hugging Face Text Generation Inference (TGI)](https://huggingface.co/docs/text-generation-inference/en/index).

    API Management configures an OpenAI-compatible chat completions endpoint. 

* **Passthrough** - Other language model endpoints that aren't compatible with OpenAI's API. Examples include models deployed in [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) or other providers.

    API Management configures wildcard operations for common HTTP verbs. Clients can append paths to the wildcard operations, and API Management passes requests to the backend.  

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A self-hosted or non-Azure-provided language model deployment with an API endpoint.  


## Import language model API using the portal


To import a language model API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **Language Model API**.

    :::image type="content" source="media/openai-compatible-llm-api/openai-api.png" alt-text="Screenshot of creating an OpenAI-compatible API in the portal." :::

1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. Enter the **URL** to the LLM API endpoint.
    1. Optionally select one or more **Products** to associate with the API.  
    1. In **Path**, append a path that your API Management instance uses to access the LLM API endpoints.
    1. In **Type**, select either **Create OpenAI API** or **Create a passthrough API**. See [Language model API types](#language-model-api-types) for more information.
    1. In **Access key**, enter the authorization header name and API key used to access the LLM API, if required. 
    1. Select **Next**.

    :::image type="content" source="media/openai-compatible-llm-api/configure-api.png" alt-text="Screenshot of language model API configuration in the portal.":::

1. On the **Manage token consumption** tab, optionally enter settings or accept defaults that define the following policies to help monitor and manage the API:
    * [Manage token consumption](llm-token-limit-policy.md)
    * [Track token usage](llm-emit-token-metric-policy.md) 
1. On the **Apply semantic caching** tab, optionally enter settings or accept defaults that define the policies to help optimize performance and reduce latency for the API:
    * [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
1. On the **AI content safety**, optionally enter settings or accept defaults to configure the Azure AI Content Safety service to block prompts with unsafe content:
    * [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review**.
1. After settings are validated, select **Create**. 

## Test the LLM API

To ensure that your LLM API is working as expected, test it in the API Management test console. 
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation that's compatible with the model deployment.
    The page displays fields for parameters and headers.
1. Enter parameters and headers as needed. Depending on the operation, you might need to configure or update a **Request body**.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data. Appended to the response is token usage data to help you monitor and manage your language model token consumption.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
