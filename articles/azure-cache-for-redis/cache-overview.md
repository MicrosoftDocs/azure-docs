---
title: What is Azure Cache for Redis? | Microsoft Docs
description: Learn what Azure Cache for Redis is and how it is commonly used.
services: cache
documentationcenter: ''
author: yegu-ms
manager: jhubbard
editor: ''
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: overview
ms.date: 03/26/2018
ms.author: yegu
ms.custom: mvc

#As a developer, I want to understand what Azure Cache for Redis is and how it can improve performance in my application.

---

# Azure Cache for Redis description

Azure Cache for Redis is based on the popular software [Redis](https://redis.io/). It is typically used as a cache to improve the performance and scalability of systems that rely heavily on backend data-stores. Performance is improved by temporarily copying frequently accessed data to fast storage located close to the application. With [Azure Cache for Redis](https://redis.io/), this fast storage is located in-memory with Azure Cache for Redis instead of being loaded from disk by a database.

Azure Cache for Redis can also be used as an in-memory data structure store, a distributed non-relational database, and a message broker. Application performance is improved by taking advantage of the low-latency, high-throughput performance of the Redis engine.

Azure Cache for Redis provides you access to a secure, dedicated Redis cache. Azure Cache for Redis is managed by Microsoft, hosted within Azure, and accessible to any application within or outside of Azure.

## Using Azure Cache for Redis

There are many common patterns where Azure Cache for Redis is used to support application architecture or to improve application performance. Some of the most common include the following:

| Pattern      | Description                                        |
| ------------ | -------------------------------------------------- |
| [Cache-Aside](cache-web-app-cache-aside-leaderboard.md) | Since a database can be large, loading an entire database into a cache is not a recommended approach. It is common to use the [cache-aside](https://docs.microsoft.com/azure/architecture/patterns/cache-aside) pattern to load data items into the cache only as needed. When the system makes changes to the backend data, it can at that time also update the cache, which is distributed with other clients. Additionally, the system can set an expiration on data items, or use an eviction policy to cause data updates to be reloaded into the cache.|
| [Content Caching](cache-aspnet-output-cache-provider.md) | Most web pages are generated from templates with headers, footers, toolbars, menus, etc. They don't actually change often and should not be generated dynamically. Using an in-memory cache, like Azure Cache for Redis, will give your web servers quick access to this type of static content compared to backend datastores. This pattern reduces processing time and server load that would be required to generate content dynamically. This allows web servers to be more responsive, and can allow you to reduce the number of servers needed to handle loads. Azure Cache for Redis provides the Redis Output Cache Provider to help support this pattern with ASP.NET.|
| [User session caching](cache-aspnet-session-state-provider.md) | This pattern is commonly used with shopping carts and other user history type information that a web application may want to associate with user cookies. Storing too much in a cookie can have a negative impact on performance as the cookie size grows and is passed and validated with every request. A typical solution is to use the cookie as a key to query the data in a backend database. Using an in-memory cache, like Azure Cache for Redis, to associate information with a user is much faster than interacting with a full relational database. |
| Job and message queuing | When applications receive requests, often the operations associated with the request take additional time to execute. It is a common pattern to defer longer running operations by adding them to a queue, which is processed later, and possibly by another server. This method of deferring work is called task queuing. There are many software components designed to support task queues. Azure Cache for Redis also serves this purpose well as a distributed queue.|
| Distributed transactions | It is a common requirement for applications to be able to execute a series of commands against a backend data-store as a single operation (atomic). All commands must succeed, or all must be rolled back to the initial state. Azure Cache for Redis supports executing a batch of commands as a single operation in the form of [Transactions](https://redis.io/topics/transactions). |

## Azure Cache for Redis offerings

Azure Cache for Redis is available in the following tiers:

| Tier | Description |
|---|---|
Basic | A single node cache. This tier supports multiple memory sizes (250 MB - 53 GB). This is an ideal tier for development/test and non-critical workloads. The Basic tier has no service-level agreement (SLA) |
| Standard | A replicated cache in a two-node, primary/secondary, configuration managed by Microsoft, with a high-availability SLA (99.9%) |
| Premium | The Premium tier is the Enterprise-ready tier. Premium tier Caches support more features and have higher throughput with lower latencies. Caches in the Premium tier are deployed on more powerful hardware providing better performance compared to the Basic or Standard Tier. This advantage means the throughput for a cache of the same size will be higher in Premium compared to Standard tier. |

> [!TIP]
> For more information about size, throughput, and bandwidth with premium caches, see [Azure Cache for Redis FAQ](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use).
>

You can scale your cache up to a higher tier after it has already been created. Scaling down to a lower tier is not supported. For step-by-step scaling instructions, see [How to Scale Azure Cache for Redis](cache-how-to-scale.md) and [How to automate a scaling operation](cache-how-to-scale.md#how-to-automate-a-scaling-operation).

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
