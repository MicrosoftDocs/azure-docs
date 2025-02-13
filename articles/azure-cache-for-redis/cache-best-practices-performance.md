---
title: Best practices for performance testing
titleSuffix: Azure Cache for Redis
description: Learn how to test the performance of Azure Cache for Redis.


ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.date: 11/08/2024
---

# Performance testing

Testing the performance of a Redis instance can be a complicated task. The performance of a Redis instance can vary based on parameters such as the number of clients, the size of data values, and whether pipelining is being used. There also can be a tradeoff between optimizing throughput or latency.

Fortunately, several tools exist to make benchmarking Redis easier. Two of the most popular tools are **[redis-benchmark](https://redis.io/docs/management/optimization/benchmarks/)** and **[memtier-benchmark](https://github.com/redislabs/memtier_benchmark)**. This article focuses on redis-benchmark.

## How to use the redis-benchmark utility

1. Install open source Redis server to a client virtual machines (VMs) you can use for testing. The redis-benchmark utility is built into the open source Redis distribution. Follow the [Redis documentation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) for instructions on how to install the open source image.

1. The client VM used for testing should be _in the same region_ as your Azure Cache for Redis instance.

1. Make sure the client VM you use has _at least as much compute and bandwidth_ as the cache instance being tested.

1. Configure your [network isolation](cache-network-isolation.md) and [firewall](cache-configure.md#firewall) settings to ensure that the client VM is able to access your Azure Cache for Redis instance.

1. If you're using TLS/SSL on your cache instance, you need to add the `--tls` parameter to your redis-benchmark command or use a proxy like [stunnel](https://www.stunnel.org/index.html).

1. `Redis-benchmark` uses port 6379 by default. Use the `-p` parameter to override this setting. You need to do use `-p`, if you're using the SSL/TLS (port 6380) or are using the Enterprise tier (port 10000).

1. If you're using an Azure Cache for Redis instance that uses [clustering](cache-how-to-scale.md), you need to add the `--cluster` parameter to your `redis-benchmark` command. Enterprise tier caches using the Enterprise [Clustering](managed-redis/managed-redis-architecture.md#clustering) can be treated as nonclustered caches and don't need this setting.

1. Launch `redis-benchmark` from the CLI or shell of the VM. For instructions on how to configure and run the tool, see the [redis-benchmark documentation](https://redis.io/docs/management/optimization/benchmarks/) and the [redis-benchmark examples](#redis-benchmark-examples) sections.

## Benchmarking recommendations

- It's important to not only test the performance of your cache under steady state conditions. _Test under failover conditions too_, and measure the CPU/Server Load on your cache during that time. You can start a failover by [rebooting the primary node](cache-administration.md#reboot). Testing under failover conditions allows you to see the throughput and latency of your application during failover conditions. Failover can happen during updates or during an unplanned event. Ideally, you don't want to see CPU/Server Load peak to more than say 80% even during a failover as that can affect performance.

- Consider using Enterprise and Premium tier Azure Cache for Redis instances. These cache sizes have better network latency and throughput because they're running on better hardware.

- The Enterprise tier generally has the best performance, as Redis Enterprise allows the core Redis process to utilize multiple vCPUs. Tiers based on open source Redis, such as Standard and Premium, are only able to utilize one vCPU for the Redis process per shard.

- Benchmarking the Enterprise Flash tier can be difficult because some keys are stored on DRAM whiles some are stored on a NVMe flash disk. The keys on DRAM benchmark almost as fast as an Enterprise tier instance, but the keys on the NVMe flash disk are slower. Since the Enterprise Flash tier intelligently places the most-used keys into DRAM, ensure that your benchmark configuration matches the actual usage you expect. Consider using the `-r` parameter to randomize which keys are accessed.

- Using TLS/SSL decreases throughput performance, which can be seen clearly in the example benchmarking data in the following tables.

- Even though a Redis server is single-threaded, scaling up tends to improve throughput performance. System processes can use the extra vCPUs instead of sharing the vCPU being used by the Redis process. Scaling up is especially helpful on the Enterprise and Enterprise Flash tiers because Redis Enterprise isn't limited to a single thread.

- On the Premium tier, scaling out, clustering, is typically recommended before scaling up. Clustering allows Redis server to use more vCPUs by sharding data. Throughput should increase roughly linearly when adding shards in this case.

- On _C0_ and _C1_ Standard caches, while internal Defender scanning is running on the VMs, you might see short spikes in server load not caused by an increase in cache requests. You see higher latency for requests while internal Defender scans are run on these tiers a couple of times a day. Caches on the _C0_ and _C1_ tiers only have a single core to multitask, dividing the work of serving internal Defender scanning and Redis requests. You can reduce the effect by scaling to a higher tier offering with multiple CPU cores, such as _C2_.

  The increased cache size on the higher tiers helps address any latency concerns. Also, at the _C2_ level, you have support for as many as 2,000 client connections.

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

**To test throughput of a Basic, Standard, or Premium tier cache using TLS:**
Pipelined GET requests with 1k payload:

```dos
redis-benchmark -h yourcache.redis.cache.windows.net -p 6380 -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50 -c 50 --tls
```

**To test throughput of an Enterprise or Enterprise Flash cache without TLS using OSS Cluster Mode:**
Pipelined GET requests with 1k payload:

```dos
redis-benchmark -h yourcache.region.redisenterprise.cache.azure.net -p 10000 -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50 -c 50 --cluster
```

## Example performance benchmark data

The following tables show the maximum throughput values that were observed while testing various sizes of Standard, Premium, Enterprise, and Enterprise Flash caches. We used `redis-benchmark` and `memtier-benchmark` from an IaaS Azure VM against the Azure Cache for Redis endpoint. The throughput numbers are only for GET commands. Typically, SET commands have a lower throughput. These numbers are optimized for throughput. Real-world throughput under acceptable latency conditions might be lower.

>[!CAUTION]
>These values aren't guaranteed and there's no SLA for these numbers. We strongly recommend that you should [perform your own performance testing](cache-best-practices-performance.md) to determine the right cache size for your application.
>These numbers might change as we post newer results periodically.
>

>[!IMPORTANT]
>Microsoft periodically updates the underlying VM used in cache instances. This can change the performance characteristics from cache to cache and from region to region. The example benchmarking values on this page reflect older generation cache hardware in a single region. You may see better or different results in practice.
>

### [redis-benchmark](#tab/redis)

The following configuration was used to benchmark throughput for the Basic, Standard, and Premium tiers:

```dos
redis-benchmark -h yourcache.redis.cache.windows.net -a yourAccesskey -t  GET -n 1000000 -d 1024 -P 50  -c 50
```

#### Standard tier Redis benchmarks

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| GET requests per second without SSL (1-kB value size) | GET requests per second with SSL (1-kB value size) |
| --- | ---:| ---:| ---:| ---:| ---:|
| C0 | 250 MB | Shared | 100 |  15,000 |   7,500 |
| C1 |   1 GB | 1      | 500 |  38,000 |  20,720 |
| C2 | 2.5 GB | 2      | 500 |  41,000 |  37,000 |
| C3 |   6 GB | 4      | 1000 | 100,000 |  90,000 |
| C4 |  13 GB | 2      | 500 |  60,000 |  55,000 |
| C5 |  26 GB | 4      | 1,000 | 102,000 |  93,000 |
| C6 |  53 GB | 8      | 2,000 | 126,000 | 120,000 |

#### Premium tier Redis benchmarks

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| GET requests per second without SSL (1-kB value size) | GET requests per second with SSL (1-kB value size) |
| --- | ---| ---:|---:| ---:| ---:|
| P1 |   6 GB |  2 | 1,500 | 180,000 | 172,000 |
| P2 |  13 GB |  4 | 3,000 | 350,000 | 341,000 |
| P3 |  26 GB |  4 | 3,000 | 350,000 | 341,000 |
| P4 |  53 GB |  8 | 6,000 | 400,000 | 373,000 |
| P5 | 120 GB | 32 | 6,000 | 400,000 | 373,000 |

> [!IMPORTANT]
> P5 instances in the China East and China North regions use 20 cores, not 32 cores.

### [memtier-benchmark](#tab/memtier)

The following configuration was used to benchmark throughput for the Basic, Standard, and Premium tiers:

```bash
memtier_benchmark -h {your-cache-name}.{region}.redis.azure.net -p 10000 -a {your-access-key} --hide-histogram --pipeline=10 -c 50 -t 6 -d 1024 --key-maximum={number-of-keys} --key-pattern=P:P --ratio=0:1 --distinct-client-seed --randomize --test-time=600 --json-out-file=test_results.json --tls --tls-skip-verify
```

#### Standard tier memtier benchmarks

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| GET requests per second with SSL (1-kB value size) |
| --- | ---:| ---:| ---:| ---:| ---:|
| C0 | 250 MB | Shared | 100 |  7,500 |
| C1 |   1 GB | 1      | 500 | 19,700 |
| C2 | 2.5 GB | 2      | 500 |  50,000 |
| C3 |   6 GB | 4      | 1000 | 75,000 |
| C4 |  13 GB | 2      | 500 |  55,000 |
| C5 |  26 GB | 4      | 1,000 | 85,000 |
| C6 |  53 GB | 8      | 2,000 | 83,000 |

#### Premium tier memtier benchmarks

| Instance | Size | vCPUs | Expected network bandwidth (Mbps) | GET requests per second with SSL (1-kB value size) |
| --- | ---| ---:|---:| ---:| ---:|
| P1 |   6 GB |  2 | 1,500 | 182,000|
| P2 |  13 GB |  4 | 3,000 | 225,000|
| P3 |  26 GB |  4 | 3,000 | 225,000 |
| P4 |  53 GB |  8 | 6,000 | 275,000 |
| P5 | 120 GB | 32 | 6,000 | 275,000 |

> [!IMPORTANT]
> P5 instances in the China East and China North regions use 20 cores, not 32 cores.

---

### [redis-benchmark](#tab/redis)

#### Enterprise & Enterprise Flash tiers

The Enterprise and Enterprise Flash tiers offer a choice of cluster policy: _Enterprise_ and _OSS_. Enterprise cluster policy is a simpler configuration that doesn't require the client to support clustering. OSS cluster policy, on the other hand, uses the [Redis cluster protocol](https://redis.io/docs/management/scaling) to support higher throughputs. We recommend using OSS cluster policy in most cases. For more information, see [Clustering](managed-redis/managed-redis-architecture.md#clustering) . Benchmarks for both cluster policies are shown in the following tables.

The following configuration was used to benchmark throughput for the Enterprise and Enterprise flash tiers:

```dos
redis-benchmark -h yourcache.region.redisenterprise.cache.azure.net -p 10000 -a yourAccesskey -t GET -n 10000000 -d 1024 -P 50 -c 50 --threads 32
```

> [!NOTE]
> This configuration is nearly identical to the one used to benchmark the Basic, Standard, and Premium tiers. The previous configuration, however, did not fully utilize the greater compute performance of the Enterprise tiers. Additional requests and threads were added to this configuration in order to demonstrate full performance.

##### Enterprise Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without SSL (1-kB value size) | `GET` requests per second with SSL (1-kB value size) |
|:---:| --- | ---:|---:| ---:| ---:|
| E10 |  12 GB |  4 | 4,000 | 300,000 | 207,000 |
| E20 |  25 GB |  4 | 4,000 | 680,000 | 480,000 |
| E50 |  50 GB |  8 | 8,000 | 1,200,000 | 900,000 |
| E100 |  100 GB |  16 | 10,000 | 1,700,000 | 1,650,000 |
| F300 | 384 GB | 8 | 3,200 | 500,000 | 390,000 |
| F700 | 715 GB | 16 | 6,400 | 500,000 | 370,000 |
| F1500 | 1455 GB | 32 | 12,800 | 530,000 | 390,000 |

##### OSS Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without SSL (1-kB value size) | `GET` requests per second with SSL (1-kB value size) |
|:---:| --- | ---:|---:| ---:| ---:|
| E10 |  12 GB |  4 | 4,000 | 1,400,000 | 1,000,000 |
| E20 |  25 GB |  4 | 4,000 | 1,200,000 | 900,000 |
| E50 |  50 GB |  8 | 8,000 | 2,300,000 | 1,700,000 |
| E100 |  100 GB |  16 | 10,000 | 3,000,000 | 2,500,000 |
| F300 | 384 GB | 8 | 3,200 | 1,500,000 | 1,200,000 |
| F700 | 715 GB | 16 | 6,400 | 1,600,000 | 1,200,000 |
| F1500 | 1455 GB | 32 | 12,800 | 1,600,000 | 1,110,000 |

#### Enterprise & Enterprise Flash Tiers - Scaled Out

In addition to scaling up by moving to larger cache size, you can boost performance by [scaling out](cache-how-to-scale.md#how-to-scale-up-and-out---enterprise-and-enterprise-flash-tiers). In the Enterprise tiers, scaling out is called increasing the _capacity_ of the cache instance. A cache instance by default has capacity of two--meaning a primary and replica node. An Enterprise cache instance with a capacity of four indicates that the instance was scaled out by a factor of two. Scaling out provides access to more memory and vCPUs. Details on how many vCPUs are used by the core Redis process at each cache size and capacity can be found at the [Sharding configuration](managed-redis/managed-redis-architecture.md#sharding-configuration). Scaling out is most effective when using the OSS cluster policy.

The following tables show the `GET` requests per second at different capacities, using SSL and a 1-kB value size.

##### Scaling out - Enterprise cluster policy

| Instance | Capacity 2 | Capacity 4 | Capacity 6 |
|:---:| ---:| ---:| ---:|
| E10 | 200,000 | 830,000 | 930,000 |
| E20 | 480,000 | 710,000 | 950,000 |
| E50 | 900,000 | 1,110,000 | 1,200,000 |
| E100 | 1,600,000 | 1,120,000 | 1,200,000 |

| Instance | Capacity 3 | Capacity 9 |
|:---:| ---:| ---:|
| F300 | 390,000 | 640,000 |
| F700 | 370,000 | 610,000 |
| F1500 | 390,000 | 670,000 |

##### Scaling out - OSS cluster policy

| Instance | Capacity 2 | Capacity 4 | Capacity 6 |
|:---:| ---:| ---:| ---:|
| E10 | 1,000,000 | 1,900,000 | 2,500,000 |
| E20 | 900,000 | 1,700,000 | 2,300,000 |
| E50 | 1,700,000 | 3,000,000 | 3,900,000 |
| E100 | 2,500,000 | 4,400,000 | 4,900,000|

| Instance | Capacity 3 | Capacity 9 |
|:---:|:---:| ---:| ---:|
| F300 | 1,200,000 | 2,600,000 |
| F700 | 1,200,000 | 2,600,000 |
| F1500 | 1,100,000 | 2,800,000 |

### [memtier-benchmark](#tab/memtier)

The memtier benchmarks are not yet available for the Azure Cache for Redis Enterprise tiers.

---

## Next steps

- [Development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Failover and patching for Azure Cache for Redis](cache-failover.md)
