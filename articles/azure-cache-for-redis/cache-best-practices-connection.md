---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
# Best Practice Draft

## Connection resilience 

### Retry commands

Configure your client connections to retry commands with exponential backoff. For more information, see [retry guidelines](https://docs.microsoft.com/azure/architecture/best-practices/retry-service-specific#azure-cache-for-redis) 

### Test resiliency

Test your system's resiliency to connection breaks using a [reboot]( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-administration#reboot) to simulate a patch. See [Resilience and Performance testing][Link to “Resilience and Performance testing” section from below] 

### Configure appropriate timeouts

Configure your client library to use Connect Timeout of 10 to 15 seconds and a Command Timeout of 5 seconds. Connect Timeout is the time for which your client will wait to establish a connection with Redis server. Most client libraries have another timeout configuration for command timeouts which is the time for which the client waits for a response from Redis server. Some libraries have the commands timeout set to 5 seconds by default, but you can consider setting it to a lower or higher value depending on your scenario and key sizes. If the command timeout is too small, the connection may look unstable, while if the command timeout is too large, your application will have to wait for a long time to find out if the command is going to timeout or not.

### Conscious connection recreation

In case of transient connection blips, ensure that you client library is not creating new connections for every retry and that there are no connection leaks in case your application recreates connections as Azure Cache For Redis limits number of client connections per cache SKU. Apart from reaching the client connections limit, it will also result in high server load and cause lot of other important operations to fail. If using StackExchange.Redis client library, set `abortConnect` to `false` in your connection string and we recommend letting the ConnectionMultiplexer handle reconnection. 

### Advance maintenance notification

Use notifications to learn of upcoming maintenance. For more information, see [notified]( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-failover#can-i-be-notified-in-advance-of-a-planned-maintenance).

### Schedule maintenance window

[Schedule updates]( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-administration#schedule-updates) for a maintenance window to reduce impact on your system.

### More design patterns for resilience

Apply [recommended design patterns]( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-failover#how-do-i-make-my-application-resilient) for resiliency.

### Idle Timeout

Azure Cache for Redis currently has 10-minute idle timeout for connections, so your setting should be to less than 10 minutes. Most common client libraries have a configuration setting that allows client libraries to send Redis PING commands to a Redis server automatically and periodically. However, when using client libraries without this type of setting, customer applications themselves are responsible for keeping the connection alive 

### Client specific best practices
See [client specific best practices](Link to client specific best practices section).
<!-- Why is this not in development? -->
  
## Server Load Management

### Key size
Should I use small key/values or large key/values? It depends on the scenario. If your scenario requires larger keys, you can adjust the Connection Timeout and Command timeouts, then retry values and adjust your retry logic. From a Redis server perspective, smaller values give better performance. We recommend keeping key size smaller than 100kB. If you do need to store larger values in Redis; you must be aware of that latencies will be higher and you should consider setting higher ConnectionTimeout. We recommend setting it to 15 seconds. Large keys should also be avoided to protect the Redis Server memory becoming too fragmented on key evictions. 

### Avoid client connections spike
Creating and closing connections is an expensive operation for Redis server. Creating or closing too many connections in a small amount of time could burden the Redis server. If you are instantiating many client instances to connect to redis at once, consider staggering the new connection creations to avoid a steep spike in the number of connected clients. 

### Memory pressure
High memory usage on the server side may cause means the system may page data to disk resulting in page faults which causes the system to slow down significantly. 

##Avoid long running command
Because Redis is a single-threaded server side system, the time needed to run some more time expensive commands may cause some latency or timeouts on client side, as server can be busy dealing with these expensive commands. See Troubleshoot Azure Cache for Redis server-side issues | Microsoft Docs 

### Monitor Server Load
Add monitoring on Server Load to ensure you get notifications when instances of high server load occur. This can help you understand your application constraints well and work proactively to mitigate issues. We recommend trying to keep server load under 80% to avoid performance impact. 

### Plan for server maintenance
Ensure you have enough server capacity to handle your peak load while undergoing server maintenance. Test your system by rebooting nodes while under peak load. See ( https://docs.microsoft.com/azure/azure-cache-for-redis/cache-administration#reboot) to simulate a patch 

 
## Memory management 

### Eviction policy
Choose an eviction policy that works for your application. The default policy for Azure Redis is volatile-lru, which means that only keys that have a TTL value set will be eligible for eviction. If no keys have a TTL value, then the system won't evict any keys. If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the allkeys-lru policy. 

### Key expiration
Set an expiration value on your keys. An expiration will remove keys proactively instead of waiting until there's memory pressure. When eviction does kick in because of memory pressure, it can cause more load on your server. For more information, see the documentation for the EXPIRE and EXPIREAT commands. 

### Minimize memory fragmentation
Large keys can leave memory fragmented on eviction and could lead to high memory usage and server load. 

### Monitor memory usage 
Add monitoring on memory usage to ensure you do not run out of memory and have the chance to scale your cache before seeing issues. 

### Configure your maxmemory-reserved setting to improve system responsiveness

- The maxmemory-reserved setting configures the amount of memory, in MB per instance in a cluster, that is reserved for non-cache operations, such as replication during failover. Setting this value allows you to have a more consistent Redis server experience when your load varies. This value should be set higher for workloads that write large amounts of data. When memory is reserved for such operations, it's unavailable for storage of cached data. 

- The maxfragmentationmemory-reserved setting configures the amount of memory, in MB per instance in a cluster, that is reserved to accommodate for memory fragmentation. When you set this value, you to have a more consistent Redis server experience when the cache is full or close to full and the fragmentation ratio is high. When memory is reserved for such operations, it's unavailable for storage of cached data. 

- One thing to consider when choosing a new memory reservation value (maxmemory-reserved or maxfragmentationmemory-reserved) is how this change might affect a cache that is already running with large amounts of data in it. For instance, if you have a 53-GB cache with 49 GB of data, then change the reservation value to 8 GB, this change will drop the max available memory for the system down to 45 GB. If either your current used_memory or your used_memory_rss values are higher than the new limit of 45 GB, then the system will have to evict data until both used_memory and used_memory_rss are below 45 GB. Eviction can increase server load and memory fragmentation. For more information on cache metrics such as used_memory and used_memory_rss, see Available metrics and reporting intervals. 

## Development

### Consider smaller keys
Redis works best with smaller values, so consider dividing bigger data to spread over multiple keys. In this Redis discussion, some considerations are listed that you should consider carefully. Read this article for an example problem that can be caused by large values. 

Understand key distributio
### If you are planning to use Redis clustering, See redis clustering best practices with keys. 

### Use pipelining
Try to choose a Redis client that supports Redis pipelining. Pipelining helps make efficient use of the network and get the best throughput possible. 

### Avoid expensive operations
Some Redis operations, like the KEYS command, are very expensive and should be avoided. For more information, see some considerations around long-running commands  

### Choose tier appropriately
Conduct performance testing to choose the right tier and validate connection settings. See [Resilience and performance testing](Link to testing section) 

### Client in same region as cache
Ideally, client applications should be hosted in the same region as the cache. 

## Scaling

### Scaling under load
While scaling a cache under load, configure your maxmemory-reserved setting to improve system responsiveness 

### Scaling clusters
Consider reducing data as much as you can in the cache before scaling your clustered cache in or out. This will ensure that smaller amounts of data have to be moved thus improving the reliability of the scale operation. 

### Scale before the server load is too high

Start scaling before the server load or memory gets too high. If it is too high, that means redis-server is busy and will not have enough resources to perform scaling and data redistribution 

Some cache sizes are hosted on VMs with four or more cores. Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs. See here for details around VM sizes and cores 

See [when to scale](Link to when to scale) for more guidance on when to scale. 

## Kubernetes-hosted client applications 

When you have multiple pods connecting to redis server, ensure that the new connections from the pods are created in a staggered manner. If multiple pods start up in a short duration of time, it would cause a sudden spike in the number of client connections created which in turn leads to high server load on redis server and timeouts. 

The same scenario should be avoided when shutting down multiple pods at the same time. This would cause a steep dip in the number of connections which leads to CPU pressure. 

Ensure that the Kubernetes node which is going to host the pod which will connect to Redis has sufficient memory, CPU and network bandwidth.  

Beware of the noisy neighbor problem. Your pod running redis client can be affected by other pods running on the same node and throttle redis connections or IO operations. 

## Resilience and Performance Testing 

Start by using redis-benchmark.exe to get a feel for possible throughput/latency before writing your own perf tests. See more info [here](Link to Redis-Benchmark section) 

Test under failover conditions on your cache. It's important to ensure that you don't test the performance of your cache only under steady state conditions. Test under failover conditions, too, and measure the CPU/Server Load on your cache during that time. You can start a failover by rebooting the primary node. Testing under failover conditions allows you to see how your application behaves in terms of throughput and latency during failover conditions. Failover can happen during updates and during an unplanned event. Ideally you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance. 

The client VM used for testing should be in the same region as your Redis cache instance. 

We recommend using Dv VM Series for your client as they have better hardware and will give the best results. 

Make sure the client VM you use has at least as much compute and bandwidth as the cache being tested to avoid getting bound by network limits. 

Consider using Premium tier Redis instances. These cache sizes have better network latency and throughput because they're running on better hardware for both CPU and Network. 

Note 
Our observed performance results are published here for your reference. Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption. 


### Redis-Benchmark  

Redis-benchmark is a utility that simulates running commands done by N clients at the same time sending M total queries. Complete documentation can be found here. The redis-benchmark.exe doesn't support TLS. You'll have to enable the Non-TLS port through the Portal before you run the test. A windows compatible version of redis-benchmark.exe can be found here. 

#### Sample configurations:  

Pre-test setup: 
Prepare the cache instance with data required for the latency and throughput testing commands listed below. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024 
```

### To test latency: 
Test GET requests using a 1k payload. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4 
```

To test throughput: Pipelined GET requests with 1k payload. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -n 1000000 -d 1024 -P 50 -c 50 
```

Client library specific guidance
<!-- Will these require links --> 
- StackExchange.Redis (.NET)
- Java - Which client should I use?
- Lettuce (Java)
- Jedis (Java)
- Node.js
- PHP
- HiRedisCluster
- ASP.NET Session State Provider

<!-- 

TODO section
< not sure yet if we need these sections yet> 

### Threadpool configuration 

configure your ThreadPool Settings to make sure that your thread pool scales up quickly under burst scenarios. 

### RedisSessionStateProvider 

If you're using RedisSessionStateProvider, ensure you have set the retry timeout correctly. retryTimeoutInMilliseconds should be higher than operationTimeoutInMilliseconds, otherwise no retries occur.  

-->