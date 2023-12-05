---
title: Best practices for Using and Monitoring the Server Load
titleSuffix: Azure Cache for Redis
description: Learn how to use and monitor your server load for Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 12/30/2021
ms.author: franlanglois
---

# Manage Server Load for Azure Cache for Redis

## Value sizes

The design of your client application determines whether you should store many small values or a smaller number of larger values. From a Redis server perspective, smaller values give better performance. We recommend keeping value size smaller than 100 kB.

If your design requires you to store larger values in the Azure Cache for Redis, the server load will be higher. In this case, you might need to use a higher cache tier to ensure CPU usage doesn't limit throughput.

Even if the cache has sufficient CPU capacity, larger values do increase latencies, so follow the guidance in [Configure appropriate timeouts](cache-best-practices-connection.md#configure-appropriate-timeouts).

Larger values also increase the chances of memory fragmentation, so be sure to follow the guidance in [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting).

## Avoid client connection spikes

Creating and closing connections is an expensive operation for Redis server. If your client application creates or closes too many connections in a small amount of time, it could burden the Redis server.

If you're instantiating many client instances to connect to Redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients.

## Memory pressure

High memory usage on the server makes it more likely that the system needs to page data to disk, resulting in page faults that can slow down the system significantly.

## Avoid long running commands

Redis server is a single-threaded system. Long running commands can cause latency or timeouts on the client side because the server can't respond to any other requests while it's busy working on a long running command. For more information, see [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md).  

## Monitor Server Load

Add monitoring on server load to ensure you get notifications when high server load occurs. Monitoring can help you understand your application constraints. Then, you can work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid negative performance effects. Sustained server load over 80% can lead to unplanned failovers. 
Currently, Azure Cache For Redis exposes two metrics in **Insights** under **Monitoring** on the Resource menu on the left of the portal: **CPU** and **Server Load**. Understanding what is measured by each metric is important when monitoring server load.

The **CPU** metric indicates the CPU usage for the node that hosts the cache. The CPU metric also includes processes that aren't strictly Redis server processes. CPU includes background processes for anti-malware and others. As a result, the CPU metric can sometimes spike and might not be a perfect indicator of CPU usage for the Redis server.

The **Server Load** metric represents the load on the Redis Server alone. We recommend monitoring the **Server Load** metric instead of **CPU**.

## Plan for server maintenance

Ensure you have enough server capacity to handle your peak load while your cache servers are undergoing maintenance. Test your system by rebooting nodes while under peak load. For more information on how to simulate deployment of a patch, see [reboot](cache-administration.md#reboot).

## Test for increased server load after failover

For standard and premium SKUs, each cache is hosted on two nodes. A load balancer distributes the client connections to the two nodes. When planned or unplanned maintenance occurs on the primary node, the node closes all the client connections. In such situations, all client connections could land on a single node causing the server load to increase on the one remaining node. We recommend testing this scenario by rebooting the primary node and ensuring that one node can handle all your client connections without the server load going too high.

## Next steps

- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [Connection resilience](cache-best-practices-connection.md)
  - [Configure appropriate timeouts](cache-best-practices-connection.md#configure-appropriate-timeouts).
- [Memory management](cache-best-practices-memory-management.md)
  - [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting)

