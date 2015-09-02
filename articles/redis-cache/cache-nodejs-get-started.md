<properties
	pageTitle="How to use Azure Redis Cache with Node.js | Microsoft Azure"
	description="Get started with Azure Redis Cache using Node.js and node_redis."
	services="redis-cache"
	documentationCenter=""
	authors="steved0x"
	manager="dwrede"
	editor="v-lincan"/>

<tags
	ms.service="cache"
	ms.devlang="nodejs"
	ms.topic="hero-article"
	ms.tgt_pltfrm="cache-redis"
	ms.workload="tbd"
	ms.date="08/25/2015"
	ms.author="sdanie"/>

# How to use Azure Redis Cache with Node.js

Azure Redis Cache gives you access to a secure, dedicated Redis cache, managed by Microsoft. Your cache is accessible from any application within Microsoft Azure.

This topic shows you how to get started with Azure Redis Cache using Node.js. For another example of using Azure Redis Cache with Node.js, see [Build a Node.js Chat Application with Socket.IO on an Azure Website][].


## Prerequisites

Install [node_redis](https://github.com/mranney/node_redis):

    npm install redis

This tutorial uses [node_redis](https://github.com/mranney/node_redis), but you can use any Node.js client listed at [http://redis.io/clients](http://redis.io/clients).

## Create a Redis cache on Azure

In the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=398536), click **New**, **Data + Storage**, and select **Redis Cache**.

  ![][1]

Enter a DNS hostname. It will have the form `<name>.redis.cache.windows.net`. Click **Create**.

  ![][2]


Once you create the cache, click on it in the preview portal to view the cache settings. Click the link under **Keys** and copy the primary key. You need this to authenticate requests.

  ![][4]


## Enable the non-SSL endpoint


Click the link under **Ports**, and click **No** for "Allow access only via SSL". This enables the non-SSL port for the cache. The node_redis client currently does not support SSL.

  ![][3]


## Add something to the cache and retrieve it

	var redis = require("redis");

    // Add your cache name and access key.
	var client = redis.createClient(6379,'<name>.redis.cache.windows.net', {auth_pass: '<key>' });

	client.set("foo", "bar", function(err, reply) {
	    console.log(reply);
	});

	client.get("foo",  function(err, reply) {
	    console.log(reply);
	});


Output:

	OK
	bar


## Next steps

- [Enable cache diagnostics](cache-how-to-monitor.md#enable-cache-diagnostics) so you can [monitor](cache-how-to-monitor.md) the health of your cache.
- Read the official [Redis documentation](http://redis.io/documentation).


<!--Image references-->
[1]: ./media/cache-nodejs-get-started/cache01.png
[2]: ./media/cache-nodejs-get-started/cache02.png
[3]: ./media/cache-nodejs-get-started/cache03.png
[4]: ./media/cache-nodejs-get-started/cache04.png

[Build a Node.js Chat Application with Socket.IO on an Azure Website]: ../app-service-web/web-sites-nodejs-chat-app-socketio.md
