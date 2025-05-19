---
title: Inventory and Discover MCP Servers in Your API Center
description: Learn about how Azure API Center can be a centralized registry for MCP servers in your organization. Developers and other stakeholders can use the API Center portal to discover MCP servers.
author: dlepow
ms.service: azure-api-center
ms.custom: 
ms.topic: concept-article
ms.date: 04/28/2025
ms.author: danlep 
# Customer intent: As an API program manager, I want to register and discover  MCP servers as APIs in my API Center inventory.
---

# Register and discover remote MCP servers in your API inventory

This article describes how to use Azure API Center to maintain an inventory (or *registry*) of remote model context protocol (MCP) servers and help stakeholders discover them using the API Center portal. MCP servers expose backend APIs or data sources in a standard way to AI agents and models that consume them.

## About MCP servers

AI agents are becoming widely adopted because of enhanced large language model (LLM) capabilities. However, even the most advanced models face limitations because of their isolation from external data. Each new data source potentially requires custom implementations to extract, prepare, and make data accessible for the models.

The [model context protocol](https://www.anthropic.com/news/model-context-protocol) (MCP) helps solve this problem. MCP is an open standard for connecting AI models and agents with external data sources such as local data sources (databases or computer files) or remote services (systems available over the internet, such as remote databases or APIs).

### MCP architecture

The following diagram illustrates the MCP architecture:
 
:::image type="content" source="media/register-discover-mcp-server/mcp-architecture.png" alt-text="Diagram of model context protocol (MCP) architecture.":::

The architecture consists of the following components:

| Component      | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| **MCP hosts**  | LLM applications such as chat apps or AI assistants in your IDEs (like GitHub Copilot in Visual Studio Code) that need to access external capabilities |
| **MCP clients**| Protocol clients, inside the host application, that maintain 1:1 connections with servers        |
| **MCP servers**| Lightweight programs that each expose specific capabilities and provide context, tools, and prompts to clients |
| **MCP protocol**| Transport layer in the middle        |

MCP follows a client-server architecture where a host application can connect to multiple servers. Whenever your MCP host or client needs a tool, it connects to the MCP server. The MCP server then connects to, for example, a database or an API. MCP hosts and servers connect with each other through the MCP protocol.

### Remote versus local MCP servers

MCP utilizes a client-host-server architecture built on [JSON-RPC 2.0 for messaging](https://modelcontextprotocol.io/docs/concepts/architecture). Communication between clients and servers occurs over defined transport layers, and supports primarily two modes of operation:

* **Remote MCP servers** - MCP clients connect to MCP servers over the internet, establishing a connection using HTTP and server-sent events (SSE), and authorizing the MCP client access to resources on the user's account using OAuth.

* **Local MCP servers** MCP clients connect to MCP servers on the same machine, using standard input/output as a local transport method.

## MCP servers in your API inventory

The following sections describe how to inventory and discover a remote MCP server in your API Center. 

### MCP API type

To register an MCP server in your API center inventory, specify the API type as **MCP**. To register an API using the Azure portal, see [Tutorial: Register APIs in your API inventory](register-apis.md).

As described in the following sections, when you register an MCP server, you can specify an environment, deployment, and definition.


### Environment and deployment for MCP server

In API Center, specify an *environment* and a *deployment* for your MCP server. The environment is the location of the MCP server, such as an API management platform or a compute service, and the deployment is a runtime URL for the MCP service. 

For information about creating an environment and a deployment, see [Tutorial: Add environments and deployments for APIs](configure-environments-deployments.md).

### Definition for remote MCP server

Optionally, add an API definition for a remote MCP server in OpenAPI 3.0 format. The API definition must include a URL endpoint for the MCP server. For an example of adding an OpenAPI definition, see [Tutorial: Register APIs in your API inventory](register-apis.md#add-a-definition-to-your-version).


You can use the following lightweight OpenAPI 3.0 API definition for your MCP server, which includes a `url` endpoint for the MCP server:


```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Demo MCP server",
    "description": "Very basic MCP server that exposes mock tools and prompts.",
    "version": "1.0"
  },
  "servers": [
    {
      "url": "https://my-mcp-server.contoso.com"
    }
  ]
}
```

###  Discover MCP servers using API Center portal

Set up the [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover MCP servers in your API inventory. Users can browse and filter MCP servers in the inventory and view details such as the URL endpoint of the MCP server, if available in the MCP server's API definition. 

:::image type="content" source="media/register-discover-mcp-server/mcp-server-portal-small.png" lightbox="media/register-discover-mcp-server/mcp-server-portal.png" alt-text="Screenshot of MCP server in API Center portal.":::

> [!NOTE]
> The URL endpoint for the MCP server is only visible in the API Center portal if you add an MCP deployment and an API definition for the MCP server.

## Related content

* [Import APIs to your API center from API Management](import-api-management-apis.md)
* [Use the Visual Studio extension for API Center](build-register-apis-vscode-extension.md) to build and register APIs from Visual Studio Code.

