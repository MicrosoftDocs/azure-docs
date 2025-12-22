---
title: Use the Microsoft Sentinel MCP connector in ChatGPT 
titleSuffix: Microsoft Security  
description: Learn how to turn on and use a custom Microsoft Sentinel's Model Context Protocol (MCP) connector in ChatGPT
author: poliveria
ms.topic: how-to
ms.date: 12/09/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to use a custom Microsoft Sentinel MCP connector in ChatGPT.
---

# Use the Microsoft Sentinel MCP connector in ChatGPT (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP connector in ChatGPT is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article shows how you can enable and use a custom Microsoft Sentinel Model Context Protocol (MCP) connector in ChatGPT. This approach allows Security Operations Center (SOC) analysts to run security tasks by using Sentinel MCP. 


## Prerequisites
Before configuring a Microsoft Sentinel MCP connector in ChatGPT, you must have the following:
- A ChatGPT Pro subscription
- A Microsoft Entra application, which represents ChatGPT as a client

To add a Microsoft Entra application, follow these steps:
1. Open your tenant's [Microsoft Entra admin center](https://entra.microsoft.com/) then go to **App registrations** > **New registration**. 
1. On the **Register an application page**, enter a friendly user-facing **Name** for the app, then select **Register**.
1. On your newly registered app's page, go to **Manage** > **API permissions**, then select **Add a permission**.
1. On the flyout panel that appears, go to the **APIs my organization uses** tab and search for `Sentinel Platform Services`.
1. Choose **SentinelPlatform.DelegatedAccess**, then select **Add permissions**.
1. Go back to your app's **Overview** page, then select **Add a redirect URI**.
1. Select **+ Add a platform** > **Public client/native (mobile & desktop)**.
1. In the **Redirect URIs** text box, add the following URL, then select **Configure**:
    ```
    https://chatgpt.com/connector_platform_oauth_redirect
    ```

## Create a custom Sentinel MCP connector in ChatGPT

To create a custom Sentinel connector in ChatGPT, follow these steps:

>[!NOTE]
>- If you're using the ChatGPT desktop application, you must first complete this connector setup in the ChatGPT web version.
>- For ChatGPT Enterprise, an administrator can roll out a connector to all users in that ChatGPT organization. 

1. Turn on the ChatGPT developer mode. In ChatGPT, select your account icon, then go to **Apps & connectors** > **Advanced Settings** and toggle **Developer mode**. 
1.	Go back to **Apps & connectors** and select **Create Connector**.
1.	Provide the following required details:
    - **Connector name:** For example, `Microsoft Sentinel MCP`
    - **MCP Server URL:** `https://sentinel.microsoft.com/mcp/data-exploration`
    - **Client ID:** The **Application (client) ID** of the Microsoft Entra application you created previously.
1. When prompted, complete the OAuth consent flow. Once the MCP connector authenticates successfully, it appears in your ChatGPT connector list.


## Use the custom Sentinel MCP connector in a chat

To attach and use a Sentinel MCP connector:
1.	Start a new chat in ChatGPT.
1.	Select the **(+)** icon next to the message box.
1.	Select **More** > **Microsoft Sentinel MCP Connector**. The connector's tools become available automatically, and ChatGPT can begin calling Sentinel operations on your behalf.

## Related content
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)