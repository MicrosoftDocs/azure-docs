---
title: Azure Managed Redis Architecture
description: Learn how Azure Managed Redis is architected
ms.date: 12/08/2025
ms.topic: article
ai-usage: ai-assisted
ms.custom:
  - ignite-2024
  - build-2025

appliesto:
  - ✅ Azure Managed Redis
---

# Azure Managed Redis architecture

Azure Managed Redis runs on the [Redis Enterprise](https://redis.io/technology/advantages/) stack, which provides significant advantages over the community edition of Redis. The following information provides greater detail about how Azure Managed Redis is architected, including information that can be useful to power users.

## Comparison with Azure Cache for Redis

The Basic, Standard, and Premium tiers of Azure Cache for Redis run on the community edition of Redis. This community edition of Redis has several significant limitations, including being single-threaded. This limitation reduces performance significantly and makes scaling less efficient because the service doesn't fully utilize more vCPUs. A typical Azure Cache for Redis instance uses an architecture like this:

:::image type="content" source="media/architecture/cache-architecture.png" alt-text="Diagram showing the architecture of the Azure Cache for Redis offering.":::

Notice that two VMs are used - a primary and a replica. These VMs are also called nodes. The primary node holds the main Redis process and accepts all writes. Replication is conducted asynchronously to the replica node to provide a back-up copy during maintenance, scaling, or unexpected failure. Each node can only run a single Redis server process due to the single-threaded design of community Redis.

## Architectural improvements of Azure Managed Redis

Azure Managed Redis uses a more advanced architecture that looks something like this:

:::image type="content" source="media/architecture/managed-redis-architecture.png" alt-text="Diagram showing the architecture of the Azure Managed Redis offering.":::

There are several differences:

- Each virtual machine (or node) runs multiple Redis server processes (called shards) in parallel. Multiple shards allow for more efficient utilization of vCPUs on each virtual machine and higher performance.
- Not all of the primary Redis shards are on the same VM/node. Instead, primary and replica shards are distributed across both nodes. Because primary shards use more CPU resources than replica shards, this approach enables more primary shards to run in parallel.
- Each node has a [high-performance proxy](https://redis.io/blog/redis-enterprise-proxy/) process to manage the shards, handle connection management, and trigger self-healing.

This architecture enables both higher performance and advanced features like [active geo-replication](how-to-active-geo-replication.md).

## Clustering

Each Azure Managed Redis instance is internally configured to use clustering, across all tiers and SKUs. Azure Managed Redis is based on Redis Enterprise, which can use multiple shards per node. That capability includes smaller instances that are only set up to use a single shard. Clustering is a way to divide the data in the Redis instance across the multiple Redis processes, also called sharding. Azure Managed Redis offers three [cluster policies](#cluster-policies) that determine which protocol is available to Redis clients for connecting to the cache instance.

### Cluster policies

Azure Managed Redis offers three clustering policies: _OSS_, _Enterprise_, and Non-Clustered. The _OSS_ cluster policy is good for most applications because it supports higher maximum throughput, but each version has its own advantages and disadvantages.

- If you're moving from a Basic, Standard, or Premium nonclustered topology, consider using OSS clustering to improve performance. Use nonclustered configurations only if your application can't support either OSS or Enterprise topologies. The **OSS clustering policy** implements the same API as Redis open-source software. The [Redis Cluster API](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) allows the Redis client to connect directly to shards on each Redis node, minimizing latency and optimizing network throughput. Throughput scales near-linearly as the number of shards and vCPUs increases. The OSS clustering policy generally offers the lowest latency and best throughput performance. However, the OSS cluster policy requires your client library to support the Redis Cluster API. Today, almost all Redis clients support the Redis Cluster API, but compatibility might be an issue for older client versions or specialized libraries.

You can't use OSS clustering policy with the [RediSearch module](redis-modules.md).

The OSS clustering protocol requires the client to make the correct shard connections. The initial connection is through port 10000. Connecting to individual nodes uses ports in the 85XX range. The 85xx ports can change over time, and you shouldn't hardcode them into your application. Redis clients that support clustering use the [CLUSTER NODES](https://redis.io/commands/cluster-nodes/) command to determine the exact ports used for the primary and replica shards and make the shard connections for you.

The **Enterprise clustering policy** is a simpler configuration that uses a single endpoint for all client connections. When you use the Enterprise clustering policy, it routes all requests to a single Redis node that acts as a proxy. This node internally routes requests to the correct node in the cluster. The advantage of this approach is that it makes Azure Managed Redis look non-clustered to users. That means that Redis client libraries don't need to support Redis Clustering to gain some of the performance advantages of Redis Enterprise. Using a single endpoint boosts backward compatibility and makes connection simpler. The downside is that the single node proxy can be a bottleneck in either compute utilization or network throughput.

The Enterprise clustering policy is the only one that you can use with the [RediSearch module](redis-modules.md). While the Enterprise cluster policy makes an Azure Managed Redis instance appear to be non-clustered to users, it still has some limitations with [Multi-key commands](#multi-key-commands).

The **Non-Clustered** clustering policy stores data on each node without sharding. It applies only to caches sized 25 GB and smaller. Scenarios for using Nonclustered clustering policy include:

- When migrating from a Redis environment that's nonsharded. For example, the nonsharded topologies of Basic, Standard, and Premium SKUs of Azure Cache for Redis.
- When running cross slot commands extensively and dividing data into shards would cause failures. For example, the MULTI commands.
- When using Redis as message broker and doesn't need sharding.

The considerations for using Nonclustered policy are:

- This policy only applies to Azure Managed Redis tiers that are less than or equal to 25 GB.
- It's not as performant as other clustering policies, because CPUs can only multithread with Redis Enterprise software when the cache is sharded.
- If you want to scale up your Azure Managed Redis cache, you must first change the cluster policy.
- If you're moving from a Basic, Standard, or Premium nonclustered topology, consider using OSS clusters to improve performance. Use nonclustered configurations only if your application can't support either OSS or Enterprise topologies.

### Scaling out or adding nodes

The core Redis Enterprise software scales up by using larger VMs or scales out by adding more nodes or VMs. Both scaling options add more memory, more vCPUs, and more shards. Because of this redundancy, Azure Managed Redis doesn't provide the ability to control the specific number of nodes used in each configuration. This implementation detail is abstracted to avoid confusion, complexity, and suboptimal configurations. Instead, each SKU is designed with a node configuration that maximizes vCPUs and memory. Some SKUs of Azure Managed Redis use two nodes, while others use more.
  
### Multi-key commands

Because Azure Managed Redis instances use a clustered configuration, you might see `CROSSSLOT` exceptions on commands that operate on multiple keys. Behavior varies depending on the clustering policy used. If you use the OSS clustering policy, all keys in multikey commands must map to [the same hash slot](https://docs.redis.com/latest/rs/databases/configure/oss-cluster-api/#multi-key-command-support).

You might also see `CROSSSLOT` errors with Enterprise clustering policy. Only the following multikey commands are allowed across slots with Enterprise clustering: `DEL`, `MSET`, `MGET`, `EXISTS`, `UNLINK`, and `TOUCH`.

In Active-Active databases, multikey write commands (`DEL`, `MSET`, `UNLINK`) can only run on keys that are in the same slot. However, the following multikey commands are allowed across slots in Active-Active databases: `MGET`, `EXISTS`, and `TOUCH`. For more information, see [Database clustering](https://docs.redis.com/latest/rs/databases/durability-ha/clustering/#multikey-operations).

### Sharding configuration

Each SKU of Azure Managed Redis runs a specific number of Redis server processes, called _shards_, in parallel. The relationship between throughput performance, the number of shards, and number of vCPUs available on each instance is complex. You can't manually change the number of shards.

For a given memory size, the Memory Optimized version has the least number of vCPUs and shards, while the Compute Optimized version has the highest.

Increasing the number of shards generally increases performance as Redis operations can run in parallel. But, if no vCPUs are available to execute commands, performance can drop.

Shards are mapped to optimize the usage of each vCPU while reserving vCPU cycles for the Redis server process, management agent, and OS system tasks that also affect performance. The client applications you create interact with Azure Managed Redis as if it's a single logical database. The service handles routing across the vCPUs and shards.

To increase the number of shards in a SKU, use a larger tier in that SKU. You can also change the SKUs to match your performance needs.

The following table shows the ratio of vCPUs to primary shards at a given tier size. The data in the columns doesn't represent a guarantee that this is the number of vCPUs or shards. The tables are for illustration only.

> [!NOTE]
> Azure Managed Redis optimizes performance over time by changing the number of shards and vCPUs used on each SKU.
>

#### Memory optimized, Balanced, and Compute optimized versions

This table shows a general example of the relationship of _Size_ to _vCPUs/primary shards_.

| Tiers     | Memory Optimized     | Balanced             | Compute Optimized    |
|:---------:|:--------------------:|:--------------------:|:--------------------:|
| Size (GB) | vCPUs/primary shards | vCPUs/primary shards | vCPUs/primary shards |
| 24 ¹      | 4/2                  | 8/6                  | 16/12                |
| 60 ¹      | 8/6                  | 16/12                | 32/24                |

¹ The ratio of vCPUs to primary shards at a given tier size doesn't represent a guarantee for the SKU or tier.

#### Flash optimized version

This table shows a general example of the relationship of _Size_ to _vCPUs/primary shards_.

| Tiers     | Flash Optimized (preview) |
|:---------:|:-------------------------:|
| Size (GB) | vCPUs/primary shards      |
| 480 ¹ ²    | 16/12                |
| 720 ¹ ²    | 24/24                |

¹ These tiers are in public preview.

² The ratio of vCPUs to primary shards at a given tier size doesn't represent a guarantee for the SKU or tier.

[!INCLUDE [tier-preview](includes/tier-preview.md)]

## Running without high availability mode enabled

You can run without high availability (HA) mode enabled. This configuration means that your Redis instance doesn't have replication enabled and doesn't have access to the availability SLA. Don't run in non-HA mode outside of development and test scenarios. You can't disable high availability in an instance that you already created. You can enable high availability in an instance that doesn't have it. Because an instance running without high availability uses fewer VMs and nodes, vCPUs aren't used as efficiently, so performance might be lower.

## Reserved memory

On each Azure Managed Redis Instance, approximately 20% of the available memory is reserved as a buffer for noncache operations, such as replication during failover and active geo-replication buffer. This buffer helps improve cache performance and prevent memory starvation.

## Scaling down

Scaling down isn't currently supported on Azure Managed Redis. For more information, see [Limitations of scaling Azure Managed Redis](how-to-scale.md#limitations-of-scaling-azure-managed-redis).

## Flash Optimized tier

The Flash Optimized tier utilizes both NVMe Flash storage and RAM. Because Flash storage is lower cost, using the Flash Optimized tier allows you to trade off some performance for price efficiency.

On Flash Optimized instances, 20% of the cache space is on RAM, while the other 80% uses Flash storage. All of the _keys_ are stored on RAM, while the _values_ can be stored either in Flash storage or RAM. The Redis software intelligently determines the location of the values. _Hot_ values that are accessed frequently are stored on RAM, while _Cold_ values that are less commonly used are kept on Flash. Before data is read or written, it must be moved to RAM, becoming _Hot_ data.

Because Redis optimizes for the best performance, the instance first fills up the available RAM before adding items to Flash storage. Filling RAM first has a few implications for performance:

- Better performance and lower latency can occur when testing with low memory usage. Testing with a full cache instance can yield lower performance because only RAM is used in the low memory usage testing phase.
- As you write more data to the cache, the proportion of data in RAM compared to Flash storage decreases, typically causing latency and throughput performance to decrease as well.

### Workloads well-suited for the Flash Optimized tier

Workloads that run well on the Flash Optimized tier often have the following characteristics:

- Read heavy, with a high ratio of read commands to write commands.
- Access focused on a subset of keys that you use much more frequently than the rest of the dataset.
- Relatively large values in comparison to key names. (Because key names are always stored in RAM, large values can become a bottleneck for memory growth.)

### Workloads that aren't well-suited for the Flash Optimized tier

Some workloads have access characteristics that are less optimized for the design of the Flash Optimized tier:

- Write heavy workloads.
- Random or uniform data access patterns across most of the dataset.
- Long key names with relatively small value sizes.

## Related content

- [Scale an Azure Managed Redis instance](how-to-scale.md)
