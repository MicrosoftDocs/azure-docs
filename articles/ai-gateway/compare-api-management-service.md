---
title: AI Gateway and Azure API Management service
titleSuffix: AI Gateway
description: Compare AI Gateway with Azure API Management service to choose how to govern AI workloads, manage business APIs, or use both products together.
ms.service: azure
ms.topic: concept-article
ms.date: 10/24/2026
---

# AI Gateway and Azure API Management service

[!INCLUDE [ai-gateway-preview](./includes/preview.md)]

AI Gateway and Azure API Management service offer different approaches to managing AI traffic and APIs. In this article, you learn how their scopes, management models, and AI capabilities compare so you can decide which product fits your workloads and when to use both together.

## Understand the product distinction

Although AI Gateway builds on the API Management gateway foundation and belongs to the same product family, the two products have distinct scopes and roadmaps.

**AI Gateway** is the dedicated product for managing AI traffic. Platform teams publish approved models and tools, control access and consumption, and observe their use across applications and agents.

**AI gateway capabilities in Azure API Management service** extend the service's API management model to AI backends. Teams manage model endpoints, Model Context Protocol (MCP) servers, and other AI endpoints alongside their APIs. These capabilities remain available and supported.

> [!TIP]
> The phrase *AI gateway* in API Management documentation can refer to those capabilities rather than the AI Gateway product.

## Compare management approaches

The main distinction is how you manage the workload, rather than whether either product can handle AI traffic.

| Area | AI Gateway | Azure API Management service |
| --- | --- | --- |
| Primary customer job | Govern the models and tools used by AI applications and agents. | Publish, secure, operate, and manage APIs throughout their lifecycle. |
| Management model | Providers, registered models, model aliases, and MCP servers with tools. | APIs, operations, products, and subscriptions. |
| Governance approach | Configure AI-focused policies for access, consumption, estimated model spend, and tool protection. | Configure API policies for authentication, traffic control, transformation, and other requirements, including AI-specific controls. |
| Azure resource type | `Microsoft.ApiManagement/aigateways` | `Microsoft.ApiManagement/service` |
| Management experience | Dedicated AI Gateway portal, CLI, and management APIs. | Azure portal and API Management management tools and APIs. |

For API Management service, feature availability depends on the selected tier.

## Choose based on your workload

Choose **AI Gateway** when your goal is to give AI applications and agents governed access to models and tools. For example, a platform team can publish models from Microsoft Foundry and compatible providers, give applications stable model names, and apply shared consumption controls. The same gateway can publish tools through MCP endpoints for agents to use.

Choose **Azure API Management service** when your goal is comprehensive API management. For example, an API team can publish business APIs for internal applications and external partners, package APIs into products, and support developer onboarding. Its AI gateway capabilities also support AI endpoints within that API-centered management approach.

AI Gateway is the primary path for Microsoft's latest AI gateway capabilities. API Management service continues to support comprehensive API management and foundational AI capabilities. The products are complementary.

## Use both products together

You can keep business APIs in API Management service while using AI Gateway for model and tool traffic. For example, an organization can continue managing an order-processing API in API Management service while a new assistant calls approved models and MCP tools through AI Gateway.

Existing AI workloads in API Management service can remain in place and continue to be supported. Adopting AI Gateway for new workloads doesn't require migrating your API program or replacing existing AI gateway configurations.
