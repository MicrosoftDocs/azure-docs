<properties 
	pageTitle="How to monitor Azure Redis Cache" 
	description="Learn how to monitor the health and performance your Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/25/2015" 
	ms.author="sdanie"/>

# How to monitor Azure Redis Cache

Azure Redis Cache provides several options for monitoring your cache instances. You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. These tools enable you to monitor the health of your Azure Redis Cache instances and help you manage your caching applications.

When cache diagnostics are enabled, metrics for Azure Redis Cache instances are collected approximately every 30 seconds and stored so they can be displayed in the metrics charts and evaluated by alert rules.

Cache metrics are collected using the Redis [INFO](http://redis.io/commands/info) command. For more information about the different INFO commands used for each cache metric, see [Available metrics and reporting intervals](#available-metrics-and-reporting-intervals).

To view cache metrics, [browse](https://msdn.microsoft.com/library/azure/cbe6d113-7bdc-4664-a59d-ff0df6f4e214#CacheSettings) to your cache instance in the [Azure preview portal](https://portal.azure.com). Metrics for Azure Redis Cache instances are accessed on the **Redis Cache** blade.

![Monitor][redis-cache-monitor-overview]

>[AZURE.IMPORTANT] If the following message is displayed in the preview portal, follow the steps in the [Enable cache diagnostics](#enable-cache-diagnostics) section to enable cache diagnostics.
>
>`Monitoring may not be enabled. Click here to turn on Diagnostics.`

The **Redis Cache** blade has **Monitoring** charts and **Usage** charts that display cache metrics. Each chart can be customized by adding or removing metrics and changing the reporting interval. The **Redis Cache** blade also has an **Operations** section that displays cache **Events** and **Alert rules**.

## Enable cache diagnostics

Azure Redis Cache provides you the ability to have diagnostics data stored in a storage account so you can use any tools you want to access and process the data directly. In order for cache diagnostics to be collected, stored, and displayed in the Azure preview portal, a storage account must be configured. Caches in the same region and subscription share the same diagnostics storage account, and when the configuration is changed it applies to all caches in the subscription that are in that region.

To enable and configure cache diagnostics, navigate to the **Redis Cache** blade for your cache instance. If diagnostics are not yet enabled, a message is displayed instead of a diagnostics chart.

![Enable cache diagnostics][redis-cache-enable-diagnostics]

Click one of the monitoring charts such as **Hits and Misses** to display the **Metric** blade and click **Diagnostic settings** to enable and configure the diagnostic settings for the cache service instance.

![Diagnostics settings][redis-cache-diagnostic-settings]

![Configure diagnostics][redis-cache-configure-diagnostics]

Click the **On** button to enable cache diagnostics and display the diagnostics configuration.

Click the arrow to the right of **Storage Account** to select a storage account to hold diagnostic data. For best performance, select a storage account in the same region as your cache.

Use the **Retention (days)** drop-down to select the retention period for the diagnostic data. You can also type the desired number of days into the textbox at the top of the list.

Once the diagnostic settings are configured, click **Save** to save the configuration. Note that it may take a few moments for the changes to take effect.

>[AZURE.IMPORTANT] Caches in the same region and subscription share the same diagnostics storage account, and when the configuration is changed it applies to all caches in the subscription that are in that region.

To view the stored metrics, examine the tables in your storage account with names that start with `WADMetrics`. For more information about accessing the stored metrics outside of the preview portal, see the [Access Redis Cache Monitoring data](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) sample.

>[AZURE.NOTE] Only metrics that are stored in the selected storage account are displayed in the preview portal. If you change storage accounts, the data in the previously configured storage account remains available for download, but it is not displayed in the preview portal and is not purged when the retention period interval elapses.  

## Available metrics and reporting intervals

Cache metrics are reported using several reporting intervals, including **Past hour**, **Today**, **Past week**, and **Custom**. The **Metric** blade for each metrics chart displays the average, minimum, and maximum values for each metric in the chart, and some metrics display a total for the reporting interval.

>[AZURE.NOTE] Even when the cache is idle with no connected active client applications, you may see some cache activity, such as connected clients, memory usage, and operations being performed. This activity is normal during the operation of an Azure Redis Cache instance.

| Metric            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cache Hits        | The number of successful key lookups during the specified reporting interval. This value maps to the Redis INFO `keyspace_hits command`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Cache Misses      | The number of failed key lookups during the specified reporting interval. This value maps to the Redis INFO `keyspace_misses` command. Cache misses do not necessarily mean there is an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item is not there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache due to memory pressure then there may be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory` or `Evicted Keys`. |
| Connected Clients | The number of client connections to the cache during the specified reporting interval. This value maps to the Redis INFO `connected_clients` command. The connected clients limit is 10,000 and once it is reached subsequent connection attempts to the cache will fail. Note that even if there are no active client application, there may still be a few instances of connected clients due to internal processes and connections.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Evicted Keys      | The number of items evicted from the cache during the specified reporting interval due to the `maxmemory` limit. This value maps to the Redis INFO `evicted_keys` command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Expired Keys      | The number of items expired from the cache during the specified reporting interval. This value maps to the Redis INFO `expired_keys` command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Gets              | The number of get operations from the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_get`, `cmdstat_hget`, `cmdstat_hgetall`, `cmdstat_hmget`, `cmdstat_mget`, `cmdstat_getbit`, and `cmdstat_getrange`, and is equivalent to the sum of cache hits and misses during the reporting interval.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Redis Server Load | The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. If this counter reaches 100 it means the Redis server has hit a performance ceiling and the CPU can't process work any faster. If you are seeing high Redis Server Load then you will see timeout exceptions in the client. In this case you should consider scaling up or partitioning your data into multiple caches.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Sets              | The number of set operations to the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_set`, `cmdstat_hset`, `cmdstat_hmset`, `cmdstat_hsetnx`, `cmdstat_lset`, `cmdstat_mset`, `cmdstat_msetnx`, `cmdstat_setbit`, `cmdstat_setex`, `cmdstat_setrange`, and `cmdstat_setnx`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Total Operations  | The total number of commands processed by the cache server during the specified reporting interval. This value maps to the Redis INFO `total_commands_processed` command. Note that when Azure Redis Cache is used purely for pub/sub there will be no metrics for `Cache Hits`, `Cache Misses`, `Gets`, or `Sets`, but there will be `Total Operations` metrics that reflect the cache usage for pub/sub operations.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Used Memory       | The amount of cache memory used in MB during the specified reporting interval. This value maps to the Redis INFO `used_memory` command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| CPU               | The CPU utilization of the Azure Redis Cache server as a percentage during the specified reporting interval. This value maps to the operating system `\Processor(_Total)\% Processor Time` performance counter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Cache Read        | The amount of data read from the cache in KB/s during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and is not Redis specific.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Cache Write       | The amount of data written to the cache in KB/s during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and is not Redis specific.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Monitoring charts

The **Monitoring** section has **Hits and Misses**, **Gets and Sets**, **Connections**, and **Total Commands** charts.

![Monitoring charts][redis-cache-monitoring-part]

The **Monitoring** charts display the following metrics.

| Monitoring chart | Cache metrics     |
|------------------|-------------------|
| Hits and Misses  | Cache Hits        |
|                  | Cache Misses      |
| Gets and Sets    | Gets              |
|                  | Sets              |
| Connections      | Connected Clients |
| Total Commands   | Total Operations  |

For information on viewing the metrics and customizing the individual charts in this section, see the following [How to view metrics and customize metrics charts](#how-to-view-metrics-and-customize-charts) section.

## Usage charts

The **Usage** section has **Redis Server Load**, **Memory Usage**, **Network Bandwith**, and **CPU Usage** charts, and also displays the **Pricing tier** for the cache instance.

![Usage charts][redis-cache-usage-part]

The **Pricing tier** displays the cache pricing tier, and can be used to [scale](cache-how-to-scale.md) the cache to a different pricing tier.

The **Usage** charts display the following metrics.

| Usage chart       | Cache metrics |
|-------------------|---------------|
| Redis Server Load | Server Load   |
| Memory Usage      | Used Memory   |
| Network Bandwidth | Cache Write   |
| CPU Usage         | CPU           |

For information on viewing the metrics and customizing the individual charts in this section, see the following [How to view metrics and customize metrics charts](#how-to-view-metrics-and-customize-charts) section.

## How to view metrics and customize charts

You can view an overview of the metrics on the **Redis Cache** blade in the **Monitoring** and **Usage** charts as described in the previous sections. For a more detailed view of the metrics on a specific chart and to customize the chart, click the desired chart from the **Redis Cache** blade to display the **Metric** blade for that chart.

![Metric blade][redis-cache-metric-blade]

Any alerts that are set on the metrics displayed by a chart are listed at the bottom of the **Metric** blade for that chart.

To add or remove metrics or change the reporting interval, right-click the chart and choose **Edit Chart**. You can also edit charts directly from the **Redis Cache** blade by right-clicking the desired chart and choosing **Edit Chart**.

To add or remove metrics from the chart, click the checkbox beside the name of the metric. To change the reporting interval, click the desired interval. To change the **Chart type**, click the desired style. Once the desired changes are made, click **Save**. 

![Edit chart][redis-cache-edit-chart]

When you click **Save** your changes will persist until you leave the **Metric** blade. When you come back later, you'll see the original metric and time range again. For more information on customizing charts, see [Monitor service metrics](../azure-portal/insights-how-to-customize-monitoring.md).

To view the metrics for a specific time period on a chart, hover the mouse over one of the specific bars or points on the chart that corresponds to the desired time, and the metrics for that interval are displayed.

![View chart details][redis-cache-view-chart-details]

## Operations and alerts

The **Operations** section has **Events** and **Alert rules** sections.

![Oeprations][redis-cache-operations-events]

To see a list of recent cache operations, click the **Events** chart to display the **Events** blade. Examples of operations include retrieving and regenerating access keys, and the activation and resolution of alert rules. For more information about each event, click the event in the **Events** blade.

For more information on events, see [View events and audit logs](../azure-portal/insights-debugging-with-events.md).

The **Alert rules** section displays the count of alerts for the cache instance. An alert rule enables you to monitor your cache instance and receive an email whenever a certain metric value reaches the threshold defined in the rule. 

Alert rules are evaluated approximately every five minutes, and when an alert rule is activated, any configured notifications are sent. Alert rule activations and notifications are not processed instantaneously; there may be a delay of several minutes before an alert rule is activated and notifications sent.

Alert rules can be viewed and set from the **Metric** blade for a specific monitoring chart, or from the **Alert rules** blade.

Alert rules have the following properties.

| Alert rule property                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Resource                            | The resource evaluated by the alert rule. When creating an alert rule from a Redis cache, the cache is the resource.                                                                                                                                                                                                                                                                                                                                                  |
| Name                                | Name that uniquely identifies the alert rule within the current cache instance.                                                                                                                                                                                                                                                                                                                                                                                       |
| Description                         | Optional description of the alert rule.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Metric                              | The metric to be monitored by the alert rule. For a list of cache metrics, see Available metrics and reporting intervals.                                                                                                                                                                                                                                                                                                                                             |
| Condition                           | The condition operator for the alert rule. Possible choices are: greater than, greater than or equal to, less than, less than or equal to                                                                                                                                                                                                                                                                                                                             |
| Threshold                           | The value used to compare with the metric using the operator specified by the condition property. Depending on the metric, this value may be in bytes/second, bytes, %, or count.                                                                                                                                                                                                                                                                                     |
| Period                              | Specifies the period over which the average value of the metric is used for the alert rule comparison. For example, if the period is Over the last hour, the average value of the metric over the previous hour interval is used for the comparison. If you want to be notified when the threshold is met due to a spike in activity, then a shorter period is appropriate. To be notified when there is sustained activity above the threshold, use a longer period. |
| Email service and co-administrators | When true, the service administrator and co-administrator are emailed when the alert is activated.                                                                                                                                                                                                                                                                                                                                                                    |
| Additional administrator email      | Optional email address for an additional administrator to be notified when the alert is activated.                                                                                                                                                                                                                                                                                                                                                                    |

Only one notification is sent per alert rule activation. Once the threshold for a rule is exceeded and a notification is sent, the rule is not re-evaluated until the metric falls below the threshold. If the metric subsequently exceeds the threshold, the alert is reactivated and a new notification is sent.

To view all of the alert rules for your cache instance, click the **Alert rules** part in the **Redis Cache** blade. To view only the alert rules that use a specific metric, navigate to the **Metric** blade for the chart that contains that metric.

![Alert rules][redis-cache-alert-rules]

To add an alert rule, click **Add alert** from either the **Metric** blade or the **Alert rules** blade. 

Enter the desired rule criteria into the **Add an alert** rule blade and click **OK**. 

![Add alert rule][redis-cache-add-alert]

>[AZURE.NOTE] When an alert rule is created by clicking **Add alert** from the **Metric** blade, only the metrics displayed on the chart in that blade appear in the **Metric** drop-down. When an alert rule is created by clicking **Add alert** from the **Alert rules** blade, all cache metrics are available in the **Metric** drop-down.

Once an alert rule is saved it appears on the **Alert rules** blade as well as on the **Metric** blade for any charts that display the metric used in the alert rule. To edit an alert rule, click the name of the alert rule to display the **Edit Rule** blade. From the **Edit Rule** blade you can edit the properties of the rule, delete or disable the alert rule, or re-enable the rule if it was previously disabled.

>[AZURE.NOTE] Any changes you make to the properties of the rule may take a moment before they are reflected on the **Alert rules** blade or the **Metric** blade.

When an alert rule is activated, an email is sent depending on the configuration of the alert rule, and an alert icon is displayed in the **Alert rules** part on the **Redis Cache** blade.

An alert rule is considered to be resolved when the alert condition no longer evaluates to true. Once the alert rule condition is resolved, the alert icon is replaced with a check mark. For details on alert activations and resolutions, click the **Events** part on the **Redis Cache** blade to view the events on the **Events** blade.

For more information about alerts in Azure, see [Receive alert notifications](../azure-portal/insights-receive-alert-notifications.md).
  
<!-- IMAGES -->
[redis-cache-monitor-overview]: ./media/cache-how-to-monitor/redis-cache-monitor-overview.png

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

