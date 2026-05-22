---
title: Hosted MCP servers in Azure Connector Namespace
description: Overview of hosted MCP servers in Azure Connector Namespace. 
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 05/21/2026
ms.topic: conceptual
ms.service: azure-logic-apps
ms.custom: ai-assisted
# Customer intent: As a developer, I want to understand hosted MCP servers in Connector Namespace so I can choose the right approach for exposing tools to AI agents.
---

# Hosted MCP servers in Azure Connector Namespace (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains what hosted MCP servers are, how they compare to managed servers, and what servers are available during preview.

## What are hosted MCP servers?

When you create a *hosted MCP server* in Connector Namespace, the platform runs a pre-built image of the server in dedicated compute that it provisions. Other than compute, the namespace provides networking, lifecycle management, and dependency management so you don't need to provision or maintain any infrastructure. A curated set of hosted servers is supported during public preview.

When you deploy a hosted MCP server, the namespace:

- Pulls the pre-built server image from the catalog.
- Provisions the runtime environment with your configuration.
- Exposes a secure MCP endpoint that agents and MCP clients can connect to.
- Handles scaling, health monitoring, and authentication.

## Hosted vs. managed MCP servers

Azure Connector Namespace supports two types of MCP servers. Both are fully hosted by the service, but they differ in origin and configuration model:

| Aspect | Hosted MCP servers | Managed MCP servers |
|--------|-------------------|---------------------|
| **Server code** | Runs the original server implementation without modification | Created and maintained by the namespace platform |
| **Configuration** | You configure environment variables, parameters, and server settings | The namespace handles tool definitions and configuration automatically |
| **Tool definitions** | Defined by the server implementation itself | Derived from the connector's action and trigger surface |
| **Use case** | When you need a specific server's capabilities (for example, Playwright) | When you want to expose a connector's actions as MCP tools with zero configuration |

## Supported servers

During public preview, a curated set of hosted MCP servers is available. The catalog expands over time. Supported servers today:

| Server | Description |
|--------|-------------|
| **Playwright** | Browser automation tools for web navigation, screenshots, and interaction |
| **Azure SQL** | Exposes SQL operations as MCP tools through [Data API builder](/azure/data-api-builder/mcp/overview), enabling AI agents to interact with SQL databases through a controlled, secure contract with entity abstraction, RBAC, and caching |
| **Azure Cosmos DB Toolkit** | Enables AI agents to interact with Azure Cosmos DB through enterprise-grade authentication, comprehensive database operations including CRUD, vector search, and schema discovery |
> [!NOTE]
> If there's a server you'd like to see supported, file an issue at aka.ms/hosted-mcp-github.
>
> Support for publishing custom-built MCP servers to the catalog is planned for the future.

## Server authentication

Hosted MCP servers involve two authentication boundaries: *inbound* (client to server) and *outbound* (server to downstream service).

### Inbound authentication

Inbound authentication secures the connection between MCP clients and the hosted server. The namespace provides OAuth-based authentication with Microsoft Entra ID. 

Connections from GitHub Copilot in Visual Studio Code work out-of-the-box. Connections from other MCP clients require additional configuration.

### Outbound authentication

Outbound authentication secures the connection between the hosted server and the downstream service it interacts with. Servers generally use one of two mechanisms:

- **Managed identity** — The server authenticates to the downstream service using a managed identity assigned by the namespace. No credential management is required.
- **On-behalf-of (OBO)** — The server uses the calling user's identity to authenticate to the downstream service, enabling delegated access scenarios.

## Considerations

Keep the following in mind when working with hosted MCP servers during preview:

- **Preview limitations.** The service isn't recommended for production workloads. Expect breaking changes between preview milestones.

- **Catalog availability.**  The set of supported servers expands over time based on demand and validation.

- **Region availability.** Limited regions are available during early preview: **West Central US, East Asia, Central US, North Europe**

- **Cold start.** Servers that haven't received traffic recently might experience a brief cold start delay on the first request.

- **Configuration responsibility.** Unlike managed MCP servers, you're responsible for correctly configuring hosted servers. Misconfigured environment variables or parameters can cause server failures.

## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
- [Create a hosted MCP server](hosted-mcp-quickstart.md)
- [Create and manage connector namespaces](create-connector-namespace.md)
