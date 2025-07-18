---
title: Expose REST API in API Management as MCP server | Microsoft Docs
description: Learn how to expose a REST API in Azure API Management as an MCP server, enabling API operations as tools accessible via the Model Context Protocol (MCP).
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 07/18/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2025
---

# Expose REST API in API Management as an MCP server

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

In API Management, you can expose a REST API managed in API Management as a remote [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server through its built-in [AI gateway](genai-gateway-capabilities.md). Expose one or more of the API operations as tools that MCP clients can call using the MCP protocol. 

[!INCLUDE [preview-callout-mcp-servers](includes/preview/preview-callout-mcp-servers.md)]

Azure API Management also supports secure integration with existing MCP-compatible servers - tool servers hosted outside of API Management. For more information, see [Expose an existing MCP server](expose-existing-mcp-server.md).

Learn more about:

* [MCP server support in API Management](mcp-server-overview.md)
* [AI gateway capabilities](genai-gateway-capabilities.md)


## Prerequisites

+ If you don't already have an API Management instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). 
    + Your API Management instance must be in one of the supported service tiers for preview: classic Basic, Standard, Premium, Basic v2, Standard v2, or Premium v2.
    + If your instance is in the classic Basic, Standard, or Premium tier, you must join the **AI Gateway Early** [update group](configure-service-update-settings.md) to access MCP server features. It can take up to 2 hours for the update to be applied.
+ Make sure that your instance manages an HTTP-compatible API (any API imported as a REST API, including APIs imported from Azure resources) that you'd like to expose as an MCP server. To import a sample API, see [Import and publish your first API](import-and-publish.md).
    > [!NOTE]
    > Only HTTP APIs managed in API Management can be exposed as MCP servers.
+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).


## Expose API as an MCP server

Follow these steps to expose a managed REST API in API Management as an MCP server:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
    [!INCLUDE [preview-callout-mcp-feature-flag](includes/preview/preview-callout-mcp-feature-flag.md)]

1. In the left menu, under **APIs**, select **MCP servers** > **+ Create new MCP server**.
1. Select **Expose an API as an MCP server**.
1. In **Backend API**:
    1. Select a managed **API** to expose as an MCP server. 
    1. Select one or more **API operations** to expose as tools. You can select all operations or only specific operations. 
        > [!NOTE]
        > You can update the operations exposed as tools later in the **Tools** blade of your MCP server.
1. In **New MCP server**:
    1. Enter a **Name** and optional **Description** for the MCP server in API Management.
    1. In **Base URL**, configure the final URL where the MCP server will be accessible in API Management.
1. Select **Create**.

:::image type="content" source="media/export-rest-mcp-server/create-mcp-server.png" alt-text="Screenshot of creating an MCP server in the portal." :::

The MCP server is created and the API operations are exposed as tools. The MCP server is listed in the **MCP servers** pane. The **URL** column shows the endpoint of the MCP server that you can call for testing or within a client application.


:::image type="content" source="media/export-rest-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal.":::

[!INCLUDE [api-management-configure-test-mcp-server](../../includes/api-management-configure-test-mcp-server.md)]