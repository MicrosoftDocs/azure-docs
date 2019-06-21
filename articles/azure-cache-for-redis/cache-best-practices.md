---
title: Best practices for Azure Cache for Redis
description: Learn how to use your Azure Cache for Redis effectively by following these best practices.
services: cache
documentationcenter: na
author: joncole
manager: jhubbard
editor: tysonn

ms.assetid: 3e4905e3-89e3-47f7-8cfb-12caf1c6e50e
ms.service: cache
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: cache
ms.workload: tbd
ms.date: 06/21/2019
ms.author: joncole
---

# Best Practices for Azure Cache for Redis 
By following these best practices, you can help maximize the performance and cost-effective use of your Azure Cache for Redis instance.

## Configuration and Concepts
 1. **Use Standard or Premium Tier for Production systems.**  The Basic Tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache.  C0 caches are meant for simple dev/test scenarios since they have a shared CPU core, little memory, and are prone to "noisy neighbor" issues.

 1. **Remember that Redis is an In-Memory data store.**  [This article](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md) outlines some scenarios where data loss can occur.

 1. **Develop your system such that it can handle connection blips** [because of patching and failover](https://gist.github.com/JonCole/317fe03805d5802e31cfa37e646e419d#file-azureredis-patchingexplained-md).

 1. **Configure your [maxmemory-reserved setting](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) to improve system responsiveness** under memory pressure conditions.  This setting is especially important for write-heavy workloads or if you're storing larger values (100 KB or more) in Redis.  I would recommend starting with 10% of the size of your cache, then increase if you have write-heavy loads. See [some considerations](cache-how-to-troubleshoot.md#considerations-for-memory-reservations) when selecting a value.

 1. **Redis works best with smaller values**, so consider chopping up bigger data into multiple keys.  In [this Redis discussion](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/), some considerations are listed that you should consider carefully.  Read [this article](cache-how-to-troubleshoot.md#large-requestresponse-size) for an example problem that can be caused by large values.

 1. **Locate your cache instance and your application in the same region.**  Connecting to a cache in a different region can significantly increase latency and reduce reliability.  While you can connect from outside of Azure, it  not recommended *especially when using Redis as a cache*.  If you're using Redis as just a key/value store, latency may not be the primary concern. 

 1. **Reuse connections** - Creating new connections is expensive and increases latency, so reuse connections as much as possible. If you choose to create new connections, make sure to close the old connections before you release them (even in managed memory languages like .NET or Java).

 1. **Configure your client library to use a *connect timeout* of at least 15 seconds**, giving the system time to connect even under higher CPU conditions.  A small connection timeout value doesn't guarantee that the connection is established in that time frame.  If something goes wrong (high client CPU, high server CPU, and so on), then a short connection timeout value will cause the connection attempt to fail. This behavior often makes a bad situation worse.  Instead of helping, shorter timeouts aggravate the problem by forcing the system to restart the process of trying to reconnect, which can lead to a *connect -> fail -> retry* loop. We generally recommend that you leave your connection Timeout at 15 seconds or higher. It's better to let your connection attempt succeed after 15 or 20 seconds than it is to have it fail quickly only to retry. Such a retry loop can cause your outage to last longer than if you let the system just take longer initially.  
     > [!NOTE]
     > This guidance is specific to the *connection attempt* and not related to the time you're willing to wait for an *operation* like GET or SET to complete.
 

 1. **Avoid Expensive Commands** - Some redis operations, like the [KEYS command](https://redis.io/commands/keys), are *very* expensive and should be avoided.  For more information, see [some considerations around expensive commands](cache-how-to-troubleshoot.md#expensive-commands)


 
## Memory Management
There are several things related to memory usage within your Redis server instance that you may want to consider.  Here are a few:

 1. **Choose an [eviction policy](https://redis.io/topics/lru-cache) that works for your application.**  The default policy for Azure Redis is *volatile-lru*, which means that only keys that have a TTL value set will be eligible for eviction.  If no keys have a TTL value, then the system won't evict any keys.  If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the *allkeys-lru* policy.

 1. **Set an expiration value on your keys.**  This will remove keys proactively instead of waiting until there is memory pressure.  When eviction does kick in because of memory pressure, it can cause additional load on your server.  For more information, see the documentation for the [Expire](https://redis.io/commands/expire) and [ExpireAt](https://redis.io/commands/expireat) commands.
 
## Client Library Specific Guidance
 1. [StackExchange.Redis (.NET)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-stackexchange-redis-md)
 1. [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
 1. [Lettuce (Java)](https://gist.github.com/warrenzhu25/181ccac7fa70411f7eb72aff23aa8a6a#file-azure-redis-lettuce-best-practices-md)
 1. [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
 1. [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
 1. [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
 1. [Asp.Net Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)


## When is it safe to retry?
Unfortunately, there's no easy answer.  Each application needs to decide what operations can be retried and which can't.  Each operation has different requirements and inter-key dependencies.  Here are some things you might consider:

 1. You can get client-side errors even though Redis successfully ran the command you asked it to run.  For example:
	 - Timeouts are a client-side concept.  If the operation reached the server, the server will run the command even if the client gives up waiting.  
	 - When an error occurs on the socket connection, it's not possible to know  if the operation actually ran on the server.  For example, the connection error can happen after the request is processed by the server but before the response is received by the client.
 1.  How does my application react if I accidentally run the same operation twice?  For instance, what if I increment an integer twice instead of just once?  Is my application writing to the same key from multiple places?  What if my retry logic overwrites a value set by some other part of my app?

If you would like to test how your code works under error conditions, consider using the [Reboot Feature](cache-administration.md#reboot). This allows you to see how connection blips affect your application.

## Performance Testing
 1. **Start by using `redis-benchmark.exe`** to get a feel for possible throughput/latency before writing your own perf tests.  Redis-benchmark documentation can be [found here](http://redis.io/topics/benchmarks).  Note that redis-benchmark doesn't support SSL, so you'll have to [enable the Non-SSL port through the Portal](cache-configure.md#access-ports) before you run the test.  [A windows compatible version of redis-benchmark.exe can be found here](https://github.com/MSOpenTech/redis/releases)
 1. The client VM used for testing should be **in the same region** as your Redis cache instance.
 1. **We recommend using Dv2 VM Series** for your client as they have better hardware and will give the best results.
 1. Make sure the client VM you use has **at least as much compute and bandwidth* as the cache being tested. 
 1. **Enable VRSS** on the client machine if you are on Windows.  [See here for details](https://technet.microsoft.com/library/dn383582(v=ws.11).aspx).  Example powershell script:
     >PowerShell -ExecutionPolicy Unrestricted Enable-NetAdapterRSS -Name (    Get-NetAdapter).Name 
     
 1. **Premium tier Redis instances** will have better network latency and throughput because they're running on better hardware for both CPU and Network.
 
     > [!NOTE]
     > Our observed performance results are [published here](cache-faq.md#azure-cache-for-redis-performance) for your reference.   Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption.
 
### Redis-Benchmark Examples
**Pre-test Setup**:
This will prepare the cache instance with data required for the latency and throughput testing commands listed below.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024 

**To Test Latency**:
This will test GET requests using a 1k payload.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4

**To Test throughput:**
This uses Pipelined GET requests with 1k payload.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50