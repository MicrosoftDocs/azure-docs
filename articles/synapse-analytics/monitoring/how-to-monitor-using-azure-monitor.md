---
title: How to monitor Synapse Analytics using Azure Monitor
description: Learn how to monitor your Synapse Analytics workspace using Azure Monitor metrics, alerts, and logs
author: matt1883
ms.author: mahi
ms.reviewer: mahi, wiassaf
ms.date: 11/02/2022
ms.service: synapse-analytics
ms.subservice: monitoring
ms.topic: how-to
---

# Use Azure Monitor with your Azure Synapse Analytics workspace

Cloud applications are complex and have many moving parts. Monitors provide data to help ensure that your applications stay up and running in a healthy state. Monitors also help you avoid potential problems and troubleshoot past ones. You can use monitoring data to gain deep insights about your applications. This knowledge helps you improve application performance and maintainability. It also helps you automate actions that otherwise require manual intervention.

Azure Monitor provides base-level infrastructure metrics, alerts, and logs for most Azure services. Azure diagnostic logs are emitted by a resource and provide rich, frequent data about the operation of that resource. Azure Synapse Analytics can write diagnostic logs in Azure Monitor.

For more information, see [Azure Monitor overview](../../azure-monitor/overview.md).

## Metrics

With Monitor, you can gain visibility into the performance and health of your Azure workloads. The most important type of Monitor data is the metric, which is also called the performance counter. Metrics are emitted by most Azure resources. Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

To access these metrics, complete the instructions in [Azure Monitor data platform](../../azure-monitor/data-platform.md).

### Workspace-level metrics

Here are some of the metrics emitted by workspaces:

| **Metric** | **Metric category, display name** | **Unit** | **Aggregation types** | **Description** |
| --- | --- | --- | --- | --- |
| IntegrationActivityRunsEnded | Integration, Activity runs metric | Count | Sum (default), Count | The total number of activity runs that occurred/ended within a 1-minute window.<br /><br />Use the Result dimension of this metric to filter by Succeeded, Failed, or Cancelled final state. |
| IntegrationPipelineRunsEnded | Integration, Pipeline runs metric | Count | Sum (default), Count | The total number of pipeline runs that occurred/ended within a 1-minute window.<br /><br />Use the Result dimension of this metric to filter by Succeeded, Failed, or Cancelled final state. |
| IntegrationTriggerRunsEnded | Integration, Trigger runs metric | Count | Sum (default), Count | The total number of trigger runs that occurred/ended within a 1-minute window.<br /><br />Use the Result dimension of this metric to filter by Succeeded, Failed, or Cancelled final state. |
| BuiltinSqlPoolDataProcessedBytes | Built-in SQL pool, Data processed (bytes) | Byte | Sum (default) | Amount of data processed by the built-in serverless SQL pool. |
| BuiltinSqlPoolLoginAttempts | Built-in SQL pool, Login attempts | Count | Sum (default) | Number of login attempts for the built-in serverless SQL pool. |
| BuiltinSqlPoolDataRequestsEnded | Built-in SQL pool, Requests ended (bytes) | Count | Sum (default) | Number of ended SQL requests for the built-in serverless SQL pool.<br /><br />Use the Result dimension of this metric to filter by final state. |

### Dedicated SQL pool metrics

Here are some of the metrics emitted by dedicated SQL pools created in Azure Synapse workspaces. For metrics emitted by dedicated SQL pools (formerly SQL Data Warehouse), see [Monitoring resource utilization and query activity](../sql-data-warehouse/sql-data-warehouse-concept-resource-utilization-query-activity.md).

| **Metric** | **Display name** | **Unit** | **Aggregation types** | **Description** |
| --- | --- | --- | --- | --- |
| DWULimit | DWU limit | Count | Max (default), Min, Avg | Configured size of the SQL pool |
| DWUUsed | DWU used | Count | Max (default), Min, Avg | Represents a high-level representation of usage across the SQL pool. Measured by DWU limit * DWU percentage |
| DWUUsedPercent | DWU used percentage | Percent | Max (default), Min, Avg | Represents a high-level representation of usage across the SQL pool. Measured by taking the maximum between CPU percentage and Data IO percentage |
| ConnectionsBlockedByFirewall | Connections blocked by firewall | Count | Sum (default) | Count of connections blocked by firewall rules. Revisit access control policies for your SQL pool and monitor these connections if the count is high |
| AdaptiveCacheHitPercent | Adaptive cache hit percentage | Percent | Max (default), Min, Avg | Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache hit percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache |
| AdaptiveCacheUsedPercent | Adaptive cache used percentage | Percent | Max (default), Min, Avg | Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache used percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache |
| LocalTempDBUsedPercent | Local `tempdb` used percentage | Percent | Max (default), Min, Avg | Local `tempdb` utilization across all compute nodes - values are emitted every five minutes |
| MemoryUsedPercent | Memory used percentage | Percent | Max (default), Min, Avg | Memory utilization across all nodes in the SQL pool |
| CPUPercent | CPU used percentage | Percent | Max (default), Min, Avg | CPU utilization across all nodes in the SQL pool |
| Connections | Connections | Count | Sum (default) | Count of total logins to the SQL pool |
| ActiveQueries | Active queries | Count | Sum (default) | The active queries. Using this metric unfiltered and unsplit displays all active queries running on the system |
| QueuedQueries | Queued queries | Count | Sum (default) | Cumulative count of requests queued after the max concurrency limit was reached |
| WLGActiveQueries | Workload group active queries | Count | Sum (default) | The active queries within the workload group. Using this metric unfiltered and unsplit displays all active queries running on the system |
| WLGActiveQueriesTimeouts | Workload group query timeouts | Count | Sum (default) | Queries for the workload group that have timed out. Query timeouts reported by this metric are only once the query has started executing (it does not include wait time due to locking or resource waits) |
| WLGQueuedQueries | Workload group queued queries | Count | Sum (default) | Cumulative count of requests queued after the max concurrency limit was reached |
| WLGAllocationBySystemPercent | Workload group allocation by system percent | Percent | Max (default), Min, Avg, Sum | The percentage allocation of resources relative to the entire system |
| WLGAllocationByEffectiveCapResourcePercent | Workload group allocation by max resource percent | Percent | Max (default), Min, Avg | Displays the percentage allocation of resources relative to the effective cap resource percent per workload group. This metric provides the effective utilization of the workload group |
| WLGEffectiveCapResourcePercent | Effective cap resource percent | Percent | Max (default), Min, Avg | The effective cap resource percent for the workload group. If there are other workload groups with min_percentage_resource > 0, the effective_cap_percentage_resource is lowered proportionally |
| WLGEffectiveMinResourcePercent | Effective min resource percent | Percent | Max (default), Min, Avg, Sum | The effective min resource percentage setting allowed considering the service level and the workload group settings. The effective min_percentage_resource can be adjusted higher on lower service levels |

> [!NOTE]
> Dedicated SQL pool measures performance in compute data warehouse units (cDWUs). Even though we do not surface details of individual nodes such as memory per node or number of CPUs per node, the intent behind emitting metrics such as `MemoryUsedPercent`; `CPUPercent` etc. is to show general usage trend over a period of time. These trends will help administrators understand how an instance of dedicated SQL pool is utilized, and changes in footprint of memory and/or CPU could be a trigger for one or more actions such as scale-up or scale-down cDWUs, investigating a query (or queries) which may require optimization, etcetera.

### Apache Spark pool metrics

Here are some of the metrics emitted by Apache Spark pools:

| **Metric** | **Metric category, display name** | **Unit** | **Aggregation types** | **Description** |
| --- | --- | --- | --- | --- |
| BigDataPoolApplicationsEnded | Ended Apache Spark applications | Count | Sum (default) | Number of Apache Spark pool applications ended |
| BigDataPoolAllocatedCores | Number of vCores allocated to the Apache Spark pool | Count | Max (default), Min, Avg | Allocated vCores for an Apache Spark Pool |
| BigDataPoolAllocatedMemory | Amount of memory (GB) allocated to the Apache Spark pool | Count | Max (default), Min, Avg | Allocated Memory for Apache Spark Pool (GB) |
| BigDataPoolApplicationsActive | Active Apache Spark applications | Count | Max (default), Min, Avg | Number of active Apache Spark pool applications |

## Alerts

Sign in to the Azure portal and select **Monitor** > **Alerts** to create alerts.

### Create Alerts

1. Select **+ New Alert rule** to create a new alert.

1. Define the **alert condition** to specify when the alert should fire.

    > [!NOTE]  
    > Make sure to select **All** in the **Filter by resource type** drop-down list.

1. Define the **alert details** to further specify how the alert should be configured.

1. Define the **action group** to determine who should receive the alerts (and how).

## Logs

### Workspace-level logs

Here are the logs emitted by Azure Synapse Analytics workspaces:

| Log Analytics table name | Log category name | Description |
| --- | --- | --- |
| SynapseGatewayApiRequests | GatewayApiRequests | Azure Synapse gateway API requests. |
| SynapseRbacOperations | SynapseRbacOperations | Azure Synapse role-based access control (SRBAC) operations. |
| SynapseBuiltinSqlPoolRequestsEnded | BuiltinSqlReqsEnded | Azure Synapse built-in serverless SQL pool ended requests. |
| SynapseIntegrationPipelineRuns | IntegrationPipelineRuns | Azure Synapse integration pipeline runs. |
| SynapseIntegrationActivityRuns | IntegrationActivityRuns | Azure Synapse integration activity runs. |
| SynapseIntegrationTriggerRuns | IntegrationTriggerRuns | Azure Synapse integration trigger runs. |

   > [!NOTE]  
   > The event **SynapseBuiltinSqlPoolRequestsEnded** is only emitted for queries that read data from storage. It will not be emitted for queries that only process metadata.


### Dedicated SQL pool logs

Here are the logs emitted by dedicated SQL pools:

| Log Analytics table name | Log category name | Description |
| --- | --- | --- |
| SynapseSqlPoolExecRequests  | ExecRequests | Information about SQL requests/queries in an Azure Synapse dedicated SQL pool.
| SynapseSqlPoolDmsWorkers    | DmsWorkers   | Information about workers completing DMS steps in an Azure Synapse dedicated SQL pool.
| SynapseSqlPoolRequestSteps  | RequestSteps | Information about request steps that compose a given SQL request/query in an Azure Synapse dedicated SQL pool.
| SynapseSqlPoolSqlRequests   | SqlRequests  | Information about query distributions of the steps of SQL requests/queries in an Azure Synapse dedicated SQL pool.
| SynapseSqlPoolWaits         | Waits        | Information about the wait states encountered during execution of a SQL request/query in an Azure Synapse dedicated SQL pool, including locks and waits on transmission queues.

For more information on these logs, see the following information:
- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)

### Apache Spark pool log

Here is the log emitted by Apache Spark pools:

| Log Analytics table name | Log category name | Description |
| --- | --- | --- |
| SynapseBigDataPoolApplicationsEnded | BigDataPoolAppsEnded | Information about ended Apache Spark applications |

### Diagnostic settings

Use diagnostic settings to configure diagnostic logs for non-compute resources. The settings for a resource control have the following features:

* They specify where diagnostic logs are sent. Examples include an Azure storage account, an Azure event hub, or Monitor logs.
* They specify which log categories are sent.
* They specify how long each log category should be kept in a storage account.
* A retention of zero days means logs are kept forever. Otherwise, the value can be any number of days from 1 through 2,147,483,647.
* If retention policies are set but storing logs in a storage account is disabled, the retention policies have no effect. For example, this condition can happen when only Event Hubs or Monitor logs options are selected.
* Retention policies are applied per day. The boundary between days occurs at midnight Coordinated Universal Time (UTC). At the end of a day, logs from days that are beyond the retention policy are deleted. For example, if you have a retention policy of one day, at the beginning of today the logs from before yesterday are deleted.

With Azure Monitor diagnostic settings, you can route diagnostic logs for analysis to multiple different targets.

* **Storage account**: Save your diagnostic logs to a storage account for auditing or manual inspection. You can use the diagnostic settings to specify the retention time in days.
* **Event Hubs**: Stream the logs to Azure Event Hubs. The logs become input to a partner service/custom analytics solution like Power BI.
* **Log Analytics workspace**: Analyze the logs with Log Analytics. The Azure Synapse integration with Log Analytics is useful in the following scenarios:
  * You want to write complex queries on a rich set of metrics that are published by Azure Synapse to Log Analytics. You can create custom alerts on these queries via Azure Monitor.
  * You want to monitor across workspaces. You can route data from multiple workspaces to a single Log Analytics workspace.

You can also use a storage account or Event Hubs namespace that isn't in the subscription of the resource that emits logs. The user who configures the setting must have appropriate Azure role-based access control (Azure RBAC) access to both subscriptions.

#### Configure diagnostic settings

Create or add diagnostic settings for your workspace, dedicated SQL pool, or Apache Spark pool.

1. In the portal, go to Monitor. Select **Settings** > **Diagnostic settings**.

1. Select the Synapse workspace, dedicated SQL pool, or Apache Spark pool for which you want to create a diagnostic setting.

1. If no diagnostic settings exist on the selected workspace, you're prompted to create a setting. Select **Turn on diagnostics**.

   If there are existing diagnostic settings on the workspace, you will see a list of settings already configured on the resource. Select **Add diagnostic setting**.

1. Give your setting a name, select **Send to Log Analytics**, and then select a workspace from **Log Analytics workspace**.

    > [!NOTE]  
    > Because an Azure log table can't have more than 500 columns, we **highly recommended** you select _Resource-Specific mode_. For more information, see [AzureDiagnostics Logs reference](/azure/azure-monitor/reference/tables/azurediagnostics).

1. Select **Save**.

After a few moments, the new setting appears in your list of settings for your workspace, dedicated SQL pool, or Apache Spark pool. Diagnostic logs are streamed to that workspace as soon as new event data are generated. Up to 15 minutes might elapse between when an event is emitted and when it appears in Log Analytics.

## Next steps

- For more information on monitoring pipeline runs, see the [Monitor pipeline runs in Synapse Studio](how-to-monitor-pipeline-runs.md) article.

- For more information on monitoring Apache Spark applications, see the [Monitor Apache Spark applications in Synapse Studio](apache-spark-applications.md) article.

- For more information on monitoring SQL requests, see the [Monitor SQL requests in Synapse Studio](how-to-monitor-sql-requests.md) article.
