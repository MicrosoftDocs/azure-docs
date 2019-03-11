---
title: Advisor recommendations | Microsoft Docs
description: Advisor recommendations for Azure Cache for Redis
author: asasine
ms.author: adsasine
ms.service: cache
ms.topic: conceptual
ms.date: 03/11/2019
---

# Advisor recommendations for Azure Cache for Redis

Azure Cache for Redis is integrated with [Azure Advisor](https://azure.microsoft.com/services/advisor/) to provide recommendations on your cache.

## Recommendations basics

There are several situations where a recommendation is generated for your cache. The following sections cover the basic concepts and provide steps for mitigation as well as best practices for prevention.

- [Memory pressure](#decrease-memory-pressure-to-improve-performance-and-avoid-incidents)
- [High CPU / Server load](#decrease-server-load-to-improve-performance-and-avoid-incidents)
- [High Network bandwidth](#decrease-network-bandwidth-to-improve-performance-and-avoid-incidents)

### Decrease memory pressure to improve performance and avoid incidents

This recommendation is generated when a cache is found to be under memory pressure.

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk. This _page faulting_ causes the system to slow down significantly. There are several possible causes of this memory pressure:

1. You have filled the cache to full capacity with data.
1. Redis is seeing high memory fragmentation. This is most often caused by storing large objects since Redis is optimized for small objects.

Redis exposes two stats through the [INFO](https://redis.io/commands/info) command that can help you identify this issue: "used_memory" and "used_memory_rss". You can [view these metrics](./cache-how-to-monitor#view-metrics-with-azure-monitor) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

1. [Configure a memory policy](./cache-configure#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. Note that this may not be sufficient if you have fragmentation.
1. [Configure a maxmemory-reserved value](./cache-configure#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation. For more information, see the additional [considerations for memory reservations](#considerations-for-memory-reservations) below.
1. Break up your large cached objects into smaller related objects.
1. [Create alerts](./cache-how-to-monitor#alerts) on metrics like used memory to be notified early about potential impacts.
1. [Scale](./cache-how-to-scale.md) to a larger cache size with more memory capacity.

#### Considerations for Memory Reservations

One thing to consider when choosing a new memory reservation value (e.g. maxmemory-reserved) is how this change might affect a cache that is already running with large amounts of data in it. For instance, if you have a 53-GB cache with 49 GB of data, then change the reservation value to 8 GB, this will drop the max available memory for the system down to 45 GB. If either your current _used_memory_ or your _used_memory_rss_ values are higher than the new limit of 45 GB, then the system will have to evict data until both _used_memory_ and _used_memory_rss_ are below 45 GB. Eviction can increase server load and memory fragmentation.

### Decrease server load to improve performance and avoid incidents

This recommendation is generated when a cache is found to have high CPU or server load.

High CPU usage or Server Load on the server means that the server cannot process requests in a timely fashion. Once you hit the computing capacity of the server, it cannot keep up with request rates and will be slow to respond.

[Monitor metrics](./cache-how-to-monitor#view-metrics-with-azure-monitor) such as CPU or server load. Watch for spikes in CPU usage that correspond with timeouts.

There are several changes you can make to mitigate high server load:

1. Investigate what is causing CPU spikes such as running [expensive commands](#expensive-commands) or page faulting due to high memory pressure.
1. [Create alerts](./cache-how-to-monitor#alerts) on metrics like CPU or server load to be notified early about potential impacts.
1. [Scale](./cache-how-to-scale.md) to a larger cache size with more CPU capacity.

#### Expensive commands

Not all Redis commands are created equally - some are more expensive to run than others. The time complexity of each command is very well documented on the Redis website and it is highly recommended that you review the commands you are running on your Redis instance to make sure that you understand the performance impact of each of those commands. For instance, the [KEYS](https://redis.io/commands/keys) command is one that I have seen many customers use without knowing that it is an O(N) operation and should be avoided. Using [SCAN](https://redis.io/commands/scan) can be a great alternative to KEYS for reducing CPU impact.

Using the [SLOWLOG](https://redis.io/commands/slowlog) command, you can measure expensive commands being executed against the server.

### Decrease network bandwidth to improve performance and avoid incidents

This recommendation is generated when a cache is found to have high network bandwidth.

Different sized cache instances have limitations on how much network bandwidth they have available. If the server exceeds the available bandwidth, then data will not be sent to the client as quickly. This can lead to timeouts because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](./cache-how-to-monitor#view-metrics-with-azure-monitor) in the portal.

To mitigate high network bandwidth:

1. Change client call behavior to reduce network demand.
1. [Create alerts](./cache-how-to-monitor#alerts) on metrics like cache read or cache write to be notified early about potential impacts.
1. [Scale](./cache-how-to-scale.md) to a larger cache size with more bandwidth capacity.
