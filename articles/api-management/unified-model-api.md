---
title: Create and manage a unified model API - Azure API Management
description: Learn how to create a unified model API in Azure API Management to route and transform requests across AI models from multiple LLM providers using a single client-facing API format.
ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/29/2026
ai-usage: ai-assisted
---

# Create and manage a unified model API

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

You can create a unified model API in Azure API Management to expose multiple LLM backends through a single client-facing endpoint. Client applications use one familiar API format - the OpenAI Chat Completions API - while API Management automatically translates requests to the backend models using OpenAI Chat Completions API or Anthropic Messages API.

> [!NOTE]
> The unified model API is in preview and is currently rolling out to customers. In the classic tiers, early access to this feature is available through the [AI Gateway Early release channel](configure-service-update-settings.md#update-group).

By centralizing model access behind a single API layer, you can:

- Standardize on a single API format for clients independently from the formats used by backend models.
- Unify observability, security, and governance with policies across model providers.
- Configure model failover across model providers.
- Decouple client-facing model names from backend model names using aliases.

To learn more about managing AI APIs in API Management, see [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md).

## Supported backends

The unified model API supports the following backend API formats:

- OpenAI Chat Completions API 
- Anthropic Messages API 

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- One or more model deployments in a supported backend. 
- To track token usage by the API, see [Emit custom metrics](/azure/api-management/api-management-howto-app-insights#emit-custom-metrics) for prerequisites.
- To enforce content safety checks on the API, see [Enforce content safety checks on LLM requests](llm-content-safety-policy.md) for prerequisites.

## Create a unified model API - Azure portal

Use the following steps to create a unified model API in API Management.

When you create the API, API Management automatically configures:

- A `/models` endpoint for model discovery that lists all configured models.
- A single routing endpoint such as `/llm/v1/chat/completions` that accepts requests in the OpenAI Chat Completions format.
- Format translation logic for each backend model you add.
- Backend resources that direct requests to the correct provider endpoint.

To create a unified model API:

1. In the [Azure portal](https://portal.azure.com/), go to your API Management instance.
1. In the sidebar menu, under **APIs**, select **Models** > **+ Add** > **Unified model API**.
    
    :::image type="content" source="media/unified-model-api/unified-model-api-tile.png" alt-text="Screenshot of unified model API tile in the Azure portal.":::
1. On the **Configure Unified Model API** tab:
   1. Enter a **Display name** for the API. API Management automatically generates an API **Name** based on the display name, but you can edit it if you want.
   1. In **API path**, enter the path that clients use to call the API. The default is `/llm/v1`, which results in a chat completions endpoint at `/llm/v1/chat/completions`.
   1. Optionally select one or more **Products** to associate with the API.
   1. Select **Next**.
1. On the **Configure models** tab, select **+ Add** to open the **Add model** pane, then configure the following settings for each model deployment:
   1. Under **Backend configuration**:
      - In **Model**, enter the backend model name (for example, `gpt-4o` or `claude-sonnet-4.6`).
      - In **API format**, select the format the backend model expects, such as **OpenAI Chat Completions API** or **Anthropic Messages API**.
      - In **URL**, enter the backend endpoint URL, for example, a model deployment in Foundry or, for other providers, the provider's API endpoint URL.
   1.  Under **Authorization credentials**, select how API Management authenticates to the backend:
        - **Headers**: Enter a **Header name** (for example, `api-key` or `Authorization`) and the corresponding **Header value** (your API key or secret).
        - **Managed Identity**: For model deployments in Azure, you can use the instance's system-assigned managed identity or a user-assigned managed identity to authenticate to the backend. 
        
        For an explanation of settings for the managed identity, see the reference for the [authentication-managed-identity](authentication-managed-identity-policy.md) policy.
    
   :::image type="content" source="media/unified-model-api/add-model.png" alt-text="Screenshot of the Add model pane to add model settings in the portal.":::
    
1. On the **Manage token consumption** tab, optionally configure the following policies to monitor and manage token usage:
   - [Manage token consumption](llm-token-limit-policy.md)
   - [Track token usage](llm-emit-token-metric-policy.md)
1. On the **Set up AI content safety** tab, optionally configure the Azure AI Content Safety service to block prompts with unsafe content:
   - [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)
1. Select **Review + create**, then select **Create**.

## Manage model aliases

Model aliases give clients a stable, provider-neutral name to use when calling a model. By assigning an alias like `gpt` or `claude-sonnet`, you decouple the client-facing model name from the actual backend deployment. When you upgrade a model or want to run an A/B test, you can update the alias target without any changes to client code.

### Update or add a model alias

To update a model alias after creating the unified model API:

1. In the Azure portal, go to your API Management instance, then select **APIs**.
1. Select the unified model API.
1. Select the **Models** tab to update or add a model alias.
     - To update a client-facing alias, select the alias you want to update, then update the **Backend configuration** to specify the backend model. Add **Authorization credentials** for the new backend.
    - To add a new model, select **+ Add** and configure the backend, authorization, and client settings as described in the previous section.
1. Select **Save**.

### Discover model aliases

Developers can discover available models and their aliases by calling the `/models` endpoint of the unified model API. API Management returns a list of models with their client-facing aliases.

## Call the API from a client application

Client applications can call the unified model API using any OpenAI-compatible SDK. Point the SDK's base URL at your API Management endpoint and use an API Management subscription key or another supported authentication method for authentication.

The following example uses the Python OpenAI SDK and passes an API Management subscription key in the header for authentication. The request body specifies a client-facing model alias configured in API Management, for example, `gpt` or `claude-sonnet`.:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://<apim-instance>.azure-api.net/llm/v1",
    api_key="<api-management-subscription-key>",
)

# Specify the client-facing model alias
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
