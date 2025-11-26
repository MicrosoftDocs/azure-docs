---
title: "Quickstart: Connect to Azure Managed Redis with TypeScript in a Node.js app"
description: In this quickstart, you learn how to create a Node.js app that uses Azure Managed Redis.
ms.date: 09/02/2025
ms.topic: quickstart
ms.custom:
  - mode-api
  - devx-track-ts
appliesto:
  - ✅ Azure Managed Redis
ms.devlang: typescript
ai-usage: ai-assisted
---

# Quickstart: Connect to Azure Managed Redis in a Node.js app

In this quickstart, you learn how to use an Azure Managed Redis cache from a Node.js application written in the TypeScript language and authenticate the Redis connection by using Microsoft Entra ID.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- Install [Node.js LTS](https://nodejs.org/)
- Install [TypeScript](https://www.typescriptlang.org/)
- Add the packages used in this quickstart to your project:

  ```bash
  npm install redis @redis/entraid @redis/client
  ```

- Authenticate to Azure for your development environment with [Azure CLI](/cli/azure):

  ```bash
  az login
  ```

The Quickstart sample code in this article is available on [GitHub](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/nodejs).

## Create an Azure Managed Redis instance

First, create an Azure Managed Redis cache in the Azure portal.

When you create the cache, Microsoft Entra ID authentication is enabled by default, which makes it secure from the start. For this quickstart, the cache uses a public endpoint. In production, consider using private endpoints and other network controls.

1. To create a cache with the portal, follow one of these procedures:

- [Azure Managed Redis](quickstart-create-managed-redis.md)

    Optionally, you can create a cache by using Azure CLI, PowerShell, or whichever tool you prefer.

1. [Grant yourself data access permissions in the Redis resource](entra-for-authentication.md#add-users-or-system-principal-to-your-cache). 

## Code to connect to a Redis cache

In the first part of the TypeScript code sample file, `index.ts`, configure your connection to the cache:

:::code language="typescript" source="~/azure-cache-redis-samples/quickstart/nodejs/src/index.ts" range="1-66":::

Use the `createRedisClient()` function to create a node-redis client connection to the Redis cache.

```typescript
client = createRedisClient();
await client.connect();
```

## Code to test a connection

In the next section, test the connection by using the Redis `PING` command. The Redis server returns `PONG`.

:::code language="typescript" source="~/azure-cache-redis-samples/quickstart/nodejs/src/index.ts" range="74-75":::

## Code set a key, get a key

In this section, use `SET` and `GET` commands to start writing and reading data in the Redis cache in the simplest way.

:::code language="typescript" source="~/azure-cache-redis-samples/quickstart/nodejs/src/index.ts" range="77-81":::

## Run the code

Build and run the Node.js application.

```dos
tsc
node index.js
```

The result looks like this:

```dos
Ping result: PONG
Set result: OK
Get result: Hello! The cache is working from Node.js!
```

Here, you can see this code sample in its entirety.

:::code language="typescript" source="~/azure-cache-redis-samples/quickstart/nodejs/src/index.ts":::

<!-- Clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Node.js Redis client](https://redis.io/docs/latest/develop/clients/nodejs/)
