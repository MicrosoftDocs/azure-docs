---
title: Troubleshoot Azure Cache for Redis server-side issues
description: Learn how to resolve common server-side issues with Azure Cache for Redis, such as memory pressure, high CPU, long running commands, or bandwidth limitations.
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 10/18/2019
---
# Troubleshoot Azure Cache for Redis server-side issues

This section discusses troubleshooting issues that occur because of a condition on an Azure Cache for Redis or the virtual machine(s) hosting it.

- [Memory pressure on Redis server](#memory-pressure-on-redis-server)
- [High CPU usage or server load](#high-cpu-usage-or-server-load)
- [Long-running commands](#long-running-commands)
- [Server-side bandwidth limitation](#server-side-bandwidth-limitation)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Memory pressure on Redis server

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly. There are several possible causes of this memory pressure:

- The cache is filled with data near its maximum capacity.
- Redis is seeing high memory fragmentation. This fragmentation is most often caused by storing large objects since Redis is optimized for small objects.

Redis exposes two stats through the [INFO](https://redis.io/commands/info) command that can help you identify this issue: "used_memory" and "used_memory_rss". You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

- [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. This policy may not be sufficient if you have fragmentation.
- [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation.
- Break up your large cached objects into smaller related objects.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like used memory to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity.

## High CPU usage or server load

A high server load or CPU usage means the server can't process requests in a timely fashion. The server may be slow to respond and unable to keep up with request rates.

[Monitor metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) such as CPU or server load. Watch for spikes in CPU usage that correspond with timeouts.

There are several changes you can make to mitigate high server load:

- Investigate what is causing CPU spikes such as [long-running commands](#long-running-commands) noted below or page faulting because of high memory pressure.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more CPU capacity.

## Long-running commands

Some Redis commands are more expensive to execute than others. The [Redis commands documentation](https://redis.io/commands) shows the time complexity of each command. Because Redis command processing is single-threaded, a command that takes time to run will block all others that come after it. You should review the commands that you're issuing to your Redis server to understand their performance impacts. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without knowing that it's an O(N) operation. You can avoid KEYS by using [SCAN](https://redis.io/commands/scan) to reduce CPU spikes.

Using the [SLOWLOG](https://redis.io/commands/slowlog) command, you can measure expensive commands being executed against the server.

## Server-side bandwidth limitation

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, then data won't be sent to the client as quickly. Clients requests could time out because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) in the portal.

To mitigate situations where network bandwidth usage is close to maximum capacity:

- Change client call behavior to reduce network demand.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like cache read or cache write to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity.

## Additional information

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [What Azure Cache for Redis offering and size should I use?](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use)
- [How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
- [How can I run Redis commands?](cache-faq.md#how-can-i-run-redis-commands)
