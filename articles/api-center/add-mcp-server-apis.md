---
title: Inventory MCP Servers in Your API Center
description: TBD
author: dlepow
ms.service: azure-api-center
ms.custom: 
ms.topic: concept-article
ms.date: 04/21/2025
ms.author: danlep 
# Customer intent: As an API program manager, I want to add MCP servers as APIs to my API Center inventory.
---

# MCP servers in your API inventory

This articles describes how to register model context protocol (MCP) servers as APIs in your API Center inventory. MCP servers expose backend APIs or data sources in a standard way to AI agents and models that consume them.

## About MCP 

AI agents are becoming widely adopted because of enhanced large language model (LLM) capabilities. However, even the most advanced models face limitations due to their isolation from external data. Each new data source potentially requires custom implementations to extract, prepare, and make data accessible for the models.

The [model context protocol](https://www.anthropic.com/news/model-context-protocol) (MCP) helps solve this problem. MCP is an open standard for connecting AI models and agents with external data sources such as local data sources (databases or computer files) or remote services (systems available over the internet, such as remote databases or APIs).

### MCP architecture

THe following diagram illustrates the MCP architecture:
 
:::image type="content" source="media/add-mcp-server-apis/mcp-architecture.png" alt-text="Diagram of model context protocol (MCP) architecture.":::

The architecture consists of the following components:

| Component      | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| **MCP hosts**  | LLM applications such as chat apps or AI assistants in your IDEs (like GitHub Copilot in VS Code) that need to access external capabilities |
| **MCP clients**| Protocol clients that maintain 1:1 connections with servers, inside the host application        |
| **MCP servers**| Lightweight programs that each expose specific capabilities and provide context, tools, and prompts to clients |
| **MCP protocol**| Transport layer in the middle                                                                 |

MCP follows a client-server architecture where a host application can connect to multiple servers. Whenever your MCP host or client needs a tool, it connects to the MCP server. The MCP server then connects to, for example, a database or an API. MCP hosts and servers connect with each other through the MCP protocol.

### Remote versus local MCP servers

The MCP standard supports two modes of operation:

* **Remote MCP servers** - MCP clients connect to MCP servers over the internet, establishing a connection using HTTP and server-sent events (SSE), and authorizing the MCP client access to resources on the user's account using OAuth.

* **Local MCP servers** MCP clients connect to MCP servers on the same machine, using Stdio as a local transport method.



## MCP servers in your API inventory

The following sections describe how to register an MCP server in your API Center inventory. You can register remote or local MCP servers.

### MCP API type

When registering an MCP server in your API center inventory, specify the API type as **MCP**.


### Environment and deployment for MCP server

In API Center, specify an *environment* and a *deployment* for your MCP API. The environment is the location of the MCP server, such as an API management platform, and the deployment is a runtime URL for the MCP service. 

For information about creating an environment and a deployment, see [Tutorial: Add environments and deployments for APIs](configure-environments-deployments.md).

### API definition for MCP API

Optionally, add an API definition for your MCP server in OpenAPI 3.0 format. The API definition must include a URL endpoint for the MCP server.


The following is an example of an OpenAPI 3.0 API definition for an MCP server:

```jsonan 
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

Use the [API Center portal](https://apicenter.azure.com) to discover MCP servers in your API inventory. The API Center portal provides a list of all APIs in your inventory, including MCP servers.

Information about your MCP server includes the URL endpoint of the MCP server, if available in the API definition. 

:::image type="content" source="media/add-mcp-server-apis/mcp-server-portal-small.png" lightbox="media/add-mcp-server-apis/mcp-server-portal.png" alt-text="Screenshot of MCP server in API Center portal.":::

## Related content

* See the [Azure CLI reference for Azure API Center](/cli/azure/apic) for a complete command list, including commands to manage [environments](/cli/azure/apic/environment), [deployments](/cli/azure/apic/api/deployment), [metadata schemas](/cli/azure/apic/metadata), and [services](/cli/azure/apic).
* [Import APIs to your API center from API Management](import-api-management-apis.md)
* [Use the Visual Studio extension for API Center](build-register-apis-vscode-extension.md) to build and register APIs from Visual Studio Code.

