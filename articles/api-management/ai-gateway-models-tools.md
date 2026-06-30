---
title: Manage models and tools
description: Learn how to add models and MCP tool backends to an Azure API Management AI Gateway instance.
ms.service: azure-api-management
author: <your-github-alias>
ms.author: <your-ms-alias>
ms.topic: how-to
ms.date: 06/29/2026
---

**APPLIES TO: AI Gateway (preview)**

# Manage models and tools

Use AI Gateway to manage the models and tools that applications and agents call. Import models to provide one governed endpoint for model requests. Add MCP servers to expose approved tools through a governed Model Context Protocol (MCP) endpoint. Applications and agents authenticate to the gateway with runtime access keys. The gateway uses the backend authentication you configure for each model provider or tool backend.

## Prerequisites

- An AI Gateway instance.
- Permission to manage the AI Gateway instance.
- Access to the provider model or backend you plan to add.
- For managed identity backend authentication, permission to assign the required role on the backend resource.

## Import models

Use the **Add model** wizard to connect AI Gateway to Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, OpenAI, Anthropic, or custom endpoints. Runtime callers usually use the OpenAI-compatible base URL `https://<gateway>.azure-api.net/v1`. Exact fields vary by region, model family, and preview capability.

| Provider | Typical model information | Backend authentication | Notes |
| --- | --- | --- | --- |
| Microsoft Foundry | Project or resource, model deployment, endpoint, model format | API key or managed identity | Register Foundry deployments and expose them through the gateway. Grant the gateway identity access to the Foundry resource when using managed identity. |
| Azure OpenAI | Azure OpenAI resource, deployment name, API version, endpoint | API key or managed identity | Use managed identity when your deployment and tenant configuration support it. |
| AWS Bedrock | Region, model ID, endpoint or provider routing information | API key | Provide the provider key or secret during import, and rotate it according to your provider process. |
| Google Vertex | Project, location, publisher, model ID, endpoint | API key | Provide the provider key or secret during import. |
| OpenAI | Model name or project routing information | API key | Provide the OpenAI API key during import. |
| Anthropic | Model name and Messages API settings | API key | For native Anthropic message shapes, see [Anthropic Messages API passthrough](#anthropic-messages-api-passthrough). |

Use managed identity when the provider supports Microsoft Entra ID backend authentication, such as supported Microsoft Foundry or Azure OpenAI configurations. Grant the gateway identity the required role on the backend resource before import. Otherwise, provide the provider's API key or secret during import. The gateway stores and protects the credential.

When you import a model, assign a model name for callers to use in the `model` field:

```json
{
  "model": "production-chat",
  "messages": [
    {
      "role": "user",
      "content": "Summarize the incident report."
    }
  ]
}
```

Use clear names such as `production-chat`, `evaluation-chat`, or `embeddings-default`. The name gives callers a stable identifier and hides provider-specific deployment details.

To add a model by using the wizard:

1. In the Azure portal or AI Gateway management experience, open your AI Gateway instance.
1. Select **Models**.
1. Select **Add model**.
1. On **Provider**, choose the provider that hosts your model.
1. On **Model details**, enter the endpoint, resource, deployment, region, project, or model ID values that the wizard requests. For Microsoft Foundry, select or enter the deployment to register. For custom endpoints, provide the endpoint URL and model metadata required by the gateway.
1. On **Authentication**, choose the backend authentication method:
   - Select **Managed identity** if the provider supports it. Choose the gateway identity and confirm that it has access to the backend resource.
   - Select **API key** if the provider requires a key. Enter the key value that the provider issued.
1. On **Model name**, enter a gateway model name, such as `production-chat`.
1. Select **Validate** to check connectivity and credential configuration.
1. Review the summary, and then select **Add**.

Validation helps catch configuration problems before applications call the gateway. If validation fails, check endpoint reachability, model or deployment name, identity permissions, and credential configuration.

After import, you can update a model's backend target, authentication, or policies without changing the model name that applications call. Remove a model when it's no longer needed, and revoke any runtime access keys that were scoped to it.

After the model is added, send a test request through the gateway endpoint:

```bash
curl "https://<gateway>.azure-api.net/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "api-key: <runtime-access-key>" \
  -d '{
    "model": "production-chat",
    "messages": [
      { "role": "user", "content": "Write a one-sentence status update." }
    ]
  }'
```

If you haven't created a runtime access key yet, create one from **Runtime access** and scope it to the model name callers use. Applications don't need direct provider credentials. Use monitoring views to review request volume, latency, token usage, and errors by model name.

## Anthropic Messages API passthrough

Most providers use the OpenAI-compatible endpoint. Anthropic models can also use **passthrough** mode. In this mode, the gateway preserves the native Anthropic Messages API request and response shape and forwards calls to Anthropic. Use passthrough when applications already use the Anthropic SDK or `/v1/messages`.

> [!NOTE]
> Anthropic Messages API passthrough is in public preview. Only the `/v1/messages` endpoint is supported, and support can change before GA.

To import Anthropic as passthrough, use **Add model**:

1. Choose **Custom provider**.
1. Set **API format** to **Anthropic Messages API (passthrough)**.
1. Set the backend to `https://api.anthropic.com`.
1. Expose a stable path such as `/anthropic`, and add `POST /v1/messages`.
1. Provide the Anthropic API key.
1. Set the gateway **model name** that callers send in the request body (for example, `enterprise-claude`), and map it to the target Anthropic model.

Clients call the gateway path. The gateway stores the credential, injects the backend `x-api-key`, and forwards the caller's `anthropic-version` header to Anthropic.

```bash
curl -X POST "https://<gateway>.azure-api.net/anthropic/v1/messages" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -H "api-key: <runtime-access-key>" \
  -d '{"model":"enterprise-claude","max_tokens":256,"messages":[{"role":"user","content":"Write a product description for a trail running backpack."}]}'
```

The Anthropic Python SDK works when you point `base_url` at the gateway path. By default, the stock SDK sends the credential in the `x-api-key` header, so pass the gateway runtime access key in the `api-key` header by using `default_headers`. Set `model` to the model name you configured in AI Gateway; the gateway maps that name to the Anthropic backend model, so you don't send a raw Anthropic model ID. The gateway keeps the backend Anthropic key and doesn't send it to clients.

```python
from anthropic import Anthropic

client = Anthropic(api_key="unused", base_url="https://<gateway>.azure-api.net/anthropic", default_headers={"api-key": "<runtime-access-key>"})
message = client.messages.create(model="enterprise-claude", max_tokens=256, messages=[{"role":"user","content":"Hello"}])
print(message.content[0].text)
```

Validate timeouts and response handling before production, especially if policies inspect bodies.

## Add MCP servers

AI Gateway lets platform teams publish MCP servers behind one governed MCP endpoint. The configuration workflow is: create an MCP server, attach one or more backends, and expose selected backend capabilities as tools. A single MCP server can combine remote MCP server URLs, tools generated from REST OpenAPI descriptions, and built-in connectors for services such as Microsoft 365, Salesforce, Slack, GitHub, and ServiceNow.

Use MCP servers when agents need to call business systems, developer tools, knowledge stores, or internal APIs. Consumers authenticate to the gateway and don't need separate credentials for each backend. For backend authentication, AI Gateway supports API key headers, OAuth, and managed identity, which is a new public preview capability.

A single MCP server federates one or more backends. Each backend contributes tools.

| Backend type | Use when | Input | Gateway result |
| --- | --- | --- | --- |
| MCP server URL | You already host an MCP-compatible endpoint | SSE or streamable HTTP URL | Federated tools exposed through the governed MCP endpoint |
| OpenAPI specification | You have REST APIs that agents should call as tools | OpenAPI document URL or upload | Generated MCP tools mapped to selected operations |
| Built-in connector | You need common enterprise apps without custom integration code | Connector selection and action configuration | Connector actions exposed as MCP tools alongside your other backends |
| Stdio package | You have a command-based server packaged for hosted execution | Command, arguments, and environment references | A gateway-managed server process with secured secrets |

> [!NOTE]
> During public preview, supported transports, hosting options, and limits can vary by region. Check the preview registration details for your subscription before moving production traffic.

To add backends to an MCP server:

1. In the Azure portal, open your AI Gateway resource.
1. In the left menu, select **MCP servers**.
1. Select **Add MCP server**.
1. Enter a display name, server name, and description for the governed endpoint.
1. Add one or more backends.
1. Configure backend authentication for each source. API key headers, OAuth, and managed identity are supported during preview. For API keys, provide the value and specify the header name that the backend expects.
1. Select **Validate connection** to confirm that the gateway can reach each backend.
1. Select **Create**.

The following table describes the backend source types you can add:

| Source type | Configuration |
| --- | --- |
| MCP server URL | Enter the SSE or streamable HTTP endpoint and validate the server capabilities. |
| OpenAPI specification | Provide an OpenAPI document URL or upload, then select operations to expose as tools. |
| Built-in connector | Choose a connector such as Microsoft 365, Salesforce, or Slack, then select supported actions. |
| Stdio package | Enter the execution command, arguments, and required environment variables to run the server process. |

The gateway creates one MCP endpoint that federates all selected backends. Clients call the governed endpoint and authenticate with a runtime access key.

If a system has a REST API but no MCP server, import its OpenAPI description. Select operations to expose as tools, edit tool names and descriptions, configure API key authentication, and create the MCP asset. The gateway maps tool calls to REST operations.

Use the gateway for MCP servers to centralize:

- **Discovery** — provide one catalog of approved MCP servers for developers and agents.
- **Authentication** — clients authenticate to the gateway. The gateway stores backend credentials, so client configuration doesn't contain upstream secrets.
- **Authorization** — choose which tools each server exposes. You can create read-only and full-access views through configuration.
- **Observability** — capture telemetry for each tool call and capability listing.
- **Governance** — apply the same policies to MCP traffic that you use for models, such as rate limits and content safety.

After you create the server, configure runtime access before sharing it. Add policies such as request rate limits, token rate limits, content safety, and IP filtering based on each tool and backend.

## Related content

- [AI Gateway overview](./overview.md)
- [Quickstart: Create an AI Gateway instance](./quickstart-create.md)
- [Govern, secure, and operate](./govern-and-operate.md)
