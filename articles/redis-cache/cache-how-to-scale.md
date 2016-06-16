<properties 
	pageTitle="How to Scale Azure Redis Cache | Microsoft Azure" 
	description="Learn how to scale your Azure Redis Cache instances" 
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
	ms.date="06/16/2016" 
	ms.author="sdanie"/>

# How to Scale Azure Redis Cache

>[AZURE.NOTE] The Azure Redis Cache scaling feature is currently in preview. 

Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features. If the requirements of your application change after a cache is created, you can scale the size of the cache using the **Change pricing tier** blade in the [Azure Portal](https://portal.azure.com).

## When to scale

You can use the [monitoring](cache-how-to-monitor.md) features of Azure Redis Cache to monitor the health and performance of your cache applications and to help determine if there is a need to scale the cache. 

You can monitor the following metrics to help determine if you need to scale.

-	Redis Server Load
-	Memory Usage
-	Network Bandwidth
-	CPU Usage

If you determine that your cache is no longer meeting the requirements of your application, you can change to a larger or smaller cache pricing tier that is right for your application. For more information on determining which cache pricing tier to use, see [What Redis Cache offering and size should I use](cache-faq.md#what-redis-cache-offering-and-size-should-i-use).

## Scale a cache
To scale your cache, [browse to the cache](cache-configure.md#configure-redis-cache-settings) in the [Azure Portal](https://portal.azure.com) and click **Settings**, **Pricing tier**.

You can also click the **Pricing tier** part in the **Redis Cache** blade.

![Pricing tier][redis-cache-pricing-tier-part]

Select the desired pricing tier from the **Pricing tier** blade and click **Select**.

![Pricing tier][redis-cache-pricing-tier-blade]

>[AZURE.NOTE] You can scale to a different pricing tier with the following restrictions.
>
>-	You can't scale from a higher pricing tier to a lower pricing tier.
>    -    You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
>    -    You can't scale from a **Standard** cache down to a **Basic** cache.
>-	You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
>-	You can't scale from a **Basic** cache directly to a **Premium** cache. You must scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
>-	You can't scale from a larger size down to the **C0 (250 MB)** size.

While the cache is scaling to the new pricing tier, a **Scaling** status is displayed in the **Redis Cache** blade.

![Scaling][redis-cache-scaling]

When scaling is complete, the status changes from **Scaling** to **Running**.

## How to automate a scaling operation

In addition to scaling your Azure Redis Cache instances in the Azure Portal, you can scale using Azure Redis Cache PowerShell cmdlets, Azure CLI, and by using the Microsoft Azure Management Libraries (MAML). 

-	[Scale using PowerShell](#scale-using-powershell)
-	[Scale using Azure CLI](#scale-using-azure-cli)
-	[Scale using MAML](#scale-using-maml)

### Scale using PowerShell

You can scale your Azure Redis Cache instances with PowerShell by using the [Set-AzureRmRedisCache](https://msdn.microsoft.com/library/azure/mt634518.aspx) cmdlet when the `Size`, `Sku`, or `ShardCount` properties are modified. The following example shows how to scale a cache named `myCache` to a 2.5 GB cache. 

	Set-AzureRmRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB

For more information on scaling with PowerShell, see [To scale a Redis cache using Powershell](cache-howto-manage-redis-cache-powershell.md#scale).

### Scale using Azure CLI

To scale your Azure Redis Cache instances using Azure CLI, call the `azure rediscache set` command and pass in the desired configuration changes that include a new size, sku, or cluster size, depending on the desired scaling operation.

For more information on scaling with Azure CLI, see [Change settings of an existing Redis Cache](cache-manage-cli.md#scale).

### Scale using MAML

To scale your Azure Redis Cache instances using the [Microsoft Azure Management Libraries (MAML)](http://azure.microsoft.com/updates/management-libraries-for-net-release-announcement/), call the `IRedisOperations.CreateOrUpdate` method and pass in the new size for the `RedisProperties.SKU.Capacity`.

    static void Main(string[] args)
    {
        // For instructions on getting the access token, see
        // https://azure.microsoft.com/documentation/articles/cache-configure/#access-keys
        string token = GetAuthorizationHeader();

        TokenCloudCredentials creds = new TokenCloudCredentials(subscriptionId,token);

        RedisManagementClient client = new RedisManagementClient(creds);
        var redisProperties = new RedisProperties();

        // To scale, set a new size for the redisSKUCapacity parameter.
        redisProperties.Sku = new Sku(redisSKUName,redisSKUFamily,redisSKUCapacity);
        redisProperties.RedisVersion = redisVersion;
        var redisParams = new RedisCreateOrUpdateParameters(redisProperties, redisCacheRegion);
        client.Redis.CreateOrUpdate(resourceGroupName,cacheName, redisParams);
    }

For more information, see the [Manage Redis Cache using MAML](https://github.com/rustd/RedisSamples/tree/master/ManageCacheUsingMAML) sample.

## Scaling FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache scaling.

-	[Can I scale to, from, or within a Premium cache?](#can-i-scale-to-from-or-within-a-premium-cache)
-	[After scaling, do I have to change my cache name or access keys?](#after-scaling-do-i-have-to-change-my-cache-name-or-access-keys)
-	[How does scaling work?](#how-does-scaling-work)
-	[Will I lose data from my cache during scaling?](#will-i-lose-data-from-my-cache-during-scaling)
-	[Is my custom databases setting affected during scaling?](#is-my-custom-databases-setting-affected-during-scaling)
-	[Will my cache be available during scaling?](#will-my-cache-be-available-during-scaling)
-	[Operations that are not supported](#operations-that-are-not-supported)
-	[How long does scaling take?](#how-long-does-scaling-take)
-	[How can I tell when scaling is complete?](#how-can-i-tell-when-scaling-is-complete)
-	[Why is this feature in preview?](#why-is-this-feature-in-preview)

### Can I scale to, from, or within a Premium cache?

-	You can't scale from a **Premium** cache down to a **Basic** or **Standard** pricing tier.
-	You can scale from one **Premium** cache pricing tier to another.
-	You can't scale from a **Basic** cache directly to a **Premium** cache. You must first scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
-	If you enabled clustering when you created your **Premium** cache, you can [change the cluster size](cache-how-to-premium-clustering.md#cluster-size). At this time you can't enable clustering on a previously existing cache that was created without clustering.

    For more information, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).

### After scaling, do I have to change my cache name or access keys?

No, your cache name and keys are unchanged during a scaling operation.

### How does scaling work?

-	When a **Basic** cache is scaled to a different size, it is shut down and a new cache is provisioned using the new size. During this time, the cache is unavailable and all data in the cache is lost.
-	When a **Basic** cache is scaled to a **Standard** cache, a replica cache is provisioned and the data is copied from the primary cache to the replica cache. The cache remains available during the scaling process.
-	When a **Standard** cache is scaled to a different size or to a **Premium** cache, one of the replicas is shut down and re-provisioned to the new size and the data transferred over, and then the other replica performs a failover before it is re-provisioned, similar to the process that occurs during a failure of one of the cache nodes.

### Will I lose data from my cache during scaling?

-	When a **Basic** cache is scaled to a new size, all data is lost and the cache is unavailable during the scaling operation.
-	When a **Basic** cache is scaled to a **Standard** cache, the data in the cache is typically preserved.
-	When a **Standard** cache is scaled to a larger size or tier, or a **Premium** cache is scaled to a larger size, all data is typically preserved. When scaling a **Standard** or **Premium** cache down to a smaller size, data may be lost depending on how much data is in the cache related to the new size when it is scaled. If data is lost when scaling down, keys are evicted using the [allkeys-lru](http://redis.io/topics/lru-cache) eviction policy. 

### Is my custom databases setting affected during scaling?

Some pricing tiers have different [databases limits](cache-configure.md#databases), so there are some considerations when scaling down if you configured a custom value for the `databases` setting during cache creation.

-	When scaling to a pricing tier with a lower `databases` limit than the current tier:
	-	If you are using the default number of `databases` which is 16 for all pricing tiers, no data is lost.
	-	If you are using a custom number of `databases` that falls within the limits for the tier to which you are scaling, this `databases` setting is retained and no data is lost.
	-	If you are using a custom number of `databases` that exceeds the limits of the new tier, the `databases` setting is lowered to the limits of the new tier and all data in the removed databases is lost.
-	When scaling to a pricing tier with the same or higher `databases` limit than the current tier your `databases` setting is retained and no data is lost.

Note that while Standard and Premium caches have a 99.9% SLA for availability, there is no SLA for data loss.

### Will my cache be available during scaling?

-	**Standard** and **Premium** caches remain available during the scaling operation.
-	**Basic** caches are offline during scaling operations to a different size, but remain available when scaling from **Basic** to **Standard**.

### Operations that are not supported

-	You can't scale from a higher pricing tier to a lower pricing tier.
    -    You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
    -    You can't scale from a **Standard** cache down to a **Basic** cache.
-	You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
-	You can't scale from a **Basic** cache directly to a **Premium** cache. You must scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
-	You can't scale from a larger size down to the **C0 (250 MB)** size.

If a scaling operation fails, the service will try to revert the operation and the cache will revert to the original size.

### How long does scaling take?

Scaling takes approximately 20 minutes, depending on how much data is in the cache.

### How can I tell when scaling is complete?

In the Azure Portal you can see the scaling operation in progress. When scaling is complete, the status of the cache changes to **Running**.

### Why is this feature in preview?

We are releasing this feature to get feedback. Based on the feedback, we will release this feature to General Availability soon.





  
<!-- IMAGES -->
[redis-cache-pricing-tier-part]: ./media/cache-how-to-scale/redis-cache-pricing-tier-part.png

[redis-cache-pricing-tier-blade]: ./media/cache-how-to-scale/redis-cache-pricing-tier-blade.png

[redis-cache-scaling]: ./media/cache-how-to-scale/redis-cache-scaling.png



