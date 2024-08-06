---
title: Monitor Azure Firewall
description: You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.
ms.date: 08/08/2024
ms.custom: horz-monitor, FY23 content-maintenance
ms.topic: conceptual
author: vhorne
ms.author: victorh
ms.service: azure-firewall
---
# Monitor Azure Firewall

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

You can use Azure Firewall logs and metrics to monitor your traffic and operations within the firewall. These logs and metrics serve several essential purposes, including:

- **Traffic Analysis**: Use logs to examine and analyze the traffic passing through the firewall. This analysis includes examining permitted and denied traffic, inspecting source and destination IP addresses, URLs, port numbers, protocols, and more. These insights are essential for understanding traffic patterns, identifying potential security threats, and troubleshooting connectivity issues.  

- **Performance and Health Metrics**: Azure Firewall metrics provide performance and health metrics, such as data processed, throughput, rule hit count, and latency. Monitor these metrics to assess the overall health of your firewall, identify performance bottlenecks, and detect any anomalies.  

- **Audit Trail**: Activity logs enable auditing of operations related to firewall resources, capturing actions like creating, updating, or deleting firewall rules and policies. Reviewing activity logs helps maintain a historical record of configuration changes and ensures compliance with security and auditing requirements.

<!-- ## Insights. OPTIONAL. If your service has Azure Monitor insights, add the following include and add information about what your insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md#metrics).

<!-- OPTIONAL. If your service doesn't collect Azure Monitor platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)] -->

<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Structured logs

Monitor Azure Firewall using Structured Logs, which use a predefined schema to structure log data for easy searching, filtering, and analysis. These logs include information such as source and destination IP addresses, protocols, port numbers, and firewall actions. Prioritize setting up Structured Logs as your main log type using Resource Specific Tables instead of the existing AzureDiagnostics table. To enable these logs and explore log categories, see [Azure Structured Firewall Logs](firewall-structured-logs.md).  

## Legacy Azure Diagnostics logs

Legacy Azure Diagnostic logs are the original Azure Firewall log queries that output log data in an unstructured or free-form text format. The Azure Firewall legacy log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode), collecting entire data in the [AzureDiagnostics table](/azure/azure-monitor/reference/tables/azurediagnostics). In case both Structured and Diagnostic logs are required, at least two diagnostic settings need to be created per firewall. To enable these logs and explore log categories, see [Azure Firewall diagnostic logs](diagnostic-logs.md).

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

<!-- REQUIRED. Add sample Kusto queries for your service here. -->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

## Alert on Azure Firewall metrics

Metrics provide critical signals to track your resource health. So, it’s important to monitor metrics for your resource and watch out for any anomalies. But what if the Azure Firewall metrics stop flowing? It could indicate a potential configuration issue or something more ominous like an outage. Missing metrics can happen because of publishing default routes that block Azure Firewall from uploading metrics, or the number of healthy instances going down to zero. In this section, you learn how to configure metrics to a log analytics workspace and to alert on missing metrics.

### Configure metrics to a log analytics workspace

The first step is to configure metrics availability to the log analytics workspace using diagnostics settings in the firewall.

 To configure diagnostic settings as shown in the following screenshot, browse to the Azure Firewall resource page. This pushes firewall metrics to the configured workspace.

> [!NOTE]
> The diagnostics settings for metrics must be a separate configuration than logs. Firewall logs can be configured to use Azure Diagnostics or Resource Specific. However, Firewall metrics must always use Azure Diagnostics.

:::image type="content" source="media/logs-and-metrics/firewall-diagnostic-setting.png" alt-text="Screenshot of Azure Firewall diagnostic setting.":::

### Create alert to track receiving firewall metrics without any failures

Browse to the workspace configured in the metrics diagnostics settings. Check if metrics are available using the following query:

```kusto
AzureMetrics
| where MetricName contains "FirewallHealth"
| where ResourceId contains "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/PARALLELIPGROUPRG/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/HUBVNET-FIREWALL"
| where TimeGenerated > ago(30m)
```

Next, create an alert for missing metrics over a time period of 60 minutes. To set up new alerts on missing metrics, browse to the Alert page in the log analytics workspace.

:::image type="content" source="media/logs-and-metrics/edit-alert-rule.png" alt-text="Screenshot showing the Edit alert rule page.":::

<!-- OPTIONAL. ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]
-->

### Azure Firewall alert rules

The following table lists some suggested alert rules for Azure Firewall. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Firewall monitoring data reference](monitor-firewall-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Firewall monitoring data reference](monitor-firewall-reference.md) for a reference of the metrics, logs, and other important values created for Azure Firewall.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
