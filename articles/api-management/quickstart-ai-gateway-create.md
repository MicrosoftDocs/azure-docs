---
title: 'Quickstart: Create an AI Gateway tier (preview) instance'
description: Create an AI Gateway tier (preview) instance, add a model, create a runtime access key, call the OpenAI-compatible endpoint, and view telemetry.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: quickstart
ms.date: 06/29/2026
---

# Quickstart: Create an AI Gateway tier (preview) instance

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

In this quickstart, you create an AI Gateway tier (preview) instance, add a chat model, create a runtime access key, call the gateway, and view telemetry.

AI Gateway tier from Azure API Management is a dedicated tier for AI workloads. It gives you managed runtime endpoints for supported model providers — OpenAI-compatible Chat Completions and Responses for Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, and OpenAI, plus an Anthropic Messages API passthrough. AI Gateway tier provisions quickly, usually within a minute.

**Time to complete:** about 20–30 minutes. **You'll create:** one gateway, one chat model, one runtime access key, and one successful chat completion request.

> [!NOTE]
> AI Gateway tier is in public preview. Preview features are provided without a service-level agreement and shouldn't be used for production workloads unless your organization accepts the preview terms.

## Prerequisites

- An Azure account with **Microsoft Entra ID**. Access to the AI Gateway tier preview is currently limited to Azure users who sign in with Microsoft Entra ID.
- An Azure subscription, and permission to create resources in a resource group (for example, the **Contributor** role).
- Access to at least one supported model provider, such as a deployed model in Microsoft Foundry or Azure OpenAI.
- If your provider requires an API key, have the key available.
- To run the samples: Python 3.9 or later with the OpenAI package, or Node.js 18 or later with the `openai` package.

## 1. Sign in to the AI Gateway tier portal

The AI Gateway tier portal is a standalone web experience — you don't use the Azure portal.

1. Go to the AI Gateway tier portal at `ai.gateway.azure.com`.
1. Select **Sign in** and authenticate with Microsoft Entra ID.

You use the portal to manage models, MCP servers, runtime access keys, policies, and monitoring, based on your Entra ID permissions. Runtime callers don't sign in to the portal — they call the gateway with runtime access keys that you create later.

## 2. Create a gateway

1. In the portal, select **Create gateway**. To use an existing gateway instead, select it and skip to the next step.
1. Enter a **Name**. The name and region become part of the runtime endpoint:

   `https://<gateway>.<region>.ai.gateway.azure.com`

1. Select your **Subscription** and a supported preview region (**East US 2** or **Sweden Central**).
1. Optionally set the **Resource group** under **Advanced**. By default, the portal creates one for you.
1. Select **Create**. Activation typically takes under a minute.

The gateway is a dedicated resource in your Azure subscription. You don't choose capacity or add scale units before you add models. For automation, the preview management API version is `2026-05-01-preview`; runtime requests use the gateway host name, not Azure Resource Manager.

## 3. Add a model

The fastest path is to import a model from a Microsoft Foundry resource.

1. In the gateway, select **Models**, and then select **Add models**.
1. Select **Import from Foundry**.
1. On **Select resource**, choose your subscription and Foundry resource. The wizard lists the model deployments in that resource. Note the name of a chat model (this quickstart uses `gpt-5.6-sol`).
1. On **Provider details**, enter a provider name (a short identifier shown in the Models list and in telemetry; it doesn't need to match the Foundry resource name), and choose an authentication method:
   - **Key-based** (fastest for this quickstart): the gateway stores the provider key. No role assignment is required.
   - **Managed identity**: available when the provider supports Microsoft Entra ID authentication. Before you use it, assign the gateway identity the required backend role (for Azure OpenAI, **Cognitive Services OpenAI User**). See [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md#use-managed-identity-for-backend-authentication).
1. Select **Create**. There's no separate validation step; the gateway sets up the connection when you create the provider.

To connect a non-Foundry provider (AWS Bedrock, Google Vertex, OpenAI, or Anthropic), select **Add a custom model** instead. See [Manage models and tools](./ai-gateway-manage-models-tools.md#import-models).

:::image type="content" source="media/ai-gateway-add-foundry-provider.png" alt-text="The Add Foundry provider wizard showing a selected subscription and Foundry resource with model deployments listed for import." lightbox="media/ai-gateway-add-foundry-provider.png":::

Callers pass the model name in the `model` field of OpenAI-compatible requests. This quickstart uses `gpt-5.6-sol`; replace it with the model you registered.

## 4. Create a runtime access key

1. Select **Keys**.
1. Select **Create API key**.
1. Enter a name, such as `quickstart-client`.
1. Optionally set an expiration date.
1. Select **Create**.
1. Copy the key value and store it securely. You can't view the full key again after you leave the page.

:::image type="content" source="media/ai-gateway-runtime-keys.png" alt-text="The Keys page listing API keys that grant runtime access to every asset in the gateway, with a Create API key button." lightbox="media/ai-gateway-runtime-keys.png":::

Runtime access keys are created at the gateway level and grant access to every model and tool in the gateway. Treat them like secrets. Store keys in a secret store for applications, rotate them regularly, and revoke keys that are no longer needed.

## 5. Call the gateway

The gateway exposes an OpenAI-compatible endpoint. Point any OpenAI client at the gateway base URL, send your runtime access key in the `api-key` header, and pass the model name in the `model` field.

Set these values once:

```bash
export AI_GATEWAY_BASE_URL="https://<gateway>.<region>.ai.gateway.azure.com/default/models/openai/v1"
export AI_GATEWAY_API_KEY="<runtime-access-key>"
```

Make your first call with the client of your choice:

### [curl](#tab/curl)

```bash
curl "$AI_GATEWAY_BASE_URL/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: $AI_GATEWAY_API_KEY" \
  -d '{
    "model": "gpt-5.6-sol",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Give me three benefits of using an AI gateway." }
    ]
  }'
```

To stream tokens as server-sent events, add `"stream": true` to the request body.

### [Python](#tab/python)

Install the client with `pip install openai`.

```python
import os
from openai import OpenAI

# The gateway reads the api-key header, not the api_key argument.
client = OpenAI(
    base_url=os.environ["AI_GATEWAY_BASE_URL"],
    api_key="unused",
    default_headers={"api-key": os.environ["AI_GATEWAY_API_KEY"]},
)

response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Give me three benefits of using an AI gateway."},
    ],
)
print(response.choices[0].message.content)
```

To stream tokens as they're generated, add `stream=True` and iterate the response:

```python
stream = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[{"role": "user", "content": "Stream a short greeting."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

### [Node.js](#tab/node)

Install the package with `npm install openai`.

```javascript
import OpenAI from "openai";

// The gateway reads the api-key header, not the apiKey argument.
const client = new OpenAI({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
  apiKey: "unused",
  defaultHeaders: { "api-key": process.env.AI_GATEWAY_API_KEY },
});

const response = await client.chat.completions.create({
  model: "gpt-5.6-sol",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Give me three benefits of using an AI gateway." },
  ],
});
console.log(response.choices[0].message.content);
```

To stream, add `stream: true` and iterate the async response.

---

Every response uses the OpenAI Chat Completions format, whichever provider backs the model.

A non-streaming call returns a chat completion:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "gpt-5.6-sol",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "1. Centralized governance ...\n2. ...\n3. ..." },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 24, "completion_tokens": 61, "total_tokens": 85 }
}
```

With streaming enabled, the gateway returns `chat.completion.chunk` events:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion.chunk",
  "model": "gpt-5.6-sol",
  "choices": [
    { "index": 0, "delta": { "content": "Hello" }, "finish_reason": null }
  ]
}
```

If a request fails, the gateway returns a standard HTTP status code:

| Status | Meaning | What to check |
| --- | --- | --- |
| 401 | Missing or invalid runtime access key | Send the key in the `api-key` header, and confirm the key is active. |
| 403 | Access denied | The key or backend identity isn't authorized. For managed identity, assign the **Cognitive Services OpenAI User** role to the gateway identity on the backend resource. See [Use managed identity for backend authentication](./ai-gateway-govern-secure-operate.md#use-managed-identity-for-backend-authentication). |
| 404 | Unknown model | Confirm the `model` value matches a model name on the **Models** page. |
| 429 | Throttled by a rate-limit policy or the backend | Review token and request rate-limit policies, and honor the `Retry-After` response header. |
| 400 | Invalid request, or blocked by content safety | Check the request body; a content-safety policy can block a prompt or response. |
| 5xx | Backend error | Confirm the backend provider is healthy and the provider credential is valid. |

The OpenAI SDKs raise typed exceptions for these status codes, so your existing error handling works:

```python
from openai import AuthenticationError, RateLimitError, APIStatusError

try:
    response = client.chat.completions.create(
        model="gpt-5.6-sol",
        messages=[{"role": "user", "content": "Hello"}],
    )
except AuthenticationError:
    ...  # 401 — check the api-key header and that the key is active
except RateLimitError:
    ...  # 429 — back off and honor the Retry-After header
except APIStatusError as e:
    ...  # inspect e.status_code for 400, 403, 404, or 5xx
```

## 6. See telemetry

After you send a request, view telemetry for the gateway:

1. Select **Monitoring**.
1. Review request count, latency, token usage, and error rate.
1. Filter by model name to find traffic for `gpt-5.6-sol`.
1. Use failures and latency charts to troubleshoot backend provider issues.

Telemetry helps you understand usage across providers and applications. Callers use gateway-level runtime access keys, so you can monitor traffic without exposing provider credentials to client applications. The built-in **Monitoring** views show recent gateway traffic without any setup. To retain telemetry longer or forward it to Application Insights or another OpenTelemetry (OTLP) endpoint, configure a telemetry destination — see [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md#monitoring).

## Clean up resources

When you're done, delete any resources you no longer need. Remove the AI Gateway tier instance, provider test deployments, and runtime access keys that you created only for evaluation.

## Next steps

- [Add MCP tools that agents can call](./ai-gateway-manage-models-tools.md#add-mcp-servers)
- [Apply governance policies to your models and tools](./ai-gateway-govern-secure-operate.md#governance-policies)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [AI Gateway tier overview](./ai-gateway-overview.md)
