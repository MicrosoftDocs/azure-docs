---
title: Create, query, and delete a cache using Azure CLI
description: These Azure CLI code samples show how to create an Azure Managed Redis or Azure Cache for Redis instance, get cache details like status, hostname, ports, and keys, and delete the cache.


ms.devlang: azurecli
ms.topic: sample
ms.date: 05/05/2025
zone_pivot_groups: redis-type
ms.custom: devx-track-azurecli, ignite-2024
appliesto:
  - ✅ Azure Managed Redis
  - ✅ Azure Cache for Redis
---

# Create an Azure Redis cache using the Azure CLI

This article describes how how to create or delete an Azure Redis cache instance by using the Azure CLI. The article also shows how to use the CLI to get cache details including provisioning status, hostname, ports, and keys.

The scripts in this article uses the following commands. Select the links in the table to access command-specific documentation.

::: zone pivot="azure-managed-redis"

| Command | Description |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group to store all resources in. |
| [az redisenterprise create](/cli/azure/redis) | Creates an Azure Managed Redis cache instance. |
| [az redisenterprise show](/cli/azure/redis) | Shows details of an Azure Managed Redis instance. |
| [az redisenterprise list-keys](/cli/azure/redis) | Lists access keys for an Azure Managed Redis instance. |
| [az redisenterprise delete](/cli/azure/redis) | Deletes an Azure Managed Redis instance. |

::: zone-end

::: zone pivot="azure-cache-redis"

| Command | Description |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group to store all resources in. |
| [az redis create](/cli/azure/redis) | Creates an Azure Cache for Redis instance. |
| [az redis show](/cli/azure/redis) | Shows details of an Azure Cache for Redis instance. |
| [az redis list-keys](/cli/azure/redis) | Lists access keys for an Azure Cache for Redis instance. |
| [az redis delete](/cli/azure/redis) | Deletes an Azure Cache for Redis instance. |

::: zone-end

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

::: zone pivot="azure-managed-redis"

## Create an Azure Managed Redis cache

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->

The following example script sets variables, then creates a resource group and an Azure Managed Redis cache in the resource group.

```azurecli

# Variable block
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-redis-cache-rg-$randomIdentifier"
tag="create-manage-cache"
cache="msdocs-redis-cache-$randomIdentifier"
sku="Balanced_B1"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --resource-group $resourceGroup --location "$location" --tags $tag

# Create a Balanced B1 Azure Managed Redis cache
echo "Creating $cache"
az redisenterprise create --name $cache --resource-group $resourceGroup --location "$location" --sku $sku
```

## Get details for an Azure Managed Redis cache

The following script gets and displays details such as name, hostname, ports, and keys for an Azure Managed Redis cache.

```azurecli
# Get details of an Azure Managed Redis cache
echo "Showing details of $cache"
az redisenterprise show --name "$cache" --resource-group $resourceGroup 

# Retrieve the hostname and ports for an Azure Redis Cache instance
redis=($(az redisenterprise show --name "$cache" --resource-group $resourceGroup --query [hostName,enableNonSslPort,port,sslPort] --output tsv))

# Retrieve the keys for an Azure Redis Cache instance
keys=($(az redisenterprise list-keys --name "$cache" --resource-group $resourceGroup --query [primaryKey,secondaryKey] --output tsv))

# Display the retrieved hostname, keys, and ports
echo "Hostname:" ${redis[0]}
echo "Non SSL Port:" ${redis[2]}
echo "Non SSL Port Enabled:" ${redis[1]}
echo "SSL Port:" ${redis[3]}
echo "Primary Key:" ${keys[0]}
echo "Secondary Key:" ${keys[1]}

```

## Clean up resources

The following script deletes an Azure Managed Redis cache, and then deletes the resource group that contains all cache resources.

```azurecli
# Delete a redis cache
echo "Deleting $cache"
az redisenterprise delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y

```

::: zone-end

::: zone pivot="azure-cache-redis"

## Create an Azure Cache for Redis cache

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->

The following example script sets variables, then creates a resource group and an Azure Cache for Redis cache in the resource group.

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
```

## Get details for an Azure Cache for Redis cache

The following script gets and displays details such as name, hostname, ports, and keys for an Azure Cache for Redis cache.

```azurecli

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
```

## Clean up resources

The following script deletes an Azure Managed Redis cache, and then deletes the resource group that contains all cache resources.

```azurecli
# Delete a redis cache
echo "Deleting $cache"
az redis delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y

```

::: zone-end

## Related content

- For more information about the Azure CLI, see the [Azure CLI documentation](/cli/azure).
- For an Azure Managed Redis CLI script sample that creates an Azure Managed Redis cache with clustering, see [Azure Managed Redis with clustering](../../azure-cache-for-redis/scripts/create-manage-premium-cache-cluster.md).
