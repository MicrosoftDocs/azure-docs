---
title: Get started with Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn how to set up and use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools to enable natural language queries and AI-powered security investigations 
author: poliveria
ms.topic: get-started
ms.date: 09/30/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to configure Microsoft Sentinel MCP server so that I can use natural language to query security data and accelerate investigations.
---

# Get started with Microsoft Sentinel MCP server (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article shows you how to set up and use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools to enable natural language queries against your security data. Sentinel's support for MCP enables security teams to bring AI into their security operations by allowing AI models to access security data in a standard way. 

Sentinel's [collection](sentinel-mcp-tools-overview.md) of security tools are designed to work with multiple clients and automation platforms. You can use these tools to search for relevant tables, retrieve data, and create Security Copilot agents.

## Prerequisites

To use Microsoft Sentinel MCP server and access its collection of tools, you need to be onboarded to Microsoft Sentinel data lake. For more information, see [Onboard to Microsoft Sentinel data lake and Microsoft Sentinel graph (preview)](sentinel-lake-onboarding.md).

You also need the **Security reader** role to list and invoke Sentinel's collection of MCP tools.

### Supported code editors and agent platforms

Microsoft Sentinel's support for MCP tools works with the following AI-powered code editors and agent-building platforms:
- Visual Studio Code 
- Security Copilot

## Add Microsoft Sentinel's collection of MCP tools

# [Visual Studio Code](#tab/visual-studio)

1.	**Add MCP server:**
    1. Press **Ctrl** + **Shift** + **P** then type or choose `MCP: Add Server`.

        :::image type="content" source="media/sentinel-mcp/mcp-get-started-add-server.png" alt-text="Screenshot of Visual Studio Code with Add server highlighted." lightbox="media/sentinel-mcp/mcp-get-started-add-server.png":::

    1. Choose **HTTP (HTTP or Server-Sent Events)**.

        :::image type="content" source="media/sentinel-mcp/mcp-get-started-http.png" alt-text="Screenshot of Visual Studio Code with HTTP or Server-Sent Events highlighted." lightbox="media/sentinel-mcp/mcp-get-started-http.png":::

    1. Enter the URL of the MCP server you want to access then press **Enter**:
        - [Data exploration](sentinel-mcp-data-exploration-tool.md): `https://sentinel.microsoft.com/mcp/data-exploration` 
        - [Security Copilot agent creation](sentinel-mcp-agent-creation-tool.md): `https://sentinel.microsoft.com/mcp/security-copilot-agent-creation`
    
    1. Assign a friendly **Server ID** (for example, `Microsoft Sentinel MCP server`)
    1. Choose whether to make the server available in all Visual Studio Code workspaces or just the current one.
 
2.	**Allow authentication.** When prompted, select **Allow** to authenticate using an account with at least a Security reader role.

    :::image type="content" source="media/sentinel-mcp/mcp-get-started-authenticate.png" alt-text="Screenshot of a Visual Studio Code dialog box prompting the user to authenticate." lightbox="media/sentinel-mcp/mcp-get-started-authenticate.png"::: 

3. **Open Visual Studio Code's chat.** Select **View** > **Chat**, select the **Toggle Chat** icon :::image type="icon" source="media/sentinel-mcp/mcp-chat-icon.png"::: beside the search bar, or press **Ctrl** + **Alt** + **I**.
    
4. **Verify connection.** Set the chat to Agent mode then confirm by selecting the **Configure Tools** icon :::image type="icon" source="media/sentinel-mcp/mcp-tools-icon.png"::: that you see added under the MCP server.

    :::image type="content" source="media/sentinel-mcp/mcp-get-started-04.png" alt-text="Screenshot of a Visual Studio Code Agent menu with the Agent mode and tool icon highlighted." lightbox="media/sentinel-mcp/mcp-get-started-04.png":::

# [Security Copilot](#tab/security-copilot)

>[!IMPORTANT]
>You first need to build your own custom Security Copilot agent before you can add Sentinel's collection of MCP tools. For more information, see [Build an agent from scratch using the lite experience](/copilot/security/developer/create-agent-dev#steps-to-create-your-custom-agent).

To add Microsoft Sentinel's collection of MCP tools during custom agent building:

1. Select **Add tool** to open the Tools catalog modal.
2.	In the **Add a tool** modal, search for and select the tools you want to add from Microsoft Sentinel's collection of MCP tools. For example, search for "data exploration" to find the data exploration tool.
4.	Select **Add selected** to add the tools to your agent.


---

After adding Microsoft Sentinel's collection of tools, you can use the following sample prompts to interact with data in your Microsoft Sentinel data lake. 

- Find the top three users that are at risk and explain why they are at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.

To understand how agents invoke our tools to answer these prompts, see [How Microsoft Sentinel MCP tools work alongside your agent](sentinel-mcp-data-exploration-tool.md#how-microsoft-sentinel-mcp-tools-work-alongside-your-agent).

## Next step
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)
