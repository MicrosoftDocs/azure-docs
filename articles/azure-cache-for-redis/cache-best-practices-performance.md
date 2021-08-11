---
title: Best practices for Performance Testing
description: Learn how to test the performance of Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
# Resilience and Performance Testing 

## Performance testing

* **Start by using `redis-benchmark.exe`** to get a feel for possible throughput/latency before writing your own perf tests.  Redis-benchmark documentation can be [found here](https://redis.io/topics/benchmarks). The `redis-benchmark.exe` doesn't support TLS. You'll have to [enable the Non-TLS port through the Portal](cache-configure.md#access-ports) before you run the test.  A windows compatible version of redis-benchmark.exe can be found [here](https://github.com/MSOpenTech/redis/releases).
* The client VM used for testing should be **in the same region** as your Redis cache instance.
* **We recommend using Dv2 VM Series** for your client as they have better hardware and will give the best results.
* Make sure the client VM you use has **at least as much compute and bandwidth* as the cache being tested.
* **Test under failover conditions** on your cache. It's important to ensure that you don't test the performance of your cache only under steady state conditions. Test under failover conditions, too, and measure the CPU/Server Load on your cache during that time. You can start a failover by [rebooting the primary node](cache-administration.md#reboot). Testing under failover conditions allows you to see how your application behaves in terms of throughput and latency during failover conditions. Failover can happen during updates and during an unplanned event. Ideally you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance.





Start by using redis-benchmark.exe to get a feel for possible throughput/latency before writing your own perf tests. See more info [here](Link to Redis-Benchmark section) 

Test under failover conditions on your cache. It's important to ensure that you don't test the performance of your cache only under steady state conditions. Test under failover conditions, too, and measure the CPU/Server Load on your cache during that time. You can start a failover by rebooting the primary node. Testing under failover conditions allows you to see how your application behaves in terms of throughput and latency during failover conditions. Failover can happen during updates and during an unplanned event. Ideally you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance. 

The client VM used for testing should be in the same region as your Redis cache instance. 

We recommend using Dv VM Series for your client as they have better hardware and will give the best results. 

Make sure the client VM you use has at least as much compute and bandwidth as the cache being tested to avoid getting bound by network limits. 

Consider using Premium tier Redis instances. These cache sizes have better network latency and throughput because they're running on better hardware for both CPU and Network. 

Note 
Our observed performance results are published here for your reference. Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption. 

* **Consider using Premium tier Redis instances**.  These cache sizes will have better network latency and throughput because they're running on better hardware for both CPU and Network.

   > [!NOTE]
   > Our observed performance results are [published here](./cache-planning-faq.yml#azure-cache-for-redis-performance) for your reference.   Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption.


## Redis-Benchmark  

Redis-benchmark is a utility that simulates running commands done by N clients at the same time sending M total queries. Complete documentation can be found here. The redis-benchmark.exe doesn't support TLS. You'll have to enable the Non-TLS port through the Portal before you run the test. A windows compatible version of redis-benchmark.exe can be found here. 

### Sample configurations:  

Pre-test setup: 
Prepare the cache instance with data required for the latency and throughput testing commands listed below. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024 
```

## To test latency: 
Test GET requests using a 1k payload. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4 
```

To test throughput: Pipelined GET requests with 1k payload. 

```
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -n 1000000 -d 1024 -P 50 -c 50 
```
### Redis-Benchmark examples

**Pre-test setup**:
Prepare the cache instance with data required for the latency and throughput testing commands listed below.
> redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024

**To test latency**:
Test GET requests using a 1k payload.
> redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4

**To test throughput:**
Pipelined GET requests with 1k payload.
> redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50

