---
title: Overview of MCP servers in Azure API Management
description: Learn how Azure API Management enables secure, scalable access to remote MCP servers for AI agents, including architecture and management features.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 11/13/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.custom: ignite-2025
---

# About MCP servers in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

This article introduces features in Azure API Management that you can use to manage Model Context Protocol (MCP) servers. MCP servers allow large language models (LLMs) and AI agents to access external data sources, such as databases or APIs, through a standardized protocol. 

With the proliferation of AI agents and LLMs, managing MCP servers is becoming increasingly important:

* Agents need secure, governed access to tools and resources.
* Developers want to reuse existing APIs as agent tools.
* Enterprises need observability, control, and scaling.

Use API Management to securely expose and govern MCP servers and their backends for LLMs and AI agents like GitHub Copilot, ChatGPT, Claude, and more. API Management provides centralized control over MCP server authentication, authorization, and monitoring. It simplifies the management of MCP servers while helping to mitigate common security risks and ensuring observability, control, and scalability.

## MCP concepts and architecture

AI agents are becoming widely adopted because of enhanced LLM capabilities. However, even the most advanced models face limitations because of their isolation from external data. Each new data source potentially requires custom implementations to extract, prepare, and make data accessible for the models.

The [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) helps solve this problem. MCP is an open standard for connecting AI models and agents with external data sources such as local data sources (databases or computer files) or remote services (systems available over the internet, such as remote databases or APIs).

MCP follows a client-server architecture where a host application can connect to multiple servers. Whenever your MCP host or client needs a tool, it connects to the MCP server. The MCP server then connects to, for example, a database or an API. MCP hosts and servers connect with each other through the MCP protocol.

The following diagram illustrates the MCP architecture:

:::image type="content" source="media/mcp-server-overview/mcp-architecture.png" alt-text="Diagram of model context protocol (MCP) architecture.":::

The architecture consists of the following components:

| Component      | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| **MCP hosts**  | LLM applications such as chat apps or AI assistants in your IDEs (like GitHub Copilot in Visual Studio Code) that need to access external capabilities |
| **MCP clients**| Protocol clients, inside the host application, that maintain 1:1 connections with servers        |
| **MCP servers**| Lightweight programs that each expose specific capabilities and provide context, tools, and prompts to clients |
| **MCP protocol**| Transport layer in the middle        |

The MCP architecture is built on [JSON-RPC 2.0 for messaging](https://modelcontextprotocol.io/docs/concepts/architecture). Communication between clients and servers occurs over defined transport layers, and supports primarily two modes of operation:

* **Remote MCP servers** - Run as independent processes accessible over the internet using HTTP-based transports (like Streamable HTTP), enabling MCP clients to connect to external services and APIs hosted anywhere.

* **Local MCP servers** MCP clients use standard input/output as a local transport method to connect to MCP servers on the same machine.

## MCP server endpoints


MCP provides the following transport types and typical endpoints for remote servers:

| Transport Type  | Endpoints | Notes |
|----------------|----------|-------|
| Streamable HTTP |  `/mcp`  | Replaces HTTP + SSE transport |
| SSE (server-sent events) |  `/sse` - Used to establish SSE connection<br/><br/>`/messages` - Used for bidirectional messaging between MCP client and server | Deprecated as of protocol version `2024-11-05` |

## Expose MCP servers in API Management

Azure API Management supports the remote MCP server mode. Use native features of API Management and [capabilities of the AI gateway](./genai-gateway-capabilities.md) to manage MCP server endpoints.

API Management provides two built-in ways to expose MCP servers:

| Source                                   | Description                                                                                   |
|-------------------------------------------|-----------------------------------------------------------------------------------------------|
| **REST API as MCP server**                    | Expose any REST API managed in API Management as an MCP server, including REST APIs imported from Azure resources. API operations become MCP tools. [Learn more](export-rest-mcp-server.md) |
| **Existing MCP server**                       | Expose an MCP-compatible server (for example, LangChain, LangServe, Azure logic app, Azure function app) via API Management. [Learn more](expose-existing-mcp-server.md) |

See the linked articles for step-by-step instructions and limitations.


## Govern MCP servers

Configure one or more API Management [policies](api-management-howto-policies.md) to help manage the MCP server. Currently, policies apply to all API operations exposed as tools in the MCP server. Use policies to control access, authentication, and other aspects of the tools.

Configure policies such as the following:

* **Rate limiting and quota enforcement** - Limit the number of requests per time period to the MCP server's tools, and set usage quotas for clients or subscriptions.
* **Authentication and authorization** - Require and validate incoming requests by using JSON web tokens (JWT) issued by Microsoft Entra ID or other identity providers for secure access.
* **IP filtering** - Restrict access to the MCP server's tools based on client IP addresses.
* **Caching** - Cache responses from the MCP server's tools to improve performance and reduce backend load.


## Secure access to the MCP server

You can secure either or both inbound access to the MCP server (from an MCP client to API Management) and outbound access (from API Management to the MCP server backend). Apply one or more security measures, such as key-based or OAuth authentication, depending on your backends and your organization's security posture. 

For more information and examples, see [Secure access to MCP servers](secure-mcp-servers.md). 

## Monitoring

To monitor MCP servers in Azure API Management, use API Management's built-in [integration with Azure Monitor](monitor-api-management.md) for gateway activity.

* Configure [Azure Application Insights](api-management-howto-app-insights.md) or Azure Monitor to capture MCP server requests, responses, and detailed diagnostics.
* Include correlation IDs in request headers to track requests across multiple systems and components.  
* Configure [trace](trace-policy.md) policies for your MCP servers to add a custom trace into the request tracing output in the test console, Application Insights telemetries,  or resource logs.

For more information, see [Monitor API Management](monitor-api-management.md).

## Discover MCP servers

Use [Azure API Center](../api-center/register-discover-mcp-server.md) to register and discover MCP servers in your organization. 

* Azure API Center provides a centralized location for managing MCP servers, including servers exposed in API Management and servers hosted outside of API Management. 

* Deploy the [API Center portal](../api-center/set-up-api-center-portal.md) to enable your users to discover and interact with MCP servers through a private, enterprise-ready MCP server registry.

## Availability

MCP server management features are available in the following API Management service tiers:

* **Classic tiers**: Developer, Basic, Standard, Premium
* **v2 tiers**: Basic v2, Standard v2, Premium v2

You can also use the API Management [self-hosted gateway](self-hosted-gateway-overview.md) to manage MCP servers in your own infrastructure.

> [!NOTE]
> * API Management currently supports MCP server tools, but doesn't support MCP resources or prompts.
> * API Management MCP server capabilities currently aren't supported in [workspaces](workspaces-overview.md).

You can get early access to new MCP server and AI gateway features and capabilities through the *AI Gateway* release channel. This access lets you try out the latest AI gateway innovations before they're generally available and provide feedback to help shape the product. For more information, see [Configure service update settings for your API Management instances](configure-service-update-settings.md).

## Related content

* [Use the Azure API Management extension for VS Code to import and manage APIs](visual-studio-code-tutorial.md)

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

* [Expose REST API in API Management as an MCP server](export-rest-mcp-server.md)

* [Expose and govern existing MCP server](expose-existing-mcp-server.md)

* [Secure access to MCP servers](secure-mcp-servers.md)

* Visit [https://mcp.azure.com](https://mcp.azure.com) for a live example of an MCP server registry created using Azure API Center.