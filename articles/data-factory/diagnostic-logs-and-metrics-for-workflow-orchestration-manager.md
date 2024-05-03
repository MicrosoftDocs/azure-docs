---
title: Diagnostics logs and metrics for Workflow Orchestration Manager
titleSuffix: Azure Data Factory
description: This article explains how to use diagnostic logs and metrics to monitor the Workflow Orchestration Manager integration runtime.
ms.service: data-factory
ms.topic: how-to
author: nabhishek
ms.author: abnarain
ms.date: 09/28/2023
---

# Diagnostics logs and metrics for Workflow Orchestration Manager

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

This article walks you through the steps to:

- Enable diagnostics logs and metrics for Workflow Orchestration Manager in Azure Data Factory.
- View logs and metrics.
- Run a query.
- Monitor metrics and set the alert system in directed acyclic graph (DAG) failure.

## Prerequisites

You need an Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Enable diagnostics logs and metrics for Workflow Orchestration Manager

1. Open your Data Factory resource and select **Diagnostic settings** on the leftmost pane. Then select **Add diagnostic setting**.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/start-with-diagnostic-logs.png" alt-text="Screenshot that shows where the Diagnostic logs tab is located in Data Factory." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/start-with-diagnostic-logs.png":::

1. Fill out the **Diagnostic settings** name. Select the following categories for the Airflow logs:

   - Airflow task execution logs
   - Airflow worker logs
   - Airflow DAG processing logs
   - Airflow scheduler logs
   - Airflow web logs
   - If you select **AllMetrics**, various Data Factory metrics are made available for you to monitor or raise alerts on. These metrics include the metrics for Data Factory activity and the Workflow Orchestration Manager integration runtime, such as `AirflowIntegrationRuntimeCpuUsage` and `AirflowIntegrationRuntimeMemory`.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/select-log-category-and-all-metrics.png" alt-text="Screenshot that shows which logs to select for the Airflow environment." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/select-log-category-and-all-metrics.png":::

1. Under **Destination details**, select the **Send to Log Analytics workspace** checkbox.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/select-log-analytics-workspace.png" alt-text="Screenshot that shows selecting Log Analytics workspace as the destination for diagnostic logs." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/select-log-analytics-workspace.png":::

1. Select **Save**.

## View logs

1. After you add diagnostic settings, you can find them listed in the **Diagnostic setting** section. To access and view logs, select the Log Analytics workspace that you configured.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/01-click-on-log-analytics-workspace.png" alt-text="Screenshot that shows selecting the Log Analytics workspace URL." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/01-click-on-log-analytics-workspace.png":::

1. Under the section **Maximize your Log Analytics experience**, select **View logs**.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/02-view-logs.png" alt-text="Screenshot that shows selecting View logs." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/02-view-logs.png":::

1. You're directed to your Log Analytics workspace where you can see that the tables you selected were imported into the workspace automatically.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/03-log-analytics-workspace.png" alt-text="Screenshot that shows the Log Analytics workspace." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/03-log-analytics-workspace.png":::

Other useful links for the schema:

- [Azure Monitor Logs reference - ADFAirflowSchedulerLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/ADFAirflowSchedulerLogs)
- [Azure Monitor Logs reference - ADFAirflowTaskLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowtasklogs)
- [Azure Monitor Logs reference - ADFAirflowWebLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowweblogs)
- [Azure Monitor Logs reference - ADFAirflowWorkerLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/adfairflowworkerlogs)
- [Azure Monitor Logs reference - AirflowDagProcessingLogs | Microsoft Learn](/azure/azure-monitor/reference/tables/AirflowDagProcessingLogs)

## Write a query

1. Let's start with the simplest query that returns all the records in `ADFAirflowTaskLogs`. You can double-click the table name to add it to a query window. You can also enter the table name directly in the window.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/simple-query.png" alt-text="Screenshot that shows a Kusto query to retrieve all logs." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/simple-query.png":::

1. To narrow down your search results, such as filtering them based on a specific task ID, you can use the following query:

    ```kusto
    ADFAirflowTaskLogs
    | where DagId == "<your_dag_id>"
    and TaskId == "<your_task_id>"
    ```

Similarly, you can create custom queries according to your needs by using any tables available in `LogManagement`.

For more information, see:

- [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)
- [Kusto Query Language (KQL) overview - Azure Data Explorer | Microsoft Learn](/azure/data-explorer/kusto/query/)

## Monitor metrics

Data Factory offers comprehensive metrics for Airflow integration runtimes, allowing you to effectively monitor the performance of your Airflow integration runtime and establish alerting mechanisms as needed.

1. Open your Data Factory resource.

1. In the leftmost pane, under the **Monitoring** section, select **Metrics**.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/metrics-in-data-factory-studio.png" alt-text="Screenshot that shows where the Metrics tab is located in Data Factory." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/metrics-in-data-factory-studio.png":::

1. Select the **Scope** > **Metric Namespace** > **Metric** you want to monitor.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/monitor-metrics.png" alt-text="Screenshot that shows the metrics to select." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/monitor-metrics.png":::

1. Review the multiline chart that visualizes the **Integration Runtime CPU Percentage** and **Integration Runtime Dag Bag Size**.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/multi-line-chart.png" alt-text="Screenshot that shows multiline chart of metrics." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/multi-line-chart.png":::

1. You can set up an alert rule that triggers when your metrics meet specific conditions.
   For more information, see [Overview of Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

1. Select **Save to dashboard** after your chart is finished or else your chart disappears.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/save-to-dashboard.png" alt-text="Screenshot that shows Save to dashboard." lightbox="media/diagnostics-logs-and-metrics-for-workflow-orchestration-manager/save-to-dashboard.png":::

## Airflow metrics

The following table lists the metrics available for Workflow Orchestration Manager. The table headings are:

- **Metric**: The metric display name as it appears in the Azure portal.
- **Name in REST API**: The metric name as referred to in the REST API.
- **Description**: A description of the metric.
- **Unit**: Unit of measure.
- **Aggregation**: The default aggregation type. Valid values are Average, Minimum, Maximum, Total, and Count.
- **Dimensions**: Dimensions available for the metric.
- **Time grains**: Intervals at which the metric is sampled. For example, PT1M indicates that the metric is sampled every minute, PT30M every 30 minutes, PT1H every hour, and so on.
- **DS export**: Whether the metric is exportable to Azure Monitor Logs via diagnostic settings.

|Metric|Name in REST API|Description|Unit|Aggregation|Dimensions|Time grains|DS export|
|---|---|---|---|---|---|---|
|**Airflow Integration Runtime Celery Task Timeout Error** |`AirflowIntegrationRuntimeCeleryTaskTimeoutError` |Number of `AirflowTaskTimeout` errors raised when publishing Task to Celery Broker. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Collect DB Dags** |`AirflowIntegrationRuntimeCollectDBDags` |Milliseconds taken for fetching all Serialized DAGs from database. |Milliseconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Cpu Percentage** |`AirflowIntegrationRuntimeCpuPercentage` |CPU usage percentage of the Airflow integration runtime. |Percent |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |No|
|**Airflow Integration Runtime Memory Usage** |`AirflowIntegrationRuntimeCpuUsage` |Millicores consumed by Airflow integration runtime, indicating the CPU resources used in thousandths of a CPU core. |Millicores |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |Yes|
|**Airflow Integration Runtime Dag Bag Size** |`AirflowIntegrationRuntimeDagBagSize` |Number of DAGs found when the scheduler ran a scan based on its configuration. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Dag Callback Exceptions** |`AirflowIntegrationRuntimeDagCallbackExceptions` |Number of exceptions raised from DAG callbacks. When exceptions occur, it means DAG callback isn't working. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG File Refresh Error** |`AirflowIntegrationRuntimeDAGFileRefreshError` |Number of failures loading any DAG files. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Import Errors** |`AirflowIntegrationRuntimeDAGProcessingImportErrors` |Number of errors from trying to parse DAG files. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Last Duration** |`AirflowIntegrationRuntimeDAGProcessingLastDuration` |Seconds taken to load the specific DAG file. |Milliseconds |Average |`IntegrationRuntimeName`, `DagFile`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Last Run Seconds Ago** |`AirflowIntegrationRuntimeDAGProcessingLastRunSecondsAgo` |Seconds since <dag_file> was last processed. |Seconds |Average |`IntegrationRuntimeName`, `DagFile`|PT1M |No|
|**Airflow Integration Runtime DAG ProcessingManager Stalls** |`AirflowIntegrationRuntimeDAGProcessingManagerStalls` |Number of stalled `DagFileProcessorManager`. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Processes** |`AirflowIntegrationRuntimeDAGProcessingProcesses` |Relative number of currently running DAG parsing processes. (For example, this delta is negative when, since the last metric was sent, processes were completed.) |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Processor Timeouts** |`AirflowIntegrationRuntimeDAGProcessingProcessorTimeouts` |Number of file processors that were killed because they took too long. |Seconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Processing Total Parse Time** |`AirflowIntegrationRuntimeDAGProcessingTotalParseTime` |Seconds taken to scan and import `dag_processing.file_path_queue_size` DAG files. |Seconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime DAG Run Dependency Check** |`AirflowIntegrationRuntimeDAGRunDependencyCheck` |Milliseconds taken to check DAG dependencies. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Duration Failed** |`AirflowIntegrationRuntimeDAGRunDurationFailed` |Seconds taken for a `DagRun` to reach failed state. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Duration Success** |`AirflowIntegrationRuntimeDAGRunDurationSuccess` |Seconds taken for a `DagRun` to reach success state. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run First Task Scheduling Delay** |`AirflowIntegrationRuntimeDAGRunFirstTaskSchedulingDelay` |Seconds elapsed between the first task `start_date` and the `DagRun` expected start. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime DAG Run Schedule Delay** |`AirflowIntegrationRuntimeDAGRunScheduleDelay` |Seconds of delay between the scheduled `DagRun` start date and the actual `DagRun` start date. |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Executor Open Slots** |`AirflowIntegrationRuntimeExecutorOpenSlots` |Number of open slots on the executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Executor Queued Tasks** |`AirflowIntegrationRuntimeExecutorQueuedTasks` |Number of queued tasks on the executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Executor Running Tasks** |`AirflowIntegrationRuntimeExecutorRunningTasks` |Number of running tasks on the executor. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Job End** |`AirflowIntegrationRuntimeJobEnd` |Number of ended <job_name> job, for example, `SchedulerJob` and `LocalTaskJob`. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Heartbeat Failure** |`AirflowIntegrationRuntimeJobHeartbeatFailure` |Number of failed Heartbeats for a <job_name> job, for example, `SchedulerJob` and `LocalTaskJob`. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Job Start** |`AirflowIntegrationRuntimeJobStart` |Number of started <job_name> jobs, for example, `SchedulerJob` and `LocalTaskJob`. |Count |Total |`IntegrationRuntimeName`, `Job`|PT1M |No|
|**Airflow Integration Runtime Memory Percentage** |`AirflowIntegrationRuntimeMemoryPercentage` |Memory Percentage used by Airflow integration runtime environments. |Percent |Average |`IntegrationRuntimeName`, `ContainerName`|PT1M |Yes|
|**Airflow Integration Runtime Node Count** |`AirflowIntegrationRuntimeNodeCount` | |Count |Average |`IntegrationRuntimeName`, `ComputeNodeSize`|PT1M |Yes|
|**Airflow Integration Runtime Operator Failures** |`AirflowIntegrationRuntimeOperatorFailures` |Total operator failures. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Operator Successes** |`AirflowIntegrationRuntimeOperatorSuccesses` |Total operator successes. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Pool Open Slots** |`AirflowIntegrationRuntimePoolOpenSlots` |Number of open slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Queued Slots** |`AirflowIntegrationRuntimePoolQueuedSlots` |Number of queued slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Running Slots** |`AirflowIntegrationRuntimePoolRunningSlots` |Number of running slots in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Pool Starving Tasks** |`AirflowIntegrationRuntimePoolStarvingTasks` |Number of starving tasks in the pool. |Count |Total |`IntegrationRuntimeName`, `Pool`|PT1M |No|
|**Airflow Integration Runtime Scheduler Critical Section Busy** |`AirflowIntegrationRuntimeSchedulerCriticalSectionBusy` |Count of times a scheduler process tried to get a lock on the critical section (needed to send tasks to the executor) and found it locked by another process. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Critical Section Duration** |`AirflowIntegrationRuntimeSchedulerCriticalSectionDuration` |Milliseconds spent in the critical section of a scheduler loop. Only a single scheduler can enter this loop at a time. |Milliseconds |Average |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Failed SLA Email Attempts** |`AirflowIntegrationRuntimeSchedulerFailedSLAEmailAttempts` |Number of failed SLA miss email notification attempts. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Heartbeats** |`AirflowIntegrationRuntimeSchedulerHeartbeat` |Scheduler heartbeats. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Orphaned Tasks Adopted** |`AirflowIntegrationRuntimeSchedulerOrphanedTasksAdopted` |Number of orphaned tasks adopted by the Scheduler. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Orphaned Tasks Cleared** |`AirflowIntegrationRuntimeSchedulerOrphanedTasksCleared` |Number of orphaned tasks cleared by the Scheduler. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Executable** |`AirflowIntegrationRuntimeSchedulerTasksExecutable` |Number of tasks that are ready for execution (set to queued) with respect to pool limits, DAG concurrency, executor state, and priority. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Killed Externally** |`AirflowIntegrationRuntimeSchedulerTasksKilledExternally` |Number of tasks killed externally. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Running** |`AirflowIntegrationRuntimeSchedulerTasksRunning` | |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Scheduler Tasks Starving** |`AirflowIntegrationRuntimeSchedulerTasksStarving` |Number of tasks that can't be scheduled because of no open slot in the pool. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Started Task Instances** |`AirflowIntegrationRuntimeStartedTaskInstances` | |Count |Total |`IntegrationRuntimeName`, `DagId`, `TaskId`|PT1M |No|
|**Airflow Integration Runtime Task Instance Created Using Operator** |`AirflowIntegrationRuntimeTaskInstanceCreatedUsingOperator` |Number of task instances created for a specific operator. |Count |Total |`IntegrationRuntimeName`, `Operator`|PT1M |No|
|**Airflow Integration Runtime Task Instance Duration** |`AirflowIntegrationRuntimeTaskInstanceDuration` | |Milliseconds |Average |`IntegrationRuntimeName`, `DagId`, `TaskID`|PT1M |No|
|**Airflow Integration Runtime Task Instance Failures** |`AirflowIntegrationRuntimeTaskInstanceFailures` |Overall task instances failures. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Instance Finished** |`AirflowIntegrationRuntimeTaskInstanceFinished` |Overall task instances finished. |Count |Total |`IntegrationRuntimeName`, `DagId`, `TaskId`, `State`|PT1M |No|
|**Airflow Integration Runtime Task Instance Previously Succeeded** |`AirflowIntegrationRuntimeTaskInstancePreviouslySucceeded` |Number of previously succeeded task instances. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Instance Successes** |`AirflowIntegrationRuntimeTaskInstanceSuccesses` |Overall task instance successes. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Task Removed From DAG** |`AirflowIntegrationRuntimeTaskRemovedFromDAG` |Number of tasks removed for a specific DAG. (That is, the task no longer exists in DAG.) |Count |Total |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Task Restored To DAG** |`AirflowIntegrationRuntimeTaskRestoredToDAG` |Number of tasks restored for a specific DAG. (That is, a task instance that was previously in a REMOVED state in the database is added to a DAG file.) |Count |Total |`IntegrationRuntimeName`, `DagId`|PT1M |No|
|**Airflow Integration Runtime Triggers Blocked Main Thread** |`AirflowIntegrationRuntimeTriggersBlockedMainThread` |Number of triggers that blocked the main thread (likely because they weren't fully asynchronous). |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Failed** |`AirflowIntegrationRuntimeTriggersFailed` |Number of triggers that errored before they could fire an event. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Running** |`AirflowIntegrationRuntimeTriggersRunning` |Number of triggers currently running for a triggerer (described by hostname). |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Triggers Succeeded** |`AirflowIntegrationRuntimeTriggersSucceeded` |Number of triggers that fired at least one event. |Count |Total |`IntegrationRuntimeName`|PT1M |No|
|**Airflow Integration Runtime Zombie Tasks Killed** |`AirflowIntegrationRuntimeZombiesKilled` |Zombie tasks killed. |Count |Total |`IntegrationRuntimeName`|PT1M |No|

For more information, see [Supported metrics for Microsoft.DataFactory/factories](/azure/azure-monitor/reference/supported-metrics/microsoft-datafactory-factories-metrics).
