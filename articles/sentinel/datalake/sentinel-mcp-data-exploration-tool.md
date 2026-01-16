---
title: Data exploration tool collection in Microsoft Sentinel MCP server
titleSuffix: Microsoft Security  
description: Learn about the different tools available in the Data exploration collection in Microsoft Sentinel 
author: poliveria
ms.topic: how-to
ms.date: 12/12/2025
ms.author: pauloliveria
ms.service: microsoft-sentinel

#customer intent: As a security analyst, I want to know the different tools available to explore security data in Microsoft Sentinel data lake
---

# Explore Microsoft Sentinel data lake with data exploration collection

> [!IMPORTANT]
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

The data exploration tool collection in the Microsoft Sentinel Model Context Protocol (MCP) server lets you search for relevant tables and retrieve data from Microsoft Sentinel's data lake by using natural language. 

## Prerequisites

To access the data exploration tool collection, you need the following prerequisites:
- [Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- Any of the supported AI-powered code editors and agent-building platforms:
    - [Microsoft Security Copilot](sentinel-mcp-use-tool-security-copilot.md#add-a-microsoft-sentinel-tool-collection)
    - [Microsoft Copilot Studio](sentinel-mcp-use-tool-copilot-studio.md#add-a-microsoft-sentinel-tool-collection)
    - [Microsoft Foundry](sentinel-mcp-use-tool-azure-ai-foundry.md#add-a-microsoft-sentinel-tool-collection)
    - [Visual Studio Code](sentinel-mcp-use-tool-visual-studio-code.md) 

## Add the data exploration collection

To add the data exploration collection, first set up Microsoft Sentinel's unified MCP server interface. Follow the step-by-step instructions for compatible [AI-powered code editors and agent-building platforms](sentinel-mcp-get-started.md#add-microsoft-sentinels-collection-of-mcp-tools).

The data exploration collection is hosted at the following URL:
```
https://sentinel.microsoft.com/mcp/data-exploration
```

## Tools in the data exploration collection

### Semantic search on table catalog (`search_tables`)
This tool discovers data lake tables relevant to a given natural language input and returns schema definitions to support query authoring. Use this tool to discover tables, understand a schema, or build valid Kusto Query Language (KQL) queries for a Microsoft Sentinel workspace. You can also use it to explore unfamiliar data sources or identify relevant tables for a specific investigative or analytical task. 

For a full list of tables in this index, see [Azure Monitor Log Analytics log tables organized by category](/azure/azure-monitor/reference/tables-category).


| Parameters | Required? | Description | 
|----------|----------|----------|
| `query`| Yes |This parameter takes in keywords to search for relevant tables in the connected workspaces. |
| `workspaceId`| No |This parameter takes in a workspace identifier to limit the search to a single connected Microsoft Sentinel data lake workspace. |

### Execute KQL (Kusto Query Language) query on Microsoft Sentinel data lake (`query_lake`)
This tool runs a single KQL query against a specified Microsoft Sentinel data lake workspace and returns the raw result set. It's designed for focused investigative or analytical retrieval and not bulk export. Use this tool to advance an investigation or analytical workflow and retrieve a security event, alert, asset, identity, device, or enrichment data. You can also use it alongside the `search_tables` tool to identify relevant table schemas and build valid KQL queries.

| Parameters | Required? | Description | 
|----------|----------|----------|
| `query`| Yes |This parameter takes in a well-formed KQL query to retrieve data from a Microsoft Sentinel data lake workspace. |
| `workspaceId`| No |This parameter takes in a workspace identifier to limit the search to a single connected Microsoft Sentinel data lake workspace. |

 
### List workspaces (`list_sentinel_workspaces`)
This tool lists all Microsoft Sentinel data lake workspace name and ID pairs available to you. Including the workspace name provides you with helpful context to understand which workspace is being used. Run this tool before using any other Microsoft Sentinel tools because those tools need a workspace ID argument to function properly.


### Entity analyzer (preview)

These tools use AI to analyze your organization's data in the Microsoft Sentinel data lake. They provide a verdict and detailed insights on URLs, domains, and user entities. They help eliminate the need for manual data collection and complex integrations typically required for enriching and investigating entities.

For example, `analyze_user_entity` reasons over the user's authentication patterns, behavioral anomalies, activity within your organization, and more to provide a verdict and analysis. Meanwhile, `analyze_url_entity` reasons over threat intelligence from Microsoft, your custom threat intelligence in Microsoft Sentinel threat intelligence platform (TIP), click, email, or connection activity on the URL within your organization, and presence in Microsoft Sentinel watchlists, among others to similarly provide a verdict and analysis.

Entity analysis tools might require a few minutes to generate results, so there are tools to start analysis for each entity and another one that polls for the analysis results.

#### Start analysis (`analyze_user_entity` and `analyze_url_entity`)

| Parameters | Required? | Description | 
|----------|----------|----------|
| Microsoft Entra object ID or URL| Yes |This parameter takes in the user or URL you want to analyze. |
| `startTime`| Yes |This parameter takes in the start time of the analysis window.  |
| `endTime`| Yes |This parameter takes in the end time of the analysis window.  |
| `workspaceId`| No |This parameter takes in a workspace identifier to limit the search to a single connected Microsoft Sentinel data lake workspace. |

These tools return an identifier value that you can provide to the retrieve analysis tool as input.

#### Retrieve analysis (`get_entity_analysis`)

| Parameters | Required? | Description | 
|----------|----------|----------|
| `analysisId`| Yes |This parameter takes in the job identifier received from the start analysis tools. |

While this tool automatically polls for a few minutes until results are ready, its internal timeout might not be sufficient for long analysis operations. You might need to run it multiple times to get results.

>[!NOTE]
> It might be beneficial to include a prompt such as `render the results as returned exactly from the tool`, which helps ensure that the response from the analyzer is provided without additional processing by the MCP client.

#### Additional information
- `analyze_user_entity` supports a maximum time window of seven days to maximize accuracy of the results. 
- `analyze_user_entity` requires the following tables to be present in the data lake to ensure accuracy of the analysis:
    - [AlertEvidence](../connect-microsoft-365-defender.md)
    - [SigninLogs](../connect-azure-active-directory.md)
    - [BehaviorAnalytics](../enable-entity-behavior-analytics.md)
    - [CloudAppEvents](../connect-microsoft-365-defender.md)
    - [IdentityInfo](/defender-xdr/advanced-hunting-identityinfo-table) (Available only for tenants with Microsoft Defender for Identity, Microsoft Defender for Cloud Apps, or Microsoft Defender for Endpoint P2 licensing)

    If you don't have any of these required tables, `analyze_user_entity` generates an error message that lists the tables you didn't onboard, along with links to their corresponding onboarding documentation.

- `analyze_user_entity` works best when the following table is also present in the data lake, but continues to work and assess risk, even if the said table is unavailable:
    - [AADNonInteractiveUserSignInLogs](../connect-azure-active-directory.md)

- `analyze_url_entity` works best when the following tables are present in the data lake, but continues to work and assess risk, even if the said tables are unavailable:
    - [EmailUrlInfo](../connect-microsoft-365-defender.md)
    - [UrlClickEvents](../connect-microsoft-365-defender.md)
    - [ThreatIntelIndicators](../work-with-threat-indicators.md)
    - [Watchlist](../watchlists-create.md)
    - [DeviceNetworkEvents](../connect-microsoft-365-defender.md)

    If you don't have any of these tables, `analyze_url_entity` generates a response with a disclaimer that lists the tables you didn't onboard, along with links to their corresponding onboarding documentation.

- Running multiple instances of the entity analyzer at the same time can increase latency for each run. To prevent timeouts, start by running a maximum of five analyses at once and then adjust this number as needed based on how the analyzer runs in your organization.

## Sample prompts

The following sample prompts demonstrate what you can do with the data exploration collection:
- Find the top three users that are at risk and explain why they're at risk.
- Find sign-in failures in the last 24 hours and give me a brief summary of key findings.
- Identify devices that showed an outstanding number of outgoing network connections.
- Help me understand if the user <user object ID\> is compromised.
- Investigate users with a password spray alert in the last seven days and tell me if any of them are compromised.
- Find all the URL IOCs from <threat analytics report\> and analyze them to tell me everything Microsoft knows about them.


## How Microsoft Sentinel MCP tools work alongside your agent

Let's take a deeper look into how an agent answers a prompt by dynamically orchestrating over the tools.

**Sample prompt:** `Find the top three users that are at risk and explain why they're at risk.` 

**Typical response (GitHub Copilot using Claude Sonnet 4):**

:::image type="content" source="media/sentinel-mcp/mcp-tool-github-response.png" alt-text="Screenshot of a GitHub Copilot response." lightbox="media/sentinel-mcp/mcp-tool-github-response.png"::: 

**Explanation:**
- When the agent receives the prompt, it searches for relevant tables that contain user risk and security information. It starts by deconstructing the prompt into search keywords to find the tables.

    From the sample prompt, its search identifies four relevant tables from the scope of tables that the user has access to:
     - `AADNonInteractiveUserSignInLogs` - Non-interactive Microsoft Entra ID sign-in events
     - `BehaviorAnalytics` - User and Entity Behavior Analytics (UEBA) data
     - `SigninLogs` - Interactive Microsoft Entra ID sign-in events
     - `AADUserRiskEvents` - Identity protection risk detections
 
     :::image type="content" source="media/sentinel-mcp/mcp-tool-search-table.png" alt-text="Screenshot of the agent searching for relevant tables that contain user risk and security information." lightbox="media/sentinel-mcp/mcp-tool-search-table.png"::: 

- The agent does another search by using the **Semantic search on table catalog** (`search_tables`) tool, this time with broader terms, to find other tables that it should query data from to influence its reasoning.

    :::image type="content" source="media/sentinel-mcp/mcp-tool-semantic-search.png" alt-text="Screenshot of the agent searching using broader terms." lightbox="media/sentinel-mcp/mcp-tool-semantic-search.png"::: 
 
- The agent identifies the relevant tables and then uses the **Execute KQL (Kusto Query Language) query on Microsoft Sentinel data lake** (`query_lake`) tool to query for data and find the top three users at risk. The first attempt fails because the KQL query has a semantic error.

     :::image type="content" source="media/sentinel-mcp/mcp-tool-run-kql.png" alt-text="Screenshot of the agent attempting to run a KQL query with a semantic error." lightbox="media/sentinel-mcp/mcp-tool-run-kql.png":::

- The agent corrects the KQL query by itself and successfully retrieves data from Microsoft Sentinel data lake, finding the risky users.

     :::image type="content" source="media/sentinel-mcp/mcp-tool-run-correct-kql.png" alt-text="Screenshot of the agent attempting running a corrected KQL query." lightbox="media/sentinel-mcp/mcp-tool-run-correct-kql.png"::: 

- The agent runs one more query to get detailed information about the risky users to provide better context on why they're at risk.

    :::image type="content" source="media/sentinel-mcp/mcp-tool-risky-users.png" alt-text="Screenshot of the agent running another query to get detailed user information." lightbox="media/sentinel-mcp/mcp-tool-risky-users.png"::: 

- The agent responds back to the user with its comprehensive analysis.



## Related content
- [What is Microsoft Sentinel's support for Model Context Protocol (MCP)?](sentinel-mcp-overview.md) 
- [Get started with Microsoft Sentinel MCP server](sentinel-mcp-get-started.md)