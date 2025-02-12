---
title: 'Quickstart: Use Azure Cache for Redis in Node.js'
description: In this quickstart, learn how to use Azure Managed Redis or Azure Cache for Redis with Node.js and node_redis.


ms.devlang: javascript
ms.topic: quickstart
ms.date: 06/04/2024
ms.custom: mvc, devx-track-js, mode-api, engagement-fy23, ignite-2024
zone_pivot_groups: redis-type
#Customer intent: As a Node.js developer, new to Azure Redis, I want to create a new Node.js app that uses Azure Managed Redis or Azure Cache for Redis.
---
# Quickstart: Use Azure Redis in Node.js

In this quickstart, you incorporate Azure Managed Redis (preview) or Azure Cache for Redis into a Node.js app. The app has access to a secure, dedicated cache that is accessible from any application within Azure.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Node.js installed -  To install Node.js, see [Install Node.js on Windows](/windows/dev-environment/javascript/nodejs-on-windows) for instructions on how to install Node and npm on a Windows computer.

::: zone pivot="azure-managed-redis"

## Create an Azure Managed Redis (preview) instance

[!INCLUDE [managed-redis-create](includes/managed-redis-create.md)]

::: zone-end

::: zone pivot="azure-cache-redis"

## Create an Azure Cache for Redis instance

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

::: zone-end

## Install the node-redis client library

The [node-redis](https://github.com/redis/node-redis) library is the primary Node.js client for Redis. You can install the client with [npm](https://docs.npmjs.com/about-npm) by using the following command:

```bash
npm install redis
```

::: zone pivot="azure-managed-redis"

## Create a Node.js app to access a cache

Create a Node.js app that uses either Microsoft Entra ID or access keys to connect to an Azure Managed Redis (preview) instance. We recommend you use Microsoft Entra ID.

## [Microsoft Entra ID Authentication (recommended)](#tab/entraid)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the JavaScript Azure Identity client library

The [Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview) allows you to acquire security tokens from Microsoft identity to authenticate users. There's a [JavaScript Azure identity client library](/javascript/api/overview/azure/identity-readme) available that uses MSAL to provide token authentication support. Install this library using `npm`:

```bash
npm install @azure/identity
```

### Create a new Node.js app using Microsoft Entra ID

1. Add environment variables for your **Host name** and **Service Principal ID**, which is the object ID of your Microsoft Entra ID service principal or user. In the Azure portal, look for the _Username_.

    ```cmd
    set AZURE_MANAGED_REDIS_HOST_NAME=contosoCache
    set REDIS_SERVICE_PRINCIPAL_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    ```

1. Create a new script file named _redistest.js_.

1. Add the following example JavaScript to the file. This code shows you how to connect to an Azure Managed Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node-redis](https://github.com/redis/node-redis) client, see [https://redis.js.org/](https://redis.js.org/).

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
        url: `redis://${process.env.AZURE_MANAGED_REDIS_HOST_NAME}:10000`,
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

1. Run the script with Node.js.

    ```bash
    node redistest.js
    ```

1. The output of your code looks like this.

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

### Create a sample JavaScript app with reauthentication

Microsoft Entra ID access tokens have a limited lifespan, [averaging 75 minutes](/entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). In order to maintain a connection to your cache, you need to refresh the token. This example demonstrates how to do this using JavaScript.

1. Create a new script file named _redistestreauth.js_.

1. Add the following example JavaScript to the file.

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
        url: `redis://${process.env.AZURE_MANAGED_REDIS_HOST_NAME}:10000`,
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
              url: `redis://${process.env.AZURE_MANAGED_REDIS_HOST_NAME}:10000`,
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

1. Run the script with Node.js.

    ```bash
    node redistestreauth.js
    ```

1. The output of your code looks like this.

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

>[!NOTE]
>For additional examples of using Microsoft Entra ID to authenticate to Redis using the node-redis library, please see [this GitHub repo](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureCacheForRedis/node-redis.md)
>

## [Access Key Authentication](#tab/accesskey)

[!INCLUDE [redis-access-key-alert](includes/redis-access-key-alert.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Add environment variables for your **HOST NAME** and **Primary** access key. Use these variables from your code instead of including the sensitive information directly in your code.

```cmd
set AZURE_MANAGED_REDIS_HOST_NAME=contosoCache
set AZURE_MANAGED_REDIS_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Connect to the cache

>[!NOTE]
> Don't create a new connection for each operation in your code. Instead, reuse connections as much as possible.
>

### Create a new Node.js app

1. Create a new script file named _redistest.js_.

1. Add the following example JavaScript to the file.

    ```javascript
    const redis = require("redis");
    
    // Environment variables for cache
    const cacheHostName = process.env.AZURE_MANAGED_REDIS_HOST_NAME;
    const cachePassword = process.env.AZURE_MANAGED_REDIS_ACCESS_KEY;
    
    if(!cacheHostName) throw Error("AZURE_MANAGED_REDIS_HOST_NAME is empty")
    if(!cachePassword) throw Error("AZURE_MANAGED_REDIS_ACCESS_KEY is empty")
    
    async function testCache() {
    
        // Connection configuration
        const cacheConnection = redis.createClient({
            // redis for TLS
            url: `redis://${cacheHostName}:10000`,
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

    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node_redis](https://github.com/redis/node-redis) client, see [https://redis.js.org/](https://redis.js.org/).

1. Run the script with Node.js.

    ```bash
    node redistest.js
    ```

1. Example the output.

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
::: zone-end

::: zone pivot="azure-cache-redis"

## Create a Node.js app to access a cache

Create a Node.js app that uses either Microsoft Entra ID or access keys to connect to an Azure Cache for Redis. We recommend you use Microsoft Entra ID.

## [Microsoft Entra ID Authentication (recommended)](#tab/entraid)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the JavaScript Azure Identity client library

The [Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview) allows you to acquire security tokens from Microsoft identity to authenticate users. There's a [JavaScript Azure identity client library](/javascript/api/overview/azure/identity-readme) available that uses MSAL to provide token authentication support. Install this library using `npm`:

```bash
npm install @azure/identity
```

### Create a new Node.js app using Microsoft Entra ID

1. Add environment variables for your **Host name** and **Service Principal ID**, which is the object ID of your Microsoft Entra ID service principal or user. In the Azure portal, look for the _Username_.

    ```cmd
    set AZURE_CACHE_FOR_REDIS_HOST_NAME=contosoCache
    set REDIS_SERVICE_PRINCIPAL_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    ```

1. Create a new script file named _redistest.js_.

1. Add the following example JavaScript to the file. This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node-redis](https://github.com/redis/node-redis) client, see [https://redis.js.org/](https://redis.js.org/).

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

1. Run the script with Node.js.

    ```bash
    node redistest.js
    ```

1. The output of your code looks like this.

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

### Create a sample JavaScript app with reauthentication

Microsoft Entra ID access tokens have a limited lifespan, [averaging 75 minutes](/entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). In order to maintain a connection to your cache, you need to refresh the token. This example demonstrates how to do this using JavaScript.

1. Create a new script file named _redistestreauth.js_.

1. Add the following example JavaScript to the file.

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

1. Run the script with Node.js.

    ```bash
    node redistestreauth.js
    ```

1. The output of your code looks like this.

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

>[!NOTE]
>For additional examples of using Microsoft Entra ID to authenticate to Redis using the node-redis library, please see [this GitHub repo](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureCacheForRedis/node-redis.md)
>

## [Access Key Authentication](#tab/accesskey)

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Add environment variables for your **HOST NAME** and **Primary** access key. Use these variables from your code instead of including the sensitive information directly in your code.

```cmd
set AZURE_CACHE_FOR_REDIS_HOST_NAME=contosoCache
set AZURE_CACHE_FOR_REDIS_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Connect to the cache

>[!NOTE]
> Don't create a new connection for each operation in your code. Instead, reuse connections as much as possible.
>

### Create a new Node.js app

1. Create a new script file named _redistest.js_.

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

    This code shows you how to connect to an Azure Cache for Redis instance using the cache host name and key environment variables. The code also stores and retrieves a string value in the cache. The `PING` and `CLIENT LIST` commands are also executed. For more examples of using Redis with the [node_redis](https://github.com/redis/node-redis) client, see [https://redis.js.org/](https://redis.js.org/).

1. Run the script with Node.js.

    ```bash
    node redistest.js
    ```

1. Example the output.

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
::: zone-end

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Get the sample code

Get the [Node.js quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/nodejs) on GitHub.

## Related content

In this quickstart, you learned how to use either Azure Managed Redis (preview) or Azure Cache for Redis from a Node.js application. Learn more about the Azure Redis offerings:

- [Azure Managed Redis overview](managed-redis/managed-redis-overview.md)
- [Azure Cache for Redis overview](cache-overview.md)
