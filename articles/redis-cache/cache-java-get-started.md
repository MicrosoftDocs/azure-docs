---
title: How to use Azure Redis Cache with Java | Microsoft Docs
description: Get started with Azure Redis Cache using Java
services: redis-cache
documentationcenter: ''
author: steved0x
manager: douge
editor: ''

ms.assetid: 29275a5e-2e39-4ef2-804f-7ecc5161eab9
ms.service: cache
ms.devlang: java
ms.topic: hero-article
ms.tgt_pltfrm: cache-redis
ms.workload: tbd
ms.date: 04/13/2017
ms.author: sdanie

---
# How to use Azure Redis Cache with Java
> [!div class="op_single_selector"]
> * [.NET](cache-dotnet-how-to-use-azure-redis-cache.md)
> * [ASP.NET](cache-web-app-howto.md)
> * [Node.js](cache-nodejs-get-started.md)
> * [Java](cache-java-get-started.md)
> * [Python](cache-python-get-started.md)
> 
> 

Azure Redis Cache gives you access to a dedicated Redis cache, managed by Microsoft. Your cache is accessible from any application within Microsoft Azure.

This topic shows you how to get started with Azure Redis Cache using Java.

## Prerequisites
[Jedis](https://github.com/xetorthio/jedis) - Java client for Redis

This tutorial uses Jedis, but you can use any Java client listed at [http://redis.io/clients](http://redis.io/clients).

## Create a Redis cache on Azure
[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

## Retrieve the host name and access keys
[!INCLUDE [redis-cache-create](../../includes/redis-cache-access-keys.md)]

## Connect to the cache securely using SSL
The latest builds of [jedis](https://github.com/xetorthio/jedis) provide support for connecting to Azure Redis Cache using SSL. The following example shows how to connect to Azure Redis Cache using the SSL endpoint of 6380. Replace `<name>` with the name of your cache and `<key>` with either your primary or secondary key as described in the previous [Retrieve the host name and access keys](#retrieve-the-host-name-and-access-keys) section.

    boolean useSsl = true;
    /* In this line, replace <name> with your cache name: */
    JedisShardInfo shardInfo = new JedisShardInfo("<name>.redis.cache.windows.net", 6380, useSsl);
    shardInfo.setPassword("<key>"); /* Use your access key. */

> [!NOTE]
> The non-SSL port is disabled for new Azure Redis Cache instances. If you are using a different client that doesn't support SSL, see [How to enable the non-SSL port](cache-configure.md#access-ports).
> 
> 

## Add something to the cache and retrieve it
    package com.mycompany.app;
    import redis.clients.jedis.Jedis;
    import redis.clients.jedis.JedisShardInfo;

    public class App
    {
      public static void main( String[] args )
      {
        boolean useSsl = true;
        /* In this line, replace <name> with your cache name: */
        JedisShardInfo shardInfo = new JedisShardInfo("<name>.redis.cache.windows.net", 6380, useSsl);
        shardInfo.setPassword("<key>"); /* Use your access key. */
        Jedis jedis = new Jedis(shardInfo);
        jedis.set("foo", "bar");
        String value = jedis.get("foo");
      }
    }


## Next steps
* [Enable cache diagnostics](https://msdn.microsoft.com/library/azure/dn763945.aspx#EnableDiagnostics) so you can [monitor](https://msdn.microsoft.com/library/azure/dn763945.aspx) the health of your cache.
* Read the official [Redis documentation](http://redis.io/documentation).
