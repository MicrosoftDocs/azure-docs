---
title: Create and use custom Microsoft Sentinel MCP tools
titleSuffix: Microsoft Security  
description: Learn how to set up and use custom Microsoft Sentinel Model Context Protocol (MCP) tools using saved KQL queries in advanced hunting 
author: poliveria
ms.topic: get-started
ms.date: 11/24/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to create a custom Microsoft Sentinel Model Context Protocol (MCP) tool using saved KQL queries in advanced hunting so I can have granular control over the data accessible to my AI agents.
---

# Create and use custom Microsoft Sentinel MCP tools (preview)

> [!IMPORTANT]
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

Security agents built with Microsoft Sentinel's collection of Model Context Protocol (MCP) tools can effectively reason over data in Microsoft Sentinel. You can create custom Sentinel MCP tools to have granular control over the data accessible to your security agents and create deterministic agentic workflows. 

This article shows how you can enable agents to retrieve and reason over knowledge from your library of saved Kusto Query Language (KQL) queries in [advanced hunting](/defender-xdr/advanced-hunting-microsoft-defender?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) and Sentinel data lake by creating custom MCP tools. 

## Prerequisites
To create custom Microsoft Sentinel MCP tools, you need the following prerequisites:
- Microsoft Sentinel data lake and Microsoft Defender licenses
- **Security Operator**, **Security Admin**, or **Global Admin** role to create, update, or delete custom tools
- **Security reader** or **Global reader** role to list and invoke custom tools

## Create custom tools with KQL queries

Use advanced hunting queries in Microsoft Defender portal and KQL queries in Microsoft Sentinel data lake to find and discover security data that you can use in agentic workflows. This approach lets you control the type and amount of information your agents can reason over. When you verify that a query retrieves the data you want your agent to reason with, save it as a custom MCP tool.

To save a KQL query as an MCP tool, follow these steps:

1. In the **Advanced hunting** page in Microsoft Defender, find and discover from your manually authored KQL queries or from your library of saved queries the security data you want to use in your agentic flows, then open it in the query window.
1. Select **Save as tool** from any of the following Defender portal experiences:
    - Context menu of a query

        :::image type="content" source="media/sentinel-mcp/custom-tool-save-context-menu.png" alt-text="Screenshot of the Save as tool option in the context menu of a KQL query." lightbox="media/sentinel-mcp/custom-tool-save-context-menu.png":::

    - KQL query box menu of a query
        
        :::image type="content" source="media/sentinel-mcp/custom-tool-save-kql-box.png" alt-text="Screenshot of the Save as tool option in a KQL query box." lightbox="media/sentinel-mcp/custom-tool-save-kql-box.png":::

1. In the **Save tool** flyout panel that appears, enter the following details:
    - **Name:** A discoverable name for your tool that helps AI models correctly identify and select the tool for specific tasks.
   - **Description:** The description of the tool. For more information, see [Best practices for creating tool descriptions](#best-practices-for-creating-tool-descriptions).
   - **Collection:** Choose whether you want to add the tool an existing tool collection or create a new one by selecting **Create new collection**. 

    - **Default workspace:** The default workspace you want your agent to use as a hint whenever a prompt doesn't specify any workspaces. 
    - **Parameters (optional):** The customizable inputs the tool supports. You can convert some of the values in your KQL query into parameters following the `{ParamaterName}` format, then add their **Parameter name** and **Description** so that the agent has a good understanding on how to populate them based on available conversation context.

    :::image type="content" source="media/sentinel-mcp/custom-tool-save-panel.png" alt-text="Screenshot of the MCP custom tool flyout panel in advanced hunting." lightbox="media/sentinel-mcp/custom-tool-save-panel.png":::

    :::image type="content" source="media/sentinel-mcp/custom-tool-parameters.png" alt-text="Screenshot of a KQL query with certain values converted into parameters." lightbox="media/sentinel-mcp/custom-tool-parameters.png":::

1. Select **Save**.

### View saved custom MCP tools

To view the custom MCP tools you saved from advanced hunting queries, go to the **Tools** tab in the **Advanced hunting** page.

### Best practices for creating tool descriptions

When saving your custom tool, its name and, more importantly, its description are crucial for identifying and selecting it for specific tasks. The following best practices and considerations can help when describing your tool:

- **Keep it short and action-oriented.** Use one to two sentences that start with a clear verb and resource (for example, "Retrieves audit log data for a specific user"). Avoid jargon or overly technical phrasing.

- **Focus on purpose, not parameters.** Describe what the tool does and its primary use case. Leave parameter details to the schema, not the description.

- **Include workflow hints only if critical.** If a tool requires a prerequisite step (for example, "Call `risky_users_tool` first"), mention it briefly to prevent misuse.

- **Optimize for discoverability and clarity.**
Use consistent naming, avoid ambiguous terms, and ensure descriptions help AI models and users quickly select the right tool.

## Use custom tools in custom agents and coding platforms

For more information on how to use your custom tool collection in your security agents, see the articles for the following AI-powered code editors and agent-building platforms:
- [Microsoft Security Copilot](sentinel-mcp-use-tool-security-copilot.md#add-a-custom-tool-collection)
- [Microsoft Copilot Studio](sentinel-mcp-use-tool-copilot-studio.md#add-a-custom-tool-collection)
- [Microsoft Foundry](sentinel-mcp-use-tool-azure-ai-foundry.md#add-a-custom-tool-collection)
- [Visual Studio Code](sentinel-mcp-use-tool-visual-studio-code.md)



## Related content
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)
- [Tool collection in Microsoft Sentinel MCP server](sentinel-mcp-tools-overview.md)