---
title: Troubleshoot Azure Cache for Redis server issues
description: Learn how to resolve common server issues, such as memory pressure, high CPU, long running commands, or bandwidth limitations, when using Azure Cache for Redis.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.date: 11/20/2021
---

# Troubleshoot Azure Cache for Redis server issues

This section discusses troubleshooting issues caused by conditions on an Azure Cache for Redis server or any of the virtual machines hosting it.
<!-- Not sure how i feel about the bullet list that is like a TOC. If we like it, maybe we add it to all the troubleshooting -->
- [High server load](#high-server-load)
- [High memory usage](#high-memory-usage)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## High server load

High server load means the Redis server is very busy and is unable to keep up with the request leading to timeout. Check the "Server Load" metric on your cache to check CPU load. Following are some common reasons for high server load

### Rapid changes in number of client connections

For more information, see [Avoid client connection Spikes](cache-best-practices-connection.md#avoid-client-connection-spikes).

### Long running or expensive commands

For troubleshooting further, see <!--link to server-side verification for long running commands -->

### Scaling

Scaling operations are CPU and memory intensive as it could involve moving data around nodes and changing cluster topology. See <!--scaling best practices -->

### Server maintenance

If your Azure Cache for Redis underwent a failover, all client connections from the node that went down are transferred to the node that is still running. The server load could see a spike because of the increased connections. You can try rebooting your client applications so that all the client connections get recreated and redistributed among the two nodes.

## High server load mitigation

### Add more shards

Scale out to add more shards, so that load is distributed across multiple Redis processes. Also, consider scaling up to a larger cache size with more CPU cores. For more information, see . [Azure Cache for Redis planning FAQs](cache-planning-faq.yml).

### Create alerts

Create alerts on metrics like CPU or server load to be notified early about potential impacts.

## High memory usage

Memory pressure on the server can lead to various performance problems that delay processing of requests. When memory pressure hits, the system pages data to disk, which causes the system to slow down significantly. 

Several possible can cause this memory pressure:

- The cache is filled with data near its maximum capacity.
- Redis is seeing high memory fragmentation. Fragmentation is most often caused by storing large objects. Redis is optimized for small objects. If the `used_memory_rss` value is higher than the `used_memory` metric, it means part of Redis memory has been swapped off by the operating system, and you can expect some significant latencies. Because Redisserver does not have control over how its allocations are mapped to memory pages, high used_memory_rss is often the result of a spike in memory usage. Redis exposes two stats through the INFO command that can help you identify this issue: "used_memory" and "used_memory_rss". You can also view these metrics using the portal.

Validate that the `maxmemory-reserved` and `maxfragmentationmemory-reserved` values are set appropriately. For recommendations on memory management, see [Best practices for memory management](cache-best-practices-memory-management.md).

<!--old stuff

## Memory pressure on Redis server

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly. There are several possible causes of this memory pressure:

- The cache is filled with data near its maximum capacity.
- Redis is seeing high memory fragmentation. This fragmentation is most often caused by storing large objects since Redis is optimized for small objects.

Redis exposes two stats through the [INFO](https://redis.io/commands/info) command that can help you identify this issue: "used_memory" and "used_memory_rss". You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor-metrics-explorer) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

- [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. This policy may not be sufficient if you have fragmentation.
- [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation.
- Break up your large cached objects into smaller related objects.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like used memory to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity.
- [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity. For more information, see [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

## High CPU usage or server load

A high server load or CPU usage means the server can't process requests in a timely fashion. The server might be slow to respond and unable to keep up with request rates.

[Monitor metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor-metrics-explorer) such as CPU or server load. Watch for spikes in CPU usage that correspond with timeouts.

There are several changes you can make to mitigate high server load:

- Investigate what is causing CPU spikes such as [long-running commands](#long-running-commands) noted below or page faulting because of high memory pressure.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) out to more shards to distribute load across multiple Redis processes or scale up to a larger cache size with more CPU cores. For more information, see  [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

## Long-running commands

Some Redis commands are more expensive to execute than others. The [Redis commands documentation](https://redis.io/commands) shows the time complexity of each command. Because Redis command processing is single-threaded, a command that takes time to run blocks all others that come after it. Review the commands that you're issuing to your Redis server to understand their performance impacts. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without knowing that it's an O(N) operation. You can avoid KEYS by using [SCAN](https://redis.io/commands/scan) to reduce CPU spikes.

Using the [SLOWLOG](https://redis.io/commands/slowlog) command, you can measure expensive commands being executed against the server.

## Server-side bandwidth limitation

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, then data won't be sent to the client as quickly. Clients requests could time out because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor-metrics-explorer) in the portal.

To mitigate situations where network bandwidth usage is close to maximum capacity:

- Change client call behavior to reduce network demand.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like cache read or cache write to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity. For more information, see [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).
-->


## Additional information

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [Choosing the right tier](cache-overview.md#choosing-the-right-tier)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
- [How can I run Redis commands?](cache-development-faq.yml#how-can-i-run-redis-commands-)
