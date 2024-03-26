---
title: Monitor Azure Synapse Analytics
description: Start here to learn how to monitor Azure Synapse Analytics.
ms.date: 03/25/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: jonburchel
ms.author: jburchel
ms.service: synapse-analytics
---

# Monitor Azure Synapse Analytics

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Monitoring methods

There are several ways to monitor activities in your Synapse Analytics workspace. You can collect and analyze metrics and logs for built-in and serverless SQL pools, dedicated SQL pools, Azure Spark pools, and Data Explorer pools (preview). You can monitor current and historical activities for SQL, Apache Spark, pipelines and triggers, and integration runtimes.

### Synapse Studio

Open Synapse Studio and navigate to the **Monitor** hub to see a history of all the activities in the workspace and which ones are active.

- Under **Integration**, you can monitor pipelines, triggers, and integration runtimes.
- Under **Activities**, you can monitor Spark and SQL activities.

For more information about monitoring in Synapse Studio, see [Monitor your Synapse Workspace](get-started-monitor.md).

- For information on monitoring pipeline runs, see [Monitor pipeline runs in Synapse Studio](monitoring/how-to-monitor-pipeline-runs.md).
- For information on monitoring Apache Spark applications, see [Monitor Apache Spark applications in Synapse Studio](monitoring/apache-spark-applications.md).
- For information on monitoring SQL pools, see [Use Synapse Studio to monitor your SQL pools](monitoring/how-to-monitor-sql-pools.md).
- For information on monitoring SQL requests, see [Monitor SQL requests in Synapse Studio](monitoring/how-to-monitor-sql-requests.md).

### DMVs and Query Store

To programmatically monitor Synapse SQL via T-SQL, Synapse Analytics provides a set of Dynamic Management Views (DMVs). These views are useful to troubleshoot and identify performance bottlenecks with your workload. For more information, see [DMVs](sql/query-history-storage-analysis.md#dmvs) and [Monitor your Azure Synapse Analytics dedicated SQL pool workload using DMVs](sql-data-warehouse/sql-data-warehouse-manage-monitor.md). For the list of DMVs that apply to Synapse SQL, see [Dedicated SQL pool Dynamic Management Views (DMVs)](sql/reference-tsql-system-views.md#dedicated-sql-pool-dynamic-management-views-dmvs).

Query Store is a set of internal stores and DMVs that provide insight on query plan choice and performance. Query Store simplifies performance troubleshooting by helping find performance differences caused by query plan changes. For more information, see [Query Store](sql/query-history-storage-analysis.md#query-store).

### Azure portal

You can monitor Synapse Analytics workspaces and pools directly from their Azure portal pages. On the left sidebar menu, you can access the Azure **Activity log**, or select **Alerts**, **Metrics**, **Diagnostic settings**, **Logs**, or **Advisor recommendations** from the **Monitoring** section. This article provides more details about these options.

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

The resource types for Synapse Analytics include:

- Microsoft.Synapse/workspaces
- Microsoft.Synapse/workspaces/bigDataPools
- Microsoft.Synapse/workspaces/kustoPools
- Microsoft.Synapse/workspaces/scopePools
- Microsoft.Synapse/workspaces/sqlPools

For more information about the resource types for Azure Synapse Analytics, see [Azure Synapse Analytics monitoring data reference](monitor-synapse-analytics-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

Synapse Analytics supports storing monitoring data in Azure Storage or Azure Data Lake Storage Gen 2.

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For lists of available platform metrics for Synapse Analytics, see [Synapse Analytics monitoring data reference](monitor-synapse-analytics-reference.md#metrics).

Synapse Analytics Apache Spark pools support Prometheus metrics and Grafana dashboards. For more information, see [Monitor Apache Spark Applications metrics with Prometheus and Grafana](spark/use-prometheus-grafana-to-monitor-apache-spark-application-level-metrics.md).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Synapse Analytics, see [Synapse Analytics monitoring data reference](monitor-synapse-analytics-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

For a comparison of using Query Store, DMVs, Log Analytics, or Azure Data Explorer to analyze query history and performance, see [Historical query storage and analysis in Azure Synapse Analytics](query-history-storage-analysis.md).

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Synapse Link table fail events
Display sample failed Synapse Link table events.

```kusto
SynapseLinkEvent
| where OperationName == "TableFail"
| limit 100
```
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Synapse Analytics alert rules

The following table lists some suggested alerts for Synapse Analytics. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Synapse Analytics monitoring data reference](monitor-synapse-analytics-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Metric| TempDB 75% | Maximum local tempdb used percentage greater than or equal to 75% of threshold value |
| Metric| DWU Usage near 100% for 1 hour | Average DWU used percentage greater than 95% for one hour |
| Log Analytics | SynapseSqlPoolRequestSteps | ShuffleMoveOperation over 10 million rows |

For more details about creating these and other recommended alert rules, see [Create alerts for your Synapse Dedicated SQL Pool](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/create-alerts-for-your-synapse-dedicated-sql-pool/ba-p/3773256).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content
- For a reference of the metrics, logs, and other important values created for Synapse Analytics, see [Synapse Analytics monitoring data reference](monitor-synapse-analytics-reference.md).
- For general details on monitoring Azure resources with Azure Monitor, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
