---
title: What is AI Gateway?
titleSuffix: AI Gateway
description: Learn how AI Gateway helps organizations manage AI traffic through centralized connectivity, access, governance, and operational visibility.
ms.service: azure
ms.topic: overview
ms.date: 10/23/2026
---

# What is AI Gateway?

[!INCLUDE [ai-gateway-preview](./includes/preview.md)]

AI Gateway is a managed gateway for AI traffic, including requests to AI models and Model Context Protocol (MCP) servers. It gives organizations a shared point of control for how applications and agents connect to AI services, consume resources, and access tools.

As AI adoption grows, teams connect to models and tools operated by different providers. Managing each connection independently can duplicate credential handling and consumption controls while making usage harder to understand. AI Gateway brings those connections together so platform teams can manage them centrally while developers focus on building applications.

:::image type="content" source="media/overview/gateway-connect.png" alt-text="Diagram showing users, AI agents, apps, and devices connecting through AI Gateway to models and tools.":::

## Key capabilities

**Connect applications to models.** Bring existing Microsoft Foundry deployments and compatible custom model providers behind gateway endpoints. Model aliases give applications stable names while platform teams manage the backend connections.

**Publish tools for agents.** Combine tools from remote MCP servers, OpenAPI-described APIs, and built-in connectors behind gateway MCP endpoints. For example, an assistant can use approved tools from several services through a shared connection.

**Manage access and governance.** Separate application credentials from backend credentials. Apply shared controls for access, consumption, and estimated model spend instead of implementing each control in every application.

**Support enterprise connectivity and visibility.** Connect to backends through controlled network paths, including virtual network connectivity for private backends. Use telemetry to understand model and tool usage and investigate requests.

**Help developers reuse approved capabilities.** Provide a catalog where developers can discover and test models and tools before connecting applications and agents.

For the relationships between these elements, see [AI Gateway concepts](./concepts.md).

## Relationship to Azure API Management

AI Gateway is a dedicated product for AI traffic. Azure API Management service provides comprehensive API lifecycle management and also supports AI gateway capabilities. The products share the `Microsoft.ApiManagement` resource provider but use different Azure resource types.

You can use both products: keep business APIs in API Management service and use AI Gateway for model and tool traffic. Existing AI workloads in other API Management SKUs remain supported. For adoption considerations, see [AI Gateway and Azure API Management service](./compare-api-management-service.md).

## Related content

- [AI Gateway concepts](./concepts.md)
- [Migrate from the AIGateway SKU in Azure API Management](./ai-gateway-resource.md)
- [Move AI workloads to AI Gateway](./migrate-api-management.md)
- [Start with the Azure CLI extension](./get-started-cli.md)
- [In-product documentation](https://ai.gateway.azure.com/docs)
