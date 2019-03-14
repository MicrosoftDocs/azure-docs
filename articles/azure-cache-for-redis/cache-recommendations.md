---
title: Advisor recommendations | Microsoft Docs
description: Advisor recommendations for Azure Cache for Redis
author: asasine
ms.author: adsasine
ms.service: cache
ms.topic: conceptual
ms.date: 03/14/2019
---

# Advisor recommendations for Azure Cache for Redis

Azure Cache for Redis is integrated with [Azure Advisor](https://azure.microsoft.com/services/advisor/) to provide recommendations on your cache.

## Recommendations basics

There are several situations where a recommendation is generated for your cache. The following sections cover the basic concepts and provide steps for mitigation and tips for prevention.

- [Memory pressure](#reduce-memory-pressure-to-improve-performance-and-avoid-incidents)
- [High CPU / Server load](#reduce-server-load-to-improve-performance-and-avoid-incidents)
- [High Network bandwidth](#reduce-network-bandwidth-utilization-to-improve-performance-and-avoid-incidents)

### Reduce memory pressure to improve performance and avoid incidents

A recommendation is generated when a cache is found to be under memory pressure.

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly. There are several possible causes of this memory pressure:

1. The cache is filled with data near its maximum capacity.
1. Redis is seeing high memory fragmentation. This fragmentation is most often caused by storing large objects since Redis is optimized for small objects.

Redis exposes two stats through the [INFO](https://redis.io/commands/info) command that can help you identify this issue: "used_memory" and "used_memory_rss". You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

1. [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. This policy may not be sufficient if you have fragmentation.
1. [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation. For more information, see the additional [considerations for memory reservations](#considerations-for-memory-reservations) below.
1. Break up your large cached objects into smaller related objects.
1. [Create alerts](cache-how-to-monitor.md#alerts) on metrics like used memory to be notified early about potential impacts.
1. [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity.

#### Considerations for Memory Reservations

Updating memory reservation values, like maxmemory-reserved, can affect cache performance. Suppose you have a 53-GB cache that is filled with 49 GB of data. Changing the reservation value to 8 GB drops the system's max available memory to 45 GB. If _used_memory_ or _used_memory_rss_ values are higher than 45 GB, the system may evict data until both _used_memory_ and _used_memory_rss_ are below 45 GB. Eviction can increase server load and memory fragmentation.

### Reduce server load to improve performance and avoid incidents

A recommendation is generated when a cache is found to have high CPU or server load.

A high server load or CPU usage means the server can't process requests in a timely fashion. The server may be slow to respond and unable to keep up with request rates.

[Monitor metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) such as CPU or server load. Watch for spikes in CPU usage that correspond with timeouts.

There are several changes you can make to mitigate high server load:

1. Investigate what is causing CPU spikes such as running [expensive commands](#expensive-commands) or page faulting because of high memory pressure.
1. [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.
1. [Scale](cache-how-to-scale.md) to a larger cache size with more CPU capacity.

#### Expensive commands

Not all Redis commands are created equally - some are more expensive to run than others. The [Redis commands documentation](https://redis.io/commands) shows the time complexity of each command. It's recommended you review the commands you're running on your cache to understand the performance impact of those commands. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without knowing that it's an O(N) operation. You can avoid KEYS by using [SCAN](https://redis.io/commands/scan) to reduce CPU spikes.

Using the [SLOWLOG](https://redis.io/commands/slowlog) command, you can measure expensive commands being executed against the server.

### Reduce network bandwidth utilization to improve performance and avoid incidents

A recommendation is generated when a cache is found to have network bandwidth utilization close to the limits of the cache size.

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, then data won't be sent to the client as quickly. Clients requests could timeout because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) in the portal.

To situations where network bandwidth utilization is close to maximum capacity:

1. Change client call behavior to reduce network demand.
1. [Create alerts](cache-how-to-monitor.md#alerts) on metrics like cache read or cache write to be notified early about potential impacts.
1. [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity.
