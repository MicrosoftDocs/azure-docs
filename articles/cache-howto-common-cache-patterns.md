<properties 
   pageTitle="Common cache patterns with Azure Redis Cache" 
   description="Learn where and why to use Azure Redis Cache" 
   services="redis-cache" 
   documentationCenter="" 
   authors="Rick-Anderson" 
   manager="wpickett" 
   editor=""/>

<tags
   ms.service="cache"
   ms.devlang="all"
   ms.topic="article"
   ms.tgt_pltfrm="cache-redis"
   ms.workload="tbd" 
   ms.date="02/21/2015"
   ms.author="riande"/>

# Common cache patterns with Azure Redis Cache

This page lists the most common benefits to using a cache.

## Optimizing data access with a cache

Using a cache can dramatically speed up data access over fetching from a data store. A cache provides high throughput and low-latency. By fetching hot data from the cache, you not only speed up your app but you can reduce the data access load and increase its responsiveness for other queries. Storing information in a cache helps save resources and increases scalability as the demands on the application increase. Your app will be much more responsive to bursty loads when it can efficiently fetch data from a cache. 

## Distributed session state
While it’s considered a best practice is to avoid using session state, some applications can actually have a performance/reduced-complexity benefit from using session data, while other apps outright require session state.  The default in memory provider for session state does not allow scale out (running multiple instances of the web site). The ASP.NET SQL Server session state provider will allow multiple web sites to use session state, but it incurs a high latency cost compared to an in memory provider. The Redis session state cache provider is a low latency alternative that is very easy to configure and set up. If your app uses only a limited amount of session state, you can use most of the cache for caching data and a small amount for session state.

## Surviving service downtime (cache fallback)
 By storing data in a cache, the application may be able to survive system failures such as network latency, Web service problems, and hardware failures. It's often better to serve cached data until your web service or database recovers, than for your app to completely fail.

## Next steps
To learn more about using the Azure Redis Cache:
 
- [Redis Azure Cache docs ](http://azure.microsoft.com/documentation/services/cache/): This page provides many good links to using the Redis Azure cache.
- [MVC movie app with Azure Redis Cache in 15 minutes](http://azure.microsoft.com/blog/2014/06/05/mvc-movie-app-with-azure-redis-cache-in-15-minutes/): The blog post provides a quick start to using the Azure Redis cache in an ASP.NET MVC app.
- [How to Use ASP.NET Session State with Azure Websites](web-sites-dotnet-session-state-caching.md): This topic explains how to use the Azure Redis Cache Service for session state.




