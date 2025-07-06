---  
title:  Run KQL queries against the Microsoft Sentinel data lake (preview).
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to query and interact with the Microsoft Sentinel data lake. Create, edit, and run KQL queries to explore your data lake resources.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 06/16/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 
#  Run KQL queries against the Microsoft Sentinel data lake (preview).
 
## Overview  

Microsoft Sentinel data lake is a next-generation, cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations. Data lake exploration in the Defender portal, provides a unified interface for analyzing your data lake, enabling you to run KQL (Kusto Query Language) queries, and create and manage jobs.

Data lake exploration is found in the left navigation panel of the Defender portal, under **Microsoft Sentinel**


## KQL Queries

The **KQL queries** page under **Data lake exploration** enables you to write and run KQL queries against your data lake resources. Use the query editor to explore and analyze historical data, investigate incidents, and gather forensic evidence. You can also create and schedule jobs to promote selected data from the lake tier to the analytics tier for advanced analytics. Using lake-based KQL queries helps security teams detect patterns, establish baselines, and identify unusual activities, supporting comprehensive investigations and effective threat response. 

The KQL query editor allows you to edit and run KQL queries against data lake resources. You can create jobs to promote data from the lake to the Analytics tier. Jobs can be run on-demand or scheduled. The **Jobs** page provides an interface to manage jobs, enabling, disabling, editing, or deleting jobs. For more information, see [Create jobs in the Microsoft Sentinel data lake (preview)](kql-jobs.md).

## Prerequisites

KQL queries can be run in the Microsoft Defender portal after the onboarding process is complete. For more information on onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

### Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. Alternatively you can grant access to individual workspaces using Azure RBAC roles. Users with Azure RBAC permissions to Microsoft Sentinel workspaces can run KQL queries against those workspaces in the lake tier. For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](https://aka.ms/sentinel-data-lake-roles).


## Writing KQL queries

Writing queries for the data lake is similar to writing queries in the advanced hunting experience. You can use the same KQL syntax and functions including. KQL supports machine learning functions and advanced analytics. For more information, see [Microsoft Sentinel data lake and machine learning](machine-learning.md). The query editor provides a powerful interface for writing and running KQL queries, with features such as IntelliSense and autocomplete to help you write your queries efficiently. For a detailed overview of KQL syntax and functions, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).


## KQL queries in the Defender portal

Select **New query** to create a new query tab. Your last query in each tab is saved. Switch between tabs to work on multiple queries simultaneously.   

:::image type="content" source="media/kql-queries/query-editor.png" alt-text="A screenshot showing the advanced hunting page in the Defender portal." lightbox="media/kql-queries/query-editor.png":::

### Select workspace

Queries are run against a single workspace. Choose your workspace in the upper right corner of the query editor using the **Selected workspace** dropdown. The workspace you select determines the data available for querying. The *default* workspace contains data from Microsoft Entra, Microsoft 365, and Microsoft Resource Graph.

> [!NOTE] 
> The selected workspace applies to all query tabs in the query editor.  


:::image type="content" source="media/kql-queries/select-a-workspace.png" lightbox="media/kql-queries/select-a-workspace.png" alt-text="A screenshot showing the workspace selection panel.":::



### Time range selection
Use the time picker above the query editor to select the time range for your query. Using the **Custom time range** option, you can set a specific start and end time. Time ranges can be up to 12 years in duration. You can also specify a time range in the KQL query syntax.

:::image type="content" source="media/kql-queries/time-range-selector.png" lightbox="media/kql-queries/time-range-selector.png" alt-text="A screenshot showing the timerange selector.":::


> [!NOTE]
> Queries are limited to 30,000 rows or 64 MB of data and timeout after 10 minutes. When selecting a broad time range, your query may exceed these limits.

### View schema information

The schema browser provides a list of available tables and their columns in the selected workspace. Use the schema browser to explore the data available in your data lake and discover tables and columns. Use the search box to quickly find specific tables.

:::image type="content" source="media/kql-queries/schema-browser.png" lightbox="media/kql-queries/schema-browser.png" alt-text="A screenshot showing the schema browser panel in the KQL editor.":::


### Result window

The result window displays the results of your query. You can view the results in a table format, and you can export the results to a CSV file using the **Export** button in the upper left corner of the result window. Toggle the visibility of empty columns using the **Show empty columns** button. The **Customize columns** button allows you to select which columns to display in the result window.

You can search the results using the search box in the upper right corner of the result window.

:::image type="content" source="media/kql-queries/results-window.png" lightbox="media/kql-queries/results-window.png" alt-text="A screenshot showing the results window in a KQL query editor.":::

## Jobs

Jobs are used to run KQL queries against the data in the lake tier and promote the results to the analytics tier. You can create one-time or scheduled jobs, and you can enable, disable, edit, or delete jobs from the **Jobs** page. To create a job based on your current query, select the **Create job** button. For more information on creating and managing jobs, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md).


## Azure Data Explorer

You can run KQL queries against the Microsoft Sentinel data lake using Azure Data Explorer (ADX). ADX provides a powerful query engine and advanced analytics capabilities. To connect to the lake using ADX, create a new connection using the following URI: `https://api.securityplatform.microsoft.com/lake/kql`

When querying tables in the data lake using ADX, you must use the `external_table()` function to access the data. For example:

```kql
external_table("microsoft.entra.id.AADRiskyUsers")
| take 100
```




## Sample KQL queries
 
For sample queries, see [KQL sample queries for the data lake](kql-samples.md). You can use these queries as a starting point and modify them to suit your requirements. For examples using machine learning, see [KQL and machine learning in the Microsoft Sentinel data lake](machine-learning.md)


## Query considerations and limitations

+ Queries are run against a single workspace. Make sure you select the correct workspace before running a query.
+ Executing KQL queries on the Microsoft Sentinel data lake incurs charges based on query billing meters. For more information, see [../billing.md#data-lake-tier].
+ Review data ingestion and table retention policy. Before setting query time range, be aware of data retention on your data lake tables and whether data is available for selected time range. For more information, see [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview) 
+ KQL queries against the data lake are lower performant than queries on analytics tier. It’s recommended to use KQL queries against the lake only when exploring historical data or when tables are stored in lake-only mode.

+ The following KQL control commands are currently supported: 
    + `.show version`
    + `.show databases`
    + `.show databases entities`
    + `.show database`

+ Using out of the box or custom functions isn't supported in KQL queries against the data lake.
+ Calling external data via KQL query against the data lake isn't supported. 
+ `Ingestion_time()` function isn't supported on tables in data lake.


[!INCLUDE [Service limits for KQL queries against the data lake](../includes/service-limits-kql-queries.md)]

For troubleshooting KQL queries, see [Troubleshoot KQL queries in the Microsoft Sentinel data lake](kql-troubleshooting.md).

## Related content

- [Microsoft Sentinel data lake overview (preview)](sentinel-lake-overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md)
- [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md)
- [Troubleshoot KQL queries in the Microsoft Sentinel data lake](kql-troubleshooting.md).