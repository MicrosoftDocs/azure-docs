---
title: 'Quickstart: Create an AI Gateway tier (preview) instance'
description: Create an AI Gateway tier (preview) instance, add a model, generate a runtime access key, call the OpenAI-compatible endpoint, and view telemetry.
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

- An Azure subscription.
- Permission to create API Management resources in a resource group, such as **Contributor** or a custom role with the same permissions.
- Permission to sign in with Microsoft Entra ID.
- Access to at least one supported model provider, such as a deployed model in Microsoft Foundry or Azure OpenAI.
- If your provider requires an API key, have the key available.
- Python 3.9 or later and the OpenAI Python package, if you want to run the Python sample.

## 1. Provision an AI Gateway tier instance

1. In the Azure portal, search for **API Management**.
1. Select **Create**.
1. For **Tier** or **SKU**, select **AI Gateway (preview)**.
1. Select a subscription and resource group, and choose a supported preview region (**East US 2** or **Sweden Central**).
1. Enter a gateway name. The name and region become part of the runtime endpoint:

   `https://<gateway>.<region>.ai.gateway.azure.com`

1. Configure identity. In most cases, enable a system-assigned managed identity so the gateway can authenticate to supported Azure backends.
1. Review the settings, and then select **Create**.

Provisioning creates a dedicated AI Gateway tier resource in your subscription. You don't choose capacity or add scale units before you add models. Management operations use the preview control plane API version `2026-05-01-preview`. Runtime requests use the gateway host name, not Azure Resource Manager.

## 2. Sign in and open the gateway

1. After deployment completes, go to the AI Gateway tier instance.
1. In the gateway resource, select **Open portal**.
1. Sign in with Microsoft Entra ID.
1. Select the gateway you created.

Use the Azure portal to provision the gateway and configure identity and networking. Use the AI Gateway tier portal (select **Open portal**) to manage models, MCP servers, runtime access keys, policies, and monitoring. The AI Gateway tier portal uses your Entra ID permissions to configure gateway resources. Runtime callers don't need Azure portal access. They call the gateway with runtime access keys that you create later.

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

The AI Gateway tier exposes an OpenAI-compatible endpoint. Use the gateway base URL and pass the model name in the `model` field.

### Python

Install the OpenAI client:

```bash
pip install openai
```

Set environment variables:

```bash
export AI_GATEWAY_BASE_URL="https://<gateway>.<region>.ai.gateway.azure.com/default/models/openai/v1"
export AI_GATEWAY_API_KEY="<runtime-access-key>"
```

The gateway expects your runtime access key in the `api-key` header. The OpenAI SDK requires the `api_key` argument, but the gateway doesn't use it — pass a placeholder for `api_key` and set the real key through `default_headers`. This keeps the SDK from sending an `Authorization: Bearer` header that the gateway doesn't expect. Run this Python sample:

```python
import os
from openai import OpenAI

client = OpenAI(base_url=os.environ["AI_GATEWAY_BASE_URL"], api_key="unused", default_headers={"api-key": os.environ["AI_GATEWAY_API_KEY"]})

response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Give me three benefits of using an AI gateway."},
    ],
)

print(response.choices[0].message.content)
```

To stream tokens as they're generated, set `stream=True` and iterate the response:

```python
stream = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[{"role": "user", "content": "Stream a short greeting."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

### Node.js

Install the OpenAI package:

```bash
npm install openai
```

```javascript
import OpenAI from "openai";

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

### curl

```bash
curl "https://<gateway>.<region>.ai.gateway.azure.com/default/models/openai/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{
    "model": "gpt-5.6-sol",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Give me three benefits of using an AI gateway." }
    ]
  }'
```

To stream the response as server-sent events, set `"stream": true` in the request body:

```bash
curl "https://<gateway>.<region>.ai.gateway.azure.com/default/models/openai/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{
    "model": "gpt-5.6-sol",
    "stream": true,
    "messages": [
      { "role": "user", "content": "Stream a short greeting." }
    ]
  }'
```

A successful response uses the OpenAI chat completions format:

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

If a request fails, the gateway returns a standard HTTP status code:

| Status | Meaning | What to check |
| --- | --- | --- |
| 401 | Missing or invalid runtime access key | Send the key in the `api-key` header, and confirm the key is active. |
| 403 | Access denied | The key or backend identity isn't authorized. For managed identity, assign the **Cognitive Services OpenAI User** role to the gateway identity on the backend resource. See [Use managed identity for backend authentication](./ai-gateway-govern-secure-operate.md#use-managed-identity-for-backend-authentication). |
| 404 | Unknown model | Confirm the `model` value matches a model name on the **Models** page. |
| 429 | Throttled by a rate-limit policy or the backend | Review token and request rate-limit policies, and honor the `Retry-After` response header. |
| 400 | Invalid request, or blocked by content safety | Check the request body; a content-safety policy can block a prompt or response. |
| 5xx | Backend error | Confirm the backend provider is healthy and the provider credential is valid. |

## 6. See telemetry

After you send a request, view telemetry for the gateway:

1. Select **Monitoring**.
1. Review request count, latency, token usage, and error rate.
1. Filter by model name to find traffic for `gpt-5.6-sol`.
1. Use failures and latency charts to troubleshoot backend provider issues.

Telemetry helps you understand usage across providers and applications. Callers use gateway-level runtime access keys, so you can monitor traffic without exposing provider credentials to client applications. The built-in **Monitoring** views show recent gateway traffic without any setup. To retain telemetry longer, run your own Kusto queries, or forward signals to Application Insights or another OpenTelemetry endpoint, configure a telemetry destination — see [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md#monitoring).

## Clean up resources

When you're done, delete any resources you no longer need. Remove the AI Gateway tier instance, provider test deployments, and runtime access keys that you created only for evaluation.

## Next steps

- [Add MCP tools that agents can call](./ai-gateway-manage-models-tools.md#add-mcp-servers)
- [Apply governance policies to your models and tools](./ai-gateway-govern-secure-operate.md#governance-policies)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [AI Gateway tier overview](./ai-gateway-overview.md)
