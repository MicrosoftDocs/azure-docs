---
title: Best practices for Azure Cache for Redis
description: Learn how to use your Azure Cache for Redis effectively by following these best practices.
author: joncole

ms.service: cache
ms.topic: conceptual
ms.date: 01/06/2020
ms.author: joncole
---

# Best practices for Azure Cache for Redis 
By following these best practices, you can help maximize the performance and cost-effective use of your Azure Cache for Redis instance.

## Configuration and concepts
 * **Use Standard or Premium tier for production systems.**  The Basic tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache.  C0 caches are meant for simple dev/test scenarios since they have a shared CPU core, little memory, and are prone to "noisy neighbor" issues.

 * **Remember that Redis is an in-memory data store.**  [This article](cache-troubleshoot-data-loss.md) outlines some scenarios where data loss can occur.

 * **Develop your system such that it can handle connection blips** [because of patching and failover](cache-failover.md).

 * **Configure your [maxmemory-reserved setting](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) to improve system responsiveness** under memory pressure conditions.  A sufficient reservation setting is especially important for write-heavy workloads or if you're storing larger values (100 KB or more) in Redis. You should start with 10% of the size of your cache and increase this percentage if you have write-heavy loads.

 * **Redis works best with smaller values**, so consider chopping up bigger data into multiple keys.  In [this Redis discussion](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/), some considerations are listed that you should consider carefully.  Read [this article](cache-troubleshoot-client.md#large-request-or-response-size) for an example problem that can be caused by large values.

 * **Locate your cache instance and your application in the same region.**  Connecting to a cache in a different region can significantly increase latency and reduce reliability.  While you can connect from outside of Azure, it  not recommended *especially when using Redis as a cache*.  If you're using Redis as just a key/value store, latency may not be the primary concern. 

 * **Reuse connections.**  Creating new connections is expensive and increases latency, so reuse connections as much as possible. If you choose to create new connections, make sure to close the old connections before you release them (even in managed memory languages like .NET or Java).

 * **Configure your client library to use a *connect timeout* of at least 15 seconds**, giving the system time to connect even under higher CPU conditions.  A small connection timeout value doesn't guarantee that the connection is established in that time frame.  If something goes wrong (high client CPU, high server CPU, and so on), then a short connection timeout value will cause the connection attempt to fail. This behavior often makes a bad situation worse.  Instead of helping, shorter timeouts aggravate the problem by forcing the system to restart the process of trying to reconnect, which can lead to a *connect -> fail -> retry* loop. We generally recommend that you leave your connection Timeout at 15 seconds or higher. It's better to let your connection attempt succeed after 15 or 20 seconds than to have it fail quickly only to retry. Such a retry loop can cause your outage to last longer than if you let the system just take longer initially.  
     > [!NOTE]
     > This guidance is specific to the *connection attempt* and not related to the time you're willing to wait for an *operation* like GET or SET to complete.
 
 * **Avoid expensive operations** - Some Redis operations, like the [KEYS](https://redis.io/commands/keys) command, are *very* expensive and should be avoided.  For more information, see some considerations around [long-running commands](cache-troubleshoot-server.md#long-running-commands)

 * **Use TLS encryption** - Azure Cache for Redis requires TLS encrypted communications by default.  TLS versions 1.0, 1.1 and 1.2 are currently supported.  However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible.  If your client library or tool doesn't support TLS, then enabling unencrypted connections can be done [through the Azure portal](cache-configure.md#access-ports) or [management APIs](https://docs.microsoft.com/rest/api/redis/redis/update).  In such cases where encrypted connections aren't possible, placing your cache and client application into a virtual network would be recommended.  For more information about which ports are used in the virtual network cache scenario, see this [table](cache-how-to-premium-vnet.md#outbound-port-requirements).
 
 * **Idle Timeout** - Azure Redis currently has 10 minute idle timeout for connections, so this should be set to less than 10 minutes.
 
## Memory management
There are several things related to memory usage within your Redis server instance that you may want to consider.  Here are a few:

 * **Choose an [eviction policy](https://redis.io/topics/lru-cache) that works for your application.**  The default policy for Azure Redis is *volatile-lru*, which means that only keys that have a TTL value set will be eligible for eviction.  If no keys have a TTL value, then the system won't evict any keys.  If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the *allkeys-lru* policy.

 * **Set an expiration value on your keys.**  An expiration will remove keys proactively instead of waiting until there's memory pressure.  When eviction does kick in because of memory pressure, it can cause additional load on your server.  For more information, see the documentation for the [EXPIRE](https://redis.io/commands/expire) and [EXPIREAT](https://redis.io/commands/expireat) commands.
 
## Client library specific guidance
 * [StackExchange.Redis (.NET)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-stackexchange-redis-md)
 * [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
 * [Lettuce (Java)](https://gist.github.com/warrenzhu25/181ccac7fa70411f7eb72aff23aa8a6a#file-azure-redis-lettuce-best-practices-md)
 * [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
 * [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
 * [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
 * [Asp.Net Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)


## When is it safe to retry?
Unfortunately, there's no easy answer.  Each application needs to decide what operations can be retried and which can't.  Each operation has different requirements and inter-key dependencies.  Here are some things you might consider:

 * You can get client-side errors even though Redis successfully ran the command you asked it to run.  For example:
	 - Timeouts are a client-side concept.  If the operation reached the server, the server will run the command even if the client gives up waiting.  
	 - When an error occurs on the socket connection, it's not possible to know  if the operation actually ran on the server.  For example, the connection error can happen after the server processed the request but before the client receives the response.
 *  How does my application react if I accidentally run the same operation twice?  For instance, what if I increment an integer twice instead of once?  Is my application writing to the same key from multiple places?  What if my retry logic overwrites a value set by some other part of my app?

If you would like to test how your code works under error conditions, consider using the [Reboot feature](cache-administration.md#reboot). Rebooting allows you to see how connection blips affect your application.

## Performance testing
 * **Start by using `redis-benchmark.exe`** to get a feel for possible throughput/latency before writing your own perf tests.  Redis-benchmark documentation can be [found here](https://redis.io/topics/benchmarks).  Note that redis-benchmark doesn't support TLS, so you'll have to [enable the Non-TLS port through the Portal](cache-configure.md#access-ports) before you run the test.  [A windows compatible version of redis-benchmark.exe can be found here](https://github.com/MSOpenTech/redis/releases)
 * The client VM used for testing should be **in the same region** as your Redis cache instance.
 * **We recommend using Dv2 VM Series** for your client as they have better hardware and will give the best results.
 * Make sure the client VM you use has **at least as much compute and bandwidth* as the cache being tested. 
 * **Enable VRSS** on the client machine if you are on Windows.  [See here for details](https://technet.microsoft.com/library/dn383582(v=ws.11).aspx).  Example powershell script:
     >PowerShell -ExecutionPolicy Unrestricted Enable-NetAdapterRSS -Name (    Get-NetAdapter).Name 
     
 * **Consider using Premium tier Redis instances**.  These cache sizes will have better network latency and throughput because they're running on better hardware for both CPU and Network.
 
     > [!NOTE]
     > Our observed performance results are [published here](cache-faq.md#azure-cache-for-redis-performance) for your reference.   Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption.
 
### Redis-Benchmark examples
**Pre-test setup**:
Prepare the cache instance with data required for the latency and throughput testing commands listed below.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024 

**To test latency**:
Test GET requests using a 1k payload.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4

**To test throughput:**
Pipelined GET requests with 1k payload.
> redis-benchmark.exe -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50
