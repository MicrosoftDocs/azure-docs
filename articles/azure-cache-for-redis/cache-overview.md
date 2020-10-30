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
Azure Cache for Redis provides an in-memory data store based on the open-source software [Redis](https://redis.io/). Redis improves the performance and scalability of an application that uses on backend data stores heavily. It is able to process large volumes of application request by keeping frequently accessed data in the server memory that can be written to and read from quickly. Redis brings a critical low-latency and high-throughput data storage solution to modern applications.

Azure Cache for Redis offers Redis as a managed service. It provides secure and dedicated Redis server instances and full Redis API compatibility. The service is operated by Microsoft, hosted on Azure, and accessible to any application within or outside of Azure.

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

Azure Cache for Redis supports Redis version 4.x and, as a preview, 6.0. We've made the decision to skip Redis 5.0 to bring you the latest version. Previously, Azure Cache for Redis only maintained a single Redis version. It will provide a newer major release upgrade and at least one older stable version going forward. You can [choose which version](cache-how-to-version.md) works the best for your application.

> [!NOTE]
> Redis 6.0 is currently in preview - [contact us](mailto:azurecache@microsoft.com) if you're interested. This preview is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>

## Service tiers
Azure Cache for Redis is available in the following tiers:

| Tier | Description |
|---|---|
| Basic | A single node cache. This tier supports multiple memory sizes (250 MB - 53 GB)and is ideal for development/test and non-critical workloads. The Basic tier has no service-level agreement (SLA). |
| Standard | A replicated cache in a two-node, primary/replica, configuration managed by Azure with a high-availability [SLA](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). |
| Premium | The Premium tier is the Enterprise-ready tier. Premium tier Caches support more features and have higher throughput with lower latencies. Caches in the Premium tier are deployed on more powerful hardware providing better performance compared to the Basic or Standard Tier. This advantage means the throughput for a cache of the same size will be higher in Premium compared to Standard tier. |

### Feature comparison
The [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/) provides a detailed comparison of each tier. The following table helps describe some of the features supported by tier:

| Feature Description | Premium | Standard | Basic |
| ------------------- | :-----: | :------: | :---: |
| [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/cache/v1_0/) |✔|✔|-|
| [Redis data persistence](cache-how-to-premium-persistence.md) |✔|-|-|
| [Redis cluster](cache-how-to-premium-clustering.md) |✔|-|-|
| [Security via Firewall rules](cache-configure.md#firewall) |✔|✔|✔|
| Encryption in transit |✔|✔|✔|
| [Enhanced security and isolation with VNet](cache-how-to-premium-vnet.md) |✔|-|-|
| [Import/Export](cache-how-to-import-export-data.md) |✔|-|-|
| [Scheduled updates](cache-administration.md#schedule-updates) |✔|✔|✔|
| [Geo-replication](cache-how-to-geo-replication.md) |✔|-|-|
| [Reboot](cache-administration.md#reboot) |✔|✔|✔|

### Choosing the right tier
You should consider the following when choosing an Azure Cache for Redis tier.

* **Memory**: The Basic and Standard tiers offer 250 MB – 53 GB. The Premium tier offers up to 1.2 TB (as a cluster) or 120 GB (non-clustered). For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).
* **Network performance**: If you have a workload that requires high throughput, the Premium tier offers more bandwidth compared to Standard or Basic. Also within each tier, larger size caches have more bandwidth because of the underlying VM that hosts the cache. For more information, see [Azure Cache for Redis performance](cache-planning-faq.md#azure-cache-for-redis-performance).
* **Throughput**: The Premium tier offers the maximum available throughput. If the cache server or client reaches the bandwidth limits, you may receive timeouts on the client side. For more information, see the following table.
* **High availability**: Azure Cache for Redis provides multiple [high availability](cache-high-availability.md) options. It guarantees that a Standard/Premium cache is available according to our [SLA](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). The SLA only covers connectivity to the cache endpoints. The SLA does not cover protection from data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss.
* **Redis data persistence**: The Premium tier allows you to persist the cache data in an Azure Storage account. In a Basic/Standard cache, all the data is stored only in memory. Underlying infrastructure issues might result in potential data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss. Azure Cache for Redis offers RDB and AOF (preview) options in Redis persistence. For more information, see [How to configure persistence for a Premium Azure Cache for Redis](cache-how-to-premium-persistence.md).
* **Redis cluster**: To create caches larger than 120 GB, or to shard data across multiple Redis nodes, you can use Redis clustering, which is available in the Premium tier. Each node consists of a primary/replica cache pair for high availability. For more information, see [How to configure clustering for a Premium Azure Cache for Redis](cache-how-to-premium-clustering.md).
* **Enhanced security and network isolation**: Azure Virtual Network (VNET) deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access. For more information, see [How to configure Virtual Network support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md).
* **Configure Redis**: In both the Standard and Premium tiers, you can configure Redis for Keyspace notifications.
* **Maximum number of client connections**: The Premium tier offers the maximum number of clients that can connect to Redis, with a higher number of connections for larger sized caches. Clustering does not increase the number of connections available for a clustered cache. For more information, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
* **Dedicated core for Redis server**: In the Premium tier, all cache sizes have a dedicated core for Redis. In the Basic/Standard tiers, the C1 size and above have a dedicated core for Redis server.
* **Single-threaded processing**: Redis, by design, uses only one thread for command processing. Azure Cache for Redis also utilizes additional cores for I/O processing. Having more cores improves throughput performance even though it may not produce linear scaling. Furthermore, larger VM sizes typically come with higher bandwidth limits than smaller ones. That helps you avoid network saturation, which will cause timeouts in your application.
* **Performance improvements**: Caches in the Premium tier are deployed on hardware that has faster processors, giving better performance compared to the Basic or Standard tier. Premium tier Caches have higher throughput and lower latencies. For more information, see [Azure Cache for Redis performance](cache-planning-faq.md#azure-cache-for-redis-performance)

You can scale your cache up to a higher tier after it has been created. Scaling down to a lower tier is not supported. For step-by-step scaling instructions, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md) and [How to automate a scaling operation](cache-how-to-scale.md#how-to-automate-a-scaling-operation).

## Next steps
* [ASP.NET Web App Quickstart](cache-web-app-howto.md)
  Create a simple ASP.NET web app that uses an Azure Cache for Redis.
* [.NET Quickstart](cache-dotnet-how-to-use-azure-redis-cache.md)
  Create a .NET app that uses an Azure Cache for Redis.
* [.NET Core Quickstart](cache-dotnet-core-quickstart.md)
  Create a .NET Core app that uses an Azure Cache for Redis.
* [Node.js Quickstart](cache-nodejs-get-started.md)
  Create a simple Node.js app that uses an Azure Cache for Redis.
* [Java Quickstart](cache-java-get-started.md)
  Create a simple Java app that uses an Azure Cache for Redis.
* [Python Quickstart](cache-python-get-started.md)
  Create a Python app that uses an Azure Cache for Redis.