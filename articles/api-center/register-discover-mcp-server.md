---
title: Inventory and Discover MCP Servers in Your API Center
description: Learn about how Azure API Center can be a centralized registry for MCP servers in your organization. Developers and other stakeholders can use the API Center portal to discover MCP servers.

ms.service: azure-api-center
ms.topic: concept-article
ms.date: 02/20/2026
 
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
# Customer intent: As an API program manager, I want to register and discover  MCP servers as APIs in my API Center inventory.
ms.custom:
  - build-2025
---

# Register and discover MCP servers in your API inventory

This article describes how to use Azure API Center to maintain an inventory (or *registry*) of remote or local model context protocol (MCP) servers and help stakeholders discover them through the API Center portal. MCP servers expose backend APIs or data sources in a standard way to AI agents and models that consume them.

As shown in this article, you can register remote or local MCP servers by using the Azure portal similar to the way you register APIs and other assets. API Center also provides links to partner MCP servers you can register in your inventory. 

> [!TIP]
> If you manage MCP servers in Azure API Management, you can enable automatic synchronization to keep your API center up to date with MCP servers and other APIs from your API Management instance. To learn more, see [Synchronize APIs from Azure API Management instance](synchronize-api-management-apis.md).

> [!NOTE]
> New! MCP servers registered in your API center can now be integrated with Microsoft Foundry's tool catalogs, enabling you to govern MCP tools and make them available to AI agents. Learn more in [Tool catalog for agents in Foundry](/azure/ai-foundry/agents/concepts/tool-catalog) and [Private tool catalogs for Foundry agents](/azure/ai-foundry/agents/how-to/private-tool-catalog).

[!INCLUDE [about-mcp-servers](includes/about-mcp-servers.md)]

## Prerequisites

- An API center. If you don't have an API center yet, see the quickstart to [Create an API center](set-up-api-center.md).
- A remote MCP server URL endpoint or an MCP server package that you want to register. 
- (For a remote MCP server) An [environment](configure-environments-deployments.md#environment) in your API center to associate with the MCP server. The environment is the location of the MCP server, such as an API management platform or a compute service. 

## Register a remote MCP server

To register a remote MCP server:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API center.
1. In the sidebar menu, under **Inventory**, select **Assets**.
1. Select **+ Register an asset** > **MCP server**.    
    :::image type="content" source="media/register-discover-mcp-server/register-mcp-server.png" alt-text="Screenshot showing registration of an MCP server asset in the portal.":::
1. In the **Register an MCP server** form, provide the information about the MCP server:
    1. Enter a **Title** for the MCP server. API Center automatically generates an **Identification** based on the title, but you can edit it if needed. 
    1. Enter a **Summary** and **Description** for the MCP server to provide more context about it.
    1. Optionally enter an **Icon URL** to associate an image with the MCP server.
    1. Under **Use Cases**, optionally provide a name and description for one or more use cases for the MCP server. 
    1. Under **Remotes**, do the following:
        1. Select **+ Add remote**. 
        1. Enter a **Runtime URL** for the MCP server. 
        1. Select an API Center **Environment** that corresponds to the location of the MCP server, such as an API management platform or a compute service. 
        1. Select **Save**.
            :::image type="content" source="media/register-discover-mcp-server/register-remote.png" alt-text="Screenshot showing registration of a remote MCP server in the portal.":::
        1. Optionally, repeat the previous steps to add more remotes if the MCP server has multiple endpoints or is deployed in multiple environments. 
    1. Optionally, select **Add repository** to provide a URL to a code repository associated with the MCP server.
    1. Under **Version title**, provide a **Version title**, **Version identification**, and **Version lifecycle** for the MCP server. Learn more about [versions in API Center](key-concepts.md#api-version).
    1. Optionally, add **License** and **External documentation** links and associated information for the MCP server.
    1. Select **Create**.

### Definitions for remote MCP server

API Center automatically generates the following OpenAPI definitions for a remote MCP server and associates them with the server version you register:

- SSE definition, for using server-sent events (SSE) as an agentic protocol
- Streamable definition, for using a transport-agnostic agentic protocol

## Register a local MCP server

You can register an MCP server that's installed locally using a package manager such as `npm` or `pypi`.

To register a local MCP server:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API center.
1. In the sidebar menu, under **Inventory**, select **Assets**.
1. Select **+ Register an asset** > **MCP server**.
    :::image type="content" source="media/register-discover-mcp-server/register-mcp-server.png" alt-text="Screenshot showing registration of an MCP server asset in the portal.":::
1. In the **Register an MCP server** form, provide the information about the MCP server:
    1. Enter a **Title** for the MCP server. API Center automatically generates an **Identification** based on the title, but you can edit it if needed. 
    1. Enter a **Summary** and **Description** for the MCP server to provide more context about it.
    1. Optionally enter an **Icon URL** to associate an image with the MCP server.
    1. Under **Use Cases**, optionally provide a name and description for one or more use cases for the MCP server. 
    1. Under **Packages**, do the following:
        1. Select **+ Add package**. 
        1. Enter a **Package registry** for installation of the MCP server. For example, `npm`.
        1. Enter a **Package name** from the package registry and a **Version**.
        1. In **Runtime hint**, enter the runtime command used to run the MCP server. For example, `npx`.
        1. In **Runtime arguments**, optionally pass arguments when running the MCP server. 
        1. Select **Save**.
            :::image type="content" source="media/register-discover-mcp-server/register-package.png" alt-text="Screenshot showing registration of an MCP server package in the portal.":::
        1. Optionally, repeat the previous steps to add more packages if the MCP server is available in multiple package registries or has multiple versions.
    1. Optionally, select **Add repository** to provide a URL to a code repository associated with the MCP server.
    1. Under **Version title**, provide a **Version title**, **Version identification**, and **Version lifecycle** for the MCP server. Learn more about [versions in API Center](key-concepts.md#api-version).
    1. Optionally, add **License** and **External documentation** links and associated information for the MCP server.
    1. Select **Create**.

## Register a partner MCP server

Azure API Center provides a curated list of partner MCP servers that you can add to your API inventory. This list includes MCP servers from Microsoft services such as Azure Logic Apps, GitHub, and others.

Register one or more of the partner MCP servers in your API inventory to make them available to developers and other stakeholders in your organization.

:::image type="content" source="media/register-discover-mcp-server/partner-mcp-servers.png" alt-text="Screenshot of partner MCP servers in the portal.":::

To register a partner MCP server:

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu, under **Discover**, select **MCP** (preview).
1. Browse the available partner MCP servers. Select **Register** to add an MCP server to your API inventory. Follow the on-screen instructions if they're provided to complete the registration.

When you add a partner MCP server, API Center automatically configures the following settings for you:

* Creates an API entry in your API inventory with the API type set to **MCP**.
* Creates an environment and a deployment for the MCP server.
* Adds OpenAPI definitions for the MCP server if the partner provides them.

## Build and register your own MCP servers

To build MCP servers by using Azure compute services and register them in your API center, see the following examples:

- [Build and register a Logic Apps MCP server](../logic-apps/create-mcp-server-api-center.md)
- [Build and register an Azure Functions MCP server](/azure/ai-foundry/mcp/build-your-own-mcp-server)

##  Discover MCP servers using API Center portal

Set up your [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover MCP servers in your API inventory. From the API Center portal, users can do the following:
- Browse and filter MCP servers in the inventory.
- For remote MCP servers, view details such as the URL endpoint of the MCP server and API definition, and install the MCP server in their Visual Studio Code environment.

:::image type="content" source="media/register-discover-mcp-server/mcp-server-portal-small.png" lightbox="media/register-discover-mcp-server/mcp-server-portal.png" alt-text="Screenshot of MCP server in API Center portal.":::

## Manage access to MCP servers

Optionally, use API Center's access management capabilities to manage who can view and access MCP servers in your inventory. For more information, see [Authorize access to APIs in your API center](authorize-api-access.md).

## Related content

* [About MCP servers in API Management](../api-management/mcp-server-overview.md)
* [Import APIs to your API center from API Management](import-api-management-apis.md)
* [Use the Visual Studio extension for API Center](build-register-apis-vscode-extension.md) to build and register APIs from Visual Studio Code.
* For a live example of how Azure API Center can power your private, enterprise-ready MCP registry, visit [MCP Center](https://mcp.azure.com).