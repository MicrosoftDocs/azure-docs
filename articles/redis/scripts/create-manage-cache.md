---
title: Create, query, and delete a cache using Azure CLI
description: Use the Azure CLI to create an Azure Redis instance, get cache details like status, hostname, ports, and keys, and delete the cache.


ms.devlang: azurecli
ms.topic: sample
ms.date: 05/06/2025
zone_pivot_groups: redis-type
ms.custom: devx-track-azurecli, ignite-2024
appliesto:
  - ✅ Azure Managed Redis
  - ✅ Azure Cache for Redis
---

# Manage an Azure Redis cache using the Azure CLI

This article describes how to create or delete an Azure Redis cache instance by using the Azure CLI. The article also shows how to use the Azure CLI to get cache details including provisioning status, hostname, ports, and keys.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- Make sure you're signed in to Azure with the subscription you want to create your cache under. To use a different subscription than the one you're signed in with, run `az account set -s <subscriptionId>`, replacing `<subscriptionId>` with the subscription ID you want to use.

>[!NOTE]
>Azure Cache for Redis Basic, Standard, and Premium tiers use the Azure CLI [az redis](/cli/azure/redis) commands.
>
>Azure Cache for Redis Enterprise tiers and Azure Managed Redis use the [az redisenterprise](/cli/azure/redisenterprise) commands. The `redisenterprise` extension for Azure CLI version 2.61.0 or higher automatically installs the first time you run an `az redisenterprise` command.

## Create an Azure Redis cache

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->
Microsoft Entra authentication is enabled by default for new caches, and access keys authentication is disabled. You can enable access key authentication during or after cache creation, but Microsoft Entra authentication is recommended for better security.

>[!IMPORTANT]
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra ID for cache authentication](../../azure-cache-for-redis/cache-azure-active-directory-for-authentication.md).

Transport Layer Security (TLS) 1.2-1.3 encryption is enabled by default for new caches. You can enable the non-TLS port and connections during or after cache creation, but for security reasons, disabling TLS isn't recommended.

The cache `name` must be a string of 1-63 characters that's unique in the [Azure region](https://azure.microsoft.com/regions/). The name can contain only numbers, letters, and hyphens, must start and end with a number or letter, and can't contain consecutive hyphens.

The `location` should be an Azure region near other services that use your cache. Choose a [sku](https://azure.microsoft.com/pricing/details/cache/) that has the appropriate features and performance for your cache.

::: zone pivot="azure-managed-redis"

### Create an Azure Managed Redis or Azure Redis Enterprise cache

You can use the following Azure CLI script to create an Azure Managed Redis or Azure Cache for Redis Enterprise cache. You can also use the following other ways to create a cache:

- [Azure portal (Azure Managed Redis)](../quickstart-create-managed-redis.md)
- [Azure portal (Azure Cache for Redis Enterprise)](../../azure-cache-for-redis/quickstart-create-redis-enterprise.md)
- [Azure PowerShell](../how-to-manage-redis-cache-powershell.md?pivots=azure-managed-redis)
- [ARM template](../redis-cache-arm-provision.md#azure-managed-redis-preview)
- [Bicep template](../redis-cache-bicep-provision.md#azure-managed-redis-preview)

>[!IMPORTANT]
>You can enable or configure the following settings for Azure Managed Redis or Azure Cache for Redis Enterprise only at cache creation time. Gather the information you need to configure these settings in advance, and make sure to configure them correctly during cache creation.
>- You can enable modules only at the time you create the cache. You can't change modules or enable module configuration after you create a cache.
>- Azure Managed Redis and Azure Cache for Redis Enterprise tiers support two clustering policies: Enterprise or OSS. You can't change the clustering policy after you create the cache.
>- If you're using the cache in a geo-replication group, you can't change eviction policies after the cache is created.
>- The [RediSearch](../redis-modules.md#redisearch) module requires the Enterprise cluster policy and No Eviction eviction policy.

This script sets variables, and then uses the [az group create](/cli/azure/group) and [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) commands to create a resource group with an Azure Managed Redis Balanced B1 cache in it.

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

The following script uses the [az redisenterprise show](/cli/azure/redisenterprise#az-redisenterprise-show) and [az redisenterprise list-keys](/cli/azure/redisenterprise#az-redisenterprise-list-keys) commands to get and display the name, hostname, ports, and keys details for the preceding cache.

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

The following script uses the [az group delete](/cli/azure/group) and [az redisenterprise delete](/cli/azure/redisenterprise#az-redisenterprise-delete) commands to delete the preceding cache, and then delete its resource group.

```azurecli
# Delete a redis cache
echo "Deleting $cache"
az redisenterprise delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y
```

::: zone-end

::: zone pivot="azure-cache-redis"

### Create an Azure Cache for Redis Basic, Standard, or Premium cache

You can use the following Azure CLI script to create an Azure Cache for Redis Basic, Standard, or Premium-tier cache. To create and manage an Azure Cache for Redis Enterprise-tier cache, use the [Azure Managed Redis](create-manage-cache.md?pivots=azure-managed-redis) scripts.

You can also use the following other ways to create a cache:

- [Azure portal (Basic, Standard, or Premium)](../../azure-cache-for-redis/quickstart-create-redis.md)
- [Azure portal (Enterprise)](../../azure-cache-for-redis/quickstart-create-redis-enterprise.md)
- [Azure PowerShell](../how-to-manage-redis-cache-powershell.md?pivots=azure-cache-redis)
- [ARM template](../redis-cache-arm-provision.md#azure-cache-for-redis)
- [Bicep template](../redis-cache-bicep-provision.md#azure-cache-for-redis)

The following script uses the [az group create](/cli/azure/group) and [az redis create](/cli/azure/redis#az-redis-create) commands to create a resource group with an Azure Cache for Redis Basic C0 cache in it.

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

The following script uses the [az redis show](/cli/azure/redis#az-redis-show) and [az redis list-keys](/cli/azure/redis#az-redis-list-keys) commands to get and display the name, hostname, ports, and keys details for the preceding cache.

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

The following script uses the [az group delete](/cli/azure/group) and [az redis delete](/cli/azure/redis#az-redis-delete) commands to delete the preceding cache, and then delete its resource group.

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
- For an Azure CLI script sample that creates an Azure Cache for Redis Premium cache with clustering, see [Create a Premium Azure Cache for Redis with clustering](../../azure-cache-for-redis/scripts/create-manage-premium-cache-cluster.md).
