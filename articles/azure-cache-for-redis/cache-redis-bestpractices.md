---
title: Azure Cache for Redis Best Practices | Microsoft Docs
description: Jon Cole's gist of best practices
services: cache
documentationcenter: ''
author: v-stepbe-ms
manager: yegu
editor: ''

ms.assetid: 
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: 
ms.date: 04/23/2019
ms.author: v-stepbe
ms.custom: mvc

#Customer intent: Best practices for using Azure Cache for Redis.

---
# Best Practices for Azure Redis

The suggested Best Practices below are based on the experience gained investigating issues for hundreds of Azure Redis customers.

## Configuration and Concepts

 1. **Use Standard or Premium Tier for Production systems, with at least a C1 cache.**  The Basic Tier is a single node system with no data replication and no SLA.  C0 caches are really meant for simple dev/test scenarios; they have a shared CPU core, very little memory, are prone to "noisy neighbor", etc.
 2. **Remember that Redis is an In-Memory data store.**  Be aware of [scenarios where data loss can occur](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md).
 3. **Configure your client library to use a "connect timeout" of at least 10 to 15 seconds.** This gives the system time to connect even under higher CPU conditions.  If your client or server tend to be under high load, use an even larger value. If you use a large number of connections in a single application, consider adding some type of staggered reconnect logic to prevent a flood of connections hitting the server at the same time.
 4. **Develop your system such that it can handle connection blips** [due to patching and failover](https://gist.github.com/JonCole/317fe03805d5802e31cfa37e646e419d#file-azureredis-patchingexplained-md).
 5. **Configure your [maxmemory-reserved setting](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#maxmemory-policy-and-maxmemory-reserved) to improve system responsiveness** under memory pressure conditions, especially for write-heavy workloads or if you are storing larger values (100KB or more) in Redis.  I would recommend starting with 10% of the size of your cache, then increase if you have write-heavy loads. See [some considerations](https://gist.github.com/JonCole/9225f783a40564c9879d#considerations-for-memory-reservations) when selecting a value.
 6. **Redis works best with smaller values**, so consider chopping up bigger data into multiple keys.  In [this Redis discussion](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/), some considerations are listed that you should consider carefully.  Read [this article](https://gist.github.com/JonCole/db0e90bedeb3fc4823c2#large-requestresponse-size) for an example problem that can be caused by large values.
 7. **Locate your cache instance and your application in the same region.**  Connecting to a cache in a different region can significantly increase latency and reduce reliability.  Connecting from outside of Azure is supported, but not recommended *especially when using Redis as a cache* (as opposed to a key/value store where latency may not be the primary concern). 
 8. **Reuse connections** - Creating new connections is expensive and increases latency, so reuse connections as much as possible. If you choose to create new connections, make sure to close the old connections before you release them (even in managed memory languages like .NET or Java).
 9. **Avoid Expensive Commands** - Some redis operations, like the "KEYS" command, are VERY expensive and should be avoided.  [Read more here](https://gist.github.com/JonCole/9225f783a40564c9879d#running-expensive-operationsscripts)

## Memory Management

There are several things related to memory usage within your Redis server instance that you may want to consider.  Here are a few:

 1. **Choose an [eviction policy](https://redis.io/topics/lru-cache) that works for your application.**  The default policy for Azure Redis is *volitile-lru*, which means that only keys that have an expiration value configured will be considered for eviction.  If no keys have an expiration value, then the system won't evict any keys and clients will get out of memory errors when trying to write to Redis.  If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the *allkeys-lru* policy.
 2. **Set an expiration value on your keys.**  This will help expire keys proactively instead of waiting until there is memory pressure.  Evictions due to memory pressure can cause additional load on your server, so it is always best to stay ahead of the curve whenever possible.  See the [Expire](https://redis.io/commands/expire) and [ExpireAt](https://redis.io/commands/expireat) commands for more details.

## Client Library Specific Guidance

1. [StackExchange.Redis (.NET)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-stackexchange-redis-md)
2. [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
3. [Lettuce (Java)](https://gist.github.com/warrenzhu25/181ccac7fa70411f7eb72aff23aa8a6a#file-azure-redis-lettuce-best-practices-md)
3. [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
4. [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
5. [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
6. [Asp.Net Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)


## When is it safe to retry?

Unfortunately, there is no easy answer.  Each application needs to decide what operations can be retried and which cannot because each has different requirements and inter-key dependencies.  Things you should consider:

 1. You can get client-side errors even though Redis successfully ran the command you asked it to run.  For example:
	 - Timeouts are a client-side concept.  If the operation reached the server, the server will run the command even if the client gives up waiting.  
	 - When an error occurs on the socket connection, it is indeterminate whether or not the operation ran on the server.  For example, the connection error could happen after the request was processed by the server but before the response was received by the client.
 2.  How does my application react if I accidentally run the same operation twice?  For instance, what if I increment an integer twice instead of just once?  Is my application writing to the same key from multiple places?  What if my retry logic overwrites a value set by some other part of my app?

If you would like to test how your code works under error conditions, one options would be to use the [Reboot Feature](https://docs.microsoft.com/en-us/azure/redis-cache/cache-administration#reboot) as a way to trigger such connection blips, then see how your application reacts.

## Performance Testing

 1. **Start by using `redis-benchmark.exe`** to get a feel for possible throughput/latency before writing your own perf tests.  Redis-benchmark documentation can be found here http://redis.io/topics/benchmarks.  Note that redis-benchmark does not support SSL, so you will have to [enable the Non-SSL port through the Azure Portal](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#access-ports) before you run the test.  [A windows compatible version of redis-benchmark.exe can be found here](https://github.com/MSOpenTech/redis/releases)
 2. The client VM used for testing should be **in the same region** as your Redis cache instance.
 3. **We recommend using Dv2 VM Series** for your client as they have better hardware and will give the best results.
 4. Make sure your client VM you choose has **at least as much computing and bandwidth capability** as the cache you are testing. 
 5. **Enable VRSS** on the client machine if you are on Windows.  [See here for details](https://technet.microsoft.com/en-us/library/dn383582(v=ws.11).aspx).  Example powershell script:
 >PowerShell -ExecutionPolicy Unrestricted Enable-NetAdapterRSS -Name (Get-NetAdapter).Name 
 
 6. **Premium tier Redis instances** will have better network latency and throughput because they are running on better hardware for both CPU and Network.
 
 `Note:` Our observed performance results are [published here](https://azure.microsoft.com/en-us/documentation/articles/cache-faq/#azure-redis-cache-performance) for your reference.   Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if  you are using transport encryption.
 
### Redis-Benchmark Examples

**Setup** the cache:
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024 

**Test Latency** for GET requests using a 1k payload:
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4

**Test throughput** you are able to get using Pipelined GET requests with 1k payload.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50