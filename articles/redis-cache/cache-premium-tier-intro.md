<properties 
	pageTitle="Introduction to the Azure Redis Cache Premium tier" 
	description="Learn how to create and manage Redis Persistence, Redis clustering, and VNET support for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/09/2016" 
	ms.author="sdanie"/>

# Introduction to the Azure Redis Cache Premium tier
Azure Redis Cache is a distributed, managed cache that helps you build highly scalable and responsive applications by providing super-fast access to your data. 

The new Premium-tier is an Enterprise ready tier which includes all the Standard-tier features and more, such as better performance, bigger workloads, disaster recovery, and enhanced security. Continue reading to learn more about the additional features of the Premium cache tier.

## Better performance compared to Standard or Basic tier
**Better performance over Standard or Basic tier.** Caches in the Premium tier are deployed on hardware which has faster processors and gives better performance compared to the Basic or Standard Tier. Premium tier Caches have higher throughput and lower latencies. 

**Throughput for the same sized Cache is higher in Premium as compared to Standard tier.** Eg. For a 53 GB Cache, throughput of P4 (Premium) is 250K requests per second as compared to 150K for C6 (Standard).

Please see the [Azure Redis Cache FAQ](cache-faq.md#what-redis-cache-offering-and-size-should-i-use) for more details about size, throughput, and bandwidth with premium caches.

## Redis data persistence
The Premium tier allows you to persist the cache data in an Azure Storage account. In a Basic/Standard cache all the data is stored only in memory. In case of underlying infrastructure issues there can be potential data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss. Azure Redis Cache offers RDB and AOF (coming soon) options in [Redis persistence](http://redis.io/topics/persistence). 

For instructions on configuring persistence, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md).

##Redis cluster
If you want to create caches larger than 53 GB or want to shard data across multiple Redis nodes, you can use Redis clustering which is available in the Premium tier. Each node consists of a primary/replica cache pair managed by Azure for high availability. 

**Redis clustering gives you maximum scale and throughput.** Throughput increases linearly as you increase the number of shards (nodes) in the cluster. Eg. If you create a P4 cluster of 10 shards, then the available throughput is 250K *10 = 2.5 Million requests per second. Please see the [Azure Redis Cache FAQ](cache-faq.md#what-redis-cache-offering-and-size-should-i-use) for more details about size, throughput, and bandwidth with premium caches.

To get started with clustering, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).

##Enhanced security and isolation
Caches created in the Basic or Standard tier are accessible on the public internet. Access to the Cache is restricted based on the access key. With the Premium tier you can further ensure that only clients within a specified network can access the Cache. You can deploy Redis Cache in an [Azure Virtual Network (VNet)](https://azure.microsoft.com/services/virtual-network/). You can use all the features of VNet such as subnets, access control policies, and other features to further restrict access to Redis.

For more information, see [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

## Next steps

Create a cache and explore the new premium tier features.

-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
  

