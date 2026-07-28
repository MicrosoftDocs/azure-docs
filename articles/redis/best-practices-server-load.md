---
title: Best practices for Using and Monitoring the Server Load for Azure Managed Redis
description: Learn how to use and monitor your server load for Azure Managed Redis.
ms.date: 05/18/2025
ms.topic: best-practice
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis 
---

# Manage Server Load for Azure Managed Redis

In this article, we discuss how to use and monitor the load of an Azure Managed Redis cache.

## Value sizes

The design of your client application determines whether you should store many small values or a smaller number of larger values. From a Redis server perspective, smaller values give better performance. We recommend keeping value size smaller than 100 kB.

If your design requires you to store larger values in the Azure Managed Redis, the server load will be higher. In this case, you might need to use a higher cache tier to ensure CPU usage doesn't limit throughput.

Even if the cache has sufficient CPU capacity, larger values do increase latencies, so follow the guidance in [Configure appropriate timeouts](best-practices-connection.md#configure-appropriate-timeouts).

## Avoid client connection spikes

Creating and closing connections is an expensive operation for Redis server. If your client application creates or closes too many connections in a small amount of time, it could burden the Redis server.

If you're instantiating many client instances to connect to Redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients.

## Memory pressure

High memory usage on the server makes it more likely that the system needs to page data to disk, resulting in page faults that can slow down the system significantly.

## Avoid long running commands

Redis server is a single-threaded system. Long running commands can cause latency or timeouts on the client side because the server can't respond to any other requests while it's busy working on a long running command. For more information, see [Troubleshoot Azure Cache for Redis server-side issues](troubleshoot-server.md).  

## Monitor Server Load and CPU

Add monitoring on server load and CPU to ensure you get notifications when either one of them is high. Monitoring can help you understand your application constraints. Then, you can work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid negative performance effects. Sustained server load over 80% can lead to unplanned failovers.
Currently, Azure Managed Redis exposes two metrics in **Insights** under **Monitoring** on the Resource menu on the left of the portal: **CPU** and **Server Load**. Understanding what is measured by each metric is important when monitoring them.

The **CPU** (a.k.a. percentProcessorTime) metric indicates the CPU usage for the node that hosts the cache. The CPU metric also includes processes that aren't strictly Redis server processes. CPU includes background processes for anti-malware and others. As a result, the CPU metric can sometimes spike and might not be a perfect indicator of CPU usage for the Redis server.

The **Server Load** metric reflects the Redis server's own assessment of overall load and is similar to CPU metric but at a cluster level.

### Recommendations for Smaller SKUs

On Azure Managed Redis SKUs backed by 2-vCPU VMs (B0–B5, X3, and M10), percentage-based metrics like **Server Load** and **CPU** are inherently more sensitive. A single short-lived background thread can consume a significant percentage of total CPU, causing metrics to appear elevated even when actual workload is light. As a result, these metrics can overestimate actual load on small SKUs and may not indicate workload saturation.

When reviewing metrics over longer time periods, such as several hours or days, we recommend:

- Using **CPU** instead of **Server Load** as it can be viewed at instance level adding more granularity
- Splitting by instance ID of the virtual machines backing the Azure Managed Redis instance
- Using **Average** aggregation instead of **Maximum** for these longer time ranges

You can still use **Maximum** aggregation over short time windows to catch brief spikes or events (such as those that might cause timeouts or failovers), while relying on **Average** over longer windows for trend analysis on small SKUs, especially when using **CPU**.

## Test for increased server load after failover

For standard and premium SKUs, each cache is hosted on two nodes. A load balancer distributes the client connections to the two nodes. When planned or unplanned maintenance occurs on the primary node, the node closes all the client connections. In such situations, all client connections could land on a single node causing the server load to increase on the one remaining node. We recommend testing this scenario by rebooting the primary node and ensuring that one node can handle all your client connections without the server load going too high.

## Next steps

- [Troubleshoot Azure Managed Redis server-side issues](troubleshoot-server.md)
- [Connection resilience](best-practices-connection.md)
- [Configure appropriate timeouts](best-practices-connection.md#configure-appropriate-timeouts).
- [Memory management](best-practices-memory-management.md)
