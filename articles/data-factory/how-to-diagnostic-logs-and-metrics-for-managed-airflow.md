---
title: Diagnostics logs and metrics for Managed Airflow
titleSuffix: Azure Data Factory
description: This article explains how to use diagnostic logs and metrics to monitor Airflow IR.
ms.service: data-factory
ms.topic: how-to
author: nabhishek
ms.author: abnarain
ms.date: 09/28/2023
---

# Diagnostics logs and metrics for Managed Airflow

This guide walks you through the following:

1. How to enable diagnostics logs and metrics for the Managed Airflow.
2. How to view logs and metrics.
3. How to run a query.
4. How to monitor metrics and set the alert system in Dag failure.

## How to enable Diagnostics logs and metrics for the Managed Airflow

1. Open your Azure Data Factory resource -> Select **Diagnostic settings** on the left navigation pane -> Select “Add Diagnostic setting.”

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/start-with-diagnostic-logs.png" alt-text="Screenshot that shows where diagnostic logs tab is located in data factory." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/start-with-diagnostic-logs.png":::

2. Fill out the Diagnostic settings name -> Select the following categories for the Airflow Logs

   - Airflow task execution logs
   - Airflow worker logs
   - Airflow dag processing logs
   - Airflow scheduler logs
   - Airflow web logs
   - If you select **AllMetrics**, various Data Factory metrics are made available for you to monitor or raise alerts on. These metrics include the metrics for Data Factory activity and Managed Airflow IR such as AirflowIntegrationRuntimeCpuUsage, AirflowIntegrationRuntimeMemory.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-category-and-all-metrics.png" alt-text="Screenshot that shows which logs to select for Airflow environment." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-category-and-all-metrics.png":::

3. Select the destination details, Log Analytics workspace:

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-analytics-workspace.png" alt-text="Screenshot that shows select log analytics workspace as destination for diagnostic logs." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-analytics-workspace.png":::

4. Click on Save.

## How to view logs

1. After adding Diagnostic settings, you can find them listed in the "**Diagnostic settings**" section. To access and view logs, simply click on the Log Analytics workspace that you've configured.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/01-click-on-log-analytics-workspace.png" alt-text="Screenshot that shows click on log analytics workspace url." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/01-click-on-log-analytics-workspace.png":::

2. Click on **View Logs**, under the section “Maximize your Log Analytics experience”.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/02-view-logs.png" alt-text="Screenshot that shows click on view logs." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/02-view-logs.png":::

3. You are directed to your log analytics workspace, where the chosen tables are imported into the workspace automatically.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/03-log-analytics-workspace.png" alt-text="Screenshot that shows logs analytics workspace." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/03-log-analytics-workspace.png":::

Other useful links for the schema:

1. [Azure Monitor Logs reference - ADFAirflowSchedulerLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/ADFAirflowSchedulerLogs)
2. [Azure Monitor Logs reference - ADFAirflowTaskLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowtasklogs)
3. [Azure Monitor Logs reference - ADFAirflowWebLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowweblogs)
4. [Azure Monitor Logs reference - ADFAirflowWorkerLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowworkerlogs)
5. [Azure Monitor Logs reference - AirflowDagProcessingLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/AirflowDagProcessingLogs)

## How to write a query

1. Let’s start with simplest query that returns all the records in the ADFAirflowTaskLogs.
   You can double click on the table name to add it to query window, or you can directly type table name in window.
:::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/simple-query.png" alt-text="Screenshot that shows kusto query to retrieve all logs." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/simple-query.png":::

2. To narrow down your search results, such as filtering them based on a specific task ID, you can use the following query:

```kusto
ADFAirflowTaskLogs
| where DagId == "<your_dag_id>"
and TaskId == "<your_task_id>"
```

Similarly, you can create custom queries according to your needs using any tables available in LogManagement.

For more information:

1. [Log Analytics Tutorial](../azure-monitor/logs/log-analytics-tutorial.md)

2. [Kusto Query Language (KQL) overview - Azure Data Explorer | Microsoft Learn](/azure/data-explorer/kusto/query/)

## How to monitor metrics.

Azure Data Factory offers comprehensive metrics for Airflow Integration Runtimes (IR), allowing you to effectively monitor the performance of your Airflow IR and establish alerting mechanisms as needed.

1. Open your Azure Data Factory Resource.

2. In the left navigation pane, Click **Metrics** under Monitoring section.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/metrics-in-data-factory-studio.png" alt-text="Screenshot that shows where metrics tab is located in data factory." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/metrics-in-data-factory-studio.png":::

3. Select the scope -> Metric Namespace -> Metric you want to monitor.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/monitor-metrics.png" alt-text="Screenshot that shows metrics to select." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/monitor-metrics.png":::

4. For example, we created the multi-line chart, to visualize the Integration Runtime CPU Percentage and Airflow Integration Runtime Dag Bag Size.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/multi-line-chart.png" alt-text="Screenshot that shows multiline chart of metrics." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/multi-line-chart.png":::

5. You can set up an alert rule that triggers when specific conditions are met by your metrics.
   Refer to guide: [Overview of Azure Monitor alerts - Azure Monitor | Microsoft Learn](/azure/azure-monitor/alerts/alerts-overview)

6. Click on Save to Dashboard, once your chart is complete, else your chart disappears.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/save-to-dashboard.png" alt-text="Screenshot that shows save to dashboard." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/save-to-dashboard.png":::

## Airflow Metrics
The following table lists the metrics available for the Managed Airflow.

Table headings

Metric - The metric display name as it appears in the Azure portal.
Name in Rest API - Metric name as referred to in the REST API.
Unit - Unit of measure.
Aggregation - The default aggregation type. Valid values: Average, Minimum, Maximum, Total, Count.
Dimensions - Dimensions available for the metric.
Time Grains - Intervals at which the metric is sampled. For example, PT1M indicates that the metric is sampled every minute, PT30M every 30 minutes, PT1H every hour, and so on.
DS Export- Whether the metric is exportable to Azure Monitor Logs via Diagnostic Settings.

|Metric|Name in REST API|Description|Unit|Aggregation|Dimensions|Time Grains|DS Export|
|---|---|---|---|---|---|---|
|**Airflow Integration Runtime Celery Task Timeout Error** |`AirflowIntegrationRuntimeCeleryTaskTimeoutError` |Number of `AirflowTaskTimeout` errors raised when publishing Task to Celery Broker. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Collect DB Dags** |`AirflowIntegrationRuntimeCollectDBDags` |Milliseconds taken for fetching all Serialized Dags from DB. |Milliseconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Cpu Percentage** |`AirflowIntegrationRuntimeCpuPercentage` |CPU usage percentage of the Airflow integration runtime. |Percent |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |No|
|**Airflow Integration Runtime Memory Usage** |`AirflowIntegrationRuntimeCpuUsage` |Millicores consumed by Airflow Integration Runtime, indicating the CPU resources used in thousandths of a CPU core. |Millicores |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |Yes|
|**Airflow Integration Runtime Dag Bag Size** |`AirflowIntegrationRuntimeDagBagSize` |Number of DAGs found when the scheduler ran a scan based on its configuration. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Dag Callback Exceptions** |`AirflowIntegrationRuntimeDagCallbackExceptions` |Number of exceptions raised from DAG callbacks. When this happens, it means DAG callback is not working. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG File Refresh Error** |`AirflowIntegrationRuntimeDAGFileRefreshError` |Number of failures loading any DAG files. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Import Errors** |`AirflowIntegrationRuntimeDAGProcessingImportErrors` |Number of errors from trying to parse DAG files. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Last Duration** |`AirflowIntegrationRuntimeDAGProcessingLastDuration` |Seconds taken to load the given DAG file. |Milliseconds |Average |`IntegrationRuntimeName`, `DagFile`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Last Run Seconds Ago** |`AirflowIntegrationRuntimeDAGProcessingLastRunSecondsAgo` |Seconds since <dag_file> was last processed. |Seconds |Average |`IntegrationRuntimeName`, `DagFile`|PT1M |No|
|**Airflow Integration Runtime DAG ProcessingManager Stalls** |`AirflowIntegrationRuntimeDAGProcessingManagerStalls` |Number of stalled DagFileProcessorManager. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Processes** |`AirflowIntegrationRuntimeDAGProcessingProcesses` |Relative number of currently running DAG parsing processes (ie this delta is negative when, since the last metric was sent, processes have completed). |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Processor Timeouts** |`AirflowIntegrationRuntimeDAGProcessingProcessorTimeouts` |Number of file processors that have been killed due to taking too long. |Seconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Total Parse Time** |`AirflowIntegrationRuntimeDAGProcessingTotalParseTime` |Seconds taken to scan and import dag_processing.file_path_queue_size DAG files. |Seconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Run Dependency Check** |`AirflowIntegrationRuntimeDAGRunDependencyCheck` |Milliseconds taken to check DAG dependencies. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Duration Failed** |`AirflowIntegrationRuntimeDAGRunDurationFailed` |Seconds taken for a DagRun to reach failed state. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Duration Success** |`AirflowIntegrationRuntimeDAGRunDurationSuccess` |Seconds taken for a DagRun to reach success state. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run First Task Scheduling Delay** |`AirflowIntegrationRuntimeDAGRunFirstTaskSchedulingDelay` |Seconds elapsed between first task start_date and dagrun expected start. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Schedule Delay** |`AirflowIntegrationRuntimeDAGRunScheduleDelay` |Seconds of delay between the scheduled DagRun start date and the actual DagRun start date. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Executor Open Slots** |`AirflowIntegrationRuntimeExecutorOpenSlots` |Number of open slots on executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Executor Queued Tasks** |`AirflowIntegrationRuntimeExecutorQueuedTasks` |Number of queued tasks on executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Executor Running Tasks** |`AirflowIntegrationRuntimeExecutorRunningTasks` |Number of running tasks on executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Job End** |`AirflowIntegrationRuntimeJobEnd` |Number of ended <job_name> job, ex. SchedulerJob, LocalTaskJob. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Heartbeat Failure** |`AirflowIntegrationRuntimeJobHeartbeatFailure` |Number of failed Heartbeats for a <job_name> job, ex. SchedulerJob, LocalTaskJob. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Job Start** |`AirflowIntegrationRuntimeJobStart` |Number of started <job_name> job, ex. SchedulerJob, LocalTaskJob. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Memory Percentage** |`AirflowIntegrationRuntimeMemoryPercentage` |Memory Percentage used by Airflow Integration Runtime environments. |Percent |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |Yes|
|**Airflow Integration Runtime Node Count** |`AirflowIntegrationRuntimeNodeCount` | |Count |Average |`IntegrationRuntimeName`, `ComputeNodeSize`|PT1M |Yes|
|**Airflow Integration Runtime Operator Failures** |`AirflowIntegrationRuntimeOperatorFailures` |Total Operator failures. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Operator Successes** |`AirflowIntegrationRuntimeOperatorSuccesses` |Total Operator successes. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Pool Open Slots** |`AirflowIntegrationRuntimePoolOpenSlots` |Number of open slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Queued Slots** |`AirflowIntegrationRuntimePoolQueuedSlots` |Number of queued slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Running Slots** |`AirflowIntegrationRuntimePoolRunningSlots` |Number of running slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Starving Tasks** |`AirflowIntegrationRuntimePoolStarvingTasks` |Number of starving tasks in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Scheduler Critical Section Busy** |`AirflowIntegrationRuntimeSchedulerCriticalSectionBusy` |Count of times a scheduler process tried to get a lock on the critical section (needed to send tasks to the executor) and found it locked by another process. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Critical Section Duration** |`AirflowIntegrationRuntimeSchedulerCriticalSectionDuration` |Milliseconds spent in the critical section of scheduler loop – only a single scheduler can enter this loop at a time. |Milliseconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Failed SLA Email Attempts** |`AirflowIntegrationRuntimeSchedulerFailedSLAEmailAttempts` |Number of failed SLA miss email notification attempts. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Heartbeats** |`AirflowIntegrationRuntimeSchedulerHeartbeat` |Scheduler heartbeats. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Orphaned Tasks Adopted** |`AirflowIntegrationRuntimeSchedulerOrphanedTasksAdopted` |Number of Orphaned tasks adopted by the Scheduler. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Orphaned Tasks Cleared** |`AirflowIntegrationRuntimeSchedulerOrphanedTasksCleared` |Number of Orphaned tasks cleared by the Scheduler. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Executable** |`AirflowIntegrationRuntimeSchedulerTasksExecutable` |Number of tasks that are ready for execution (set to queued) with respect to pool limits, DAG concurrency, executor state, and priority. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Killed Externally** |`AirflowIntegrationRuntimeSchedulerTasksKilledExternally` |Number of tasks killed externally. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Running** |`AirflowIntegrationRuntimeSchedulerTasksRunning` | |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Starving** |`AirflowIntegrationRuntimeSchedulerTasksStarving` |Number of tasks that cannot be scheduled because of no open slot in pool. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Started Task Instances** |`AirflowIntegrationRuntimeStartedTaskInstances` | |Count |Total |`IntegrationRuntimeName`, `DagId`, `TaskId`|PT1M |No|
|**Airflow Integration Runtime Task Instance Created Using Operator** |`AirflowIntegrationRuntimeTaskInstanceCreatedUsingOperator` |Number of tasks instances created for a given Operator. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Task Instance Duration** |`AirflowIntegrationRuntimeTaskInstanceDuration` | |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`, `TaskID`|PT1M |No|
|**Airflow Integration Runtime Task Instance Failures** |`AirflowIntegrationRuntimeTaskInstanceFailures` |Overall task instances failures |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Instance Finished** |`AirflowIntegrationRuntimeTaskInstanceFinished` |Overall task instances finished. |Count |Total |`IntegrationRuntimeName`, `DagId`, `TaskId`, `State`|PT1M |No|
|**Airflow Integration Runtime Task Instance Previously Succeeded** |`AirflowIntegrationRuntimeTaskInstancePreviouslySucceeded` |Number of previously succeeded task instances. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Instance Successes** |`AirflowIntegrationRuntimeTaskInstanceSuccesses` |Overall task instances successes. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Removed From DAG** |`AirflowIntegrationRuntimeTaskRemovedFromDAG` |Number of tasks removed for a given dag (i.e. task no longer exists in DAG). |Count |Total |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Task Restored To DAG** |`AirflowIntegrationRuntimeTaskRestoredToDAG` |Number of tasks restored for a given dag (i.e. task instance which was previously in REMOVED state in the DB is added to DAG file). |Count |Total |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Triggers Blocked Main Thread** |`AirflowIntegrationRuntimeTriggersBlockedMainThread` |Number of triggers that blocked the main thread (likely due to not being fully asynchronous). |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Failed** |`AirflowIntegrationRuntimeTriggersFailed` |Number of triggers that errored before they could fire an event. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Running** |`AirflowIntegrationRuntimeTriggersRunning` |Number of triggers currently running for a triggerer (described by hostname). |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Succeeded** |`AirflowIntegrationRuntimeTriggersSucceeded` |Number of triggers that have fired at least one event. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Zombie Tasks Killed** |`AirflowIntegrationRuntimeZombiesKilled` |Zombie tasks killed |Count |Total |`IntegrationRuntimeName`|PT1M |No|


For more information: [https://learn.microsoft.com/azure/azure-monitor/reference/supported-metrics/microsoft-datafactory-factories-metrics](/azure/azure-monitor/reference/supported-metrics/microsoft-datafactory-factories-metrics)
