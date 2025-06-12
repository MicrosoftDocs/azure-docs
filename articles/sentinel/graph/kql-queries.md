---  
title: Data lake exploration - KQL queries (Preview).
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to query and interact with the Microsoft Sentinel data lake. Create, edit, and run KQL queries to explore your data lake resources.
author: EdB-MSFT  
ms.service: sentinel  
ms.topic: conceptual
ms.custom: sentinel-lake-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 
#  Data lake exploration - KQL queries (Preview).
 
## Overview  

Microsoft Sentinel data lake is a next-generation, cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations. Data lake exploration in the Defender portal, provides a unified interface for analyzing your data lake, enabling you to run KQL (Kusto Query Language) queries, and create and manage jobs.

Data lake exploration is found in the left navigation panel of the Defender portal, under **Microsoft Sentinel**


## KQL Queries

The **KQL queries** page under **Data lake exploration** enables you to write and run KQL queries against your data lake resources. Use the query editor to explore and analyze historical data, investigate incidents, and gather forensic evidence. You can also create and schedule jobs to promote selected data from the lake tier to the analytics tier for advanced analytics. Using lake-based KQL queries helps security teams detect patterns, establish baselines, and identify unusual activities, supporting comprehensive investigations and effective threat response. 

The KQL query editor allows you to edit and run KQL queries against data lake resources. You can create jobs to promote data from the lake to the Analytics tier. Jobs can be run on-demand or scheduled. The **Jobs** page provides an interface to manage jobs, enabling, disabling, editing, or deleting jobs. For more information, see [Create jobs in the Microsoft Sentinel data lake (Preview)](kql-jobs.md).

## Permissions
To access data lake KQL queries, you must have one of the following roles:
+ Global reader 
+ Security reader
+ Security operator 
+ Security administrator
+ Global administrator

For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](./roles-permissions.md).


## Writing KQL queries


Writing queries in the lake workbench is similar to writing queries in the advanced hunting experience. You can use the same KQL syntax and functions including. KQL supports machine learning functions and advanced analytics. For more infomation, see [Microsoft Sentinel data lake and machine learning](sentinel-data-lake-machine-learning.md). The query editor provides a powerful interface for writing and running KQL queries, with features such as IntelliSense and autocomplete to help you write your queries efficiently. For a detailed overview of KQL syntax and functions, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

Queries are run against a single workspace. Choose your workspace in the upper right corner of the query editor using the **Selected workspace** dropdown. The workspace you select determines the data available for querying. The *default* workspace contains data from Microsoft Entra, M365, and Microsoft Resource Graph. For more information these data assets see [Data assets in the data lake](data-assets.md). 


:::image type="content" source="media/kql-queries/query-editor.png" alt-text="A screenshot showing the advanced hunting page in the Defender portal." lightbox="media/kql-queries/query-editor.png":::

> [!NOTE] 
> The selected workspace applies to all query tabs in the query editor.


Select **New query** to create a new query tab. Your last query in each tab is saved. Switch between tabs to work on multiple queries simultaneously.   

### Time range selection
Use the time picker above the query editor to select the time range for your query. Using the **Custom time range** option, you can set a specific start and end time. Time ranges can be up to 30 days in duration.  You can't specify a time range in query syntax. 

### Schema browser

The schema browser provides a list of available tables and their columns in the selected workspace. Use the schema browser to explore the data available in your data lake and discover tables and columns.

### Result window
The result window displays the results of your query. You can view the results in a table format, and you can export the results to a CSV file using the **Export** button in the upper left corner of the result window. Toggle the visibility of empty columns using the **Show empty columns** button. The **Customize columns** button allows you to select which columns to display in the result window.


### Jobs

Jobs are used to run KQL queries against the data in the lake tier and promote the results to the analytics tier. You can create on-demand or scheduled jobs, and you can enable, disable, edit, or delete jobs from the **Jobs** page. For more information on creating and managing jobs, see [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md).


### Query limitations

When writing queries in the Lake workbench, the following limitations apply:

+ Query results are limited to 30,000 rows or 64 MB of data. 
+ Queries time out after 10 minutes. 


## Related content

- [Microsoft Sentinel data lake overview (Preview)](overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Create jobs in the Microsoft Sentinel data lake](kql-jobs.md)
- [Manage jobs in the Microsoft Sentinel data lake](manage-jobs.md)
