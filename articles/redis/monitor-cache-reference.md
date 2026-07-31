---
title: Monitoring data reference for Azure Managed Redis
description: This article contains important reference material you need when you monitor Azure Managed Redis.
ms.date: 07/27/2026
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

The following sections provide more information and interpretation guidance for the supported Azure Monitor metrics for [Microsoft.Cache/redisEnterprise](/azure/azure-monitor/reference/supported-metrics/microsoft-cache-redisenterprise-metrics). For the full list of metrics with their units and aggregation types, see the [Supported metrics](#supported-metrics-for-microsoftcacheredisenterprise) table.

### Details about cluster-level metrics

The following table provides the underlying Redis V1 Prometheus source metric and additional interpretation guidance for each cluster-level metric. For the source metric definitions, see the [Redis Enterprise Prometheus v1 metrics reference](https://redis.io/docs/latest/integrate/prometheus-with-redis-enterprise/prometheus-metrics-v1/).

| Metric | Source and notes |
|--------|------------------|
| Cache Latency | The average latency of requests handled by endpoints on the cache node during the specified reporting interval. This metric is measured in milliseconds and is sourced from the `node_avg_latency` V1 Prometheus metric. This metric is only reported when there is active traffic on the cache. |
| Cache Hits | The rate of successful key lookups, expressed as hits per second. Sourced from the `bdb_read_hits` V1 Prometheus metric. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Cache Misses | The rate of unsuccessful key lookups, expressed as misses per second. Sourced from the `bdb_read_misses_max` V1 Prometheus metric. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. Cache misses don't necessarily mean there's an issue with the cache. For example, when using the cache-aside programming pattern, an application looks first in the cache for an item. If the item isn't there (cache miss), the item is retrieved from the database and added to the cache for next time. Cache misses are normal behavior for the cache-aside programming pattern. If the number of cache misses is higher than expected, examine the application logic that populates and reads from the cache. If items are being evicted from the cache because of memory pressure, then there might be some cache misses, but a better metric to monitor for memory pressure would be `Used Memory or Evicted Keys`. |
| Cache Read | Represents the rate of incoming network traffic to the cache node in bytes per second. This value is sourced from the `node_ingress_bytes_max` V1 Prometheus metric. If you want to set up alerts for server-side network bandwidth limits, then create it using this Cache Read counter. See [this table](/azure/redis/planning-faq#how-can-i-measure-azure-managed-redis-performance-) for the observed bandwidth limits for various cache pricing tiers and sizes. This is a rate metric, expressed as bytes per second. |
| Cache Write | Represents the rate of outgoing network traffic from the cache node in bytes per second. This value is sourced from the `node_egress_bytes_max` V1 Prometheus metric. This is a rate metric, expressed as bytes per second. |
| Connected Clients | Sourced from the `node_conns` V1 Prometheus metric, which counts clients connected to endpoints on the node. Once the connection limit is reached, later attempts to connect to the cache fail. Even if there are no active client applications, there might still be a few instances of connected clients because of internal processes and connections. |
| CPU | Derived from the `node_cpu_idle` V1 Prometheus metric, which represents the average CPU idle time portion (a value from 0 to 1, multiplied by 100 to express a percentage) during the interval, and is inverted to reflect CPU busy time. The CPU metric includes background processes such as anti-malware that aren't strictly Redis server processes, so it can sometimes spike independently of Redis workload. We recommend using this metric over **Server Load** for monitoring, as it supports instance-level drill-down by splitting on Instance ID, providing more granularity into which node is under pressure. |
| Evicted Keys | The rate of key evictions, expressed as evictions per second. Sourced from the `bdb_evicted_objects` V1 Prometheus metric. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Expired Keys | The rate of key expirations, expressed as expirations per second. Sourced from the `bdb_expired_objects` V1 Prometheus metric. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Geo Replication Healthy | Indicates the health of the geo-replication link between caches in an Active Geo-Replication group. The metric reports one of two values:<br/><br/>0 - disconnected/unhealthy<br/>1 - healthy<br/><br/>The metric is available on Memory Optimized, Balanced, and Compute Optimized tier caches with geo-replication enabled. A value of 0 doesn't mean that data on the geo-replica is lost. It just means that the link between geo-primary and geo-secondary is unhealthy.<br/><br/>This metric might indicate a disconnected/unhealthy replication status for several reasons, including: monthly patching, host OS updates, network misconfiguration, or failed geo-replication link provisioning. The Azure Managed Redis service periodically patches caches with the latest platform features and improvements. During these updates, each cache node is taken offline, which temporarily disables the geo-replication link. If your geo-replication link is unhealthy, check to see if it was caused by a patching event on either the geo-primary or geo-secondary cache by using **Diagnose and Solve Problems** from the Resource menu in the portal. Depending on the amount of data in the cache, the downtime from patching can take anywhere from a few minutes to an hour. If the geo-replication link is unhealthy for over an hour, [file a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). |
| Gets | The rate of read operations, expressed as operations per second. Sourced from the `bdb_read_req` V1 Prometheus metric, which represents the rate of all read requests on the database, and is equivalent to the sum of cache hits and misses. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Operations per Second | The total number of requests handled per second by all shards of the cache during the specified reporting interval. This value is sourced from the `bdb_instantaneous_ops_per_sec` V1 Prometheus metric. This is a rate metric, expressed as operations per second. |
| Server Load | The *Server Load* metric reflects the Redis server's own assessment of overall load. Like the **CPU** metric, it's derived from the `node_cpu_idle` V1 Prometheus metric, inverted to reflect server busy time. The difference is that *Server Load* is measured at the cluster level, while **CPU** is measured at the node (instance) level.<br/><br/>*Server Load* reaching 100 doesn't necessarily mean the CPU is exhausted across the cache; it can indicate that the CPU on one of the nodes is approaching saturation. For this reason, evaluate both *Server Load* and the per-node **CPU** metric before making performance-related decisions such as scaling up or partitioning data across multiple caches.<br/><br/>Sustained high *Server Load* can have several side effects, including increased server-side latency and timeout exceptions.<br/><br/>**Caution:** For Azure Managed Redis caches, *Server Load* sometimes reflects values over 100. We recommend using the **CPU** metric instead, or evaluating both metrics together, before making any performance-based decisions. |
| Sets | The rate of write operations, expressed as operations per second. Sourced from the `bdb_write_req` V1 Prometheus metric, which represents the rate of all write requests on the database. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Total Keys | Sourced from the `bdb_no_of_keys` V1 Prometheus metric.<br/><br/>**Important:** Because of a limitation in the underlying metrics system for caches with clustering enabled, Total Keys returns the maximum number of keys of the shard that had the maximum number of keys during the reporting interval.<br/><br/>To see accurate per-shard key counts on a clustered cache, use the shard-level [Shard Key Count](#shard-level-metrics) metric sliced by the `Slots (Range)` dimension. |
| Total Operations | The rate of all operations, expressed as operations per second. Sourced from the `bdb_total_req` V1 Prometheus metric. This is a rate metric; its Azure Monitor unit displays as Count, but the value is a per-second rate. |
| Used Memory | Sourced from the `bdb_used_memory` V1 Prometheus metric. On Flash Optimized tier caches, this value includes both RAM and flash memory usage. This value doesn't include fragmentation.<br/><br/>When High Availability is enabled, the Used Memory value includes the memory in both the primary and replica nodes. This can make the metric appear twice as large as expected. |
| Used Memory Percentage | Calculated as the ratio of `bdb_used_memory` to `bdb_memory_limit` from the Redis Enterprise V1 Prometheus metrics. This value doesn't include fragmentation. |

## Shard-level metrics

Azure Managed Redis now exposes shard-level metrics that provide per-shard visibility into cache behavior. These metrics are sourced from Redis V2 Prometheus endpoints (`redis_server_*` metrics).

### Dimensions

Each shard-level metric supports the following dimensions:

| Dimension | Name in REST API | Description |
|-----------|------------------|-------------|
| `Instance ID` | `InstanceId` | Identifies the specific Redis node (VM instance) within the cluster. Use this dimension to isolate per-node behavior and identify load imbalance across nodes. |
| `Slots (Range)` | `Slots` | Identifies the shard by its hash slot range. Use this dimension to detect memory imbalance or uneven key distribution across shards. |
| `Shard ID` | `Shard` | Unique shard identifier using the Redis shard UID. Use this dimension alongside `Slots (Range)` to correlate Azure Monitor data with Redis-level shard identifiers. |
| `Shard Role` | `Role` | Role of the node: `primary` or `replica`. Use this dimension to compare metrics between primary and replica nodes on the same shard. |

> [!NOTE]
> When you split or filter by a dimension through the Azure Monitor REST API, use the value in the **Name in REST API** column rather than the portal display name. Metric names and dimension names in the Azure Monitor REST API are case-insensitive. For example, querying `percentProcessorTime`, `PercentProcessorTime`, or `PERCENTPROCESSORTIME` all return the same results. The same applies to dimension filter values: `instanceId eq '*'` and `INSTANCEID eq '*'` are equivalent. The casing used in this article is a convention for readability only.

> [!IMPORTANT]
> These metrics are published at the shard level. When queried without splitting by a dimension, Azure Monitor aggregates values across all shards using the default aggregation type. For most metrics, this cross-shard aggregation does not produce meaningful cluster-wide totals. Always split by the `Slots (Range)` dimension for accurate per-shard analysis.

### Details about shard-level metrics

The following table provides the underlying Redis V2 Prometheus source metric and additional interpretation guidance for each shard-level metric. For the source metric definitions, see the [Redis Enterprise Prometheus v2 metrics reference](https://redis.io/docs/latest/integrate/prometheus-with-redis-enterprise/prometheus-metrics-definitions/).

| Metric | Details |
|--------|---------|
| Shard Memory Used (Bytes) (Preview) | Memory used by this shard, in bytes. On flash-enabled SKUs, this includes both DRAM and flash usage. Sourced from the `redis_server_used_memory` Redis V2 Prometheus metric. |
| Shard Memory Clients Normal (Bytes) (Preview) | Current memory used for input and output buffers of non-replica clients. Sourced from the `redis_server_mem_clients_normal` Redis V2 Prometheus metric. |
| Shard Memory Clients Replica (Bytes) (Preview) | Current memory used for input and output buffers of replica clients. Sourced from the `redis_server_mem_clients_slaves` Redis V2 Prometheus metric. |
| Shard Key Count (Preview) | Total key count. Sourced from the `redis_server_db_keys` Redis V2 Prometheus metric. |
| Shard Replication Link Up (Preview) | Indicates whether a replica is connected to its primary. Sourced from the `redis_server_master_link_status` Redis V2 Prometheus metric, which is emitted only by replica shards, because only a replica has a replication link back to its primary to report on. |

### Big keys metrics

The following metrics track key size distribution across shards, helping you identify large keys before they cause performance issues.

> [!NOTE]
> Big keys metrics aren't yet supported on active geo-replicated caches. Support for these metrics for geo-replicated caches will come at a later date.

#### String keys (by memory size)

| Metric | Details |
|--------|---------|
| Shard Strings Sizes Under 128 MB (Preview) | Number of string keys on this shard with a memory size under 128 MB. |

#### Set keys (by element count)

| Metric | Details |
|--------|---------|
| Shard Sets Items Under 1M Elements (Preview) | Number of set keys on this shard with fewer than 1 million elements. |
| Shard Sets Items 1M to 8M Elements (Preview) | Number of set keys on this shard with between 1 million and 8 million elements. |
| Shard Sets Items Over 8M Elements (Preview) | Number of set keys on this shard with more than 8 million elements. |

#### Sorted set keys (by element count)

| Metric | Details |
|--------|---------|
| Shard Sorted Sets Items Under 1M Elements (Preview) | Number of sorted set keys on this shard with fewer than 1 million elements. |
| Shard Sorted Sets Items 1M to 8M Elements (Preview) | Number of sorted set keys on this shard with between 1 million and 8 million elements. |
| Shard Sorted Sets Items Over 8M Elements (Preview) | Number of sorted set keys on this shard with more than 8 million elements. |

#### Hash keys (by field count)

| Metric | Details |
|--------|---------|
| Shard Hashes Items Under 1M Elements (Preview) | Number of hash keys on this shard with fewer than 1 million fields. |
| Shard Hashes Items 1M to 8M Elements (Preview) | Number of hash keys on this shard with between 1 million and 8 million fields. |
| Shard Hashes Items Over 8M Elements (Preview) | Number of hash keys on this shard with more than 8 million fields. |

#### List keys (by element count)

| Metric | Details |
|--------|---------|
| Shard Lists Items Under 1M Elements (Preview) | Number of list keys on this shard with fewer than 1 million elements. |
| Shard Lists Items 1M to 8M Elements (Preview) | Number of list keys on this shard with between 1 million and 8 million elements. |
| Shard Lists Items Over 8M Elements (Preview) | Number of list keys on this shard with more than 8 million elements. |

### Troubleshooting with shard-level metrics

The following sections describe common shard-level scenarios and how to diagnose them:

- [Identifying replication link failures](#identifying-replication-link-failures)
- [Identifying memory imbalance](#identifying-memory-imbalance)
- [Diagnosing replication buffer growth](#diagnosing-replication-buffer-growth)
- [Managing large keys](#managing-large-keys)

#### Identifying replication link failures

A replication link failure occurs when a primary shard isn't able to establish a replication connection to its associated replica shard, so the replica can no longer stay in sync with the primary. This metric is emitted only by replica shards, because only a replica has a replication link back to its primary to report on, and it reports whether that replica is currently connected to its primary. A sustained failure removes high-availability protection for the affected shard and increases the risk of data loss if a failover happens before the link recovers. That being said, the replication link can become temporarily unhealthy during failover, shard migration, scaling, or maintenance events, so this metric can be noisy. This is why it's important, when you set up alerts on this metric, to alert only over a sustained period with multiple data points that indicate drops in health.

**Detection approach:**

1. Split **Shard Replication Link Up** by `Slots (Range)`. A value of 0 on any shard means that shard's replication link is down; 1 means it's up.
2. Treat a link that stays at 0 for an extended period (for example, 120 minutes or more) as a persistent failure rather than a transient reconnect. Brief dips can occur during normal maintenance or failover events.
3. Correlate with **Shard Memory Used** and **Shard Memory Clients Replica** on the same shard to see whether resource pressure on the primary accompanies the failure.

**Common causes:**
- Big keys are a major cause. Large keys and collections make synchronization slow and expensive, which can stall the replica and eventually drive the replication link into an unhealthy state.
- Network disruption or high latency between the primary and replica nodes.
- The primary shard being overloaded (high write throughput or CPU saturation) so it can't service replication.
- Memory pressure on the primary preventing the background operations needed to synchronize the replica.
- Repeated full resynchronization cycles caused by a slow replica falling behind the replication backlog.

**Remediation:**
- Reduce sustained write throughput or scale the cache to add capacity so the primary shard is less saturated.
- Identify and break up big keys, which make replication and resynchronization more expensive on the affected shard.
- If the link remains down after load is reduced, open a support request so the platform team can investigate node health and the internal replication backlog.

#### Identifying memory imbalance

Memory imbalance occurs when some shards use significantly more memory than others, which can lead to evictions on specific shards while others have ample free memory.

**Detection approach:**

1. Split **Shard Memory Used (Bytes)** by `Slots (Range)`. A max/min ratio greater than 2x indicates meaningful imbalance.
2. Correlate with **Shard Key Count** by `Slots (Range)` to determine whether the imbalance is due to more keys or larger values on specific shards.

**Common causes:**
- Hash tag misuse concentrating large numbers of keys on the same shard.
- Big keys: a small number of very large data structures on a specific shard.
- Inconsistent TTL policies causing divergence in memory usage over time.

**Remediation:**
- Redistribute keys by reviewing and varying hash tag usage.
- Identify and break up big keys using the Big keys metrics to locate affected shards.
- Review TTL policies for keys on high-memory shards.

#### Diagnosing replication buffer growth

Each primary shard maintains an output buffer for its replica that queues writes the replica hasn't yet applied. When a replica can't keep up, this buffer grows and consumes memory on the shard. If it grows without bound, the replica can be disconnected and forced into a full resynchronization, which is expensive and can cascade into repeated resync cycles or even replication sync becoming unhealthy. Because each shard has its own replica buffer, growth is often isolated to specific shards.

**Detection approach:**

1. Split **Shard Memory Clients Replica (Bytes)** by `Slots (Range)` and look for a sustained upward trend on any shard over 15 minutes or more, rather than a single high reading. Steady growth is the signal, not a momentary spike.
2. Correlate with **Shard Replication Link Up** on the same shard. Buffer growth that ends with the link dropping to 0 indicates the replica was disconnected and a resynchronization is likely.
3. Correlate with write-heavy activity (**Sets** and **Total Operations** at the cluster level) to see whether a write burst is driving the growth.

**Common causes:**
- A sustained write burst producing changes faster than the replica can apply them.
- A slow replica, under resource contention, falling behind the primary.
- Repeated full resynchronization loops that repeatedly refill the buffer.
- Big keys that make individual replicated operations large and slow to transfer.

**Remediation:**
- Smooth or reduce write bursts where possible, or scale the cache to add capacity.
- Identify and break up big keys to reduce the size of individual replicated operations.
- If the buffer keeps growing and the replica repeatedly disconnects, open a support request so the platform team can review replica health and buffer sizing, which are managed by the service.

#### Managing large keys

Large keys and large collections increase memory pressure on individual shards and make replication more expensive. For the best data-path performance, keep individual key/value sizes under 512 KB. This is a performance recommendation, not an enforced limit.

The big keys metric buckets are monitoring boundaries only—they aren't recommended or endorsed key sizes. For example, the **Shard Strings Sizes Under 128 MB** bucket simply counts string keys smaller than 128 MB so you can watch for growth; it doesn't mean Azure recommends storing keys anywhere near 128 MB. Likewise, the element-count buckets (1M, 8M) are thresholds for spotting oversized collections, not target sizes. Always aim for the smallest practical key size (ideally under 512 KB), and treat any key that climbs into a higher bucket as something to investigate.

The big keys metrics bucket keys into size ranges so you can spot growth before it causes problems. For collections, the first bucket represents keys within the normal range, so treat any keys that appear in the second or third bucket as worth investigating. For string keys, only the under-128-MB bucket is exposed, so treat any string value that approaches or exceeds 128 MB as a concern.

**Why large keys matter:**
- Replication cost: Large keys make both high-availability replication and active geo-replication (CRDB) more expensive. The effect isn't immediate; it typically surfaces during a full resynchronization triggered by a later failure or reconnection.
- Flash Optimized cache impact: On Flash Optimized SKUs, if a key is large then it remains in RAM and isn't offloaded to flash, which can cause out-of-memory (OOM) errors even when flash disk space remains available. Values that are very small relative to their key name also offload poorly.

**Detection approach:**

1. Split each big keys metric by `Slots (Range)` to see which shards hold the large keys.
2. For collections, focus on the second and third element-count buckets (1M to 8M and Over 8M). The third bucket represents the most extreme keys. For strings, only the **Shard Strings Sizes Under 128 MB** bucket is exposed, so treat any string value at or above 128 MB as a concern.
3. Correlate with **Shard Memory Used** by `Slots (Range)` to confirm whether the large keys are driving memory imbalance on specific shards.

**Remediation:**
- Reduce value size toward the first bucket or 512 KB as best practice. Common strategies include splitting or chunking a large value across multiple keys, and compressing or reformatting the serialized value.
- For collections (Lists, Sets, Sorted Sets, and Hashes) that grow unbounded over time, split the collection across multiple keys or trim it periodically.
- The goal is to reduce individual key and collection size. The best method depends on your application design and data type.

### Alerting recommendations for shard-level metrics

| Scenario | Metric | Condition | Evaluation window | Severity |
|----------|--------|-----------|-------------------|----------|
| Replication link failure | Shard Replication Link Up, split by `Slots (Range)` | Minimum = 0 on any shard | 120+ min | High |
| Memory imbalance | Shard Memory Used (Bytes), split by `Slots (Range)` | Max/min ratio across slots > 2x | 5 min | Medium |
| Replication buffer growth | Shard Memory Clients Replica (Bytes), split by `Slots (Range)` | Sustained increase over 15 min | 15 min | Medium |
| Very large collections (third bucket) | Any "Over 8M Elements" collection bucket metric, split by `Slots (Range)` | Value > 0 on any shard | 10+ min | High |
| Large collections (second bucket) | Any "1M to 8M Elements" collection bucket metric, split by `Slots (Range)` | Bucket count as a share of total keys of that type exceeds 10% | 10+ min | Medium |
| Large string keys | Shard Strings Sizes Under 128 MB (the only exposed string bucket) | Any string value at or above 128 MB is a concern; watch the under-128-MB count for keys growing toward the threshold | 10+ min | Informational |

> [!NOTE]
> The replication link failure alert can be authored directly as an Azure Monitor metric alert, because the metric aggregates as Minimum, so a value of 0 over the window indicates the link was down at some point. The very large collections (third bucket) alert can also be authored natively, because it tests a single metric against a fixed threshold (value greater than 0). The remaining scenarios can't be evaluated natively by Azure Monitor metric alerts: metric alerts can't compare values across dimension values (for example, a max/min ratio across `Slots (Range)`), can't compute a ratio between two metrics (for example, a second-bucket count as a share of total keys of that type), and can't detect a sustained upward trend. They only test whether a value crosses a fixed threshold at a point in time. Author these as log search alerts over the exported metrics: send metrics to a Log Analytics workspace by using diagnostic settings, then compute the max/min ratio, bucket share, or trend in a Kusto (KQL) query. First-bucket metrics don't need alerts; monitor their trend over time.

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
