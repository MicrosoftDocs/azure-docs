---
title: Best practices for Using and Monitoring the CPU utilization
titleSuffix: Azure Managed Redis
description: Learn how to use and monitor your server load for Azure Cache for Redis.


ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.date: 10/08/2024
---

# Manage CPU utilization for Azure Managed Redis (preview)

## Value sizes

The design of your client application determines whether you should store many small values or a smaller number of larger values. From a Redis server perspective, smaller values give better performance. We recommend keeping value size smaller than 100 kB.

If your design requires you to store larger values in the Azure Managed Redis (preview), the CPU utilization will be higher. In this case, you might need to use a higher performance tier to ensure CPU usage doesn't limit throughput.

Even if the AMR instance has sufficient CPU capacity, larger values do increase latencies, so follow the guidance in [Configure appropriate timeouts](cache-best-practices-connection.md#configure-appropriate-timeouts).

## Avoid client connection spikes

Creating and closing connections is an expensive operation for Redis server. If your client application creates or closes too many connections in a small amount of time, it could burden the Redis server.

If you're instantiating many client instances to connect to Redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients.

## Memory pressure

High memory usage on the server makes it more likely that the system needs to page data to disk, resulting in page faults that can slow down the system significantly.

## Avoid long running commands

Redis server is a single-threaded system. Long running commands can cause latency or timeouts on the client side because the server can't respond to any other requests while it's busy working on a long running command. For more information, see [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md).  

## Monitor CPU Utilization

Add monitoring on server load to ensure you get notifications when high server load occurs. Monitoring can help you understand your application constraints. Then, you can work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid negative performance effects. Sustained server load over 80% can lead to unplanned failovers. 
Azure Managed Redis (preview) exposes the **CPU** metric to indicate the CPU utilization on the nodes of your AMR instance. We also recommend that you examine the max spikes of **CPU** metric rather than average because even brief spikes can trigger failovers and command timeouts.

## Next steps

- [Troubleshoot Azure Managed Redis server-side issues](cache-troubleshoot-server.md)
- [Connection resilience](cache-best-practices-connection.md)
- [Configure appropriate timeouts](cache-best-practices-connection.md#configure-appropriate-timeouts).
- [Memory management](cache-best-practices-memory-management.md)
- [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting)
