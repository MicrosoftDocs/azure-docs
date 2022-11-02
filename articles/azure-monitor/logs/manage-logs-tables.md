---
title: Manage tables in a Log Analytics workspace 
description: Learn how to manage the data and costs related to a Log Analytics workspace effectively
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 11/01/2022
# Customer intent: As a Log Analytics workspace administrator, I want to understand the options I have for configuring tables in a Log Analytics workspace so that I can manage the data and costs related to a Log Analytics workspace effectively.

---

# Manage tables in a Log Analytics workspace

Azure Monitor Logs stores log data in tables. Log tables have a set of properties that let you define how to store collected data, how long to retain the data, and whether you collect the data for auditing and troubleshooting, or for ongoing data analysis and regular use by features and services. This article explains the table configuration options in Azure Monitor Logs and how to manage table settings based on your data analysis and cost management needs. 

## Table configuration settings

This diagram provides an overview of the table configuration options in Azure Monitor Logs:

:::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-management.png" alt-text="Diagram that shows table configuration options, including table type, table schema, table plan, and retention and archive policies." lightbox="media/manage-logs-tables/azure-monitor-logs-table-management-large.png":::

In the Azure portal, you can view and set most table configuration settings by selecting **Tables** from your Log Analytics workspace. Currently, you can only configure [table-level access]() using the API.  

:::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-configuration.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace." lightbox="media/manage-logs-tables/azure-monitor-logs-table-configuration.png":::

## Table-level read access

Azure Monitor uses role-based authorization for access management.

[Set table-level read access](../logs/manage-access.md#set-table-level-read-access) to allow specific users or groups to read data from specific tables in a Log Analytics workspace.

For information about workspace-level access management, see [Manage access to Log Analytics workspaces](../logs/manage-access.md).

## Table type

A Log Analytics workspace lets you collect logs from Azure resources and non-Azure sources into one space where you can use the data for analysis, alerts, other services, such as [Sentinel](../../../articles/sentinel/overview.md), and to trigger actions, for example, using [Logic Apps](../logs/logicapp-flow-connector.md). 

Your Log Analytics workspace can contain the following types of tables:

| Table type                           | Data source                                                                                          | Setup                                                                                                                                                     |
|----------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure table            | Logs from Azure resources or required by Azure services and solutions.                                                                                        |Configure the resource's [diagnostic settings](../essentials/diagnostic-settings.md). <br/>Azure Monitor Logs creates the table and begins collecting data.                                                                                       |
| Custom table | Non-Azure resource and any other data source, such as Data Hubs and file-based logs.| 1. [Create table]().<br/>2. Set up [Azure Monitor Agent](../agents/agents-overview.md) or [Log ingestion API](../logs/logs-ingestion-api-overview.md) to collect logs from the data source.<br/>3. Configure data collection rule. <br/>4. Set up data collection endpoint for API, or association with Azure Monitor Agent.<br/> For more information, see [Collect logs with API](./tutorial-logs-ingestion-portal.md) and [Collect logs with Azure Monitor Agent](../agents/agents-overview.md#install-the-agent-and-configure-data-collection).|
| Search results | Logs within the workspace. | Azure Monitor creates a search job results table when you run a [search job](../logs/search-jobs.md). |
| Restored logs | Archived logs. | Azure Monitor creates a restored logs table when you [restore archived logs](../logs/restore.md). |

## Table schema

A table's schema is the set of columns into which Azure Monitor Logs collects logs from one or more data sources.  
### Azure table schema

Each Azure table has a predefined schema into which Azure Monitor Logs collects data used Azure resources and data required by Azure services and solutions. 

You can [add columns to an Azure table]() to: 

- Transform data in an Azure table using a [workspace transformation data collection rule DCR](../essentials/data-collection-transformations.md).  
- Enrich data in the Azure table with data from another source using the [Logs Ingestion API](../logs/logs-ingestion-api-overview.md). 
### Custom table schema

[Configure a custom table's schema]() based on how you want to store data you collect from a given data source. A custom table's schema doesn't have to be the same as the log schema of the data source. 

Reduce costs and analysis effort by using data collection rules to [filter out and transform data before ingestion](../essentials/data-collection-transformations.md) based on the schema you define for your custom table.    

### Search results and restored logs table schema

A restored logs table has the same schema as the table from which you [restore logs](../logs/restore.md).

The schema of a search results table is based on the query you define when you [run the search job](../logs/search-jobs.md).

You can't edit the schema of search results and restored logs tables.
## Log data plan

[Configure a table's log data plan](../logs/basic-logs-configure.md) based on how often you access the data in the table.    

The Basic log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance. Basic log data tables contain data that you don't need to query or use for other services and features, alerts and Logic Apps. 

## Retention and archive

Each workspace has a default retention policy that's applied to all tables, but you can [set table-level retention policies](../logs/data-retention-archive.md) on individual tables.

:::image type="content" source="media/data-retention-configure/retention-archive.png" alt-text="Diagram that shows an overview of data retention and archive periods.":::

During the interactive retention period, data is available for monitoring, troubleshooting, and analytics. When you no longer use the logs, but still need to keep the data for compliance or occasional investigation, archive the logs to save costs.

Archived data stays in the same table, alongside the data that's available for interactive queries. When you set a total retention period that's longer than the interactive retention period, Log Analytics automatically archives the relevant data immediately at the end of the retention period.

If you change the archive settings on a table with existing data, the relevant data in the table is also affected immediately. For example, you might have an existing table with 30 days of interactive retention and no archive period. You decide to change the retention policy to eight days of interactive retention and one year total retention. Log Analytics immediately archives any data that's older than eight days.

You can access archived data by [running a search job](search-jobs.md) or [restoring archived logs](restore.md).

> [!NOTE]
> The archive period can only be set at the table level, not at the workspace level.

