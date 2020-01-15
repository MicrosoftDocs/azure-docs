---
title: Azure CLI Azure Cache for Redis samples
description: 'Azure CLI samples for Azure Cache for Redis: Create a cache, deleting a cache, get cache details,  hostname, ports and keys, connecting a web app.'
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 04/14/2017
---
# Azure CLI Samples for Azure Cache for Redis

The following table includes links to bash scripts built using the Azure CLI.

| | |
|---|---|
|**Create cache**||
| [Create a cache](./scripts/create-cache.md) | Creates a resource group and a basic tier Azure Cache for Redis. |
| [Create a premium cache with clustering](./scripts/create-premium-cache-cluster.md) | Creates a resource group and a premium tier cache with clustering enabled.|
| [Get cache details](./scripts/show-cache.md) | Gets details of an Azure Cache for Redis instance, including provisioning status. |
| [Get the hostname, ports, and keys](./scripts/cache-keys-ports.md) | Gets the hostname, ports, and keys for an Azure Cache for Redis instance. |
|**Web app plus cache**||
| [Connect a web app to an Azure Cache for Redis](./../app-service/scripts/cli-connect-to-redis.md) | Creates an Azure web app and an Azure Cache for Redis, then adds the redis connection details to the app settings. |
|**Delete cache**||
| [Delete a cache](./scripts/delete-cache.md) | Deletes an Azure Cache for Redis instance  |
| | |

For more information about the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and [Get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli).
