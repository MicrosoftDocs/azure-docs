---
title: Create, query, and delete an Azure Cache for Redis - Azure CLI
description: This Azure CLI code sample shows how to create an Azure Cache for Redis instance using the command az redis create. It then gets details of an Azure Cache for Redis instance, including provisioning status, the hostname, ports, and keys for an Azure Cache for Redis instance. Finally, it deletes the cache.
author: flang-msft
ms.service: cache
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/11/2022
ms.author: franlanglois 
ms.custom: devx-track-azurecli
---

# Create an Azure Cache for Redis using the Azure CLI

In this scenario, you learn how to create an Azure Cache for Redis. You then learn to get details of an Azure Cache for Redis instance, including provisioning status, the hostname, ports, and keys for an Azure Cache for Redis instance. Finally, you learn to delete the cache.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->

```azurecli

# Variable block
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-redis-cache-rg-$randomIdentifier"
tag="create-manage-cache"
cache="msdocs-redis-cache-$randomIdentifier"
sku="basic"
size="C0"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --resource-group $resourceGroup --location "$location" --tags $tag

# Create a Basic C0 (256 MB) Redis Cache
echo "Creating $cache"
az redis create --name $cache --resource-group $resourceGroup --location "$location" --sku $sku --vm-size $size

# Get details of an Azure Cache for Redis
echo "Showing details of $cache"
az redis show --name "$cache" --resource-group $resourceGroup 

# Retrieve the hostname and ports for an Azure Redis Cache instance
redis=($(az redis show --name "$cache" --resource-group $resourceGroup --query [hostName,enableNonSslPort,port,sslPort] --output tsv))

# Retrieve the keys for an Azure Redis Cache instance
keys=($(az redis list-keys --name "$cache" --resource-group $resourceGroup --query [primaryKey,secondaryKey] --output tsv))

# Display the retrieved hostname, keys, and ports
echo "Hostname:" ${redis[0]}
echo "Non SSL Port:" ${redis[2]}
echo "Non SSL Port Enabled:" ${redis[1]}
echo "SSL Port:" ${redis[3]}
echo "Primary Key:" ${keys[0]}
echo "Secondary Key:" ${keys[1]}

# Delete a redis cache
echo "Deleting $cache"
az redis delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y

```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --reourceg $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group and an Azure Cache for Redis. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az redis create](/cli/azure/redis) | Create Azure Cache for Redis instance. |
| [az redis show](/cli/azure/redis) | Retrieve details of an Azure Cache for Redis instance. |
| [az redis list-keys](/cli/azure/redis) | Retrieve access keys for an Azure Cache for Redis instance. |
| [az redis delete](/cli/azure/redis) | Delete Azure Cache for Redis instance. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

For an Azure Cache for Redis CLI script sample that creates a premium Azure Cache for Redis with clustering, see [Premium Azure Cache for Redis with Clustering](create-manage-premium-cache-cluster.md).
