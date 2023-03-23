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

Testing the performance of a Redis instance can be a complicated task. The performance of a Redis instance can vary significantly based on parameters such as the number of clients, the size of data values, and whether pipelining is being used. There also can be a tradeoff between optimizing throughput or latency.

Fortunately, several tools exist to make benchmarking Redis easier. Two of the most popular tools are **[redis-benchmark](https://redis.io/docs/management/optimization/benchmarks/)** and **[memtier-benchmark](https://github.com/redislabs/memtier_benchmark)**. This article focuses on redis-benchmark.

## How to use the redis-benchmark utility

1. Install open source Redis server to a client VM you can use for testing. The redis-benchmark utility is built into the open source Redis distribution. Follow the [Redis documention](https://redis.io/docs/getting-started/#install-redis) for instructions on how to install the open source image.

1. The client VM used for testing should be *in the same region* as your Azure Cache for Redis instance.

1. Make sure the client VM you use has *at least as much compute and bandwidth* as the cache instance being tested.

1. Configure your [network isolation](cache-network-isolation.md) and [firewall](cache-configure.md#firewall) settings to ensure that the client VM is able to access your Azure Cache for Redis instance. 

1. If you're using TLS/SSL on your cache instance, you'll need to add the `--tls` parameter to your redis-benchmark command or use a proxy like [stunnel](https://www.stunnel.org/index.html). 

1. Note that redis-benchmark uses port 6379 by default. Use the `-p` parameter to override this setting. You'll need to do this, for example, if you're using the SSL/TLS (port 6380), are using clustering on the Premium tier (ports 13000 or 15000), or are using the Enterprise tier (port 10000). 

1. If you're using an Azure Cache for Redis instance that uses [clustering](cache-how-to-scale.md), you'll need to add the `--cluster` parameter to your redis-benchmark command. Note that Enterprise tier caches using the [Enterprise clustering policy](cache-best-practices-enterprise-tiers.md#clustering-on-enterprise.md) can be treated as non-clustered caches and do not need this setting. 

1. Launch redis-benchmark from the CLI or shell of the VM. For instructions on how to configure and run the tool, see the [redis-benchmark documentation](https://redis.io/docs/management/optimization/benchmarks/) and the [redis-benchmark examples](#redis-benchmark-examples) section below. 

## Benchmarking recommendations

- It's important to not only test the performance of your cache under steady state conditions. *Test under failover conditions too*, and measure the CPU/Server Load on your cache during that time. You can start a failover by [rebooting the primary node](cache-administration.md#reboot). Testing under failover conditions allows you to see the throughput and latency of your application during failover conditions. Failover can happen during updates or during an unplanned event. Ideally, you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance.

- Consider using Enterprise and Premium tier Azure Cache for Redis instances. These cache sizes have better network latency and throughput because they're running on better hardware.

- The Enterprise tier generally has the best performance, as Redis Enterprise allows multiple vCPUs to be utilized by a single cache instance. Tiers based on open source Redis, such as Standard and Premium, are only able to utilize one vCPU for the Redis process per shard.

- Benchmarking the Enterprise Flash tier can be difficult because some keys are stored on DRAM and some on NVMe flash disk. The keys on DRAM will benchmark virtually as fast as an Enterprise tier instance, but the keys on NVMe flash disk will be slower. Since the Enterprise Flash tier will intelligently place the most-used keys into DRAM, ensure that your benchmark configuration matches the actual usage you expect. Consider using the `-r` parameter to randomize which keys are accessed. 

- 
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
## Example performance benchmarks

The following tables show the maximum throughput values that were observed while testing various sizes of Standard, Premium, Enterprise, and Enterprise Flash caches. We used `redis-benchmark.exe` from an IaaS VM against the Azure Cache for Redis endpoint. For TLS throughput, redis-benchmark is used with *stunnel* to connect to the Azure Cache for Redis endpoint.
          
>[!CAUTION] 
>These values aren't guaranteed and there's no SLA for these numbers. We strongly recommend that you should [perform your own performance testing](cache-best-practices-performance.md) to determine the right cache size for your application.
>These numbers might change as we post newer results periodically.
>
          
From this table, we can draw the following conclusions:
          
* Throughput numbers are for GETS.
* Throughput for the caches that are the same size is higher in the Premium tier as compared to the Standard tier. For example, with a 6 GB Cache, throughput of P1 is 180,000 requests per second (RPS) as compared to 100,000 RPS for C3.
* With Redis clustering, throughput increases linearly as you increase the number of shards (nodes) in the cluster. For example, if you create a P4 cluster of 10 shards, then the available throughput is 400,000 * 10 = 4 million RPS.
* Throughput for bigger key sizes is higher in the Premium tier as compared to the Standard Tier.
          
| Pricing tier | Size | CPU cores | Available bandwidth | 1-KB value size | 1-KB value size |
| --- | --- | --- | --- | --- | --- |
| **Standard cache sizes** | | |**Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**GET Requests per second Non-SSL** |**GET Requests per second SSL** |
| C0 | 250 MB | Shared | 100 / 12.5  |  15,000 |   7,500 |
| C1 |   1 GB | 1      | 500 / 62.5  |  38,000 |  20,720 |
| C2 | 2.5 GB | 2      | 500 / 62.5  |  41,000 |  37,000 |
| C3 |   6 GB | 4      | 1000 / 125  | 100,000 |  90,000 |
| C4 |  13 GB | 2      | 500 / 62.5  |  60,000 |  55,000 |
| C5 |  26 GB | 4      | 1,000 / 125 | 102,000 |  93,000 |
| C6 |  53 GB | 8      | 2,000 / 250 | 126,000 | 120,000 |
| **Premium cache sizes** | |**CPU cores per shard** | **Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**GET Requests per second Non-SSL, per shard** |**GET Requests per second SSL, per shard** |
| P1 |   6 GB |  2 | 1,500 / 187.5 | 180,000 | 172,000 |
| P2 |  13 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P3 |  26 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P4 |  53 GB |  8 | 6,000 / 750   | 400,000 | 373,000 |
| P5 | 120 GB | 32 | 6,000 / 750   | 400,000 | 373,000 |
          
> [!Important]
> P5 instances in the China East and China North regions use 20 cores, not 32 cores. 
          
For instructions on setting up stunnel or downloading the Redis tools such as `redis-benchmark.exe`, see [How can I run Redis commands?](cache-development-faq.yml#how-can-i-run-redis-commands-).
          
## Next steps

- [Development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Failover and patching for Azure Cache for Redis](cache-failover.md)
