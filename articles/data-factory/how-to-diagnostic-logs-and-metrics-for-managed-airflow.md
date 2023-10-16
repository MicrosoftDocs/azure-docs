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

2. How to view logs and metrics.

3. How to run a query.

4. How to monitor metrics and set the alert system in Dag failure.

## How to enable Diagnostics logs and metrics for the Managed Airflow

1. Open your Azure Data Factory resource -> Select **Diagnostic settings** on the left navigation pane -> Select “Add Diagnostic setting.”

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/start-with-diagnostic-logs.png" alt-text="Screenshot that shows where diagnostic logs tab is located in data factory." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/start-with-diagnostic-logs.png":::

2. Fill out the Diagnostic settings name -> Select the following categories for the Airflow Logs

   - Airflow task execution logs
   - Airflow worker logs
   - Airflow dag processing logs
   - Airflow scheduler logs
   - Airflow web logs
   - If you select **AllMetrics**, various Data Factory metrics are made available for you to monitor or raise alerts on. These metrics include the metrics for Data Factory activity and Managed Airflow IR such as AirflowIntegrationRuntimeCpuUsage, AirflowIntegrationRuntimeMemory.

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-category-and-all-metrics.png" alt-text="Screenshot that shows which logs to select for Airflow environment." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-category-and-all-metrics.png":::

3. Select the destination details, Log Analytics workspace:

   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-analytics-workspace.png" alt-text="Screenshot that shows select log analytics workspace as destination for diagnostic logs." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/select-log-analytics-workspace.png":::

4. Click on Save.

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

1. [https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-tutorial](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-tutorial)

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

6. Click on Save to Dashboard, once your chat is complete, else your chart disappears.
   :::image type="content" source="media/diagnostics-logs-and-metrics-for-managed-airflow/save-to-dashboard.png" alt-text="Screenshot that shows save to dashboard." lightbox="media/diagnostics-logs-and-metrics-for-managed-airflow/save-to-dashboard.png":::

For more information: [https://learn.microsoft.com/azure/azure-monitor/reference/supported-metrics/microsoft-datafactory-factories-metrics](/azure/azure-monitor/reference/supported-metrics/microsoft-datafactory-factories-metrics)
