---
title: Hosted MCP servers in Azure Connector Namespace
description: Overview of hosted MCP servers in Azure Connector Namespace. 
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 06/02/2026
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

This article explains what hosted MCP servers are, feature available, and what servers are available during preview.

> [!NOTE]
> During early preview, hosted MCP servers are available in the following regions: **West Central US**, **East Asia**, **Central US**, and **North Europe**.

## What are hosted MCP servers?

When you create a *hosted MCP server* in Connector Namespace, the platform runs a pre-built image of the server in dedicated compute that it provisions. Other than compute, the namespace provides networking, lifecycle management, and dependency management so you don't need to provision or maintain any infrastructure. A curated set of hosted servers is supported during public preview.

When you deploy a hosted MCP server, the namespace:

- Pulls the pre-built server image from the catalog.
- Provisions the runtime environment with your configuration.
- Exposes a secure MCP endpoint that agents and MCP clients can connect to.
- Handles scaling, health monitoring, and authentication.

## Types of MCP servers

The Connector Namespace catalog offers three types of MCP servers:

| Type | Description | Configuration |
|------|-------------|---------------|
| **Hosted server** | Runs an existing open-source or third-party MCP server implementation without modification. You provide any required configuration. | Environment variables, config files |
| **Managed connector** | Platform-built and maintained by the namespace service. Exposes a fixed set of tools with no configuration required. | None |
| **Configurable connector** | Platform-built and maintained, but lets you select which tools to expose or adjust tool behavior. | Select tools or set parameters |

## Supported servers

During public preview, a curated set of hosted MCP servers is available. The catalog expands over time. Supported servers today:

| Server | Description |
|--------|-------------|
| **Playwright** | Browser automation tools for web navigation, screenshots, and interaction |
| **Azure SQL** | Exposes SQL operations as MCP tools through [Data API builder](/azure/data-api-builder/mcp/overview), enabling AI agents to interact with SQL databases through a controlled, secure contract with entity abstraction, RBAC, and caching |

## Server authentication

Hosted MCP servers involve two authentication boundaries: *inbound* (client to server) and *outbound* (server to downstream service).

### Inbound authentication

Inbound authentication secures the connection *between MCP clients and the hosted server*. The namespace provides OAuth-based authentication with Microsoft Entra ID. 

Connections from GitHub Copilot in Visual Studio Code work out-of-the-box. Connections from other MCP clients require additional configuration.

### Outbound authentication

Outbound authentication secures the connection *between the hosted server and the downstream service* it interacts with. Servers generally use one of two mechanisms:

- **Managed identity** — The server authenticates to the downstream service using a managed identity assigned by the namespace. No credential management is required.
- **On-behalf-of (OBO)** — The server uses the calling user's identity to authenticate to the downstream service, enabling delegated access scenarios.

## Integration with Application Insights 

Deployed servers can be configured with an Azure Application Insights resource to collect logs and telemetry. Once configured, the namespace automatically forwards server telemetry to Application Insights, giving you visibility into request traces and errors. For setup instructions, see [Configure Application Insights](hosted-mcp-dev-guide.md#configure-application-insights).

## Considerations

Keep the following in mind when working with hosted MCP servers during preview:

- **Preview limitations.** The service isn't recommended for production workloads. Expect breaking changes between preview milestones.

- **Catalog availability.**  The set of supported servers expands over time based on demand and validation.

- **Region availability.** Limited regions are available during early preview: **West Central US, East Asia, Central US, North Europe**

- **Cold start.** Servers that haven't received traffic recently might experience a brief cold start delay on the first request.

- **Configuration responsibility.** Unlike managed MCP servers, you're responsible for correctly configuring hosted servers. Misconfigured environment variables or parameters can cause server failures.

## Get started 

- [Quickstart: Create a hosted MCP server](hosted-mcp-quickstart.md): Deploy a hosted server and connect it to MCP clients in minutes.

- [Developer guide for hosted MCP servers](hosted-mcp-dev-guide.md): Learn about configuration options, authentication setup, and observability.

## What's next 

The team is actively working to improve the experience of hosted MCP. Your feedback will help shape what comes next. [File an issue or feature request](https://aka.ms/hosted-mcp-github).

Some top items in the backlog:

- **Expanding the server catalog** — Adding more servers based on demand and community requests.
- **Region availability** — Expanding regional coverage beyond the current preview regions.
- **VNet support** — Deploying hosted MCP servers inside virtual networks with private endpoints.
- **Custom server images** — Support for bringing your own MCP server images to the catalog.
- **Tool-level access control** — Fine-grained permissions and throttling at the individual tool level.

## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
- [Create and manage connector namespaces](create-connector-namespace.md)
