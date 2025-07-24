---
title: Overview of MCP servers in Azure API Management
description: Learn how Azure API Management enables secure, scalable access to remote MCP servers for AI agents, including architecture and management features.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 07/23/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# About MCP servers in Azure API Management

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

This article introduces features in Azure API Management that you can use to manage Model Context Protocol (MCP) servers. MCP servers allow AI agents to access external data sources, such as databases or APIs, through a standardized protocol. 

Use API Management to securely expose and govern API operations as tools for large language models (LLMs) and AI agents like GitHub Copilot, ChatGPT, Claude, and more. API Management provides centralized control over MCP server authentication, authorization, and monitoring. It simplifies the management of MCP servers while helping to mitigate common security risks and ensuring scalability.


## MCP concepts and architecture

AI agents are becoming widely adopted because of enhanced LLM capabilities. However, even the most advanced models face limitations because of their isolation from external data. Each new data source potentially requires custom implementations to extract, prepare, and make data accessible for the models.

The [model context protocol](https://www.anthropic.com/news/model-context-protocol) (MCP) helps solve this problem. MCP is an open standard for connecting AI models and agents with external data sources such as local data sources (databases or computer files) or remote services (systems available over the internet, such as remote databases or APIs).

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

* **Local MCP servers** MCP clients use standard input/output as a local transport method to connect to MCP servers on the same machine,.

## MCP server endpoints


MCP provides the following transport types and typical endpoints for remote servers:

| Transport Type  | Endpoints | Notes |
|----------------|----------|-------|
| Streamable HTTP |  `/mcp`  | Replaces HTTP + SSE transport |
| SSE (server-sent events) |  `/sse` - Used to establish SSE connection<br/><br/>`/messages` - Used for bidirectional messaging between MCP client and server | Deprecated as of protocol version `2024-11-05` |

## Expose MCP servers in API Management

Azure API Management supports the remote MCP server mode, using native features of API Management and [capabilities of the AI gateway](./genai-gateway-capabilities.md) to manage MCP server endpoints.

> [!NOTE]
> MCP server support in API Management is in preview. In preview, API Management supports MCP server tools, but doesn't currently support MCP resources or prompts.

API Management provides two built-in ways to expose MCP servers:

| Source                                   | Description                                                                                   |
|-------------------------------------------|-----------------------------------------------------------------------------------------------|
| REST API as MCP server                    | Expose any REST API managed in API Management as an MCP server, including REST APIs imported from Azure resources. API operations become MCP tools. [Learn more](export-rest-mcp-server.md) |
| Existing MCP server                       | Expose an MCP-compatible server (for example, LangChain, LangServe, Azure logic app, Azure function app) via API Management. [Learn more](expose-existing-mcp-server.md) |


## Govern MCP servers

Configure one or more API Management [policies](api-management-howto-policies.md) to help manage the MCP server. The policies are applied to all API operations exposed as tools in the MCP server and can be used to control access, authentication, and other aspects of the tools.

Configure policies such as the following::

* **Rate limiting and quota enforcement** - Limit the number of requests per time period to the MCP server's tools, and set usage quotas for clients or subscriptions.
* **Authentication and authorization** - Require and validate incoming requests using JSON web tokens (JWT) or Microsoft Entra ID tokens for secure access.
* **IP filtering** - Restrict access to the MCP server's tools based on client IP addresses.
* **Caching** - Cache responses from the MCP server's tools to improve performance and reduce backend load.


## Secure access to the MCP server

You can secure either or both inbound access to the MCP server (from an MCP client to API Management) and outbound access (from API Management to the MCP server backend).

### Secure inbound access

One option to secure inbound access is to configure a policy to validate a JSON web token (JWT) generated using an identity provider in the incoming requests. This ensures that only authorized clients can access the MCP server. Use the generic [validate-jwt](validate-jwt-policy.md) policy, or the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy when using Microsoft Entra ID, to validate the JWT token in the incoming requests. 

The following is a basic example of validating a Microsoft Entra ID token presented in an `Authorization` header in the incoming request:

```xml
<validate-azure-ad-token header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">     
    <client-application-ids>
        <application-id>your-client-id</application-id>
    </client-application-ids> 
</validate-azure-ad-token>
```

For more inbound authorization options and samples, including using OAuth authorization, see:

* [MCP server authorization with Protected Resource Metadata (PRM) sample](https://github.com/blackchoey/remote-mcp-apim-oauth-prm)

* [Secure Remote MCP Servers using Azure API Management (Experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)

> [!CAUTION]
> When you use an MCP server in API Management, incoming headers like **Authorization** aren't automatically passed to your backend API. If your backend needs a token, you can add it as an input parameter in your API definition. Alternatively, use policies like `get-authorization-context` and `set-header` to generate and attach the token, as noted in the following section.


### Secure outbound access

You can use API Management's [credential manager](credentials-overview.md) to securely inject secrets or tokens for calls to a backend API. At a high level, the process is as follows:

1. Register an application in a supported identity provider.
1. Create a credential provider resource in API Management to manage the credentials from the identity provider.
1. Configure a connection to the provider in API Management.
1. Configure `get-authorization-context` and `set-header` policies to fetch the token credentials and present them in an **Authorization** header of the API requests.

For a step-by-step guide to call an example backend API using credentials generated in credential manager, see [Configure credential manager - GitHub](credentials-how-to-github.md).
 

## Monitoring

To monitor MCP servers in Azure API Management, you can use API Management's built-in [integration with Azure Monitor](monitor-api-management.md) for gateway activity. This allows you to:

* Track diagnostic logs, request/response traces, and usage metrics for MCP server endpoints.
* Analyze traffic patterns, performance, and errors using Azure Monitor workbooks, metrics, and logs.
* Send logs to Azure Log Analytics for advanced querying and analysis.
* Use [Azure Application Insights](api-management-howto-app-insights.md) for detailed telemetry and performance monitoring of MCP servers.
* Set up alerts for specific events or thresholds.
* View monitoring data in the Azure portal under your API Management instance’s **Monitoring** or **Logs** panes.

For more information, see [Monitor API Management](monitor-api-management.md).


## Discover MCP servers

Use [Azure API Center](../api-center/register-discover-mcp-server.md) to register and discover MCP servers in your organization. Azure API Center provides a centralized location for managing MCP servers, including those exposed in API Management and those hosted outside of API Management.



## Availability

<!-- availability in workspaces?-->


MCP servers in API Management are available in the following service tiers:

* **Classic tiers**: Basic, Standard, Premium
* **v2 tiers**: Basic v2, Standard v2, Premium v2

> [!NOTE]
> In the classic tiers, you must join the [AI Gateway Early update group](configure-service-update-settings.md) to access MCP server features, and access the portal at a feature-specific URL.

## Related content



* [Use the Azure API Management extension for VS Code to import and manage APIs](visual-studio-code-tutorial.md)

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

* [Expose REST API in API Management as an MCP server](export-rest-mcp-server.md)

* [Expose and govern existing MCP server](expose-existing-mcp-server.md)