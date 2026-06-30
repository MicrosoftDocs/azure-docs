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

AI Gateway tier (preview) is a fully managed Azure API Management offering for AI workloads. It gives teams one place to publish, secure, govern, and observe access to AI models and Model Context Protocol (MCP) tools.

AI Gateway tier is in public preview. Preview features, regions, service limits, API shapes, and pricing can change before general availability.

## What is AI Gateway tier?

AI Gateway tier is a managed gateway for applications that call models and tools. Applications call a gateway endpoint instead of calling each provider or tool backend directly. The gateway authenticates the caller, applies policies, sends the request to the selected backend, returns the response, and emits telemetry.

Use AI Gateway tier when you want a fully managed path for AI traffic. You don't plan or manage customer scale units. Provisioning is quick. Billing is consumption-based with a free tier for getting started.

## Why use it

AI Gateway tier helps teams keep AI traffic governed. It gives platform teams a common runtime boundary for apps, models, and tools.

Use AI Gateway tier to:

- Put one gateway endpoint in front of supported AI providers.
- Keep provider credentials hidden from applications.
- Manage models, MCP servers, runtime access keys, policies, and monitoring.
- Apply governance controls such as token rate limits, request rate limits, content safety, IP filtering, and PII controls.
- Publish approved MCP tools for AI agents.
- Discover and consume assets through a self-service catalog.
- Sign in to manage the gateway with Microsoft Entra ID.

## Key concepts

### Gateway

A gateway is the runtime and management boundary for AI traffic. It provides one control plane for configuration and one data plane for application calls.

Control plane operations configure providers, models, MCP servers, policies, keys, and identity. Data plane traffic flows through the gateway endpoint to supported backends.

| Area | Value |
| --- | --- |
| Preview API version | `2026-05-01-preview` |

### Models

A model is a provider model you publish through the gateway. Applications call it by the name you assign, which keeps configuration readable and hides provider-specific endpoint details. Each model gets a managed gateway endpoint, and the gateway handles backend credentials so applications don't manage provider keys.

Supported providers include Microsoft Foundry, Azure OpenAI, AWS Bedrock, Google Vertex, OpenAI, and Anthropic. Provider support and behavior can change during preview.

### MCP server, backends, and tools

An MCP server is the governed front door for agents. It routes to one or more backends (remote MCP servers, OpenAPI APIs, or built-in connectors), and each backend exposes operations as tools that agents call. In AI Gateway tier, you can bring an MCP server by URL or convert an OpenAPI description into MCP tools.

A backend is the service behind a model or tool. It can be a provider endpoint, business API, search system, workflow endpoint, or another service exposed through MCP.

Tools are the approved operations that agents can use. Publishing tools through AI Gateway tier centralizes access control, monitoring, and governance.

### Policies

A policy is a runtime governance control for AI traffic. The AI Gateway tier shows common AI controls as cards and declarative settings in the portal, instead of requiring teams to edit XML.

| Policy | What it controls |
| --- | --- |
| Token rate limit | Token throughput during a rolling minute. |
| Request rate limit | Request volume during a rolling minute. |
| Content safety | Safety checks for prompts and responses. |
| IP filtering | Runtime calls from approved client network ranges. |
| PII controls | Detection and handling of personally identifiable information. |

### Runtime access keys

A runtime access key is a gateway-scoped key that applications use to call the gateway endpoint. Runtime access keys are separate from administrative permissions. Rotate keys regularly and scope them to the applications and environments that need them.

### Identity

Identity controls who can manage the gateway and how the gateway authenticates to backends. You sign in to manage the gateway with Microsoft Entra ID. Client applications authenticate to the gateway with runtime access keys. For supported model and MCP server backends, managed identity helps you avoid storing backend secrets.

When managed identity isn't available, provide provider keys during configuration. Prefer managed identity where available, and grant identities the minimum permissions required.

### Discover and consume

Developers browse a self-service catalog of available models and tools. Each asset includes connection details and usage instructions. Pin frequently used assets for quick access from the home page. Press Ctrl+K (⌘K on macOS) to open the command palette and jump to any asset or page.

## Regional availability

During public preview, you can provision AI Gateway tier in these regions:

| Geography | Region |
| --- | --- |
| United States | East US 2 |
| Europe | Sweden Central |

## What's new in public preview

The public preview includes these capabilities.

### Anthropic Messages passthrough

Anthropic Messages passthrough lets applications send native Anthropic Messages requests through AI Gateway tier while still using gateway governance, access control, and monitoring.

### Managed identity for backend authentication

Managed identity lets AI Gateway tier authenticate to supported model and MCP server backends without customer-managed secrets. This is a new public preview capability. It aligns backend authentication with Azure identity practices and reduces key management work.

### Private networking

Private networking includes inbound Private Link and outbound virtual network integration. Use these capabilities for enterprise network isolation and regulated workloads.

## Frequently asked questions

### Is AI Gateway tier ready for production?

AI Gateway tier is in public preview, so availability is best effort without generally available service-level commitments. Breaking changes to APIs, portal workflows, telemetry, limits, regions, or pricing can happen. Preview quotas can cap the number of models, tools, runtime access keys, requests, and token throughput. Start with noncritical workloads, controlled pilots, and clear rollback plans.

### How is pricing handled during preview?

AI Gateway tier has a free tier to get started and then uses consumption billing. You might also pay for related resources, such as model providers, Application Insights, networking, and observability platforms.

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