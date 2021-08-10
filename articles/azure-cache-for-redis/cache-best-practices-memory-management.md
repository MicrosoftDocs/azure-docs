---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
# Memory management 

## Eviction policy
Choose an eviction policy that works for your application. The default policy for Azure Redis is volatile-lru, which means that only keys that have a TTL value set will be eligible for eviction. If no keys have a TTL value, then the system won't evict any keys. If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the allkeys-lru policy. 

## Key expiration
Set an expiration value on your keys. An expiration will remove keys proactively instead of waiting until there's memory pressure. When eviction does kick in because of memory pressure, it can cause more load on your server. For more information, see the documentation for the EXPIRE and EXPIREAT commands. 

## Minimize memory fragmentation
Large keys can leave memory fragmented on eviction and could lead to high memory usage and server load. 

## Monitor memory usage 
Add monitoring on memory usage to ensure you do not run out of memory and have the chance to scale your cache before seeing issues. 

## Configure your maxmemory-reserved setting to improve system responsiveness

- The maxmemory-reserved setting configures the amount of memory, in MB per instance in a cluster, that is reserved for non-cache operations, such as replication during failover. Setting this value allows you to have a more consistent Redis server experience when your load varies. This value should be set higher for workloads that write large amounts of data. When memory is reserved for such operations, it's unavailable for storage of cached data. 

- The maxfragmentationmemory-reserved setting configures the amount of memory, in MB per instance in a cluster, that is reserved to accommodate for memory fragmentation. When you set this value, you to have a more consistent Redis server experience when the cache is full or close to full and the fragmentation ratio is high. When memory is reserved for such operations, it's unavailable for storage of cached data. 

- One thing to consider when choosing a new memory reservation value (maxmemory-reserved or maxfragmentationmemory-reserved) is how this change might affect a cache that is already running with large amounts of data in it. For instance, if you have a 53-GB cache with 49 GB of data, then change the reservation value to 8 GB, this change will drop the max available memory for the system down to 45 GB. If either your current used_memory or your used_memory_rss values are higher than the new limit of 45 GB, then the system will have to evict data until both used_memory and used_memory_rss are below 45 GB. Eviction can increase server load and memory fragmentation. For more information on cache metrics such as used_memory and used_memory_rss, see Available metrics and reporting intervals. 

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