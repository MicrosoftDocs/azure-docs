---
title: Monitoring Copy Logs in Azure Storage Mover
description: Learn how to monitor the status of Azure Storage Mover migration jobs.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/20/2023
---

# Monitoring Azure Storage Mover copy and job logs

When you use a migration tool to move your critical data from on-premises sources to Azure destination targets, you want to monitor copy operations for outages and errors. Monitoring includes metrics and logs that provide visibility into the success of your migration. **Copy logs** and **Job run logs** are especially useful because they allow you to trace the migration result of individual files. Metrics relating to **Job run metrics** are also available, and can be analyzed to help pinpoint periods of low performance and other trends.

Logs and metrics can be sent or streamed to the destinations listed in the following table. To ensure the security of data in transit, we strongly encourage you to configure Transport Layer Security (TLS). All destination endpoints support TLS 1.2.

| Destination                           | Description |
|:--------------------------------------|:------------|
| **Log Analytics workspace**           | Metrics are converted to log form. This option might not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.
| **Azure Storage account**             | Archiving logs and metrics to a Storage account is useful for audit, static analysis, or backup. Compared to using Azure Monitor Logs or a Log Analytics workspace, Storage is less expensive, and logs can be kept there indefinitely.  |
| **Azure Event Hubs**                  | When you send logs and metrics to Event Hubs, you can stream data to external systems such as third-party SIEMs and other Log Analytics solutions.  |
| **Azure Monitor partner integrations**| Specialized integrations can be made between Azure Monitor and other non-Microsoft monitoring platforms. Integration is useful when you're already using one of the partners.  |

This article describes the monitoring data reported from Azure Storage Mover, and how you can use the features of Azure Monitor to analyze errors during the migration. All other destinations are outside the scope of this article, but can be referenced in the [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring&tabs=portal) article.

## What is Azure Monitor?

Azure Storage Mover sends copy and job run monitoring data to Azure Monitor, Azure's full stack monitoring service. The Azure Monitor service provides a complete set of features to monitor your Azure resources and resources in other clouds and on-premises.

One of Azure Monitor's most useful features is the Log Analytics tool. The Log Analytics tool is designed to help you monitor your migration projects by enabling you to  edit and run log queries against your copy and job logs.

You can read more about Azure Monitor by visiting the [Azure Monitor overview](../azure-monitor/overview.md) article.

## Configuring Azure Monitor and Storage Mover

Before you can view the logs generated during your migration, you need to ensure that you've configured both Azure Monitor and your Storage Mover instance. This section briefly describes how to configure an Azure Monitor Log Analytics Workspace and Storage Mover diagnostic settings. After completing the following steps, you'll be able to query the data provided by your Storage Mover resource.

### Create a Log Analytics workspace

Storage Mover collects copy and job logs, and stores the information in an Azure Log Analytics workspace. You can create multiple workspaces, but each workspace must have a unique workspace ID and resource ID for a given resource group. After you've created a workspace, you can configure Storage Mover to save its data there. If you don't have an existing workspace, you can quickly create one in the Azure portal.

Enter **Log Analytics** in the search box and select **Log Analytics workspace**. In the content pane, select either **Create** or **Create log analytics workspace** to create a workspace. Provide values for the **Subscription**, **Resource Group**, **Name**, and **Region** fields, and select **Review + Create**.

:::image type="content" source="media/log-monitoring/workspace-create-sml.png" lightbox="media/log-monitoring/workspace-create-lrg.png" alt-text="This image illustrates the methods of creating an Azure Analytics Workspace." :::

You can get more detailed information about Log Analytics and its features by visiting the [Log Analytics overview](/azure/azure-monitor/logs/log-analytics-overview) article. If you prefer to view a tutorial, you can visit the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial) instead.

### Configure Storage Mover diagnostic settings

After an analytics workspace has been created, you can specify it as the destination in which Storage Mover logs and metrics can be displayed.

There are two options for configuring Storage Mover to send logs to your analytics workspace. First, you can configure diagnostic settings during the initial deployment of your top-level Storage Mover resource. The following example shows how to specify diagnostic settings in the Azure portal during Storage Mover resource creation.

:::image type="content" source="media/log-monitoring/monitoring-configure-sml.png" lightbox="media/log-monitoring/monitoring-configure-lrg.png" alt-text="This image highlights the ability to enable monitoring during initial deployment." :::

You may also choose to add a diagnostic setting to a Storage Mover resource after it's been deployed. To add the diagnostic setting, navigate to the Storage Mover resource. In the menu pane, select **Diagnostic settings** and then select **Add diagnostic setting** as shown in the following example.

:::image type="content" source="media/log-monitoring/diagnostic-settings-sml.png" lightbox="media/log-monitoring/diagnostic-settings-lrg.png" alt-text="This image highlights the ability to add a diagnostic setting after deployment." :::

In the **Diagnostic setting** pane, provide a value for the **Diagnostic setting name**. Within the **Logs** group, select one or more log categories to be collected. You may also select the **Job runs** option within the **Metrics** group to view the results of your individual job runs. Within the **Destination details** group, select **Send to Log Analytics workspace**, the name of your subscription, and the name of the Log Analytics workspace to collect your log data. Finally, select **Save** to add your new diagnostic setting. You can view the image provided as a reference.

:::image type="content" source="media/log-monitoring/setting-add-sml.png" lightbox="media/log-monitoring/setting-add-lrg.png" alt-text="This image illustrates the location of the fields required to add a Diagnostic Setting to an existing Storage Mover resource." :::

After your Storage Mover diagnostic setting has been saved, it will be reflected on the Diagnostic settings screen within the **Diagnostic settings** table.

## Analyzing logs

All resource logs in Azure Monitor have the same fields, and are followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](../azure-monitor/essentials/resource-logs-schema.md). 

Storage Mover generates two logs, copy logs and job run logs. 

Storage Mover generates two tables, StorageMoverCopyLogsFailed and StorageMoverJobRunLogs.

The schema for StorageMoverCopyLogsFailed is found in [Azure Storage Copy log data reference](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsFailed).

The schema for StorageMoverJobRunLogs is found in [Azure Storage Job run log data reference](/azure/azure-monitor/reference/tables/StorageMoverJobRunLogs).

Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its file endpoint but not in its table or queue endpoints, only logs that pertain to the Azure Blob Storage service are created. Azure Storage logs contain detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

### Sample Kusto queries

If you send logs to Log Analytics, you can access those logs by using Azure Monitor log queries. For more information, see [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

Here are some queries that you can enter in the **Log search** bar to help you monitor your Blob storage. These queries work with the [new language](../azure-monitor/logs/log-query-overview.md).

> [!IMPORTANT]
> When you select **Logs** from the storage account resource group menu, Log Analytics is opened with the query scope set to the current resource group. This means that log queries will only include data from that resource group. If you want to run a query that includes data from other resources or data from other Azure services, select **Logs** from the **Azure Monitor** menu. See [Log query scope and time range in Azure Monitor Log Analytics](../azure-monitor/logs/scope.md) for details.

Use these queries to help you monitor your Azure Storage accounts:

- To list the 10 most common errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText !contains "Success"
    | summarize count() by StatusText
    | top 10 by count_ desc
    ```

- To list the top 10 operations that caused the most errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText !contains "Success"
    | summarize count() by OperationName
    | top 10 by count_ desc
    ```

- To list the top 10 operations with the longest end-to-end latency over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d)
    | top 10 by DurationMs desc
    | project TimeGenerated, OperationName, DurationMs, ServerLatencyMs, ClientLatencyMs = DurationMs - ServerLatencyMs
    ```

- To list all operations that caused server-side throttling errors over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and StatusText contains "ServerBusy"
    | project TimeGenerated, OperationName, StatusCode, StatusText
    ```

- To list all requests with anonymous access over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d) and AuthenticationType == "Anonymous"
    | project TimeGenerated, OperationName, AuthenticationType, Uri
    ```

- To create a pie chart of operations used over the last three days.

    ```kusto
    StorageBlobLogs
    | where TimeGenerated > ago(3d)
    | summarize count() by OperationName
    | sort by count_ desc
    | render piechart
    ```

## Alerts

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](../azure-monitor/alerts/alerts-metric-overview.md), [logs](../azure-monitor/alerts/alerts-unified-log.md), and the [activity log](../azure-monitor/alerts/activity-log-alerts.md).

The following table lists some example scenarios to monitor and the proper metric to use for the alert:

| Scenario | Metric to use for alert |
|-|-|
| Blob Storage service is throttled. | Metric: Transactions<br>Dimension name: Response type |
| Blob Storage requests are successful 99% of the time. | Metric: Availability<br>Dimension names: Geo type, API name, Authentication |
| Blob Storage egress has exceeded 500 GiB in one day. | Metric: Egress<br>Dimension names: Geo type, API name, Authentication |

## Next steps

Get started with any of these guides.

| Guide | Description |
|---|---|
| [Getting started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) | A tour of Metrics Explorer. 
| [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md) | A tour of Log Analytics. |
| [Azure Monitor Metrics overview](../azure-monitor/essentials/data-platform-metrics.md) | The basics of metrics and metric dimensions  |
| [Azure Monitor Logs overview](../azure-monitor/logs/data-platform-logs.md)| The basics of logs and how to collect and analyze them |
| [Troubleshoot Storage Mover issues](log-monitoring.md)| Common performance issues and guidance about how to troubleshoot them. |