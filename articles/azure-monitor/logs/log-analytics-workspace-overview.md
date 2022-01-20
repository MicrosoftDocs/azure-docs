---
title: Log Analytics workspace overview
description: Overview of Log Analytics workspace which store data for Azure Monitor Logs.
ms.topic: conceptual
ms.tgt_pltfrm: na
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Log Analytics workspace overview


## Log Analytics workspaces
A Log Analytics workspace


Azure Monitor Logs stores the data that it collects in one or more [Log Analytics workspaces](./design-logs-deployment.md). A workspace defines:

- The geographic location of the data.
- Access rights that define which users can access data.
- Configuration settings such as the pricing tier and data retention.  

You must create at least one workspace to use Azure Monitor Logs. A single workspace might be sufficient for all of your monitoring data, or you might choose to create multiple workspaces depending on your requirements. For example, you might have one workspace for your production data and another for testing. 

To create a new workspace, see [Create a Log Analytics workspace in the Azure portal](./quick-create-workspace.md). For considerations on creating multiple workspaces, see [Designing your Azure Monitor Logs deployment](design-logs-deployment.md).


## Permissions


## Log data plans
By default, all data in a workspace is available to all features of Azure Monitor and any other services that use the workspace. You can configure certain data in the workspace as a different log type to optimize your cost in exchange for reduced features. The following table gives a brief summary of the different types. Follow the links for each for complete details.


| Type | Description |
|:---|:---|
| Standard  | Standard log data collected in a workspace. Available for all features of Azure Monitor and other services. |
| [Basic](basic-logs-overview.md) | Configure one or more tables in the workspace as Basic Logs. All data ingested by that table has a reduced ingestion cost. Retention time is set at 8 days, and there is a cost for log queries. Intended for high-value verbose logs that don’t require analytics and alerts. |
| [Archived](archive-logs-overview.md) | Configure data in a any table to be archived after it reaches its retention time. Archived dfata is stored for an extended period at a reduced cost.  |


## Data retention






## Data structure
Log queries retrieve their data from a Log Analytics workspace. Each workspace contains multiple tables that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns. Rows of data provided by the data source share those columns. 

[![Diagram that shows the Azure Monitor Logs structure.](media/data-platform-logs/logs-structure.png)](media/data-platform-logs/logs-structure.png#lightbox)

Log data from Application Insights is also stored in Azure Monitor Logs, but it's stored differently depending on how your application is configured: 

- For a workspace-based application, data is stored in a Log Analytics workspace in a standard set of tables. The types of data include application requests, exceptions, and page views. Multiple applications can use the same workspace. 

- For a classic application, the data is not stored in a Log Analytics workspace. It uses the same query language, and you create and run queries by using the same Log Analytics tool in the Azure portal. Data items for classic applications are stored separately from each other. The general structure is the same as for workspace-based applications, although the table and column names are different. 

For a detailed comparison of the schema for workspace-based and classic applications, see [Workspace-based resource changes](../app/apm-tables.md).

> [!NOTE]
> The classic Application Insights experience includes backward compatibility for your resource queries, workbooks, and log-based alerts. To query or view against the [new workspace-based table structure or schema](../app/apm-tables.md), you must first go to your Log Analytics workspace. During the preview, selecting **Logs** from within the Application Insights panes will give you access to the classic Application Insights query experience. For more information, see [Query scope](./scope.md).

[![Diagram that shows the Azure Monitor Logs structure for Application Insights.](media/data-platform-logs/logs-structure-ai.png)](media/data-platform-logs/logs-structure-ai.png#lightbox)



## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../agents/data-sources.md) for various resources in Azure.