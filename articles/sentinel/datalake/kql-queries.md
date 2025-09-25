---  
title:  Run KQL queries against the Microsoft Sentinel data lake (preview)
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to query and interact with the Microsoft Sentinel data lake. Create, edit, and run KQL queries to explore your data lake resources
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 07/15/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 
#  Run KQL queries against the Microsoft Sentinel data lake (preview)
 
Data lake exploration in the Defender portal provides a unified interface to analyze your data lake. It lets you run KQL (Kusto Query Language) queries, create jobs, and manage them.

The **KQL queries** page under **Data lake exploration** lets you edit and run KQL queries on data lake resources. Create jobs to promote data from the data lake to the analytics tier. Run jobs on demand or schedule them. The **Jobs** page lets you manage jobs. Enable, disable, edit, or delete jobs. For more information, see [Create jobs in the Microsoft Sentinel data lake (preview)](kql-jobs.md).

## Prerequisites

The following prerequisites are needed to run KQL queries in the Microsoft Sentinel data lake.

### Onboard to the data lake

You can run KQL queries in the Microsoft Defender portal after completing the onboarding process. For more information on onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

### Permissions

Microsoft Entra ID roles let you access all workspaces in the data lake. Alternatively, you can grant access to individual workspaces using Azure RBAC roles. Users with Azure RBAC permissions for Microsoft Sentinel workspaces can run KQL queries against those workspaces in the data lake tier. For more information on roles and permissions, see [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).


## Write KQL queries

Writing queries for the data lake is similar to writing queries in the advanced hunting experience. You can use the same KQL syntax and functions. KQL supports advanced analytics and machine learning functions. The query editor offers an interface for running KQL queries with features like IntelliSense and autocomplete to help you write efficiently. For a detailed overview of KQL syntax and functions, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).


## KQL queries in the Defender portal

Select **New query** to create a new query tab. The last query in each tab is saved. Switch between tabs to work on multiple queries simultaneously.   

:::image type="content" source="media/kql-queries/query-editor.png" alt-text="Screenshot of the advanced hunting page in the Defender portal." lightbox="media/kql-queries/query-editor.png":::

### Select a workspace

Queries run against a single workspace. Select a workspace in the upper right corner of the query editor using the **Selected workspace** dropdown. The workspace you select determines the data available for querying. The **default** workspace contains data from Microsoft Entra, Microsoft 365, and Microsoft Resource Graph.

> [!NOTE] 
> The selected workspace applies to all query tabs in the query editor.  


:::image type="content" source="media/kql-queries/select-a-workspace.png" lightbox="media/kql-queries/select-a-workspace.png" alt-text="A screenshot showing the workspace selection panel.":::



### Time range selection
Use the time picker above the query editor to select the time range for your query. Using the **Custom time range** option, you can set a specific start and end time. Time ranges can be up to 12 years in duration. You can also specify a time range in the KQL query syntax.

:::image type="content" source="media/kql-queries/time-range-selector.png" lightbox="media/kql-queries/time-range-selector.png" alt-text="A screenshot showing the timerange selector.":::


> [!NOTE]
> Queries are limited to 500,000 rows or 64 MB of data and timeout after 8 minutes. When selecting a broad time range, your query may exceed these limits.

### View schema information

The schema browser provides a list of available tables and their columns in the selected workspace. Use the schema browser to explore the data available in your data lake and discover tables and columns. Use the search box to quickly find specific tables.

:::image type="content" source="media/kql-queries/schema-browser.png" lightbox="media/kql-queries/schema-browser.png" alt-text="A screenshot showing the schema browser panel in the KQL editor.":::


### Result window

The result window displays the results of your query. You can view the results in a table format, and you can export the results to a CSV file using the **Export** button in the upper left corner of the result window. Toggle the visibility of empty columns using the **Show empty columns** button. The **Customize columns** button allows you to select which columns to display in the result window.

You can search the results using the search box in the upper right corner of the result window.

:::image type="content" source="media/kql-queries/results-window.png" lightbox="media/kql-queries/results-window.png" alt-text="A screenshot showing the results window in a KQL query editor.":::

## Jobs

Jobs are used to run KQL queries against the data in the data lake tier and promote the results to the analytics tier. You can create one-time or scheduled jobs, and you can enable, disable, edit, or delete jobs from the **Jobs** page. To create a job based on your current query, select the **Create job** button. For more information on creating and managing jobs, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md).


## Azure Data Explorer

You can run KQL queries against the Microsoft Sentinel data lake using Azure Data Explorer (ADX). ADX provides a powerful query engine and advanced analytics capabilities. To connect to the data lake using ADX, create a new connection using the following URI: `https://api.securityplatform.microsoft.com/lake/kql`

When querying tables in the data lake using ADX, you must use the `external_table()` function to access the data. For example:

```kql
external_table("microsoft.entra.id.AADRiskyUsers")
| take 100
```

## Query considerations and limitations

+ Queries are run against a single workspace. Make sure you select the correct workspace before running a query.
+ Executing KQL queries on the Microsoft Sentinel data lake incurs charges based on query billing meters. For more information, see [Plan costs and understand Microsoft Sentinel pricing and billing](../billing.md#data-lake-tier).
+ Review data ingestion and table retention policy. Before setting query time range, be aware of data retention on your data lake tables and whether data is available for selected time range. For more information, see [Manage data tiers and retention in Microsoft Defender portal (preview)](https://aka.ms/manage-data-defender-portal-overview).
+ KQL queries against the data lake are lower performant than queries on analytics tier. It’s recommended to use KQL queries against the data lake only when exploring historical data or when tables are stored in data lake-only mode.

+ The following KQL control commands are currently supported: 
    + `.show version`
    + `.show databases`
    + `.show databases entities`
    + `.show database`

+ Using out of the box or custom functions isn't supported in KQL queries against the data lake.

+ Calling external data via KQL query against the data lake isn't supported. 

+ All KQL operators and functions are supported except for the following:
    + `adx()`
    + `externaldata()`
    + `arg()`
    + `ingestion_time()`
    + `workspace()`


[!INCLUDE [Service limits for KQL queries against the data lake](../includes/service-limits-kql-queries.md)]


For troubleshooting KQL queries, see [Troubleshoot KQL queries in the Microsoft Sentinel data lake](kql-troubleshoot.md).

## Related content

- [Microsoft Sentinel data lake overview (preview)](sentinel-lake-overview.md)
- [Onboarding to Microsoft Sentinel data lake (preview)](sentinel-lake-onboarding.md)
- [Create jobs in the Microsoft Sentinel data lake (preview)](kql-jobs.md)
- [Manage jobs in the Microsoft Sentinel data lake (preview)](kql-manage-jobs.md)
- [Troubleshoot KQL queries in the Microsoft Sentinel data lake (preview)](kql-troubleshoot.md).