<properties 
	pageTitle="Introduction to the Azure Redis Cache Premium tier | Microsoft Azure" 
	description="Learn how to create and manage Redis Persistence, Redis clustering, and VNET support for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="sdanie"/>

# Introduction to the Azure Redis Cache Premium tier
Azure Redis Cache is a distributed, managed cache that helps you build highly scalable and responsive applications by providing super-fast access to your data. 

The new Premium-tier is an Enterprise ready tier which includes all the Standard-tier features and more, such as better performance, bigger workloads, disaster recovery, import/export, and enhanced security. Continue reading to learn more about the additional features of the Premium cache tier.

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

## Import/Export

Import/Export is an Azure Redis Cache data management operation which allows you to import data into Azure Redis Cache or export data from Azure Redis Cache by importing and exporting a Redis Cache Database (RDB) snapshot from a premium cache to a page blob in an Azure Storage Account. This enables you to migrate between different Azure Redis Cache instances or populate the cache with data before use.

Import can be used to bring Redis compatible RDB file(s) from any Redis server running in any cloud or environment, including Redis running on Linux, Windows, or any cloud provider such as Amazon Web Services and others. Importing data is an easy way to create a cache with pre-populated data. During the import process Azure Redis Cache loads the RDB files from Azure storage into memory and then inserts the keys into the cache.

Export allows you to export the data stored in Azure Redis Cache to Redis compatible RDB file(s). You can use this feature to move data from one Azure Redis Cache instance to another or to another Redis server. During the export process a temporary file is created on the VM that hosts the Azure Redis Cache server instance, and the file is uploaded to the designated storage account. When the export operation completes with either a status of success or failure, the temporary file is deleted.

For more information, see [How to import data into and export data from Azure Redis Cache](cache-how-to-import-export-data.md).

## Reboot

The premium tier allows you to reboot one or more nodes of your cache on-demand. This allows you to test your application for resiliency in the event of a failure. You can reboot the following nodes.

-	Master node of your cache
-	Slave node of your cache
-	Both master and slave nodes of your cache
-	When using a premium cache with clustering, you can reboot the master, slave, or both nodes for individual shards in the cache

For more information, see [Reboot](cache-administration.md#reboot) and [Reboot FAQ](cache-administration.md#reboot-faq).

## Schedule updates

The scheduled updates feature allows you to designate a maintenance window for your cache. When the maintenance window is specified, any Redis server updates are made during this window. To designate a maintenance window, select the desired days and specify the maintenance window start hour for each day. Note that the maintenance window time is in UTC. 

For more information, see [Schedule updates](cache-administration.md#schedule-updates) and [Schedule updates FAQ](cache-administration.md#schedule-updates-faq).

>[AZURE.NOTE] Only Redis server updates are made during the scheduled maintenance window. The maintenance window does not apply to Azure updates or updates to the VM operating system.

## To scale to the premium tier

To scale to the premium tier, simply choose one of the premium tiers in the **Change pricing tier** blade. You can also scale your cache to the premium tier using PowerShell and CLI. For step-by-step instructions, see [How to Scale Azure Redis Cache](cache-how-to-scale.md) and [How to automate a scaling operation](cache-how-to-scale.md#how-to-automate-a-scaling-operation).

## Next steps

Create a cache and explore the new premium tier features.

-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
-	[How to import data into and export data from Azure Redis Cache](cache-how-to-import-export-data.md)
-	[How to administer Azure Redis Cache](cache-administration.md)
  

