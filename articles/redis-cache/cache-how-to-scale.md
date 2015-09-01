<properties 
	pageTitle="How to Scale Azure Redis Cache" 
	description="Learn how to scale your Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/25/2015" 
	ms.author="sdanie"/>

# How to Scale Azure Redis Cache

>[AZURE.NOTE] The Azure Redis Cache scaling feature is currently in preview.

Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features. If the requirements of your application change after a cache is created, you can scale the size of the cache using the **Change pricing tier** blade in the [Azure preview portal](https://portal.azure.com).

>[AZURE.NOTE] When you scale an Azure Redis Cache you can change the size but you can't change from a Standard to a Basic cache and vice versa.

## When to scale

You can use the [monitoring](cache-how-to-monitor.md) features of Azure Redis Cache to monitor the health and performance of your cache applications and to help determine if there is a need to scale the cache. 

You can monitor the following metrics to help determine if you need to scale.

-	Redis Server Load
-	Memory Usage
-	Network Bandwidth
-	CPU Usage

If you determine that your cache is no longer meeting the requirements of your application, you can change to a larger or smaller cache pricing tier that is right for your application. For more information on determining which cache pricing tier to use, see [What Redis Cache offering and size should I use](cache-faq.md#what-redis-cache-offering-and-size-should-i-use).

## Scale a cache
To scale your cache, [browse to the cache](cache-configure.md#configure-redis-cache-settings) in the [preview portal](https://portal.azure.com) and click the **Standard tier** or **Basic tier** part in the **Redis Cache** blade.

![Pricing tier][redis-cache-pricing-tier-part]

Select the desired pricing tier from the **Pricing tier** blade and click **Select**.

![Pricing tier][redis-cache-pricing-tier-blade]

>[AZURE.NOTE] Caches can't change plans from Basic to Standard or vice versa, and you can't scale down to a 250MB cache from one of the larger sizes. You can scale up from a 250MB cache to a larger size, but you will not be able to scale back down to the 250 MB pricing tier. If you need to change from Basic to Standard or scale down to the 250 MB size you must create a new cache.

While the cache is scaling to the new pricing tier, a **Scaling** status is displayed in the **Redis Cache** blade.

![Scaling][redis-cache-scaling]

When scaling is complete, the status changes from **Scaling** to **Running**.

>[AZURE.IMPORTANT] During scaling operations, Basic caches are offline and all data in the cache is lost. Once the scaling operation completes, the Basic cache will be back online, with no data. Standard caches remain online during a scaling operation, and no data is typically lost when scaling a Standard cache to a larger size. When scaling a Standard cache to a smaller size, some data may be lost if the new size is smaller than the amount of cached data. If data is lost when scaling down, keys are evicted using the [allkeys-lru](http://redis.io/topics/lru-cache) eviction policy. Note that while Standard caches have a 99.9% SLA for availability, there is no SLA for data loss.

## How to automate a scaling operation

In addition to scaling your Azure Redis Cache instance in the preview portal you can scale using the [Microsoft Azure Management Libraries (MAML)](http://azure.microsoft.com/updates/management-libraries-for-net-release-announcement/). To scale your cache, call the `IRedisOperations.CreateOrUpdate` method and pass in the new size for the `RedisProperties.SKU.Capacity`.

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

## After scaling, do I have to change my cache name or access keys

No, your cache name and keys are unchanged during a scaling operation.

## How does scaling work

When a **Basic** cache is scaled, it is shut down and a new cache is provisioned using the new size. During this time, the cache is unavailable and all data in the cache is lost.

When a **Standard** cache is scaled, one of the replicas is shut down and re-provisioned to the new size and the data transferred over, and then the other replica performs a failover before it is reprovisioned, similar to the process that occurs during a failure of one of the cache nodes.

## Will I lose data from my cache during scaling

When a **Basic** cache is scaled, all data is lost and the cache is unavailable during the scaling operation.

When a **Standard** cache is scaled to a larger size, all data is usually preserved. When scaling a **Standard** cache down to a smaller size, data may be lost depending on how much data is in the cache related to the new size when it is scaled. If data is lost when scaling down, keys are evicted using the [allkeys-lru](http://redis.io/topics/lru-cache) eviction policy. Note that while Standard caches have a 99.9% SLA for availability, there is no SLA for data loss.

## Will my cache be available during scaling

**Standard** caches remain available during the scaling operation.

**Basic** caches are offline during the scaling operation.

## Operations that are not supported

You can't change from a **Basic** to a **Standard** cache or vice versa during a scaling operation.

You can scale up from a **C0** (250 MB) cache to a larger size, but you can't scale a larger size down to a **C0** cache.

If a scaling operation fails, the service will try to revert the operation and the cache will revert to the original size.

## How long does scaling take

Scaling takes approximately 20 minutes, depending on how much data is in the cache.

## How can I tell when scaling is complete

In the preview portal you can see the scaling operation in progress. When scaling is complete, the status of the cache changes to **Running**.

## Why is this feature in preview

We are releasing this feature to get feedback. Based on the feedback, we will release this feature to General Availability soon.





  
<!-- IMAGES -->
[redis-cache-pricing-tier-part]: ./media/cache-how-to-scale/redis-cache-pricing-tier-part.png

[redis-cache-pricing-tier-blade]: ./media/cache-how-to-scale/redis-cache-pricing-tier-blade.png

[redis-cache-scaling]: ./media/cache-how-to-scale/redis-cache-scaling.png



