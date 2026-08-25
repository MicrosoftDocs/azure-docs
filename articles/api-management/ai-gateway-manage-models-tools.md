---
title: Manage models and tools in AI Gateway tier (preview)
titleSuffix: Azure API Management
description: Learn how to add models and MCP tool backends to an AI Gateway tier (preview) instance from Azure API Management.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 07/23/2026
ms.custom: references_regions
---

# Manage models and tools in AI Gateway tier (preview)

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

Use AI Gateway tier (preview) to manage the models and tools that applications and agents call. Import models to provide one governed endpoint for model requests. Add MCP servers to expose approved tools through a governed Model Context Protocol (MCP) endpoint. Applications and agents authenticate to the gateway with runtime access keys. The gateway uses the backend authentication you configure for each model provider or tool backend.

## Prerequisites

- An AI Gateway tier instance.
- Permission to manage the AI Gateway tier instance.
- Access to the provider model or backend you plan to add.
- For managed identity backend authentication, permission to assign the required role on the backend resource.

  > [!CAUTION]
  > **Security consideration:** Users with permissions to edit API Management policies can use this policy to authenticate as the service's managed identity. However, they can't gain direct access to resources without first assigning a managed identity to the API Management instance. Once a managed identity is assigned, users who can modify policies might be able to exfiltrate the authentication token, propagate it to a backend, or log it for later use. For detailed security guidance and mitigation strategies, see [Security considerations for managed identities](api-management-howto-use-managed-service-identity.md#security-considerations-for-managed-identities) in the managed identity overview.

## Import models

Use the **Add models** wizard to connect the AI Gateway tier to Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, OpenAI, Anthropic, or custom endpoints. The gateway serves each model on the endpoints that its backend supports, under the prefix `https://<gateway>.azure-api.net/default/models`. The next path segment is the provider API format. For example, OpenAI-compatible models are served at `.../default/models/openai/v1` (such as `/chat/completions` and `/responses`), and Anthropic models at `.../default/models/anthropic/v1/messages`. The connection fields that the wizard requires vary by provider.

Choose **Import from Foundry** when your model runs in a Microsoft Foundry resource, which includes Azure OpenAI and Azure AI Services deployments. The wizard automatically discovers the resource's deployments. Choose **Add a custom model** for AWS Bedrock, Google Vertex, OpenAI, Anthropic, or any other supported endpoint, where you enter the endpoint and model names yourself.

Use managed identity when the provider supports Microsoft Entra ID backend authentication, such as Microsoft Foundry. Grant the gateway identity the required role on the backend resource before import. Otherwise, provide the provider's API key or secret during import. The gateway stores and protects the credential.

Callers reference the model by its model name in the `model` field:

```json
{
  "model": "gpt-5.6-sol",
  "messages": [
    {
      "role": "user",
      "content": "Summarize the incident report."
    }
  ]
}
```

The `model` value is the model name given by the imported model.

> [!NOTE]
> Currently, every model name in the gateway must be unique across all providers. The gateway routes each request by an exact match on the `model` value.

To add models, open the **Models** page and select **Add models**. Choose how you want to connect.

### Import from Microsoft Foundry

1. Select **Import from Foundry**.
1. On **Select resource**, choose the subscription and Foundry resource. The wizard lists the model deployments in that resource.
1. On **Provider details**, enter a provider name and display name, add an optional description, and choose the authentication method - **Managed identity** (recommended, when available) or **Key-based**.
1. Select **Create**. The gateway imports the resource's deployments as models that callers request by name.

> [!NOTE]
> To use **Managed identity**, the gateway must already have a managed identity configured, and you must have permission to assign the **Foundry User** role to that identity on the Foundry resource. When you have sufficient permissions, the import wizard assigns the role for you.

### Add a custom model

1. Select **Add a custom model**.
1. On **Provider**, enter a display name, provider name, and an optional description.
1. On **Endpoint**, enter the base endpoint URL, the authentication header name (for example, `Authorization`), and the API key.
1. On **Models**, enter each model name and select its supported endpoints - **OpenAI chat completions**, **OpenAI responses**, **Anthropic messages**, or **Other**. Select **Add model** for each model you define.
1. Select **Create**.

There's no separate validation step. The gateway sets up the connection when you create the provider. After you add a model, you can update its authentication or policies, or remove it when it's no longer needed.

After the model is added, send a test request through the gateway endpoint:

```bash
curl "https://<gateway>.azure-api.net/default/models/openai/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{
    "model": "gpt-5.6-sol",
    "messages": [
      { "role": "user", "content": "Write a one-sentence status update." }
    ]
  }'
```

If you didn't create a runtime access key yet, create one from the **Keys** page. Applications don't need direct provider credentials. Use monitoring views to review request volume, latency, token usage, and errors by model name.

## Anthropic Messages API passthrough

Different providers expose different API formats. The gateway serves each format at its own path under `/default/models`. Anthropic models use the Anthropic Messages API in **passthrough** mode. The gateway preserves the native Anthropic Messages request and response format and forwards calls to Anthropic at `/default/models/anthropic/v1/messages`. Use it when applications already use the Anthropic SDK or `/v1/messages`.

To add an Anthropic model, use **Add models** > **Add a custom model**:

1. On **Provider**, enter a display name and provider name for Anthropic.
1. On **Endpoint**, set the base endpoint URL to `https://api.anthropic.com`, set the authentication header name to `x-api-key`, and enter the Anthropic API key. The gateway stores the key and injects it on backend calls.
1. On **Models**, enter the Anthropic model name that callers send (such as `claude-fable-5`), and select the **Anthropic messages** endpoint.
1. Select **Create**. The gateway serves Anthropic Messages passthrough at `/default/models/anthropic/v1/messages`.

Clients call the gateway path. The gateway stores the credential, injects the backend `x-api-key`, and forwards the caller's `anthropic-version` header to Anthropic.

```bash
curl -X POST "https://<gateway>.azure-api.net/default/models/anthropic/v1/messages" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -H "api-key: <runtime-access-key>" \
  -d '{"model":"claude-fable-5","max_tokens":256,"messages":[{"role":"user","content":"Write a product description for a trail running backpack."}]}'
```

The Anthropic Python SDK works when you point `base_url` at the gateway path. By default, the stock SDK sends the credential in the `x-api-key` header, so pass the gateway runtime access key in the `api-key` header by using `default_headers`. The `api_key="unused"` value only satisfies the SDK's required argument; the gateway ignores it and injects the stored backend Anthropic key. Set `model` to the Anthropic model name.

```python
from anthropic import Anthropic

client = Anthropic(api_key="unused", base_url="https://<gateway>.azure-api.net/default/models/anthropic", default_headers={"api-key": "<runtime-access-key>"})
message = client.messages.create(model="claude-fable-5", max_tokens=256, messages=[{"role":"user","content":"Hello"}])
print(message.content[0].text)
```

Validate timeouts and response handling before production, especially if policies inspect bodies.

## Add MCP servers

The AI Gateway tier enables platform teams to publish MCP servers behind one governed MCP endpoint. The configuration workflow is: create an MCP server, attach one or more backends, and expose selected backend capabilities as tools. A single MCP server can combine three kinds of backends: remote **MCP servers** (by URL), tools generated from an **OpenAPI spec**, and **built-in connectors** for common SaaS apps (more than 1,000 prebuilt integrations, with no server to host).

Use MCP servers when agents need to call business systems, developer tools, knowledge stores, or internal APIs. Agents authenticate once to the gateway and don't need separate credentials for each backend. For each backend, you choose how the gateway authenticates to it: **None**, **API Key**, **OAuth 2.0**, or **Managed identity**.

A single MCP server federates one or more backends. Each backend contributes tools, and the gateway namespaces each backend's tools with the backend name so identically named tools from different backends don't collide. For example, a `create_issue` tool from a backend named `github` is exposed to agents under the `github` namespace, distinct from a `create_issue` tool on another backend.

| Backend type | Use when | Input | Gateway result |
| --- | --- | --- | --- |
| **MCP server** | You already host a remote MCP endpoint | MCP endpoint URL (SSE or streamable HTTP) | The remote server's tools, federated through the governed endpoint |
| **OpenAPI spec** | You have a REST API that agents should call as tools | OpenAPI document (upload, URL, or inline paste) | MCP tools generated from the operations you select |
| **Built-in connector** | You need a common SaaS app without hosting a server | Connector selection and connection setup | The connector's actions, exposed as MCP tools |

Each source contributes tools differently:

- **MCP server** — federates the tools from a remote MCP endpoint you already host.
- **OpenAPI spec** — turns the API operations you select into tools; the operation's summary or description becomes the tool description.
- **Built-in connector** — uses a managed connection to a SaaS app such as Office 365, SharePoint, GitHub, or Salesforce. OAuth connectors prompt for consent when you set up the connection.

> [!NOTE]
> During public preview, supported transports, hosting options, and limits can vary by region. Check the preview registration details for your subscription before moving production traffic.

To create an MCP server:

1. In the AI Gateway tier portal, select **MCP servers**.
1. Select **Add MCP server**.
1. On **Source**, pick a backend type to start: **MCP server**, **OpenAPI spec**, or **Built-in connector**. You can add more backends afterward.
1. Give the backend a unique name. The gateway prefixes that backend's tools with the name in the combined MCP server.
1. Configure the backend and choose how the gateway authenticates to it: **None**, **API Key**, **OAuth 2.0**, or **Managed identity**. For **API Key**, enter the header name and value; values are encrypted at rest.
1. To federate more services behind the same endpoint, add another backend and repeat.
1. Select **Confirm**, and then **Create**.

There's no separate connectivity test step. The gateway sets up and checks each backend when you create the server.

The gateway creates one MCP endpoint that federates all selected backends. Clients call the governed endpoint and authenticate with a runtime access key.

> [!NOTE]
> **OAuth 2.0 backend authentication (preview limitation).** For a backend that uses **OAuth 2.0**, you complete an interactive sign-in to authorize the gateway to that backend. The gateway doesn't report a verified authorization status back to the portal, so after the sign-in window confirms completion, confirm the result in the portal when prompted. The status shown for the backend is self-reported—verify that the backend's tools appear on the MCP server, and reconnect to sign in again if they don't.

Agents call the MCP server at:

`https://<gateway>.azure-api.net/default/toolservers/<server-name>/mcp`

Send the runtime access key in the `api-key` header. Point any MCP-compatible client or agent framework at this URL. For example, list the available tools with a JSON-RPC `tools/list` request:

### [curl](#tab/curl)

```bash
curl "https://<gateway>.azure-api.net/default/toolservers/<server-name>/mcp" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }'
```

### [Python](#tab/python)

```python
import requests

url = "https://<gateway>.azure-api.net/default/toolservers/<server-name>/mcp"
response = requests.post(
    url,
    headers={"api-key": "<runtime-access-key>", "Content-Type": "application/json"},
    json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"},
)
print(response.json())
```

---

If a system has a REST API but no MCP server, import its OpenAPI description. Select operations to expose as tools, edit tool names and descriptions, configure a supported backend authentication method, and create the MCP asset. The gateway maps tool calls to REST operations.

Use the gateway for MCP servers to centralize:

- **Discovery** — provide one catalog of approved MCP servers for developers and agents.
- **Authentication** — clients authenticate to the gateway. The gateway stores backend credentials, so client configuration doesn't contain upstream secrets.
- **Tool exposure** — choose which backend operations each server publishes as tools. In preview, every runtime access key can call all published assets in the gateway.
- **Observability** — the gateway emits OpenTelemetry (OTLP) token usage metrics for model traffic, which you can send to Application Insights or another OTLP destination. MCP tool traffic monitoring (request volume, latency, and errors) is available in the portal when you use Application Insights; OpenTelemetry (OTLP) export for MCP tool traffic isn't available yet.
- **Governance** — apply the same policies to MCP traffic that you use for models, such as rate limits and content safety.

After you create the server, configure runtime access before sharing it. Add policies such as content safety, IP filters, and token and request rate limits, scoped to the gateway or to specific published assets.

## Related content

- [AI Gateway tier overview](./ai-gateway-overview.md)
- [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md)
- [Govern, secure, and operate AI Gateway tier](./ai-gateway-govern-secure-assets.md)
- [Configure private networking](./ai-gateway-configure-private-networking.md)
