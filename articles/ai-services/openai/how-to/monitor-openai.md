---
title: Monitor Azure OpenAI Service
description: Start here to learn how to use Azure Monitor tools like Log Analytics to capture and analyze metrics and data logs for your Azure OpenAI Service.
ms.date: 08/20/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: conceptual
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
---

# Monitor Azure OpenAI

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Dashboards

Azure OpenAI provides out-of-box dashboards for each of your Azure OpenAI resources. To access the monitoring dashboards sign-in to [https://portal.azure.com](https://portal.azure.com) and select the overview pane for one of your Azure OpenAI resources.

:::image type="content" source="../media/monitoring/dashboard.png" alt-text="Screenshot that shows out-of-box dashboards for an Azure OpenAI resource in the Azure portal." lightbox="../media/monitoring/dashboard.png" border="false":::

The dashboards are grouped into four categories: **HTTP Requests**, **Tokens-Based Usage**, **PTU Utilization**, and **Fine-tuning**

## Data collection and routing in Azure Monitor

Azure OpenAI collects the same kinds of monitoring data as other Azure resources. You can configure Azure Monitor to generate data in activity logs, resource logs, virtual machine logs, and platform metrics. For more information, see [Monitoring data from Azure resources](/azure/azure-monitor/essentials/monitor-azure-resource#monitoring-data-from-azure-resources).

Platform metrics and the Azure Monitor activity log are collected and stored automatically. This data can be routed to other locations by using a diagnostic setting. Azure Monitor resource logs aren't collected and stored until you create a diagnostic setting and then route the logs to one or more locations.

When you create a diagnostic setting, you specify which categories of logs to collect. For more information about creating a diagnostic setting by using the Azure portal, the Azure CLI, or PowerShell, see [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/platform/diagnostic-settings).

Keep in mind that using diagnostic settings and sending data to Azure Monitor Logs has other costs associated with it. For more information, see [Azure Monitor Logs cost calculations and options](/azure/azure-monitor/logs/cost-logs).

The metrics and logs that you can collect are described in the following sections.

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure OpenAI, see [Azure OpenAI monitoring data reference](../monitor-openai-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

Azure OpenAI has commonality with a subset of Azure AI services. For a list of available metrics for Azure OpenAI, see [Azure OpenAI monitoring data reference](../monitor-openai-reference.md#metrics).

<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure OpenAI, see [Azure OpenAI monitoring data reference](../monitor-openai-reference.md#resource-logs).

<!-- OPTIONAL. If your service doesn't collect Azure Monitor resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)] -->

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

### Configure diagnostic settings

All of the metrics are exportable with [diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings). To analyze logs and metrics data with Azure Monitor Log Analytics queries, you need to configure diagnostic settings for your Azure OpenAI resource and your Log Analytics workspace.

:::image type="content" source="../media/monitoring/monitor-add-diagnostic-setting.png" alt-text="Screenshot that shows how to open the Diagnostic setting page for an Azure OpenAI resource in the Azure portal." border="false":::

After you configure the diagnostic settings, you can work with metrics and log data for your Azure OpenAI resource in your Log Analytics workspace.

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

After you deploy an Azure OpenAI model, you can send some completions calls by using the **playground** environment in [Azure AI Studio](https://oai.azure.com/).

:::image type="content" source="../media/monitoring/azure-openai-studio-playground.png" alt-text="Screenshot that shows how to generate completions for an Azure OpenAI resource in the Azure OpenAI Studio playground." lightbox="../media/monitoring/azure-openai-studio-playground.png" border="false":::

Any text that you enter in the **Completions playground** or the **Chat completions playground** generates metrics and log data for your Azure OpenAI resource. In the Log Analytics workspace for your resource, you can query the monitoring data by using the [Kusto](/azure/data-explorer/kusto/query/) query language.

> [!IMPORTANT]
> The **Open query** option on the Azure OpenAI resource page browses to Azure Resource Graph, which isn't described in this article.
> The following queries use the query environment for Log Analytics. Be sure to follow the steps in [Configure diagnostic settings](#configure-diagnostic-settings) to prepare your Log Analytics workspace.

1. From your Azure OpenAI resource page, under **Monitoring** on the left pane, select **Logs**.
1. Select the Log Analytics workspace that you configured with diagnostics for your Azure OpenAI resource.
1. From the **Log Analytics workspace** page, under **Overview** on the left pane, select **Logs**.

   The Azure portal displays a **Queries** window with sample queries and suggestions by default. You can close this window.

For the following examples, enter the Kusto query into the edit region at the top of the **Query** window, and then select **Run**. The query results display below the query text.

The following Kusto query is useful for an initial analysis of Azure Diagnostics (`AzureDiagnostics`) data about your resource:

```kusto
AzureDiagnostics
| take 100
| project TimeGenerated, _ResourceId, Category, OperationName, DurationMs, ResultSignature, properties_s
```

This query returns a sample of 100 entries and displays a subset of the available columns of data in the logs. In the query results, you can select the arrow next to the table name to view all available columns and associated data types.

:::image type="content" source="../media/monitoring/log-analytics-diagnostics-query.png" alt-text="Screenshot that shows the Log Analytics query results for Azure Diagnostics data about the Azure OpenAI resource." lightbox="../media/monitoring/log-analytics-diagnostics-query.png":::

To see all available columns of data, you can remove the scoping parameters line `| project ...` from the query:

```kusto
AzureDiagnostics
| take 100
```

To examine the Azure Metrics (`AzureMetrics`) data for your resource, run the following query:

```kusto
AzureMetrics
| take 100
| project TimeGenerated, MetricName, Total, Count, Maximum, Minimum, Average, TimeGrain, UnitName
```

The query returns a sample of 100 entries and displays a subset of the available columns of Azure Metrics data:

:::image type="content" source="../media/monitoring/log-analytics-metrics-query.png" alt-text="Screenshot that shows the Log Analytics query results for Azure Metrics data about the Azure OpenAI resource." lightbox="../media/monitoring/log-analytics-metrics-query.png":::

> [!NOTE]
> When you select **Monitoring** > **Logs** in the Azure OpenAI menu for your resource, Log Analytics opens with the query scope set to the current resource. The visible log queries include data from that specific resource only. To run a query that includes data from other resources or data from other Azure services, select **Logs** from the **Azure Monitor** menu in the Azure portal. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](../../../azure-monitor/logs/scope.md) for details.

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Set up alerts

Every organization's alerting needs vary and can change over time. Generally, all alerts should be actionable and have a specific intended response if the alert occurs. If an alert doesn't require an immediate response, the condition can be captured in a report rather than an alert. Some use cases might require alerting anytime certain error conditions exist. In other cases, you might need alerts for errors that exceed a certain threshold for a designated time period.

Errors below certain thresholds can often be evaluated through regular analysis of data in Azure Monitor Logs. As you analyze your log data over time, you might discover that a certain condition doesn't occur for an expected period of time. You can track for this condition by using alerts. Sometimes the absence of an event in a log is just as important a signal as an error.

Depending on what type of application you're developing with your use of Azure OpenAI, [Azure Monitor Application Insights](../../../azure-monitor/overview.md) might offer more monitoring benefits at the application layer.

### Azure OpenAI alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure OpenAI monitoring data reference](../monitor-openai-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure OpenAI monitoring data reference](../monitor-openai-reference.md) for a reference of the metrics, logs, and other important values created for Azure OpenAI.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See [Understand log searches in Azure Monitor logs](../../../azure-monitor/logs/log-query-overview.md) about logs.
