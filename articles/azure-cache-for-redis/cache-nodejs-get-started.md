---
title: 'Quickstart: Use Azure Cache for Redis in Node.js'
description: In this quickstart, learn how to use Azure Cache for Redis with Node.js and node_redis.
author: flang-msft
ms.service: cache
ms.devlang: javascript
ms.topic: quickstart
ms.date: 02/16/2023
ms.author: franlanglois
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-js, mode-api, engagement-fy23
#Customer intent: As a Node.js developer, new to Azure Cache for Redis, I want to create a new Node.js app that uses Azure Cache for Redis.
---
# Quickstart: Use Azure Cache for Redis in Node.js

In this quickstart, you incorporate Azure Cache for Redis into a Node.js app to have access to a secure, dedicated cache that is accessible from any application within Azure.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [node_redis](https://github.com/mranney/node_redis), which you can install with the command `npm install redis`.

For examples of using other Node.js clients, see the individual documentation for the Node.js clients listed at [Node.js Redis clients](https://redis.io/clients#nodejs).

## Create a cache

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Add environment variables for your **HOST NAME** and **Primary** access key. Use these variables from your code instead of including the sensitive information directly in your code.

```powershell
set AZURE_CACHE_FOR_REDIS_HOST_NAME=contosoCache
set AZURE_CACHE_FOR_REDIS_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Connect to the cache

The latest builds of [node_redis](https://github.com/mranney/node_redis) provide support several connection options. Don't create a new connection for each operation in your code. Instead, reuse connections as much as possible.

## Create a new Node.js app

1. Create a new script file named *redistest.js*. 
1. Use the command to install a redis package.

    ```bash
    `npm install redis`
    ```

1. Add the following example JavaScript to the file. 


    ```javascript
    const redis = require("redis");
    
    // Environment variables for cache
    const cacheHostName = process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME;
    const cachePassword = process.env.AZURE_CACHE_FOR_REDIS_ACCESS_KEY;
    
    if(!cacheHostName) throw Error("AZURE_CACHE_FOR_REDIS_HOST_NAME is empty")
    if(!cachePassword) throw Error("AZURE_CACHE_FOR_REDIS_ACCESS_KEY is empty")
    
    async function testCache() {
    
        // Connection configuration
        const cacheConnection = redis.createClient({
            // rediss for TLS
            url: `rediss://${cacheHostName}:6380`,
            password: cachePassword
        });
    
        // Connect to Redis
        await cacheConnection.connect();
    
        // PING command
        console.log("\nCache command: PING");
        console.log("Cache response : " + await cacheConnection.ping());
    
        // GET
        console.log("\nCache command: GET Message");
        console.log("Cache response : " + await cacheConnection.get("Message"));
    
        // SET
        console.log("\nCache command: SET Message");
        console.log("Cache response : " + await cacheConnection.set("Message",
            "Hello! The cache is working from Node.js!"));
    
        // GET again
        console.log("\nCache command: GET Message");
        console.log("Cache response : " + await cacheConnection.get("Message"));
    
        // Client list, useful to see if connection list is growing...
        console.log("\nCache command: CLIENT LIST");
        console.log("Cache response : " + await cacheConnection.sendCommand(["CLIENT", "LIST"]));
    
        // Disconnect
        cacheConnection.disconnect()
    
        return "Done"
    }
    
    testCache().then((result) => console.log(result)).catch(ex => console.log(ex));
    ```
    
    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node_redis](https://github.com/mranney/node_redis) client, see [https://redis.js.org/](https://redis.js.org/).


1. Run the script with Node.js.

    ```bash
    node redistest.js
    ```

1. Example the output. 

    ```console
    Cache command: PING
    Cache response : PONG
    
    Cache command: GET Message
    Cache response : Hello! The cache is working from Node.js!
    
    Cache command: SET Message
    Cache response : OK
    
    Cache command: GET Message
    Cache response : Hello! The cache is working from Node.js!
    
    Cache command: CLIENT LIST
    Cache response : id=10017364 addr=76.22.73.183:59380 fd=221 name= age=1 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=26 qbuf-free=32742 argv-mem=10 obl=0 oll=0 omem=0 tot-mem=61466 ow=0 owmem=0 events=r cmd=client user=default numops=6
    
    Done
    ```

## Clean up resources

If you continue to the next tutorial, can keep the resources created in this quickstart and reuse them. Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually instead of deleting the resource group.
>

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

1. In the **Filter by name** text box, enter the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group in the result list, select **...** then **Delete resource group**.

    ![Delete Azure Resource group](./media/cache-nodejs-get-started/redis-cache-delete-resource-group.png)

1. Confirm the deletion of the resource group. Enter the name of your resource group to confirm, and select **Delete**.

1. After a few moments, the resource group and all of its contained resources are deleted.

## Get the sample code

Get the [Node.js quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/nodejs) on GitHub.

## Next steps

In this quickstart, you learned how to use Azure Cache for Redis from a Node.js application. Continue to the next quickstart to use Azure Cache for Redis with an ASP.NET web app.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
