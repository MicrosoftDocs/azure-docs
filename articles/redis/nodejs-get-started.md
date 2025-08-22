---
title: "Quickstart: Use Azure Cache for Redis with JavaScript"
description: In this quickstart, you learn how to create a JavaScript app that uses Azure Cache for Redis.
ms.date: 08/22/2025
ms.topic: quickstart
ms.custom:
  - mode-api
  - devx-track-js
  - devx-track-ts
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis
ms.devlang: javascript
ai-usage: ai-assisted
---

# Quickstart: Use Azure Redis with JavaScript

In this article, you learn how to use an Azure Redis cache for JavaScript with the TypeScriptlanguage and connect using Microsoft Entra ID.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Install [Node.js LTS](https://nodejs.org/)
- Install [TypeScript](https://www.typescriptlang.org/)
- Add [imports for the Node.js Redis application](https://redis.io/docs/latest/develop/clients/nodejs/) to your project and to your development environment
  - [`@azure/identity-broker`](https://www.npmjs.com/package/@azure/identity-broker)
  - [`@redis/client`](https://www.npmjs.com/package/@redis/client)
  - [`@redis/entraid`](https://www.npmjs.com/package/@redis/entraid)
  - [`redis`](https://www.npmjs.com/package/redis)

## Create an Azure Managed Redis instance

First, create a cache. You can create a cache using Azure Managed Redis or Azure Cache for Redis using the Azure portal. In this Quickstart, we use Azure Managed Redis.

When you create the cache, Microsoft Entra ID is enabled by default making it secure from the start. Your cache must also use a public endpoint for this QuickStart. You must to [authenticated in your local development environment](/azure/developer/javascript/sdk/authentication/local-development-environment-developer-account). 

To create a cache with the portal, follow one of these procedures:

- [Azure Managed Redis](quickstart-create-managed-redis.md)
- [Azure Cache for Redis](/azure/azure-cache-for-redis/quickstart-create-redis)

Optionally, you can create a cache using Azure CLI, PowerShell, whichever you prefer.

## Code to connect to a Redis cache

In the first part of the code sample, set your connection to the cache:

```typescript
import { useIdentityPlugin, DefaultAzureCredential } from '@azure/identity';
import { nativeBrokerPlugin } from "@azure/identity-broker";
import { EntraIdCredentialsProviderFactory, REDIS_SCOPE_DEFAULT } from '@redis/entraid';
import { createClient } from '@redis/client';

const resourceEndpoint = process.env.AZURE_MANAGED_REDIS_HOST_NAME!;
if (!resourceEndpoint) {
    console.error('AZURE_MANAGED_REDIS_HOST_NAME is not set. It should look like: rediss://YOUR-RESOURCE_NAME.redis.cache.windows.net:<YOUR-RESOURCE-PORT>. Find the endpoint in the Azure portal.');
}

useIdentityPlugin(nativeBrokerPlugin);

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

In the next section, test the connection using the Redis command `ping` that returns the `pong` string.

```typescript
const pingResult = await client.ping();
console.log('Ping result:', pingResult);
```

## Code set a key, get a key

In this section, use a basic `set` and `get` sequence to start using the Redis cache in the simplest way to get started.

```typescript
const setResult = await client.set("Message", "Hello! The cache is working from Node.js!");
console.log('Set result:', setResult);

const getResult = await client.get("Message");
console.log('Get result:', getResult);
```

Before you can run this code, you must add yourself as a Redis user.

You must also [authorize your connection](/azure/developer/javascript/sdk/authentication/local-development-environment-developer-account) to Azure from the command line using the Azure command line or Azure developer command line (azd).

You should also [add users or a System principal to your cache](entra-for-authentication.md#add-users-or-system-principal-to-your-cache). Add anyone who might run the program as a user on the Redis cache.

The result looks like this:

```console
Ping result: PONG
Set result: OK
Get result: Hello! The cache is working from Node.js!
```

Here, you can see this code sample in its entirety.

```typescript

import { useIdentityPlugin, DefaultAzureCredential } from '@azure/identity';
import { nativeBrokerPlugin } from "@azure/identity-broker";
import { EntraIdCredentialsProviderFactory, REDIS_SCOPE_DEFAULT } from '@redis/entraid';
import { createClient } from '@redis/client';

const resourceEndpoint = process.env.AZURE_MANAGED_REDIS_HOST_NAME!;
if (!resourceEndpoint) {
    console.error('AZURE_MANAGED_REDIS_HOST_NAME is not set. It should look like: rediss://YOUR-RESOURCE_NAME.redis.cache.windows.net:<YOUR-RESOURCE-PORT>. Find the endpoint in the Azure portal.');
}

useIdentityPlugin(nativeBrokerPlugin);

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
    await client.close();
}
```

<!-- Clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Node.js Redis client](https://redis.io/docs/latest/develop/clients/nodejs/)
