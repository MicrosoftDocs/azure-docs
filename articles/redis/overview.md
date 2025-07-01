---
title: What is Azure Managed Redis?
description: Learn about Azure Managed Redis to enable cache-aside, content caching, user session caching, job and message queuing, and distributed transactions.
ms.date: 05/18/2025
ms.service: azure-managed-redis
ms.topic: how-to
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# What is Azure Managed Redis?

Azure Managed Redis provides an in-memory data store based on the [Redis Enterprise](https://redis.io/about/redis-enterprise/) software. Redis Enterprise improves the performance and reliability of the community edition of Redis, while maintaining compatibility. Microsoft operates the service, hosted on Azure, and usable by any application within or outside of Azure.
For more information on how Azure Managed Redis is built, see [Azure Managed Redis Architecture](architecture.md).

> [!NOTE]
> Azure Managed Redis is Generally Available (GA) as a product. However, certain features remain in Public Preview.
>
> - Scaling a cache
> - Data persistence
> - Non-clustered caches

Azure Managed Redis can improve the performance and scalability of an application that heavily uses backend data stores. It's able to process large volumes of application requests by keeping frequently accessed data in the server memory, which can be written to and read from quickly.

Redis brings a critical low-latency and high-throughput data storage solution to modern applications. Additionally, Redis is increasingly used for noncaching applications, including data ingestion, deduplication, messaging, leaderboards, [semantic caching](tutorial-semantic-cache.md), and as a [vector database](overview-vector-similarity.md).

Azure Managed Redis can be deployed standalone, or deployed along with other Azure app or database services, such as Azure Container Apps, Azure App Service, Azure Functions, Azure SQL, or Azure Cosmos DB.

## Key scenarios

Azure Managed Redis improves application performance by supporting common application architecture patterns. Some of the most common include the following patterns:

| Pattern      | Description                                        |
| ------------ | -------------------------------------------------- |
| Data cache | Databases are often too large to load directly into a cache. It's common to use the [cache-aside](/azure/architecture/patterns/cache-aside) pattern to load data into the cache only as needed. When the system makes changes to the data, the system can also update the cache, which is then distributed to other clients. Additionally, the system can set an expiration on data, or use an eviction policy to trigger data updates into the cache.|
| Content cache | Many web pages are generated from templates that use static content such as headers, footers, banners. These static items shouldn't change often. Using an in-memory cache provides quick access to static content compared to backend datastores. This pattern reduces processing time and server load, allowing web servers to be more responsive. It can allow you to reduce the number of servers needed to handle loads. Azure Managed Redis provides the Redis Output Cache Provider to support this pattern with ASP.NET.|
| Session store | This pattern is commonly used with shopping carts and other user history data that a web application might associate with user cookies. Storing too much in a cookie can have a negative effect on performance as the cookie size grows and is passed and validated with every request. A typical solution uses the cookie as a key to query the data in a database. When you use an in-memory cache, like Azure Managed Redis, to associate information with a user is faster than interacting with a full relational database. |
| [Vector similarity search](overview-vector-similarity.md) | A common AI use-case is to generate vector embeddings using a large language model (LLM). These vector embeddings need to be stored in a vector database and then compared to determine similarity. Azure Managed Redis has built-in functionality to both store and compare vector embeddings at high throughputs.|
| [Semantic caching](tutorial-semantic-cache.md) | Using LLMs often introduces a high amount of latency (due to generation time) and cost (due to per token pricing) to an application. Caching can help solve these problems by storing the past output of an LLM so that it can quickly be retrieved again. However, because LLMs use natural language, storage can be difficult for typical caches to handle. Semantic caches like Azure Managed Redis are capable of caching not just a specific query, but the semantic meaning of a query, allowing it to be used much more naturally with LLMs.|
| [Deduplication](https://redis.io/solutions/deduplication/) | Often, you need to determine if an action already happened in a system, such as determining if a username is taken or if a customer was already sent an email. In Azure Managed Redis, bloom filters can rapidly determine duplicates, and prevent problems. |
| Leaderboards | Redis offers simple and powerful support for developing leaderboards of all kinds using the [sorted set](https://redis.io/solutions/leaderboards/) data structure. Additionally, using [active geo-replication](how-to-active-geo-replication.md) can allow one leaderboard to be shared globally. |
| Job and message queuing | Applications often add tasks to a queue when the operations associated with the request take time to execute. Longer running operations are queued to be processed in sequence, often by another server. This method of deferring work is called task queuing. Azure Managed Redis provides a distributed queue to enable this pattern in your application.|
| [PowerBI/Analytics Acceleration](https://techcommunity.microsoft.com/blog/analyticsonazure/how-to-use-redis-as-a-data-source-for-power-bi-with-redis-sql-odbc/3799471) | You can use the Redis ODBC driver to utilize Redis for BI, reporting, and analytics use-cases. Because Redis is typically much faster than relational databases, using Redis in this way can dramatically increase query responsiveness. |
| Distributed transactions | Applications sometimes require a series of commands against a backend data-store to execute as a single atomic operation. All commands must succeed, or all must be rolled back to the initial state. Azure Managed Redis supports executing a batch of commands as a single [transaction](https://redis.io/topics/transactions). |

## Redis version

Azure Managed Redis supports Redis version 7.4.x. For more information, see [How to upgrade the version of your Azure Managed Redis instance](how-to-upgrade.md).

## Choosing the right tier

There are four tiers of Azure Managed Redis available, each with different performance characteristics and price levels.

Three tiers are for in-memory data:

[!INCLUDE [tier-preview](includes/tier-preview.md)]

- **Memory Optimized** Ideal for memory-intensive use cases that require a high memory-to-vCPU ratio (8:1) but don't need the highest throughput performance. It provides a lower price point for scenarios where less processing power or throughput is necessary, making it an excellent choice for development and testing environments.
- **Balanced (Memory + Compute)** Offers a balanced memory-to-vCPU (4:1) ratio, making it ideal for standard workloads. This tier provides a healthy balance of memory and compute resources.
- **Compute Optimized** Designed for performance-intensive workloads requiring maximum throughput, with a low memory-to-vCPU (2:1) ratio. It's ideal for applications that demand the highest performance.

One tier stores data both in-memory and on-disk:

- **Flash Optimized (preview)** Enables Redis clusters to automatically move less frequently accessed data from memory (RAM) to NVMe storage. This reduces performance, but allows for cost-effective scaling of caches with large datasets.

>[!NOTE]
> For more information on how the Flash Optimized tier is architected, see [Azure Managed Redis Architecture](architecture.md#flash-optimized-tier)
>

>[!IMPORTANT]
> You can also use the [data persistence (preview)](how-to-persistence.md) feature to store data on-disk for the in-memory tiers. Data persistence stores a backup copy of data on-disk for quick recovery if you experience  an unexpected outage. This is different than the Flash Optimized tier, which is designed to store data on-disk for typical operations.
> Storing some data on-disk using the Flash Optimized tier doesn't increase data resiliency. You can use data persistence on the Flash Optimized tier as well.
>

For instructions on how to scale between tiers and SKUs, see [Scale (preview) an Azure Managed Redis instance](how-to-scale.md).

### Tiers and SKUs at a glance

:::image type="content" source="media/how-to-scale/tier-diagram.png" alt-text="Table showing the different memory and vCPU configurations for each SKU and tier of Azure Managed Redis.":::

For pricing information, see the [Azure Managed Redis Pricing](https://aka.ms/amrpricing)

### Feature comparison

The following table helps describe some of the features supported by tier:

| Feature Description                                                                                   | Memory Optimized  | Balanced          | Compute Optimized | Flash Optimized   |
|-------------------------------------------------------------------------------------------------------|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| Size (GB)                                                                                             | 12 - 1920         | 0.5 - 960         | 3 - 720           | 250 - 4500        |
| [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/cache/v1_0/)            | Yes               | Yes               | Yes               | Yes               |
| Data encryption in transit                                                                            | Yes (Private endpoint)              | Yes (Private endpoint)               | Yes (Private endpoint)               | Yes (Private endpoint)               |
| [Replication and failover](failover.md)                                                 | Yes               | Yes               | Yes               | Yes               |
| [Network isolation](private-link.md)                                                    | Yes               | Yes               | Yes               | Yes               |
| [Microsoft Entra ID based authentication](entra-for-authentication.md)                             | Yes               | Yes               | Yes               | Yes               |
| [Scaling (preview)](how-to-scale.md)                                                              | Yes               | Yes               | Yes               | Yes               |
| [Data persistence (preview)](how-to-persistence.md)                                       | Yes               | Yes               | Yes               | Yes               |
| [Zone redundancy](high-availability.md)                                                 | Yes               | Yes               | Yes               | Yes               |
| [Geo-replication](how-to-active-geo-replication.md)                                     | Yes (Active)      | Yes (Active)      | Yes (Active)      | No                |
| Non-clustered instances (preview)                                                               | Yes             | Yes               | Yes                 | No                |
| [Connection audit logs](monitor-diagnostic-settings.md)                                 | Yes (Event-based) | Yes (Event-based) | Yes (Event-based) | Yes (Event-based) |
| [JSON data structures(that is, Redis JSON)](redis-modules.md)                              | Yes               | Yes               | Yes               | Yes               |
| [Search functionality (including vector search)](redis-modules.md)                      | Yes               | Yes               | Yes               | No                |
| [Probabilistic data structures (that is, Redis Bloom)](redis-modules.md)                    | Yes               | Yes               | Yes               | Yes               |
| [Time Series database capability (that is, Redis TimeSeries)](redis-modules.md)             | Yes               | Yes               | Yes               | Yes               |
| [Import/Export](how-to-import-export-data.md)                                           | Yes               | Yes               | Yes               | Yes               |

> [!IMPORTANT]
> The Balanced B0 and B1 SKU options don't support active geo-replication.
>

> [!NOTE]
> Scaling down support is limited in some situations. For more information, see [Limitations of scaling Azure Managed Redis](how-to-scale.md#limitations-of-scaling-azure-managed-redis).
>

### Other considerations when picking a tier

- **Network performance**: If you have a workload that requires high throughput, network bandwidth might cause a bottleneck. You can increase bandwidth by moving up to a higher performance tier or by moving to a large instance size. Larger size instances have more bandwidth because of the underlying VM that hosts the cache. Higher bandwidth limits help you avoid network saturation that cause time-outs in your application. For more information on bandwidth performance, see [Performance testing](best-practices-performance.md)
- **Maximum number of client connections**: Each SKU has a maximum number of client connections. This limit increases with higher performance tiers and larger instances sizes. The following table shows the maximum client connections allowed per Azure Managed Redis SKU.


[!INCLUDE [tier-preview](includes/tier-preview.md)]

|  Size (GB)  |    Memory Optimized   |    Balanced   |   Compute Optimized  |  Flash Optimized (preview)|
|:-----------:|:---------------------:|:-------------:|:--------------------:|:--------------------:|
|    0.5      |       -               |    15000      |         -            |       -              |
|     1       |       -               |    15000      |         -            |       -              |
|     3       |       -               |    15000      |         30000        |       -              |
|     6       |       -               |    15000      |         30000        |       -              |
|     12      |   15000               |    30000      |         75000        |       -              |
|     24      |   30000               |    75000      |         150000       |       -              |
|     60      |   75000               |    150000     |         200000       |       -              |
|     120     |   150000              |    200000     |         200000       |       -              |
|     180 *   |   200000              |    200000     |         200000       |       -              |
|     240 *   |   200000              |    200000     |         200000       |       75000          |
|     360 *   |   200000              |    200000     |         200000       |       -              |
|     480 *   |   200000              |    200000     |         200000       |       150000         |
|     720 *   |   200000              |    200000     |         200000       |       200000         |
|     960 *   |   200000              |    200000     |         -            |       200000         |
|     1440 *  |   200000              |        -      |         -            |       200000         |
|     1920 *  |   200000              |        -      |         -            |       200000         |
|     4500 *  |       -               |        -      |         -            |       200000         |

  \* These tiers are in Public Preview.

- **High availability**: Azure Managed Redis provides multiple [high availability](high-availability.md) options. The SLA only covers connectivity to the cache endpoints. The SLA doesn't cover protection from data loss. For more information on the SLA, see the [SLA](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). It's possible to disable high availability in an Azure Managed Redis instance. This lowers the price but results in data loss and downtime. We only recommend disabling high availability for dev/test scenarios.

### Other pricing considerations

> [!IMPORTANT]
> Azure Managed Redis Enterprise requires an IP address for each cache instance. Currently, the IP address charge is absorbed by Azure Managed Redis and not passed on to customers. This can change in the future. For more information, see [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).
>

> [!IMPORTANT]
> Using active geo-replication produces data transfer between Azure regions. These bandwidth charges are currently absorbed by Azure Managed Redis and not passed on to customers. This might change in the future. For more information, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).
>

### Availability by region

Azure Managed Redis is continually expanding into new regions.

- Americas
  - Brazil South
  - Brazil Southeast
  - Canada Central
  - Canada East
  - Central US
  - East US
  - East US 2
  - Mexico Central
  - North Central US
  - South Central US
  - West Central US
  - West US
  - West US 2
  - West US 3
  
- Europe
  - France South
  - Germany North
  - Germany West Central
  - Italy North
  - Norway East
  - Norway West
  - Spain Central
  - Sweden Central
  - Sweden South
  - Switzerland North
  - Switzerland West
  - UK South
  - UK West
  - West Europe
  
- Middle East
  - Israel Central
  - UAE Central
  - UAE North
  
- Africa
  - South Africa North
  - South Africa West
  
- Asia Pacific
  - East Asia
  - Australia Central
  - Australia Central 2
  - Australia East
  - Australia Southeast
  - Central India
  - Indonesia Central
  - Japan East
  - Japan West
  - Jio India Central
  - Jio India West
  - Korea Central
  - Korea South
  - South East Asia
  - South India
  - Taiwan North
  - Taiwan Northwest
  
To check the availability by region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=redis-cache&regions=all).

## Moving from Azure Cache for Redis

For more information about migrating from Azure Cache for Redis to Azure Managed Redis, see [Move from Azure Cache for Redis to Azure Managed Redis](migrate/migrate-overview.md).

## Related content

- [Create an Azure Managed Redis instance](quickstart-create-managed-redis.md)
- [Azure Managed Redis Architecture](architecture.md)
