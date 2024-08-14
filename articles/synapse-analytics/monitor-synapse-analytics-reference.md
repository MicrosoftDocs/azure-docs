---
title: Monitoring data reference for Azure Synapse Analytics
description: This article contains important reference material you need when you monitor Azure Synapse Analytics.
ms.date: 03/25/2024
ms.custom: horz-monitor
ms.topic: reference
author: jonburchel
ms.author: jburchel
ms.service: synapse-analytics
---

# Azure Synapse Analytics monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Synapse Analytics](monitor-synapse-analytics.md) for details on the data you can collect for Azure Synapse Analytics and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Synapse/workspaces
The following table lists the metrics available for the Microsoft.Synapse/workspaces resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-synapse-workspaces-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-synapse-workspaces-metrics-include.md)]

### Azure Synapse Link metrics

Azure Synapse Link emits the following metrics to Azure Monitor:

| **Metric**  | **Aggregation types**  | **Description**  |
|---------|---------|---------|
| Link connection events | Sum | Number of Synapse Link connection events, including start, stop, and failure |
| Link latency in seconds | Max, Min, Avg | Synapse Link data processing latency in seconds |
| Link processed data volume (bytes) | Sum | Data volume in bytes processed by Synapse Link |
| Link processed rows | Sum | Row counts processed by Synapse Link |
| Link table events | Sum | Number of Synapse Link table events, including snapshot, removal, and failure |

### Supported metrics for Microsoft.Synapse/workspaces/bigDataPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/bigDataPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-synapse-workspaces-bigdatapools-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-synapse-workspaces-bigdatapools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/kustoPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/kustoPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-synapse-workspaces-kustopools-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-synapse-workspaces-kustopools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/scopePools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/scopePools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-synapse-workspaces-scopepools-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-synapse-workspaces-scopepools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/sqlPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/sqlPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-synapse-workspaces-sqlpools-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-synapse-workspaces-sqlpools-metrics-include.md)]

#### Details

- Dedicated SQL pool measures performance in compute data warehouse units (DWUs). Rather than surfacing details of individual nodes such as memory per node or number of CPUs per node, metrics such as `MemoryUsedPercent` and `CPUPercent` show general usage trend over a period of time. These trends help administrators understand how a dedicated SQL pool instance is utilized. Changes in memory or CPU footprint could be a trigger for actions such as scale-up or scale-down of DWUs, or investigating queries that might require optimization.

- `DWUUsed` represents only high-level usage across the SQL pool and isn't a comprehensive indicator of utilization. To determine whether to scale up or down, consider all factors that DWU can impact, such as concurrency, memory, tempdb size, and adaptive cache capacity. [Run your workload at different DWU settings](sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md#finding-the-right-size-of-data-warehouse-units) to determine what works best to meet your business objectives.

- `MemoryUsedPercent` reflects utilization even if the data warehouse is idle, not active workload memory consumption. Track this metric along with tempdb size and Gen2 cache to decide whether you need to scale for more cache capacity to increase workload performance.

- Failed and successful connections are reported for a particular data warehouse, not for the server itself.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

### Microsoft.Synapse/workspaces

`Result`, `FailureType`, `Activity`, `ActivityType`, `Pipeline`, `Trigger`, `EventType`, `TableName`, `LinkTableStatus`, `LinkConnectionName`, `SQLPoolName`, `SQLDatabaseName`, `JobName`, `LogicalName`, `PartitionId`, `ProcessorInstance`

Use the `Result` dimension of the `IntegrationActivityRunsEnded`, `IntegrationPipelineRunsEnded`, `IntegrationTriggerRunsEnded`, and `BuiltinSqlPoolDataRequestsEnded` metrics to filter by `Succeeded`, `Failed`, or `Canceled` final state.

### Microsoft.Synapse/workspaces/bigDataPools

`SubmitterId`, `JobState`, `JobType`, `JobResult`

### Microsoft.Synapse/workspaces/kustoPools

`Database`, `SealReason`, `ComponentType`, `ComponentName`, `ContinuousExportName`, `Result`, `EventStatus`, `State`, `RoleInstance`, `IngestionResultDetails`, `FailureKind`, `MaterializedViewName`, `Kind`, `Result`, `QueryStatus`, `ComponentType`, `CommandType`

### Microsoft.Synapse/workspaces/scopePools

`JobType`, `JobResult`

### Microsoft.Synapse/workspaces/sqlPools

`IsUserDefined`, `Result`

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Synapse/workspaces
[!INCLUDE [microsoft-synapse-workspaces-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-synapse-workspaces-logs-include.md)]

> [!NOTE]  
> The event **SynapseBuiltinSqlPoolRequestsEnded** is emitted only for queries that read data from storage. It's not emitted for queries that process only metadata.

### Supported resource logs for Microsoft.Synapse/workspaces/bigDataPools
[!INCLUDE [microsoft-synapse-workspaces-bigdatapools-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-synapse-workspaces-bigdatapools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/kustoPools
[!INCLUDE [microsoft-synapse-workspaces-kustopools-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-synapse-workspaces-kustopools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/scopePools
[!INCLUDE [microsoft-synapse-workspaces-scopepools-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-synapse-workspaces-scopepools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/sqlPools
[!INCLUDE [microsoft-synapse-workspaces-sqlpools-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-synapse-workspaces-sqlpools-logs-include.md)]

### Dynamic Management Views (DMVs)

For more information on these logs, see the following information:

- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)

To view the list of DMVs that apply to Synapse SQL, see [System views supported in Synapse SQL](./sql/reference-tsql-system-views.md#dedicated-sql-pool-dynamic-management-views-dmvs).

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Synapse Workspaces
Microsoft.Synapse/workspaces

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [SynapseRbacOperations](/azure/azure-monitor/reference/tables/SynapseRbacOperations#columns)
- [SynapseGatewayApiRequests](/azure/azure-monitor/reference/tables/SynapseGatewayApiRequests#columns)
- [SynapseSqlPoolExecRequests](/azure/azure-monitor/reference/tables/SynapseSqlPoolExecRequests#columns)
- [SynapseSqlPoolRequestSteps](/azure/azure-monitor/reference/tables/SynapseSqlPoolRequestSteps#columns)
- [SynapseSqlPoolDmsWorkers](/azure/azure-monitor/reference/tables/SynapseSqlPoolDmsWorkers#columns)
- [SynapseSqlPoolWaits](/azure/azure-monitor/reference/tables/SynapseSqlPoolWaits#columns)
- [SynapseSqlPoolSqlRequests](/azure/azure-monitor/reference/tables/SynapseSqlPoolSqlRequests#columns)
- [SynapseIntegrationPipelineRuns](/azure/azure-monitor/reference/tables/SynapseIntegrationPipelineRuns#columns)
- [SynapseLinkEvent](/azure/azure-monitor/reference/tables/SynapseLinkEvent#columns)
- [SynapseIntegrationActivityRuns](/azure/azure-monitor/reference/tables/SynapseIntegrationActivityRuns#columns)
- [SynapseIntegrationTriggerRuns](/azure/azure-monitor/reference/tables/SynapseIntegrationTriggerRuns#columns)
- [SynapseBigDataPoolApplicationsEnded](/azure/azure-monitor/reference/tables/SynapseBigDataPoolApplicationsEnded#columns)
- [SynapseBuiltinSqlPoolRequestsEnded](/azure/azure-monitor/reference/tables/SynapseBuiltinSqlPoolRequestsEnded#columns)
- [SQLSecurityAuditEvents](/azure/azure-monitor/reference/tables/SQLSecurityAuditEvents#columns)
- [SynapseScopePoolScopeJobsEnded](/azure/azure-monitor/reference/tables/SynapseScopePoolScopeJobsEnded#columns)
- [SynapseScopePoolScopeJobsStateChange](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [SynapseDXCommand](/azure/azure-monitor/reference/tables/SynapseDXCommand#columns)
- [SynapseDXFailedIngestion](/azure/azure-monitor/reference/tables/SynapseDXFailedIngestion#columns)
- [SynapseDXIngestionBatching](/azure/azure-monitor/reference/tables/SynapseDXIngestionBatching#columns)
- [SynapseDXQuery](/azure/azure-monitor/reference/tables/SynapseDXQuery#columns)
- [SynapseDXSucceededIngestion](/azure/azure-monitor/reference/tables/SynapseDXSucceededIngestion#columns)
- [SynapseDXTableUsageStatistics](/azure/azure-monitor/reference/tables/SynapseDXTableUsageStatistics#columns)
- [SynapseDXTableDetails](/azure/azure-monitor/reference/tables/SynapseDXTableDetails#columns)

### Available Apache Spark configurations

| Configuration name | Default value | Description |
| ------------------ | ------------- | ----------- |
| spark.synapse.logAnalytics.enabled | false | To enable the Log Analytics sink for the Spark applications, true. Otherwise, false. |
| spark.synapse.logAnalytics.workspaceId | - | The destination Log Analytics workspace ID. |
| spark.synapse.logAnalytics.secret | - | The destination Log Analytics workspace secret. |
| spark.synapse.logAnalytics.keyVault.linkedServiceName   | - | The Key Vault linked service name for the Log Analytics workspace ID and key. |
| spark.synapse.logAnalytics.keyVault.name | - | The Key Vault name for the Log Analytics ID and key. |
| spark.synapse.logAnalytics.keyVault.key.workspaceId | SparkLogAnalyticsWorkspaceId | The Key Vault secret name for the Log Analytics workspace ID. |
| spark.synapse.logAnalytics.keyVault.key.secret | SparkLogAnalyticsSecret | The Key Vault secret name for the Log Analytics workspace |
| spark.synapse.logAnalytics.uriSuffix | ods.opinsights.azure.com | The destination Log Analytics workspace [URI suffix](../azure-monitor/logs/data-collector-api.md#request-uri). If your workspace isn't in Azure global, you need to update the URI suffix according to the respective cloud. |
| spark.synapse.logAnalytics.filter.eventName.match | - | Optional. The comma-separated spark event names, you can specify which events to collect. For example: `SparkListenerJobStart,SparkListenerJobEnd` |
| spark.synapse.logAnalytics.filter.loggerName.match | - | Optional. The comma-separated log4j logger names, you can specify which logs to collect. For example: `org.apache.spark.SparkContext,org.example.Logger` |
| spark.synapse.logAnalytics.filter.metricName.match | - | Optional. The comma-separated spark metric name suffixes, you can specify which metrics to collect. For example: `jvm.heap.used`|

> [!NOTE]  
> - For Microsoft Azure operated by 21Vianet, the `spark.synapse.logAnalytics.uriSuffix` parameter should be `ods.opinsights.azure.cn`. 
> - For Azure Government, the `spark.synapse.logAnalytics.uriSuffix` parameter should be `ods.opinsights.azure.us`. 
> - For any cloud except Azure, the `spark.synapse.logAnalytics.keyVault.name` parameter should be the fully qualified domain name (FQDN) of the Key Vault. For example, `AZURE_KEY_VAULT_NAME.vault.usgovcloudapi.net` for AzureUSGovernment.

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Sql resource provider operations](/azure/role-based-access-control/permissions/databases#microsoftsql)
- [Microsoft.Synapse resource provider operations](/azure/role-based-access-control/permissions/analytics#microsoftsynapse)

## Related content

- See [Monitor Azure Synapse Analytics](monitor-synapse-analytics.md) for a description of monitoring Synapse Analytics.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
