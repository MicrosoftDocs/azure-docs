---
title: 'Quickstart: Use Azure Cache for Redis with Node.js'
description: Create a Node.js app and connect the app to Azure Cache for Redis by using node_redis.


ms.devlang: javascript
ms.topic: quickstart
ms.date: 06/04/2024

ms.custom: mvc, devx-track-js, mode-api, engagement-fy23
#Customer intent: As a Node.js developer who is new to Azure Cache for Redis, I want to create a new Node.js app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a Node.js app

In this quickstart, you incorporate Azure Cache for Redis into a Node.js app for access to a secure, dedicated cache that is accessible from any application in Azure.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- Node.js installed. For information about how to install Node and npm on a Windows computer, see [Install Node.js on Windows](/windows/dev-environment/javascript/nodejs-on-windows).

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

## Install the node-redis client library

The [node-redis](https://github.com/redis/node-redis) library is the primary Node.js client for Redis. You can install the client by using [npm](https://docs.npmjs.com/about-npm) and the following command:

```bash
npm install redis
```

## Create a Node.js app to access a cache

Create a Node.js app that uses either Microsoft Entra ID or access keys to connect to Azure Cache for Redis. We recommend that you use Microsoft Entra ID.

## [Microsoft Entra ID authentication (recommended)](#tab/entraid)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the Azure Identity client library for JavaScript

The [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme) uses the required [Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview) to provide token authentication support. Install the library by using npm:

```bash
npm install @azure/identity
```

### Create a Node.js app by using Microsoft Entra ID

1. Add environment variables for your host name and service principal ID.

   The service principal ID is the object ID of your Microsoft Entra ID service principal or user. In the Azure portal, this value appears as **Username**.

    ```cmd
    set AZURE_CACHE_FOR_REDIS_HOST_NAME=contosoCache
    set REDIS_SERVICE_PRINCIPAL_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    ```

1. Create a script file named *redistest.js*.

1. Add the following example JavaScript to the file. This code shows you how to connect to an Azure Cache for Redis instance by using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node-redis](https://github.com/redis/node-redis) client, see [Node-Redis](https://redis.js.org/).

    ```javascript
    const { createClient } = require("redis");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    async function main() {
      // Construct a Token Credential from Identity library, e.g. ClientSecretCredential / ClientCertificateCredential / ManagedIdentityCredential, etc.
      const credential = new DefaultAzureCredential();
      const redisScope = "https://redis.azure.com/.default";
    
      // Fetch a Microsoft Entra token to be used for authentication. This token will be used as the password.
      let accessToken = await credential.getToken(redisScope);
      console.log("access Token", accessToken);
    
      // Create redis client and connect to the Azure Cache for Redis over the TLS port using the access token as password.
      const cacheConnection = createClient({
        username: process.env.REDIS_SERVICE_PRINCIPAL_ID,
        password: accessToken.token,
        url: `redis://${process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME}:6380`,
        pingInterval: 100000,
        socket: { 
          tls: true,
          keepAlive: 0 
        },
      });
    
      cacheConnection.on("error", (err) => console.log("Redis Client Error", err));
      await cacheConnection.connect();
    
      // PING command
      console.log("\nCache command: PING");
      console.log("Cache response : " + await cacheConnection.ping());
    
      // SET
      console.log("\nCache command: SET Message");
      console.log("Cache response : " + await cacheConnection.set("Message",
          "Hello! The cache is working from Node.js!"));
    
      // GET
      console.log("\nCache command: GET Message");
      console.log("Cache response : " + await cacheConnection.get("Message"));
    
      // Client list, useful to see if connection list is growing...
      console.log("\nCache command: CLIENT LIST");
      console.log("Cache response : " + await cacheConnection.sendCommand(["CLIENT", "LIST"]));
    
      cacheConnection.disconnect();
    
      return "Done"
    }
    
    main().then((result) => console.log(result)).catch(ex => console.log(ex));
    ```

1. Run the script by using Node.js:

    ```bash
    node redistest.js
    ```

1. Verify that the output of your code looks like this example:

    ```bash
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

### Create a sample JavaScript app that has reauthentication

Microsoft Entra ID access tokens have a limited lifespan of approximately [75 minutes](/entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). To maintain a connection to your cache, you must refresh the token.

This example demonstrates how to refresh the token by using JavaScript:

1. Create a script file named *redistestreauth.js*.

1. Add the following example JavaScript to the file:

   ```javascript
    const { createClient } = require("redis");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    async function returnPassword(credential) {
        const redisScope = "https://redis.azure.com/.default";
    
        // Fetch a Microsoft Entra token to be used for authentication. This token will be used as the password.
        return credential.getToken(redisScope);
    }
    
    async function main() {
      // Construct a Token Credential from Identity library, e.g. ClientSecretCredential / ClientCertificateCredential / ManagedIdentityCredential, etc.
      const credential = new DefaultAzureCredential();
      let accessToken = await returnPassword(credential);
    
      // Create redis client and connect to the Azure Cache for Redis over the TLS port using the access token as password.
      let cacheConnection = createClient({
        username: process.env.REDIS_SERVICE_PRINCIPAL_ID,
        password: accessToken.token,
        url: `redis://${process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME}:6380`,
        pingInterval: 100000,
        socket: { 
          tls: true,
          keepAlive: 0 
        },
      });
    
      cacheConnection.on("error", (err) => console.log("Redis Client Error", err));
      await cacheConnection.connect();
    
      for (let i = 0; i < 3; i++) {
        try {
            // PING command
            console.log("\nCache command: PING");
            console.log("Cache response : " + await cacheConnection.ping());
    
            // SET
            console.log("\nCache command: SET Message");
            console.log("Cache response : " + await cacheConnection.set("Message",
                "Hello! The cache is working from Node.js!"));
    
            // GET
            console.log("\nCache command: GET Message");
            console.log("Cache response : " + await cacheConnection.get("Message"));
    
            // Client list, useful to see if connection list is growing...
            console.log("\nCache command: CLIENT LIST");
            console.log("Cache response : " + await cacheConnection.sendCommand(["CLIENT", "LIST"]));
          break;
        } catch (e) {
          console.log("error during redis get", e.toString());
          if ((accessToken.expiresOnTimestamp <= Date.now())|| (redis.status === "end" || "close") ) {
            await redis.disconnect();
            accessToken = await returnPassword(credential);
            cacheConnection = createClient({
              username: process.env.REDIS_SERVICE_PRINCIPAL_ID,
              password: accessToken.token,
              url: `redis://${process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME}:6380`,
              pingInterval: 100000,
              socket: {
                tls: true,
                keepAlive: 0
              },
            });
          }
        }
      }
    }
    
    main().then((result) => console.log(result)).catch(ex => console.log(ex));
   ```

1. Run the script by using Node.js:

    ```bash
    node redistestreauth.js
    ```

1. Check for output that looks similar to this example:

   ```bash
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

   ```

> [!NOTE]
> For more examples of how to use Microsoft Entra ID to authenticate to Redis via the node-redis library, see the [node-redis GitHub repository](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureCacheForRedis/node-redis.md).
>

## [Access key authentication](#tab/accesskey)

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Add environment variables for your host name and primary access key. Use these variables from your code instead of including the sensitive information directly in your code.

```cmd
set AZURE_CACHE_FOR_REDIS_HOST_NAME=contosoCache
set AZURE_CACHE_FOR_REDIS_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Connect to the cache

>[!NOTE]
> Don't create a new connection for each operation in your code. Instead, reuse connections as much as possible.
>

### Create a new Node.js app

1. Create a new script file named *redistest.js*.

1. Add the following example JavaScript to the file:

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
            // redis for TLS
            url: `redis://${cacheHostName}:6380`,
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

    This code shows you how to connect to an Azure Cache for Redis instance by using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node_redis](https://github.com/redis/node-redis) client, see [Node-Redis](https://redis.js.org/).

1. Run the script by using Node.js:

    ```bash
    node redistest.js
    ```

1. Verify that the output looks similar to this example:

    ```bash
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

---

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Get the sample code

Get the [Node.js quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/nodejs) on GitHub.

## Related content

- [Create an ASP.NET web app that uses an Azure Cache for Redis](cache-web-app-howto.md)
