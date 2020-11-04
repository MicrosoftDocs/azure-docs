---
title: What is Azure Cache for Redis?
description: Learn about Azure Cache for Redis to enable cache-aside, content caching, user session caching, job and message queuing, and distributed transactions.
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: overview
ms.date: 05/12/2020

#As a developer, I want to understand what Azure Cache for Redis is and how it can improve performance in my application.
---

# Azure Cache for Redis
Azure Cache for Redis provides an in-memory data store based on the [Redis](https://redis.io/) software. Redis improves the performance and scalability of an application that uses on backend data stores heavily. It is able to process large volumes of application request by keeping frequently accessed data in the server memory that can be written to and read from quickly. Redis brings a critical low-latency and high-throughput data storage solution to modern applications.

Azure Cache for Redis offers both the Redis open-source and a commercial product from Redis Labs as a managed service. It provides secure and dedicated Redis server instances and full Redis API compatibility. The service is operated by Microsoft, hosted on Azure, and accessible to any application within or outside of Azure.

Azure Cache for Redis can be used as a distributed data or content cache, a session store, a message broker, and more. It can be deployed as a standalone or along side with other Azure database service, such as Azure SQL or Cosmos DB.

## Key scenarios
Azure Cache for Redis improves application performance by supporting common application architecture patterns. Some of the most common include the following:

| Pattern      | Description                                        |
| ------------ | -------------------------------------------------- |
| [Data cache](cache-web-app-cache-aside-leaderboard.md) | Databases are often too large to load directly into a cache. It is common to use the [cache-aside](/azure/architecture/patterns/cache-aside) pattern to load data into the cache only as needed. When the system makes changes to the data, the system can also update the cache, which is then distributed to other clients. Additionally, the system can set an expiration on data, or use an eviction policy to trigger data updates into the cache.|
| [Content cache](cache-aspnet-output-cache-provider.md) | Many web pages are generated from templates that use static content such as headers, footers, banners. These static items shouldn't change often. Using an in-memory cache provides quick access to static content compared to backend datastores. This pattern reduces processing time and server load, allowing web servers to be more responsive. It can allow you to reduce the number of servers needed to handle loads. Azure Cache for Redis provides the Redis Output Cache Provider to support this pattern with ASP.NET.|
| [Session store](cache-aspnet-session-state-provider.md) | This pattern is commonly used with shopping carts and other user history data that a web application may want to associate with user cookies. Storing too much in a cookie can have a negative impact on performance as the cookie size grows and is passed and validated with every request. A typical solution uses the cookie as a key to query the data in a database. Using an in-memory cache, like Azure Cache for Redis, to associate information with a user is much faster than interacting with a full relational database. |
| Job and message queuing | Applications often add tasks to a queue when the operations associated with the request take time to execute. Longer running operations are queued to be processed in sequence, often by another server.  This method of deferring work is called task queuing. Azure Cache for Redis provides a distributed queue to enable this pattern in your application.|
| Distributed transactions | Applications sometimes require a series of commands against a backend data-store to execute as a single atomic operation. All commands must succeed, or all must be rolled back to the initial state. Azure Cache for Redis supports executing a batch of commands as a single [transaction](https://redis.io/topics/transactions). |

## Redis versions

Azure Cache for Redis supports OSS Redis version 4.x and, as a preview, 6.0. We've made the decision to skip Redis 5.0 to bring you the latest version. Previously, Azure Cache for Redis only maintained a single Redis version. It will provide a newer major release upgrade and at least one older stable version going forward. You can [choose which version](cache-how-to-version.md) works the best for your application.

> [!NOTE]
> Redis 6.0 is currently in preview - [contact us](mailto:azurecache@microsoft.com) if you're interested. This preview is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>

## Service tiers
Azure Cache for Redis is available in the following tiers:

| Tier | Description |
|---|---|
| Basic | An OSS Redis cache running on a single VM. This tier has no service-level agreement (SLA) and is ideal for development/test and non-critical workloads. |
| Standard | An OSS Redis cache running on two VMs in a replicated configuration. |
| Premium | High-performance OSS Redis caches. This tier offers higher throughput, lower latency, better availability, and more features. Premium caches are deployed on more powerful VMs compared to those for Basic or Standard caches. |
| Enterprise | High-performance caches powered by Redis Labs' Redis Enterprise software. This tier supports Redis modules including RediSearch, RedisBloom, and RedisTimeSeries. In addition, it offers even higher availability than the Premium tier. |
| Enterprise Flash | Cost-effective large caches powered by Redis Labs' Redis Enterprise software. This tier extends Redis data storage to non-volatile memory, which is cheaper than DRAM, on a VM. It reduces the overall per-GB memory cost. |

### Feature comparison
The [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/) provides a detailed comparison of each tier. The following table helps describe some of the features supported by tier:

| Feature Description | Basic | Standard | Premium | Enterprise | Enterprise Flash |
| ------------------- | :-----: | :------: | :---: | :---: | :---: |
| [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/cache/v1_0/) |-|✔|✔|✔|✔|
| Data encryption |✔|✔|✔|✔|✔|
| [Network isolation](cache-how-to-premium-vnet.md) |✔|✔|✔|✔|✔|
| [Scaling](cache-how-to-scale.md) |✔|✔|✔|✔|✔|
| [Zone redundancy](cache-how-to-zone-redundancy.md) |-|-|✔|✔|✔|
| [Geo-replication](cache-how-to-geo-replication.md) |-|-|✔|-|-|
| [Data persistence](cache-how-to-premium-persistence.md) |-|-|✔|-|-|
| [OSS cluster](cache-how-to-premium-clustering.md) |-|-|✔|✔|✔|
| [Modules](https://redis.io/modules) |-|-|-|✔|-|
| [Import/Export](cache-how-to-import-export-data.md) |-|-|✔|✔|✔|
| [Scheduled updates](cache-administration.md#schedule-updates) |✔|✔|✔|-|-|

### Choosing the right tier
You should consider the following when choosing an Azure Cache for Redis tier:

* **Memory**: The Basic and Standard tiers offer 250 MB – 53 GB; the Premium tier 6 GB - 1.2 TB; the Enterprise tiers 12 GB - 14 TB.  To create a Premium tier cache larger than 120 GB, you can use Redis OSS clustering. For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/). For more information, see [How to configure clustering for a Premium Azure Cache for Redis](cache-how-to-premium-clustering.md).
* **Network performance**: If you have a workload that requires high throughput, the Premium or Enterprise tier offers more bandwidth compared to Basic or Standard. Also within each tier, larger size caches have more bandwidth because of the underlying VM that hosts the cache. For more information, see [Azure Cache for Redis performance](cache-planning-faq.md#azure-cache-for-redis-performance).
* **Throughput**: The Premium tier offers the maximum available throughput. If the cache server or client reaches the bandwidth limits, you may receive timeouts on the client side. For more information, see the following table.
* **High availability**: Azure Cache for Redis provides multiple [high availability](cache-high-availability.md) options. It guarantees that a Standard, Premium, or Enterprise cache is available according to our [SLA](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). The SLA only covers connectivity to the cache endpoints. The SLA does not cover protection from data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss.
* **Data persistence**: The Premium tier allows you to persist the cache data in an Azure Storage account. In other tiers, data are stored only in memory. Underlying infrastructure issues might result in potential data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss. Azure Cache for Redis offers RDB and AOF (preview) options in Redis persistence. For more information, see [How to configure persistence for a Premium Azure Cache for Redis](cache-how-to-premium-persistence.md).
* **Network isolation**: Azure Private Link and Virtual Network (VNET) deployments provide enhanced security and traffic isolation for your Azure Cache for Redis. VNET allows you to further restrict access through network access control policies. For more information, see [Azure Cache for Redis with Azure Private Link](cache-private-link.md) and [How to configure Virtual Network support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md).
* **Maximum number of client connections**: The Premium tier offers the maximum number of clients that can connect to Redis, with a higher number of connections for larger sized caches. Clustering does not increase the number of connections available for a clustered cache. For more information, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
* **Dedicated core for Redis server**: All caches except C0 run dedicated VM cores.
* **Single-threaded processing**: Redis, by design, uses only one thread for command processing. Azure Cache for Redis also utilizes additional cores for I/O processing. Having more cores improves throughput performance even though it may not produce linear scaling. Furthermore, larger VM sizes typically come with higher bandwidth limits than smaller ones. That helps you avoid network saturation, which will cause timeouts in your application.
* **Performance improvements**: Caches in the Premium and Enterprise tiers are deployed on hardware that has faster processors, giving better performance compared to the Basic or Standard tier. Premium tier Caches have higher throughput and lower latencies. For more information, see [Azure Cache for Redis performance](cache-planning-faq.md#azure-cache-for-redis-performance).

You can scale your cache from the Basic tier up to Premium after it has been created. Scaling down to a lower tier is not supported. For step-by-step scaling instructions, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md) and [How to automate a scaling operation](cache-how-to-scale.md#how-to-automate-a-scaling-operation).

### Enterprise tier requirements

The Enterprise tiers rely on Redis Enterprise, a commercial version of Redis from Redis Labs. Customers will obtain and pay for a license to this software through an Azure Marketplace offer. Azure Cache for Redis will facilitate the license acquisition so that you won't have to do it separately. To purchase in the Azure Marketplace, you must have the following prerequisites:
* Your Azure subscription has a valid payment instrument. Azure credits or free MSDN subscriptions are not supported.
* You're an Owner or Contributor of the subscription.
* Your organization allows [Azure Marketplace purchases](https://docs.microsoft.com/azure/cost-management-billing/manage/ea-azure-marketplace#enabling-azure-marketplace-purchases).
* If you use a private Marketplace, it must contain the Redis Labs Enterprise offer.

## Next steps
* [Create an Azure Cache for Redis instance](quickstart-create-redis.md)
* [Create an Enterprise tier cache](quickstart-create-redis-enterprise.md)
* [Use Azure Cache for Redis in an ASP.NET web app](cache-web-app-howto.md)
* [Use Azure Cache for Redis in .NET Core](cache-dotnet-core-quickstart.md)
* [Use Azure Cache for Redis in .NET Framework](cache-dotnet-how-to-use-azure-redis-cache.md)
* [Use Azure Cache for Redis in Node.js](cache-nodejs-get-started.md)
* [Use Azure Cache for Redis in Java](cache-java-get-started.md)
* [Use Azure Cache for Redis in Python](cache-python-get-started.md)
