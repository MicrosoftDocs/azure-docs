---
title: Monitor Azure Monitor
description: Start here to learn how to monitor Azure Monitor.
ms.date: 03/31/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.service: azure-monitor
---

# Monitor Azure Monitor

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

<!-- ## Insights. Optional section. If your service has insights, add the following include and add information about what your Azure Monitor insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

Azure Monitor has many separate larger components. Information on monitoring each of these is mentioned below.  

### Azure Monitor core
**Autoscale** - Azure Monitor Autoscale has a diagnostics feature that provides insights into the performance of your autoscale settings. For more information, see [Azure Monitor Autoscale diagnostics](./autoscale/autoscale-diagnostics,md) and [Troubleshooting using autoscale metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-troubleshoot#autoscale-metrics). 

**Agent Monitoring** - You can now monitor the health of your agents easily and seamlessly across Azure, on premises and other clouds using this interactive experience. For more information, see [Azure Monitor Agent Health](./agents/azure-monitor-agent-health.md).

DCRs https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/data-collection-monitor

### Azure Monitor Logs and Log Analytics

**[Log Analytics Workspace Insights](./logs/log-analytics-workspace-insights-overview.md)** provides a dashboard that shows you the volume of data going through your workspace(s). You can calculate the cost of your workspace based on the data volume.
  
**[Log Analytics workspace health](./logs/log-analytics-workspace-health)** provides a set of queries that you can use to monitor the health of your workspace.

**Optimizing and troubleshooting log queries** - Sometimes Azure Monitor KQL Log queries can take more time to run than needed or never return at all.  By monitoring the various aspects of the query, you can troubleshoot and optimize them. For more information, see [Audit queries in Azure Monitor Logs]( ./logs/query-audit) and [Optimize log queries](./logs/query-optimization).

**Log Ingestion pipeline latency** - Azure Monitor provides a highly scalable log ingestion pipeline that can ingest logs from any source. For more information, see [Log Ingestion pipeline](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/log-ingestion-pipeline). You can monitor the latency of this pipeline using Kusto queries. For more information see [Log data ingestion time in Azure Monitor](./logs/data-ingestion-time.md#check-ingestion-time).

**Log Analytics usage** - You can monitor the data ingestion for your Log Analytics workspace. For more information, see [Analyze usage in Log Analytics](./logs/analyze-usage.md).

### All resources

**Health of any Azure resource** - Azure Monitor resources are tied into the resource health feature, which provides insights into the health of any Azure resource. For more information, see [Resource health](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/resource-health).



<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Monitor, see [Azure Monitor monitoring data reference](monitor-azure-monitor-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- ## Azure Monitor platform metrics. Required section. -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Monitor, see [Azure Monitor monitoring data reference](monitor-azure-monitor-reference.md#metrics).


<!-- ## Azure Monitor resource logs. Required section. -->
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Monitor, see [Azure Monitor monitoring data reference](monitor-azure-monitor-reference.md#resource-logs).

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<!-- Currently unused?:
<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information.
[!INCLUDE [horz-monitor-imported-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)] -->

<!-- ## Analyze monitoring data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]


<!-- ### Azure Monitor export tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ## Kusto queries. Required section. Add sample Kusto queries for your service after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

<!-- ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### Azure Monitor alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log. -->


<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

## Related content
<!-- You can change the wording and add more links if useful. -->

- See [Azure Monitor monitoring data reference](monitor-azure-monitor-reference.md) for a reference of the metrics, logs, and other important values created for Azure Monitor.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
