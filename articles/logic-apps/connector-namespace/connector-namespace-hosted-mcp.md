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
> [!NOTE]
> If there's a server you'd like to see supported, file an issue at aka.ms/hosted-mcp-github.
>
> Support for publishing custom-built MCP servers to the catalog is planned for the future.

### Server deployment requirements

Generally speaking, hosted MCP servers don't require additional artifacts during deployment, except for the following servers.

#### Azure SQL

Requires a Data API builder (DAB) configuration file that defines the database connection, entities to expose, and permissions. To generate this file, follow the instructions in [Configure Data API builder](/azure/data-api-builder/quickstart/basic-sql?tabs=mssql%2Crest#configure-data-api-builder). 

The Azure SQL server supports both *connection string* and *managed identity* for outbound authentication. The connection specified in the configuration file must match the approach selected in the namespace portal during deployment. 

If you choose managed identity as the authentication method, you must use a **user-assigned** managed identity and assign it to the connector namespace. The connection string looks like the following:

```console
Server=tcp:your-sever-name.database.windows.net,1433;Initial Catalog=your-db-name;Authentication=Active Directory Managed Identity;User Id=<user assigned managed identity client ID>;
```

## Server authentication

Hosted MCP servers involve two authentication boundaries: *inbound* (client to server) and *outbound* (server to downstream service).

### Inbound authentication

Inbound authentication secures the connection *between MCP clients and the hosted server*. The namespace provides OAuth-based authentication with Microsoft Entra ID. 

Connections from GitHub Copilot in Visual Studio Code work out-of-the-box. Connections from other MCP clients require additional configuration.

### Outbound authentication

Outbound authentication secures the connection *between the hosted server and the downstream service* it interacts with. Servers generally use one of two mechanisms:

- **Managed identity** — The server authenticates to the downstream service using a managed identity assigned by the namespace. No credential management is required.
- **On-behalf-of (OBO)** — The server uses the calling user's identity to authenticate to the downstream service, enabling delegated access scenarios.

If you choose managed identity as the outbound authentication method, you can use either **system-assigned managed identity (SAMI)** or **user-assigned managed identity (UAMI)**. You can enable SAMI during namespace creation so the namespace if automatically assigned a managed identity. Alternatively, you can bring your own UAMI and **add** it to the namespace.

When deciding what to use, consider that SAMI is tied to the lifecyle of the namespace so it's gone with the namespace is deleted. On the other hand, UAMI is its own resource and can be reused even when the namespace is deprovisioned. 

>[!IMPORTANT]
>When using **user-assigned managed identity**, you MUST add that identity to the namespace. Otherwise the server won't be able to access downstream service using the managed identity.  

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
