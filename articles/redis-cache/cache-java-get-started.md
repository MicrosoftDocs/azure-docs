<properties
   pageTitle="How to use Azure Redis Cache with Java | Microsoft Azure"
	description="Get started with Azure Redis Cache using Java"
	services="redis-cache"
	documentationCenter=""
	authors="steved0x"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="cache"
	ms.devlang="java"
	ms.topic="hero-article"
	ms.tgt_pltfrm="cache-redis"
	ms.workload="tbd"
	ms.date="08/25/2015"
	ms.author="sdanie"/>

# How to use Azure Redis Cache with Java

Azure Redis Cache gives you access to a dedicated Redis cache, managed by Microsoft. Your cache is accessible from any application within Microsoft Azure.

This topic shows you how to get started with Azure Redis Cache using Java.


## Prerequisites

[Jedis](https://github.com/xetorthio/jedis) - Java client for Redis

This tutorial uses Jedis, but you can use any Java client listed at [http://redis.io/clients](http://redis.io/clients).


## Create a Redis cache on Azure

In the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=398536), click **New**, **Data + Storage**, and select **Redis Cache**.

  ![][1]

Enter a DNS hostname. It will have the form `<name>.redis.cache.windows.net`. Click **Create**.

  ![][2]


Once you create the cache, click on it in the preview portal to view the cache settings. Click the link under **Keys** and copy the primary key. You need this to authenticate requests.

  ![][4]


## Enable the non-SSL endpoint


Click the link under **Ports**, and click **No** for "Allow access only via SSL". This enables the non-SSL port for the cache. The Jedis client currently does not support SSL.

  ![][3]


## Add something to the cache and retrieve it

	package com.mycompany.app;
	import redis.clients.jedis.Jedis;
	import redis.clients.jedis.JedisShardInfo;

	/* Make sure you turn on non-SSL port in Azure Redis using the Configuration section in the preview portal */
	public class App
	{
	  public static void main( String[] args )
	  {
        /* In this line, replace <name> with your cache name: */
	    JedisShardInfo shardInfo = new JedisShardInfo("<name>.redis.cache.windows.net", 6379);
	    shardInfo.setPassword("<key>"); /* Use your access key. */
	    Jedis jedis = new Jedis(shardInfo);
     	jedis.set("foo", "bar");
     	String value = jedis.get("foo");
	  }
	}


## Next steps

- [Enable cache diagnostics](https://msdn.microsoft.com/library/azure/dn763945.aspx#EnableDiagnostics) so you can [monitor](https://msdn.microsoft.com/library/azure/dn763945.aspx) the health of your cache.
- Read the official [Redis documentation](http://redis.io/documentation).


<!--Image references-->
[1]: ./media/cache-java-get-started/cache01.png
[2]: ./media/cache-java-get-started/cache02.png
[3]: ./media/cache-java-get-started/cache03.png
[4]: ./media/cache-java-get-started/cache04.png
