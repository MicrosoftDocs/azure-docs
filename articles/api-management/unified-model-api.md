---
title: Import and manage a unified model API - Azure API Management
description: Learn how to create a unified model API in Azure API Management to route and transform requests across multiple LLM providers using a single client-facing API format.
ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/26/2026
author: dlepow
ms.author: danlep
---

# Import and manage a unified model API


<!-- which tiers support? -->

You can create a unified model API in Azure API Management to expose multiple LLM backends through a single client-facing endpoint. Client applications use one familiar API format — the OpenAI Chat Completions API — while API Management automatically translates requests to the correct backend format, whether that's Azure OpenAI, Anthropic, Amazon Bedrock, or Google Gemini.

> [!NOTE]
> The unified model API is currently in public preview.

By centralizing model access behind a single API layer, you can:

- **Route requests** to the correct backend based on the model name the client specifies.
- **Translate request and response formats** between the client-side OpenAI Chat Completions format and each backend provider's native format.
- **Define model aliases** so clients can use stable names like `gpt` or `claude-sonnet` that you can remap to new model versions without client-side changes.
- **Configure cross-provider fallback** so that requests automatically retry against an alternate model or provider if the primary is unavailable.
- **Apply governance policies** for token limits, usage metrics, and content safety across all models in the API.

To learn more about managing AI APIs in API Management, see [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md).

## Supported backends

The unified model API supports the following backend providers:

| Backend | Description |
|---------|-------------|
| Azure OpenAI | Azure OpenAI model deployments in Microsoft Foundry |
| Non-Azure OpenAI | OpenAI model deployments hosted outside of Azure |
| Anthropic in Foundry | Anthropic Claude models deployed through Microsoft Foundry |
| Amazon Bedrock | Anthropic and other models hosted in Amazon Bedrock |
| Google Vertex AI | Google Gemini models hosted in Google Vertex AI |

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- One or more model deployments in a supported backend. 
- If you want to track token usage by the API, see [Emit custom metrics](/azure/api-management/api-management-howto-app-insights#emit-custom-metrics) for prerequisites.
- If you want to enforce content safety checks on the API, see [Enforce content safety checks on LLM requests](llm-content-safety-policy.md) for prerequisites.

## Create a unified model API in the portal

Use the following steps to create a unified model API in API Management.

When you create the API, API Management automatically configures:

- A `/models` endpoint for model discovery that lists all configured models.
- A single routing endpoint such as `/llm/v1/chat/completions` that accepts requests in the OpenAI Chat Completions format.
- Format translation logic for each backend model you add.
- A system-assigned managed identity with the permissions needed to access configured backend deployments.
- Backend resources and policies that direct requests to the correct provider endpoint.

To create a unified model API:

1. In the [Azure portal](https://portal.azure.com/), go to your API Management instance.
1. In the sidebar menu, under **APIs**, select **Models** > **+ Add** > **Unified model API**.
1. On the **Configure Unified Model API** tab:
   1. Enter a **Display name** for the API. API Management automatically generates an API **Name** based on the display name, but you can edit it if you want.
   1. In **API path**, enter the path that clients use to call the API. The default is `/llm/v1`, which results in a chat completions endpoint at `/llm/v1/chat/completions`.
   1. Optionally select one or more **Products** to associate with the API.
   1. Select **Next**.
1. On the **Configure models** tab, select **+ Add** to open the **Add model** pane, then configure the following settings for each model deployment:
   1. Under **Backend configuration**:
      - In **Model**, enter the backend model name (for example, `gpt-4o` or `claude-sonnet-4.6`).
      - In **API format**, select the format the backend model expects: **OpenAI Chat Completions API** or **Anthropic Messages API**.
      - In **URL**, enter the backend endpoint URL, for example, a model deployment in Foundry or, for other providers, the provider's API endpoint URL.
      - Under **Authorization credentials**, select how API Management authenticates to the backend:
        - **Headers**: Enter a **Header name** (for example, `api-key` or `Authorization`) and the corresponding **Header value** (your API key or secret).
        - **Managed Identity**: Use the instance's system-assigned managed identity or a user-assigned managed identity to authenticate to the backend. For an explanation of settings for the managed identity, see the reference for the [authentication-managed-identity](authentication-managed-identity-policy.md) policy.
1. On the **Manage token consumption** tab, optionally configure the following policies to monitor and manage token usage:
   - [Manage token consumption](llm-token-limit-policy.md)
   - [Track token usage](llm-emit-token-metric-policy.md)
1. On the **Set up AI content safety** tab, optionally configure the Azure AI Content Safety service to block prompts with unsafe content:
   - [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review + create**, then select **Create**.

## Manage model aliases

Model aliases give clients a stable, provider-neutral name to use when calling a model. By assigning an alias like `gpt` or `claude-sonnet`, you decouple the client-facing model name from the actual backend deployment. When you upgrade a model or want to run an A/B test, you can update the alias target without any changes to client code.

To add a model or update an alias after creating the unified model API:

1. In the Azure portal, go to your API Management instance, then select **Models**.
1. Select the unified model API.
1. Select **+ Add model** to open the **Add model** pane.
1. Under **Backend configuration**, enter the backend **Model** name and select the **API format** the backend expects.
1. Under **Authorization credentials**, configure authentication by entering header credentials or selecting **Managed Identity**.
1. Under **Client configuration**, update the **Alias** to the new client-facing name, and optionally update the **Alias description**.
1. Select **Save**.

## Configure cross-provider fallback

You can configure fallback so that if a primary model is unavailable or returns an error, API Management automatically retries the request against an alternate model or provider. This is useful for building resilient multi-model architectures.

To configure fallback on the unified model API:

1. In the Azure portal, go to your API Management instance, then select **Models**.
1. Select the unified model API, then select **Models**.
1. Select the primary model for which you want to configure fallback.
1. Under **Fallback**, select the model to use as the fallback target.
1. Select **Save**.

## Test the unified model API

To verify that your unified model API works as expected, test it in the API Management test console.

1. Select the unified model API you created.
1. Select the **Test** tab.
1. Select the **chat completions** operation.
1. In the **Request body**, enter a chat completions request. Use the `model` field to specify the client-facing model name or alias you configured:

   ```json
   {
     "model": "gpt",
     "messages": [
       {
         "role": "user",
         "content": "What can you do?"
       }
     ]
   }
   ```

   > [!NOTE]
   > In the test console, API Management automatically adds an `Ocp-Apim-Subscription-Key` header and sets the subscription key for the built-in [all-access subscription](api-management-subscriptions.md#all-access-subscription). This key provides access to every API in the API Management instance.

1. Select **Send**.

   When the test is successful, the backend responds with a successful HTTP response code and a chat completions response. The response includes token usage data to help you monitor and manage your language model token consumption.

## Call the API from a client application

Client applications can call the unified model API using any OpenAI-compatible SDK. Point the SDK's base URL at your API Management endpoint and use an API Management subscription key for authentication.

The following example uses the Python OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://<apim-instance>.azure-api.net/llm/v1",
    api_key="<apim-subscription-key>",
)

# Specify the client-facing model name or alias
response = client.chat.completions.create(
    model="gpt",  # or "claude-sonnet", "gemini", or any other configured alias
    messages=[{"role": "user", "content": "What can you do?"}],
)
print(response.choices[0].message.content)
```

To switch to a different backend model, change only the `model` value. No other code changes are required.

## Related content

- [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)
- [Import a Microsoft Foundry API](azure-ai-foundry-api.md)
- [Manage LLM token consumption](llm-token-limit-policy.md)
- [Track token usage](llm-emit-token-metric-policy.md)
- [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
- [Enable semantic caching of responses](azure-openai-enable-semantic-caching.md)
- [Backends in Azure API Management](backends.md)
