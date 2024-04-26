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
[!INCLUDE [Microsoft.Synapse/workspaces](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-synapse-workspaces-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/bigDataPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/bigDataPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Synapse/workspaces/bigDataPools](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-synapse-workspaces-bigdatapools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/kustoPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/kustoPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Synapse/workspaces/kustoPools](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-synapse-workspaces-kustopools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/scopePools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/scopePools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Synapse/workspaces/scopePools](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-synapse-workspaces-scopepools-metrics-include.md)]

### Supported metrics for Microsoft.Synapse/workspaces/sqlPools
The following table lists the metrics available for the Microsoft.Synapse/workspaces/sqlPools resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Synapse/workspaces/sqlPools](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-synapse-workspaces-sqlpools-metrics-include.md)]

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
[!INCLUDE [Microsoft.Synapse/workspaces](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-synapse-workspaces-logs-include.md)]

> [!NOTE]  
> The event **SynapseBuiltinSqlPoolRequestsEnded** is emitted only for queries that read data from storage. It's not emitted for queries that process only metadata.

### Supported resource logs for Microsoft.Synapse/workspaces/bigDataPools
[!INCLUDE [Microsoft.Synapse/workspaces/bigDataPools](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-synapse-workspaces-bigdatapools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/kustoPools
[!INCLUDE [Microsoft.Synapse/workspaces/kustoPools](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-synapse-workspaces-kustopools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/scopePools
[!INCLUDE [Microsoft.Synapse/workspaces/scopePools](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-synapse-workspaces-scopepools-logs-include.md)]

### Supported resource logs for Microsoft.Synapse/workspaces/sqlPools
[!INCLUDE [Microsoft.Synapse/workspaces/sqlPools](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-synapse-workspaces-sqlpools-logs-include.md)]

### Dynamic Management Views (DMVs)

For more information on these logs, see the following information:

- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)

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

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Sql resource provider operations](/azure/role-based-access-control/permissions/databases#microsoftsql)
- [Microsoft.Synapse resource provider operations](/azure/role-based-access-control/permissions/analytics#microsoftsynapse)

## Related content

- See [Monitor Azure Synapse Analytics](monitor-synapse-analytics.md) for a description of monitoring Synapse Analytics.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
