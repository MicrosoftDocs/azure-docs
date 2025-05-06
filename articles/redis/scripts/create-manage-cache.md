---
title: Create, query, and delete a cache using Azure CLI
description: Use the Azure CLI to create an Azure Redis instance, get cache details like status, hostname, ports, and keys, and delete the cache.


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

This article describes how to create or delete an Azure Redis cache instance by using the Azure CLI. The article also shows how to use the Azure CLI to get cache details including provisioning status, hostname, ports, and keys.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- Make sure you're signed in to Azure with the subscription you want to create your cache under. To use a different subscription than the one you're signed in with, run `az account set -s <subscriptionId>`, replacing `<subscriptionId>` with the subscription ID you want to use.

## Create an Azure Redis cache

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->
The cache `name` must be a string of 1-63 characters that's unique in the [Azure region](https://azure.microsoft.com/regions/). The name can contain only numbers, letters, and hyphens, must start and end with a number or letter, and can't contain consecutive hyphens.

The `location` should be an Azure region near other services that use your cache. Use a [sku](https://azure.microsoft.com/pricing/details/cache/) and `size` that have the appropriate features and performance for your cache.

Microsoft Entra authentication is enabled by default for new caches, and access keys authentication is disabled. You can enable access key authentication during or after cache creation, but for security and ease of use, Microsoft Entra authentication is recommended.

Transport Layer Security (TLS) 1.2-1.3 encryption is enabled by default for new caches. You can enable the non-TLS port and connections during or after cache creation, but for security reasons, disabling TLS isn't recommended.

>[!IMPORTANT]
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra ID for cache authentication](../../azure-cache-for-redis/cache-azure-active-directory-for-authentication.md).

::: zone pivot="azure-managed-redis"

>[!IMPORTANT]
>The following settings can be enabled or configured only at cache creation time. Gather the information you need to configure these settings and make sure to configure them correctly during cache creation.
>- You must enable modules at the time you create the cache instance. You can't change modules or enable module configuration after you create a cache.
>- Managed Redis supports two clustering policies: Enterprise or OSS. You can't change the clustering policy after you create the cache.
>- If you're using the cache in a geo-replication group, you can't change eviction policies after the cache is created.
>- The [RediSearch](../redis-modules.md#redisearch) module requires the Enterprise cluster policy and No Eviction eviction policy.

The following script sets variables, then uses the [az group create](/cli/azure/group) and [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) commands to create a resource group and create a Balanced B1 Azure Managed Redis cache in the resource group.

>[!NOTE]
>The [az redisenterprise](/cli/azure/redisenterprise) commands are part of the `redisenterprise` extension for the Azure CLI, version 2.61.0 or higher. The extension automatically installs the first time you run an `az redisenterprise` command.

```azurecli

# Variable block
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="redis-cache-rg-$randomIdentifier"
tag="create-manage-cache"
cache="redis-cache-$randomIdentifier"
sku="Balanced_B1"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --resource-group $resourceGroup --location "$location" --tags $tag

# Create a Balanced B1 Azure Managed Redis cache
echo "Creating $cache"
az redisenterprise create --name $cache --resource-group $resourceGroup --location "$location" --sku $sku
```

## Get details for an Azure Managed Redis cache

The following script uses the [az redisenterprise show](/cli/azure/redisenterprise#az-redisenterprise-show) and [az redisenterprise list-keys](/cli/azure/redisenterprise#az-redisenterprise-list-keys) commands to get and display name, hostname, ports, and keys details for an Azure Managed Redis cache.

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

The following script uses the [az group delete](/cli/azure/group) and [az redisenterprise delete](/cli/azure/redisenterprise#az-redisenterprise-delete) commands to delete an Azure Managed Redis cache, and then delete the resource group that contains all cache resources.

```azurecli
# Delete a redis cache
echo "Deleting $cache"
az redisenterprise delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y
```

::: zone-end

::: zone pivot="azure-cache-redis"

The following script sets variables, then uses the [az group create](/cli/azure/group) and [az redis create](/cli/azure/redis#az-redis-create) commands to create a resource group and create an Azure Cache for Redis Basic C0 cache in the resource group.

```azurecli

# Variable block
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="redis-cache-rg-$randomIdentifier"
tag="create-manage-cache"
cache="redis-cache-$randomIdentifier"
sku="basic"
size="C0"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --resource-group $resourceGroup --location "$location" --tags $tag

# Create a Basic C0 (256 MB) Azure Redis cache
echo "Creating $cache"
az redis create --name $cache --resource-group $resourceGroup --location "$location" --sku $sku --vm-size $size
```

## Get details for an Azure Cache for Redis cache

The following script uses the [az redis show](/cli/azure/redis#az-redis-show) and [az redis list-keys](/cli/azure/redis#az-redis-list-keys) commands to get and display name, hostname, ports, and keys details for an Azure Cache for Redis cache.

```azurecli

# Get details of an Azure Cache for Redis cache
echo "Showing details of $cache"
az redis show --name "$cache" --resource-group $resourceGroup

# Retrieve the hostname and ports for an Azure Redis instance
redis=($(az redis show --name "$cache" --resource-group $resourceGroup --query [hostName,enableNonSslPort,port,sslPort] --output tsv))

# Retrieve the keys for an Azure Redis instance
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

The following script uses the [az group delete](/cli/azure/group) and [az redis delete](/cli/azure/redis#az-redis-delete) commands to delete an Azure Cache for Redis cache, and then delete the resource group that contains all cache resources.

```azurecli
# Delete an Azure Redis cache
echo "Deleting $cache"
az redis delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y

```

::: zone-end

## Related content

- For more information about the Azure CLI, see the [Azure CLI documentation](/cli/azure).
- For an Azure Managed Redis CLI script sample that creates an Azure Managed Redis cache with clustering, see [Azure Managed Redis with clustering](../../azure-cache-for-redis/scripts/create-manage-premium-cache-cluster.md).
