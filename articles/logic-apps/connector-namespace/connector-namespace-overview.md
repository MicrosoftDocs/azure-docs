---
title: Azure Connector Namespace Overview
description: Learn about Azure Connector Namespace, a managed service that hosts reusable connectors and MCP servers. Without writing any custom API client code, integrate your solutions from Azure Functions, Container Apps, and other Azure compute services with Microsoft and non-Microsoft services, apps, data, and AI workloads.
services: azure-logic-apps
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: concept-article
ms.date: 06/02/2026
ai-usage: ai-assisted
ms.update-cycle: 365-days
#Customer intent: As a backend developer who works with Azure, I want to understand connector namespaces so I can integrate my Azure solutions with Microsoft and non-Microsoft services, systems, apps, and data. I want to learn how to use hosted, reusable connectors and MCP servers so I don't have to write or manage custom code for authentication, hosting, or API clients.
---

# What is Azure Connector Namespace? (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is only available in Azure public regions. 

When you build solutions that integrate with Software-as-a-Service (SaaS) apps, business systems, and data platforms, you typically have to write custom API client code for each connection or integration. You must also manage authentication flows, credential rotation, retry logic, pagination, and webhook subscriptions across multiple systems, which adds significant development overhead and operational risk. 

Azure Connector Namespace is a fully managed integration service that eliminates this complexity. The service hosts a catalog of prebuilt, reusable connectors that your solutions can use to connect to services, such as SharePoint, Salesforce, SAP, and Outlook, through a consistent programming model. Each connector exposes operations such as event triggers, actions that complete tasks, and AI agent tools through a shared connection model. Your solution can call triggers and actions by using language-specific software development kits (SDKs) for C#, Node.js, and Python, or through direct HTTP calls. A *connector namespace* manages the underlying integration infrastructure by handling the following tasks:

This overview describes what you can do with connector namespaces, key concepts, how connector namespaces work, security aspects, and considerations for deployment during preview.

> [!NOTE]
>
> Azure Connector Namespace is an integration pathway for compute services that don't run on a workflow engine. Connector namespaces don't require, use, or change anything in Azure Logic Apps. The connectors gallery in Azure Logic Apps works independently and separately for workflows in Azure Logic Apps.

## What you can do with connector namespaces

Integrate your apps with hundreds of external services by using a consistent programming model. The following table describes common scenarios include:

With a connector namespace, 

| Scenario | Description |
|----------|-------------|
| Document and content processing | A function reads files from SharePoint, processes them, and writes results back through a connector bound to your namespace. |
| Event-driven services | A Container Apps service receives "new lead" events from Salesforce through a connector trigger registered on the namespace. |
| Productivity automation | A Node.js application reads and sends Outlook email through a connector, reusing a connection that another application already owns. |
| AI and agentic workloads | A Python service calls connector actions to ground or enriches model output with data from line-of-business systems. |
| Reuse from existing application code | Add managed integrations to an ASP.NET, Node.js, or Python service without introducing a workflow engine into the call path. |
| Publish connectors as managed MCP servers | Turn any namespace connector into a Model Context Protocol (MCP) server in one step. The namespace handles hosting, tool definitions, and authentication so Copilot and other AI agents can call the connector's actions as tools. |
| Deploy MCP servers from a curated catalog | Pick off-the-shelf MCP servers and deploy them to your namespace. You keep control of server configuration, while the namespace takes care of deployment, scale, and credentials with no infrastructure to manage. |

A *connector namespace* manages the underlying integration infrastructure by handling the following tasks:

| Task | Description |
|------|-------------|
| Authentication and credential management | Stores and rotates credentials or secrets for OAuth, API key, and token-based connections. |
| Polling and webhook delivery | Creates and manages event subscriptions that push data to your application when source systems change. |
| Retry, throttling, and error handling | Set up built-in resilience policies without custom implementation. |
| MCP server hosting for AI agents | Publish connectors as Model Context Protocol (MCP) servers so that AI agents and Copilot can call external services as tools. |

## Key concepts

The following table describes core concepts for working with connector namespaces:

| Concept | Description |
|---------|-------------|
| Connector namespace | The Azure resource that hosts the connector runtime. The namespace is responsible for: <br><br>- Loading and executing connectors. <br>- Maintaining connection state and credentials. <br>- Polling source systems and dispatching webhook events. <br>- Applying retry, throttling, and diagnostic policies. <br>You create a namespace through the Azure portal, Azure Resource Manager (ARM) and Bicep templates, or the Azure CLI, and then bind connections and consume connectors from your applications. |
| Connector | A prebuilt integration component for a specific service. For example, SharePoint, Salesforce, SAP, or Outlook. Each connector exposes a typed surface of: <br><br>- **Actions** - operations your application invokes, such as reading a row, sending a message, or uploading a file. <br>- **Triggers** - events your application subscribes to, such as a new email, a record update, or a file added to a folder. <br>Connectors abstract the underlying API, authentication protocol, paging, and retry behavior so your code stays focused on business logic. |
| Connection | An authenticated, configured binding to an external account or tenant. Connections are reusable: multiple applications and connectors can share the same connection. Supported connection types include OAuth, API key, and basic authentication, with managed identity support arriving in later waves. |
| Trigger | An event subscription that your application registers on a connector. When the source system raises an event - such as a new email, a record update, or a file added to a folder - the namespace delivers the payload to your application. Each connector defines its own triggers independently of any specific application; multiple applications can subscribe to the same trigger event using the same connection. The namespace manages polling schedules and webhook registration on your behalf, depending on what the underlying service supports. |
| MCP server | A first-class resource in your namespace that exposes tools to AI agents over the Model Context Protocol. The namespace supports two types of MCP servers, both hosted by the service: <br><br>- **Managed MCP servers.** A list of managed servers and connectors created and configured by the namespace. Deploy a managed server or connector as an MCP server. You only authenticate the underlying connection - the namespace handles server configuration, tool definitions, lifecycle, and runtime. <br><br>- **Hosted MCP servers.** Off-the-shelf MCP servers from a curated catalog that you deploy to your namespace and configure yourself. You keep control over server settings, environment, and parameters; the namespace handles hosting, scale, and credentials. <br><br>In both cases, AI agents - Copilot, custom agents, or any MCP-aware client - discover and call the tools using the namespace’s connection model. Servers can be enabled, disabled, or rotated independently of the underlying connection. |
| Connector SDKs | Connector Namespaces ship with strongly typed SDKs so you can call connectors using your language's normal idioms: <br><br>- **C#** - [Azure.Connectors.Sdk](https://www.nuget.org/packages/Azure.Connectors.Sdk) on NuGet, with a Visual Studio Code language service for IntelliSense, completions, and CodeLens. <br><br>- **Node.js** - [@azure/connectors](https://www.npmjs.com/package/@azure/connectors) a TypeScript-first client with async/await action invocation. <br><br>- **Python** - [azure-connectors](https://pypi.org/project/azure-connectors) aligned with Azure SDK for Python conventions. <br><br>Each SDK exposes the same catalog, the same connection model, and consistent telemetry and retry semantics. You can also call connectors over HTTP when a typed SDK isn’t appropriate. |

## How to work with connector namespaces

The following sections describe the high-level process to start integrating connectors or MCP servers with your app.

### Typical steps to integrate connectors with your app

The following high-level steps describe a typical way you can start using connectors with your app:

1. In your Azure subscription, create a connector namespace resource.

1. Create one or more connections to the services you want to integrate.

   For example, suppose you create an OAuth connection to Microsoft 365 or an API key connection to an external service.

   1. Your app, which runs in Functions, Container Apps, App Service, or another compute service, references the namespace and the connection through a Connectors Namespace SDK. 

   1. Your app subscribes to connector triggers or calls connector actions.

      Action calls are synchronous. Trigger delivery uses webhooks or pull-based subscriptions, based on the connector and the source service.

   1. Your namespace handles authentication, request signing, polling, webhook subscription, and retries.

   1. Your app receives typed responses and event payloads.

### Typical steps to integrate MCP servers with your app

The following high-level steps describe a typical way you can start using MCP servers with your app:

1. In your Azure subscription, create a connector namespace resource.

1. From the catalog, add an MCP server to your connector namespace.

   You can add a managed MCP server or a hosted MCP server.

1. Authenticate the underlying connection. Set up any server-specific configuration requirements.

   1. Your namespace publishes the endpoint for the MCP server and runs the server, handles authentication, scaling, and credential rotation.

   1. AI agents, such as Copilot, custom agents, or any MCP-aware client, can find the MCP server, read its tool catalog, and invoke tools using the configured connection.

## Where you can use connector namespaces

This section describes ways that your app can use connector namespaces and connector operations for integration.

- Connector namespaces support the following Azure compute services where your app can use available connector operations:

  - Azure App Service
  - Azure Container Apps
  - Azure Functions

- Any self-hosted compute service can use connectors through a connector namespace.

  For example, self-hosted ASP.NET, Node.js, or Python services hosted on Azure Kubernetes or Azure Virtual Machines.

AI agents and Copilot extensions can also reach the namespace through its MCP server endpoints, without going through Azure compute at all.


- AI agents and MCP server-aware clients can discover and invoke tools through namespace-hosted MCP servers without going through a separate compute layer.

  Your applications and AI agents can integrate with external services without writing custom API client code or tool wrappers.

- You can use Copilot and other AI agents to interact with connected systems by using MCP servers deployed on the namespace.

   The namespaces provides and manages the underlying compute for running servers so you don't have to bring your own. 

## Security and governance

- Your connector namespace stores, manages, and rotates connection credentials. Your app never handles raw credentials.

- Restrict network access by using virtual network integration and private endpoints with your connector namespace.

- Control who can create connections, register triggers, and invoke actions by using role-based access control (RBAC) on your connector namespace.

- To support end-to-end tracing across your connector namespace and compute services, diagnostic logs and correlation IDs flow to Azure Monitor.

## Considerations and limitations

With Azure Connector Namespace currently in preview, review the following considerations when you plan a deployment during the preview period:

| Consideration | Description |
|---------------|-------------|
| No SLA during preview | The service isn't recommended for production workloads. |
| Region availability | Limited regions are available in early preview and expand over time. |
| Connector coverage | Standard and high-volume connectors are enabled first. Premium and enterprise connectors - for example, SAP, IBM MQ, and Oracle Database - follow in later waves. |
| Identity | Key-based and OAuth connections are supported in early preview. Managed identity support arrives in later waves; a select set of MCP servers will support managed identity earlier. |
| Versioning | SDK and namespace runtime versions are paired during preview. Expect breaking changes between preview milestones. |
| Pricing | The pricing model isn't finalized. Metering shape might change before general availability. |

## Releated content

- [Quickstart: Create a connector namespace](create-connector-namespace.md)
- [Create a connection to an external service](create-connector-namespace-connection.md)
- Call a connector action from Azure Functions using the Connectors SDK for C#, Node.js, or Python.
- Subscribe to a connector trigger from Azure Container Apps.
- Publish a connector as a managed MCP server and connect it to an AI agent.
- Add a hosted MCP server from the catalog and configure it for your scenario.
- Review the catalog of available connectors and MCP servers.
