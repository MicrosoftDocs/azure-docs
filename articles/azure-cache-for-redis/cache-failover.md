---
title: Failover and patching - Azure Cache for Redis
description: Learn about failover, patching, and the update process for Azure Cache for Redis.
author: asasine

ms.service: cache
ms.topic: conceptual
ms.date: 10/18/2019
ms.author: adsasine
---

# Failover and patching for Azure Cache for Redis

To build resilient and successful client applications, it's critical to understand failover in the context of the Azure Cache for Redis service. A failover can be a part of planned management operations, or might be caused by unplanned hardware or network failures. A common use of cache failover comes when the management service patches the Azure Cache for Redis binaries. This article covers what a failover is, how it occurs during patching, and how to build a resilient client application.

## What is a failover?

Let's start with an overview of failover for Azure Cache for Redis.

### A quick summary of cache architecture

A cache is constructed of multiple virtual machines with separate, private IP addresses. Each virtual machine, also known as a node, is connected to a shared load balancer with a single virtual IP address. Each node runs the Redis server process and is accessible by means of the host name and the Redis ports. Each node is considered either a master or a replica node. When a client application connects to a cache, its traffic goes through this load balancer and is automatically routed to the master node.

In a Basic cache, the single node is always a master. In a Standard or Premium cache, there are two nodes: one is chosen as the master and the other is the replica. Because Standard and Premium caches have multiple nodes, one node might be unavailable while the other continues to process requests. Clustered caches are made of many shards, each with distinct master and replica nodes. One shard might be down while the others remain available.

> [!NOTE]
> A Basic cache doesn't have multiple nodes and doesn't offer a service-level agreement (SLA) for its availability. Basic caches are recommended only for development and testing purposes. Use a Standard or Premium cache for a multi-node deployment, to increase availability.

### Explanation of a failover

A failover occurs when a replica node promotes itself to become a master node, and the old master node closes existing connections. After the master node comes back up, it notices the change in roles and demotes itself to become a replica. It then connects to the new master and synchronizes data. A failover might be planned or unplanned.

A *planned failover* takes place during system updates, such as Redis patching or OS upgrades, and management operations, such as scaling and rebooting. Because the nodes receive advance notice of the update, they can cooperatively swap roles and quickly update the load balancer of the change. A planned failover typically finishes in less than 1 second.

An *unplanned failover* might happen because of hardware failure, network failure, or other unexpected outages to the master node. The replica node  promotes itself to master, but the process takes longer. A replica node must first detect that its master node is not available before it can initiate the failover process. The replica node must also verify that this unplanned failure is not transient or local, to avoid an unnecessary failover. This delay in detection means that an unplanned failover typically finishes within 10 to 15 seconds.

## How does patching occur?

The Azure Cache for Redis service regularly updates your cache with the latest platform features and fixes. To patch a cache, the service follows these steps:

1. The management service selects one node to be patched.
1. If the selected node is a master node, the corresponding replica node cooperatively promotes itself. This promotion is considered a planned failover.
1. The selected node reboots to take the new changes and comes back up as a replica node.
1. The replica node connects to the master node and synchronizes data.
1. When the data sync is complete, the patching process repeats for the remaining nodes.

Because patching is a planned failover, the replica node quickly promotes itself to become a master and begins servicing requests and new connections. Basic caches don't have a replica node and are unavailable until the update is complete. Each shard of a clustered cache is patched separately and won't close connections to another shard.

> [!IMPORTANT]
> Nodes are patched one at a time to prevent data loss. Basic caches will have data loss. Clustered caches are patched one shard at a time.

Multiple caches in the same resource group and region are also patched one at a time.  Caches that are in different resource groups or different regions might be patched simultaneously.

Because full data synchronization happens before the process repeats, data loss is unlikely to occur when you use a Standard or Premium cache. You can further guard against data loss by [exporting](cache-how-to-import-export-data.md#export) data and enabling [persistence](cache-how-to-premium-persistence.md).

## Additional cache load

Whenever a failover occurs, the Standard and Premium caches need to replicate data from one node to the other. This replication causes some load increase in both server memory and CPU. If the cache instance is already heavily loaded, client applications might experience increased latency. In extreme cases, client applications might receive time-out exceptions. To help mitigate the impact of this additional load, [configure](cache-configure.md#memory-policies) the cache's `maxmemory-reserved` setting.

## How does a failover affect my client application?

The number of errors seen by the client application depends on how many operations were pending on that connection at the time of the failover. Any connection that's routed through the node that closed its connections will see errors. Many client libraries can throw different types of errors when connections break, including time-out exceptions, connection exceptions, or socket exceptions. The number and type of exceptions depends on where in the code path the request is when the cache closes its connections. For instance, an operation that sends a request but hasn't received a response when the failover occurs might get a time-out exception. New requests on the closed connection object receive connection exceptions until the reconnection happens successfully.

Most client libraries attempt to reconnect to the cache if they're configured to do so. However, unforeseen bugs can occasionally place the library objects into an unrecoverable state. If errors persist for longer than a preconfigured amount of time, the connection object should be recreated. In Microsoft.NET and other object-oriented languages, recreating the connection without restarting the application can be accomplished by using [a Lazy\<T\> pattern](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#reconnecting-with-lazyt-pattern).

### How do I make my application resilient?

Because you can't avoid failovers completely, write your client applications for resiliency to connection breaks and failed requests. Although most client libraries automatically reconnect to the cache endpoint, few of them attempt to retry failed requests. Depending on the application scenario, it might make sense to use retry logic with backoff.

To test a client application's resiliency, use a [reboot](cache-administration.md#reboot) as a manual trigger for connection breaks. Additionally, we recommend that you [schedule updates](cache-administration.md#schedule-updates) on a cache. Tell the management service to apply Redis runtime patches during specified weekly windows. These windows are typically periods when client application traffic is low, to avoid potential incidents.

### Client network-configuration changes

Certain client-side network-configuration changes can trigger "No connection available" errors. Such changes might include:

- Swapping a client application's virtual IP address between staging and production slots.
- Scaling the size or number of instances of your application.

Such changes can cause a connectivity issue that lasts less than one minute. Your client application will probably lose its connection to other external network resources in addition to the Azure Cache for Redis service.

## Next steps

- [Schedule updates](cache-administration.md#schedule-updates) for your cache.
- Test application resiliency by using a [reboot](cache-administration.md#reboot).
- [Configure](cache-configure.md#memory-policies) memory reservations and policies.
