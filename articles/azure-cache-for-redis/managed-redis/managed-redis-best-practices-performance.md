---
title: Best practices for performance testing for Azure Managed Redis (preview)
description: Learn how to test the performance of Azure Managed Redis (preview).

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Performance testing with Azure Managed Redis (preview)

Testing the performance of a Redis instance can be a complicated task. The performance of a Redis instance can vary based on parameters such as the number of clients, the size of data values, and whether pipelining is being used. There also can be a tradeoff between optimizing throughput or latency.

Fortunately, several tools exist to make benchmarking Redis easier. Two of the most popular tools are **[redis-benchmark](https://redis.io/docs/management/optimization/benchmarks/)** and **[memtier-benchmark](https://github.com/redislabs/memtier_benchmark)**. This article focuses on memtier_benchmark, often called _memtier_.

## How to use the memtier_benchmark utility

1. Install memtier on a client virtual machines (VMs) you can use for testing. Follow the [Memtier documentation](https://github.com/RedisLabs/memtier_benchmark) for instructions on how to install the open source image.

1. The client virtual machine (VM) used for testing should be _in the same region_ as your Azure Managed Redis (AMR) instance.

1. Make sure the client VM you use has _at least as much compute and bandwidth_ as the cache instance being tested.

1. Configure your [network isolation](managed-redis-private-link.md) and VM firewall settings to ensure that the client VM is able to access your Azure Managed Redis instance.

1. If you're using TLS/SSL on your cache instance, you need to add the `--tls` and `--tls-skip-verify` parameters to your memtier_benchmark command.

1. `memtier_benchmark` uses port 6379 by default. Use the `-p 10000` parameter to override this setting, as AMR uses port 10000 instead.

1. For all Azure Managed Redis instances using the OSS cluster policy, you need to add the `--cluster-mode` parameter to your memtier command. AMR instances using the [Enterprise cluster policy](managed-redis-architecture.md#clustering) can be treated as nonclustered caches and don't need this setting.

1. Launch `memtier_benchmark` from the CLI or shell of the VM. For instructions on how to configure and run the tool, see the [Memtier documentation](https://github.com/RedisLabs/memtier_benchmark).

## Benchmarking recommendations

- If you're not getting the performance you need, try scaling up to a more advanced tier. The Balanced tier typically has twice as many vCPUs as the Memory Optimized tier, and the Compute Optimized tier typically has twice as many vCPUs as the Balanced tier. Because Azure Managed Redis is built on Redis Enterprise rather than community Redis, the core Redis process is able to utilize multiple vCPUs. As a result, instances with more vCPUs have significantly better throughput performance.
  
- Scaling up to larger memory sizes also adds more vCPUs, increasing performance. However, scaling up to larger memory sizes is typically less effective than using a more performant tier. See [Tiers and SKUs at a glance](managed-redis-how-to-scale.md#tiers-and-skus-at-glance) for a detailed breakdown of the vCPUs available for each size and tier.

- Benchmarking the Flash Optimized tier can be difficult because some keys are stored on DRAM whiles some are stored on a NVMe flash disk. The keys on DRAM benchmark almost as fast as other Azure Managed Redis instances, but the keys on the NVMe flash disk are slower. Since the Flash Optimized tier intelligently places the most-used keys into DRAM, ensure that your benchmark configuration matches the actual usage you expect.

- Using TLS/SSL decreases throughput performance, but is highly recommended as a production best practice.
  
- It's essential to first fill up the Redis instance with data before benchmarking. Benchmarking on an empty cache produces much better results than you would see in practice.

- The number of connections used has a significant effect on the benchmark. Using too many connections starts to degrade the performance of the cache. Using too few connections doesn't demonstrate the full performance of the cache. We recommended configuring the number of connections based on your actual application needs. You determine the total number of connections by multiplying the number of clients by the number of threads.

- The pipeline configuration has a significant effect on the performance testing. If you set the pipeline setting to be larger, you see more throughput, but worse latency. For more information, see [pipelining](https://redis.io/docs/latest/develop/use/pipelining/).

## memtier_benchmark examples

> [!NOTE]
> This example shows benchmarking on a Compute Optimized X3 instance using the OSS cluster policy and TLS.
>

**Pre-test setup**:
Prepare the cache instance with data required for the testing. Loading the instance with data ensures that the results more accurately reflect real-world conditions. The `{number-of-keys}` parameter should be determined by the size of your AMR instance and the size of each key. A good rule of thumb is to fill up the instance roughly 75% full, accounting for buffers. You can use this formula: `numberOfKeysToSet = (<TotalCacheSizeInBytes> * 0.75) / (1024 + 300)`. For example, if you're benchmarking on a Compute Optimized X3 instance, using 1,024-byte key sizes, as shown previously, that implies `{number-of-keys} = (3 * 1000000000 * 0.75) / (1024 + 300)`. The result equals approximately 1,699,396 keys.

```bash
memtier_benchmark -h {your-cache-name}.{region}.redis.azure.net -p 10000 -a {your-access-key} --hide-histogram --pipeline=10 -clients=50 -threads=6 --key-maximum=1699396 -n allkeys --key-pattern=P:P --ratio=1:0 -data-size=1024 --tls --cluster-mode
```

>[!NOTE]
>This example uses the `--tls`, `--tls-skip-verify`, and `--cluster-mode` flags. You do not need these if you're using Azure Managed Redis in non-TLS mode or if you're using the [Enterprise cluster policy](managed-redis-architecture.md#cluster-policies), respectively.

**To test throughput:**
This command tests pipelined GET requests with 1k payload. Use this command to test how much read throughput to expect from your cache instance. This example assumes you're using TLS and the OSS cluster policy. The `--key-pattern=R:R` parameter ensures that keys are randomly accessed, increasing the realism of the benchmark. This test runs for five minutes.

```bash
memtier_benchmark -h {your-cache-name}.{region}.redis.azure.net -p 10000 -a {your-access-key} --hide-histogram --pipeline=10 -clients=50 -threads=6 -d 1024 --key-maximum=1699396 --key-pattern=R:R --ratio=0:1 --distinct-client-seed --test-time=300 --json-out-file=test_results.json --tls --tls-skip-verify --cluster-mode
```

## Example performance benchmark data

The following tables show the maximum throughput values that were observed while testing various sizes of Azure Managed Redis instances. We used `memtier_benchmark` from an IaaS Azure VM against the Azure Managed Redis endpoint, utilizing the memtier commands shown in the [memtier_benchmark examples](managed-redis-best-practices-performance.md#memtier_benchmark-examples) section. The throughput numbers are only for GET commands. Typically, SET commands have a lower throughput. Real-world performance varies based on Redis configuration and commands. These numbers are provided as a point of reference, not a guarantee.

>[!CAUTION]
>These values aren't guaranteed and there's no SLA for these numbers. We strongly recommend that you should [perform your own performance testing](managed-redis-best-practices-performance.md) to determine the right cache size for your application.
>These numbers might change as we post newer results periodically.
>

>[!IMPORTANT]
>Microsoft periodically updates the underlying VM used in cache instances. This can change the performance characteristics from cache to cache and from region to region. The example benchmarking values on this page reflect older generation cache hardware in a single region. You may see better or different results in practice, especially with network bandwidth.
>

Azure Managed Redis offers a choice of cluster policy: _Enterprise_ and _OSS_. Enterprise cluster policy is a simpler configuration that doesn't require the client to support clustering. OSS cluster policy, on the other hand, uses the [Redis cluster protocol](https://redis.io/docs/management/scaling) to support higher throughput. We recommend using OSS cluster policy in most cases. For more information, see [Clustering](managed-redis-architecture.md#clustering).

Benchmarks for both cluster policies are shown in the following tables. For the OSS cluster policy table, two benchmarking configurations are provided:

- 300 connections (50 clients and 6 threads)
- 2,500 connections (50 clients and 50 threads)

The second benchmarks are provided because 300 connections aren't enough to fully demonstrate the performance of the larger cache instances.

The following are throughput in GET operations per second on 1 kB payload for AMR instances along the number of client connections used for benchmarking. All numbers were computed for AMR instances with SSL connections and the network bandwidth is recorded in Mbps.

### [300 connections](#tab/50threads6clients)

#### OSS Cluster Policy

| Size in GB | vCPU/Network BW/Memory Optimized | vCPU/Network BW/Balanced| vCPU/Network BW/Compute Optimized|
|--|--|--|--|
| 1 | - | 2/5,000/103,500 | - |
| 3 | - | 2/2,000/104,500 | 4/10,000/221,100 |
| 6 | - | 2/2,000/106,500 | 4/10,000/210,850 |
| 12 | 2/2,000/106,000 | 4/4,000/223,900 | 8/12,500/499,900 |
| 24 | 4/4,000/227,800 | 8/8,000/495,300 | 16/12,500/485,920 |
| 60 | 8/8,000/496,000 | 16/10,000/476,500 | 32/16,000/454,200 |
| 120 | 16/10,000/476,200 | 32/16,000/462,200 | 64/28,000/463,800 |

#### Enterprise Cluster Policy

| Size in GB | vCPU/Network BW/Memory Optimized | vCPU/Network BW/Balanced | vCPU/Network BW/Compute Optimized |
|--|--|--|--|
| 1 | - | 2/5,000/56,900 | - |
| 3 | - | 2/2,000/56,900 | 4/10,000/118,900 |
| 6 | - | 2/2,000/59,200 | 4/10,000/111,950 |
| 12 | 2/2,000/55,800 | 4/4,000/118,500 | 8/12,500/206,500 |
| 24 | 4/4,000/122,000 | 8/8,000/205,500 | 16/12,500/294,700 |
| 60 | 8/8,000/208,100 | 16/10,000/293,400 | 32/16,000/441,400 |
| 120 | 16/10,000/285,600 | 32/16,000/451,700 | 64/28,000/516,200 |

### [2,500 connections](#tab/50threads50clients)

#### OSS Cluster Policy

| Size in GB | vCPU/Network BW/Memory Optimized | vCPU/Network BW/Balanced | vCPU/Network BW/Compute Optimized |
|--|--|--|--|
| 24 | 4/4,000/226,600 | 8/8,000/492,200 | 16/12,500/874,100 |
| 60 | 8/8,000/492,200 | 16/10,000/874,100 | 32/16,000/1,100,100 |
| 120 | 16/10,000/874,100 | 32/16,000/1,100,100 | 64/28,000/2,400,300 |

<!--  

### Memory Optimized Tier

#### OSS Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| M10 |  12 GB |  2 | 2,000 | TBD | TBD |
| M20 |  24 GB |  4 | 4,000 | TBD | TBD |
| M50 |  60 GB |  8 | 8,000 | TBD | TBD |
| M100 |  120 GB |  16 | 10,000 | TBD | TBD |
| M150 | 180 GB | 24 | 24,000 | TBD | TBD |
| M250 | 240 GB | 32 | 16,000 | TBD | TBD |
| M350 | 360 GB | 48 | 24,000 | TBD | TBD |
| M500 | 480 GB | 64 | 32,000 | TBD | TBD |
| M700 | 720 GB | 96 | 32,000 | TBD | TBD |
| M1000 | 960 GB | 128 | 64,000 | TBD | TBD |
| M1500 | 1440 GB | 192 | 96,000 | TBD | TBD |
| M2000 | 1920 GB | 256 | 128,000 | TBD | TBD |

#### Enterprise Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| M10 |  12 GB |  2 | 2,000 | TBD | TBD |
| M20 |  24 GB |  4 | 4,000 | TBD | TBD |
| M50 |  60 GB |  8 | 8,000 | TBD | TBD |
| M100 |  120 GB |  16 | 10,000 | TBD | TBD |
| M150 | 180 GB | 24 | 8,000 | TBD | TBD |
| M250 | 240 GB | 32 | 16,000 | TBD | TBD |
| M350 | 360 GB | 48 | 24,000 | TBD | TBD |
| M500 | 480 GB | 64 | 32,000 | TBD | TBD |
| M700 | 720 GB | 96 | 32,000 | TBD | TBD |
| M1000 | 960 GB | 128 | 32,000 | TBD | TBD |
| M1500 | 1440 GB | 192 | 32,000 | TBD | TBD |
| M2000 | 1920 GB | 256 | 32,000 | TBD | TBD |

### Balanced (Compute + Memory) Tier

#### OSS Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| B0 |  500 MB |  2 | 5,000 | TBD | TBD |
| B1 |  1 GB |  2 | 5,000 | TBD | TBD |
| B3 |  3 GB |  2 | 2,000 | TBD | TBD |
| B5 |  6 GB |  2 | 2,000 | TBD | TBD |
| B10 |  12 GB |  4 | 4,000 | TBD | TBD |
| B20 |  24 GB |  8 | 8,000 | TBD | TBD |
| B50 |  60 GB |  16 | 10,000 | TBD | TBD |
| B100 |  120 GB |  32 | 16,000 | TBD | TBD |
| B150 | 180 GB | 48 | 24,000 | TBD | TBD |
| B250 | 240 GB | 64 | 32,000 | TBD | TBD |
| B350 | 360 GB | 96 | 40,000 | TBD | TBD |
| B500 | 480 GB | 128 | 64,000 | TBD | TBD |
| B700 | 720 GB | 192 | 80,000 | TBD | TBD |
| B1000 | 960 GB | 256 | 128,000 | TBD | TBD |

#### Enterprise Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| B0 |  500 MB |  2 | 5,000 | TBD | TBD |
| B1 |  1 GB |  2 | 5,000 | TBD | TBD |
| B3 |  3 GB |  2 | 2,000 | TBD | TBD |
| B5 |  6 GB |  2 | 2,000 | TBD | TBD |
| B10 |  12 GB |  4 | 4,000 | TBD | TBD |
| B20 |  24 GB |  8 | 8,000 | TBD | TBD |
| B50 |  60 GB |  16 | 10,000 | TBD | TBD |
| B100 |  120 GB |  32 | 16,000 | TBD | TBD |
| B150 | 180 GB | 48 | 24,000 | TBD | TBD |
| B250 | 240 GB | 64 | 32,000 | TBD | TBD |
| B350 | 360 GB | 96 | 40,000 | TBD | TBD |
| B500 | 480 GB | 128 | 32,000 | TBD | TBD |
| B700 | 720 GB | 192 | 40,000 | TBD | TBD |
| B1000 | 960 GB | 256 | 32,000 | TBD | TBD |

### Compute Optimized Tier

#### OSS Cluster Policy

| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| X3 |  3 GB |  4 | 10,000 | TBD | TBD |
| X5 |  6 GB |  4 | 10,000 | TBD | TBD |
| X10 |  12 GB |  8 | 12,500 | TBD | TBD |
| X20 |  24 GB |  16 | 12,500 | TBD | TBD |
| X50 |  60 GB |  32 | 16,000 | TBD | TBD |
| X100 |  120 GB |  64 | 28,000 | TBD | TBD |
| X150 | 180 GB | 96 | 35,000 | TBD | TBD |
| X250 | 240 GB | 128 | 56,000 | TBD | TBD |
| X350 | 360 GB | 192 | 70,000 | TBD | TBD |
| X500 | 480 GB | 256 | 112,000 | TBD | TBD |
| X700 | 720 GB | 320 | 140,000 | TBD | TBD |

#### Enterprise Cluster Policy
| Instance | Size | vCPUs | Expected network bandwidth (Mbps)| `GET` requests per second without TLS (1-kB value size) | `GET` requests per second with TLS (1-kB value size) |
|:---:| :--- | ---:|---:| ---:| ---:|
| X3 |  3 GB |  4 | 10,000 | TBD | TBD |
| X5 |  6 GB |  4 | 10,000 | TBD | TBD |
| X10 |  12 GB |  8 | 12,500 | TBD | TBD |
| X20 |  24 GB |  16 | 12,500 | TBD | TBD |
| X50 |  60 GB |  32 | 16,000 | TBD | TBD |
| X100 |  120 GB |  64 | 28,000 | TBD | TBD |
| X150 | 180 GB | 96 | 35,000 | TBD | TBD |
| X250 | 240 GB | 128 | 28,000 | TBD | TBD |
| X350 | 360 GB | 192 | 35,000 | TBD | TBD |
| X500 | 480 GB | 256 | 28,000 | TBD | TBD |
| X700 | 720 GB | 320 | 35,000 | TBD | TBD |
-->
## Next steps

- [Development](managed-redis-best-practices-development.md)
- [Azure Cache for Redis development FAQs](managed-redis-development-faq.yml)
- [Failover and patching for Azure Cache for Redis](managed-redis-failover.md)
