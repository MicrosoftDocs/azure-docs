---
title: Move AI workloads to AI Gateway
titleSuffix: AI Gateway
description: Plan how to move existing AI model and tool traffic to AI Gateway for centralized access, governance, and visibility, including workloads in Azure API Management.
author: santiagxf
ms.author: fasantia
ms.reviewer: fasantia
ms.date: 10/25/2026
ms.topic: concept-article
ms.service: azure
---

# Move AI workloads to AI Gateway

[AI Gateway](./overview.md) helps platform teams give applications and agents shared, governed access to AI models and tools. You can bring existing AI traffic through AI Gateway to centralize connections, apply AI-focused controls, and gain visibility into usage. Your starting point might be applications that call providers directly, an existing gateway, or AI gateway capabilities in Azure API Management.

Moving a workload means changing how its model and tool calls are managed and routed. You can keep the underlying model deployments, tool services, and the platforms that manage your other workloads. For example, an assistant can use AI Gateway for model access and federated MCP tools while business APIs continue to use API Management.

## Choose the capabilities your workloads need

Start with the improvement you want for applications, agents, or platform operations. AI Gateway can help you:

- **Share approved model connections.** Register existing model deployments and expose model aliases so applications use stable names while platform teams manage backend connections.
- **Bring tools together for agents.** Publish tools from multiple MCP backends through a shared gateway MCP endpoint.
- **Govern AI consumption.** Apply token allowances and estimated model-spend budgets with controls suited to the workload and its callers.
- **Understand usage.** Configure telemetry to observe model and tool activity and investigate requests.

Select workloads that benefit from these capabilities, then check their required model operations, MCP transports, authentication, policies, networking, and telemetry against AI Gateway support. Support for a provider doesn't imply support for every operation it offers.

### If your workloads use Azure API Management

Moving selected AI workloads is optional. AI Gateway and API Management are complementary: use AI Gateway for model- and tool-centered governance, and keep API lifecycle management, developer portal experiences, and business APIs in API Management.

AI gateway capabilities in API Management remain supported. Full AI feature parity between the products isn't planned, so assess each workload using [AI Gateway and Azure API Management service](./compare-api-management-service.md). For example, dependencies on backend-pool load balancing, failover, semantic caching, or A2A agent APIs can be reasons to keep a workload in API Management or design an alternative before moving it.

Other API Management tiers aren't affected by retirement of the earlier AIGateway SKU. If your resource uses that deprecated SKU, follow [Migrate from the AIGateway SKU in Azure API Management](./ai-gateway-resource.md) instead.

## Map the workload to AI Gateway

Inventory the model connections and tools you plan to bring through AI Gateway, their callers, backend services, credentials, controls, networking, and operational dependencies. Use that inventory to design the target configuration.

| Existing configuration | Target design to assess |
| --- | --- |
| Direct model calls or model APIs behind a gateway | Model providers and registered models, with the required protocol, endpoint, and backend authentication |
| Client-facing model names | Model aliases that preserve the names applications use where possible |
| MCP servers or HTTP API operations exposed as tools | MCP backends and selected tools published through gateway MCP endpoints |
| Application credentials and caller authorization, including API Management subscriptions | Gateway runtime credentials or Microsoft Entra access grants for the required callers |
| Controls in applications or an existing gateway | Supported AI Gateway controls configured for the appropriate models, tools, and callers |
| Consumption limits and caller grouping | Token-limit and cost-limit policies that meet the workload's allowance and estimated-spend requirements |
| Diagnostics, logs, and dashboards | Gateway telemetry, alerts, and dashboards that support equivalent operational checks |
| Deployment automation | Resource definitions and management operations for `Microsoft.ApiManagement/aigateways` |

Treat this mapping as a design assessment, not a direct configuration conversion. For workloads in API Management, APIs, products, subscriptions, and policies need to be mapped to AI Gateway's model- and tool-centered configuration. A token quota and an estimated monetary budget serve different purposes; neither replaces provider billing.

## Related content

- [AI Gateway and Azure API Management service](./compare-api-management-service.md)
- [AI Gateway concepts](./concepts.md)
- [Start with the Azure CLI extension](./get-started-cli.md)
