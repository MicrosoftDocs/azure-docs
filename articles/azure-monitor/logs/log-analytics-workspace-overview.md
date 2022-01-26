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
A Log Analytics workspace is a unique environment for log data from Azure Monitor and other Azure services such as Microsoft Sentinel. Each workspace has its own data repository and configuration. Data sources and solutions are configured to store their data in a particular workspace. This article provides an overview of concepts related to Log Analytics workspaces and provides links to other documentation for more details on each.

> [!IMPORTANT]
> You may see the term *Microsoft Sentinel workspace* used in [Microsoft Sentinel](../../sentinel/overview.md) documentation. This is the same Log Analytics workspace described in this article but enabled for Microsoft Sentinel. This subjects all data in the workspace to Sentinel pricing as described in [Cost](#cost) below.

You can use a single workspace for all your data collection, or you may create multiple workspaces based on a  variety of requirements such as the geographic location of the data, access rights that define which users can access data, and configuration settings such as the pricing tier and data retention. 

To create a new workspace, see [Create a Log Analytics workspace in the Azure portal](./quick-create-workspace.md). For considerations on creating multiple workspaces, see [Designing your Azure Monitor Logs deployment](design-logs-deployment.md).


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


## Cost
There is no direct cost for creating or maintaining a workspace. You charged for the data sent to it (data ingestion) and how long that data is stored (data retention). These costs will vary based on the data plan of each table as described in [Log data plans (preview)](#log-data-plans). 

See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing and [Manage usage and costs with Azure Monitor Logs](manage-cost-storage.md) for guidance on reducing your costs. If you are using your Log Analytics workspace with services other than Azure Monitor, then see the documentation for those services for pricing information.

## Log data plans (preview)
By default, all tables in a workspace are **Archive Logs** which are available to all features of Azure Monitor and any other services that use the workspace. You can configure certain tables as **Basic Logs (preview)** which reduces the cost for high-value verbose logs that don’t require analytics and alerts.

> [!NOTE]
> Basic Logs are currently in public preview.

You can configure certain data in the workspace as a different log type to optimize your cost in exchange for reduced features. The following table gives a brief summary of the different types. Follow the links for each for complete details.

The following table summarizes the differences between the plans.

| Category | Archive Logs | Basic Logs |
|:---|:---|:---|
| Ingestion | Cost for ingestion. | Reduced cost for ingestion. |
| Log queries | No additional cost. Full query language. | Additional cost. Subset of query language. |
| Retention |  Configure retention from 30 days to 750 days. | Retention fixed at 8 days. |
| Alerts | Supported. | Not supported. |


## Data retention and archive
Data in each table in a [Log Analytics workspace](log-analytics-workspace-overview.md) is retained for a specified period of time after which it's either removed or moved to archive with a reduced retention fee. Set the retention time to balance your requirement for having data available with reducing your cost for data retention.

> [!NOTE]
> Archive is currently in public preview.

To access archived data, you must first retrieve data from it in an Analytics Logs table using one of the following methods:

:::image type="content" source="media/data-retention-configure/retention-archive.png" alt-text="Overview of data retention and archive periods":::


## Permissions
Permission to data in a Log Analytics workspace is defined by the [access control mode](design-logs-deployment.md#access-control-mode), which is a setting on each workspace. Users can either be given explicit access to the workspace using a [built-in or custom role](../roles-permissions-security.md), or you can allow access to data collected for Azure resources to users with access to those resources.

See [Manage access to log data and workspaces in Azure Monitor](manage-access.md) for details on the different permission options and on configuring permissions.

## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../agents/data-sources.md) for various resources in Azure.