---
title: Expose REST API in API Management as MCP server | Microsoft Docs
description: Learn how to expose a REST API in Azure API Management as an MCP server, enabling API operations as tools accessible via the Model Context Protocol (MCP).
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/06/2025
ms.author: danlep
---

# Expose REST API in API Management as an MCP server

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In API Management, you can expose a REST API managed in API Management as a remote [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server. You can expose one or more of the API operations as tools that can be called by clients using the MCP protocol. 

> [!NOTE]
> This feature is currently in preview.

In this article, you learn how to:

* Expose a REST API in API Management as an MCP server
* Test the generated MCP server


## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure that your instance manages a REST API that you'd like to expose as an MCP server. To import a sample API, see [Import and publish your first API](import-and-publish.md).
    > [!NOTE]
    > Only expose HTTP APIs from API Management can be exposed as MCP servers.
+ To test the MCP server, you can use a tool like [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Expose API as an MCP server

1. In the portal, under **APIs**, select **MCP Servers** > **+ Create new MCP Server**.
1. In **API**, select a REST API to expose as an MCP server. 
1. Select one or more **API Operations** to expose as tools. You can select all operations or only specific operations.
1. Select **Create**.

:::image type="content" source="media/export-rest-mcp-server/create-mcp-server-small.png" alt-text="Screenshot of creating an MCP server in the portal." lightbox="media/export-rest-mcp-server/create-mcp-server.png":::

The MCP server is created and the API operations are exposed as tools. The MCP server is listed in the **MCP Servers** pane. The **URL** column shows the endpoint of the MCP server that you can call for testing or within a client application.


:::image type="content" source="media/export-rest-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal.":::


## Test and use the MCP server

To verify that the MCP server is working, you can use a tool like MCP Inspector to send requests to the server's `sse` endpoint.

To use MCP inspector:

1. Start the MCP Inspector by running the following command in a terminal:

    ```bash
    npx @modelcontextprotocol/inspector
    ```

1. Enter the following settings:

    | **Setting**           | **Description**                                                                                     |
    |------------------------|-----------------------------------------------------------------------------------------------------|
    | **Transport Type**     | Select **SSE**.                                                                                    |
    | **URL**                | Enter the MCP server URL that's configured in API Management.                                      |
    | **Authentication**     | Optionally, provide credentials of the underlying API if required in API Management. For example, if a subscription key is required, enter `Ocp-Apim-Subscription-Key` in **Header Name**, and provide the key value in **Bearer token**. |
1. Select **Connect** to connect to the MCP server.             
1. In **Tools**, select **List Tools**, and select a tool configured in the MCP server. 
1. Enter any required parameters for the tool, and select **Run Tool** to run the tool. The results are displayed in the **Tool Result** pane.

:::image type="content" source="media/export-rest-mcp-server/test-mcp-inspector.png" alt-text="Screenshot of testing an MCP server tool in MCP Inspector.":::

## Related content

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

