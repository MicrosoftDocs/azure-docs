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

Azure Cache for Redis provides an in-memory data store based on the open-source software [Redis](https://redis.io/). When used as a cache, Redis improves the performance and scalability of systems that rely heavily on backend data stores. Performance is improved by copying frequently accessed data to fast storage located close to the application. With Azure Cache for Redis, this fast storage is located in-memory instead of being loaded from disk by a database.

Azure Cache for Redis can be used as a distributed data cache, a session store, and a message broker. Application performance is improved by taking advantage of the low-latency, high-throughput performance of the Redis engine.

Azure Cache for Redis offers access to a secure, dedicated Redis cache. It is managed by Microsoft, hosted on Azure, and accessible to any application within or outside of Azure.

## Using Azure Cache for Redis

Azure Cache for Redis improves application performance by supporting common application architecture patterns. Some of the most common include the following:

| Pattern      | Description                                        |
| ------------ | -------------------------------------------------- |
| [Cache-Aside](cache-web-app-cache-aside-leaderboard.md) | Databases are often too large to load directly into a cache. It is common to use the [cache-aside](https://docs.microsoft.com/azure/architecture/patterns/cache-aside) pattern to load data into the cache only as needed. When the system makes changes to the data, the system can also update the cache, which is then distributed to other clients. Additionally, the system can set an expiration on data, or use an eviction policy to trigger data updates into the cache.|
| [Content Caching](cache-aspnet-output-cache-provider.md) | Many web pages are generated from templates that use static content such as headers, footers, banners. These static items shouldn't change often. Using an in-memory cache provides quick access to static content compared to backend datastores. This pattern reduces processing time and server load, allowing web servers to be more responsive. It can allow you to reduce the number of servers needed to handle loads. Azure Cache for Redis provides the Redis Output Cache Provider to support this pattern with ASP.NET.|
| [User session caching](cache-aspnet-session-state-provider.md) | This pattern is commonly used with shopping carts and other user history data that a web application may want to associate with user cookies. Storing too much in a cookie can have a negative impact on performance as the cookie size grows and is passed and validated with every request. A typical solution uses the cookie as a key to query the data in a database. Using an in-memory cache, like Azure Cache for Redis, to associate information with a user is much faster than interacting with a full relational database. |
| Job and message queuing | Applications often add tasks to a queue when the operations associated with the request take time to execute. Longer running operations are queued to be processed in sequence, often by another server.  This method of deferring work is called task queuing. Azure Cache for Redis provides a distributed queue to enable this pattern in your application.|
| Distributed transactions | Applications sometimes require a series of commands against a backend data-store to execute as a single atomic operation. All commands must succeed, or all must be rolled back to the initial state. Azure Cache for Redis supports executing a batch of commands as a single [transaction](https://redis.io/topics/transactions). |

## Azure Cache for Redis offerings

Azure Cache for Redis is available in the following tiers:

| Tier | Description |
|---|---|
Basic | A single node cache. This tier supports multiple memory sizes (250 MB - 53 GB)and is ideal for development/test and non-critical workloads. The Basic tier has no service-level agreement (SLA) |
| Standard | A replicated cache in a two-node, primary/secondary, configuration managed by Azure with a high-availability SLA (99.9%) |
| Premium | The Premium tier is the Enterprise-ready tier. Premium tier Caches support more features and have higher throughput with lower latencies. Caches in the Premium tier are deployed on more powerful hardware providing better performance compared to the Basic or Standard Tier. This advantage means the throughput for a cache of the same size will be higher in Premium compared to Standard tier. |

> [!TIP]
> For more information about size, throughput, and bandwidth with premium caches, see [Azure Cache for Redis FAQ](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use).
>

You can scale your cache up to a higher tier after it has been created. Scaling down to a lower tier is not supported. For step-by-step scaling instructions, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md) and [How to automate a scaling operation](cache-how-to-scale.md#how-to-automate-a-scaling-operation).

### Feature comparison

The [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/) page provides a detailed comparison of each tier. The following table helps describe some of the features supported by tier:

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
