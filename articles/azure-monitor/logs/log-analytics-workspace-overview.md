---
title: Log Analytics workspace overview
description: Overview of Log Analytics workspace which store data for Azure Monitor Logs.
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 05/15/2022
---

# Log Analytics workspace overview
A Log Analytics workspace is a unique environment for log data from Azure Monitor and other Azure services such as Microsoft Sentinel and Microsoft Defender for Cloud. Each workspace has its own data repository and configuration but may combine data from multiple services. This article provides an overview of concepts related to Log Analytics workspaces and provides links to other documentation for more details on each.

> [!IMPORTANT]
> You may see the term *Microsoft Sentinel workspace* used in [Microsoft Sentinel](../../sentinel/overview.md) documentation. This is the same Log Analytics workspace described in this article but enabled for Microsoft Sentinel. This subjects all data in the workspace to Sentinel pricing as described in [Cost](#cost) below.

You can use a single workspace for all your data collection, or you may create multiple workspaces based on a  variety of requirements such as the geographic location of the data, access rights that define which users can access data, and configuration settings such as the pricing tier and data retention. 

To create a new workspace, see [Create a Log Analytics workspace in the Azure portal](./quick-create-workspace.md). For considerations on creating multiple workspaces, see [Designing your Azure Monitor Logs deployment](design-logs-deployment.md).


## Data structure
Each workspace contains multiple tables that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns. Rows of data provided by the data source share those columns. Log queries define columns of data to retrieve and provide output to different features of Azure Monitor and other services that use workspaces.

[![Diagram that shows the Azure Monitor Logs structure.](media/data-platform-logs/logs-structure.png)](media/data-platform-logs/logs-structure.png#lightbox)


## Cost
There is no direct cost for creating or maintaining a workspace. You're charged for the data sent to it (data ingestion) and how long that data is stored (data retention). These costs may vary based on the data plan of each table as described in [Log data plans (preview)](#log-data-plans-preview). 

See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing and [Azure Monitor best practices - Cost management](../best-practices-cost.md) for guidance on reducing your costs. If you are using your Log Analytics workspace with services other than Azure Monitor, then see the documentation for those services for pricing information.

## Log data plans (preview)
By default, all tables in a workspace are **Analytics** tables, which are available to all features of Azure Monitor and any other services that use the workspace. You can configure certain tables as **Basic Logs (preview)** to reduce the cost of storing high-volume verbose logs you use for debugging, troubleshooting and auditing, but not for analytics and alerts. Tables configured for Basic Logs have a lower ingestion cost in exchange for reduced features. 

The following table gives a brief summary of the two plans. See [Configure Basic Logs in Azure Monitor (Preview)](basic-logs-configure.md) for more details on Basic Logs and how to configure them.

> [!NOTE]
> Basic Logs are currently in public preview. You can currently work with Basic Logs tables in the Azure Portal and using a limited number of other components. The Basic Logs feature is not available for workspaces in [legacy pricing tiers](cost-logs.md#legacy-pricing-tiers).

The following table summarizes the differences between the plans.

| Category | Analytics Logs | Basic Logs |
|:---|:---|:---|
| Ingestion | Cost for ingestion. | Reduced cost for ingestion. |
| Log queries | No additional cost. Full query capabilities. | Additional cost. [Subset of query capabilities](basic-logs-query.md#limitations). |
| Retention |  Configure retention from 30 days to 730 days. | Retention fixed at 8 days. |
| Alerts | Supported. | Not supported. |

## Ingestion-time transformations
[Data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) that define data coming into Azure Monitor can include transformations that allow you to filter and transform data before it's ingested into the workspace. Since all workflows don't yet support DCRs, each workspace can define ingestion-time transformations. This allows you filter or transform data before it's stored. 

[Ingestion-time transformations](ingestion-time-transformations.md) are defined for each table in a workspace and apply to all data sent to that table, even if sent from multiple sources. Ingestion-time transformations though only apply to workflows that don't already use a data collection rule. For example, [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) uses a data collection rule to define data collected from virtual machines. This data will not be subject to any ingestion-time transformations defined in the workspace. 

For example, you might have [diagnostic settings](../essentials/diagnostic-settings.md) that send [resource logs](../essentials/resource-logs.md) for different Azure resources to your workspace. You can create a transformation for the table that collects the resource logs that filters this data for only records that you want, saving you the ingestion cost for records you don't need. You may also want to extract important data from certain columns and store it in additional columns in the workspace to support simpler queries.


## Data retention and archive
Data in each table in a [Log Analytics workspace](log-analytics-workspace-overview.md) is retained for a specified period of time after which it's either removed or archived with a reduced retention fee. Set the retention time to balance your requirement for having data available with reducing your cost for data retention.

> [!NOTE]
> Archive is currently in public preview.

To access archived data, you must first retrieve data from it in an Analytics Logs table using one of the following methods:

| Method | Description |
|:---|:---|
| [Search Jobs](search-jobs.md) | Retrieve data matching particular criteria. |
| [Restore](restore.md) | Retrieve data from a particular time range. |

:::image type="content" source="media/log-analytics-workspace-overview/workspace-plan-overview.png" alt-text="Overview of data plans and archive":::


## Permissions
Permission to data in a Log Analytics workspace is defined by the [access control mode](design-logs-deployment.md#access-control-mode), which is a setting on each workspace. Users can either be given explicit access to the workspace using a [built-in or custom role](../roles-permissions-security.md), or you can allow access to data collected for Azure resources to users with access to those resources.

See [Manage access to log data and workspaces in Azure Monitor](manage-access.md) for details on the different permission options and on configuring permissions.

## Next steps

- [Create a new Log Analytics workspace](quick-create-workspace.md)
- See [Designing your Azure Monitor Logs deployment](design-logs-deployment.md) for considerations on creating multiple workspaces.
- [Learn about log queries to retrieve and analyze data from a Log Analytics workspace.](./log-query-overview.md)
