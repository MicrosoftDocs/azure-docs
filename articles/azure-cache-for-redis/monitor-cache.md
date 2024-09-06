---
title: Monitor Azure Cache for Redis
description: Start here to learn how to monitor Azure Cache for Redis.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: robb
ms.author: robb

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

Metrics for Azure Cache for Redis instances are collected using the Redis [`INFO`](https://redis.io/commands/info) command. Metrics are collected approximately two times per minute so they can be displayed in the metrics charts and evaluated by alert rules. To learn how long data is retained and how to configure a different retention policy, see [Data retention and archive in Azure Monitor Logs](/azure/azure-monitor/logs/data-retention-archive).

The metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. Each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

Each metric includes two versions: One metric measures performance for the entire cache, and for caches that use clustering. A second version of the metric, which includes `(Shard 0-9)` in the name, measures performance for a single shard in a cache. For example if a cache has four shards, `Cache Hits` is the total number of hits for the entire cache, and `Cache Hits (Shard 3)` measures just the hits for that shard of the cache.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitor.png" alt-text="Screenshot with metrics showing in the resource manager.":::

### View cache metrics

You can view Azure Monitor metrics for Azure Cache for Redis directly from an Azure Cache for Redis resource in the [Azure portal](https://portal.azure.com).

[Select your Azure Cache for Redis instance](cache-configure.md#configure-azure-cache-for-redis-settings) in the portal. The **Overview** page shows the predefined **Memory Usage** and **Redis Server Load** monitoring charts. These charts are useful summaries that allow you to take a quick look at the state of your cache.

:::image type="content" source="./media/cache-how-to-monitor/cache-overview-metrics.png" alt-text="Screen showing two charts: Memory Usage and Redis Server Load.":::

For more in-depth information, you can monitor the following useful Azure Cache for Redis metrics from the **Monitoring** section of the Resource menu.

| Azure Cache for Redis metric | More information |
| --- | --- |
| Network bandwidth usage |[Cache performance - available bandwidth](cache-planning-faq.yml#azure-cache-for-redis-performance) |
| Connected clients |[Default Redis server configuration - max clients](cache-configure.md#maxclients) |
| Server load |[Redis Server Load](monitor-cache-reference.md#azure-cache-for-redis-metrics) |
| Memory usage |[Cache performance - size](cache-planning-faq.yml#azure-cache-for-redis-performance) |

:::image type="content" source="media/cache-how-to-monitor/cache-monitor-metrics.png" alt-text="Screenshot of monitoring metrics selected in the Resource menu.":::

### Create your own metrics

You can create your own custom chart to track the metrics you want to see. Cache metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. On the left, select the **Metric** in the **Monitoring** section. Each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

Each metric includes two versions: One metric measures performance for the entire cache, and for caches that use clustering. A second version of the metric, which includes `(Shard 0-9)` in the name, measures performance for a single shard in a cache. For example if a cache has four shards, `Cache Hits` is the total number of hits for the entire cache, and `Cache Hits (Shard 3)` measures just the hits for that shard of the cache.

In the Resource menu on the left, select **Metrics** under **Monitoring**. Here, you design your own chart for your cache, defining the metric type and aggregation type.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitor.png" alt-text="Screenshot with metrics showing in the resource manager":::

#### Aggregation types

For general information about aggregation types, see [Configure aggregation](/azure/azure-monitor/essentials/analyze-metrics#configure-aggregation).

Under normal cache conditions, **Average** and **Max** are similar because only the primary node emits these metrics. In a scenario where the number of connected clients changes rapidly, **Max**, **Average**, and **Min** show different values, which is also expected behavior.

The types **Count** and **Sum** can be misleading for certain metrics, such as connected clients. Instead, it's best to look at the **Average** metrics and not the **Sum** metrics.

> [!NOTE]
> Even when the cache is idle with no connected active client applications, you might see some cache activity, such as connected clients, memory usage, and operations being performed. The activity is normal in the operation of the cache.

For nonclustered caches, it's best to use the metrics without the suffix `Instance Based`. For example, to check server load for your cache instance, use the metric _Server Load_.

In contrast, for clustered caches, use the metrics with the suffix `Instance Based`. Then, add a split or filter on `ShardId`. For example, to check the server load of shard 1, use the metric **Server Load (Instance Based)**, then apply filter **ShardId = 1**.

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Log Analytics queries

> [!NOTE]
> For a tutorial on how to use Azure Log Analytics, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md). Remember that it may take up to 90 minutes before logs show up in Log Analtyics.

Here are some basic queries to use as models.

#### [Queries for Basic, Standard, and Premium tiers](#tab/basic-standard-premium)

- Azure Cache for Redis client connections per hour within the specified IP address range:

```kusto
let IpRange = "10.1.1.0/24";
ACRConnectedClientList
// For particular datetime filtering, add '| where TimeGenerated between (StartTime .. EndTime)'
| where ipv4_is_in_range(ClientIp, IpRange)
| summarize ConnectionCount = sum(ClientCount) by TimeRange = bin(TimeGenerated, 1h)
```

- Unique Redis client IP addresses that have connected to the cache:

```kusto
ACRConnectedClientList
| summarize count() by ClientIp
```

### [Queries for Enterprise and Enterprise Flash tiers](#tab/enterprise-enterprise-flash)

- Azure Cache for Redis connections per hour within the specified IP address range:

```kusto
REDConnectionEvents
// For particular datetime filtering, add '| where EventTime between (StartTime .. EndTime)'
// For particular IP range filtering, add '| where ipv4_is_in_range(ClientIp, IpRange)'
// IP range can be defined like this 'let IpRange = "10.1.1.0/24";' at the top of query.
| extend EventTime = unixtime_seconds_todatetime(EventEpochTime)
| where EventType == "new_conn"
| summarize ConnectionCount = count() by TimeRange = bin(EventTime, 1h)
```

- Azure Cache for Redis authentication requests per hour within the specified IP address range:

```kusto
REDConnectionEvents
| extend EventTime = unixtime_seconds_todatetime(EventEpochTime)
// For particular datetime filtering, add '| where EventTime between (StartTime .. EndTime)'
// For particular IP range filtering, add '| where ipv4_is_in_range(ClientIp, IpRange)'
// IP range can be defined like this 'let IpRange = "10.1.1.0/24";' at the top of query.
| where EventType == "auth"
| summarize AuthencationRequestsCount = count() by TimeRange = bin(EventTime, 1h)
```

- Unique Redis client IP addresses that have connected to the cache:

```kusto
REDConnectionEvents
// https://docs.redis.com/latest/rs/security/audit-events/#status-result-codes
// EventStatus :
// 0    AUTHENTICATION_FAILED    -    Invalid username and/or password.
// 1    AUTHENTICATION_FAILED_TOO_LONG    -    Username or password are too long.
// 2    AUTHENTICATION_NOT_REQUIRED    -    Client tried to authenticate, but authentication isn’t necessary.
// 3    AUTHENTICATION_DIRECTORY_PENDING    -    Attempting to receive authentication info from the directory in async mode.
// 4    AUTHENTICATION_DIRECTORY_ERROR    -    Authentication attempt failed because there was a directory connection error.
// 5    AUTHENTICATION_SYNCER_IN_PROGRESS    -    Syncer SASL handshake. Return SASL response and wait for the next request.
// 6    AUTHENTICATION_SYNCER_FAILED    -    Syncer SASL handshake. Returned SASL response and closed the connection.
// 7    AUTHENTICATION_SYNCER_OK    -    Syncer authenticated. Returned SASL response.
// 8    AUTHENTICATION_OK    -    Client successfully authenticated.
| where EventType == "auth" and EventStatus == 2 or EventStatus == 8 or EventStatus == 7
| summarize count() by ClientIp
```

- Unsuccessful authentication attempts to the cache

```kusto
REDConnectionEvents
// https://docs.redis.com/latest/rs/security/audit-events/#status-result-codes
// EventStatus : 
// 0    AUTHENTICATION_FAILED    -    Invalid username and/or password.
// 1    AUTHENTICATION_FAILED_TOO_LONG    -    Username or password are too long.
// 2    AUTHENTICATION_NOT_REQUIRED    -    Client tried to authenticate, but authentication isn’t necessary.
// 3    AUTHENTICATION_DIRECTORY_PENDING    -    Attempting to receive authentication info from the directory in async mode.
// 4    AUTHENTICATION_DIRECTORY_ERROR    -    Authentication attempt failed because there was a directory connection error.
// 5    AUTHENTICATION_SYNCER_IN_PROGRESS    -    Syncer SASL handshake. Return SASL response and wait for the next request.
// 6    AUTHENTICATION_SYNCER_FAILED    -    Syncer SASL handshake. Returned SASL response and closed the connection.
// 7    AUTHENTICATION_SYNCER_OK    -    Syncer authenticated. Returned SASL response.
// 8    AUTHENTICATION_OK    -    Client successfully authenticated.
| where EventType == "auth" and EventStatus != 2 and EventStatus != 8 and EventStatus != 7
| project ClientIp, EventStatus, ConnectionId
```
---

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Create alerts

You can configure to receive alerts based on metrics and activity logs. Azure Monitor allows you to configure an alert to do the following when it triggers:

- Send an email notification
- Call a webhook
- Invoke an Azure Logic App

To configure alerts for your cache, select **Alerts** under **Monitoring** on the Resource menu.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitoring.png" alt-text="Screenshot showing how to create an alert.":::

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
