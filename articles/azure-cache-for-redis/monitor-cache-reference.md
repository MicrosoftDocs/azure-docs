---
title: Monitoring data reference for Azure Cache for Redis
description: This article contains important reference material you need when you monitor Azure Cache for Redis.
ms.date: 05/13/2024
ms.custom: horz-monitor
ms.topic: reference
author: robb
ms.author: robb
ms.service: cache
---

# Azure Cache for Redis monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Cache for Redis](monitor-cache.md) for details on the data you can collect for Azure Cache for Redis and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

For more details and information about the supported metrics for Microsoft.Cache/redis and Microsoft.Cache/redisEnterprise, see [List of metrics](monitor-cache-reference.md#azure-cache-for-redis-metrics).

### Supported metrics for Microsoft.Cache/redis
The following table lists the metrics available for the Microsoft.Cache/redis resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-cache-redis-metrics-include.md)]

### Supported metrics for Microsoft.Cache/redisEnterprise
The following table lists the metrics available for the Microsoft.Cache/redisEnterprise resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Cache/redisEnterprise](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-cache-redisenterprise-metrics-include.md)]

<a name="available-metrics-and-reporting-intervals"></a>
<a name="create-your-own-metrics"></a>
<a name="metrics-details"></a>
## Azure Cache for Redis metrics

The following list provides details and more information about the supported Azure Monitor metrics for [Microsoft.Cache/redis](/azure/azure-monitor/reference/supported-metrics/microsoft-cache-redis-metrics) and [Microsoft.Cache/redisEnterprise](/azure/azure-monitor/reference/supported-metrics/microsoft-cache-redisenterprise-metrics).


- 99th Percentile Latency (preview)
  - Depicts the worst-case (99th percentile) latency of server-side commands. Measured by issuing `PING` commands from the load balancer to the Redis server and tracking the time to respond.
  - Useful for tracking the health of your Redis instance. Latency increases if the cache is under heavy load or if there are long running commands that delay the execution of the `PING` command.
  - This metric is only available in Standard and Premium tier caches.
  - This metric is not available for caches that are affected by Cloud Service retirement. See more information [here](cache-faq.yml#caches-with-a-dependency-on-cloud-services--classic)
- Cache Latency (preview)
  - The latency of the cache calculated using the internode latency of the cache. This metric is measured in microseconds, and has three dimensions: `Avg`, `Min`, and `Max`. The dimensions represent the average, minimum, and maximum latency of the cache during the specified reporting interval.
- Cache Misses
  - The number of failed key lookups during the specified reporting interval. This number maps to `keyspace_misses` from the Redis INFO command. Cache misses don't necessarily mean there's an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item isn't there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache because of memory pressure, then there might be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory` or `Evicted Keys`.
- Cache Miss Rate
  - The percent of unsuccessful key lookups during the specified reporting interval. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- Cache Read
  - The amount of data read from the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and isn't Redis specific. This value corresponds to the network bandwidth used by this cache. If you want to set up alerts for server-side network bandwidth limits, then create it using this `Cache Read` counter. See [this table](./cache-planning-faq.yml#azure-cache-for-redis-performance) for the observed bandwidth limits for various cache pricing tiers and sizes.
- Cache Write
  - The amount of data written to the cache in Megabytes per second (MB/s) during the specified reporting interval. This value is derived from the network interface cards that support the virtual machine that hosts the cache and isn't Redis specific. This value corresponds to the network bandwidth of data sent to the cache from the client.
- Connected Clients
  - The number of client connections to the cache during the specified reporting interval. This number maps to `connected_clients` from the Redis INFO command. Once the [connection limit](cache-configure.md#default-redis-server-configuration) is reached, later attempts to connect to the cache fail. Even if there are no active client applications, there might still be a few instances of connected clients because of internal processes and connections.
- Connected Clients Using Microsoft Entra Token (preview)
  - The number of client connections to the cache authenticated using Microsoft Entra token during the specified reporting interval.
- Connections Created Per Second
  - The number of instantaneous connections created per second on the cache via port 6379 or 6380 (SSL). This metric can help identify whether clients are frequently disconnecting and reconnecting, which can cause higher CPU usage and Redis Server Load. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- Connections Closed Per Second
  - The number of instantaneous connections closed per second on the cache via port 6379 or 6380 (SSL). This metric can help identify whether clients are frequently disconnecting and reconnecting, which can cause higher CPU usage and Redis Server Load. This metric isn't available in Enterprise or Enterprise Flash tier caches.
- CPU
  - The CPU utilization of the Azure Cache for Redis server as a percentage during the specified reporting interval. This value maps to the operating system `\Processor(_Total)\% Processor Time` performance counter. Note that this metric can be noisy due to low priority background security processes running on the node, so we recommend monitoring Server Load metric to track load on a Redis server.
- Errors
  - Specific failures and performance issues that the cache could be experiencing during a specified reporting interval. This metric has eight dimensions representing different error types. The error types represented now are as follows:
    - **Failover** – when a cache fails over (subordinate promotes to primary)
    - **Dataloss** – when there's data loss on the cache
    - **UnresponsiveClients** – when the clients aren't reading data from the server fast enough, and specifically, when the number of bytes in the Redis server output buffer for a client goes over 1,000,000 bytes
    - **AOF** – when there's an issue related to AOF persistence
    - **RDB** – when there's an issue related to RDB persistence
    - **Import** – when there's an issue related to Import RDB
    - **Export** – when there's an issue related to Export RDB
    - **AADAuthenticationFailure** - deprecated
    - **AADTokenExpired** - deprecated
    - **MicrosoftEntraAuthenticationFailure** - when there's an authentication failure using Microsoft Entra access token
    - **MicrosoftEntraTokenExpired** - when a Microsoft Entra access token used for authentication isn't renewed and it expires
- Evicted Keys
  - The number of items evicted from the cache during the specified reporting interval because of the `maxmemory` limit.
  - This number maps to `evicted_keys` from the Redis INFO command.
- Expired Keys
  - The number of items expired from the cache during the specified reporting interval. This value maps to `expired_keys` from the Redis INFO command.

- Geo-replication metrics

  Geo-replication metrics are affected by monthly internal maintenance operations. The Azure Cache for Redis service periodically patches all caches with the latest platform features and improvements. During these updates, each cache node is taken offline, which temporarily disables the geo-replication link. If your geo replication link is unhealthy, check to see if it was caused by a patching event on either the geo-primary or geo-secondary cache by using **Diagnose and Solve Problems**  from the Resource menu in the portal. Depending on the amount of data in the cache, the downtime from patching can take anywhere from a few minutes to an hour. If the geo-replication link is unhealthy for over an hour, [file a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

  The [Geo-Replication Dashboard](cache-insights-overview.md#workbooks) workbook is a simple and easy way to view all Premium-tier geo-replication metrics in the same place. This dashboard pulls together metrics that are only emitted by the geo-primary or geo-secondary, so they can be viewed simultaneously.

  - Geo Replication Connectivity Lag
    - Depicts the time, in seconds, since the last successful data synchronization between geo-primary & geo-secondary. If the link goes down, this value continues to increase, indicating a problem.
    - This metric is only emitted **from the geo-secondary** cache instance. On the geo-primary instance, this metric has no value.
    - This metric is only available in the Premium tier for caches with geo-replication enabled.
  - Geo Replication Data Sync Offset
    - Depicts the approximate amount of data in bytes that has yet to be synchronized to geo-secondary cache.
    - This metric is only emitted _from the geo-primary_ cache instance. On the geo-secondary instance, this metric has no value.
    - This metric is only available in the Premium tier for caches with geo-replication enabled.
  - Geo Replication Full Sync Event Finished
    - Depicts the completion of full synchronization between geo-replicated caches. When you see lots of writes on geo-primary, and replication between the two caches can’t keep up, then a full sync is needed. A full sync involves copying the complete data from geo-primary to geo-secondary by taking an RDB snapshot rather than a partial sync that occurs on normal instances. See [this page](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/#how-redis-replication-works) for a more detailed explanation.
    - The metric reports zero most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization.
    - This metric is only emitted _from the geo-secondary_ cache instance. On the geo-primary instance, this metric has no value.
    - This metric is only available in the Premium tier for caches with geo-replication enabled.

  - Geo Replication Full Sync Event Started
    - Depicts the start of full synchronization between geo-replicated caches. When there are many writes in geo-primary, and replication between the two caches can’t keep up, then a full sync is needed. A full sync involves copying the complete data from geo-primary to geo-secondary by taking an RDB snapshot rather than a partial sync that occurs on normal instances. See [this page](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/#how-redis-replication-works) for a more detailed explanation.
    - The metric reports zero most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization.
    - The metric is only emitted _from the geo-secondary_ cache instance. On the geo-primary instance, this metric has no value.
    - The metric is only available in the Premium tier for caches with geo-replication enabled.

  - Geo Replication Healthy
    - Depicts the status of the geo-replication link between caches. There can be two possible states that the replication link can be in:
      - 0 disconnected/unhealthy
      - 1 – healthy
    - The metric is available in the Enterprise, Enterprise Flash tiers, and Premium tier caches with geo-replication enabled.
    - In caches on the Premium tier, this metric is only emitted _from the geo-secondary_ cache instance. On the geo-primary instance, this metric has no value.
    - This metric might indicate a disconnected/unhealthy replication status for several reasons, including: monthly patching, host OS updates, network misconfiguration, or failed geo-replication link provisioning.
    - A value of 0 doesn't mean that data on the geo-replica is lost. It just means that the link between geo-primary and geo-secondary is unhealthy.
    - If the geo-replication link is unhealthy for over an hour, [file a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

- Gets
  - The number of get operations from the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_get`, `cmdstat_hget`, `cmdstat_hgetall`, `cmdstat_hmget`, `cmdstat_mget`, `cmdstat_getbit`, and `cmdstat_getrange`, and is equivalent to the sum of cache hits and misses during the reporting interval.
- Operations per Second
  - The total number of commands processed per second by the cache server during the specified reporting interval.  This value maps to "instantaneous_ops_per_sec" from the Redis INFO command.
- Server Load
  - The percentage of CPU cycles in which the Redis server is busy processing and _not waiting idle_ for messages. If this counter reaches 100, the Redis server has hit a performance ceiling, and the CPU can't process work any faster. You can expect a large latency effect. If you're seeing a high Redis Server Load, such as 100, because you're sending many expensive commands to the server, then you might see timeout exceptions in the client. In this case, you should consider scaling up, scaling out to a Premium cluster, or partitioning your data into multiple caches. When _Server Load_ is only moderately high, such as 50 to 80 percent, then average latency usually remains low, and timeout exceptions could have other causes than high server latency.
  - The _Server Load_ metric is sensitive to other processes on the machine using the existing CPU cycles that reduce the Redis server's idle time. For example, on the _C1_ tier, background tasks such as virus scanning cause _Server Load_ to spike higher for no obvious reason. We recommended that you pay attention to other metrics such as operations, latency, and CPU, in addition to _Server Load_.
  
  > [!CAUTION]
  > The _Server Load_ metric can present incorrect data for Enterprise and Enterprise Flash tier caches. Sometimes _Server Load_ is represented as being over 100. We are investigating this issue. We recommend using the CPU metric instead in the meantime.

- Sets
  - The number of set operations to the cache during the specified reporting interval. This value is the sum of the following values from the Redis INFO all command: `cmdstat_set`, `cmdstat_hset`, `cmdstat_hmset`, `cmdstat_hsetnx`, `cmdstat_lset`, `cmdstat_mset`, `cmdstat_msetnx`, `cmdstat_setbit`, `cmdstat_setex`, `cmdstat_setrange`, and `cmdstat_setnx`.
- Total Keys  
  - The maximum number of keys in the cache during the past reporting time period. This number maps to `keyspace` from the Redis INFO command. Because of a limitation in the underlying metrics system for caches with clustering enabled, Total Keys return the maximum number of keys of the shard that had the maximum number of keys during the reporting interval.
- Total Operations
  - The total number of commands processed by the cache server during the specified reporting interval. This value maps to `total_commands_processed` from the Redis INFO command. When Azure Cache for Redis is used purely for pub/sub, there are no metrics for `Cache Hits`, `Cache Misses`, `Gets`, or `Sets`, but there are `Total Operations` metrics that reflect the cache usage for pub/sub operations.
- Used Memory
  - The amount of cache memory in MB that is used for key/value pairs in the cache during the specified reporting interval. This value maps to `used_memory` from the Redis INFO command. This value doesn't include metadata or fragmentation.
  - On the Enterprise and Enterprise Flash tier, the Used Memory value includes the memory in both the primary and replica nodes. This can make the metric appear twice as large as expected.
- Used Memory Percentage
  - The percent of total memory that is being used during the specified reporting interval.  This value references the `used_memory` value from the Redis INFO command to calculate the percentage. This value doesn't include fragmentation.
- Used Memory RSS
  - The amount of cache memory used in MB during the specified reporting interval, including fragmentation. This value maps to `used_memory_rss` from the Redis INFO command. This metric isn't available in Enterprise or Enterprise Flash tier caches.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Cache/redis
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-cache-redis-logs-include.md)]

### Supported resource logs for Microsoft.Cache/redisEnterprise/databases
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-cache-redisenterprise-databases-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Cache for Redis
microsoft.cache/redis
- [ACRConnectedClientList](/azure/azure-monitor/reference/tables/acrconnectedclientlist)
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)

### Azure Cache for Redis Enterprise
Microsoft.Cache/redisEnterprise
- [REDConnectionEvents](/azure/azure-monitor/reference/tables/redconnectionevents)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Cache resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftcache)

## Related content

- See [Monitor Azure Cache for Redis](monitor-cache.md) for a description of monitoring Azure Cache for Redis.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
