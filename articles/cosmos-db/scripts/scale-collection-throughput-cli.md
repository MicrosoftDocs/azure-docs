---
title: Azure CLI Script-Scale Azure Cosmos DB container throughput | Microsoft Docs
description: Azure CLI Script Sample - Scale Azure Cosmos DB container throughput
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 10/26/2018
ms.author: mjbrown
---

# Scale Azure Cosmos DB container throughput using the Azure CLI

This sample scales container throughput for any kind of Azure Cosmos DB container.  

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/cosmosdb/scale-cosmosdb-throughput/scale-cosmosdb-throughput.sh?highlight=50-56 "Scale Azure Cosmos DB throughput")]

Above sample script lets you create and scale a fixed container. If you want to create and scale a container with unlimited storage capacity, you must:

* Create the container with at least 1000 RU/s and
* Specify a partition key while creating the container.

The following command shows an example to create a container with unlimited storage capacity:

```cli
az cosmosdb collection create \
    --collection-name $containerName \
    --name $accountName \
    --db-name $databaseName \
    --resource-group $resourceGroupName \
    --throughput 1000
    --partition-key-path "/deviceId"

```

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure Cosmos DB account. |
| [az cosmosdb database create](/cli/azure/cosmosdb/database#az-cosmosdb-database-create) | Creates an Azure Cosmos DB database. |
| [az cosmosdb collection create](/cli/azure/cosmosdb/collection#az-cosmosdb-collection-create) | Creates an Azure Cosmos DB container. |
| [az cosmosdb update](https://docs.microsoft.com/cli/azure/cosmosdb#az-cosmosdb-update) | Updates an Azure Cosmos DB account. |
| [az group delete](https://docs.microsoft.com/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI documentation](../cli-samples.md).
