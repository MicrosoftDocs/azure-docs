---
title: Inventory and Discover MCP Servers in Your API Center
description: Learn about how Azure API Center can be a centralized registry for MCP servers in your organization. Developers and other stakeholders can use the API Center portal to discover MCP servers.
author: dlepow
ms.service: azure-api-center
ms.topic: concept-article
ms.date: 04/28/2025
ms.author: danlep 
# Customer intent: As an API program manager, I want to register and discover  MCP servers as APIs in my API Center inventory.
ms.custom:
  - build-2025
---

# Register and discover remote MCP servers in your API inventory

This article describes how to use Azure API Center to maintain an inventory (or *registry*) of remote model context protocol (MCP) servers and help stakeholders discover them using the API Center portal. MCP servers expose backend APIs or data sources in a standard way to AI agents and models that consume them.

[!INCLUDE [about-mcp-servers](includes/about-mcp-servers.md)]

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

