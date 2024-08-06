---
title: Monitor Azure Application Gateway
description: Start here to learn how to monitor Azure Application Gateway. Learn how to monitor resources for availability, performance, and operation.
ms.date: 06/17/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: greg-lindsay
ms.author: greglin
ms.service: azure-application-gateway
---

# Monitor Azure Application Gateway

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Azure Monitor Network Insights provides a comprehensive view of health and metrics for all deployed network resources including Application Gateway, without requiring any configuration. For more information, see [Azure Monitor Network Insights](../network-watcher/network-insights-overview.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Application Gateway, see [Application Gateway monitoring data reference](monitor-application-gateway-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

For Application Gateway, resource-specific mode creates three tables:

- [AGWAccessLogs](/azure/azure-monitor/reference/tables/agwaccesslogs)
- [AGWPerformanceLogs](/azure/azure-monitor/reference/tables/agwperformancelogs)
- [AGWFirewallLogs](/azure/azure-monitor/reference/tables/agwfirewalllogs)

> [!NOTE]
> The resource specific option is currently available in all **public regions**.
>
> Existing users can continue using Azure Diagnostics, or can opt for dedicated tables by switching the toggle in Diagnostic settings to **Resource specific**, or to **Dedicated** in API destination.Dual mode isn't possible. The data in all the logs can either flow to Azure Diagnostics, or to dedicated tables. However, you can have multiple diagnostic settings where one data flow is to azure diagnostic and another is using resource specific at the same time.

**Selecting the destination table in Log analytics**: All Azure services eventually use the resource-specific tables. As part of this transition, you can select Azure diagnostic or resource specific table in the diagnostic setting using a toggle button. The toggle is set to **Resource specific** by default and in this mode, logs for new selected categories are sent to dedicated tables in Log Analytics, while existing streams remain unchanged. See the following example.

:::image type="content" source="./media/application-gateway-diagnostics/resource-specific.png" alt-text="Screenshot of the resource ID for application gateway in the portal." lightbox="./media/application-gateway-diagnostics/resource-specific.png":::

**Workspace Transformations:** Opting for the Resource specific option allows you to filter and modify your data before [workspace transformations](../azure-monitor/essentials/data-collection-transformations-workspace.md) ingests it. This approach provides granular control, allowing you to focus on the most relevant information from the logs there by reducing data costs and enhancing security.

For detailed instructions on setting up workspace transformations, see [Tutorial: Add a workspace transformation to Azure Monitor Logs by using the Azure portal](../azure-monitor/logs/tutorial-workspace-transformations-portal.md).

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

The **Overview** page in the Azure portal for each Application Gateway includes the following metrics:

- Sum Total Requests
- Sum Failed Requests
- Sum Response Status by HttpStatus
- Sum Throughput
- Sum CurrentConnections
- Avg Healthy Host Count By BackendPool HttpSettings
- Avg Unhealthy Host Count By BackendPool HttpSettings

For a list of available metrics for Azure Application Gateway, see [Application Gateway monitoring data reference](monitor-application-gateway-reference.md#metrics).

For available Web Application Firewall (WAF) metrics, see [Application Gateway WAF v2 metrics](../web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v2-metrics) and [Application Gateway WAF v1 metrics](../web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v1-metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  

See [Application Gateway monitoring data reference](monitor-application-gateway-reference.md#resource-logs) for:

- A list of the types of resource logs collected for Application Gateway.
- A list of the tables used by Azure Monitor Logs and queryable by Log Analytics.
- The available resource log categories, their associated Log Analytics tables, and the log schemas for Application Gateway.

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

### Analyzing Access logs through GoAccess

We published a Resource Manager template that installs and runs the popular [GoAccess](https://goaccess.io/) log analyzer for Application Gateway Access Logs. GoAccess provides valuable HTTP traffic statistics such as Unique Visitors, Requested Files, Hosts, Operating Systems, Browsers, HTTP Status codes and more. For more details, please see the [Readme file in the Resource Manager template folder in GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/application-gateway-logviewer-goaccess).

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

The following examples show some useful queries for Application Gateway.

```kusto
// Requests per hour 
// Count of the incoming requests on the Application Gateway. 
// To create an alert for this query, click '+ New alert rule'
AzureDiagnostics
| where ResourceType == "APPLICATIONGATEWAYS" and OperationName == "ApplicationGatewayAccess"
| summarize AggregatedValue = count() by bin(TimeGenerated, 1h), _ResourceId
| render timechart 
```

```kusto
// Failed requests per hour 
// Count of requests to which Application Gateway responded with an error. 
// To create an alert for this query, click '+ New alert rule'
AzureDiagnostics
| where ResourceType == "APPLICATIONGATEWAYS" and OperationName == "ApplicationGatewayAccess" and httpStatus_d > 399
| summarize AggregatedValue = count() by bin(TimeGenerated, 1h), _ResourceId
| render timechart
```

```kusto
// Top 10 Client IPs 
// Count of requests per client IP. 
AzureDiagnostics
| where ResourceType == "APPLICATIONGATEWAYS" and OperationName == "ApplicationGatewayAccess"
| summarize AggregatedValue = count() by clientIP_s
| top 10 by AggregatedValue
```

```kusto
// Errors by user agent 
// Number of errors by user agent. 
// To create an alert for this query, click '+ New alert rule'
AzureDiagnostics
| where ResourceType == "APPLICATIONGATEWAYS" and OperationName == "ApplicationGatewayAccess" and httpStatus_d > 399
| summarize AggregatedValue = count() by userAgent_s, _ResourceId
| sort by AggregatedValue desc
```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

To configure alerts using ARM templates, see [Configure Azure Monitor alerts](configure-alerts-with-templates.md).

### Application Gateway alert rules

The following table lists some suggested alert rules for Application Gateway. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Application Gateway monitoring data reference](monitor-application-gateway-reference.md).

Application Gateway v2

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric|Compute Unit utilization crosses 75% of average usage|Compute unit is the measure of compute utilization of your Application Gateway. Check your average compute unit usage in the last one month and set alert if it crosses 75% of it.|
|Metric|Capacity Unit utilization crosses 75% of peak usage|Capacity units represent overall gateway utilization in terms of throughput, compute, and connection count. Check your maximum capacity unit usage in the last one month and set alert if it crosses 75% of it.|
|Metric|Unhealthy host count crosses threshold|Indicates number of backend servers that application gateway is unable to probe successfully. This alert catches issues where Application gateway instances are unable to connect to the backend. Alert if this number goes above 20% of backend capacity.|
|Metric|Response status (4xx, 5xx) crosses threshold|When Application Gateway response status is 4xx or 5xx. There could be occasional 4xx or 5xx response seen due to transient issues. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Failed requests crosses threshold|When Failed requests metric crosses threshold. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Backend last byte response time crosses threshold|Indicates the time interval between start of establishing a connection to backend server and receiving the last byte of the response body. Create an alert if the backend response latency is more that certain threshold from usual.|
|Metric|Application Gateway total time crosses threshold|This value is the interval from the time when Application Gateway receives the first byte of the HTTP request to the time when the last response byte has been sent to the client. Should create an alert if the backend response latency is more that certain threshold from usual.|

Application Gateway v1

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric|CPU utilization crosses 80%|Under normal conditions, CPU usage shouldn't regularly exceed 90%. This situation can cause latency in the websites hosted behind the Application Gateway and disrupt the client experience.|
|Metric|Unhealthy host count crosses threshold|Indicates the number of backend servers that Application Gateway is unable to probe successfully. This alert catches issues where the Application Gateway instances are unable to connect to the backend. Alert if this number goes above 20% of backend capacity.|
|Metric|Response status (4xx, 5xx) crosses threshold|When Application Gateway response status is 4xx or 5xx. There could be occasional 4xx or 5xx response seen due to transient issues. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Failed requests crosses threshold|When failed requests metric crosses a threshold. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](../azure-monitor/alerts/alerts-metric-overview.md), [logs](../azure-monitor/alerts/alerts-unified-log.md), and the [activity log](../azure-monitor/alerts/activity-log-alerts.md). Different types of alerts have benefits and drawbacks.

If you're creating or running an application that uses Application Gateway, [Azure Monitor Application Insights](../azure-monitor/app/app-insights-overview.md) can offer other types of alerts.

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Application Gateway monitoring data reference](monitor-application-gateway-reference.md) for a reference of the metrics, logs, and other important values created for Application Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
