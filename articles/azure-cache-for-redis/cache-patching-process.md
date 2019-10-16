---
title: Patching process explained - Azure Cache for Redis | Microsoft Docs
description: Learn the patching and update process for Azure Cache for Redis.
services: cache
author: yegu-ms

ms.assetid: 928b9b9c-d64f-4252-884f-af7ba8309af6
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: yegu

---

# Patching process explained for Azure Cache for Redis

Azure Redis Patching Explained	
---------------
Occationally customers will experience connection related errors in their client applications talking to Redis.  Most often these errors are caused by one of the following:

 1. Redis was patched or a master/slave failover occurred.
 2. A client-side network configuration change was made.  [See below for details](#network-configuration-changes) 

In this article we will quickly discuss how patching works in Azure Redis and how this impacts clients.  While this article talks mostly about patching, the experience is more or less the same when a failover occurs.

## Redis Patching and Failover Details
### Quick summary of our Architecture
`Basic Tier:` The Basic tier of Azure Redis is made up of a single VM running a single instances of Redis.  If that one VM goes down for patching (either OS or Redis Runtime), then the Redis instance will be inaccessible for the duration of the patch.  For this reason, we recommend that the Basic tier be used only for development and testing purposes.

`Standard Tier:` The Standard Tier of Redis is made up of two VM instances, each running a single Redis server process.  One instance will be the "master" node and one will be the "slave".  The master node replicates data to the slave node more or less continuously.  

 - If the master node goes down **unexpectedly**, the slave will promote itself to master, typically within 10-15 seconds.  When the old master node comes back up it will become a slave and replicate data from the current master node.  
 - In the case of **patching**, the slave is proactively promoted to master and the client should be able to immediately reconnect without any significant delay.

`Premium Tier:` The Premium Tier of Redis is similar to the Standard Tier in that it has a master/slave pair.  It differs in that it runs on better hardware, can run in a Virtual Network and can be clustered (e.g. have multiple shards of data, each shard consisting of a master/slave pair).


### How does Azure Redis manage patching?
`For Basic Tier:` As mentioned above, the one and only node is taken down, which will result in the cache being completely unreachable.  There is no SLA for Basic Tier for this reason.

`For Standard and Premium Tier:` The current patching process looks something like the following.  Note that Standard tier basically has one "Shard" (aka master/slave pair).  Premium Tier can have multiple "Shards" if it is configured to use clustering.  

1.	We patch one shard at a time
2.	Within a shard, we patch only one node at a time. During patching the node is rebooted.  See below for details on how this will impact your client.
3.	When node X comes back up after patching, it synchronizes data from the node Y
4.	Once data sync completes, the Node X becomes the new primary node and Node Y is then patched
5.	When Node Y is done being patched, it synchronizes data from Node X.
6.	This same process is repeated until all shards have been updated.

Note that either Node X or Y can be the “master” at any given time – e.g. the secondary node can promote itself to be the “master” when necessary and the other node will switch to being the secondary copy.

### How does this impact StackExchange.Redis?
Note that connections can be routed through either the master or slave node in our architecture (the slave redirects request to the master node automatically). This enables the slave to handle some of the CPU load, like SSL termination.

When any node is taken down:

 1. Any connection that is routed through the node will see errors
 2. The number of errors seen will depend on how many operations were pending on that connection.
 3. StackExchange.Redis can throw `TimeoutException`, `RedisConnectionException` or even `SocketException`, depending on where in the code path the request is when the connection is broken.  For instance, any operations that have already been sent to Redis and haven’t received a response yet (on the broken connection) will most likely get a TimeoutException. New operation requests sent to Redis will receive the “No Connection is available” error until the reconnection happens successfully. So, the client application can get a mix of “No Connection is available…” errors as well as the “TimeoutExceptions”.
 4. StackExchange.Redis will typically automatically reconnect if you have [abortConnect set to false](https://gist.github.com/JonCole/36ba6f60c274e89014dd).  We have [seen a few cases](https://github.com/StackExchange/StackExchange.Redis/issues/559) where the connection multiplexer fails to reconnect automatically.  In such cases, you should dispose the current multiplexer and create a new one.  See [my best practices post](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#reconnecting-with-lazyt-pattern) for details and sample code for how to re-create the connection.
 5. StackExchange.Redis will retry connection attempts - it will **not** retry operations.  It is up to the application to retry operations.

`The Takeaway:` This means that for each master pair slaves, you should see two brief periods of connectivity loss for each shard (once for the slave node and once for the master node).  

### Will I lose data during patching?
Data loss during patching is unlikely to occur (except on Basic Tier as explained above).  I talk more about conditions that can cause data loss in [What happened to my data in Redis](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md).

### Patching of Multiple Redis Instances
If you have multiple Redis instances within a given region, we patch these instances one by one **when they are in the same Resource Group**.  Caches that are in different Azure Resource Groups or different regions *may* be patched simultaneously.

### Additional Load
Whenever patching or failover occurs, the Standard and Premium tiers need to replicate data from one node to the other.  This causes some increase in load (both memory and CPU) on the server side.  Most applications won't notice this additional load, with the exception being when your Redis instance is already heavily loaded.  When this additional load happens, it can cause latency to increase and may cause client's to see timeouts in extreme cases.  One thing you can do to help mitigate the impact of this is to configure the server's maxmemory-reserved setting [as described here](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#maxmemory-policy-and-maxmemory-reserved).

## Network configuration changes
There are certain types of client-side network configuration changes that can trigger these types of "No connection available" errors.  For instance, performing a staging/production VIP swap or scaling the size/number of instances of your application can cause a connectivity issues that usually last less than one minute.  This connectivity loss is not just to Redis but to other external network resources as well.  

## What should I do in my application?
Since these types of connection resets are expected during patching, failover, VIP swapping, and scaling.  They cannot be avoided, so I would recommend that your application be written such that it is resilient to such transient failures.  Retry logic with some type of retry back-off may make sense, depending on your scenario. 

I would highly recommend that you do some testing of how your application handles failovers by using the [Reboot feature](https://docs.microsoft.com/en-us/azure/redis-cache/cache-administration#reboot) as a way to trigger such connection blips.  

You may also want to consider upgrading to the Premium tier, which has support for [scheduled patching](https://docs.microsoft.com/en-us/azure/redis-cache/cache-administration#schedule-updates), which would allow you have the Redis runtime patches applied during a window when you have lower traffic.  

## Additional information

- [What Azure Cache for Redis offering and size should I use?](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use)
- [How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
- [How can I run Redis commands?](cache-faq.md#how-can-i-run-redis-commands)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
