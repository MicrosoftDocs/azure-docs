---
title: How to monitor Azure Redis Cache | Microsoft Docs
description: Learn how to monitor the health and performance your Azure Redis Cache instances
services: redis-cache
documentationcenter: ''
author: steved0x
manager: douge
editor: ''

ms.assetid: 7e70b153-9c87-4290-85af-2228f31df118
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: sdanie

---
# How to monitor Azure Redis Cache
Azure Redis Cache uses [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) to provide several options for monitoring your cache instances. You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. These tools enable you to monitor the health of your Azure Redis Cache instances and help you manage your caching applications.

Metrics for Azure Redis Cache instances are collected using the Redis [INFO](http://redis.io/commands/info) command approximately once per minute and automatically stored for 30 days (see [Export cache metrics](#export-cache-metrics) to configure a different retention policy) so they can be displayed in the metrics charts and evaluated by alert rules. For more information about the different INFO values used for each cache metric, see [Available metrics and reporting intervals](#available-metrics-and-reporting-intervals).

To view common sets of cache metrics, [browse](cache-configure.md#configure-redis-cache-settings) to your cache instance in the [Azure portal](https://portal.azure.com).  Azure Redis Cache provides some built-in charts on the **Overview** blade and the **Redis metrics** blade. Each chart can be customized by adding or removing metrics and changing the reporting interval.

![Redis metrics][redis-cache-redis-metrics-blade]

To view Redis metrics and create custom charts using Azure Monitor, click **Metrics** from the **Resource menu**, and customize your chart using the desired metrics, reporting interval, chart type, and more.

![Redis metrics](./media/cache-how-to-monitor/redis-cache-monitor.png)

For more information on working with metrics using Azure Monitor, see [Overview of metrics in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md) 

<a name="how-to-view-metrics-and-customize-chart"></a>
<a name="enable-cache-diagnostics"></a>
## Export cache metrics
By default, cache metrics in Azure Monitor are [stored for 30 days](../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md#store-and-archive) and then deleted. To persist your cache metrics for longer than 30 days, you can [designate a storage account](../monitoring-and-diagnostics/monitoring-archive-diagnostic-logs.md) and specify a **Retention (days)** policy for your cache metrics. If you do not want to apply any retention policy and retain data forever, set **Retention (days)** to **0**.

![Redis diagnostics](./media/cache-how-to-monitor/redis-cache-diagnostics.png)

>[!NOTE]
>In addition to archiving your cache metrics to storage, you can also [stream them to an Event hub or send them to Log Analytics](../monitoring-and-diagnostics/monitoring-overview-metrics.md#export-metrics).
>
>

To access your metrics, you can view them in the azure portal, and you can also access them using the [Azure Monitor Metrics REST API](../monitoring-and-diagnostics/monitoring-overview-metrics.md#access-metrics-via-the-rest-api).

> [!NOTE]
> Only metrics that are stored in the selected storage account are displayed in the Azure portal. If you change storage accounts, the data in the previously configured storage account remains available for download, but it is not displayed in the Azure portal.  
> 
> 

## Available metrics and reporting intervals
Cache metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. The **Metric** blade for each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval. 

Each metric includes two versions. One metric measures performance for the entire cache, and for caches that use [clustering](cache-how-to-premium-clustering.md), a second version of the metric that includes `(Shard 0-9)` in the name measures performance for a single shard in a cache. For example if a cache has 4 shards, `Cache Hits` is the total amount of hits for the entire cache, and `Cache Hits (Shard 3)` is just the hits for that shard of the cache.

> [!NOTE]
> Even when the cache is idle with no connected active client applications, you may see some cache activity, such as connected clients, memory usage, and operations being performed. This activity is normal during the operation of an Azure Redis Cache instance.
> 
> 

| Metric | Description |
| --- | --- |
| Cache Hits |The number of successful key lookups during the specified reporting interval. This maps to `keyspace_hits` from the Redis [INFO](http://redis.io/commands/info) command. |
| Cache Misses |The number of failed key lookups during the specified reporting interval. This maps to `keyspace_misses` from the Redis INFO command. Cache misses do not necessarily mean there is an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item is not there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache due to memory pressure then there may be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory` or `Evicted Keys`. |
| Connected Clients |The number of client connections to the cache during the specified reporting interval. This maps to `connected_clients` from the Redis INFO command. Once the [connection limit](cache-configure.md#default-redis-server-configuration) is reached subsequent connection attempts to the cache will fail. Note that even if there are no active client application, there may still be a few instances of connected clients due to internal processes and connections. |
| Evicted Keys |The number of items evicted from the cache during the specified reporting interval due to the `maxmemory` limit. This maps to `evicted_keys` from the Redis INFO command. |
| Expired Keys |The number of items expired from the cache during the specified reporting interval. This value maps to `expired_keys` from the Redis INFO command. |
| Gets |The number of get operations from the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_get`, `cmdstat_hget`, `cmdstat_hgetall`, `cmdstat_hmget`, `cmdstat_mget`, `cmdstat_getbit`, and `cmdstat_getrange`, and is equivalent to the sum of cache hits and misses during the reporting interval. |
| Redis Server Load |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. If this counter reaches 100 it means the Redis server has hit a performance ceiling and the CPU can't process work any faster. If you are seeing high Redis Server Load then you will see timeout exceptions in the client. In this case you should consider scaling up or partitioning your data into multiple caches. |
| Sets |The number of set operations to the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_set`, `cmdstat_hset`, `cmdstat_hmset`, `cmdstat_hsetnx`, `cmdstat_lset`, `cmdstat_mset`, `cmdstat_msetnx`, `cmdstat_setbit`, `cmdstat_setex`, `cmdstat_setrange`, and `cmdstat_setnx`. |
| Total Operations |The total number of commands processed by the cache server during the specified reporting interval. This value maps to `total_commands_processed` from the Redis INFO command. Note that when Azure Redis Cache is used purely for pub/sub there will be no metrics for `Cache Hits`, `Cache Misses`, `Gets`, or `Sets`, but there will be `Total Operations` metrics that reflect the cache usage for pub/sub operations. |
| Used Memory |The amount of cache memory used for key/value pairs in the cache in MB during the specified reporting interval. This value maps to `used_memory` from the Redis INFO command. This does not include metadata or fragmentation. |
| Used Memory RSS |The amount of cache memory used in MB during the specified reporting interval, including fragmentation and metadata. This value maps to `used_memory_rss` from the Redis INFO command. |
| CPU |The CPU utilization of the Azure Redis Cache server as a percentage during the specified reporting interval. This value maps to the operating system `\Processor(_Total)\% Processor Time` performance counter. |
| Cache Read |The amount of data read from the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and is not Redis specific. **This value corresponds to the network bandwidth used by this cache. If you want to set up alerts for server side network bandwidth limits, then create it using this `Cache Read` counter. See [this table](cache-faq.md#cache-performance) for the observed bandwidth limits for various cache pricing tiers and sizes.** |
| Cache Write |The amount of data written to the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and is not Redis specific. This value corresponds to the network bandwidth of data sent to the cache from the client. |

## How to monitor a premium cache with clustering
Premium caches that have [clustering](cache-how-to-premium-clustering.md) enabled can have up to 10 shards. Each shard has its own metrics, and these metrics are aggregated to provide metrics for the cache as a whole. Each metric includes two versions. One metric measures performance for the entire cache and a second version of the metric that includes `(Shard 0-9)` in the name measures performance for a single shard in a cache. For example if a cache has 3 shards, `Cache Hits` is the total amount of hits for the entire cache, and `Cache Hits (Shard 2)` is just the hits for that shard of the cache.

Each monitoring chart displays the top level metrics for the cache along with the metrics for each cache shard.

![Monitor][redis-cache-premium-monitor]

Hovering the mouse over the data points displays the details for that point in time. 

![Monitor][redis-cache-premium-point-summary]

The larger values are typically the aggregate values for the cache while the smaller values are the individual metrics for the shard. Note that in this example there are three shards and the cache hits are distributed evenly across the shards.

![Monitor][redis-cache-premium-point-shard]

To see more detail click the chart to view an expanded view on the **Metric** blade.

![Monitor][redis-cache-premium-chart-detail]

By default each chart includes the top-level cache performance counter as well as the performance counters for the individual shards. You can customize these on the **Edit Chart** blade.

![Monitor][redis-cache-premium-edit]

For more information on the available performance counters, see [Available metrics and reporting intervals](#available-metrics-and-reporting-intervals).

## Operations and alerts
The **Operations** section on the **Redis Cache** blade has **Events** and **Alert rules** sections.

![Oeprations][redis-cache-operations-events]

To see a list of recent cache operations, click the **Events** chart to display the **Events** blade. Examples of operations include retrieving and regenerating access keys, and the activation and resolution of alert rules. For more information about each event, click the event in the **Events** blade.

For more information on events, see [View events and audit logs](../monitoring-and-diagnostics/insights-debugging-with-events.md).

The **Alert rules** section displays the count of alerts for the cache instance. An alert rule enables you to monitor your cache instance and receive an email whenever a certain metric value reaches the threshold defined in the rule. 

Alert rules are evaluated approximately every five minutes, and when an alert rule is activated, any configured notifications are sent. Alert rule activations and notifications are not processed instantaneously; there may be a delay of several minutes before an alert rule is activated and notifications sent.

Alert rules can be viewed and set from the **Metric** blade for a specific monitoring chart, or from the **Alert rules** blade.

Alert rules have the following properties.

| Alert rule property | Description |
| --- | --- |
| Resource |The resource evaluated by the alert rule. When creating an alert rule from a Redis cache, the cache is the resource. |
| Name |Name that uniquely identifies the alert rule within the current cache instance. |
| Description |Optional description of the alert rule. |
| Metric |The metric to be monitored by the alert rule. For a list of cache metrics, see Available metrics and reporting intervals. |
| Condition |The condition operator for the alert rule. Possible choices are: greater than, greater than or equal to, less than, less than or equal to |
| Threshold |The value used to compare with the metric using the operator specified by the condition property. Depending on the metric, this value may be in bytes/second, bytes, %, or count. |
| Period |Specifies the period over which the average value of the metric is used for the alert rule comparison. For example, if the period is Over the last hour, the average value of the metric over the previous hour interval is used for the comparison. If you want to be notified when the threshold is met due to a spike in activity, then a shorter period is appropriate. To be notified when there is sustained activity above the threshold, use a longer period. |
| Email service and co-administrators |When true, the service administrator and co-administrator are emailed when the alert is activated. |
| Additional administrator email |Optional email address for an additional administrator to be notified when the alert is activated. |

Only one notification is sent per alert rule activation. Once the threshold for a rule is exceeded and a notification is sent, the rule is not re-evaluated until the metric falls below the threshold. If the metric subsequently exceeds the threshold, the alert is reactivated and a new notification is sent.

To view all of the alert rules for your cache instance, click the **Alert rules** part in the **Redis Cache** blade. To view only the alert rules that use a specific metric, navigate to the **Metric** blade for the chart that contains that metric.

![Alert rules][redis-cache-alert-rules]

To add an alert rule, click **Add alert** from either the **Metric** blade or the **Alert rules** blade. 

Enter the desired rule criteria into the **Add an alert** rule blade and click **OK**. 

![Add alert rule][redis-cache-add-alert]

> [!NOTE]
> When an alert rule is created by clicking **Add alert** from the **Metric** blade, only the metrics displayed on the chart in that blade appear in the **Metric** drop-down. When an alert rule is created by clicking **Add alert** from the **Alert rules** blade, all cache metrics are available in the **Metric** drop-down.
> 
> 

Once an alert rule is saved it appears on the **Alert rules** blade as well as on the **Metric** blade for any charts that display the metric used in the alert rule. To edit an alert rule, click the name of the alert rule to display the **Edit Rule** blade. From the **Edit Rule** blade you can edit the properties of the rule, delete or disable the alert rule, or re-enable the rule if it was previously disabled.

> [!NOTE]
> Any changes you make to the properties of the rule may take a moment before they are reflected on the **Alert rules** blade or the **Metric** blade.
> 
> 

When an alert rule is activated, an email is sent depending on the configuration of the alert rule, and an alert icon is displayed in the **Alert rules** part on the **Redis Cache** blade.

An alert rule is considered to be resolved when the alert condition no longer evaluates to true. Once the alert rule condition is resolved, the alert icon is replaced with a check mark. For details on alert activations and resolutions, click the **Events** part on the **Redis Cache** blade to view the events on the **Events** blade.

For more information about alerts in Azure, see [Receive alert notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md).

## Metrics on the Redis Cache blade
The **Redis Cache** blade displays the following categories of metrics.

* [Monitoring charts](#monitoring-charts)
* [Usage charts](#usage-charts)

### Monitoring charts
The **Monitoring** section has **Hits and Misses**, **Gets and Sets**, **Connections**, and **Total Commands** charts.

![Monitoring charts][redis-cache-monitoring-part]

The **Monitoring** charts display the following metrics.

| Monitoring chart | Cache metrics |
| --- | --- |
| Hits and Misses |Cache Hits |
| Cache Misses | |
| Gets and Sets |Gets |
| Sets | |
| Connections |Connected Clients |
| Total Commands |Total Operations |

For information on viewing the metrics and customizing the individual charts in this section, see the following [How to view metrics and customize metrics charts](#how-to-view-metrics-and-customize-charts) section.

### Usage charts
The **Usage** section has **Redis Server Load**, **Memory Usage**, **Network Bandwith**, and **CPU Usage** charts, and also displays the **Pricing tier** for the cache instance.

![Usage charts][redis-cache-usage-part]

The **Pricing tier** displays the cache pricing tier, and can be used to [scale](cache-how-to-scale.md) the cache to a different pricing tier.

The **Usage** charts display the following metrics.

| Usage chart | Cache metrics |
| --- | --- |
| Redis Server Load |Server Load |
| Memory Usage |Used Memory |
| Network Bandwidth |Cache Write |
| CPU Usage |CPU |

For information on viewing the metrics and customizing the individual charts in this section, see the following [How to view metrics and customize metrics charts](#how-to-view-metrics-and-customize-charts) section.

<!-- IMAGES -->

[redis-cache-enable-diagnostics]: ./media/cache-how-to-monitor/redis-cache-enable-diagnostics.png

[redis-cache-diagnostic-settings]: ./media/cache-how-to-monitor/redis-cache-diagnostic-settings.png

[redis-cache-configure-diagnostics]: ./media/cache-how-to-monitor/redis-cache-configure-diagnostics.png

[redis-cache-monitoring-part]: ./media/cache-how-to-monitor/redis-cache-monitoring-part.png

[redis-cache-usage-part]: ./media/cache-how-to-monitor/redis-cache-usage-part.png

[redis-cache-metric-blade]: ./media/cache-how-to-monitor/redis-cache-metric-blade.png

[redis-cache-edit-chart]: ./media/cache-how-to-monitor/redis-cache-edit-chart.png

[redis-cache-view-chart-details]: ./media/cache-how-to-monitor/redis-cache-view-chart-details.png

[redis-cache-operations-events]: ./media/cache-how-to-monitor/redis-cache-operations-events.png

[redis-cache-alert-rules]: ./media/cache-how-to-monitor/redis-cache-alert-rules.png

[redis-cache-add-alert]: ./media/cache-how-to-monitor/redis-cache-add-alert.png

[redis-cache-premium-monitor]: ./media/cache-how-to-monitor/redis-cache-premium-monitor.png

[redis-cache-premium-edit]: ./media/cache-how-to-monitor/redis-cache-premium-edit.png

[redis-cache-premium-chart-detail]: ./media/cache-how-to-monitor/redis-cache-premium-chart-detail.png

[redis-cache-premium-point-summary]: ./media/cache-how-to-monitor/redis-cache-premium-point-summary.png

[redis-cache-premium-point-shard]: ./media/cache-how-to-monitor/redis-cache-premium-point-shard.png

[redis-cache-redis-metrics]: ./media/cache-how-to-monitor/redis-cache-redis-metrics.png

[redis-cache-redis-metrics-blade]: ./media/cache-how-to-monitor/redis-cache-redis-metrics-blade.png





