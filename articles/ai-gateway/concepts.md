---
title: AI Gateway concepts
titleSuffix: AI Gateway
description: Understand how AI Gateway resources, model connections, MCP servers, access, governance, and telemetry work together.
ms.service: azure
ms.topic: concept-article
ms.date: 10/23/2026
author: santiagxf
ms.author: fasantia
ms.reviewer: fasantia
---

# AI Gateway concepts

[!INCLUDE [ai-gateway-preview](./includes/preview.md)]

AI Gateway centralizes access to AI models and tools. Applications and agents use gateway endpoints while platform teams manage backend connections, access, policies, and observability.

This article explains the key concept it builds on.

## Gateway and runtime endpoints

A **gateway** is an Azure resource of type `Microsoft.ApiManagement/aigateways`. It holds the connections and controls used by your applications.

The management interface configures the gateway. **Runtime endpoints** receive application requests for model inference or MCP tool access. These are different access paths: permission to configure a gateway doesn't automatically grant permission to call its models or tools.

## Model providers, registered models, and aliases

Model connections separate the backend service from the name an application uses.

| Element | Purpose |
| --- | --- |
| Model provider | Stores the endpoint and authentication configuration for Microsoft Foundry or a compatible custom model service. |
| Registered model | Identifies an existing backend deployment or model and the endpoints it supports. Registration doesn't deploy a new model. |
| Model alias | Provides a stable callable name that applications use while the platform team manages the backend model mapping. |

For example, an application can use an alias for a chat model without storing the provider's credentials. Changing the backend still requires checking that the replacement supports the application's API and behavior.

## Federated MCP servers and tools

A **federated MCP server** combines tools from backend services behind one MCP endpoint. A backend can be a remote MCP server, an OpenAPI-described API, or a built-in connector.

A **tool** describes an operation and its expected inputs. An agent discovers the available tools and invokes selected operations through the gateway. Tool calls can change backend data, so tool availability and access controls affect what callers can do.

Backend authentication is separate from caller access. With a shared backend connection, authorized callers use the permissions of that connection.

## Access and identities

Three relationships determine who can configure the gateway and use its backends:

| Relationship | Purpose |
| --- | --- |
| Administrator to gateway | Azure management permissions allow an operator to configure the gateway and its resources. |
| Caller to gateway | Microsoft Entra runtime access or a gateway runtime API key authorizes applications and agents. Runtime API keys grant gateway-wide access. |
| Gateway to backend | A managed identity or backend credential authorizes the gateway at the upstream service. The identity needs access to that service. |

Configuring one relationship doesn't grant the other permissions. Keep gateway runtime credentials separate from provider credentials and deployment credentials.

## Governance, networking, and observability

**Policies** apply shared controls to model and tool traffic, such as consumption limits and tool protection. Estimated model-spend controls help govern usage; provider billing remains the source for actual charges.

**Networking** determines how the gateway reaches backend services. Network requirements belong in the gateway design, particularly when backends use private connectivity.

**Telemetry** provides visibility into usage and request behavior. Configure a telemetry destination before relying on collected data to assess gateway traffic.

The [in-product documentation](https://ai.gateway.azure.com/docs) contains the configuration guidance for models, MCP servers, access, policies, networking, and observability.

## Related content

- [What is AI Gateway?](./overview.md)
- [AI Gateway and Azure API Management service](./compare-api-management-service.md)
- [Start with the Azure CLI extension](./get-started-cli.md)
