---
title: Monitor Notification Hubs
description: Start here to learn how to monitor Notification Hubs.
ms.date: 03/11/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: GitHub-alias
ms.author: microsoft-alias
ms.service: notification-hubs
---

<!-- 
According to the Content Pattern guidelines all comments must be removed before publication!!!

IMPORTANT 
To make this template easier to use, first:
1. Search and replace Notification Hubs with the official name of your service.
2. Search and replace notification-hubs with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on this template)
   - Title: "Monitor Notification Hubs"
   - TOC title: "Monitor"
   - Filename: "monitor-notification-hubs.md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Notification Hubs monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-notification-hubs-reference.md".
-->

# Monitor Notification Hubs

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

<!-- ## Insights. Optional section. If your service has insights, add the following include and add information about what your Azure Monitor insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Notification Hubs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Azure Monitor platform metrics. Required section. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Notification Hubs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md#metrics).

<!-- If your service doesn't collect Azure Monitor platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)] -->

<!-- Currently unused?:
## Prometheus/container metrics. Optional. [!INCLUDE [horz-monitor-container-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
## System metrics. Optional. [!INCLUDE [horz-monitor-system-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
## Custom metrics. Optional. [!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]

<!-- ## Notification Hubs metrics
Optional. If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Azure Monitor resource logs. Required section. 
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Notification Hubs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md#resource-logs).

<!-- Resource logs service-specific information. Add service-specific information about your resource logs here. -->

<!-- If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)] -->

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<!-- Currently unused?:
<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information.
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)] -->

<!-- ## Notification Hubs logs
Optional. If your service uses any non-Azure Monitor based logs, add the preceding H2 heading and more information. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze monitoring data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### Azure Monitor export tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ## Notification Hubs analytics. Optional section. If your service has non-Monitor analytics, add information. 

<!-- ## Kusto queries. Required section. Add sample Kusto queries for your service after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->

Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

<!-- ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### Notification Hubs alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### Notification Hubs alert rules

The following table lists some suggested alert rules for Notification Hubs. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

- See [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md) for a reference of the metrics, logs, and other important values created for Notification Hubs.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.