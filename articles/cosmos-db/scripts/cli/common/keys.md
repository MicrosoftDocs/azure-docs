---
title: Work with account keys and connection strings for an Azure Cosmos account
description: Work with account keys and connection strings for an Azure Cosmos account
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 07/29/2020
---

# Work with account keys and connection strings for an Azure Cosmos account using Azure CLI
[!INCLUDE[appliesto-all-apis](../../../includes/appliesto-all-apis.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This script demonstrates four operations.

- List all account keys
- List read only account keys
- List connection strings
- Regenerate account keys

> [!NOTE]
> This sample demonstrates using a SQL (Core) API account but the account key and connection string operations are identical across all database APIs in Cosmos DB.

[!code-azurecli-interactive[main](../../../../../cli_scripts/cosmosdb/common/keys.sh "Keys and connection string operations for Cosmos DB.")]

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
| [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) | Creates an Azure Cosmos DB account. |
| [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) | List the keys for an Azure Cosmos DB account. |
| [az cosmosdb list-read-only-keys](/cli/azure/cosmosdb#az_cosmosdb_list_read_only_keys) | List the read only keys for an Azure Cosmos DB account. |
| [az cosmosdb list-connection-strings](/cli/azure/cosmosdb#az_cosmosdb_list_connection_strings) | List the connection strings for an Azure Cosmos DB account. |
| [az cosmosdb regenerate-key](/cli/azure/cosmosdb#az_cosmosdb_regenerate-key) | Regenerate keys for an Azure Cosmos DB account. |
| [az group delete](/cli/azure/resource#az_resource_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

All Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).
