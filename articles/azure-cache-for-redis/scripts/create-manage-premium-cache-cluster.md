---
title: Create, query, and delete a Premium Azure Cache for Redis with clustering - Azure CLI
description: This Azure CLI code sample shows how to create a 6 GB Premium tier Azure Cache for Redis with clustering enabled and two shards. It then gets details of an Azure Cache for Redis instance, including provisioning status, the hostname, ports, and keys for an Azure Cache for Redis instance. Finally, it deletes the cache.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/11/2022
ms.custom: devx-track-azurecli
---

# Create a Premium Azure Cache for Redis with clustering

In this scenario, you learn how to create a 6 GB Premium tier Azure Cache for Redis with clustering enabled and two shards. You then learn to get details of an Azure Cache for Redis instance, including provisioning status, the hostname, ports, and keys for an Azure Cache for Redis instance. Finally, you learn to delete the cache.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-premium-cache-cluster/create-manage-premium-cache-cluster.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group and a Premium tier Azure Cache for Redis with clustering enable. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az redis create](/cli/azure/redis) | Create Azure Cache for Redis instance. |
| [az redis show](/cli/azure/redis) | Retrieve details of an Azure Cache for Redis instance. |
| [az redis list-keys](/cli/azure/redis) | Retrieve access keys for an Azure Cache for Redis instance. |
| [az redis delete](/cli/azure/redis) | Delete Azure Cache for Redis instance. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

For an Azure Cache for Redis CLI script sample that creates a basic Azure Cache for Redis, see [Azure Cache for Redis](create-manage-cache.md).
