---
title: Azure Cosmos DB for Gremlin serverless account, database, and graph
description: Use this Azure CLI script to create an Azure Cosmos DB for Gremlin serverless account, database, and graph.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: sample
ms.date: 05/02/2022
ms.custom: kr2b-contr-experiment, ignite-2022, devx-track-azurecli
---

# Use Azure CLI to create a Gremlin serverless account, database, and graph

[!INCLUDE[Gremlin](../../../includes/appliesto-gremlin.md)]

The script in this article creates an Azure Cosmos DB for Gremlin serverless account, database, and graph.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

- This script requires Azure CLI version 2.30 or later.

  - You can run the script in the Bash environment in [Azure Cloud Shell](../../../../cloud-shell/get-started.md). When Cloud Shell opens, make sure to select **Bash** in the environment field at the upper left of the shell window. Cloud Shell has the latest version of Azure CLI.

    [![Launch Cloud Shell in a new window](../../../../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  - If you prefer, you can [install Azure CLI](/cli/azure/install-azure-cli) to run the script locally. Run [az version](/cli/azure/reference-index?#az-version) to find your Azure CLI version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) if you need to upgrade. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).

## Sample script

This script uses the following commands:

- [az group create](/cli/azure/group#az-group-create) creates a resource group to store all resources.
- [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) with the `--capabilities EnableGremlin EnableServerless` parameter creates a Gremlin-enabled, serverless Azure Cosmos DB account.
- [az cosmosdb gremlin database create](/cli/azure/cosmosdb/gremlin/database#az-cosmosdb-gremlin-database-create) creates an Azure Cosmos DB for Gremlin database.
- [az cosmosdb gremlin graph create](/cli/azure/cosmosdb/gremlin/graph#az-cosmosdb-gremlin-graph-create) creates an Azure Cosmos DB for Gremlin graph.

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/gremlin/serverless.sh" id="FullScript":::

## Delete resources

If you don't need the resources the script created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains, including the Azure Cosmos DB account and database.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

[Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)
