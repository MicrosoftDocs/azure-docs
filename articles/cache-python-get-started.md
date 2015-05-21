<properties 
   pageTitle="How to use Azure Redis Cache with Python" 
   description="Get started with Azure Redis Cache using Python" 
   services="redis-cache" 
   documentationCenter="" 
   authors="MikeWasson" 
   manager="wpickett" 
   editor=""/>

<tags
   ms.service="cache"
   ms.devlang="python"
   ms.topic="article"
   ms.tgt_pltfrm="cache-redis"
   ms.workload="required" 
   ms.date="04/30/2015"
   ms.author="mwasson"/>

# How to use Azure Redis Cache with Python 

This topic shows how to get started with Azure Redis Cache using Python.


## Prerequisites

Install [redis-py](https://github.com/andymccurdy/redis-py).


## Create a Redis cache on Azure

In the [Azure Management Portal Preview](http://go.microsoft.com/fwlink/?LinkId=398536), click **New**, **Data + Storage**, and select **Redis Cache**. 

  ![][1]

Enter a DNS hostname. It will have the form `<name>.redis.cache.windows.net`. Click **Create**.

  ![][2]

Once the cache is created, click on it in the portal to view the cache settings. You will need:

- **Hostname.** This is what you entered when you created the cache.
- **Port.** Click the link under **Ports** to view the ports. Use the SSL port. 
- **Access Key.** Click the link under **Keys** and copy the primary key.

## Add something to the cache and retrieve it

    >>> import redis
    >>> r = redis.StrictRedis(host='<name>.redis.cache.windows.net',
          port=6380, db=0, password='<key>', ssl=True)
    >>> r.set('foo', 'bar')
    True
    >>> r.get('foo')
    b'bar'
    
Replace *&lt;name&gt;* with your cache name and *&lt;key&gt;* with your access key. 


<!--Image references-->
[1]: ./media/cache-python-get-started/cache01.png
[2]: ./media/cache-python-get-started/cache02.png

