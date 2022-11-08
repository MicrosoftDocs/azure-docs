---
title: Manage tables in a Log Analytics workspace 
description: Learn how to manage the data and costs related to a Log Analytics workspace effectively
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 11/09/2022
# Customer intent: As a Log Analytics workspace administrator, I want to understand the options I have for configuring tables in a Log Analytics workspace so that I can manage the data and costs related to a Log Analytics workspace effectively.

---

# Manage tables in a Log Analytics workspace

Azure Monitor Logs stores log data in tables. Table configuration lets you define how to store collected data, how long to retain the data, and whether you collect the data for auditing and troubleshooting or for ongoing data analysis and regular use by features and services. 

This article explains the table configuration options in Azure Monitor Logs and how to manage table settings based on your data analysis and cost management needs. 

## Table configuration

This diagram provides an overview of the table configuration options in Azure Monitor Logs:

:::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-management.png" alt-text="Diagram that shows table configuration options, including table type, table schema, table plan, and retention and archive policies." lightbox="media/manage-logs-tables/azure-monitor-logs-table-management-large.png":::

In the Azure portal, you can view and set table configuration settings by selecting **Tables** from your Log Analytics workspace.   

:::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-configuration.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace." lightbox="media/manage-logs-tables/azure-monitor-logs-table-configuration.png":::

## Table type

A Log Analytics workspace lets you collect logs from Azure and non-Azure resources into one space for data analysis, use by other services, such as [Sentinel](../../../articles/sentinel/overview.md), and to trigger alerts and actions, for example, using [Logic Apps](../logs/logicapp-flow-connector.md). 

Your Log Analytics workspace can contain the following types of tables:

| Table type                           | Data source                                                                                          | Setup                                                                                                                                                     |
|----------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure table            | Logs from Azure resources or required by Azure services and solutions.                                                                                        | Azure Monitor Logs creates Azure tables automatically based on Azure services you use and [diagnostic settings](../essentials/diagnostic-settings.md) you configure for specific resources.                                                                 |
| Custom table | Non-Azure resource and any other data source, such as Data Hubs and file-based logs.| For logs you collect using [Azure Monitor Agent](../agents/agents-overview.md), Azure Monitor Logs creates a custom table when you configure the [data collection rule](../agents/agents-overview.md#install-the-agent-and-configure-data-collection) you use to collect logs from the data source. <br/> For logs you collect using the [Log ingestion API](../logs/logs-ingestion-api-overview.md), you need to [create a custom table](../logs/create-custom-table.md) manually.|
| Search results | Logs within the workspace. | Azure Monitor creates a search job results table when you run a [search job](../logs/search-jobs.md). |
| Restored logs | Archived logs. | Azure Monitor creates a restored logs table when you [restore archived logs](../logs/restore.md). |

## Table schema

A table's schema is the set of columns into which Azure Monitor Logs collects logs from one or more data sources.  
### Azure table schema

Each Azure table has a predefined schema into which Azure Monitor Logs collects logs defined by Azure resources, services, and solutions. 

You can [add columns to an Azure table](../logs/create-custom-table.md#add-or-delete-a-custom-column) to store transformed log data or enrich data in the Azure table with data from another source. 
### Custom table schema

You can [define a custom table's schema](../logs/create-custom-table.md) based on how you want to store data you collect from a given data source.  

Reduce costs and analysis effort by using data collection rules to [filter out and transform data before ingestion](../essentials/data-collection-transformations.md) based on the schema you define for your custom table.    

### Search results and restored logs table schema

The schema of a search results table is based on the query you define when you [run the search job](../logs/search-jobs.md).

A restored logs table has the same schema as the table from which you [restore logs](../logs/restore.md).

You can't edit the schema of existing search results and restored logs tables.
## Log data plan

[Configure a table's log data plan](../logs/basic-logs-configure.md) based on how often you access the data in the table. The **Basic** log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance. The **Analytics** plan makes log data available for interactive queries and use by features and services. 

## Retention and archive

 Archiving is a low-cost solution for keeping data that you no longer use regularly in your workspace for compliance or occasional investigation. [Set table-level retention policies](../logs/data-retention-archive.md) to override the default workspace retention policy and to archive data within your workspace. 

To access archived data, [run a search job](../logs/search-jobs.md) or [restore data for a specific time range](../logs/restore.md).

## Next steps

Learn how to:

- [Set a table's log data plan](../logs/basic-logs-configure.md)
- [Add custom tables and columns](../logs/create-custom-table.md)
- [Set retention and archive policies](../logs/data-retention-archive.md)
- [Design a workspace architecture](../logs/workspace-design.md)
