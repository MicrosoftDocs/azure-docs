---
title: Use the Microsoft Sentinel MCP connector in ChatGPT or Claude
titleSuffix: Microsoft Security  
description: Learn how to turn on and use a custom Microsoft Sentinel's Model Context Protocol (MCP) connector in ChatGPT or Claude
author: poliveria
ms.topic: how-to
ms.date: 04/06/2026
ms.author: pauloliveria
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform
ms.custom:
 - sfi-ga-nochange
#customer intent: As a security analyst, I want to use a custom Microsoft Sentinel MCP connector in ChatGPT.
---

# Use the Microsoft Sentinel MCP connector in ChatGPT or Claude (preview)

> [!IMPORTANT]
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article shows you how to enable and use a custom Microsoft Sentinel Model Context Protocol (MCP) connector in ChatGPT by OpenAI or Claude by Anthropic. By using this approach, Security Operations Center (SOC) analysts can run security tasks by using Microsoft Sentinel MCP. 


## Prerequisites
Before configuring a Microsoft Sentinel MCP connector in ChatGPT or Claude, you must have the following prerequisites:
- A ChatGPT Pro or a Claude Pro, Max, Team, or Enterprise plan subscription.
- A Microsoft Entra application, which represents ChatGPT or Claude as a client; for more information, see [Add a Microsoft Entra application](#add-a-microsoft-entra-application).
- [Microsoft Sentinel data lake](sentinel-lake-onboarding.md).
- Tenant-level administrative privileges.

> [!IMPORTANT]
> Use roles with the fewest permissions to help improve security for your organization. Global Administrator is a highly privileged role. Limit its use to emergency scenarios when you can't use an existing role.

### Add a Microsoft Entra application
To add a Microsoft Entra application, follow these steps:
1. Open your tenant's [Microsoft Entra admin center](https://entra.microsoft.com/), go to **App registrations**, and then select **New registration**. 
1. On **Register an application**, enter a friendly user-facing **Name** for the app.
1. Under **Redirect URIs**, select **Select a platform** and then choose **Web**. 
1. Add any of the following URLs:
    - **For ChatGPT**
        ```
        https://chatgpt.com/connector_platform_oauth_redirect
        ```
    - **For Claude**
        ```
        https://claude.ai/api/mcp/auth_callback
        ```    
1. Select **Register**.
1. On your newly registered app's page, go to **Manage** > **API permissions**, and then select **Add a permission**.
1. On the **APIs my organization uses** tab, search for `Sentinel Platform Services`.
1. Choose **SentinelPlatform.DelegatedAccess**, and then select **Add permissions**.
1. Select **Manage** > **Certificates & secrets** and select **New client secret**.
1. Add a **Description** for your client secret and set an expiration date. Select **Add**. 
1. Copy the **Value** and save it in a secure manner. This value disappears once you navigate away from the page. 
1. Go back to your app's **Overview** page and copy its **Application (client) ID**. 

## Create and use a custom Microsoft  MCP connector


To create and use a custom Microsoft  connector, follow these steps:

### [ChatGPT](#tab/chatgpt)

>[!NOTE]
>- If you're using the ChatGPT desktop application, you must first complete this connector setup in the ChatGPT web version.
>- For ChatGPT Enterprise, an administrator can roll out a connector to all users in that ChatGPT organization. 

**To create a custom connector:**

1. Turn on the ChatGPT developer mode. In ChatGPT, select your account icon, go to **Apps & connectors** > **Advanced Settings**, and toggle **Developer mode**. 
1.	Go back to **Apps & connectors** and select **Create Connector**.
1.	Provide the following required details:
    - **Connector name:** For example, `Microsoft  MCP`
    - **MCP Server URL:** `https://sentinel.microsoft.com/mcp/data-exploration`
    - **Client ID:** The **Application (client) ID** of the Microsoft Entra application you created previously.
1. When prompted, complete the OAuth consent flow. Once the MCP connector authenticates successfully, it appears in your ChatGPT connector list.

**To attach and use the connector:**
1.	Start a new chat in ChatGPT.
1.	Select the **(+)** icon next to the message box.
1.	Select **More** > **Microsoft  MCP Connector**. The connector's tools become available automatically, and ChatGPT can begin calling Microsoft Sentinel operations on your behalf.

### [Claude](#tab/claude)

**To create a custom connector:**

1. Go to https://claude.ai/customize/connectors, to create a new custom connector. Select the **+** icon and choose **Add a custom connector**. 
1. Provide the following required details: 
    - **Connector name:** For example, `Microsoft Sentinel MCP` 
    - **MCP Server URL:** `https://sentinel.microsoft.com/mcp/data-exploration` 
    - **Client ID:** The **Application (client) ID** of the Microsoft Entra application you created previously. 
    - **OAuth Client Secret:** The client secret of the Microsoft Entra application you created previously.
1. When prompted, complete the OAuth consent flow. Once the MCP connector authenticates successfully by using the Microsoft Entra credentials, it appears in your Claude connector list. 
1. Select the MCP connector and choose **Connect**. 
1. Select **Configure** to determine which tools to allow for your environment. 

**To attach and use the connector:**

Start a new chat in Claude. The connector tools become available automatically, and Claude can begin calling Microsoft Sentinel operations on your behalf. 

>[!NOTE]
> You can only use the [data exploration tool collection](sentinel-mcp-data-exploration-tool.md). 

---


## Related content
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)
