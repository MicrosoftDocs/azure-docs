<properties 
	pageTitle="Azure Redis Cache samples | Microsoft Azure" 
	description="Learn how to use Azure Redis Cache" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="06/09/2016" 
	ms.author="sdanie"/>

# Azure Redis Cache samples 

This topic provides a list of Azure Redis Cache samples, covering scenarios such as connecting to a cache, reading and writing data to and from a cache, and using the ASP.NET Redis Cache providers. Some of the samples are downloadable projects, and some provide step-by-step guidance and include code snippets but do not link to a downloadable project.

## Hello world samples

The samples in this section show the basics of connecting to an Azure Redis Cache instance and reading and writing data to the cache using a variety of languages and Redis clients.

The [Hello world](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample shows how to perform various cache operations using the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) .NET client.

This sample shows how to:

-	Use various connection options
-	Read and write objects to and from the cache using synchronous and asynchronous operations
-	Use Redis MGET/MSET commands to return values of specified keys
-	Perform Redis transactional operations
-	Work with Redis lists and sorted sets
-	Store .NET objects using JsonConvert serializers
-	Use Redis sets to implement tagging
-	Work with Redis Cluster

For more information, see the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) documentation on github, and for more usage scenarios see the [StackExchange.Redis.Tests](https://github.com/StackExchange/StackExchange.Redis/tree/master/StackExchange.Redis.Tests) unit tests.

[How to use Azure Redis Cache with Python](cache-python-get-started.md) shows how to get started with Azure Redis Cache using Python and the [redis-py](https://github.com/andymccurdy/redis-py) client.

[Work with .NET objects in the cache](cache-dotnet-how-to-use-azure-redis-cache.md#work-with-net-objects-in-the-cache) shows you one way to serialize .NET objects so you can write them to and read them from an Azure Redis Cache instance. 

## Use Redis Cache as a Scale out Backplane for ASP.NET SignalR

The [Use Redis Cache as a Scale out Backplane for ASP.NET SignalR](https://github.com/rustd/RedisSamples/tree/master/RedisAsSignalRBackplane) sample demonstrates how you can use Azure Redis Cache as a SignalR backplane. For more information about backplane, see [SignalR Scaleout with Redis](http://www.asp.net/signalr/overview/performance/scaleout-with-redis).

## Redis Cache customer query sample

This sample demonstrates compares performance between accessing data from a cache and accessing data from persistence storage. This sample has two projects.

-	[Demo how Redis Cache can improve performance by Caching data](https://github.com/rustd/RedisSamples/tree/master/RedisCacheCustomerQuerySample)
-	[Seed the Database and Cache for the demo](https://github.com/rustd/RedisSamples/tree/master/SeedCacheForCustomerQuerySample)

## ASP.NET Session State and Output Caching

The [Use Azure Redis Cache to store ASP.NET SessionState and OutputCache](https://github.com/rustd/RedisSamples/tree/master/SessionState_OutputCaching) sample demonstrates how you to use Azure Redis Cache to store ASP.NET Session and Output Cache using the SessionState and OutputCache providers for Redis.

## Manage Azure Redis Cache with MAML

The [Manage Azure Redis Cache using Azure Management Libraries](https://github.com/rustd/RedisSamples/tree/master/ManageCacheUsingMAML) sample demonstrates how can you use Azure Management Libraries to manage - (Create/ Update/ delete) your Cache. 

## Custom monitoring sample

The [Access Redis Cache Monitoring data](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) sample demonstrates how you can access monitoring data for your Azure Redis Cache outside of the Azure Portal.

## A Twitter-style clone written using PHP and Redis

The [Retwis](https://github.com/SyntaxC4-MSFT/retwis) sample is the Redis Hello World. It is a minimal Twitter-style social network clone written using Redis and PHP using the [Predis](https://github.com/nrk/predis) client. The source code is designed to be very simple and at the same time to show different Redis data structures.

## Bandwidth monitor

The [Bandwidth monitor](https://github.com/JonCole/SampleCode/tree/master/BandWidthMonitor) sample allows you to monitor the bandwidth used on the client. To measure the bandwidth, run the sample on the cache client machine, make calls to the cache, and observe the bandwidth reported by the bandwidth monitor sample.
