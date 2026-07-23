---
title: 'Quickstart: Create an AI Gateway tier (preview) instance'
titleSuffix: Azure API Management
description: Create an AI Gateway tier (preview) instance, add a model, create a runtime access key, call the OpenAI-compatible endpoint, and view telemetry.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: quickstart
ms.date: 07/23/2026
ms.custom: references_regions
---

# Quickstart: Create an AI Gateway tier (preview) instance

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

In this quickstart, you create an AI Gateway tier (preview) instance, add a chat model, call the gateway, create a runtime access key, and view telemetry.

AI Gateway tier from Azure API Management is a dedicated tier for AI workloads. It supports managing traffic to models — from Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, OpenAI, Anthropic, or other providers — and tools created from existing MCP servers, OpenAPI definitions, or connectors. AI Gateway tier provisions quickly, usually within a minute.

**Time to complete:** about 20-30 minutes. **You create:** one gateway, one chat model, one runtime access key, and one successful chat completion request.

> [!NOTE]
> AI Gateway tier is in public preview. Preview features are provided without a service-level agreement and shouldn't be used for production workloads unless your organization accepts the preview terms.

## Prerequisites

- An Azure account with **Microsoft Entra ID**. Access to the AI Gateway tier preview is currently limited to Azure users who sign in with Microsoft Entra ID.
- An Azure subscription, and permission to create resources in a resource group (for example, the **Contributor** role).
- Access to at least one supported model provider, such as a deployed model in Microsoft Foundry or Azure OpenAI.
- If your provider requires an API key, have the key available.
- To call the gateway, use curl (no installation) or an OpenAI SDK - Python 3.9 or later, or Node.js 18 or later, with the `openai` package.

## 1. Sign in to the AI Gateway tier portal

The AI Gateway tier portal is a standalone web experience - you don't use the Azure portal.

1. Go to the AI Gateway tier portal at `ai.gateway.azure.com`.
1. Select **Sign in** and authenticate with Microsoft Entra ID.

Use the portal to manage models, MCP servers, runtime access keys, policies, and monitoring, based on your Entra ID permissions. Runtime callers don't sign in to the portal - they call the gateway with runtime access keys that you create later.

## 2. Create a gateway

1. In the portal, select **Create gateway**. To use an existing gateway instead, select it and skip to the next step.
1. Enter a **Name**. The name becomes part of the runtime endpoint:

   `https://<gateway>.azure-api.net`

1. Select your **Subscription** and a supported preview region (**East US 2** or **Sweden Central**).
1. Optionally set the **Resource group** under **Advanced**. By default, the portal creates one for you.
1. Select **Create**. Activation typically takes under a minute.

The gateway is a dedicated resource in your Azure subscription. You don't choose capacity or add scale units before you add models. For automation, the preview management API version is `2026-05-01-preview`; runtime requests use the gateway host name, not Azure Resource Manager.

## 3. Add a model

The fastest way to create a model is by importing it from Microsoft Foundry accounts. You can also discover and import resources across multiple subscriptions automatically using the [first-time configuration wizard that can discover Foundry accounts and MCP Servers deployed in Azure-hosted services](ai-gateway-setup.md).

To import a model from Foundry:

1. In the gateway, select **Models**, and then select **Add models**.
1. Select **Import from Foundry**.
1. On **Select resource**, choose your subscription and Foundry resource. The wizard lists the model deployments in that resource. Note the name of a chat model (this quickstart uses `gpt-5.6-sol`).
1. On **Provider details**, enter a provider name and display name (short identifiers shown in the Models list and in telemetry; they don't need to match the Foundry resource name), and choose an authentication method:
   - **Key-based** (fastest for this quickstart): the gateway stores the provider key. No role assignment is required.
   - **Managed identity**: available when the provider supports Microsoft Entra ID authentication. Before you use it, assign the gateway identity the required backend role (for Microsoft Foundry, **Foundry User**). See [Govern, secure, and operate](./ai-gateway-govern-secure-assets.md#use-managed-identity-for-backend-authentication).
1. Select **Create**. There's no separate validation step; the gateway sets up the connection when you create the provider.

To connect a non-Foundry provider (AWS Bedrock, Google Vertex, OpenAI, or Anthropic), select **Add a custom model** instead. See [Manage models and tools](./ai-gateway-manage-models-tools.md#import-models).

:::image type="content" source="media/quickstart-ai-gateway-create/ai-gateway-add-foundry-provider.png" alt-text="Screenshot of the Add Foundry provider wizard showing a selected subscription and Foundry resource with model deployments listed for import." lightbox="media/quickstart-ai-gateway-create/ai-gateway-add-foundry-provider.png":::

Callers pass the model name in the `model` field of OpenAI-compatible requests. This quickstart uses `gpt-5.6-sol`; replace it with the model you registered.

> [!TIP]
> To try the model right away, open the **Discover** page and select the model to invoke it in the built-in playground. The playground uses the gateway's built-in key, so you can explore and test added models or tools before you create a runtime access key.

## 4. Call the gateway

The gateway exposes the API that the backend model supports. Models from OpenAI-compatible providers — such as Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, and OpenAI — are served on an OpenAI-compatible endpoint. Point any OpenAI client at the gateway base URL, send an `api-key` header, and pass the model name in the `model` field. Anthropic models use the Anthropic Messages API instead; see [Manage models and tools](./ai-gateway-manage-models-tools.md#anthropic-messages-api-passthrough).

For a quick test, use the gateway's **built-in key** — the same key the Discover playground uses. Copy it from the **Keys** page, which lists the built-in key alongside the API keys that grant runtime access to every asset in the gateway. For your own applications, create a runtime access key instead (see the next section).

Set these values once:

```bash
export AI_GATEWAY_BASE_URL="https://<gateway>.azure-api.net/default/models/openai/v1"
export AI_GATEWAY_API_KEY="<gateway-key>"
```

> [!TIP]
> Copy the exact base URL from your gateway's overview page rather than building it by hand.

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

Every response from the `/chat/completions` endpoint uses the OpenAI Chat Completions format, whichever OpenAI-compatible provider backs the model.

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

The same base URL also serves the OpenAI Responses API at `/responses`.

If a request fails, the gateway returns a standard HTTP status code:

| Status | Meaning | What to check |
| --- | --- | --- |
| 400 | Invalid request | Check the request body. |
| 400 | Blocked by content safety or an IP filter, or denied by the backend | A content-safety policy can block a prompt or response; also check any IP-filter policy. For managed identity, assign the **Foundry User** role to the gateway identity on the backend resource. See [Use managed identity for backend authentication](./ai-gateway-govern-secure-assets.md#use-managed-identity-for-backend-authentication). |
| 401 | Missing or invalid runtime access key | Send the key in the `api-key` header, and confirm the key is active. |
| 404 | Unknown model | Confirm the `model` value matches a model name on the **Models** page. |
| 429 | Throttled by a rate-limit policy or the backend | Review token and request rate-limit policies, and honor the `Retry-After` response header. |
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

## 5. Create a runtime access key

Applications authenticate to the gateway with a runtime access key rather than the built-in key. Create a separate key for each application and environment.

1. Select **Keys**.
1. Select **Create API key**.
1. Enter a name, such as `quickstart-client`.
1. Select **Create**.
1. Copy the key value and store it securely. You can also view it again later on the **Keys** page.

:::image type="content" source="media/quickstart-ai-gateway-create/ai-gateway-runtime-keys.png" alt-text="Screenshot of the Keys page listing API keys that grant runtime access to every asset in the gateway, with a Create API key button." lightbox="media/quickstart-ai-gateway-create/ai-gateway-runtime-keys.png":::

Create runtime access keys at the gateway level. These keys grant access to every model and tool in the gateway. Treat them like secrets. Store keys in a secret store for applications, rotate them regularly, and revoke keys that are no longer needed. To call the gateway with a runtime access key, set `AI_GATEWAY_API_KEY` to its value in the calls shown earlier.

## 6. See telemetry

AI Gateway tier emits OpenTelemetry token usage metrics. To see them, configure a telemetry destination first, and then send requests:

1. Configure a telemetry destination for the gateway, such as Application Insights. See [Govern, secure, and operate](./ai-gateway-govern-secure-assets.md#monitoring).
1. Send one or more requests through the gateway, as shown earlier in [Call the gateway](#4-call-the-gateway).
1. Open your telemetry destination to review token usage. If you use Application Insights, the portal provides a built-in token consumption dashboard.

Because telemetry is emitted only after you connect a destination, configure monitoring before you rely on it. Token usage is currently the only metric emitted; logs, traces, and other metrics for models and tools are coming soon. Callers use gateway-level runtime access keys, so you can monitor traffic without exposing provider credentials to client applications. To configure a telemetry destination, see [Govern, secure, and operate](./ai-gateway-govern-secure-assets.md#monitoring).

## Clean up resources

When you're done, delete any resources you no longer need. Remove the AI Gateway tier instance, provider test deployments, and runtime access keys that you created only for evaluation.

## Next steps

- [Add MCP tools that agents can call](./ai-gateway-manage-models-tools.md#add-mcp-servers)
- [Apply governance policies to your models and tools](./ai-gateway-govern-secure-assets.md#governance-policies)
- [Configure private networking](./ai-gateway-configure-private-networking.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [AI Gateway tier overview](./ai-gateway-overview.md)
