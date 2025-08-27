---
title: "Quickstart: Use Azure Cache for Redis with TypeScript in a Node.js app"
description: In this quickstart, you learn how to create a Node.js app that uses Azure Managed Redis.
ms.date: 08/22/2025
ms.topic: quickstart
ms.custom:
  - mode-api
  - devx-track-js
  - devx-track-ts
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis
ms.devlang: typescript
ai-usage: ai-assisted
---

# Quickstart: Use Azure Redis with JavaScript

In this quickstart, you learn how to use an Azure Redis cache from a client application written in the TypeScript language and authenticate the Redis connection using Microsoft Entra ID.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Install [Node.js LTS](https://nodejs.org/)
- Install [TypeScript](https://www.typescriptlang.org/)
- Add the packages used in this quickstart to your project:

  ```bash
  npm install @azure/identity @azure/identity-broker redis @redis/entraid @redis/client
  ```

- Authenticate to Azure for your development environment with [Azure CLI](/cli/azure):

  ```bash
  az login
  ```

## Create an Azure Managed Redis instance

First, create a cache. You can create a cache by using Azure Managed Redis or Azure Cache for Redis with the Azure portal. In this quickstart, we use Azure Managed Redis.

When you create the cache, Microsoft Entra ID authentication is enabled by default, which makes it secure from the start. For this quickstart, the cache uses a public endpoint. In production, consider using private endpoints and other network controls.

1. To create a cache with the portal, follow one of these procedures:

- [Azure Managed Redis](quickstart-create-managed-redis.md)

    Optionally, you can create a cache by using Azure CLI, PowerShell, or whichever tool you prefer.

2. Add yourself as a [Redis user to the resource](entra-for-authentication.md#add-users-or-system-principal-to-your-cache). 

## Code to connect to a Redis cache

In the first part of the TypeScript code sample, configure your connection to the cache:

```typescript
import { DefaultAzureCredential } from '@azure/identity';
import { EntraIdCredentialsProviderFactory, REDIS_SCOPE_DEFAULT } from '@redis/entraid';
import { createClient } from '@redis/client';

const resourceEndpoint = process.env.AZURE_MANAGED_REDIS_HOST_NAME!;
if (!resourceEndpoint) {
    console.error('AZURE_MANAGED_REDIS_HOST_NAME is not set. It should look like: rediss://YOUR-RESOURCE_NAME.redis.cache.windows.net:<YOUR-RESOURCE-PORT>. Find the endpoint in the Azure portal.');
}

function getClient() {

    if (!resourceEndpoint) throw new Error('AZURE_MANAGED_REDIS_HOST_NAME must be set');

    const credential = new DefaultAzureCredential();

    const provider = EntraIdCredentialsProviderFactory.createForDefaultAzureCredential({
        credential,
        scopes: REDIS_SCOPE_DEFAULT,
        options: {},
        tokenManagerConfig: {
            expirationRefreshRatio: 0.8
        }
    });

    const client = createClient({
        url: resourceEndpoint,
        credentialsProvider: provider,
        socket: {
            reconnectStrategy: (retries) => Math.min(100 + retries * 50, 2000)
        }

    });

    client.on('error', (err) => console.error('Redis client error:', err));

    return client;
}

const client = getClient();
await client.connect();
```

## Code to test a connection

In the next section, test the connection by using the Redis command `ping`. This command returns the `pong` string.

```typescript
const pingResult = await client.ping();
console.log('Ping result:', pingResult);
```

## Code set a key, get a key

In this section, use a basic `set` and `get` sequence to start using the Redis cache in the simplest way.

```typescript
const setResult = await client.set("Message", "Hello! The cache is working from Node.js!");
console.log('Set result:', setResult);


const getResult = await client.get("Message");
console.log('Get result:', getResult);
```

## Run the code

Build (`tsc`) and run this code (`node index.js`).

The result looks like this:

```console
Ping result: PONG
Set result: OK
Get result: Hello! The cache is working from Node.js!
```

Here, you can see this code sample in its entirety.

```typescript
import { DefaultAzureCredential } from '@azure/identity';
import { EntraIdCredentialsProviderFactory, REDIS_SCOPE_DEFAULT } from '@redis/entraid';
import { createClient } from '@redis/client';

const resourceEndpoint = process.env.AZURE_MANAGED_REDIS_HOST_NAME!;
if (!resourceEndpoint) {
    console.error('AZURE_MANAGED_REDIS_HOST_NAME is not set. It should look like: rediss://YOUR-RESOURCE_NAME.redis.cache.windows.net:<YOUR-RESOURCE-PORT>. Find the endpoint in the Azure portal.');
}

function getClient() {

    if (!resourceEndpoint) throw new Error('AZURE_MANAGED_REDIS_HOST_NAME must be set');

    const credential = new DefaultAzureCredential();

    const provider = EntraIdCredentialsProviderFactory.createForDefaultAzureCredential({
        credential,
        scopes: REDIS_SCOPE_DEFAULT,
        options: {},
        tokenManagerConfig: {
            expirationRefreshRatio: 0.8
        }
    });

    const client = createClient({
        url: resourceEndpoint,
        credentialsProvider: provider,
        socket: {
            reconnectStrategy: (retries) => Math.min(100 + retries * 50, 2000)
        }

    });

    client.on('error', (err) => console.error('Redis client error:', err));


    return client;
}

const client = getClient();

try {

    await client.connect();

    const pingResult = await client.ping();
    console.log('Ping result:', pingResult);

    const setResult = await client.set("Message", "Hello! The cache is working from Node.js!");
    console.log('Set result:', setResult);

    const getResult = await client.get("Message");
    console.log('Get result:', getResult);

} catch (err) {
    console.error('Error closing Redis client:', err);
} finally {
    await client.quit();
}
```

<!-- Clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Node.js Redis client](https://redis.io/docs/latest/develop/clients/nodejs/)
