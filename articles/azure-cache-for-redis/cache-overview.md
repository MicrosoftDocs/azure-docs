---
title: What is Azure Cache for Redis?
description: Learn about Azure Cache for Redis to enable cache-aside, content caching, user session caching, job and message queuing, and distributed transactions.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.custom: ignite-2022
ms.topic: overview
ms.date: 03/28/2023
---

# About Azure Cache for Redis

Azure Cache for Redis provides an in-memory data store based on the [Redis](https://redis.io/) software. Redis improves the performance and scalability of an application that uses backend data stores heavily. It's able to process large volumes of application requests by keeping frequently accessed data in the server memory, which can be written to and read from quickly. Redis brings a critical low-latency and high-throughput data storage solution to modern applications.

Azure Cache for Redis offers both the Redis open-source (OSS Redis) and a commercial product from Redis Inc. (Redis Enterprise) as a managed service. It provides secure and dedicated Redis server instances and full Redis API compatibility. The service is operated by Microsoft, hosted on Azure, and usable by any application within or outside of Azure.

Azure Cache for Redis can be used as a distributed data or content cache, a session store, a message broker, and more. It can be deployed standalone. Or, it can be deployed along with other Azure database services, such as Azure SQL or Azure Cosmos DB.

## Key scenarios

Azure Cache for Redis improves application performance by supporting common application architecture patterns. Some of the most common include the following patterns:

| Pattern      | Description                                        |
| ------------ | -------------------------------------------------- |
| [Data cache](cache-web-app-cache-aside-leaderboard.md) | Databases are often too large to load directly into a cache. It's common to use the [cache-aside](/azure/architecture/patterns/cache-aside) pattern to load data into the cache only as needed. When the system makes changes to the data, the system can also update the cache, which is then distributed to other clients. Additionally, the system can set an expiration on data, or use an eviction policy to trigger data updates into the cache.|
| [Content cache](cache-aspnet-output-cache-provider.md) | Many web pages are generated from templates that use static content such as headers, footers, banners. These static items shouldn't change often. Using an in-memory cache provides quick access to static content compared to backend datastores. This pattern reduces processing time and server load, allowing web servers to be more responsive. It can allow you to reduce the number of servers needed to handle loads. Azure Cache for Redis provides the Redis Output Cache Provider to support this pattern with ASP.NET.|
| [Session store](cache-aspnet-session-state-provider.md) | This pattern is commonly used with shopping carts and other user history data that a web application might associate with user cookies. Storing too much in a cookie can have a negative effect on performance as the cookie size grows and is passed and validated with every request. A typical solution uses the cookie as a key to query the data in a database. When you use an in-memory cache, like Azure Cache for Redis, to associate information with a user is faster than interacting with a full relational database. |
| Job and message queuing | Applications often add tasks to a queue when the operations associated with the request take time to execute. Longer running operations are queued to be processed in sequence, often by another server.  This method of deferring work is called task queuing. Azure Cache for Redis provides a distributed queue to enable this pattern in your application.|
| Distributed transactions | Applications sometimes require a series of commands against a backend data-store to execute as a single atomic operation. All commands must succeed, or all must be rolled back to the initial state. Azure Cache for Redis supports executing a batch of commands as a single [transaction](https://redis.io/topics/transactions). |

## Redis versions

Azure Cache for Redis supports OSS Redis version 4.0.x and 6.0.x. We've made the decision to skip Redis 5.0 to bring you the latest version. Previously, Azure Cache for Redis maintained a single Redis version. In the future, it will provide a newer major release upgrade and at least one older stable version. You can [choose which version](cache-how-to-version.md) works the best for your application.

## Service tiers

Azure Cache for Redis is available in these tiers:

| Tier | Description |
|---|---|
| Basic | An OSS Redis cache running on a single VM. This tier has no service-level agreement (SLA) and is ideal for development/test and noncritical workloads. |
| Standard | An OSS Redis cache running on two VMs in a replicated configuration. |
| Premium | High-performance OSS Redis caches. This tier offers higher throughput, lower latency, better availability, and more features. Premium caches are deployed on more powerful VMs compared to the VMs for Basic or Standard caches. |
| Enterprise | High-performance caches powered by Redis Inc.'s Redis Enterprise software. This tier supports Redis modules including RediSearch, RedisBloom, RedisJSON, and RedisTimeSeries. Also, it offers even higher availability than the Premium tier. |
| Enterprise Flash | Cost-effective large caches powered by Redis Inc.'s Redis Enterprise software. This tier extends Redis data storage to nonvolatile memory, which is cheaper than DRAM, on a VM. It reduces the overall per-GB memory cost. |

### Feature comparison

The [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/) provides a detailed comparison of each tier. The following table helps describe some of the features supported by tier:

| Feature Description | Basic | Standard | Premium | Enterprise | Enterprise Flash |
| ------------------- | :-----: | :------: | :---: | :---: | :---: |
| [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/cache/v1_0/) |-|✔|✔|✔|✔|
| Data encryption in transit |✔|✔|✔|✔|✔|
| [Network isolation](cache-private-link.md) |✔|✔|✔|✔|✔|
| [Scaling](cache-how-to-scale.md) |✔|✔|✔|Preview|Preview|
| [OSS clustering](cache-how-to-premium-clustering.md) |-|-|✔|✔|✔|
| [Data persistence](cache-how-to-premium-persistence.md) |-|-|✔|Preview|Preview|
| [Zone redundancy](cache-how-to-zone-redundancy.md) |-|-|✔|✔|✔|
| [Geo-replication](cache-how-to-geo-replication.md) |-|-|✔ (Passive) |✔ (Active) |✔ (Active) |
| [Connection audit logs](cache-monitor-diagnostic-settings.md) |-|-|✔ (Poll-based)|✔ (Event-based)|✔ (Event-based)|
| [Redis Modules](cache-redis-modules.md) |-|-|-|✔|Preview|
| [Import/Export](cache-how-to-import-export-data.md) |-|-|✔|✔|✔|
| [Reboot](cache-administration.md#reboot) |✔|✔|✔|-|-|
| [Scheduled updates](cache-administration.md#schedule-updates) |✔|✔|✔|-|-|

> [!NOTE]
> The Enterprise Flash tier currently supports only the RediSearch module (in preview) and the RedisJSON module. 

### Choosing the right tier

Consider the following options when choosing an Azure Cache for Redis tier:

- **Memory**: The Basic and Standard tiers offer 250 MB – 53 GB; the Premium tier 6 GB - 1.2 TB; the Enterprise tiers 12 GB - 14 TB.  To create a Premium tier cache larger than 120 GB, you can use Redis OSS clustering. For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/). For more information, see [How to configure clustering for a Premium Azure Cache for Redis](cache-how-to-premium-clustering.md).
- **Performance**: Caches in the Premium and Enterprise tiers are deployed on hardware that has faster processors, giving better performance compared to the Basic or Standard tier. Premium tier Caches have higher throughput and lower latencies. For more information, see [Azure Cache for Redis performance](./cache-planning-faq.yml#azure-cache-for-redis-performance).
- **Dedicated core for Redis server**: All caches except C0 run dedicated VM cores. Redis, by design, uses only one thread for command processing. Azure Cache for Redis uses other cores for I/O processing. Having more cores improves throughput performance even though it may not produce linear scaling. Furthermore, larger VM sizes typically come with higher bandwidth limits than smaller ones. That helps you avoid network saturation that cause timeouts in your application.
- **Network performance**: If you have a workload that requires high throughput, the Premium or Enterprise tier offers more bandwidth compared to Basic or Standard. Also within each tier, larger size caches have more bandwidth because of the underlying VM that hosts the cache. For more information, see [Azure Cache for Redis performance](./cache-planning-faq.yml#azure-cache-for-redis-performance).
- **Maximum number of client connections**: The Premium and Enterprise tiers offer the maximum numbers of clients that can connect to Redis, offering higher numbers of connections for larger sized caches. Clustering increases the total amount of network bandwidth available for a clustered cache.
- **High availability**: Azure Cache for Redis provides multiple [high availability](cache-high-availability.md) options. It guarantees that a Standard, Premium, or Enterprise cache is available according to our [SLA](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). The SLA only covers connectivity to the cache endpoints. The SLA doesn't cover protection from data loss. We recommend using the Redis data persistence feature in the Premium and Enterprise tiers to increase resiliency against data loss.
- **Data persistence**: The Premium and Enterprise tiers allow you to persist the cache data to an Azure Storage account and a Managed Disk respectively. Underlying infrastructure issues might result in potential data loss. We recommend using the Redis data persistence feature in these tiers to increase resiliency against data loss. Azure Cache for Redis offers both RDB and AOF (preview) options. Data persistence can be enabled through Azure portal and CLI. For the Premium tier, see [How to configure persistence for a Premium Azure Cache for Redis](cache-how-to-premium-persistence.md).
- **Network isolation**: Azure Private Link and Virtual Network (VNET) deployments provide enhanced security and traffic isolation for your Azure Cache for Redis. VNET allows you to further restrict access through network access control policies. For more information, see [Azure Cache for Redis with Azure Private Link](cache-private-link.md) and [How to configure Virtual Network support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md).
- **Redis Modules**: Enterprise tiers support [RediSearch](https://docs.redis.com/latest/modules/redisearch/), [RedisBloom](https://docs.redis.com/latest/modules/redisbloom/), [RedisTimeSeries](https://docs.redis.com/latest/modules/redistimeseries/), and [RedisJSON](https://docs.redis.com/latest/modules/redisjson/). These modules add new data types and functionality to Redis.

You can scale your cache from the Basic tier up to Premium after it has been created. Scaling down to a lower tier isn't supported currently. For step-by-step scaling instructions, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md) and [How to scale - Basic, Standard, and Premium tiers](cache-how-to-scale.md#how-to-scale---basic-standard-and-premium-tiers).

### Special considerations for Enterprise tiers

The Enterprise tiers rely on Redis Enterprise, a commercial variant of Redis from Redis Inc. Customers obtain and pay for a license to this software through an Azure Marketplace offer. Azure Cache for Redis manages the license acquisition so that you won't have to do it separately. To purchase in the Azure Marketplace, you must have the following prerequisites:

- Your Azure subscription has a valid payment instrument. Azure credits or free MSDN subscriptions aren't supported.
- Your organization allows [Azure Marketplace purchases](../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).
- If you use a private Marketplace, it must contain the Redis Inc. Enterprise offer.

> [!IMPORTANT]
> Azure Cache for Redis Enterprise requires standard network Load Balancers that are charged separately from cache instances themselves. Currently, these charges are absorbed by Azure Cache for Redis and not passed on to customers. This may change in the future. For more information, see [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).
>
> If an Enterprise cache is configured for multiple Availability Zones, data transfer charges are absorbed by Azure cache for Redis and not passed to customers. This may change in the future, where data transfer would be billed at the [standard network bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/)
>
> In addition, data persistence adds Managed Disks. The use of these resources is free during the public preview of Enterprise data persistence. This might change when the feature becomes generally available.

### Availability by region

Azure Cache for Redis is continually expanding into new regions. To check the availability by region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=redis-cache&regions=all).

## Next steps

- [Create an open-source Redis cache](quickstart-create-redis.md)
- [Create a Redis Enterprise cache](quickstart-create-redis-enterprise.md)
- [Use Azure Cache for Redis in an ASP.NET web app](cache-web-app-howto.md)
- [Use Azure Cache for Redis in .NET Core](cache-dotnet-core-quickstart.md)
- [Use Azure Cache for Redis in .NET Framework](cache-dotnet-how-to-use-azure-redis-cache.md)
- [Use Azure Cache for Redis in Node.js](cache-nodejs-get-started.md)
- [Use Azure Cache for Redis in Java](cache-java-get-started.md)
- [Use Azure Cache for Redis in Python](cache-python-get-started.md)
