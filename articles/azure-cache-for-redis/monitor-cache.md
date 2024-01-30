---
title: Monitor Azure Cache for Redis
description: Start here to learn how to monitor Azure Cache for Redis.
ms.date: 01/26/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: v-thepet
ms.author: v-thepet
ms.service: cache
---

# Monitor Azure Cache for Redis
<!-- Intro -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-intro.md)]

<!-- ## Insights. If your service doesn't have insights, remove the following include and comments . If your service has insights, add more information about the insights after the #include. -->
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-insights.md)]
<!-- Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->

Insights for Azure Cache for Redis deliver the following experience:

- **At scale perspective** of your Azure Cache for Redis resources across subscriptions. You can selectively scope to only the subscriptions and resources you want to evaluate.
- **Drill-down analysis** of an Azure Cache for Redis resource. To diagnose problems, you can see detailed analysis of utilization, failures, capacity, and operations, or see an in-depth view of relevant information.
- **Customization** built on Azure Monitor workbook templates. You can change what metrics are displayed and modify or set thresholds that align with your limits. You can save the changes in a custom workbook and then pin workbook charts to Azure dashboards.

Insights for Azure Cache for Redis don't require you to enable or configure anything. Azure Cache for Redis information is collected by default, and there's no extra charge to access insights.

To learn how to view, configure, and customize insights for Azure Cache for Redis, see [Azure Monitor insights for Azure Cache for Redis](cache-insights-overview.md).

<!-- ## Resource types -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md).

<!-- ## Storage. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-data-storage.md)]

### Use a storage account to export Azure Cache for Redis metrics

By default, Azure Cacher for Redis metrics in Azure Monitor are [stored for 30 days](/azure/azure-monitor/essentials/data-platform-metrics) and then deleted. To persist your cache metrics for longer than 30 days, you can use a [storage account](/azure/azure-monitor/essentials/resource-logs.md#send-to-azure-storage) and specify a **Retention (days)** policy that meets your requirements. The storage account must be in the same region as the cache.

To configure the storage account for your cache metrics:

1. In the **Azure Cache for Redis** page, under the **Monitoring** heading, select **Diagnostics settings**.
1. Select **Add diagnostic setting**.
1. Name the setting.
1. Check **Archive to a storage account**. You're charged normal data rates for storage and transactions when you send diagnostics to a storage account.
1. Select **Configure** to choose the storage account.
1. Under the table heading **metric**, select the checkbox beside the line items you want to store, such as **AllMetrics**, and specify a **Retention (days)** policy. The maximum days retention you can specify is **365 days**, but if you want to keep the metrics data forever, set **Retention (days)** to **0**.
1. Select **Save**.
   :::image type="content" source="./media/cache-how-to-monitor/cache-diagnostics.png" alt-text="Redis diagnostics":::

>[!NOTE]
>In addition to archiving your cache metrics to storage, you can also [stream them to an event hub or send them to a Log Analytics workspace](/azure/azure-monitor/essentials/rest-api-walkthrough#retrieve-metric-values).
>
<!-- Add service-specific information about storing monitoring data here. For example, SQL Server stores other monitoring data in its own databases. If your service doesn't have non-Azure Monitor methods of storing monitoring data, just remove this comment. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- Use one of the following two includes, depending on whether or not your service gathers platform metrics: -->

<!-- ## Platform metrics. If your service has platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md#metrics).

### View Azure Cache for Redis metrics

You can view Azure Monitor metrics for Azure Cache for Redis directly from an Azure Cache for Redis resource in the [Azure portal](https://portal.azure.com).

To view basic cache metrics, [select your cache](cache-configure.md#configure-azure-cache-for-redis-settings) in the portal. On the **Overview** page, you see the predefined **Memory Usage** and **Redis Server Load** monitoring charts. These charts are useful summaries that allow you to take a quick look at the state of your cache.

:::image type="content" source="./media/cache-how-to-monitor/cache-overview-metrics.png" alt-text="Screen showing two charts: Memory Usage and Redis Server Load.":::

For more in-depth information, you can see more metrics under the **Monitoring** section of the Resource menu. Select **Metrics** to see, create, or customize a chart by adding metrics, removing metrics, and changing the reporting interval.

:::image type="content" source="media/cache-how-to-monitor/cache-monitor-metrics.png" alt-text="Screenshot of monitoring metrics selected in the Resource menu.":::

The other **Monitoring** options provide other ways to view and use the metrics for your caches.

|Selection  | Description  |
|---------|---------|
| [**Insights**](cache-insights-overview.md)   |   Predefined tiles and charts to use as starting point for your cache metrics.     |
| [**Alerts**](#create-alerts)     |   Alerts based on metrics and activity logs.      |
| [**Metrics**](#monitor-cache.md#metrics)     |   Built-in and custom charts to track the metrics you want to see.       |
| [**Advisor Recommendations**](cache-configure.md#advisor-recommendations)) |  Best practices to optimize your Azure deployments.       |
| [**Workbooks**](cache-insights-overview#workbooks)     |    Metrics information displayed in a coherent and effective way.     |

<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Customer-imported metrics. If your service doesn't use custom imported metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]
<!-- Customer-imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. If your service doesn't use any non-Azure Monitor based metrics, remove the following include and comments. -->
[!INCLUDE [horz-monitor-non-monitor-metrics](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

Metrics for Azure Cache for Redis instances are collected using the Redis [`INFO`](https://redis.io/commands/info) command. Metrics are collected approximately two times per minute and automatically stored for 30 days so they can be displayed in the metrics charts and evaluated by alert rules.

The metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. On the left, select the **Metric** in the **Monitoring** section. Each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

Each metric includes two versions: One metric measures performance for the entire cache, and for caches that use clustering. A second version of the metric, which includes `(Shard 0-9)` in the name, measures performance for a single shard in a cache. For example if a cache has four shards, `Cache Hits` is the total number of hits for the entire cache, and `Cache Hits (Shard 3)` measures just the hits for that shard of the cache.

You can create your own custom chart to track the metrics you want to see. In the Resource menu on the left, select **Metrics** under **Monitoring**. Here, you design your own chart for your cache, defining the metric type and aggregation type.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitor.png" alt-text="Screenshot with metrics showing in the resource manager":::

### Aggregation types

For aggregation type:

- **Count** shows the number of data points the metric received for your time granularity.
- **Max** shows the maximum value of a data point in the time granularity,
- **Min** shows the minimum value of a data point in the time granularity,
- **Average** shows the average value of all data points in the time granularity.
- **Sum** shows the sum of all data points in the time granularity, and might be misleading depending on the specific metric.

Under normal conditions, **Average** and **Max** are similar because only the primary node emits these metrics. In a scenario where the number of connected clients changes rapidly, **Max**, **Average**, and **Min** show different values, which is also expected behavior.

Generally, **Average** shows you a smooth chart of your desired metric and reacts well to changes in time granularity. **Max** and **Min** can hide large changes in the metric if the time granularity is large, but can be used with a small time granularity to help pinpoint exact times when large changes occur in the metric.

The types **Count** and **Sum** can be misleading for certain metrics (connected clients included). Instead, it's best to look at the **Average** metrics and not the **Sum** metrics.

> [!NOTE]
> Even when the cache is idle with no connected active client applications, you might see some cache activity, such as connected clients, memory usage, and operations being performed. The activity is normal in the operation of the cache.

For nonclustered caches, it's best to use the metrics without the suffix `Instance Based`. For example, to check server load for your cache instance, use the metric _Server Load_.

In contrast, for clustered caches, use the metrics with the suffix `Instance Based`. Then, add a split or filter on `ShardId`. For example, to check the server load of shard 1, use the metric **Server Load (Instance Based)**, then apply filter **ShardId = 1**.

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. If your service collects resource logs, add the following includes, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Cache for Redis, see [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md#resource-logs).
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings). Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

### Azure Cache for Redis resource logs

In Azure Cache for Redis, two options are available to log:

- **Cache Metrics** ("AllMetrics") [logs metrics from Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal)
- **Connection Logs** logs connections to the cache for security and diagnostic purposes. 

#### Cache metrics

Azure Cache for Redis emits many metrics such as `Server Load` and `Connections per Second` that are useful to log. Selecting the **AllMetrics** option allows these and other cache metrics to be logged. You can configure how long to retain the metrics.

#### Connection logs

Azure Cache for Redis uses Azure diagnostic settings to log information on client connections to your cache. Logging and analyzing this diagnostic setting helps you understand who is connecting to your caches and the timestamp of those connections. The log data could be used to identify the scope of a security breach and for security auditing purposes.

The connection logs have slightly different implementations, contents, and setup procedures for the different Azure Cache for Redis tiers. For details, see [Azure Monitor diagnostic settings](cache-monitor-diagnostic-settings.md).

for the diagnostic settings for connection logs and the differences Implementation of connection logs is slightly different between :
- **Basic, Standard, and Premium-tier caches** polls client connections by IP address, including the number of connections originating from each unique IP address. These logs aren't cumulative. They represent point-in-time snapshots taken at 10-second intervals. Authentication events (successful and failed) and disconnection events aren't logged in these tiers.  
- **Enterprise and Enterprise Flash-tier caches** use the [audit connection events](https://docs.redis.com/latest/rs/security/audit-events/) functionality built-into Redis Enterprise. Audit connection events allow every connection, disconnection, and authentication event to be logged, including failed authentication events. 

> [!IMPORTANT]
> The connection logging in the Basic, Standard, and Premium tiers _polls_ the current client connections in the cache. The same client IP addresses appears over and over again. Logging in the Enterprise and Enterprise Flash tiers is focused on each connection _event_. Logs only occur when the actual event occurred for the first time.
>

## Prerequisites/Limitations of Connection Logging

### Basic, Standard, and Premium tiers
- Because connection logs in these tiers consist of point-in-time snapshots taken every 10 seconds, connections that are established and removed in-between 10-second intervals aren't logged.
- Authentication events aren't logged.
- All diagnostic settings may take up to [90 minutes](../azure-monitor/essentials/diagnostic-settings.md#time-before-telemetry-gets-to-destination) to start flowing to your selected destination. 
- Enabling connection logs can cause a small performance degradation to the cache instance.
- Only the _Analytics Logs_ pricing plan is supported when streaming logs to Azure Log Analytics. For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). 

### Enterprise and Enterprise Flash tiers
- When you use **OSS Cluster Policy**, logs are emitted from each data node. When you use **Enterprise Cluster Policy**, only the node being used as a proxy emits logs. Both versions still cover all connections to the cache. This is just an architectural difference.  
- Data loss (that is, missing a connection event) is rare, but possible. Data loss is typically caused by networking issues. 
- Disconnection logs aren't yet fully stable and events may be missed.  
- Because connection logs on the Enterprise tiers are event-based, be careful of your retention policies. For instance, if retention is set to 10 days, and a connection event occurred 15 days ago, that connection might still exist, but the log for that connection isn't retained.
- If using [active geo-replication](cache-how-to-active-geo-replication.md), logging must be configured for each cache instance in the geo-replication group individually.
- All diagnostic settings may take up to [90 minutes](../azure-monitor/essentials/diagnostic-settings.md#time-before-telemetry-gets-to-destination) to start flowing to your selected destination. 
- Enabling connection logs may cause a small performance degradation to the cache instance.

> [!NOTE]
> It is always possible to use the [INFO](https://redis.io/commands/info/) or [CLIENT LIST](https://redis.io/commands/client-list/) commands to check who is connected to a cache instance on-demand.
>

> [!IMPORTANT]
> When selecting logs, you can chose either the specific _Category_ or _Category groups_, which are predefined groupings of logs across Azure services. When you use _Category groups_, [you can no longer configure the retention settings](../azure-monitor/essentials/diagnostic-settings.md#resource-logs). If you need to determine retention duration for your connection logs, select the item in the _Categories_ section instead. 
>

## Log Destinations




<!-- ## Activity log. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. If your service doesn't use imported logs, remove the following include and comments. -->
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
<!-- Imported log service-specific information. Add service-specific information about your imported logs here. -->

<!-- ## Other logs. If your service doesn't produce any other types of non-Azure Monitor logs, remove this comment.
If your service has other logs that aren't resource logs or in the activity log, you can state what they are and what they cover here. You can describe how to route them in a later section. If your service doesn't produce any other types of non-Azure Monitor logs, remove this comment. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data -->
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ### Sample Kusto queries. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->

<!-- ## Azure Cache for Redis service-specific analytics
Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- **MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

The following table lists common and recommended alert rules for Azure Cache for Redis.

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric |High `Server Load` usage or spikes |High server load means the Redis server is unable to keep up with requests, leading to timeouts or slow responses. Create alerts on metrics on server load metrics to be notified early about potential impacts.|
|Metric |High network bandwidth usage |If the server exceeds the available bandwidth, then data isn't sent to the client as quickly. Client requests could time out because the server can't push data to the client fast enough. Set up alerts for server-side network bandwidth limits by using the `Cache Read` and `Cache Write` counters. |

<!-- ALERTS SECTION END -------------------------------------->

## Related content

<!-- You can change the wording and add more links if useful. -->

- See [Azure Cache for Redis monitoring data reference](monitor-cache-reference.md) for a reference of the metrics, logs, and other important values created for Azure Cache for Redis.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
