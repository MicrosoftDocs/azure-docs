---
title: Failover and patching - Azure Cache for Redis | Microsoft Docs
description: Learn about failover, patching, and the update process for Azure Cache for Redis.
services: cache
author: asasine

ms.assetid: 928b9b9c-d64f-4252-884f-af7ba8309af6
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.topic: conceptual
ms.date: 10/18/2019
ms.author: adsasine
---

# Failover and patching for Azure Cache for Redis

Understanding what a failover is in context with the Azure Cache for Redis service is critical to building resilient and successful client applications. A common cause for a cache failover comes from the management service patching the Redis binaries. This article covers what a failover is, how they occur during patching, and how to build a resilient client application.

## What is a failover?

### A quick summary of our architecture

A cache is constructed of multiple virtual machines with separate private IPs. Each virtual machine, also known as a node, is connected to a shared load balancer with a single virtual IP. Each node runs the Redis server process and is accessible through the host name and the Redis ports. Each node is either considered a master or a replica node. When a client application connects to a cache, its traffic goes through this load balancer and is automatically routed to the master node.

In a Basic cache, the single node is always a master. In a Standard or Premium cache, there are two nodes where one is chosen the master and the other is the replica. Because Standard and Premium caches have multiple nodes, one node may be unavailable while the other continues to process requests. Clustered caches are made of many shards, each with distinct master and replica nodes. One shard may be down while the others remain available.

> [!NOTE]
> A Basic cache doesn't have multiple nodes and doesn't offer an SLA on availability. Basic caches are only recommended for development and testing purposes. Use a Standard or Premium cache for a multi-node deployment to increase availability.

### A failover explained

A failover occurs when a replica node promotes itself to become a master node and the old master node closes existing connections. After the master node comes back up, it will notice the change in roles and demote itself to become a replica. It will then connect to the new master and synchronize data. A failover may be planned or unplanned.

A planned failover takes place during system updates such as Redis patching or OS upgrades and management operations such as scaling and rebooting. Because the nodes are given advanced notice of the update, they can cooperatively swap roles and quickly update the load balancer of the change. A planned failover should complete in less than 1 second.

An unplanned failover may happen because of hardware failure, network failure, or other unexpected outages to the master node. The replica node will promote itself to master but the process takes longer. A replica node must first detect its master node is not available before it can initiate the failover process. The replica node must also verify this unplanned failure is not transient or local to avoid an overeager failover. This delay in detection means an unplanned failover typically completes within 10 to 15 seconds.

## How does patching occur?

The Azure Cache for Redis service regularly does maintenance to update your cache with the latest platform features and fixes. To patch a cache, the service follows the following steps:

1. The management service selects one node to be patched.
1. If the selected node is a master node, its replica node cooperatively promotes itself. This promotion is considered a planned failover.
1. The selected node reboots to take the new changes and comes back up as a replica node. Replica nodes connect to the master node and synchronize data.
1. When data sync completes, the patching process repeats for the remaining nodes.

Since patching is a planned failover, the replica node quickly promotes itself to become a master and begins servicing requests and new connections. Basic caches don't have a replica node and are unavailable until the update completes. Each shard of a clustered cache is patched separately and won't close connections to another shard.

> [!IMPORTANT]
> Nodes are patched one at a time to prevent data loss. Basic caches will have data loss. Clustered caches are patched one shard at a time.

Multiple caches in the same resource group and region are also patched one at a time.  Caches that are in different resource groups or different regions may be patched simultaneously.

Because full data synchronization happens before the process repeats, data loss is unlikely to occur when using a Standard or Premium cache. You can further guard against data loss by using [exporting](cache-how-to-import-export-data.md#export) data and enabling [persistence](cache-how-to-premium-persistence.md).

### Additional cache load

Whenever a failover occurs, the Standard and Premium caches need to replicate data from one node to the other. This replication causes some load increase in both server memory and CPU. If the cache instance is already heavily loaded, client applications may experience increased latency. In extreme cases, client applications may receive timeout exceptions. [Configure](cache-configure.md#memory-policies) the cache's `maxmemory-reserved` setting to help mitigate the impact of this additional load.

## How does a failover impact my client application?

The number of errors seen by the client application will depend on how many operations were pending on that connection at the time of the failover. Any connection that is routed through the node that closed connections will see errors. Many client libraries can throw different types of errors including timeout exceptions, connection exceptions, or socket exceptions when connections break. The number and type of exceptions depends on where in the code path the request is when the cache closes its connections. For instance, an operation that sends a request but hasn't received a response when the failover occurs may get a timeout exception. New requests on the closed connection object will receive connection exceptions until the reconnection happens successfully.

Most client libraries will attempt to reconnect to the cache if configured to do so but unforeseen bugs can occasionally place the library objects into an unrecoverable state. If errors persist for longer than a pre-configured amount of time, the connection object should be recreated. In .NET and other object oriented languages, recreating the connection without restarting the application can be accomplished using [a Lazy\<T\> pattern](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#reconnecting-with-lazyt-pattern).

### What should I do in my application?

Since a failover cannot be completely avoided, client applications should be written for resiliency to connection breaks and failed requests. Despite most client libraries automatically reconnecting to the cache endpoint, few client libraries attempt to retry failed requests. Depending on the application scenario, retry logic with back-off may make sense.

To test a client application's resiliency, use a [reboot](cache-administration.md#reboot) as a manual trigger for connection breaks. Additionally, it's recommended to [schedule updates](cache-administration.md#schedule-updates) on a cache to tell the management service to have the Redis runtime patches apply during specified weekly windows. These windows are typically chosen to periods when client application traffic is lower to avoid potential incidents.

### Client network configuration changes

Certain client-side network configuration changes can trigger "No connection available" errors.  Swapping a client application's virtual IP address between staging and production slots or scaling the size/number of instances of your application can cause a connectivity issue that last less than one minute. Your client application will likely lose connection to other external network resources in addition to Redis.

## Next steps

- [Schedule updates](cache-administration.md#schedule-updates) for your cache.
- Test application resiliency using a [reboot](cache-administration.md#reboot).
- [Configure](cache-configure.md#memory-policies) memory reservations and policies.
