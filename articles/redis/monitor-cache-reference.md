---
title: Monitoring data reference for Azure Managed Redis
description: This article contains important reference material you need when you monitor Azure Managed Redis.
ms.date: 03/04/2026
ms.topic: reference
ms.custom:
  - horz-monitor
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis

---

# Azure Managed Redis monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

For more details and information about the supported metrics for Microsoft.Cache/redisEnterprise, see the following section.


### Supported metrics for Microsoft.Cache/redisEnterprise
The following table lists the metrics available for the Microsoft.Cache/redisEnterprise resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Cache/redisEnterprise](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-cache-redisenterprise-metrics-include.md)]

<a name="available-metrics-and-reporting-intervals"></a>
<a name="create-your-own-metrics"></a>
<a name="metrics-details"></a>

## Details about Azure Managed Redis metrics

The following list provides details and more information about the supported Azure Monitor metrics for [Microsoft.Cache/redisEnterprise](/azure/azure-monitor/reference/supported-metrics/microsoft-cache-redisenterprise-metrics).

| Metric | Details |
|--------|-------------|
| Cache Latency (preview) | The average latency of requests handled by endpoints on the cache node during the specified reporting interval. This metric is measured in milliseconds and is sourced from the `node_avg_latency` Prometheus metric. This metric is only reported when there is active traffic on the cache. |
| Cache Hits | The number of successful key lookups during the specified reporting interval. This value is sourced from the `bdb_read_hits` Prometheus metric. |
| Cache Misses | The number of failed key lookups during the specified reporting interval. This value is sourced from the `bdb_read_misses_max` Prometheus metric. Cache misses don't necessarily mean there's an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item isn't there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache because of memory pressure, then there might be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory or Evicted Keys`. |
| Cache Read | The rate of incoming network traffic to the cache node in bytes per second during the specified reporting interval. This value is sourced from the `node_ingress_bytes_max` Prometheus metric. If you want to set up alerts for server-side network bandwidth limits, then create it using this Cache Read counter. See [this table](/azure/redis/planning-faq#how-can-i-measure-azure-managed-redis-performance-) for the observed bandwidth limits for various cache pricing tiers and sizes. |
| Cache Write | The rate of outgoing network traffic from the cache node in bytes per second during the specified reporting interval. This value is sourced from the `node_egress_bytes_max` Prometheus metric. |
| Connected Clients | The number of client connections to the cache during the specified reporting interval. This value is sourced from the `node_conns` Prometheus metric, which counts clients connected to endpoints on the node. Once the connection limit is reached, later attempts to connect to the cache fail. Even if there are no active client applications, there might still be a few instances of connected clients because of internal processes and connections. |
| CPU | The CPU utilization of the Azure Managed Redis server as a percentage during the specified reporting interval. This value is derived from the `node_cpu_idle_min` Prometheus metric, which represents the lowest CPU idle time portion observed during the interval, and is inverted to reflect CPU busy time. The CPU metric includes background processes such as anti-malware that aren't strictly Redis server processes, so it can sometimes spike independently of Redis workload. We recommend using this metric over **Server Load** for monitoring, as it supports instance-level drill-down by splitting on Instance ID, providing more granularity into which node is under pressure. |
| Evicted Keys | The number of keys evicted from the cache during the specified reporting interval. This value is sourced from the `bdb_evicted_objects` Prometheus metric. |
| Expired Keys | The number of keys expired from the cache during the specified reporting interval. This value is sourced from the `bdb_expired_objects` Prometheus metric. |
| Geo Replication Healthy | Indicates the health of the geo-replication link between caches in an Active Geo-Replication group. The metric reports one of two values:<br/><br/>0 – disconnected/unhealthy<br/>1 – healthy<br/><br/>The metric is available on Memory Optimized, Balanced, and Compute Optimized tier caches with geo-replication enabled. A value of 0 doesn't mean that data on the geo-replica is lost. It just means that the link between geo-primary and geo-secondary is unhealthy.<br/><br/>This metric might indicate a disconnected/unhealthy replication status for several reasons, including: monthly patching, host OS updates, network misconfiguration, or failed geo-replication link provisioning. The Azure Managed Redis service periodically patches caches with the latest platform features and improvements. During these updates, each cache node is taken offline, which temporarily disables the geo-replication link. If your geo-replication link is unhealthy, check to see if it was caused by a patching event on either the geo-primary or geo-secondary cache by using **Diagnose and Solve Problems** from the Resource menu in the portal. Depending on the amount of data in the cache, the downtime from patching can take anywhere from a few minutes to an hour. If the geo-replication link is unhealthy for over an hour, [file a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). |
| Gets | The number of read requests to the cache during the specified reporting interval. This value is sourced from the `bdb_read_req` Prometheus metric, which represents the rate of all read requests on the database, and is equivalent to the sum of cache hits and misses during the reporting interval. |
| Operations per Second | The total number of requests handled per second by all shards of the cache during the specified reporting interval. This value is sourced from the `bdb_instantaneous_ops_per_sec` Prometheus metric. |
| Server Load | The *Server Load* metric reflects the Redis server's own assessment of overall load, and is similar to the **CPU** metric but measured at a cluster level rather than per instance. This value is derived from the `node_cpu_idle_min` Prometheus metric and inverted to reflect server busy time. If this counter reaches 100, the Redis server has hit a performance ceiling, and the CPU can't process work any faster. You can expect a large latency effect. If you're seeing sustained high Server Load, consider scaling up the cache or partitioning data across multiple caches. When *Server Load* is only moderately high, such as 50 to 80 percent, average latency usually remains low, and timeout exceptions could have other causes than high server latency.<br/><br/>Because *Server Load* is measured at the cluster level, it doesn't allow you to drill down to individual instances. We recommend using the **CPU** metric instead, as it supports splitting by Instance ID for instance-level analysis.<br/><br/>**Caution:** The *Server Load* metric can present incorrect data for Azure Managed Redis caches. Sometimes *Server Load* is represented as being over 100. We are investigating this issue. We recommend using the **CPU** metric instead.|
| Sets | The number of write requests to the cache during the specified reporting interval. This value is sourced from the `bdb_write_req` Prometheus metric, which represents the rate of all write requests on the database. |
| Total Keys | The number of keys in the cache during the specified reporting interval. This value is sourced from the `bdb_no_of_keys`  Prometheus metric.<br/><br/>**Important:** Because of a limitation in the underlying metrics system for caches with clustering enabled, Total Keys return the maximum number of keys of the shard that had the maximum number of keys during the reporting interval. |
| Total Operations | The total number of requests processed by the cache during the specified reporting interval. This value is sourced from the `bdb_total_req` Prometheus metric. |
| Used Memory | The amount of cache memory in bytes used by the database during the specified reporting interval. This value is sourced from the `bdb_used_memory` Prometheus metric. On Flash Optimized tier caches, this value includes both RAM and flash memory usage. This value doesn't include fragmentation.<br/><br/> When High Availability is enabled, the Used Memory value includes the memory in both the primary and replica nodes. This can make the metric appear twice as large as expected. |
| Used Memory Percentage | The percent of configured memory limit that is currently in use during the specified reporting interval. This value is calculated as the ratio of `bdb_used_memory` to `bdb_memory_limit` from the Redis Enterprise Prometheus metrics. This value doesn't include fragmentation. |

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Cache/redisEnterprise/databases
[!INCLUDE [Microsoft.Cache/redis](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-cache-redisenterprise-databases-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]


### Azure Managed Redis
Microsoft.Cache/redisEnterprise
- [REDConnectionEvents](/azure/azure-monitor/reference/tables/redconnectionevents)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Cache resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftcache)

## Related content

- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.