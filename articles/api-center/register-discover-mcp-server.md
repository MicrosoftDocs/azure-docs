---
title: Inventory and Discover MCP Servers in Your API Center
description: Learn about how Azure API Center can be a centralized registry for MCP servers in your organization. Developers and other stakeholders can use the API Center portal to discover MCP servers.

ms.service: azure-api-center
ms.topic: concept-article
ms.date: 09/08/2025
 
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
# Customer intent: As an API program manager, I want to register and discover  MCP servers as APIs in my API Center inventory.
ms.custom:
  - build-2025
---

# Register and discover remote MCP servers in your API inventory

This article describes how to use Azure API Center to maintain an inventory (or *registry*) of remote model context protocol (MCP) servers and help stakeholders discover them using the API Center portal. MCP servers expose backend APIs or data sources in a standard way to AI agents and models that consume them.

[!INCLUDE [about-mcp-servers](includes/about-mcp-servers.md)]

## Manually register an MCP server in your API inventory

The following sections describe how to manually inventory a remote MCP server in your API center.

### MCP API type

Manually register an MCP server in your API center inventory similar to the way you register other APIs, specifying the API type as **MCP**. To register an API using the Azure portal, see [Tutorial: Register APIs in your API inventory](././tutorials/register-apis.md).

As described in the following sections, when you register an MCP server, you can specify an environment, deployment, and definition.

> [!TIP]
> If you manage MCP servers in Azure API Management, you can enable automatic synchronization to keep your API center up to date with MCP servers and other APIs from your API Management instance. To learn more, see [Synchronize APIs from Azure API Management instance](synchronize-api-management-apis.md).


### Environment and deployment for MCP server

In API Center, specify an *environment* and a *deployment* for your MCP server. The environment is the location of the MCP server, such as an API management platform or a compute service, and the deployment is a runtime URL for the MCP service. 

For information about creating an environment and a deployment, see [Tutorial: Add environments and deployments for APIs](././tutorials/configure-environments-deployments.md).

### Definition for remote MCP server

Optionally, add an API definition for a remote MCP server in OpenAPI 3.0 format. The API definition must include a URL endpoint for the MCP server. For an example of adding an OpenAPI definition, see [Tutorial: Register APIs in your API inventory](././tutorials/register-apis.md#add-a-definition-to-your-version).


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

## Register a partner MCP server

Azure API Center provides a curated list of partner MCP servers that you can add to your API inventory. This list includes MCP servers from Microsoft services such as Azure Logic Apps, GitHub, and others.

Register one or more of the partner MCP servers in your API inventory to make them available to developers and other stakeholders in your organization.

:::image type="content" source="media/register-discover-mcp-server/partner-mcp-servers.png" alt-text="Screenshot of partner MCP servers in the portal.":::

To register a partner MCP server:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the sidebar menu, under **Discover**, select **MCP** (preview).
1. Browse the available partner MCP servers. Select **Register** to add an MCP server to your API inventory. Follow on-screen instructions if provided to complete the registration.

When you add a partner MCP server, API Center automatically configures the following for you:

* Creates an API entry in your API inventory with the API type set to **MCP**.
* Creates an environment and a deployment for the MCP server.
* Adds an OpenAPI definition for the MCP server if available from the partner.

To build and register a Logic Apps MCP server, see [Build and register a Logic Apps MCP server](../logic-apps/create-mcp-server-api-center.md).

##  Discover MCP servers using API Center portal

Set up your [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover MCP servers in your API inventory. Users can browse and filter MCP servers in the inventory and view details such as the URL endpoint of the MCP server, if available in the MCP server's API definition. 


:::image type="content" source="media/register-discover-mcp-server/mcp-server-portal-small.png" lightbox="media/register-discover-mcp-server/mcp-server-portal.png" alt-text="Screenshot of MCP server in API Center portal.":::

> [!NOTE]
> The URL endpoint for the MCP server is only visible in the API Center portal if an MCP deployment and an API definition for the MCP server are configured in the API center.

## Related content

* [About MCP servers in API Management](../api-management/mcp-server-overview.md)
* [Import APIs to your API center from API Management](import-api-management-apis.md)
* [Use the Visual Studio extension for API Center](build-register-apis-vscode-extension.md) to build and register APIs from Visual Studio Code.
* For a live example of how Azure API Center can power your private, enterprise-ready MCP registry, visit [MCP Center](https://mcp.azure.com).