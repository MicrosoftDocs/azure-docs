---
title: Azure CLI Redis cache samples | Microsoft Docs
description: Azure CLI samples for Azure Redis Cache.
services: redis-cache
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 8d2de145-50c0-4f76-bf8f-fdf679f03698
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: azurecli
ms.topic: article
ms.date: 04/14/2017
ms.author: wesmc

---
# Azure CLI Samples for Azure Redis Cache

The following table includes links to bash scripts built using the Azure CLI.

| | |
|---|---|
|**Create cache**||
| [Create a cache](./scripts/create-cache.md) | Creates a resource group and a basic tier Azure Redis Cache. |
| [Create a premium cache with clustering](./scripts/create-premium-cache-cluster.md) | Creates a resource group and a premium tier cache with clustering enabled.|
| [Get cache details](./scripts/show-cache.md) | Gets details of an Azure Redis Cache instance, including provisioning status. |
| [Get the hostname, ports, and keys](./scripts/cache-keys-ports.md) | Gets the hostname, ports, and keys for an Azure Redis Cache instance. |
|**Web app plus cache**||
| [Connect a web app to a redis cache](./../app-service/scripts/app-service-cli-app-service-redis.md) | Creates an Azure web app and a redis cache, then adds the redis connection details to the app settings. |
|**Delete cache**||
| [Delete a cache](./scripts/delete-cache.md) | Deletes an Azure Redis Cache instance  |
| | |

For more information about the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and [Get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli).
