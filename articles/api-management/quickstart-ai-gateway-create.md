---
title: 'Quickstart: Create an AI Gateway tier (preview) instance'
description: Create an AI Gateway (preview) instance, add a model, generate a runtime access key, call the OpenAI-compatible endpoint, and view telemetry.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: quickstart
ms.date: 06/29/2026
---

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

# Quickstart: Create an AI Gateway (preview) instance

In this quickstart, you create an AI Gateway (preview) instance, add a chat model, create a runtime access key, call the gateway, and view telemetry.

AI Gateway tier is a separate Azure API Management offering for AI workloads. It gives you one OpenAI-compatible gateway endpoint for supported model providers, including Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, OpenAI, and Anthropic. AI Gateway tier provisions quickly, usually within minutes.

**Time to complete:** about 20–30 minutes. **You'll create:** one gateway, one model named `production-chat`, one runtime access key, and one successful chat completion request.

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
1. Enter a gateway name. The name becomes part of the runtime endpoint:

   `https://<gateway>.azure-api.net`

1. Configure identity. In most cases, enable a system-assigned managed identity so the gateway can authenticate to supported Azure backends.
1. Review the settings, and then select **Create**.

Provisioning creates a dedicated AI Gateway tier resource in your subscription. You don't choose capacity or add scale units before you add models. Management operations use the preview control plane API version `2026-05-01-preview`. Runtime requests use the gateway host name, not Azure Resource Manager.

## 2. Sign in and open the gateway

1. After deployment completes, go to the AI Gateway tier instance.
1. In the gateway resource, select **Open portal**, or go to the AI Gateway tier portal URL that your organization provides.
1. Sign in with Microsoft Entra ID.
1. Select the gateway you created.

The AI Gateway tier portal uses your Entra ID permissions to configure gateway resources. Runtime callers don't need Azure portal access. They call the gateway with runtime access keys that you create later.

## 3. Add a model

1. In the gateway, select **Models**.
1. Select **Add model**.
1. Choose the provider. Supported providers in preview include:
   - Microsoft Foundry
   - Azure OpenAI
   - AWS Bedrock
   - Google Vertex
   - OpenAI
   - Anthropic
1. Enter the provider connection settings. The wizard shows the fields required for the selected provider.
1. Configure backend authentication. For this quickstart, an **API key** is the fastest path:
   - **API key** (recommended for this quickstart): paste the provider key. No role assignment is required.
   - **Managed identity**: available where the provider supports Microsoft Entra ID authentication, such as Microsoft Foundry or supported Azure OpenAI scenarios. Before you validate, assign the gateway identity the required backend role (for Azure OpenAI, **Cognitive Services OpenAI User**). See [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md#use-managed-identity-for-backend-authentication).
1. For the model name, enter `production-chat`.
1. Validate the connection, and then select **Add**.

The model name is the value callers pass in OpenAI-compatible requests. Keep it stable for this quickstart so the samples work without changes.

## 4. Create a runtime access key

1. Select **Runtime access**.
1. Select **Create key**.
1. Enter a name, such as `quickstart-client`.
1. Choose an expiration policy that matches your organization's requirements.
1. Select the model or gateway access scope allowed for the key.
1. Select **Create**.
1. Copy the key value and store it securely. You can't view the full key again after you leave the page.

Runtime access keys are created at the gateway level. Treat them like secrets. Store keys in a secret store for applications, rotate them regularly, and revoke keys that are no longer needed.

## 5. Call the gateway

The AI Gateway tier exposes an OpenAI-compatible endpoint. Use the gateway base URL and pass the model name in the `model` field.

### Python

Install the OpenAI client:

```bash
pip install openai
```

Set environment variables:

```bash
export AI_GATEWAY_BASE_URL="https://<gateway>.azure-api.net/v1"
export AI_GATEWAY_API_KEY="<runtime-access-key>"
```

The gateway expects your runtime access key in the `api-key` header. Pass it through `default_headers`, and provide a placeholder value for the SDK's required `api_key` parameter. Run this Python sample:

```python
import os
from openai import OpenAI

client = OpenAI(base_url=os.environ["AI_GATEWAY_BASE_URL"], api_key="unused", default_headers={"api-key": os.environ["AI_GATEWAY_API_KEY"]})

response = client.chat.completions.create(
    model="production-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Give me three benefits of using an AI gateway."},
    ],
)

print(response.choices[0].message.content)
```

### curl

```bash
curl "https://<gateway>.azure-api.net/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{
    "model": "production-chat",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Give me three benefits of using an AI gateway." }
    ]
  }'
```

If the request succeeds, the response uses the OpenAI chat completions format. If the request fails, check that:

- The runtime access key is active.
- The key has access to the model.
- The model name is spelled correctly.
- The backend provider credential is valid.
- For 403 errors, if you chose managed identity, assign the **Cognitive Services OpenAI User** role to the gateway identity on the backend resource - see [Use managed identity for backend authentication](./ai-gateway-govern-secure-operate.md#use-managed-identity-for-backend-authentication).

## 6. See telemetry

After you send a request, view telemetry for the gateway:

1. Select **Monitoring**.
1. Review request count, latency, token usage, and error rate.
1. Filter by model name to find traffic for `production-chat`.
1. Use failures and latency charts to troubleshoot backend provider issues.

Telemetry helps you understand usage across providers and applications. Callers use gateway-level runtime access keys, so you can monitor traffic without exposing provider credentials to client applications. The built-in **Monitoring** views work without extra setup. To export this telemetry to Application Insights or another OpenTelemetry endpoint, see [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md#monitoring).

## Clean up resources

When you're done, delete any resources you no longer need. Remove the AI Gateway tier instance, provider test deployments, and runtime access keys that you created only for evaluation.

## Related content

- [AI Gateway tier overview](./ai-gateway-overview.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [Govern, secure, and operate AI Gateway tier](./ai-gateway-govern-secure-operate.md)
