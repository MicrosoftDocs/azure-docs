---
title: Monitor Azure HDInsight
description: Start here to learn how to monitor Azure HDInsight.
ms.date: 03/01/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: hdinsight
---

# Monitor Azure HDInsight

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

Logs, insights, and workbooks are preview

The specific metrics and logs available depend on the type of HDInsight cluster. Spark, HBase, Kafka, Hadoop.

Monitoring in the Apache Ambari Web UI

<!-- ## Insights. Optional section. If your service has insights, add the following include and brief information about what your Azure Monitor insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Azure Monitor platform metrics. Required section. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md#metrics).

Only metric is Availability?
<!-- If your service doesn't collect Azure Monitor platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)] -->

<!-- Currently unused?:
## Prometheus/container metrics. Optional. [!INCLUDE [horz-monitor-container-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
## System metrics. Optional. [!INCLUDE [horz-monitor-system-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
## Custom metrics. Optional. [!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]

<!-- ## HDInsight metrics
Optional. If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Azure Monitor resource logs. Required section. 
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md#resource-logs).

Log Analytics being replaced by new Azure Monitor integration (preview)

Must configure Azure Monitor integration to collect logs

Migrating from Log Analytics schemas to Azure Monitor schemas

Script actions to configure diagnostic settings

<!-- If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- Currently unused?:
<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information.
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)] -->

<!-- ## HDInsight logs
Optional. If your service uses any non-Azure Monitor based logs, add the preceding H2 heading and more information.

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze monitoring data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### Azure Monitor export tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ## HDInsight analytics. Optional section. If your service has non-Monitor analytics, add information. 

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

<!-- ### HDInsight alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### HDInsight alert rules

The following table lists common and recommended alert rules for HDInsight. This is just a recommended list. You can set alerts for any metric, log entry, or activity log entry that's listed in the [HDInsight monitoring data reference](monitor-hdinsight-reference.md).

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

- See [HDInsight monitoring data reference](monitor-hdinsight-reference.md) for a reference of the metrics, logs, and other important values created for HDInsight.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
