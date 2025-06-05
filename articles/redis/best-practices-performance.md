---
title: Best practices for performance testing for Azure Managed Redis
description: Learn how to test the performance of Azure Managed Redis.
ms.date: 05/18/2025
ms.service: azure-managed-redis
ms.topic: conceptual
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Performance testing with Azure Managed Redis

Testing the performance of a Redis instance can be a complicated task. The performance of a Redis instance can vary based on parameters such as the number of clients, the size of data values, and whether pipelining is being used. There also can be a tradeoff between optimizing throughput or latency.

Fortunately, several tools exist to make benchmarking Redis easier. Two of the most popular tools are **[redis-benchmark](https://redis.io/docs/management/optimization/benchmarks/)** and **[memtier-benchmark](https://github.com/redislabs/memtier_benchmark)**. This article focuses on memtier_benchmark, often called _memtier_.

## How to use the memtier_benchmark utility

1. Install memtier on a client virtual machines (VMs) you can use for testing. Follow the [Memtier documentation](https://github.com/RedisLabs/memtier_benchmark) for instructions on how to install the open source image.

1. The client virtual machine (VM) used for testing should be _in the same region_ as your Azure Managed Redis (AMR) instance.

1. Make sure the client VM you use has _at least as much compute and bandwidth_ as the cache instance being tested.

1. Configure your [network isolation](private-link.md) and VM firewall settings to ensure that the client VM is able to access your Azure Managed Redis instance.

1. If you're using TLS/SSL on your cache instance, you need to add the `--tls` and `--tls-skip-verify` parameters to your memtier_benchmark command.

1. `memtier_benchmark` uses port 6379 by default. Use the `-p 10000` parameter to override this setting, as AMR uses port 10000 instead.

1. For all Azure Managed Redis instances using the OSS cluster policy, you need to add the `--cluster-mode` parameter to your memtier command. AMR instances using the [Enterprise cluster policy](architecture.md#clustering) can be treated as nonclustered caches and don't need this setting.

1. Launch `memtier_benchmark` from the CLI or shell of the VM. For instructions on how to configure and run the tool, see the [Memtier documentation](https://github.com/RedisLabs/memtier_benchmark).

## Benchmarking recommendations

- If you're not getting the performance you need, try scaling up to a more advanced tier. The Balanced tier typically has twice as many vCPUs as the Memory Optimized tier, and the Compute Optimized tier typically has twice as many vCPUs as the Balanced tier. Because Azure Managed Redis is built on Redis Enterprise rather than community Redis, the core Redis process is able to utilize multiple vCPUs. As a result, instances with more vCPUs have significantly better throughput performance.
  
- Scaling up to larger memory sizes also adds more vCPUs, increasing performance. However, scaling up to larger memory sizes is typically less effective than using a more performant tier. See [Tiers and SKUs at a glance](how-to-scale.md#tiers-and-skus-at-glance) for a detailed breakdown of the vCPUs available for each size and tier.

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
>This example uses the `--tls`, `--tls-skip-verify`, and `--cluster-mode` flags. You don't need these if you're using Azure Managed Redis in non-TLS mode or if you're using the [Enterprise cluster policy](architecture.md#cluster-policies), respectively.

**To test throughput:**
This command tests pipelined GET requests with 1k payload. Use this command to test how much read throughput to expect from your cache instance. This example assumes you're using TLS and the OSS cluster policy. The `--key-pattern=R:R` parameter ensures that keys are randomly accessed, increasing the realism of the benchmark. This test runs for five minutes.

```bash
memtier_benchmark -h {your-cache-name}.{region}.redis.azure.net -p 10000 -a {your-access-key} --hide-histogram --pipeline=10 -clients=50 -threads=6 -d 1024 --key-maximum=1699396 --key-pattern=R:R --ratio=0:1 --distinct-client-seed --test-time=300 --json-out-file=test_results.json --tls --tls-skip-verify --cluster-mode
```

## Example performance benchmark data

The table below shows optimal throughput that we observed while testing various sizes of Azure Managed Redis instances with a workload of all read commands and 1KB payload. The workload is same across all SKUs, except for the connection count (that is, different thread and client count as required by memtier_benchmark). The connection count is chosen per SKU to leverage the Azure Managed Redis instance optimally. We used `memtier_benchmark` from an IaaS Azure VM against the Azure Managed Redis endpoint, utilizing the memtier commands shown in the [memtier_benchmark examples](best-practices-performance.md#memtier_benchmark-examples) section. The throughput numbers are only for GET commands. Typically, SET commands have a lower throughput. Real-world performance varies based on Redis configuration and commands. These numbers are provided as a point of reference, not a guarantee.

>[!CAUTION]
>These values aren't guaranteed and there's no SLA for these numbers. We strongly recommend that you should [perform your own performance testing](best-practices-performance.md) to determine the right cache size for your application.
>Performance could vary for various reasons like different connection count, payload size, commands that are executed etc.
>

>[!IMPORTANT]
>Microsoft periodically updates the underlying VM used in cache instances. This can change the performance characteristics from cache to cache and from region to region. The example benchmarking values on this page reflect a particular generation cache hardware in a single region. You may see different results in practice, especially with network bandwidth.
>

Azure Managed Redis offers a choice of cluster policy: _Enterprise_ and _OSS_. Enterprise cluster policy is a simpler configuration that doesn't require the client to support clustering. OSS cluster policy, on the other hand, uses the [Redis cluster protocol](https://redis.io/docs/management/scaling) to support higher throughput. We recommend using OSS cluster policy in most cases, especially when you require high performance. For more information, see [Clustering](architecture.md#clustering).


| Size in GB | Memory Optimized | Balanced| Compute Optimized| 
|--|--|--|--|
|0.5| - | 120,000| - |
|1| - | 120,000| - | 
|3| - | 230,000| 480,000 |
|6| - | 230,000| 480,000 |
|12| 230,000 | 480,000| 810,000 |
|24| 480,000 | 810,000| 1,600,000 |
|60| 810,000 | 1,500,000| 2,000,000 |
|120| 1,500,000 | 2,000,000| 2,900,000 |

The following table lists the connection count in terms of memtier_benchmark thread count, client count that was used to produce the throughput numbers. As mentioned above, changing the connection count could result in varying performance.

| Size in GB | Clients/Threads/Connection Count for Memory Optimized | Clients/Threads/Connection Count for Balanced| Clients/Threads/Connection Count for Compute Optimized| 
|--|--|--|--|
| 0.5 | - | 10/4/40 | - |
| 1 | - | 10/4/40 | - |
| 3 | - | 10/4/40 | 10/8/80 |
| 6 | - | 10/4/40 | 10/8/80 |
| 12 | 10/4/40 | 10/8/80 | 10/16/160 |
| 24 | 10/8/80 | 10/16/160 | 20/16/320 |
| 60 | 10/16/160| 20/16/320 | 20/32/640 |
| 120 | 20/16/320 | 20/32/640 | 20/64/1280 |

## Next steps

- [Development](best-practices-development.md)
- [Azure Cache for Redis development FAQs](development-faq.yml)
- [Failover and patching for Azure Cache for Redis](failover.md)
