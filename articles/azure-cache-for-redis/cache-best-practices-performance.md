---
title: Best practices for performance testing
titleSuffix: Azure Cache for Redis
description: Learn how to test the performance of Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 08/25/2021
ms.author: franlanglois
---

# Performance testing

1. Start by using `redis-benchmark.exe` to check the general throughput and latency characteristics of your cache before writing your own performance tests. For more information, see [Redis-Benchmark](#redis-benchmark-utility).

1. The client VM used for testing should be *in the same region* as your Redis cache instance.

1. Make sure the client VM you use has *at least as much compute and bandwidth* as the cache being tested.

1. It's important that you don't test the performance of your cache only under steady state conditions. *Test under failover conditions too*, and measure the CPU/Server Load on your cache during that time. You can start a failover by [rebooting the primary node](cache-administration.md#reboot). Testing under failover conditions allows you to see the throughput and latency of your application during failover conditions. Failover can happen during updates or during an unplanned event. Ideally you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance.

1. Consider using Premium tier Azure Cache for Redis instances. These cache sizes have better network latency and throughput because they're running on better hardware for both CPU and network.

   > [!NOTE]
   > Our observed performance results are [published here](./cache-planning-faq.yml#azure-cache-for-redis-performance) for your reference. Also, be aware that SSL/TLS adds some overhead, so you may get different latencies and/or throughput if you're using transport encryption.

## Redis-benchmark utility

**Redis-benchmark** documentation can be [found here](https://redis.io/docs/reference/optimization/benchmarks/).

The `redis-benchmark.exe` doesn't support TLS. You'll have to [enable the Non-TLS port through the Portal](cache-configure.md#access-ports) before you run the test. A Windows-compatible version of redis-benchmark.exe can be found [here](https://github.com/MSOpenTech/redis/releases).

## Redis-benchmark examples

**Pre-test setup**:
Prepare the cache instance with data required for the latency and throughput testing:

```dos
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t SET -n 10 -d 1024
```

**To test latency**:
Test GET requests using a 1k payload:

```dos
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t GET -d 1024 -P 50 -c 4
```

**To test throughput:**
Pipelined GET requests with 1k payload:

```dos
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50
```

## Next steps

- [Development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Failover and patching for Azure Cache for Redis](cache-failover.md)
