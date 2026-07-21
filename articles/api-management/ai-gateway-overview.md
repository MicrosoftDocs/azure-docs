---
title: AI Gateway tier (preview) overview
description: Learn how AI Gateway tier (preview) helps you publish, secure, govern, and observe access to AI models and tools.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: overview
ms.date: 06/29/2026
---

# AI Gateway tier (preview) overview

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

AI Gateway tier (preview) from Azure API Management is a fully managed gateway for AI workloads. It gives teams one place to publish, secure, govern, and observe access to AI models and Model Context Protocol (MCP) tools.

AI Gateway tier is in public preview. Preview features, regions, service limits, and APIs can change before general availability. Pricing and the business model will be announced later in the preview.

## What is AI Gateway tier?

AI Gateway tier is a managed gateway for applications that call models and tools. Applications call a gateway endpoint instead of calling each provider or tool backend directly. For each request, the gateway:

1. Authenticates the runtime access key in the `api-key` header.
1. Evaluates the policies that apply to the target model or tool.
1. Routes the request to the selected backend — by the `model` field for models, or the tool name for tools — using the backend credentials you configured.
1. Returns the response and emits telemetry, such as token counts, latency, and traces.

Use AI Gateway tier when you want a fully managed path for AI traffic: you don't plan or manage scale units, and provisioning takes about a minute.

## Why use it

AI Gateway tier helps teams keep AI traffic governed. It gives platform teams a common runtime boundary for apps, models, and tools.

Use AI Gateway tier to:

- Put one gateway endpoint in front of supported AI providers.
- Keep provider credentials hidden from applications.
- Manage models, MCP servers, runtime access keys, policies, and monitoring.
- Apply governance controls such as token rate limits, request rate limits, content safety, and IP filtering.
- Publish approved MCP tools for AI agents.
- Discover and use available models and tools through a self-service catalog.
- Sign in to manage the gateway with Microsoft Entra ID.

### Choose your path

- **New to AI Gateway tier?** Start with the [Quickstart](./quickstart-ai-gateway-create.md) — create a gateway, add a model, and make your first call in about 20 minutes.
- **Adding models or tools?** See [Manage models and tools](./ai-gateway-manage-models-tools.md) for Foundry and custom models, and for MCP tool servers.
- **Running it in production?** See [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md) for policies, identity, networking, and monitoring.

## Key concepts

### Gateway

A gateway is the runtime and management boundary for AI traffic. When you provision AI Gateway tier, you create a dedicated Azure resource in your subscription and resource group. Provisioning takes about a minute, and you don't plan or add scale units.

A gateway has two planes:

- **Control plane** — management operations that configure providers, models, MCP servers, policies, keys, and identity. Automation uses the preview management API version `2026-05-01-preview` through Azure Resource Manager.
- **Data plane** — the runtime endpoint that applications call. The gateway name and region form the host name `https://<gateway>.<region>.ai.gateway.azure.com`. Model requests go to `/default/models/<provider>/v1/<operation>`, and MCP tool requests go to `/default/toolservers/<server-name>/mcp`. Data-plane requests authenticate with a runtime access key in the `api-key` header, not with Azure Resource Manager tokens.

:::image type="content" source="media/ai-gateway-architecture.png" alt-text="Diagram of applications, agents, and coding agents calling the AI Gateway tier, which authenticates the runtime key, applies policies, and emits telemetry before routing requests to model providers and MCP tool backends." lightbox="media/ai-gateway-architecture.png":::

### Models

A model is a provider's model that you publish through the gateway. Applications call it by its name in the `model` field of the request. OpenAI-compatible models (Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, and OpenAI) share one runtime endpoint (`.../models/openai/v1`). The gateway routes each request to the correct backend by an exact match on the `model` value, so give each model a unique name within the gateway. The gateway handles backend credentials, so applications don't manage provider keys.

Supported providers include Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, and OpenAI. Anthropic is supported through a custom provider that uses Messages API passthrough. Provider support and behavior can change during preview.

### MCP server, backends, and tools

An MCP server is a single governed endpoint that agents call to reach tools. It federates one or more backends, and each backend exposes operations as tools that agents call. In AI Gateway tier, one MCP server can combine four kinds of backends: a remote **MCP server** (by URL), tools generated from an **OpenAPI spec**, **built-in connectors** (more than 1,000 SaaS integrations, with no server to host), and a **Foundry Toolbox** of Microsoft Foundry tools. For each backend, you choose how the gateway authenticates: **None**, **API Key**, **OAuth 2.0**, or **Managed identity**.

A backend is the service behind a model or tool. It can be a provider endpoint, business API, search system, workflow endpoint, or another service exposed through MCP.

Tools are the approved operations that agents can use. Publishing tools through AI Gateway tier centralizes access control, monitoring, and governance.

### Policies

A policy is a runtime governance control for AI traffic. AI Gateway tier shows common AI controls as cards and declarative settings in the portal, instead of requiring teams to edit XML.

| Policy | What it controls |
| --- | --- |
| Token rate limit | Token throughput during a rolling minute. |
| Request rate limit | Request volume during a rolling minute. |
| Content safety | Safety checks for prompts and responses. |
| IP filtering | Runtime calls from approved client network ranges. |

### Runtime access keys

A runtime access key is a gateway-scoped key that applications use to call the gateway endpoint. In the AI Gateway tier portal, these keys appear on the **Keys** page and are created with **Create API key**; applications send them in the `api-key` header. A key grants runtime access to every model and tool in the gateway, and it's separate from the Microsoft Entra ID permissions that administrators use to manage the gateway. Issue a separate key per application and environment so you can rotate and audit them independently.

### Identity

Identity controls who can manage the gateway and how the gateway authenticates to backends. You sign in to manage the gateway with Microsoft Entra ID. Client applications authenticate to the gateway with runtime access keys. For supported model and MCP server backends, managed identity helps you avoid storing backend secrets.

When managed identity isn't available, provide provider keys during configuration. Prefer managed identity where available, and grant identities the minimum permissions required.

### Self-service catalog

Developers browse a self-service catalog of available models and tools. Each asset includes connection details and usage instructions. Pin frequently used assets for quick access from the home page. Press Ctrl+K (⌘K on macOS) to open the command palette and jump to any asset or page.

## Regional availability

During public preview, you can provision AI Gateway tier in these regions:

| Geography | Region |
| --- | --- |
| United States | East US 2 |
| Europe | Sweden Central |

## Capabilities in public preview

Along with the core model, tool, policy, and monitoring features, the public preview includes these capabilities.

### Anthropic Messages passthrough

Anthropic Messages passthrough lets applications send native Anthropic Messages requests through AI Gateway tier while still using gateway governance, access control, and monitoring.

### Managed identity for backend authentication

Managed identity lets AI Gateway tier authenticate to supported model and MCP server backends without customer-managed secrets. It aligns backend authentication with Azure identity practices and reduces key management work.

### Private networking

Private networking includes inbound Private Link and outbound virtual network integration. Use these capabilities for enterprise network isolation and regulated workloads.

## Frequently asked questions

### When should I use AI Gateway tier instead of calling providers directly?

Use AI Gateway tier when you want one governed endpoint in front of many models and tools: central runtime keys instead of provider credentials in every application, shared policies (token and request limits, content safety, IP filtering), unified telemetry, and a self-service catalog. If you call a single model from a single application and don't need governance or central credentials, calling the provider directly can be simpler.

### Should I import from Foundry or add a custom model?

Import from Foundry when your model runs in a Microsoft Foundry or Azure OpenAI (Azure AI Services) resource; the wizard discovers the resource's deployments for you. Add a custom model for AWS Bedrock, Google Vertex, OpenAI, Anthropic, or any other OpenAI-compatible endpoint, where you enter the endpoint and model names yourself. See [Manage models and tools](./ai-gateway-manage-models-tools.md#import-models).

### Is AI Gateway tier ready for production?

AI Gateway tier is in public preview, so availability is best effort and has no service-level agreement (SLA). Breaking changes to APIs, portal workflows, telemetry, limits, regions, or pricing can happen. Preview quotas can limit how many models, tools, and runtime access keys you create, and the request and token throughput available to you. Specific preview limits will be published before general availability; contact your Microsoft representative for the current quotas that apply to your subscription. Start with noncritical workloads, controlled pilots, and clear rollback plans.

### How is pricing handled during preview?

Pricing and the business model for AI Gateway tier will be announced later in the preview. You might also pay for related resources that you use with the gateway, such as model providers, Application Insights, networking, and observability platforms.

### Which regions are available?

AI Gateway tier is available in East US 2 and Sweden Central. See [Regional availability](#regional-availability).

### How is my data handled?

You choose where telemetry goes. With Application Insights, it stays in your Azure subscription. Other OpenTelemetry (OTLP) destinations follow your configuration and the provider's terms. Telemetry uses OpenTelemetry GenAI semantic conventions (the `gen_ai.*` prefix). Data residency depends on the full request path, so place the gateway, backends, and telemetry destinations in approved regions and involve your security and privacy teams.

### Does AI Gateway tier support private networking?

Yes. Inbound Private Link and outbound virtual network integration are part of the public preview. See [Govern, secure, and operate](./ai-gateway-govern-secure-operate.md) for setup, DNS, and limitations.

### Which API version should I use for automation?

Use the preview management API version `2026-05-01-preview`. Validate automation before a broad rollout because the API is in preview.

## Related content

- [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [Govern, secure, and operate AI Gateway tier](./ai-gateway-govern-secure-operate.md)