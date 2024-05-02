---
title: Monitor Azure Application Gateway
description: Start here to learn how to monitor Azure Application Gateway.
ms.date: 05/06/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: greg-lindsay
ms.author: greglin
ms.service: application-gateway
---

<!-- 
According to the Content Pattern guidelines all comments must be removed before publication!!!

IMPORTANT 
To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.

Your service should have the following two articles:

1. The overview monitoring article (based on this template)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Monitor Azure Application Gateway

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

Azure Monitor Network Insights provides a comprehensive view of health and metrics for all deployed network resources (including Application Gateway), without requiring any configuration. For more information, see [Azure Monitor Network Insights](../network-watcher/network-insights-overview.md).


<!-- ## Resource types -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Application Gateway, see [Azure Application Gateway monitoring data reference](monitor-application-gateway-reference.md).

<!-- ## Data storage -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- ## Azure Monitor platform metrics -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Application Gateway, see [Azure Application Gateway monitoring data reference](monitor-application-gateway-reference.md#metrics).

<!-- OPTIONAL. If your service doesn't collect Azure Monitor platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)] -->

<!-- ## OPTIONAL Application Gateway metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

<!-- ## Azure Monitor resource logs -->

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Application Gateway, see [Azure Application Gateway monitoring data reference](monitor-application-gateway-reference.md#resource-logs).

<!-- OPTIONAL. If your service doesn't collect Azure Monitor resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)] -->

<!-- ## Activity log -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<!-- ## Analyze monitoring data -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### Azure Monitor export tools -->
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ## Kusto queries -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

<!-- REQUIRED. Add sample Kusto queries for your service here. -->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- OPTIONAL. ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

<!-- OPTIONAL. ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### [TODO-replace-with-service-name] alert rules. REQUIRED. -->

### Application Gateway alert rules

The following table lists some suggested alert rules for Application Gateway. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Application Gateway monitoring data reference](monitor-application-gateway-reference.md).

**Application Gateway v1**

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric|CPU utilization crosses 80%|Under normal conditions, CPU usage shouldn't regularly exceed 90%. This can cause latency in the websites hosted behind the Application Gateway and disrupt the client experience.|
|Metric|Unhealthy host count crosses threshold|Indicates the number of backend servers that Application Gateway is unable to probe successfully. This catches issues where the Application Gateway instances are unable to connect to the backend. Alert if this number goes above 20% of backend capacity.|
|Metric|Response status (4xx, 5xx) crosses threshold|When Application Gateway response status is 4xx or 5xx. There could be occasional 4xx or 5xx response seen due to transient issues. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Failed requests crosses threshold|When failed requests metric crosses a threshold. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|


**Application Gateway v2**

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric|Compute Unit utilization crosses 75% of average usage|Compute unit is the measure of compute utilization of your Application Gateway. Check your average compute unit usage in the last one month and set alert if it crosses 75% of it.|
|Metric|Capacity Unit utilization crosses 75% of peak usage|Capacity units represent overall gateway utilization in terms of throughput, compute, and connection count. Check your maximum capacity unit usage in the last one month and set alert if it crosses 75% of it.|
|Metric|Unhealthy host count crosses threshold|Indicates number of backend servers that application gateway is unable to probe successfully. This catches issues where Application gateway instances are unable to connect to the backend. Alert if this number goes above 20% of backend capacity.|
|Metric|Response status (4xx, 5xx) crosses threshold|When Application Gateway response status is 4xx or 5xx. There could be occasional 4xx or 5xx response seen due to transient issues. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Failed requests crosses threshold|When Failed requests metric crosses threshold. You should observe the gateway in production to determine static threshold or use dynamic threshold for the alert.|
|Metric|Backend last byte response time crosses threshold|Indicates the time interval between start of establishing a connection to backend server and receiving the last byte of the response body. Create an alert if the backend response latency is more that certain threshold from usual.|
|Metric|Application Gateway total time crosses threshold|This is the interval from the time when Application Gateway receives the first byte of the HTTP request to the time when the last response byte has been sent to the client. Should create an alert if the backend response latency is more that certain threshold from usual.|

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](../azure-monitor/alerts/alerts-metric-overview.md), [logs](../azure-monitor/alerts/alerts-unified-log.md), and the [activity log](../azure-monitor/alerts/activity-log-alerts.md). Different types of alerts have benefits and drawbacks

If you're creating or running an application that uses Application Gateway, [Azure Monitor Application Insights](../azure-monitor/app/app-insights-overview.md) can offer additional types of alerts.

<!-- ### Advisor recommendations -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Application Gateway monitoring data reference](monitor-application-gateway-reference.md) for a reference of the metrics, logs, and other important values created for Application Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
