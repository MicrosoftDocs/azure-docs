---
title: Use a Microsoft Sentinel MCP tool in Visual Studio Code
titleSuffix: Microsoft Security  
description: Learn how to use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools or your own custom tool in Visual Studio Code
author: poliveria
ms.topic: how-to
ms.date: 11/18/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to add Sentiel MCP tool in Visual Studio Code.
---

# Use an MCP tool in Visual Studio Code

This article shows you how to add Microsoft Sentinel's Model Context Protocol (MCP) [collection of security tools](sentinel-mcp-tools-overview.md#available-collections) or your own custom tools to your AI agents in Visual Studio Code. 

For information about how to get started with MCP tools, see the following articles:
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Create and use custom Microsoft Sentinel MCP tools](sentinel-mcp-create-custom-tool.md)

## Add a Microsoft Sentinel or custom tool collection

To add a Microsoft Sentinel tool collection or your own custom tools in Visual Studio Code, follow these steps:

1.	**Add MCP server:**
    1. Press **Ctrl** + **Shift** + **P** then type or choose `MCP: Add Server`.

        :::image type="content" source="media/sentinel-mcp/mcp-get-started-add-server.png" alt-text="Screenshot of Visual Studio Code with Add server highlighted." lightbox="media/sentinel-mcp/mcp-get-started-add-server.png":::

    1. Choose **HTTP (HTTP or Server-Sent Events)**.

        :::image type="content" source="media/sentinel-mcp/mcp-get-started-http.png" alt-text="Screenshot of Visual Studio Code with HTTP or Server-Sent Events highlighted." lightbox="media/sentinel-mcp/mcp-get-started-http.png":::

    1. Enter the URL of the MCP server of the tool collection you want to access, which can be from the available Sentinel collection or your own custom one, then press **Enter**.
    
    1. Assign a friendly **Server ID** (for example, `Microsoft Sentinel MCP server`)
    1. Choose whether to make the server available in all Visual Studio Code workspaces or just the current one.
 
1.	**Allow authentication.** When prompted, select **Allow** to authenticate using an account with at least a Security reader role.

    :::image type="content" source="media/sentinel-mcp/mcp-get-started-authenticate.png" alt-text="Screenshot of a Visual Studio Code dialog box prompting the user to authenticate." lightbox="media/sentinel-mcp/mcp-get-started-authenticate.png"::: 

1. **Open Visual Studio Code's chat.** Select **View** > **Chat**, select the **Toggle Chat** icon :::image type="icon" source="media/sentinel-mcp/mcp-chat-icon.png"::: beside the search bar, or press **Ctrl** + **Alt** + **I**.
    
1. **Verify connection.** Set the chat to Agent mode then confirm by selecting the **Configure Tools** icon :::image type="icon" source="media/sentinel-mcp/mcp-tools-icon.png"::: that you see added under the MCP server.

    :::image type="content" source="media/sentinel-mcp/mcp-get-started-04.png" alt-text="Screenshot of a Visual Studio Code Agent menu with the Agent mode and tool icon highlighted." lightbox="media/sentinel-mcp/mcp-get-started-04.png":::

## Related content
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)