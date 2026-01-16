---
title: Use a Microsoft Sentinel MCP tool in Microsoft Copilot Studio
titleSuffix: Microsoft Security  
description: Learn how to add Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools or your own custom tool in Microsoft Copilot Studio
author: poliveria
ms.topic: how-to
ms.date: 11/18/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to add Sentinel MCP tools in Microsoft Copilot Studio.
---

# Use an MCP tool in Microsoft Copilot Studio (preview)

> [!IMPORTANT]
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article shows you how to add Microsoft Sentinel's Model Context Protocol (MCP) [collection of security tools](sentinel-mcp-tools-overview.md#available-collections) or your own custom tools to your AI agents in [Microsoft Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) . 

For information about how to get started with MCP tools, see the following articles:
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Create and use custom Microsoft Sentinel MCP tools](sentinel-mcp-create-custom-tool.md)

>[!TIP]
>For the best performance with MCP tools, use GPT-5 or a later version with a higher context window. 

## Add a Microsoft Sentinel tool collection

To add a Microsoft Sentinel tool collection in Copilot Studio, follow these steps:

1. Go to [Copilot Studio](https://copilotstudio.microsoft.com/) and create a new agent or select an existing agent.

1. After provisioning your agent, on your agent's **Overview** page, go to **Tools** and select **Add tool**.

     :::image type="content" source="media/sentinel-mcp/get-started-studio-add-tool.png" alt-text="Screenshot of an agent's Overview page in Copilot Studio with Add tool button highlighted." lightbox="media/sentinel-mcp/get-started-studio-add-tool.png":::   

1. On the **Add tool** pop-up window, search for `Sentinel` then choose one of the [available Sentinel MCP tool collection](sentinel-mcp-tools-overview.md#available-collections) that suits your needs.

     :::image type="content" source="media/sentinel-mcp/get-started-studio-select-tool.png" alt-text="Screenshot of the Add tool pop-up window in Copilot Studio with a Microsoft Sentinel tool collection highlighted." lightbox="media/sentinel-mcp/get-started-studio-select-tool.png":::   

1. Make sure that the **Authentication type** is set to **Microsoft Entra ID Integrated**, then select **Create**.

     :::image type="content" source="media/sentinel-mcp/get-started-studio-authenticate.png" alt-text="Screenshot of the Add tool pop-up window in Copilot Studio showing the authentication type step." lightbox="media/sentinel-mcp/get-started-studio-authenticate.png":::   

1. Select **Add and configure**.

     :::image type="content" source="media/sentinel-mcp/get-started-studio-add-connection.png" alt-text="Screenshot of the Add tool pop-up window in Copilot Studio showing with Add and configure button highlighted." lightbox="media/sentinel-mcp/get-started-studio-add-connection.png":::   

Your agent is now connected with Sentinel's available collection of tools. You can start prompting your agent and use the tools to deliver outcomes.

## Add a custom tool collection

Custom MCP tools let you build deterministic workflows by prescribing exactly what data agents can reason over. To add your custom tool collection in Copilot Studio, follow these steps:

>[!TIP]
>Open two browser tabs or windows because you'll switch between your tenant's [Azure portal](https://portal.azure.com) and your Copilot Studio page.

### Step 1: Register an app in Azure portal
1.	Open your tenant's Azure portal, then go to **App registrations** > **New registration**.

    :::image type="content" source="media/sentinel-mcp/custom-azure-new-reg.png" alt-text="Screenshot of Azure portal with New registration option highlighted." lightbox="media/sentinel-mcp/custom-azure-new-reg.png":::

1.	On the **Register an application** page, enter a friendly user-facing **Name** for the app, then select **Register**.

    :::image type="content" source="media/sentinel-mcp/custom-azure-register.png" alt-text="Screenshot of the new application registration page in Azure portal." lightbox="media/sentinel-mcp/custom-azure-register.png":::
 
1.	On your newly registered app's page, go to **Manage** > **API permissions**, then select **Add a permission**.

    :::image type="content" source="media/sentinel-mcp/custom-azure-permissions.png" alt-text="Screenshot of the API permissions page and flyout panel in Azure portal." lightbox="media/sentinel-mcp/custom-azure-permissions.png":::
 
1.	On the flyout panel that appears, go to the **APIs my organization uses** tab and search for `Sentinel Platform Services`.

    :::image type="content" source="media/sentinel-mcp/custom-azure-api-reg.png" alt-text="Screenshot of the APIs my organization uses tab in the Request API permissions panel in Azure portal." lightbox="media/sentinel-mcp/custom-azure-api-reg.png":::

1.	Choose **SentinelPlatform.DelegatedAccess**, then select **Add permissions**.
 
     :::image type="content" source="media/sentinel-mcp/custom-azure-api-delegate.png" alt-text="Screenshot of the Request API permissions panel in Azure portal with permissions selected." lightbox="media/sentinel-mcp/custom-azure-api-delegate.png":::

1. Back on your app's page, go to **Manage** > **Certificates & secrets**, then select the **Client secrets** tab. 

1. Select **New client secret**. On the flyout panel that appears, add a **Description**, then select **Add**.

     :::image type="content" source="media/sentinel-mcp/custom-azure-secret.png" alt-text="Screenshot of the Certificates and secrets page in Azure portal." lightbox="media/sentinel-mcp/custom-azure-secret.png":::

    > [!TIP]
    > Create a single app for all Sentinel custom tools, but create separate client secrets for each custom collection you want to add to your agent.
 
    >[!IMPORTANT]
    > Once the client secret is added, copy and save its **Value**, which you use in the next steps.

1.	Go back to the Azure portal's **Overview** page and copy and save the following values for the next steps:
    - Application (client) ID
    - Directory (tenant) ID

     :::image type="content" source="media/sentinel-mcp/custom-azure-ids.png" alt-text="Screenshot of the Overview page in Azure portal." lightbox="media/sentinel-mcp/custom-azure-ids.png":::

### Step 2: Add your custom MCP tool to an agent

1.	Open Copilot Studio and select the agent where you want to add your custom tool. From the agent's **Overview** page, go to the **Tools** section and select **+ Add tool**.

1. On the pop-up window that appears, select **+ New tool**.

     :::image type="content" source="media/sentinel-mcp/custom-studio-add-tool.png" alt-text="Screenshot of Copilot Studio with the Add tool modal open." lightbox="media/sentinel-mcp/custom-studio-add-tool.png":::


1.	Select **Model Context Protocol** and add your custom tool collection’s details. Make sure that you add the following OAuth settings properly:
    - **Type:** Manual
    - **Client ID:** Use the **Application (client) ID** value you saved previously
    - **Client secret:** Use the secret value you saved previously
    - **Authorization URL:** Use the following format and replace `<tenant ID>` with the **Directory (tenant) ID** value you saved previously:
        ```
        https://login.microsoftonline.com/<tenant ID>/oauth2/v2.0/authorize
        ```
    - **Token URL template** and **Refresh URL:** Use the following format and replace `<tenant ID>` with the **Directory (tenant) ID** value you saved previously:
        ```
        https://login.microsoftonline.com/<tenant ID>/oauth2/v2.0/token
        ```
    - **Scope:** Use the following:         
        ```
        4500ebfb-89b6-4b14-a480-7f749797bfcd/.default
        ```

     :::image type="content" source="media/sentinel-mcp/custom-studio-mcp-details.png" alt-text="Screenshot of the MCP details in Copilot Studio Add tool setup." lightbox="media/sentinel-mcp/custom-studio-mcp-details.png":::
     
1. Select **Create**. Your tool is created successfully and a redirect URL is generated. Copy and save this URL and leave the pop-up window open for now.

     :::image type="content" source="media/sentinel-mcp/custom-studio-redirect.png" alt-text="Screenshot of the URL redirect details in Copilot Studio Add tool setup." lightbox="media/sentinel-mcp/custom-studio-redirect.png":::

### Step 3: Authenticate Copilot Studio to use your custom tool
 
1. Go back to your tenant's Azure portal and into the app you just added then select **Add a redirect URI**.
 
1. Select **+ Add a platform** > **Web**.

     :::image type="content" source="media/sentinel-mcp/custom-azure-add-platform.png" alt-text="Screenshot of the Authentication page in Azure portal." lightbox="media/sentinel-mcp/custom-azure-add-platform.png":::


1. In the **Redirect URIs** text box, add the redirect URL you copied then select **Configure**. 

1. Go back to the Copilot Studio pop-window window and select **Next**.


1. Select **Create new connection**. If the tool connects successfully, a green check mark appears beside the connection. 


     :::image type="content" source="media/sentinel-mcp/custom-studio-new-connection.png" alt-text="Screenshot of the connection details in Copilot Studio Add tool setup." lightbox="media/sentinel-mcp/custom-studio-new-connection.png":::

1.	Select **Add and configure**.

## Related content
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)