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



## Related content

* [Blog: Enhanced API developer experience with the Microsoft-Postman partnership](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/enhanced-api-developer-experience-with-the-microsoft-postman/ba-p/3650304)
* Learn more about [importing API definitions to Postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/).
* Learn more about [authorizing requests in Postman](https://learning.postman.com/docs/sending-requests/authorization/).
