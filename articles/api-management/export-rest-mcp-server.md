---
title: Expose REST API in API Management as MCP server | Microsoft Docs
description: Learn how to expose a REST API in Azure API Management as an MCP server, enabling API operations as tools accessible via the Model Context Protocol (MCP).
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 07/14/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2025
---

# Expose REST API in API Management as an MCP server

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

In API Management, you can expose a REST API managed in API Management as a remote [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server. Expose one or more of the API operations as tools that MCP clients can call using the MCP protocol. 

Azure API Management also supports secure integration with existing MCP-compatible servers — tool servers hosted outside of API Management - such as Azure logic apps or function apps, or tools hosted in LangServe or LangChain. See [Connect and govern existing MCP server](connect-govern-existing-mcp-server.md) for more information.

With support for existing and exposed MCP servers, API Management provides centralized control over authentication, authorization, and monitoring. It simplifies the management of MCP servers while helping to mitigate common security risks and ensuring scalability.

> [!IMPORTANT]
> This feature is currently in preview. Review the [prerequisites](#prerequisites) to access MCP server features.

In this article, you learn how to:

* Expose a REST API in API Management as an MCP server
* Configure policies for the MCP server
* Test the generated MCP server from an MCP client

[!INCLUDE [about-mcp-servers](../api-center/includes/about-mcp-servers.md)]

## Prerequisites

+ If you don't already have an API Management instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). Your API Management instance must be in one of the supported service tiers for preview: classic Basic, Standard, Premium, Basic v2, Standard v2, or Premium v2.
+ If your instance is in the classic Basic, Standard, or Premium tier, you must join the **AI Gateway Early** [update group](configure-service-update-settings.md) to access MCP server features. It can take up to 2 hours for the update to be applied.
+ Make sure that your instance manages an HTTP-compatible API (any API imported as a REST API) that you'd like to expose as an MCP server. To import a sample API, see [Import and publish your first API](import-and-publish.md).
    > [!NOTE]
    > Only HTTP APIs managed in API Management can be exposed as MCP servers.
+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).


## Expose API as an MCP server

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **MCP Servers** > **+ Create new MCP Server**.
1. In **API**, select a REST API to expose as an MCP server. 
1. Select one or more **API Operations** to expose as tools. You can select all operations or only specific operations.
1. Select **Create**.

:::image type="content" source="media/export-rest-mcp-server/create-mcp-server-small.png" alt-text="Screenshot of creating an MCP server in the portal." lightbox="media/export-rest-mcp-server/create-mcp-server.png":::

The MCP server is created and the API operations are exposed as tools. The MCP server is listed in the **MCP Servers** pane. The **URL** column shows the endpoint of the MCP server that you can call for testing or within a client application.


:::image type="content" source="media/export-rest-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal.":::

[!INCLUDE [api-management-configure-test-mcp-server](../../includes/api-management-configure-test-mcp-server.md)]