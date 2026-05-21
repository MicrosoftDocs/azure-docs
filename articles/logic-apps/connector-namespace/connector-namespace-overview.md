---
title: Azure Connector Namespace Overview
description: Azure Connector Namespace is a managed service hosting reusable connectors and MCP Servers for SaaS, data, and AI integrations.
#customer intent: As a backend developer, I want to learn how Connector Namespaces work so that I can integrate SaaS systems without writing custom API client code.
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: ecfan
ms.date: 05/20/2026
ms.topic: concept-article
---

# What is Azure Connector Namespace? (preview)

> [!IMPORTANT]
> 
> This capability is in preview and is subject to the Supplemental Terms of Use for Microsoft Azure Previews. During preview, this capability is only available in Azure public regions.

Azure Connector Namespace is a fully managed service that hosts a catalog of *connectors-reusable, typed integrations to SaaS, data, and line-of-business systems. Each connector exposes actions, event triggers, and AI-agent tools through a shared connection model. The namespace handles:

-  Authentication 
-  Credential management 
-  End systems polling 
-  Webhook delivery
-  Model Context Protocol (MCP) server hosting

With that, your applications and AI agents can integrate with external services without writing custom API client code or tool wrappers.

You can consume connectors from Azure Functions, Azure Container Apps, Azure App Service, and other Azure compute services using language-specific software development kits (SDKs), or direct HTTP calls.

You can also use Copilot and other AI agents to interact with connected systems using MCP servers published on the namespace.

## What can you do with Connector Namespaces?

Connector Namespaces let you integrate your applications with hundreds of external services using a consistent programming model. Common scenarios include:

- **Document and content processing.** A function reads files from SharePoint, processes them, and writes results back through a connector bound to your namespace.

- **Event-driven services.** A Container Apps service receives "new lead" events from Salesforce through a connector trigger registered on the namespace.

- **Productivity automation.** A Node.js application reads and sends Outlook email through a connector, reusing a connection that another application already owns.

- **AI and agentic workloads.** A Python service calls connector actions to ground or enriches model output with data from line-of-business systems.

- **Reuse from existing application code.** Add managed integrations to an ASP.NET, Node.js, or Python service without introducing a workflow engine into the call path.

- **Publish connectors as managed MCP servers.** Turn any namespace connector into a Model Context Protocol (MCP) server in one step. The namespace handles hosting, tool definitions, and authentication so Copilot and other AI agents can call the connector’s actions as tools.

- **Deploy MCP servers from a curated catalog.** Pick off-the-shelf MCP servers and deploy them to your namespace. You keep control of server configuration, while the namespace takes care of deployment, scale, and credentials with no infrastructure to manage.

## Key concepts

### Namespace

A *Connector Namespace* is the Azure resource that hosts the connector runtime. The namespace is responsible for:

- Loading and executing connectors.

- Maintaining connection state and credentials.

- Polling source systems and dispatching webhook events.

- Applying retry, throttling, and diagnostic policies.

You create a namespace through the Azure portal, Azure Resource Manager (ARM) and Bicep templates, or the Azure CLI, and then bind connections and consume connectors from your applications.

### Connector

A *connector* is a prebuilt integration component for a specific service. For example, SharePoint, Salesforce, SAP, or Outlook. Each connector exposes a typed surface of:

- **Actions** - operations your application invokes, such as reading a row, sending a message, or uploading a file.

- **Triggers** - events your application subscribes to, such as a new email, a record update, or a file added to a folder.

Connectors abstract the underlying API, authentication protocol, paging, and retry behavior so your code stays focused on business logic.

### Connection

A *connection* represents an authenticated, configured binding to an external account or tenant. Connections are reusable: multiple applications and connectors can share the same connection. Supported connection types include OAuth, API key, and basic authentication, with managed identity support arriving in later waves.

### Trigger

A *trigger* is an event subscription that your application registers on a connector. When the source system raises an event - such as a new email, a record update, or a file added to a folder - the namespace delivers the payload to your application. Each connector defines its own triggers independently of any specific application; multiple applications can subscribe to the same trigger event using the same connection. The namespace manages polling schedules and webhook registration on your behalf, depending on what the underlying service supports.

### MCP Server

An *MCP server* is a first-class resource in your namespace that exposes tools to AI agents over the Model Context Protocol. The namespace supports two types of MCP servers, both hosted by the service:

- **Managed MCP servers.** Created and configured by the namespace, either from a curated list of managed servers or by publishing any connector as an MCP server. You only authenticate the underlying connection - the namespace handles server configuration, tool definitions, lifecycle, and runtime.

- **Hosted MCP servers.** Off-the-shelf MCP servers from a curated catalog that you add to your namespace and configure yourself. You keep control over server settings, environment, and parameters; the namespace handles hosting, scale, and credentials.

In both cases, AI agents - Copilot, custom agents, or any MCP-aware client - discover and call the tools using the namespace’s connection model. Servers can be enabled, disabled, or rotated independently of the underlying connection.

### Connectors SDKs

Connector Namespaces ship with strongly typed SDKs so you can call connectors using your language's normal idioms:

- **C#** - *Microsoft.Azure.Connectors.Sdk* on NuGet, with a Visual Studio Code language service for IntelliSense, completions, and CodeLens.

- **Node.js** - *@azure/connectors-sdk*, a TypeScript-first client with async/await action invocation.

- **Python** - *azure-connectors-sdk*, aligned with Azure SDK for Python conventions.

Each SDK exposes the same catalog, the same connection model, and consistent telemetry and retry semantics. You can also call connectors over HTTP when a typed SDK isn’t appropriate.

## How Connector Namespaces work

### Typical workflow with connectors

1.  You create a Connector Namespace in your Azure subscription.
1.  You create one or more connections to the services you want to integrate with - for example, an OAuth connection to Microsoft 365 or an API key connection to an external service.

1.  Your application - running on Azure Functions, Container Apps, App Service, or another compute host - references the namespace and the connection through a Connectors SDK.

1.  Your application invokes connector actions or subscribes to connector triggers.

1.  The namespace handles authentication, request signing, polling, webhook subscription, and retries. Your application receives typed responses and event payloads.

Action invocations are synchronous calls. Trigger delivery uses webhooks or pull-based subscriptions, depending on the connector and the source service.

### Typical workflow with MCP servers

1.  You create a Connector Namespace in your Azure subscription.
1.  You add an MCP server to the namespace - either a managed MCP server (from the curated list, or by publishing an existing connector) or a hosted MCP server from the catalog.

1.  You authenticate the underlying connection. , you also set any server-specific configuration.

1.  The namespace publishes the MCP endpoint and runs the server, handling authentication, scale, and credential rotation.

1.  AI agents - Copilot, custom agents, or any MCP-aware client - discover the server, read its tool catalog, and invoke tools using the configured connection.

## Where you can use Connector Namespaces

Connector Namespaces support the following Azure compute hosts:

- Azure Functions
- Azure Container Apps
- Azure App Service
- Self-hosted ASP.NET, Node.js, or Python services on Azure Virtual Machines or Azure Kubernetes Service

Connector Namespace don’t require Azure Logic Apps. Existing Logic Apps Standard and Consumption workflows continue to use the connector catalog as they do today; the namespace is an independent path for compute that doesn’t run on a workflow engine.

AI agents and Copilot extensions can also reach the namespace through its MCP server endpoints, without going through Azure compute at all.

## Security and governance

- The Connector Namespcate stores and rotates Connections credentials; application code never handles raw credentials.

- Network access can be restricted using virtual network integration and private endpoints to the namespace.

- Role-based access control (RBAC) on the namespace governs who can create connections, register triggers, and invoke actions.

- Diagnostic logs and correlation ids flow to Azure Monitor for end-to-end tracing across compute and namespace.

## Considerations

Connector Namespace is in preview. Conside the following when planning a deployment:

- **No SLA during preview.** The service isn’t recommended for production workloads.

- **Region availability.** Limited regions are available in early preview and expand over time.

- **Connector coverage.** Standard and high-volume connectors are enabled first. Premium and enterprise connectors - for example, SAP, IBM MQ, and Oracle Database - follow in later waves.

- **Identity.** Key-based and OAuth connections are supported in early preview. Managed identity support arrives in later waves; a select set of MCP servers will support managed identity earlier.

- **Versioning.** SDK and namespace runtime versions are paired during preview. Expect breaking changes between preview milestones.

- **Pricing.** The pricing model isn’t finalized. Metering shape might change before general availability.

## Next steps

- [Create your first Connector Namespace](create-connector-namespace.md).

- [Configure a connection to an external service](create-connector-namespace-connection.md).

- Call a connector action from Azure Functions using the Connectors SDK for C#, Node.js, or Python.

- Subscribe to a connector trigger from Azure Container Apps.

- Publish a connector as a managed MCP server and connect it to an AI agent.

- Add a hosted MCP server from the catalog and configure it for your scenario.

- Review the catalog of available connectors and MCP servers.
