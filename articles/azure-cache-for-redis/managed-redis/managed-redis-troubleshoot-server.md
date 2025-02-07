---
title: Troubleshoot Azure Managed Redis (preview) server issues
description: Learn how to resolve common server issues, such as memory pressure, high CPU, long running commands, or bandwidth limitations, when using Azure Managed Redis (preview).


ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Troubleshoot Azure Managed Redis (preview) server issues

This section discusses troubleshooting issues caused by conditions on an Azure Managed Redis (preview) server or any of the virtual machines hosting it.

- [High CPU](#high-cpu)
  - [Scale up or move to a higher performance tier](#scale-up-or-move-to-a-higher-performance-tier)
  - [Rapid changes in number of client connections](#rapid-changes-in-number-of-client-connections)
  - [Long running or expensive commands](#long-running-or-expensive-commands)
  - [Scaling](#scaling)
  - [Server maintenance](#server-maintenance)
- [High memory usage](#high-memory-usage)
- [Long-running commands](#long-running-commands)
- [Server-side bandwidth limitation](#server-side-bandwidth-limitation)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## High CPU

High CPU means the Redis server is busy and unable to keep up with requests, leading to timeouts. Check the *CPU* metric on your cache by selecting **Monitoring** from the Resource menu on the left. You see the **CPU** graph in the working pane under **Insights**. Or, add a metric set to *CPU* under **Metrics**.

Following are some options to consider for high CPU.

### Scale up or move to a higher performance tier

For higher performance, consider scaling up to a larger cache size with more CPU cores. For more information, see [Performance tiers](managed-redis-how-to-scale.md#performance-tiers).

### Rapid changes in number of client connections

For more information, see [Avoid client connection spikes](managed-redis-best-practices-connection.md#avoid-client-connection-spikes).

### Long running or expensive commands

For more information, see [Long running commands](managed-redis-troubleshoot-timeouts.md#long-running-commands).

### Scaling

Scaling operations are CPU and memory intensive as it could involve moving data around nodes and changing cluster topology. For more information, see [Scaling](managed-redis-best-practices-scale.md).

### Server maintenance

If your Azure Managed Redis underwent a failover, all client connections from the node that went down are transferred to the node that is still running. The CPU could spike because of the increased connections. You can try rebooting your client applications so that all the client connections get recreated and redistributed among the two nodes.

## High memory usage

Memory pressure on the server can lead to various performance problems that delay processing of requests. When memory pressure hits, the system pages data to disk, which causes the system to slow down significantly.

Here are some possible causes of memory pressure:

- The cache is filled with data near its maximum capacity
- Redis server is seeing high memory fragmentation

Fragmentation is likely to be caused when a load pattern is storing data with high variation in size. For example, fragmentation might happen when data is spread across 1 KB and 1 MB in size. When a 1-KB key is deleted from existing memory, a 1-MB key can’t fit into it causing fragmentation. Similarly, if 1-MB key is deleted and 1.5-MB key is added, it can’t fit into the existing reclaimed memory. This causes unused free memory and results in more fragmentation.

If the `used_memory_rss` value is higher than 1.5 times the `used_memory` metric, there's fragmentation in memory. The fragmentation can cause issues when:

1. Memory usage is close to the max memory limit for the cache, or
2. `UsedMemory_RSS` is higher than the Max Memory limit, potentially resulting in page faulting in memory.

If a cache is fragmented and is running under high memory pressure, the system does a failover to try recovering Resident Set Size (RSS) memory.

Redis exposes two stats, `used_memory` and `used_memory_rss`, through the [INFO](https://redis.io/commands/info) command that can help you identify this issue. You can [view these metrics](../monitor-cache.md#view-cache-metrics) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

- [Configure a memory policy](managed-redis-configure.md#memory-policies) and set expiration times on your keys. This policy may not be sufficient if you have fragmentation.
- [Create alerts](../monitor-cache.md#create-alerts) on metrics like used memory to be notified early about potential impacts.
- [Scale](managed-redis-how-to-scale.md) to a larger cache size with more memory capacity. For more information, see [Azure Managed Redis planning FAQs](./managed-redis-planning-faq.yml).

For recommendations on memory management, see [Best practices for memory management](managed-redis-best-practices-memory-management.md).

## Long-running commands

For more information, see [Long running commands](managed-redis-troubleshoot-timeouts.md#long-running-commands).

## Server-side bandwidth limitation

For more information, see [Network bandwidth limitation](managed-redis-troubleshoot-timeouts.md#network-bandwidth-limitation).

## Additional information

- [Troubleshoot Azure Managed Redis client-side issues](managed-redis-troubleshoot-client.md)
- [Choosing the right tier](managed-redis-overview.md#choosing-the-right-tier)
- [Performance testing with Azure Managed Redis](managed-redis-best-practices-performance.md)
- [Monitor Azure Managed Redis](../monitor-cache.md)
- [How can I run Redis commands?](managed-redis-development-faq.yml#how-can-i-run-redis-commands-)
