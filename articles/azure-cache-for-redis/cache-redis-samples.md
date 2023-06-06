---
title: Azure Cache for Redis samples
description: 'Learn how to use Azure Cache for Redis with these code samples: connecting to a cache, reading and writing data in a cache, ASP.NET Azure Cache for Redis providers.'
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.custom:
ms.topic: sample
ms.date: 05/11/2021
---
# Azure Cache for Redis samples

You'll find a list of Azure Cache for Redis samples in this article.
The samples cover scenarios such as:

* Connecting to a cache
* Reading and writing data to and from a cache
* And using the ASP.NET Azure Cache for Redis providers.

Some samples are downloadable projects. Other samples provide step-by-step guidance that includes code snippets but don't link to a downloadable project.

## Hello world samples

The samples in this section show the basics of connecting to an Azure Cache for Redis instance. The sample also shows reading and writing data to the cache using different languages and Redis clients.

The [Hello world](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample shows how to do various cache operations using the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) .NET client.

This sample shows how to:

* Use various connection options
* Read and write objects to and from the cache using synchronous and asynchronous operations
* Use Redis MGET/MSET commands to return values of specified keys
* Perform Redis transactional operations
* Work with Redis lists and sorted sets
* Store .NET objects using JsonConvert serializers
* Use Redis sets to implement tagging
* Work with Redis Cluster

For more information, see the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) documentation on GitHub. For more usage scenarios, see the [StackExchange.Redis.Tests](https://github.com/StackExchange/StackExchange.Redis/tree/main/tests) unit tests.

[How to use Azure Cache for Redis with Python](cache-python-get-started.md) shows how to get started with Azure Cache for Redis using Python and the [redis-py](https://github.com/andymccurdy/redis-py) client.

[Work with .NET objects in the cache](cache-dotnet-how-to-use-azure-redis-cache.md#work-with-net-objects-in-the-cache) shows you one way to serialize .NET objects to write them to and read them from an Azure Cache for Redis instance.

## Use Azure Cache for Redis as a Scale out Backplane for ASP.NET SignalR

The [Use Azure Cache for Redis as a Scale out Backplane for ASP.NET SignalR](https://github.com/rustd/RedisSamples/tree/master/RedisAsSignalRBackplane) sample demonstrates how to use Azure Cache for Redis as a SignalR backplane. For more information about backplane, see [SignalR Scaleout with Redis](https://www.asp.net/signalr/overview/performance/scaleout-with-redis).

## Azure Cache for Redis customer query sample

This sample compares performance between accessing data from a cache and accessing data from persistence storage. This sample has two projects.

* [Demo how Azure Cache for Redis can improve performance by Caching data](https://github.com/rustd/RedisSamples/tree/master/RedisCacheCustomerQuerySample)
* [Seed the Database and Cache for the demo](https://github.com/rustd/RedisSamples/tree/master/SeedCacheForCustomerQuerySample)

## ASP.NET Session State and Output Caching

The [Use Azure Cache for Redis to store ASP.NET SessionState and OutputCache](https://github.com/rustd/RedisSamples/tree/master/SessionState_OutputCaching) sample demonstrates:  

* How to use Azure Cache for Redis to store ASP.NET Session and Output Cache
* Using the SessionState and OutputCache providers for Redis.

## Manage Azure Cache for Redis with MAML

The [Manage Azure Cache for Redis using Azure Management Libraries](https://github.com/rustd/RedisSamples/tree/master/ManageCacheUsingMAML) sample demonstrates how to use Azure Management Libraries to manage - (Create/ Update/ delete) your cache.

## Custom monitoring sample

The [Access Azure Cache for Redis Monitoring data](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) sample demonstrates how to access monitoring data for your Azure Cache for Redis outside of the Azure portal.

## A Twitter-style clone written using PHP and Redis

The [Retwis](https://github.com/SyntaxC4-MSFT/retwis) sample is the Redis Hello World. It's a minimal Twitter-style social network clone written using Redis and PHP using the [Predis](https://github.com/nrk/predis) client. The source code is designed to be simple and at the same time to show different Redis data structures.

## Bandwidth monitor

The [Bandwidth monitor](https://github.com/JonCole/SampleCode/tree/master/BandWidthMonitor) sample allows you to monitor the bandwidth used on the client. To measure the bandwidth, run the sample on the cache client machine, make calls to the cache, and observe the bandwidth reported by the bandwidth monitor sample.
