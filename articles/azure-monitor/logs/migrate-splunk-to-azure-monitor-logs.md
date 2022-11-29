---
title: Migrate from Splunk to Azure Monitor Logs - Getting started
description: Learn how to plan the phases of your migration from Splunk to Azure Monitor Logs and get started importing, collection, and analyzing log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.topic: how-to 
ms.date: 11/22/2022

---

# Migrate from Splunk to Azure Monitor Logs

This article explains how to plan your migration from Splunk to Azure Monitor Logs for logging and log data analysis, including:  

> [!div class="checklist"]
> * Introduction to key concepts 
> * Deploy a Log Analytics workspace
> * Collect data
> * Migrate applications
> * Ingest historical data
> * Analyze log data

## Introduction to key concepts

|Concept |Description|
|---|---|
|[Log Analytics workspace](../logs/log-analytics-workspace-overview.md)|A unique environment for log data from Azure Monitor and other Azure services, such as Microsoft Sentinel and Microsoft Defender for Cloud. Each Log Analytics workspace has its own data repository and configuration but might combine data from multiple services. |
|[Table management](../logs/manage-logs-tables.md)|Azure Monitor Logs stores log data in tables. Table configuration lets you define the table schema, how long to retain data, and whether you need the data available for occasional auditing and troubleshooting or for ongoing data analysis and regular use by features and services.|
|[Basic and Analytics log data plans](../logs/basic-logs-configure.md)| Azure Monitor Logs offers two log data plans that let you reduce log ingestion and retention costs and take advantage of Azure Monitor's advanced features and analytics capabilities based on your needs.<br/> The **Basic** log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance. The **Analytics** plan makes log data available for interactive queries and use by features and services. |
|[Archiving and quick access to archived data](../logs/data-retention-archive.md)| The cost-effective archive option keeps your logs in your Log Analytics workspace and lets you access archived log data immediately, when you need it. Archive configuration changes are also effective immediately because data is not physically transferred to external storage. |
|[Data transformations](../essentials/data-collection-transformations.md)|Transformations let you filter or modify incoming data before it's sent to a Log Analytics workspace. Use transformations to remove sensitive data, enrich data in your Log Analytics workspace with additional or calculated information, and reduce data costs. |
|[Data collection rules](../essentials/data-collection-rule-overview.md)|Specify what data should be collected, how to transform that data, and where to send that data. |
|[Kusto Query Language (KQL)](/azure/kusto/query/)|Azure Monitor Logs uses a large subset of KQL that's suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. Use the [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet) to translate your Splunk SPL knowledge to KQL. You can also [learn KQL with tutorials](../logs/get-started-queries.md) and [KQL training modules](/training/modules/analyze-logs-with-kql/).|
|[Log Analytics](../logs/log-analytics-overview.md)| A tool in the Azure portal that's used to edit and run log queries on data collected to Azure Monitor Logs.|
|[Cost optimization](../../azure-monitor/best-practices-cost.md)|Reduce your costs by understanding [Azure Monitor Logs cost calculations](../logs/cost-logs.md) and following [best practices for optimizing costs in Azure Monitor](../../azure-monitor/best-practices-cost.md). |

## 1. Deploy a Log Analytics workspace

[Design a Log Analytics workspace architecture](../logs/workspace-design.md)

[Manage access to Log Analytics workspaces](../logs/manage-access.md)

[Set a table's log data plan](../logs/basic-logs-configure.md)

## 2. Collect data

| | Data collection tool | Collected data |
| --- | --- | --- |
| **Azure** |  | |
|  | [Diagnostic settings](../essentials/diagnostic-settings.md) |- Azure tenant<br/>- Azure resource|
|  |  |- Azure subscription|
| **Applications** | [Application insights](../app/app-insights-overview.md) | |
| **Containers** |[Container insights](../containers/container-insights-overview.md)| |
| **Virtual machines** | [VM insights](../vm/vminsights-overview.md) | - All logs and metrics collected by Azure Monitor Agent<br/> VM dependencies on other resources |
| **Operating systems** | [Azure Monitor Agent](../agents/agents-overview.md) | See [Azure Monitor Agent](../agents/agents-overview.md). |
| **Non-Azure sources** | [Logs Ingestion API](../logs/logs-ingestion-api-overview.md) | File-based logs and any data you send to a [data collection endpoint](../essentials/data-collection-endpoint-overview.md) on a monitored resource|

## 3. Migrate applications


## 4. Ingest historical data

## 5. Analyze log data

[Log Analytics demo environment](https://portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView)

[Analyze logs in Azure Monitor with KQL](/training/modules/analyze-logs-with-kql/)

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

