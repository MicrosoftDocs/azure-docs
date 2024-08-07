---
title: Log Analytics workspace overview
description: Overview of Log Analytics workspace, which stores data for Azure Monitor Logs.
ms.topic: conceptual
ms.date: 07/20/2024

# Customer intent: As a Log Analytics administrator, I want to understand to set up and manage my workspace, so that I can best address my business needs, including data access, cost management, and workspace health. As a Log Analytics user, I want to understand the workspace configuration options available to me, so I can best address my analysis.
---

# Log Analytics workspace overview

A Log Analytics workspace is a data store into which you can collect any type of log data from all of your Azure and non-Azure resources and applications. Workspace configuration options let you manage all of your log data in one workspace to meet the operations, analysis, and auditing needs of different personas in your organization through: 

- Azure Monitor features, such as built-in [insights experiences](../insights/insights-overview.md), [alerts](../alerts/alerts-create-log-alert-rule.md), and [automatic actions](../autoscale/autoscale-overview.md)
- Other Azure services, such as [Microsoft Sentinel](/azure/sentinel/overview), [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction), and [Logic Apps](/azure/connectors/connectors-azure-monitor-logs)
- Microsoft tools, such as [Power BI](log-powerbi.md) and [Excel](log-excel.md)
- Integration with custom and third-party applications

This article provides an overview of concepts related to Log Analytics workspaces.

> [!IMPORTANT]
> [Microsoft Sentinel](../../sentinel/overview.md) documentation uses the term *Microsoft Sentinel workspace*. This workspace is the same Log Analytics workspace described in this article, but it's enabled for Microsoft Sentinel. All data in the workspace is subject to Microsoft Sentinel pricing.

## Log tables

Each Log Analytics workspace contains multiple tables in which Azure Monitor Logs stores data you collect.

Azure Monitor Logs automatically creates tables required to store monitoring data you collect from your Azure environment. You [create custom tables](create-custom-table.md) to store data you collect from non-Azure resources and applications, based on the data model of the log data you collect and how you want to store and use the data.

Table management settings let you control access to specific tables, and manage the data model, retention, and cost of data in each table. For more information, see [Manage tables in a Log Analytics workspace](manage-logs-tables.md). 

:::image type="content" source="media/data-platform-logs/logs-structure.png" lightbox="media/data-platform-logs/logs-structure.png" alt-text="Diagram that shows the Azure Monitor Logs structure.":::


## Data retention

A Log Analytics workspace retains data in two states - **interactive retention** and **long-term retention**. 

During the interactive retention period, you retrieve the data from the table through queries, and the data is available for visualizations, alerts, and other features and services, based on the table plan. 
 
Each table in your Log Analytics workspace lets you retain data up to 12 years in low-cost, long-term retention. Retrieve specific data you need from long-term retention to interactive retention using a search job. This means that you manage your log data in one place, without moving data to external storage, and you get the full analytics capabilities of Azure Monitor on older data, when you need it.

For more information, see [Manage data retention in a Log Analytics workspace](data-retention-configure.md).

## Data access

Permission to access data in a Log Analytics workspace is defined by the [access control mode](manage-access.md#access-control-mode) setting on each workspace. You can give users explicit access to the workspace by using a [built-in or custom role](../roles-permissions-security.md). Or, you can allow access to data collected for Azure resources to users with access to those resources.

For more information, see [Manage access to log data and workspaces in Azure Monitor](manage-access.md).

## View Log Analytics workspace insights

[Log Analytics Workspace Insights](log-analytics-workspace-insights-overview.md) helps you manage and optimize your Log Analytics workspaces with a comprehensive view of your workspace usage, performance, health, ingestion, queries, and change log. 

:::image type="content" source="media/log-analytics-workspace-insights-overview/at-resource.png" alt-text="Screenshot that shows the Log Analytics Workspace insights overview tab." lightbox="media/log-analytics-workspace-insights-overview/at-resource.png":::

## Transform data you ingest into your Log Analytics workspace

[Data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) that define data coming into Azure Monitor can include transformations that allow you to filter and transform data before it's ingested into the workspace. Since all data sources don't yet support DCRs, each workspace can have a [workspace transformation DCR](../essentials/data-collection-transformations-workspace.md).

[Transformations](../essentials/data-collection-transformations.md) in the workspace transformation DCR are defined for each table in a workspace and apply to all data sent to that table, even if sent from multiple sources. These transformations only apply to workflows that don't already use a DCR. For example, [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) uses a DCR to define data collected from virtual machines. This data won't be subject to any ingestion-time transformations defined in the workspace.

For example, you might have [diagnostic settings](../essentials/diagnostic-settings.md) that send [resource logs](../essentials/resource-logs.md) for different Azure resources to your workspace. You can create a transformation for the table that collects the resource logs that filters this data for only records that you want. This method saves you the ingestion cost for records you don't need. You might also want to extract important data from certain columns and store it in other columns in the workspace to support simpler queries.

## Cost

There's no direct cost for creating or maintaining a workspace. You're charged for the data you ingest into the workspace and for data retention, based on each table's [table plan](data-platform-logs.md#table-plans).

For information on pricing, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). For guidance on how to reduce your costs, see [Azure Monitor best practices - Cost management](../best-practices-cost.md). If you're using your Log Analytics workspace with services other than Azure Monitor, see the documentation for those services for pricing information.

## Design a Log Analytics workspace architecture to address specific business needs

You can use a single workspace for all your data collection. However, you can also create multiple workspaces based on specific business requirements such as regulatory or compliance requirements to store data in specific locations, split billing, and resilience.

For considerations related to creating multiple workspaces, see [Design a Log Analytics workspace configuration](./workspace-design.md).


## Next steps

- [Create a new Log Analytics workspace](quick-create-workspace.md).
- See [Design a Log Analytics workspace configuration](workspace-design.md) for considerations on creating multiple workspaces.
- [Learn about log queries to retrieve and analyze data from a Log Analytics workspace](./log-query-overview.md).
