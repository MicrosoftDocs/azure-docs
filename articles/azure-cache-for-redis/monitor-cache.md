---
title: Monitor Azure Cache for Redis
description: Start here to learn how to monitor Azure Cache for Redis.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: robb
ms.author: robb
ms.service: cache
---

# Monitor Azure Cache for Redis

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Insights for Azure Cache for Redis deliver the following experience:

- **At scale perspective** of your Azure Cache for Redis resources across subscriptions. You can selectively scope to only the subscriptions and resources you want to evaluate.
- **Drill-down analysis** of an Azure Cache for Redis resource. To diagnose problems, you can see detailed analysis of utilization, failures, capacity, and operations, or see an in-depth view of relevant information.
- **Customization** built on Azure Monitor workbook templates. You can change what metrics are displayed and modify or set thresholds that align with your limits. You can save the changes in a custom workbook and then pin workbook charts to Azure dashboards.

Insights for Azure Cache for Redis don't require you to enable or configure anything. Azure Cache for Redis information is collected by default, and there's no extra charge to access insights.

To learn how to view, configure, and customize insights for Azure Cache for Redis, see [Azure Monitor insights for Azure Cache for Redis](cache-insights-overview.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md).

<a name="use-a-storage-account-to-export-azure-cache-for-redis-metrics"></a>
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md#resource-logs).
## Azure Cache for Redis resource logs

In Azure Cache for Redis, two options are available to log:

- **Cache Metrics** ("AllMetrics") [logs metrics from Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal)
- **Connection Logs** logs connections to the cache for security and diagnostic purposes. 

### Cache metrics

Azure Cache for Redis emits many metrics such as `Server Load` and `Connections per Second` that are useful to log. Selecting the **AllMetrics** option allows these and other cache metrics to be logged. You can configure how long to retain the metrics.

### Connection logs

Azure Cache for Redis uses Azure diagnostic settings to log information on client connections to your cache. Logging and analyzing this diagnostic setting helps you understand who is connecting to your caches and the timestamp of those connections. The log data could be used to identify the scope of a security breach and for security auditing purposes.

The connection logs have slightly different implementations, contents, and setup procedures for the different Azure Cache for Redis tiers. For details, see [Azure Monitor diagnostic settings](cache-monitor-diagnostic-settings.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

## Azure Cache for Redis metrics

Metrics for Azure Cache for Redis instances are collected using the Redis [`INFO`](https://redis.io/commands/info) command. Metrics are collected approximately two times per minute and automatically stored for 30 days so they can be displayed in the metrics charts and evaluated by alert rules.

The metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. Each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

Each metric includes two versions: One metric measures performance for the entire cache, and for caches that use clustering. A second version of the metric, which includes `(Shard 0-9)` in the name, measures performance for a single shard in a cache. For example if a cache has four shards, `Cache Hits` is the total number of hits for the entire cache, and `Cache Hits (Shard 3)` measures just the hits for that shard of the cache.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitor.png" alt-text="Screenshot with metrics showing in the resource manager.":::

#### Aggregation types

For general information about aggregation types, see [Configure aggregation](/azure/azure-monitor/essentials/analyze-metrics#configure-aggregation).

Under normal cache conditions, **Average** and **Max** are similar because only the primary node emits these metrics. In a scenario where the number of connected clients changes rapidly, **Max**, **Average**, and **Min** show different values, which is also expected behavior.

The types **Count** and **Sum** can be misleading for certain metrics, such as connected clients. Instead, it's best to look at the **Average** metrics and not the **Sum** metrics.

> [!NOTE]
> Even when the cache is idle with no connected active client applications, you might see some cache activity, such as connected clients, memory usage, and operations being performed. The activity is normal in the operation of the cache.

For nonclustered caches, it's best to use the metrics without the suffix `Instance Based`. For example, to check server load for your cache instance, use the metric _Server Load_.

In contrast, for clustered caches, use the metrics with the suffix `Instance Based`. Then, add a split or filter on `ShardId`. For example, to check the server load of shard 1, use the metric **Server Load (Instance Based)**, then apply filter **ShardId = 1**.

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

For sample Kusto queries for Azure Cache for Redis connection logs, see [Connection log queries](cache-monitor-diagnostic-settings.md#log-analytics-queries).

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Cache for Redis common alert rules

The following table lists common and recommended alert rules for Azure Cache for Redis.

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric|99th percentile latency|Alert on the worst-case latency of server-side commands in Azure Cache for Redis instances. Latency is measured by using `PING` commands and tracking response times. Track the health of your cache instance to see if long-running commands are compromising latency performance.
|Metric |High `Server Load` usage or spikes |High server load means the Redis server is unable to keep up with requests, leading to timeouts or slow responses. Create alerts on metrics on server load metrics to be notified early about potential impacts.|
|Metric |High network bandwidth usage |If the server exceeds the available bandwidth, then data isn't sent to the client as quickly. Client requests could time out because the server can't push data to the client fast enough. Set up alerts for server-side network bandwidth limits by using the `Cache Read` and `Cache Write` counters. |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

The following screenshot shows an advisor recommendation for an Azure Cache for Redis alert:

:::image type="content" source="./media/monitor-cache/redis-cache-recommendations.png" alt-text="Screenshot that shows Advisor recommendations.":::

To upgrade your cache, select **Upgrade now** to change the pricing tier and [scale](cache-configure.md#scale) your cache. For more information on choosing a pricing tier, see [Choosing the right tier](cache-overview.md#choosing-the-right-tier).

## Related content

- See [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md) for a reference of the metrics, logs, and other important values created for Azure Cache for Redis.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
