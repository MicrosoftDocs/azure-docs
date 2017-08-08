---
title: How to use Azure Redis Cache with Python | Microsoft Docs
description: Get started with Azure Redis Cache using Python
services: redis-cache
documentationcenter: ''
author: steved0x
manager: douge
editor: v-lincan

ms.assetid: f186202c-fdad-4398-af8c-aee91ec96ba3
ms.service: cache
ms.devlang: python
ms.topic: hero-article
ms.tgt_pltfrm: cache-redis
ms.workload: tbd
ms.date: 02/10/2017
ms.author: sdanie

---
# How to use Azure Redis Cache with Python
> [!div class="op_single_selector"]
> * [.NET](cache-dotnet-how-to-use-azure-redis-cache.md)
> * [ASP.NET](cache-web-app-howto.md)
> * [Node.js](cache-nodejs-get-started.md)
> * [Java](cache-java-get-started.md)
> * [Python](cache-python-get-started.md)
> 
> 

This topic shows you how to get started with Azure Redis Cache using Python.

## Prerequisites
Install [redis-py](https://github.com/andymccurdy/redis-py).

## Create a Redis cache on Azure
[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

## Retrieve the host name and access keys
[!INCLUDE [redis-cache-create](../../includes/redis-cache-access-keys.md)]

## Enable the non-SSL endpoint
Some Redis clients don't support SSL, and by default the [non-SSL port is disabled for new Azure Redis Cache instances](cache-configure.md#access-ports). At the time of this writing, the [redis-py](https://github.com/andymccurdy/redis-py) client doesn't support SSL. 

[!INCLUDE [redis-cache-create](../../includes/redis-cache-non-ssl-port.md)]

## Add something to the cache and retrieve it
    >>> import redis
    >>> r = redis.StrictRedis(host='<name>.redis.cache.windows.net',
          port=6380, db=0, password='<key>', ssl=True)
    >>> r.set('foo', 'bar')
    True
    >>> r.get('foo')
    b'bar'


Replace `<name>` with your cache name and `key` with your access key.

<!--Image references-->
[1]: ./media/cache-python-get-started/redis-cache-new-cache-menu.png
[2]: ./media/cache-python-get-started/redis-cache-cache-create.png
