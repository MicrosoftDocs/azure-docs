---
title: Monitor Azure Container Instances
description: Start here to learn how to monitor Azure Container Instances.
ms.date: 02/27/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: tomvcassidy
ms.author: tomcassidy
ms.service: container-instances
---

# Monitor Azure Container Instances

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section. -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#metrics).

All metrics for Container Instances are in the namespace **Container group standard metrics**. In a container group with multiple containers, you can filter on the  **containerName** dimension to acquire metrics from a specific container within the group.

Containers generate similar data as other Azure resources, but they require a containerized agent to collect required data. For more information about container metrics for Container Instances, see [Monitor container resources in Azure Container Instances](container-instances-monitor.md).

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.-->
[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For more information about how to get log data for Container Instances, see [Retrieve container logs and events in Azure Container Instances](container-instances-get-logs.md).
- For the available resource log categories, associated Log Analytics tables, and the logs schemas for Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#resource-logs).

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze Container Instances logs

You can use Log Analytics to analyze and query container instance logs, and you can also enable diagnostic settings as a preview feature in the Azure portal. Log Analytics and diagnostic settings have slightly different table schemas to use for queries. Once you enable diagnostic settings, you can use either or both schemas at the same time.

For detailed information and instructions for querying logs, see [Container group and instance logging with Azure Monitor logs](container-instances-log-analytics.md). For more information about diagnostic settings, see [Use diagnostic settings](container-instances-log-analytics.md#using-diagnostic-settings).

For the Azure Monitor logs table schemas for Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#azure-monitor-logs-tables).

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

The following query examples use the legacy Log Analytics log tables. The basic structure of a query is the source table, `ContainerInstanceLog_CL` or `ContainerEvent_CL`, followed by a series of operators separated by the pipe character (`|`). You can chain several operators to refine the results and perform advanced functions.

In the newer table schema for diagnostic settings, the table names appear without *_CL*, and some columns are different. If you have diagnostic settings enabled, you can use either or both tables.

To see example query results, paste the following query into the query text box, and select the **Run** button to execute the query. This query displays all log entries whose "Message" field contains the word "warn":

```kusto
ContainerInstanceLog_CL
| where Message contains "warn"
```

More complex queries are also supported. For example, this query displays only those log entries for the "mycontainergroup001" container group generated within the last hour:

```kusto
ContainerInstanceLog_CL
| where (ContainerGroup_s == "mycontainergroup001")
| where (TimeGenerated > ago(1h))
```

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### Container Instances alert rules. Required section.-->

### Container Instances alert rules
The following table lists common and recommended alert rules for Container Instances.

| Alert type | Condition | Description  |
|:---|:---|:---|
| Metrics | vCPU usage, memory usage, or network input and output utilization exceeding a certain threshold | Depending on the function of the container, setting an alert for when the metric exceeds an expected threshold may be useful. |
| Activity logs | Container Instances operations like create, update, and delete | See the [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#activity-log) for a list of activities you can track. |
| Log alerts | `stdout` and `stderr` outputs in the logs | Use custom log search to set alerts for specific outputs that appear in logs. |

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

<!-- ALERTS SECTION END -------------------------------------->

## Related content

- See [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md) for a reference of the metrics, logs, and other important values created for Container Instances.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
