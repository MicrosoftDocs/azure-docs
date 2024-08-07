---
title: Diagnostics logs and metrics for Workflow Orchestration Manager
titleSuffix: Azure Data Factory
description: This article explains how to use diagnostic logs and metrics to monitor the Workflow Orchestration Manager integration runtime.
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

To see the metrics available for Workflow Orchestration Manager, view the *Airflow* metrics listed in the [Supported metrics](monitor-data-factory-reference.md#supported-metrics-for-microsoftdatafactoryfactories) table.
