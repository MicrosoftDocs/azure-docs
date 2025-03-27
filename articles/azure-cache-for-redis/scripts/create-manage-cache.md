---
title: Create, query, and delete an Azure Managed Redis - Azure CLI
description: This Azure CLI code sample shows how to create an Azure Managed Redis instance using the command az redisenterprise create. It then gets details of an Azure Managed Redis instance, including provisioning status, the hostname, ports, and keys for an Azure Managed Redis instance. Finally, it deletes the cache.


ms.devlang: azurecli
ms.topic: sample
ms.date: 03/11/2022
zone_pivot_groups: redis-type
ms.custom: devx-track-azurecli, ignite-2024
---

# Create an Azure Redis using the Azure CLI

In this scenario, you learn how to create an Azure Redis instance. You then learn to get details of the cache, including provisioning status, the hostname, ports, and keys for the cache. Finally, you learn to delete the cache.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

::: zone pivot="azure-managed-redis"

## Azure Managed Redis

[!INCLUDE [managed-redis-create](../includes/managed-redis-create.md)]

::: zone-end

::: zone pivot="azure-cache-redis"

## Azure Cache for Redis

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

::: zone-end

::: zone pivot="azure-managed-redis"

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

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
sku="Balanced_B1"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --resource-group $resourceGroup --location "$location" --tags $tag

# Create a Balanced B1 Azure Managed Redis Cache
echo "Creating $cache"
az redisenterprise create --name $cache --resource-group $resourceGroup --location "$location" --sku $sku

# Get details of an Azure Managed Redis
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

# Delete a redis cache
echo "Deleting $cache"
az redisenterprise delete --name "$cache" --resource-group $resourceGroup -y

# echo "Deleting all resources"
az group delete --resource-group $resourceGroup -y

```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --resource-group $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group and an Azure Managed Redis. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az redisenterprise create](/cli/azure/redis) | Create Azure Managed Redis instance. |
| [az redisenterprise show](/cli/azure/redis) | Retrieve details of an Azure Managed Redis instance. |
| [az redisenterprise list-keys](/cli/azure/redis) | Retrieve access keys for an Azure Managed Redis instance. |
| [az redisenterprise delete](/cli/azure/redis) | Delete Azure Managed Redis instance. |

::: zone-end

::: zone pivot="azure-cache-redis"

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

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

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --resource-group $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group and an Azure Cache for Redis. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az redis create](/cli/azure/redis) | Create Azure Managed Redis instance. |
| [az redis show](/cli/azure/redis) | Retrieve details of an Azure Managed Redis instance. |
| [az redis list-keys](/cli/azure/redis) | Retrieve access keys for an Azure Managed Redis instance. |
| [az redis delete](/cli/azure/redis) | Delete Azure Managed Redis instance. |


::: zone-end

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

For an Azure Managed Redis CLI script sample that creates a  Azure Managed Redis with clustering, see [ Azure Managed Redis with Clustering](create-manage-premium-cache-cluster.md).
