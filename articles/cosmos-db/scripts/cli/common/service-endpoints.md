---
title: Create an Azure Cosmos account with virtual network service endpoints
description: Create an Azure Cosmos account with virtual network service endpoints
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 07/29/2020
---

# Create an Azure Cosmos account with virtual network service endpoints using Azure CLI
[!INCLUDE[appliesto-all-apis](../../../includes/appliesto-all-apis.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This sample creates a new virtual network with a front and back end subnet and enables service endpoints for `Microsoft.AzureCosmosDB`. It then retrieves the resource ID for this subnet and applies it to the Azure Cosmos account and enables service endpoints for the account.

> [!NOTE]
> This sample demonstrates using a Core (SQL) API account. To use this sample for other APIs, apply the `enable-virtual-network` and `virtual-network-rules` parameters in the script below to your API specific script.

[!code-azurecli-interactive[main](../../../../../cli_scripts/cosmosdb/common/service-endpoints.sh "Create an Azure Cosmos account with service endpoints.")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) | Creates an Azure virtual network. |
| [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) | Creates a subnet for an Azure virtual network. |
| [az network vnet subnet show](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_show) | Returns a subnet for an Azure virtual network. |
| [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) | Creates an Azure Cosmos DB account. |
| [az group delete](/cli/azure/resource#az_resource_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

All Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).
