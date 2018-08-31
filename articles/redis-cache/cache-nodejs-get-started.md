---
title: Quickstart to learn how to use Azure Redis Cache with Node.js | Microsoft Docs
description: In this quickstart you will learn how to use Azure Redis Cache with Node.js and node_redis.
services: redis-cache
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: v-lincan

ms.assetid: 06fddc95-8029-4a8d-83f5-ebd5016891d9
ms.service: cache
ms.devlang: nodejs
ms.topic: quickstart
ms.tgt_pltfrm: cache-redis
ms.workload: tbd
ms.date: 05/21/2018
ms.author: wesmc
ms.custom: mvc
#Customer intent: As a Node.js developer, new to Azure Redis Cache, I want to create a new Node.js app that uses Redis Cache.
---
# Quickstart: How to use Azure Redis Cache with Node.js



Azure Redis Cache gives you access to a secure, dedicated Redis cache, managed by Microsoft. Your cache is accessible from any application within Microsoft Azure.

This topic shows you how to get started with Azure Redis Cache using Node.js. 

You can use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

![Cache app completed](./media/cache-nodejs-get-started/cache-app-complete.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites
Install [node_redis](https://github.com/mranney/node_redis):

    npm install redis

This tutorial uses [node_redis](https://github.com/mranney/node_redis). For examples of using other Node.js clients, see the individual documentation for the Node.js clients listed at [Node.js Redis clients](http://redis.io/clients#nodejs).


## Create a cache
[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](../../includes/redis-cache-access-keys.md)]


Add environment variables for your **HOST NAME** and **Primary** access key. You will use these variables from your code instead of including the sensitive information directly in your code.

```
set REDISCACHEHOSTNAME=contosoCache.redis.cache.windows.net
set REDISCACHEKEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```


## Connect to the cache

The latest builds of [node_redis](https://github.com/mranney/node_redis) provide support for connecting to Azure Redis Cache using SSL. The following example shows how to connect to Azure Redis Cache using the SSL endpoint of 6380. 

```js
var redis = require("redis");

// Add your cache name and access key.
var client = redis.createClient(6380, process.env.REDISCACHEHOSTNAME,
    {auth_pass: process.env.REDISCACHEKEY, tls: {servername: process.env.REDISCACHEHOSTNAME}});
```

Don't create a new connections for each operation in your code. Instead, reuse connections as much as possible. 

## Create a new Node.js app

Create a new script file named *redistest.js*.

Add the following example JavaScript to the file. This code shows you how to connect to an Azure Redis Cache instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node_redis](https://github.com/mranney/node_redis) client, see [http://redis.js.org/](http://redis.js.org/).

```js
var redis = require("redis");
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

async function testCache() {

    // Connect to the Redis cache over the SSL port using the key.
    var cacheConnection = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, 
        {auth_pass: process.env.REDISCACHEKEY, tls: {servername: process.env.REDISCACHEHOSTNAME}});
        
    // Perform cache operations using the cache connection object...

    // Simple PING command
    console.log("\nCache command: PING");
    console.log("Cache response : " + await cacheConnection.pingAsync());

    // Simple get and put of integral data types into the cache
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.getAsync("Message"));    

    console.log("\nCache command: SET Message");
    console.log("Cache response : " + await cacheConnection.setAsync("Message",
        "Hello! The cache is working from Node.js!"));    

    // Demostrate "SET Message" executed as expected...
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.getAsync("Message"));    

    // Get the client list, useful to see if connection list is growing...
    console.log("\nCache command: CLIENT LIST");
    console.log("Cache response : " + await cacheConnection.clientAsync("LIST"));    
}

testCache();
```

Run the script with Node.js.

```
node redistest.js
```

In the example below, you can see the `Message` key previously had a cached value, which was set using the Redis Console in the Azure portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

![Cache app completed](./media/cache-nodejs-get-started/cache-app-complete.png)


## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
>

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

![Delete](./media/cache-nodejs-get-started/cache-delete-resource-group.png)

You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.

After a few moments, the resource group and all of its contained resources are deleted.



## Next steps

In this quickstart, you learned how to use Azure Redis Cache from a Node.js application. Continue to the next quickstart to use Redis Cache with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Redis Cache.](./cache-web-app-howto.md)



