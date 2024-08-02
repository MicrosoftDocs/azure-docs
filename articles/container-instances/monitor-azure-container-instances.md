---
title: Monitor Azure Container Instances
description: Start here to learn how to monitor Azure Container Instances.
ms.date: 02/27/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: tomvcassidy
ms.author: tomcassidy
ms.service: azure-container-instances
---

# Monitor Azure Container Instances

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#metrics). These metrics are available for a container group and individual containers. By default, the metrics are aggregated as averages.

All metrics for Container Instances are in the namespace **Container group standard metrics**. In a container group with multiple containers, you can filter on the  **containerName** dimension to acquire metrics from a specific container within the group. Containers generate similar data as other Azure resources, but they require a containerized agent to collect required data.

### Get metrics

You can gather Azure Monitor metrics for container instances using either the Azure portal or Azure CLI.

> [!IMPORTANT]
> Azure Monitor metrics in Azure Container Instances are currently in preview. At this time, Azure Monitor metrics are only available for Linux containers. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms). Some aspects of this feature may change prior to general availability (GA).

#### Use the Azure portal

When a container group is created, Azure Monitor data is available in the Azure portal. To see metrics for a container group, go to the **Overview** page for the container group. Here you can see pre-created charts for each of the available metrics.

:::image type="content" source="media/container-instances-monitor/metrics.png" alt-text="Screenshot of pre-created charts for available metrics.":::

In a container group that contains multiple containers, use a [dimension](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics) to display metrics by container. To create a chart with individual container metrics, perform the following steps:

1. In the **Overview** page, select one of the metric charts, such as **CPU**.
1. Select the **Apply splitting** button, and select **Container Name**.

:::image type="content" source="media/container-instances-monitor/dimension.png" alt-text="Screenshot that shows the metrics for a container instance with Apply splitting selected and Container Name selected.":::

#### Use Azure CLI

Metrics for container instances can also be gathered using the Azure CLI. First, get the ID of the container group using the following command. Replace `<resource-group>` with your resource group name and `<container-group>` with the name of your container group.

```azurecli
CONTAINER_GROUP=$(az container show --resource-group <resource-group> --name <container-group> --query id --output tsv)
```

Use the following command to get **CPU** usage metrics.

```azurecli
az monitor metrics list --resource $CONTAINER_GROUP --metric CPUUsage --output table
```

```output
Timestamp            Name       Average
-------------------  ---------  ---------
2020-12-17 23:34:00  CPU Usage
. . .
2020-12-18 00:25:00  CPU Usage
2020-12-18 00:26:00  CPU Usage  0.4
2020-12-18 00:27:00  CPU Usage  0.0
```

Change the value of the `--metric` parameter in the command to get other [supported metrics](monitor-azure-container-instances-reference.md#metrics). For example, use the following command to get **memory** usage metrics.

```azurecli
az monitor metrics list --resource $CONTAINER_GROUP --metric MemoryUsage --output table
```

```output
Timestamp            Name          Average
-------------------  ------------  ----------
2019-04-23 22:59:00  Memory Usage
2019-04-23 23:00:00  Memory Usage
2019-04-23 23:01:00  Memory Usage  0.0
2019-04-23 23:02:00  Memory Usage  8859648.0
2019-04-23 23:03:00  Memory Usage  9181184.0
2019-04-23 23:04:00  Memory Usage  9580544.0
2019-04-23 23:05:00  Memory Usage  10280960.0
2019-04-23 23:06:00  Memory Usage  7815168.0
2019-04-23 23:07:00  Memory Usage  7739392.0
2019-04-23 23:08:00  Memory Usage  8212480.0
2019-04-23 23:09:00  Memory Usage  8159232.0
2019-04-23 23:10:00  Memory Usage  8093696.0
```

For a multi-container group, the `containerName` dimension can be added to return metrics per container.

```azurecli
az monitor metrics list --resource $CONTAINER_GROUP --metric MemoryUsage --dimension containerName --output table
```

```output
Timestamp            Name          Containername             Average
-------------------  ------------  --------------------  -----------
2019-04-23 22:59:00  Memory Usage  aci-tutorial-app
2019-04-23 23:00:00  Memory Usage  aci-tutorial-app
2019-04-23 23:01:00  Memory Usage  aci-tutorial-app      0.0
2019-04-23 23:02:00  Memory Usage  aci-tutorial-app      16834560.0
2019-04-23 23:03:00  Memory Usage  aci-tutorial-app      17534976.0
2019-04-23 23:04:00  Memory Usage  aci-tutorial-app      18329600.0
2019-04-23 23:05:00  Memory Usage  aci-tutorial-app      19742720.0
2019-04-23 23:06:00  Memory Usage  aci-tutorial-app      14786560.0
2019-04-23 23:07:00  Memory Usage  aci-tutorial-app      14651392.0
2019-04-23 23:08:00  Memory Usage  aci-tutorial-app      15470592.0
2019-04-23 23:09:00  Memory Usage  aci-tutorial-app      15450112.0
2019-04-23 23:10:00  Memory Usage  aci-tutorial-app      15339520.0
2019-04-23 22:59:00  Memory Usage  aci-tutorial-sidecar
2019-04-23 23:00:00  Memory Usage  aci-tutorial-sidecar
2019-04-23 23:01:00  Memory Usage  aci-tutorial-sidecar  0.0
2019-04-23 23:02:00  Memory Usage  aci-tutorial-sidecar  884736.0
2019-04-23 23:03:00  Memory Usage  aci-tutorial-sidecar  827392.0
2019-04-23 23:04:00  Memory Usage  aci-tutorial-sidecar  831488.0
2019-04-23 23:05:00  Memory Usage  aci-tutorial-sidecar  819200.0
2019-04-23 23:06:00  Memory Usage  aci-tutorial-sidecar  843776.0
2019-04-23 23:07:00  Memory Usage  aci-tutorial-sidecar  827392.0
2019-04-23 23:08:00  Memory Usage  aci-tutorial-sidecar  954368.0
2019-04-23 23:09:00  Memory Usage  aci-tutorial-sidecar  868352.0
2019-04-23 23:10:00  Memory Usage  aci-tutorial-sidecar  847872.0
```

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For more information about how to get log data for Container Instances, see [Retrieve container logs and events in Azure Container Instances](container-instances-get-logs.md).
- For the available resource log categories, associated Log Analytics tables, and the logs schemas for Container Instances, see [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze Container Instances logs

You can use Log Analytics to analyze and query container instance logs, and you can also enable diagnostic settings as a preview feature in the Azure portal. Log Analytics and diagnostic settings have slightly different table schemas to use for queries. Once you enable diagnostic settings, you can use either or both schemas at the same time.

For detailed information and instructions for querying logs, see [Container group and instance logging with Azure Monitor logs](container-instances-log-analytics.md). For the Azure Monitor logs table schemas for Container Instances, see [Azure Monitor Logs tables](monitor-azure-container-instances-reference.md#azure-monitor-logs-tables).

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

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Container Instances alert rules
The following table lists common and recommended alert rules for Container Instances.

| Alert type | Condition | Description  |
|:---|:---|:---|
| Metrics | vCPU usage, memory usage, or network input and output utilization exceeding a certain threshold | Depending on the function of the container, setting an alert for when the metric exceeds an expected threshold may be useful. |
| Activity logs | Container Instances operations like create, update, and delete | See the [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md#activity-log) for a list of activities you can track. |
| Log alerts | `stdout` and `stderr` outputs in the logs | Use custom log search to set alerts for specific outputs that appear in logs. |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Container Instances monitoring data reference](monitor-azure-container-instances-reference.md) for a reference of the metrics, logs, and other important values created for Container Instances.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
