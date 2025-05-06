---
title: Expose REST API in API Management as MCP server | Microsoft Docs
description: Learn how to...
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/05/2025
ms.author: danlep
---
# Expose REST API in API Management as an MCP server

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Intro

> [!NOTE]
> Only the API definition can be exported directly from API Management to Postman. Other information such as policies or subscription keys isn't exported.

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure that your instance manages a REST API that you'd like to expose as an MCP serer. 

    > [!NOTE]
    > You can only expose HTTP APIs from API Management as MCP servers.
+ To test the MCP server, you can use a tool like [MCP Inspector](

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]


## Expose API as an MCP server

1. In the portal, under **APIs**, select **MCP Servers** > **+ Create new MCP Server**.
1. In **API**, select a REST API to expose as an MCP server. 
1. Select one or more **API Operations** to expose as tools. You can select all operations or only specific operations.
1. Select **Create**.

:::image type="content" source="media/export-rest-mcp-server/create-mcp-server.png" alt-text="Screenshot of creating an MCP server in the portal.":::

The MCP server is created and the API operations are exposed as tools. The MCP server is listed in the **MCP Servers** blade. The **URL** column shows the endpoint of the MCP server that you can call for testing or within a client application.


:::image type="content" source="media/export-rest-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal.":::


## Test and use the MCP server

To verify that the MCP server is working, you can use a tool like MCP Inspector to send requests to the server's `sse` endpoint.

To use MCP inspector:

1. Start the MCP Inspector by running the following command in a terminal:

    ```bash
    npx @modelcontextprotocol/inspector
    ```
1. Select **Transport Type** of **SSE**.
1. In **URL**, enter the MCP server URL that's configured in API Management.
1. Under **Authentication**, provide credentials of the underlying API if required in API Management. For example, if a subscription key is required, enter  `Ocp-Apim-Subscription-Key` in **Header Name**, and provide the key value in **Bearer token**.
1. Select **Connect** to connect to the MCP server. 
1. In **Tools**, select **List Tools**, and select a tool configured in the MCP server. 
1. Enter any required parameters for the tool, and select **Run Tool** to run the tool. The results are displayed in the **Tool Result** pane.

:::image type="content" source="media/export-rest-mcp-server/test-mcp-inspector.png" alt-text="Screenshot of testing an MCP server tool in MCP Inspector.":::

## Related content


