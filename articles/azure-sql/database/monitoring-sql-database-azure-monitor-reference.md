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
ms.date: 03/14/2022
---

# Monitoring Azure SQL Database data reference

This article contains reference for monitoring Azure SQL Database with Azure Monitor. See [Monitoring Azure SQL Database](monitoring-sql-database-azure-monitor.md) for details on collecting and analyzing monitoring data for Azure SQL Database with Azure Monitor SQL Insights (preview).

## Metrics

For more on using Azure Monitor SQL Insights (preview) for all products in the [Azure SQL family](../../azure-sql/index.yml), see [Monitor your SQL deployments with SQL Insights (preview)](../../azure-monitor/insights/sql-insights-overview.md).

For data specific to Azure SQL Database, see [Data for Azure SQL Database](../../azure-monitor/insights/sql-insights-overview.md#data-for-azure-sql-database).

For a complete list of metrics, see: 
- [Microsoft.Sql/servers/databases](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserversdatabases)
- [Microsoft.Sql/managedInstances](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlmanagedinstances)
- [Microsoft.Sql/servers/elasticPools](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserverselasticpools)

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
| [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics.md) | Azure Diagnostics reveals diagnostic data of specific resources and features for numerous Azure products including SQL databases, SQL elastic pools, and SQL managed instances. For more information, see [Diagnostics metrics]( metrics-diagnostic-telemetry-logging-streaming-export-configure.md?tabs=azure-portal#basic-metrics).|
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics.md) | Metric data emitted by Azure services that measure their health and performance. Activity from Azure products including SQL databases, SQL elastic pools, and SQL managed instances.|

## Activity log

The Activity log contains records of management operations performed on your Azure SQL Database resources. All maintenance operations related to Azure SQL Database that have been implemented here may appear in the Activity log.

For more information on the schema of Activity Log entries, see [Activity Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Next steps

- See [Monitoring Azure SQL Database with Azure Monitor](monitoring-sql-database-azure-monitor.md) for a description of monitoring Azure SQL Database.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.