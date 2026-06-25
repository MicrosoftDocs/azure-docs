---
title: Hosted MCP Servers in Azure Connector Namespace
description: Get an overview of hosted MCP servers in Azure Connector Namespace. 
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 06/02/2026
ms.topic: concept-article
ms.service: azure-logic-apps
ms.custom: ai-assisted
# Customer intent: As a developer, I want to understand hosted MCP servers in Connector Namespace so that I can choose the right approach for exposing tools to AI agents.
---

# Hosted MCP servers in Azure Connector Namespace (preview)

> [!IMPORTANT]
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains what hosted Model Context Protocol (MCP) servers are in Azure Connector Namespace, along with the features and servers that are available during the preview.

## What are hosted MCP servers?

When you create a *hosted MCP server* in Connector Namespace, the platform runs a prebuilt image of the server in dedicated compute that it provisions. Other than compute, the namespace provides networking, lifecycle management, and dependency management so that you don't need to provision or maintain any infrastructure. A curated set of hosted servers is supported during the preview.

A hosted MCP server is a first-class resource within a connector namespace. The namespace is the parent resource that hosts and manages it, and the server inherits the namespace's identity, networking, and access policy capabilities. You create, configure, and manage each hosted MCP server directly inside its connector namespace.

When you deploy a hosted MCP server, the namespace:

- Pulls the prebuilt server image from the catalog.
- Provisions the runtime environment with your configuration.
- Exposes a secure MCP endpoint that agents and MCP clients can connect to.
- Handles scaling, health monitoring, and authentication.

## Types of MCP servers

The Connector Namespace catalog offers three types of MCP servers:

| Type | Description | Configuration |
| ---- | ----------- | ------------- |
| **Hosted server** | Runs an existing open-source or non-Microsoft MCP server implementation without modification. You provide any required configuration. | Environment variables, configuration files |
| **Managed connector** | Platform-built and maintained by the namespace service. Exposes a fixed set of tools with no configuration required. | None |
| **Configurable connector** | Platform-built and maintained, but you select which tools to expose or adjust tool behavior. | Select tools or set parameters |

## Supported servers

During the preview, the following curated set of hosted MCP servers is available. The catalog expands over time.

| Server | Description |
| ------ | ----------- |
| **Playwright** | Provides browser automation tools for web navigation, screenshots, and interaction |
| **Azure SQL** | Exposes SQL operations as MCP tools through [Data API builder](/azure/data-api-builder/mcp/overview) so that AI agents can interact with SQL databases through a controlled, secure contract with entity abstraction, role-based access control, and caching |

## Server authentication

Hosted MCP servers involve two authentication boundaries: *inbound* (client to server) and *outbound* (server to downstream service).

### Inbound authentication

Inbound authentication helps secure the connection *between MCP clients and the hosted server*. The namespace provides OAuth-based authentication with Microsoft Entra ID.

Connections from GitHub Copilot in Visual Studio Code work out of the box. Connections from other MCP clients require additional configuration.

### Outbound authentication

Outbound authentication helps secure the connection *between the hosted server and the downstream service* that it interacts with. Servers generally use one of two mechanisms:

- **Managed identity**. The server authenticates to the downstream service by using a managed identity that the namespace assigns. No credential management is required.
- **On-behalf-of (OBO)**. The server uses the calling user's identity to authenticate to the downstream service, which enables delegated access scenarios.

## Integration with Application Insights

You can configure deployed servers with an Azure Application Insights resource to collect logs and telemetry. After server configuration, the namespace automatically forwards server telemetry to Application Insights to give you visibility into request traces and errors. For setup instructions, see [Configure Application Insights](hosted-mcp-dev-guide.md#integration-with-application-insights).

## Considerations

Keep the following points in mind when you're working with hosted MCP servers during the preview:

- **Preview limitations**. The service isn't recommended for production workloads. Expect breaking changes between preview milestones.
- **Catalog availability**. The set of supported servers expands over time based on demand and validation.
- **Region availability**. Limited regions are available during early preview: West Central US, East Asia, Central US, North Europe.
- **Cold start**. Servers that haven't received traffic recently might experience a brief cold start delay on the first request.
- **Configuration responsibility**. Unlike managed MCP servers, you're responsible for correctly configuring hosted servers. Misconfigured environment variables or parameters can cause server failures.

## Resources for getting started

- [Quickstart: Create a hosted MCP server](hosted-mcp-quickstart.md). Deploy a hosted server and connect it to MCP clients in minutes.
- [Developer guide for hosted MCP servers](hosted-mcp-dev-guide.md). Learn about configuration options, authentication setup, and observability.

## What's next

The team is actively working to improve the experience of hosted MCP. Your feedback will help shape what comes next. [File an issue or feature request](https://aka.ms/hosted-mcp-github).

Top items in the backlog include:

- **Expanding the server catalog**. Adding more servers based on demand and community requests.
- **Region availability**. Expanding regional coverage beyond the current preview regions.
- **Virtual network (VNet) support**. Deploying hosted MCP servers inside VNets with private endpoints.
- **Custom server images**. Support for bringing your own MCP server images to the catalog.
- **Tool-level access control**. Fine-grained permissions and throttling at the individual tool level.

## Related content

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
- [Create and manage connector namespaces](create-connector-namespace.md)
