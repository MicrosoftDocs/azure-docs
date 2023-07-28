---
title: Monitor Azure Cache for Redis
description: Learn how to monitor the health and performance your Azure Cache for Redis instances
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/06/2023

---
# Monitor Azure Cache for Redis

Azure Cache for Redis uses [Azure Monitor](../azure-monitor/index.yml) to provide several options for monitoring your cache instances. Use these tools to monitor the health of your Azure Cache for Redis instances and to help you manage your caching applications.

Use Azure Monitor to:

- view metrics
- pin metrics charts to the dashboard
- customize the date and time range of monitoring charts
- add and remove metrics from the charts
- and set alerts when certain conditions are met

Metrics for Azure Cache for Redis instances are collected using the Redis [`INFO`](https://redis.io/commands/info) command. Metrics are collected approximately two times per minute and automatically stored for 30 days so they can be displayed in the metrics charts and evaluated by alert rules.

To configure a different retention policy, see [Use a storage account to export cache metrics](#use-a-storage-account-to-export-cache-metrics).  

For more information about the different `INFO` values used for each cache metric, see [Create your own metrics](#create-your-own-metrics).

## View cache metrics

The Resource menu shows some simple metrics in two places: **Overview** and **Monitoring**.

To view basic cache metrics, [find your cache](cache-configure.md#configure-azure-cache-for-redis-settings) in the [Azure portal](https://portal.azure.com). On the left, select **Overview**. You see the following predefined monitoring charts: **Memory Usage**, and **Redis Server Load**. These charts are useful summaries that allow you to take a quick look at the state of your cache.

:::image type="content" source="./media/cache-how-to-monitor/cache-overview-metrics.png" alt-text="Screen showing two charts: Memory Usage and Redis Server Load.":::

For more in depth information, you can see more metrics under the **Monitoring** section of the Resource menu. Select **Metrics** to see, create, or customize a chart by adding metrics, removing metrics, and changing the reporting interval.

:::image type="content" source="media/cache-how-to-monitor/cache-monitor-metrics.png" alt-text="Screenshot of monitoring metrics selected in the Resource menu.":::

The other options under **Monitoring**, provide other ways to view and use the metrics for your caches.

|Selection  | Description  |
|---------|---------|
| [**Insights**](#use-insights-for-predefined-charts)   |   A group of predefined tiles and charts to use as starting point for your cache metrics.     |
| [**Alerts**](#create-alerts)     |   Configure alerts based on metrics and activity logs.      |
| [**Metrics**](#create-your-own-metrics)     |   Create your own custom chart to track the metrics you want to see.       |
| [**Advisor Recommendations**](cache-configure.md#advisor-recommendations)) |  Helps you follow best practices to optimize your Azure deployments.       |
| [**Workbooks**](#organize-with-workbooks)     |    Organize your metrics into groups so that you display metric information in a coherent and effective way.     |

## View metrics charts with Azure Monitor for Azure Cache for Redis

Use [Azure Monitor for Azure Cache for Redis](redis-cache-insights-overview.md) for a view of the overall performance, failures, capacity, and operational health of all your Azure Cache for Redis resources. View metrics in a customizable, unified, and interactive experience that lets you drill down into details for individual resources. Azure Monitor for Azure Cache for Redis is based on the [workbooks feature of Azure Monitor](../azure-monitor/visualize/workbooks-overview.md) that provides rich visualizations for metrics and other data. To learn more, see the [Explore Azure Monitor for Azure Cache for Redis](redis-cache-insights-overview.md) article.

While you can access Azure Monitor features from the Monitor menu in the Azure portal, Azure Monitor features can be accessed directly from the Resource menu for an Azure Cache for Redis resource. For more information on working with metrics using Azure Monitor, see [Overview of metrics in Microsoft Azure](../azure-monitor/data-platform.md).

For scenarios where you don't need the full flexibility of Azure Monitor for Azure Cache for Redis, you can instead view metrics and create custom charts using **Metrics** from the Resource menu for your cache, and customize your chart using your preferred metrics, reporting interval, chart type, and more. For more information, see [Create your own metrics](#create-your-own-metrics).

## Use Insights for predefined charts

The **Monitoring** section in the Resource menu contains **Insights**. When you select **Insights**, you see groupings of three types of charts: **Overview**, **Performance** and **Operations**.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitoring-part.png" alt-text="Screenshot showing Monitoring Insights selected in the Resource menu.":::

Each tab contains status tiles and charts. These tiles and charts are a starting point for your metrics. If you wish to expand beyond **Insights**, you can define your own alerts, metrics, diagnostic settings and workbooks.

## Use a storage account to export cache metrics

By default, cache metrics in Azure Monitor are [stored for 30 days](../azure-monitor/essentials/data-platform-metrics.md) and then deleted. To persist your cache metrics for longer than 30 days, you can use a [storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage) and specify a **Retention (days)** policy that meets your requirements.

Configure a storage account to use with to store your metrics. The storage account must be in the same region as the caches. Once you've created a storage account, configure a storage account for your cache metrics:

1. In the **Azure Cache for Redis** page, under the **Monitoring** heading, select **Diagnostics settings**.

1. Select **+ Add diagnostic setting**.

1. Name the settings.

1. Check **Archive to a storage account**. You’ll be charged normal data rates for storage and transactions when you send diagnostics to a storage account.

1. Select **Configure** to choose the storage account in which to store the cache metrics.

1. Under the table heading **metric**, check box beside the line items you want to store, such as **AllMetrics**. Specify a **Retention (days)** policy. The maximum days retention you can specify is **365 days**. However, if you want to keep the metrics data forever, set **Retention (days)** to **0**.

1. Select **Save**.
   :::image type="content" source="./media/cache-how-to-monitor/cache-diagnostics.png" alt-text="Redis diagnostics":::

>[!NOTE]
>In addition to archiving your cache metrics to storage, you can also [stream them to an Event hub or send them to a Log Analytics workspace](../azure-monitor/essentials/rest-api-walkthrough.md#retrieve-metric-values).
>

To access your metrics, you view them in the Azure portal as previously described in this article. You can also access them using the [Azure Monitor Metrics REST API](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md).

> [!NOTE]
> If you change storage accounts, the data in the previously configured storage account remains available for download, but it is not displayed in the Azure portal.  
>

## Create your own metrics

You can create your own custom chart to track the metrics you want to see. Cache metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. On the left, select the **Metric** in the **Monitoring** section. Each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

Each metric includes two versions: One metric measures performance for the entire cache, and for caches that use [clustering](cache-how-to-premium-clustering.md). A second version of the metric, which includes `(Shard 0-9)` in the name, measures performance for a single shard in a cache. For example if a cache has four shards, `Cache Hits` is the total number of hits for the entire cache, and `Cache Hits (Shard 3)` measures just the hits for that shard of the cache.

In the Resource menu on the left, select **Metrics** under **Monitoring**. Here, you design your own chart for your cache, defining the metric type and aggregation type.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitor.png" alt-text="Screenshot with metrics showing in the resource manager":::

### Aggregation types

When you're seeing the aggregation type:

- **Count** show 2, it indicates the metric received 2 data points for your time granularity (1 minute).
- **Max** shows the maximum value of a data point in the time granularity,
- **Min** shows the minimum value of a data point in the time granularity,
- **Average** shows the average value of all data points in the time granularity.
- **Sum** shows the sum of all data points in the time granularity and may be misleading depending on the specific metric.

Under normal conditions, **Average** and **Max** are similar because only one node emits these metrics (the primary node). In a scenario where the number of connected clients changes rapidly, **Max**, **Average**, and **Min** would show different values and is also expected behavior.

Generally, **Average** shows you a smooth chart of your desired metric and reacts well to changes in time granularity. **Max** and **Min** can hide large changes in the metric if the time granularity is large but can be used with a small time granularity to help pinpoint exact times when large changes occur in the metric.

The types **Count** and **“Sum** can be misleading for certain metrics (connected clients included). Instead, we suggest you look at the **Average** metrics and not the **Sum** metrics.

> [!NOTE]
> Even when the cache is idle with no connected active client applications, you might see some cache activity, such as connected clients, memory usage, and operations being performed. The activity is normal in the operation of cache.
>

For non-clustered caches, we recommend using the metrics without the suffix `Instance Based`. For example, to check server load for your cache instance, use the metric `Server Load`.

In contrast, for clustered caches, we recommend using the metrics with the suffix `Instance Based`. Then, add a split or filter on `ShardId`. For example, to check the server load of shard 1, use the metric "Server Load (Instance Based)", then apply filter `ShardId = 1`.

## List of metrics

- 99th Percentile Latency (preview)
  - Depicts the worst-case (99th percentile) latency of server-side commands. Measured by issuing `PING` commands from the load balancer to the Redis server and tracking the time to respond. 
  - Useful for tracking the health of your Redis instance. Latency will increase if the cache is under heavy load or if there are long running commands that delay the execution of the `PING` command.
  - This metric is only available in Standard and Premium tier caches
- Cache Latency (preview)
  - The latency of the cache calculated using the internode latency of the cache. This metric is measured in microseconds, and has three dimensions: `Avg`, `Min`, and `Max`. The dimensions represent the average, minimum, and maximum latency of the cache during the specified reporting interval.
- Cache Misses
  - The number of failed key lookups during the specified reporting interval. This number maps to `keyspace_misses` from the Redis INFO command. Cache misses don't necessarily mean there's an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item isn't there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache because of memory pressure, then there may be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory` or `Evicted Keys`.
- Cache Miss Rate
  - The percent of unsuccessful key lookups during the specified reporting interval. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- Cache Read
  - The amount of data read from the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and isn't Redis specific. This value corresponds to the network bandwidth used by this cache. If you want to set up alerts for server-side network bandwidth limits, then create it using this `Cache Read` counter. See [this table](./cache-planning-faq.yml#azure-cache-for-redis-performance) for the observed bandwidth limits for various cache pricing tiers and sizes.
- Cache Write
  - The amount of data written to the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and isn't Redis specific. This value corresponds to the network bandwidth of data sent to the cache from the client.
- Connected Clients
  - The number of client connections to the cache during the specified reporting interval. This number maps to `connected_clients` from the Redis INFO command. Once the [connection limit](cache-configure.md#default-redis-server-configuration) is reached, later attempts to connect to the cache fail. Even if there are no active client applications, there may still be a few instances of connected clients because of internal processes and connections.
- Connected Clients Using AAD Token (preview)
   - The number of client connections to the cache authenticated using Azure AD token during the specified reporting interval.
- Connections Created Per Second
  - The number of instantaneous connections created per second on the cache via port 6379 or 6380 (SSL). This metric can help identify whether clients are frequently disconnecting and reconnecting, which can cause higher CPU usage and Redis Server Load. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- Connections Closed Per Second
  - The number of instantaneous connections closed per second on the cache via port 6379 or 6380 (SSL). This metric can help identify whether clients are frequently disconnecting and reconnecting, which can cause higher CPU usage and Redis Server Load. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- CPU
  - The CPU utilization of the Azure Cache for Redis server as a percentage during the specified reporting interval. This value maps to the operating system `\Processor(_Total)\% Processor Time` performance counter. Note: This metric can be noisy due to low priority background security processes running on the node, so we recommend monitoring Server Load metric to track load on a Redis server.
- Errors
  - Specific failures and performance issues that the cache could be experiencing during a specified reporting interval. This metric has eight dimensions representing different error types, but could have more added in the future. The error types represented now are as follows:
    - **Failover** – when a cache fails over (subordinate promotes to primary)
    - **Dataloss** – when there's data loss on the cache
    - **UnresponsiveClients** – when the clients aren't reading data from the server fast enough, and specifically, when the number of bytes in the Redis server output buffer for a client goes over 1,000,000 bytes
    - **AOF** – when there's an issue related to AOF persistence
    - **RDB** – when there's an issue related to RDB persistence
    - **Import** – when there's an issue related to Import RDB
    - **Export** – when there's an issue related to Export RDB
    - **AADAuthenticationFailure** (preview) - when there's an authentication failure using Azure AD Access token
    - **AADTokenExpired** (preview) - when an Azure AD access token used for authentication is not renewed and it expires.
- Evicted Keys
  - The number of items evicted from the cache during the specified reporting interval because of the `maxmemory` limit.
  - This number maps to `evicted_keys` from the Redis INFO command.
- Expired Keys
  - The number of items expired from the cache during the specified reporting interval. This value maps to `expired_keys` from the Redis INFO command.

> [!IMPORTANT]
> Geo-replication metrics are affected by monthly internal maintenance operations. The Azure Cache for Redis service periodically patches all caches with the latest platform features and improvements. During these updates, each cache node is taken offline, which temporarily disables the geo-replication link. If your geo replication link is unhealthy, check to see if it was caused by a patching event on either the geo-primary or geo-secondary cache by using **Diagnose and Solve Problems**  from the Resource menu in the portal. Depending on the amount of data in the cache, the downtime from patching can take anywhere from a few minutes to an hour. If the geo-replication link is unhealthy for over an hour, [file a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
>

> [!NOTE]
> The [Geo-Replication Dashboard](#organize-with-workbooks) workbook is a simple and easy way to view all Premium-tier geo-replication metrics in the same place. This dashboard will pull together metrics that are only emitted by the geo-primary or geo-secondary, so they can be viewed simultaneously.
>

- Geo Replication Connectivity Lag
  - Depicts the time, in seconds, since the last successful data synchronization between geo-primary & geo-secondary. If the link goes down, this value continues to increase, indicating a problem.
  - This metric is only emitted **from the geo-secondary** cache instance. On the geo-primary instance, this metric has no value.
  - This metric is only available in the Premium tier for caches with geo-replication enabled.
- Geo Replication Data Sync Offset
  - Depicts the approximate amount of data, in bytes, that has yet to be synchronized to geo-secondary cache.
  - This metric is only emitted _from the geo-primary_ cache instance. On the geo-secondary instance, this metric has no value.
  - This metric is only available in the Premium tier for caches with geo-replication enabled.
- Geo Replication Full Sync Event Finished
  - Depicts the completion of full synchronization between geo-replicated caches. When you see lots of writes on geo-primary, and replication between the two caches can’t keep up, then a full sync is needed. A full sync involves copying the complete data from geo-primary to geo-secondary by taking an RDB snapshot rather than a partial sync that occurs on normal instances. See [this page](https://redis.io/docs/manual/replication/#how-redis-replication-works) for a more detailed explanation.
   - The metric reports zero most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization.
   - This metric is only emitted _from the geo-secondary_ cache instance. On the geo-primary instance, this metric has no value.
   - This metric is only available in the Premium tier for caches with geo-replication enabled.

- Geo Replication Full Sync Event Started
  - Depicts the start of full synchronization between geo-replicated caches. When there are many writes in geo-primary, and replication between the two caches can’t keep up, then a full sync is needed. A full sync involves copying the complete data from geo-primary to geo-secondary by taking an RDB snapshot rather than a partial sync that occurs on normal instances. See [this page](https://redis.io/docs/manual/replication/#how-redis-replication-works) for a more detailed explanation.
  - The metric reports zero most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization.
  - The metric is only emitted _from the geo-secondary_ cache instance. On the geo-primary instance, this metric has no value.
  - The metric is only available in the Premium tier for caches with geo-replication enabled.

- Geo Replication Healthy
  - Depicts the status of the geo-replication link between caches. There can be two possible states that the replication link can be in:
    - 0 disconnected/unhealthy
    - 1 – healthy
  - The metric is available in the Enterprise, Enterprise Flash tiers, and Premium tier caches with geo-replication enabled.
  - In caches on the Premium tier, this metric is only emitted *from the geo-secondary* cache instance. On the geo-primary instance, this metric has no value.
  - This metric may indicate a disconnected/unhealthy replication status for several reasons, including: monthly patching, host OS updates, network misconfiguration, or failed geo-replication link provisioning.
  - A value of 0 doesn't mean that data on the geo-replica is lost. It just means that the link between geo-primary and geo-secondary is unhealthy. 
  - If the geo-replication link is unhealthy for over an hour, [file a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

- Gets
  - The number of get operations from the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_get`, `cmdstat_hget`, `cmdstat_hgetall`, `cmdstat_hmget`, `cmdstat_mget`, `cmdstat_getbit`, and `cmdstat_getrange`, and is equivalent to the sum of cache hits and misses during the reporting interval.
- Operations per Second
  - The total number of commands processed per second by the cache server during the specified reporting interval.  This value maps to "instantaneous_ops_per_sec" from the Redis INFO command.
- Server Load
  - The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. If this counter reaches 100, the Redis server has hit a performance ceiling, and the CPU can't process work any faster. If you're seeing high Redis Server Load, then you see timeout exceptions in the client. In this case, you should consider scaling up or partitioning your data into multiple caches.
  
> [!CAUTION]
> The Server Load metric can present incorrect data for Enterprise and Enterprise Flash tier caches. Sometimes Server Load is represented as being over 100. We are investigating this issue. We recommend using the CPU metric instead in the meantime.

- Sets
  - The number of set operations to the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_set`, `cmdstat_hset`, `cmdstat_hmset`, `cmdstat_hsetnx`, `cmdstat_lset`, `cmdstat_mset`, `cmdstat_msetnx`, `cmdstat_setbit`, `cmdstat_setex`, `cmdstat_setrange`, and `cmdstat_setnx`.
- Total Keys  
  - The maximum number of keys in the cache during the past reporting time period. This number maps to `keyspace` from the Redis INFO command. Because of a limitation in the underlying metrics system for caches with clustering enabled, Total Keys return the maximum number of keys of the shard that had the maximum number of keys during the reporting interval.
- Total Operations
  - The total number of commands processed by the cache server during the specified reporting interval. This value maps to `total_commands_processed` from the Redis INFO command. When Azure Cache for Redis is used purely for pub/sub there will be no metrics for `Cache Hits`, `Cache Misses`, `Gets`, or `Sets`, but there will be `Total Operations` metrics that reflect the cache usage for pub/sub operations.
- Used Memory
  - The amount of cache memory in MB that is used for key/value pairs in the cache during the specified reporting interval. This value maps to `used_memory` from the Redis INFO command. This value doesn't include metadata or fragmentation.
- Used Memory Percentage
  - The percent of total memory that is being used during the specified reporting interval.  This value references the `used_memory` value from the Redis INFO command to calculate the percentage. This value doesn't include fragmentation.
- Used Memory RSS
  - The amount of cache memory used in MB during the specified reporting interval, including fragmentation. This value maps to `used_memory_rss` from the Redis INFO command. This metric isn't available in Enterprise or Enterprise Flash tier caches.

## Create alerts

You can configure to receive alerts based on metrics and activity logs. Azure Monitor allows you to configure an alert to do the following when it triggers:

- Send an email notification
- Call a webhook
- Invoke an Azure Logic App

To configure alerts for your cache, select **Alerts** under **Monitoring** on the Resource menu.

:::image type="content" source="./media/cache-how-to-monitor/cache-monitoring.png" alt-text="Screenshot showing how to create an alert.":::

For more information about configuring and using Alerts, see [Overview of Alerts](../azure-monitor/alerts/alerts-classic-portal.md).

## Organize with workbooks

Once you've defined a metric, you can send it to a workbook. Workbooks provide a way to organize your metrics into groups that provide the information in coherent way. Azure Cache for Redis provides two workbooks by default in the **Azure Cache for Redis Insights** section:

   :::image type="content" source="media/cache-how-to-monitor/cache-monitoring-workbook.png" alt-text="Screenshot showing the workbooks selected in the Resource menu.":::

For information on creating a metric, see [Create your own metrics](#create-your-own-metrics).

The two workbooks provided are: 
- **Azure Cache For Redis Resource Overview** combines many of the most commonly used metrics so that the health and performance of the cache instance can be viewed at a glance.
    :::image type="content" source="media/cache-how-to-monitor/cache-monitoring-resource-overview.png" alt-text="Screenshot of graphs showing a resource overview for the cache.":::

- **Geo-Replication Dashboard** pulls geo-replication health and status metrics from both the geo-primary and geo-secondary cache instances to give a complete picture of geo-replcation health. Using this dashboard is recommended, as some geo-replication metrics are only emitted from either the geo-primary or geo-secondary. 
    :::image type="content" source="media/cache-how-to-monitor/cache-monitoring-geo-dashboard.png" alt-text="Screenshot showing the geo-replication dashboard with a geo-primary and geo-secondary cache set.":::

## Next steps

- [Azure Monitor for Azure Cache for Redis](redis-cache-insights-overview.md)
- [Azure Monitor Metrics REST API](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md)
- [`INFO`](https://redis.io/commands/info)
