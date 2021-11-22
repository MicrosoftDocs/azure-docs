---
title: Monitoring Azure SQL Database with Azure Monitor reference
description: Important reference material needed when you monitor Azure SQL Database with Azure Monitor
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.topic: conceptual
ms.reviewer: mathoma, dfurman
ms.service: sql-db-mi
ms.subservice: performance
ms.custom: subject-monitoring
ms.date: 06/08/2021
---

# Monitoring Azure SQL Database data reference

See [Monitoring Azure SQL Database](monitoring-sql-database-azure-monitor.md) for details on collecting and analyzing monitoring data for Azure SQL Database with Azure Monitor SQL insights.

## Metrics

For more on using Azure Monitor SQL insights for all products in the [Azure SQL family](../../azure-sql/index.yml), see [Monitor your SQL deployments with SQL insights](../../azure-monitor/insights/sql-insights-overview.md).

For data specific to Azure SQL Database, see [Data for Azure SQL Database](../../azure-monitor/insights/sql-insights-overview.md#data-for-azure-sql-database).

For a complete list of metrics, see [Microsoft.Sql/servers/databases](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserversdatabases).

## Resource logs

This section lists the types of resource logs you can collect for Azure SQL Database. 

For reference, see a list of [all resource logs category types supported in Azure Monitor](../../azure-monitor/essentials/resource-logs-schema.md).

For a reference of resource log types collected for Azure SQL Database, see [Streaming export of Azure SQL Database Diagnostic telemetry for export](metrics-diagnostic-telemetry-logging-streaming-export-configure.md#diagnostic-telemetry-for-export)

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs tables relevant to Azure SQL Database and available for query by Log Analytics, which can be queried with KQL.

Tables for all resources types are referenced here, for example, [Azure Monitor tables for SQL Databases](/azure/azure-monitor/reference/tables/tables-resourcetype.md#sql-databases).

|Resource Type | Notes |
|-------|-----|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity.md) | Entries from the Azure Activity log that provides insight into any subscription-level or management group level events that have occurred in Azure. |
| [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics.md) | Azure Diagnostics revealing internal operations of specific resources and features for numerous Azure products including SQL databases, SQL managed Instances, and SQL servers. For more information, see [Diagnostics metrics]( metrics-diagnostic-telemetry-logging-streaming-export-configure?tabs=azure-portal#basic-metrics).|
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics.md) | Metric data emitted by Azure services that measure their health and performance. Activity from numerous Azure products including SQL databases, SQL managed Instances, and SQL servers.|

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to Azure SQL Database that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by Azure SQL Database

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure SQL Database with Azure Monitor](monitoring-sql-database-azure-monitor.md) for a description of monitoring Azure SQL Database.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.