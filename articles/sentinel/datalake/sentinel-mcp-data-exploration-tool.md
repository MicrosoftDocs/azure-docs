---
title: Data exploration tool collection in Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn about the different tools available in the Data exploration collection in Microsoft Sentinel 
author: poliveria
ms.topic: how-to
ms.date: 09/30/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to know the different tools available to explore security data in Microsoft Sentinel data lake
---

# Explore Microsoft Sentinel data lake with data exploration collection (preview)

> [!IMPORTANT]
> Microsoft Sentinel MCP server is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

The data exploration tool collection in the Microsoft Sentinel Model Context Protocol (MCP) server lets you search for relevant tables and retrieve data from Microsoft Sentinel's data lake using natural language. 

## Prerequisites

To access the data exploration tool collection, you must have the following prerequisites:
- [Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- Visual Studio Code (latest version)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension

## Add the data exploration collection

To add the data exploration collection, you must first set up add Microsoft Sentinel's unified MCP server interface. Follow the step-by-step instructions for the following [AI-powered code editors and agent-building platforms](sentinel-mcp-get-started.md#add-microsoft-sentinels-collection-of-mcp-tools):
- Visual Studio Code
- Microsoft Security Copilot

The data exploration collection is hosted in the following URL:
- `https://sentinel.microsoft.com/mcp/data-exploration`

## Tools in the data exploration collection

### Semantic search on table catalog (`search_tables`)
This tool discovers data lake tables relevant to a given natural language input and returns schema definitions to support query authoring. You can use this tool to discover tables or understand a schema, or build valid Kusto Query Language (KQL) queries for a Microsoft Sentinel workspace. You can also use it to explore unfamiliar data sources or identify relevant tables for a specific investigative or analytical task. 

For a full list of tables in this index, see [Azure Monitor Log Analytics log tables organized by category](/azure/azure-monitor/reference/tables-category).


| Parameters | Required? | Description | 
|----------|----------|----------|
| query| Yes |This parameter takes in keywords to search for relevant tables in the connected workspaces. |
| workspaceId| No |This parameter takes in a workspace identifier to limit the search to a single connected Microsoft Sentinel data lake workspace. |

### Execute KQL (Kusto Query Language) query on Microsoft Sentinel data lake (`query_lake`)
This tool runs a single KQL query against a specified Microsoft Sentinel data lake workspace and returns the raw result set. It's designed for focused investigative or analytical retrieval and not bulk export. You can use this tool to advance an investigation or analytical workflow and retrieve a security event, alert, asset, identity, device, or enrichment data. You can also use it alongside the `search_tables` tool to identify relevant table schemas and build valid KQL queries.

| Parameters | Required? | Description | 
|----------|----------|----------|
| query| Yes |This parameter takes in a well-formed KQL query to retrieve data from a Microsoft Sentinel data lake workspace. |
| workspaceId| No |This parameter takes in a workspace identifier to limit the search to a single connected Microsoft Sentinel data lake workspace. |

 
### List workspaces (`list_sentinel_workspaces`)
This tool lists all Microsoft Sentinel data lake workspace name and ID pairs available to you. Including the workspace name provides you with helpful context to understand which workspace is being used. You can run this tool before using any other Microsoft Sentinel tools because those tools have a workspace ID argument to function properly.

## Sample prompts

The following sample prompts demonstrate what you can do with the data exploration collection:
- Find the top three users that are at risk and explain why they are at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.

## How Microsoft Sentinel MCP tools work alongside your agent

Let's take a deeper look into how an agent answers a prompt by dynamically orchestrating over our tools.

**Sample prompt:** `Find the top three users that are at risk and explain why they are at risk.` 

**Typical response (GitHub Copilot using Claude Sonnet 4):**

:::image type="content" source="media/sentinel-mcp/mcp-tool-github-response.png" alt-text="Screenshot of a GitHub Copilot response." lightbox="media/sentinel-mcp/mcp-tool-github-response.png"::: 

**Explanation:**
- When the agent receives the prompt, it searches for relevant tables that would contain user risk and security information. It starts by deconstructing the prompt into search keywords to find the tables.

    From the sample prompt, its search identified four relevant tables from the scope of tables that the user has access to:
     - `AADNonInteractiveUserSignInLogs` - Non-interactive Microsoft Entra ID sign-in events
     - `BehaviorAnalytics` - User and Entity Behavior Analytics (UEBA) data
     - `SigninLogs` - Interactive Microsoft Entra ID sign-in events
     - `AADUserRiskEvents` - Identity protection risk detections
 
     :::image type="content" source="media/sentinel-mcp/mcp-tool-search-table.png" alt-text="Screenshot of the agent searching for relevant tables that contain user risk and security information." lightbox="media/sentinel-mcp/mcp-tool-search-table.png"::: 

- The agent does another search using the **Semantic search on table catalog** (`search_tables`) tool, this time with broader terms, to find other tables that it should query data from to influence its reasoning.

    :::image type="content" source="media/sentinel-mcp/mcp-tool-semantic-search.png" alt-text="Screenshot of the agent searching using broader terms." lightbox="media/sentinel-mcp/mcp-tool-semantic-search.png"::: 
 
- The agent identifies the relevant tables and then uses the **Execute KQL (Kusto Query Language) query on Microsoft Sentinel data lake** (`query_lake`) tool to query for data and find the top three users at risk. The first attempt fails because the KQL query had a semantic error.

     :::image type="content" source="media/sentinel-mcp/mcp-tool-run-kql.png" alt-text="Screenshot of the agent attempting to run a KQL query with a semantic error." lightbox="media/sentinel-mcp/mcp-tool-run-kql.png":::

- The agent corrects the KQL query by itself and successfully retrieves data from Microsoft Sentinel data lake, finding the risky users.

     :::image type="content" source="media/sentinel-mcp/mcp-tool-run-correct-kql.png" alt-text="Screenshot of the agent attempting running a corrected KQL query." lightbox="media/sentinel-mcp/mcp-tool-run-correct-kql.png"::: 

- The agent runs one more query to get detailed information about the risky users to provide better context on why they'are at risk.

    :::image type="content" source="media/sentinel-mcp/mcp-tool-risky-users.png" alt-text="Screenshot of the agent running another query to get detailed user information." lightbox="media/sentinel-mcp/mcp-tool-risky-users.png"::: 

- The agent responds back to the user with its comprehensive analysis.



## Related content
- [What is Microsoft Sentinel's support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)