---
title: Azure Connector Namespace Overview
titleSuffix: Azure Connector Namespace
description: Learn about Azure Connector Namespace, a managed service that hosts reusable connectors and MCP servers. Without writing any custom API client code, integrate your solutions from Azure Functions, Container Apps, and other Azure compute services with Microsoft and non-Microsoft services, apps, data, and AI workloads.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#Customer intent: As a backend developer who works with Azure, I want to understand connector namespaces so I can integrate my Azure solutions with Microsoft and non-Microsoft services, systems, apps, and data. I want to learn how to use hosted, reusable connectors and MCP servers so I don't have to write or manage custom code for authentication, hosting, or API clients.
---

# What is Azure Connector Namespace? (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is only available in Azure public regions.

When you build solutions that integrate with Software-as-a-Service (SaaS) apps, business systems, and data platforms, you typically have to write custom API client code for each connection or integration. You must also manage authentication flows, credential rotation, retry logic, pagination, and webhook subscriptions across multiple systems, which adds significant development overhead and operational risk. 

Azure Connector Namespace is a fully managed integration service that eliminates this complexity. The service hosts a catalog of prebuilt, reusable connectors that your solutions can use to connect to services, such as SharePoint, Salesforce, SAP, and Outlook, through a consistent programming model. Each connector exposes operations such as event triggers, actions that complete tasks, and AI agent tools through a shared connection model. Your solution can call triggers and actions by using language-specific software development kits (SDKs) for C#, Node.js, and Python, or through direct HTTP calls.

A *connector namespace* manages the underlying integration infrastructure by handling the following tasks:

| Task | Description |
|------|-------------|
| Authentication and credential management | Store and rotate credentials or secrets for OAuth, API key, and token-based connections. |
| Polling and webhook delivery | Create and manage event subscriptions that push data to your app when source systems change. |
| Retry, throttling, and error handling | Set up built-in resilience policies without custom implementation. |
| MCP server hosting for AI agents | Publish connectors as Model Context Protocol (MCP) servers so that AI agents and Copilot can call external services as tools. |

This overview describes what you can do with connector namespaces, key concepts, how connector namespaces work, security aspects, and considerations for deployment during preview.

> [!NOTE]
>
> Azure Connector Namespace is an integration pathway for compute services that don't run on a workflow engine. Connector namespaces don't require, use, or change anything in Azure Logic Apps. The connectors gallery in Azure Logic Apps works independently and separately for workflows in Azure Logic Apps.

## What you can do with connector namespaces

Integrate your apps with hundreds of external services by using a consistent programming model. The following table describes common scenarios where your app can use Azure Connector Namespace to integrate with other services without extra code:

| Scenario | Example integration |
|----------|---------------------|
| Process documents and content | An Azure function uses SharePoint connector operations to detect new or updated files on a SharePoint server, read and process the files, and write the results back to SharePoint. |
| Monitor events from external services | An Azure container app uses a Salesforce connector trigger to receive events about new leads from Salesforce. |
| Automate productivity | A Node.js app uses Outlook connector operations to read and send email by reusing a connection that another app already owns. |
| Create and run AI or agentic workloads | A Python service calls connector actions to ground or enrich model output with data from business systems. |
| Reuse existing app code | ASP.NET, Node.js, and Python services can use managed integrations without a workflow engine in the call path. |
| Publish connectors as managed MCP servers | Convert any connector from your namespace to a Model Context Protocol (MCP) server with one step. Your namespace handles hosting, tool definitions, and authentication so Copilot and other AI agents can call connector actions as tools. |
| Deploy MCP servers from a curated catalog | Select and deploy off-the-shelf MCP servers to your connector namespace. You control the server configuration, while the namespace handles deployment, scaling, and credentials - no infrastructure for you to manage. |

## Key concepts

The following table describes the core concepts to understand when you work with connector namespaces:

| Concept | Description |
|---------|-------------|
| Connector namespace | The Azure resource that hosts the connector runtime and handles the following tasks: <br><br>- Load and run connector operations. <br>- Maintain connection state and credentials. <br>- Poll source services and systems. Dispatch webhook events. <br>- Apply retry, throttling, and diagnostic policies. <br><br>You can create a connector namespace by using the Azure portal, Azure Resource Manager (ARM) and Bicep templates, or Azure CLI. You then bind connections and consume connectors from your apps. |
| Connector | A prebuilt component for integrating a specific service, like SharePoint, Salesforce, SAP, and Outlook. A connector abstracts the underlying service's API, authentication protocol, pagination, and retry behavior so your code stays focused on the business logic. <br><br>Each connector exposes a typed surface for the following operations: <br><br>- *Trigger*: An event subscription operation that your app registers on a connector. For example, when a new email arrives, when a record updates, or when a file is added to a folder. When the source service or system raises an event, your connector namespace sends the payload to your app. <br><br>--- Each connector defines its triggers independently from any specific app. <br><br>--- Multiple apps can subscribe to the same trigger event by using the same connection. <br><br>--- Your connector namespace manages polling schedules and webhook registration on your behalf, based on what the underlying service supports. <br><br>- *Action*: An operation that your app calls. For example, send a message, read a row, or upload a file. |
| Connection | An authenticated, configured binding to an external account or tenant. You can reuse connections, which means multiple apps and connectors can share the same connection. Supported connection authentication types: <br><br>- OAuth <br>- API key <br>- Basic <br>- Managed identity (not yet available) |
| MCP server | A first-class resource that exposes tools that AI agents can use through the Model Context Protocol (MCP). Connector namespaces support the following kinds of MCP servers, which are hosted by Azure Connector Namespace: <br><br>- *Managed*: Servers and connectors that your connector namespace creates and configures. You can deploy a managed server or connector as an MCP server. You only need to authenticate the underlying connection. Your connector namespace handles the server configuration, tool definitions, lifecycle, and runtime. <br><br>- *Hosted*: Off-the-shelf MCP servers from a curated catalog that you choose, configure, and deploy to your connector namespace. You keep control over the server settings, environment, and parameters. Your connector namespace handles hosting, scaling, and credentials. <br><br>In both cases, AI agents such as Copilot, custom agents, or any MCP-aware clients, can detect and call tools by using the namespace's connection model. You can enable, disable, or rotate MCP servers independently from the underlying connection. |
| Connector SDKs | Strongly typed SDKs that ship with connector namespaces so you can call connectors using your language's standard idioms: <br><br>- C#: [Azure.Connectors.Sdk](https://www.nuget.org/packages/Azure.Connectors.Sdk) on NuGet, with the Visual Studio Code language service for IntelliSense, completions, and CodeLens. <br><br>- Node.js: [@azure/connectors](https://www.npmjs.com/package/@azure/connectors), which is a TypeScript-first client with async-await action invocation. <br><br>- Python: [azure-connectors](https://pypi.org/project/azure-connectors), which is aligned with Azure SDK for Python conventions. <br><br>Each SDK exposes the same catalog, connection model, consistent telemetry, and retry semantics. <br><br>**Note**: If a typed SDK isn't appropriate, you can call connectors over HTTP. |

## How to work with connector namespaces

The following sections describe the high-level process to start integrating connectors or MCP servers with your app.

### Typical steps to integrate connectors with your app

The following high-level steps describe a typical way you can start using connectors with your app:

1. In your Azure subscription, create a connector namespace resource.

1. Create one or more connections to the services you want to integrate.

   For example, suppose you create an OAuth connection to Microsoft 365 or an API key connection to an external service. The following steps describe what happens between your app and your connector namespace.

   1. Your app, which runs in Functions, Container Apps, App Service, or another compute service, references the namespace and the connection through a Connector SDK.

   1. Your app subscribes to connector triggers or calls connector actions.

      Calls to connector actions run synchronously. Trigger delivery uses webhooks or pull-based subscriptions, based on the connector and the source service.

   1. Your namespace handles authentication, request signing, polling, webhook subscription, and retries.

   1. Your app receives typed responses and event payloads.

### Typical steps to integrate MCP servers with your app

The following high-level steps describe a typical way you can start using MCP servers with your app:

1. In your Azure subscription, create a connector namespace resource.

1. From the catalog, add an MCP server to your connector namespace.

   You can add a managed MCP server or a hosted MCP server.

1. Authenticate the underlying connection. Set up any server-specific configuration requirements.

   - Your connector amespace publishes the endpoint for the MCP server and runs the server, handles authentication, scaling, and credential rotation.
   - AI agents, such as Copilot, custom agents, or any MCP-aware client, can find the MCP server, read its tool catalog, and invoke tools using the configured connection.

## Where you can use connector namespaces

This section describes ways that your app can use connector namespaces and connector operations for integration.

- Connector namespaces support the following Azure compute services where your app can use available connector operations:

  - Azure App Service
  - Azure Container Apps
  - Azure Functions

- Any self-hosted compute service can use connectors through a connector namespace.

  For example, these self-hosted services include ASP.NET, Node.js, or Python on Azure Kubernetes or Azure Virtual Machines.

- AI agents, Copilot extensions, and MCP server-aware clients can find and invoke tools for MCP servers hosted in your connector namespace - all without going through a separate compute layer.

  Your apps can use these AI and agentic tools that interact with connected systems and external services by using the endpoints for MCP servers deployed in your connector namespace. You don't need any custom API client code or tool wrappers required. Your connector namespace provides and manages the underlying compute for running servers so you don't have to bring your own infrastructure.

## Security and governance

- Leave credential management to your connector namespace, which stores, manages, and rotates connection credentials for you. Your app never handles raw credentials.

- Restrict network access by using virtual network integration and private endpoints with your connector namespace.

- Control who can create connections, register triggers, and invoke actions by using role-based access control (RBAC) on your connector namespace.

- To support end-to-end tracing across your connector namespace and compute services, diagnostic logs and correlation IDs flow to Azure Monitor.

## Considerations and limitations

While Azure Connector Namespace is in preview, make sure you review the following considerations if you're planning a deployment during preview:

| Consideration | Description |
|---------------|-------------|
| No Service Level Agreement (SLA) for preview | Azure Connector Namespace (preview) isn't currently recommended for production workloads. |
| Region availability | Support for regions is currently limited, but expands over time. |
| Connector coverage | High-usage and standard connectors are available first, while enterprise connectors, such as SAP, IBM MQ, and Oracle Database, follow in later waves. |
| Identity | API key and OAuth connections are currently supported. Managed identity support arrives later, but is planned earlier for select MCP servers. |
| Versioning | SDK and namespace runtime versions are paired during preview. Expect breaking changes between preview milestones. |
| Pricing | The pricing model isn't yet finalized. Metering shape might change before general availability. |

## Related content

- [Quickstart: Create a connector namespace](create-connector-namespace.md)
- [Create a connection to an external service](create-connector-namespace-connection.md)

<!---
What are these links? Seems like they belong to how-to docs:
- Call a connector action from Azure Functions by using the Connectors SDK for C#, Node.js, or Python
- Subscribe to a connector trigger from Azure Container Apps
- Publish a connector as a managed MCP server and connect to an AI agent
- Add a hosted MCP server from the catalog and configure for your scenario
- Review the catalog for available connectors and MCP servers
--->
