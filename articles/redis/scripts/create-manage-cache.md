---
title: Create, query, and delete a cache using Azure CLI
description: Use the Azure CLI to create an Azure Redis instance, get cache details like status, hostname, ports, and keys, and delete the cache.
ms.devlang: azurecli
ms.topic: sample
ms.date: 05/18/2025
zone_pivot_groups: redis-type
ms.custom:
  - devx-track-azurecli, ignite-2024, build-2025
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
  - ✅ Azure Cache for Redis
---

# Manage an Azure Redis cache using the Azure CLI

This article describes how to create and delete an Azure Redis cache instance by using the Azure CLI. The article also shows how to use the Azure CLI to get cache details including provisioning status, hostname, ports, and keys.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- Make sure you're signed in to Azure with the subscription you want to create your cache under. To use a different subscription than the one you're signed in with, run `az account set -s <subscriptionId>`, replacing `<subscriptionId>` with the subscription ID you want to use.

::: zone pivot="azure-managed-redis"

>[!NOTE]
>Azure Managed Redis uses the Azure CLI [az redisenterprise](/cli/azure/redisenterprise) commands. The `redisenterprise` extension for Azure CLI version 2.61.0 or higher prompts you for installation the first time you run an `az redisenterprise` command.
>
>Azure Cache for Redis uses the `az redisenterprise` commands for Enterprise tiers and the [az redis](/cli/azure/redis) commands for Basic, Standard, and Premium tiers. You can use the following scripts to create and manage Azure Managed Redis or Azure Cache for Redis Enterprise. For Azure Cache for Redis Basic, Standard, and Premium, use the [Azure Cache for Redis](create-manage-cache.md?pivots=azure-cache-redis) scripts.

## Create an Azure Managed Redis cache

<!-- 
:::code language="azurecli" source="~/azure_cli_scripts/redis-cache/create-cache/create-manage-cache.sh" id="FullScript"::: 
This sample is broken. When it is fixed, we can fix this include.
-->

To create an Azure Managed Redis cache by using Azure CLI, the `name`, `location`, `resourceGroup`, and `sku` parameters are required. Other parameters are optional and have defaults.

You can use the Azure CLI script in this section to create an Azure Managed Redis cache with default settings. You can also use the following other methods to create a cache:

- [Azure portal](../quickstart-create-managed-redis.md)
- [Azure PowerShell](../how-to-manage-redis-cache-powershell.md?pivots=azure-managed-redis)
- [ARM template](../redis-cache-arm-provision.md#azure-managed-redis)
- [Bicep template](../redis-cache-bicep-provision.md#azure-managed-redis)

The cache `name`  must be a string of 1-63 characters that's unique in the [Azure region](https://azure.microsoft.com/regions/). The name can contain only numbers, letters, and hyphens, must start and end with a number or letter, and can't contain consecutive hyphens.

The `location` should be an Azure region near other services that use your cache.

Choose a [sku](https://azure.microsoft.com/pricing/details/cache/) that has the appropriate features and performance for your cache.

Microsoft Entra authentication is enabled by default for all new caches and is recommended for security.

>[!IMPORTANT]
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra for cache authentication with Azure Managed Redis](../entra-for-authentication.md).

Transport Layer Security (TLS) 1.2-1.3 encryption is enabled by default for all new caches. You can enable the non-TLS port and connections during or after cache creation, but for security reasons, disabling TLS isn't recommended.

The following script sets variables, and then uses the [az group create](/cli/azure/group) and [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) commands to create a resource group with an Azure Managed Redis Balanced B1 SKU cache in it.

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

The following script uses the [az redisenterprise show](/cli/azure/redisenterprise#az-redisenterprise-show) and [az redisenterprise database list-keys](/cli/azure/redisenterprise/database#az-redisenterprise-database-list-keys) commands to get and display the name, hostname, ports, and keys details for the preceding cache.

>[!IMPORTANT]
>The `list-keys` operation works only when access keys are enabled for the cache. The output of this command might compromise security by showing secrets, and may trigger a sensitive information warning. For more information, see [Use Azure CLI to manage sensitive information](https://go.microsoft.com/fwlink/?linkid=2258669).

```azurecli
# Get details of an Azure Managed Redis cache
echo "Showing details of $cache"
az redisenterprise show --name "$cache" --resource-group $resourceGroup 

# Retrieve the hostname and ports for an Azure Redis Cache instance
redis=($(az redisenterprise show --name "$cache" --resource-group $resourceGroup --query [hostName,enableNonSslPort,port,sslPort] --output tsv))

# Retrieve the keys for an Azure Redis Cache instance
keys=($(az redisenterprise database list-keys --cluster-name "$cache" --resource-group $resourceGroup --query [primaryKey,secondaryKey] --output tsv))

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

>[!IMPORTANT]
>Use these scripts to create and manage Azure Cache for Redis Basic, Standard, and Premium tiers with the Azure CLI [az redis](/cli/azure/redis) commands.
>
>Azure Cache for Redis Enterprise tiers and Azure Managed Redis use the [az redisenterprise](/cli/azure/redisenterprise) commands. The `redisenterprise` extension for Azure CLI version 2.61.0 or higher prompts you for installation the first time you run an `az redisenterprise` command.
>
>To create and manage an Azure Cache for Redis Enterprise-tier cache, use the [Azure Managed Redis](create-manage-cache.md?pivots=azure-managed-redis) scripts.

## Create an Azure Cache for Redis cache

You can use the following Azure CLI script to create an Azure Cache for Redis Basic, Standard, or Premium-tier cache. To create and manage an Azure Cache for Redis Enterprise-tier cache, use the [Azure Managed Redis](create-manage-cache.md?pivots=azure-managed-redis) scripts.

To create an Azure Cache for Redis Basic, Standard, or Premium cache by using Azure CLI, the `name`, `location`, `resourceGroup`, `sku`, and `size` parameters are required. Other parameters are optional and have defaults.

You can use the Azure CLI script in this section to create an Azure Cache for Redis Basic cache with default settings. You can also use the following other methods to create a cache:

- [Azure portal (Basic, Standard, or Premium)](../../azure-cache-for-redis/quickstart-create-redis.md)
- [Azure PowerShell](../how-to-manage-redis-cache-powershell.md?pivots=azure-cache-redis)
- [ARM template](../redis-cache-arm-provision.md#azure-cache-for-redis)
- [Bicep template](../redis-cache-bicep-provision.md#azure-cache-for-redis)

The cache `name`  must be a string of 1-63 characters that's unique in the [Azure region](https://azure.microsoft.com/regions/). The name can contain only numbers, letters, and hyphens, must start and end with a number or letter, and can't contain consecutive hyphens.

The `location` should be an Azure region near other services that use your cache.

Choose a [sku](https://azure.microsoft.com/pricing/details/cache/) and `size` that have the appropriate features and performance for your cache.

Transport Layer Security (TLS) 1.2-1.3 encryption is enabled by default for all new caches. You can enable the non-TLS port and connections during or after cache creation, but for security reasons, disabling TLS isn't recommended.

>[!IMPORTANT]
>Microsoft Entra authentication is recommended for security. You can enable Microsoft Entra Authentication during or after cache creation.
>
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra ID for cache authentication](../../azure-cache-for-redis/cache-azure-active-directory-for-authentication.md).

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

>[!IMPORTANT]
>The `list-keys` operation works only when access keys are enabled for the cache. The output of this command might compromise security by showing secrets, and may trigger a sensitive information warning. For more information, see [Use Azure CLI to manage sensitive information](https://go.microsoft.com/fwlink/?linkid=2258669).

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

- [Azure CLI documentation](/cli/azure)
- [Create a Premium Azure Cache for Redis with clustering](../../azure-cache-for-redis/scripts/create-manage-premium-cache-cluster.md)