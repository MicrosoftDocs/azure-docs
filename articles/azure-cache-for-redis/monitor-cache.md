---
title: Monitor Azure Cache for Redis
description: Start here to learn how to monitor Azure Cache for Redis.
ms.date: 01/26/2024
ms.custom: horz-monitor
author: v-thepet
ms.author: v-thepet
ms.service: cache
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Cache for Redis with the official name of your service.
2. Search and replace cache with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that isn't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on this template)
   - Title: "Monitor Azure Cache for Redis"
   - TOC title: "Monitor"
   - Filename: "monitor-cache.md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Azure Cache for Redis monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-cache-reference.md".
-->

# Monitor Azure Cache for Redis

<!-- Intro -->
[!INCLUDE [horz-monitor-intro](/azure/azure-monitor/includes/horizontals/horz-monitor-intro)]

<!-- ## Insights. If your service doesn't have insights, remove the following include and comments . If your service has insights, add more information about the insights after the #include. -->
[!INCLUDE [horz-monitor-azmon-insights](/azure/azure-monitor/includes/horizontals/horz-monitor-insights)]
<!-- Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->

<!-- ## Resource types -->
[!INCLUDE [horz-monitor-resource-types](/azure/azure-monitor/includes/horizontals/horz-monitor-resource-types)]

<!-- ## Storage. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-storage](/azure/azure-monitor/includes/horizontals/horz-monitor-storage)]
<!-- Add service-specific information about storing monitoring data here. For example, SQL Server stores other monitoring data in its own databases. If your service doesn't have non-Azure Monitor methods of storing monitoring data, just remove this comment. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- Use one of the following two includes, depending on whether or not your service gathers platform metrics: -->

<!-- ## NO PLATFORM METRICS. If your service doesn't gather platform metrics, use the following include and remove the rest of the information in the Platform metrics section: -->
[!INCLUDE [horz-monitor-no-platform-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-no-platform-metrics)]

<!-- ## Platform metrics. If your service has platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-platform-metrics)]

For a list of available metrics for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-service-reference.md#metrics).

<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. If your service doesn't use containers/Prometheus metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-container-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-container-metrics)]
<!-- Prometheus/containers service-specific information. Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System-imported metrics. If your service doesn't use system-imported metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-system-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-system-metrics)]
<!-- System-imported metrics service-specific information. Add service-specific information about your system-imported metrics here.-->

<!-- ## Customer-imported metrics. If your service doesn't use custom imported metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-custom-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-custom-metrics)]
<!-- Customer-imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. If your service doesn't use any non-Azure Monitor based metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-custom-metrics](/azure/azure-monitor/includes/horizontals/horz-monitor-non-monitor-metrics)]
<!-- Non-Monitor metrics service-specific information. Add service-specific information about your non-Azure Monitor metrics here.-->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- Use one of the following two includes, depending on whether or not your service collects resource logs: -->

<!-- ## NO RESOURCE LOGS. If your service doesn't collect resource logs, use the following include and remove the rest of the information in the Resource logs section:-->
[!INCLUDE [horz-monitor-no-resource-logs](/azure/azure-monitor/includes/horizontals/horz-monitor-no-resource-logs)]

<!-- ## Resource logs. If your service collects resource logs, add the following includes, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](/azure/azure-monitor/includes/horizontals/horz-monitor-resource-logs)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-service-reference.md#resource-logs).

<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/platform/diagnostic-settings). Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

<!-- ## Activity log. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](/azure/azure-monitor/includes/horizontals/horz-monitor-activity-log)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. If your service doesn't use imported logs, remove the following include and comments. -->
[!INCLUDE [horz-monitor-imported-logs](/azure/azure-monitor/includes/horizontals/horz-monitor-imported-logs)]
<!-- Imported log service-specific information. Add service-specific information about your imported logs here. -->

<!-- ## Other logs. If your service doesn't produce any other types of non-Azure Monitor logs, remove this comment.
If your service has other logs that aren't resource logs or in the activity log, you can state what they are and what they cover here. You can describe how to route them in a later section. If your service doesn't produce any other types of non-Azure Monitor logs, remove this comment. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data -->
[!INCLUDE [horz-monitor-analyze-data](/azure/azure-monitor/includes/horizontals/horz-monitor-analyze-data)]

<!-- ### External tools -->
[!INCLUDE [horz-monitor-external-tools](/azure/azure-monitor/includes/horizontals/horz-monitor-external-tools)]

<!-- ### Sample Kusto queries. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](/azure/azure-monitor/includes/horizontals/horz-monitor-kusto-queries)]
<!-- Add sample Kusto queries for your service here. -->

<!-- ## Azure Cache for Redis service-specific analytics
Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](/azure/azure-monitor/includes/horizontals/horz-monitor-alerts)]

<!-- ONLY if applications run on your service that work with application insights, add the following include. -->
[!INCLUDE [horz-monitor-insights-alerts](/azure/azure-monitor/includes/horizontals/horz-monitor-insights-alerts)]

<!-- **MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

The following table lists common and recommended alert rules for Azure Cache for Redis. -->

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

<!-- ALERTS SECTION END -------------------------------------->

## Related content

<!-- You can change the wording and add more links if useful. -->

- See [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md) for a reference of the metrics, logs, and other important values created for Azure Cache for Redis.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
