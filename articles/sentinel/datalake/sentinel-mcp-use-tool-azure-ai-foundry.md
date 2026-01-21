---
title: Use a Microsoft Sentinel MCP tool in Microsoft Foundry 
titleSuffix: Microsoft Security  
description: Learn how to use Microsoft Sentinel's Model Context Protocol (MCP) collection of security tools or your own custom tool in Microsoft Foundry 
author: poliveria
ms.topic: how-to
ms.date: 01/21/2026
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to add Sentinel MCP tools in Microsoft Foundry.
---

# Use an MCP tool in Microsoft Foundry (preview)

> [!IMPORTANT]
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

This article shows you how to add Microsoft Sentinel's Model Context Protocol (MCP) [collection of security tools](sentinel-mcp-tools-overview.md#available-collections) or your own custom tools to your AI agents in [Microsoft Foundry](/azure/ai-foundry/what-is-azure-ai-foundry). 

For information about how to get started with MCP tools, see the following articles:
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Create and use custom Microsoft Sentinel MCP tools](sentinel-mcp-create-custom-tool.md)

## Add a Microsoft Sentinel tool collection

To add a Microsoft Sentinel tool collection in Microsoft Foundry, follow these steps:

1. Go to [Microsoft Foundry's agent builder](https://go.microsoft.com/fwlink/?linkid=2340185) then select **Build** > **Agent**.

     :::image type="content" source="media/sentinel-mcp/get-started-foundry-build-agent.png" alt-text="Screenshot of Microsoft Foundry agent builder page with the build agent option highlighted." lightbox="media/sentinel-mcp/get-started-foundry-build-agent.png":::   

1. Enter a name for your agent.

     :::image type="content" source="media/sentinel-mcp/get-started-foundry-create-agent.png" alt-text="Screenshot of the Create new agent pop-up window in Microsoft Foundry agent builder page." lightbox="media/sentinel-mcp/get-started-foundry-create-agent.png":::   

1. On the **Tools** panel, select **Add a new tool** to ground your agent instructions with relevant security data from Microsoft Sentinel. 

     :::image type="content" source="media/sentinel-mcp/get-started-foundry-add-tool.png" alt-text="Screenshot of an agent's page in Microsoft Foundry with add tool option highlighted." lightbox="media/sentinel-mcp/get-started-foundry-add-tool.png":::   

1. On the **Select a tool** pop-up window, search for `Sentinel` and choose any [available collection](sentinel-mcp-tools-overview.md) (for example, `Microsoft Sentinel – Data exploration`).

     :::image type="content" source="media/sentinel-mcp/get-started-foundry-select-tool.png" alt-text="Screenshot of the Select a tool pop-up window in Microsoft Foundry agent builder page with a Sentinel tool collection highlighted." lightbox="media/sentinel-mcp/get-started-foundry-select-tool.png":::   


1. Select **Connect**.

Your agent is now connected with Sentinel's available collection of tools. You can start prompting your agent and use the tools to deliver outcomes.


## Add a custom tool collection

Custom tools let you build deterministic workflows by prescribing exactly what data agents can reason over. To add your custom tool collection in Microsoft Foundry, follow these steps:

### Step 1: Register an app in Azure portal
1.	Open your tenant's [Azure portal](https://portal.azure.com) then go to **App registrations** > **New registration**.

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

### Step 2: Add your custom MCP tool

1. Go to Microsoft Foundry and select an existing agent or a newly created agent. 

1. On the agent's page, go to the **Tools** section then select **Add** > **+ Add a new tool**.
 
      :::image type="content" source="media/sentinel-mcp/custom-foundry-add-tool.png" alt-text="Screenshot of an agent's page in Microsoft Foundry with Add a new tool highlighted." lightbox="media/sentinel-mcp/custom-foundry-add-tool.png":::

1.	On the pop-up window that appears, select **Custom** > **Model Context Protocol (MCP)** then select **Create**.
 
       :::image type="content" source="media/sentinel-mcp/custom-foundry-mcp.png" alt-text="Screenshot of the add tool setup in Microsoft Foundry." lightbox="media/sentinel-mcp/custom-foundry-mcp.png":::

1. Add the following values:
    - **Name:** Enter a friendly name for your tool
    - **Remote MCP server endpoint:** Paste the endpoint you copied from your custom tool collection
    - **Authentication:** OAuth Identity Passthrough
    - **Client ID:** Use the **Application (client) ID** value you saved previously
    - **Client secret:** Use the secret value you saved previously
    - **Token URL** and **Refresh URL:** Use the following format and replace `<tenant ID>` with the **Directory (tenant) ID** value you saved previously:
        ```
        https://login.microsoftonline.com/<tenant ID>/oauth2/v2.0/token
        ```
    - **Authorization URL:** Use the following format and replace `<tenant ID>` with the **Directory (tenant) ID** value you saved previously:
        ```
        https://login.microsoftonline.com/<tenant ID>/oauth2/v2.0/authorize
        ```
    - **Scope:** Use the following:         
        ```
        4500ebfb-89b6-4b14-a480-7f749797bfcd/.default
        ```
       
    :::image type="content" source="media/sentinel-mcp/custom-foundry-mcp-details.png" alt-text="Screenshot of the MCP details in add tool setup in Microsoft Foundry." lightbox="media/sentinel-mcp/custom-foundry-mcp-details.png":::
 
1. Select **Connect**. Your tool is created successfully and a redirect URL is generated. Copy and save this URL.

    :::image type="content" source="media/sentinel-mcp/custom-foundry-redirect.png" alt-text="Screenshot of the credential provider or redirect URL details in add tool setup in Microsoft Foundry." lightbox="media/sentinel-mcp/custom-foundry-redirect.png":::

### Step 3: Authenticate Microsoft Foundry to use your custom tool
 
1. Go back to your tenant's Azure portal and into the app you just added then select **Add a redirect URI**.
 
1. Select **+ Add a platform** > **Web**.

     :::image type="content" source="media/sentinel-mcp/custom-azure-add-platform.png" alt-text="Screenshot of the Authentication page in Azure portal." lightbox="media/sentinel-mcp/custom-azure-add-platform.png":::


1. In the **Redirect URIs** text box, add the redirect URL you copied then select **Configure**. 

1. Go back to Microsoft Foundry and use a prompt that matches the tool you created. On your first attempt, select **Open consent** to give consent to your signed in user account.

     :::image type="content" source="media/sentinel-mcp/custom-foundry-open-consent.png" alt-text="Screenshot of chat details in Microsoft Foundry with Open consent window highlighted." lightbox="media/sentinel-mcp/custom-foundry-open-consent.png":::

1. On the pop-up window that appears, select **Allow access**. 

Once you give consent, your agent can reason over data returned by your custom MCP tool.

:::image type="content" source="media/sentinel-mcp/custom-foundry-prompt-result.png" alt-text="Screenshot of chat details in Microsoft Foundry that uses a custom tool." lightbox="media/sentinel-mcp/custom-foundry-prompt-result.png":::

## Related content
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)