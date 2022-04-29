---
title: Azure Cosmos DB Gremlin serverless account, database, and graph
description: Use this Azure CLI script to create an Azure Cosmos DB Gremlin serverless account, database, and graph.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: sample
ms.date: 02/21/2022
---

# Use Azure CLI to create an Azure Cosmos DB Gremlin serverless account, database, and graph

[!INCLUDE [appliesto-gremlin-api](../../../includes/appliesto-gremlin-api.md)]

The script in this article demonstrates creating an Azure Cosmos DB Gremlin API serverless account, database, and graph.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

- This script requires Azure CLI version 2.12.1 or later.

  - You can run the script in the Bash environment in [Azure Cloud Shell](../articles/cloud-shell/quickstart.md). The Cloud Shell environment has the latest version of Azure CLI. For more information, see [Azure Cloud Shell Quickstart - Bash](../articles/cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  - If you prefer, you can [install Azure CLI](/cli/azure/install-azure-cli) to run the script locally. Run [az version](/cli/azure/reference-index?#az-version) to find your Azure CLI version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) if you need to upgrade. Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

## Sample script

This script uses the following commands:

- The [az group create](/cli/azure/group#az-group-create) command creates a resource group to store all resources.
- The [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command with the `--capabilities EnableGremlin Enable Serverless` parameter creates a Gremlin-enabled, serverless Azure Cosmos DB account.
- The [az cosmosdb gremlin database create](/cli/azure/cosmosdb/gremlin/database#az-cosmosdb-gremlin-database-create) command creates an Azure Cosmos DB Gremlin database.
- The [az cosmosdb gremlin graph create](/cli/azure/cosmosdb/gremlin/graph#az-cosmosdb-gremlin-graph-create) command creates an Azure Cosmos DB Gremlin graph.

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/gremlin/serverless.sh" id="FullScript":::

## Delete resources

If you don't need the resources the script created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains, including the Azure Cosmos DB account and database.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

[Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)


# Create an Azure Cosmos Gremlin API serverless account, database and graph using Azure CLI

[!INCLUDE[appliesto-gremlin-api](../../../includes/appliesto-gremlin-api.md)]

The script in this article demonstrates creating a Gremlin serverless account, database and graph.

[!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/gremlin/serverless.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure Cosmos DB account. |
| [az cosmosdb gremlin database create](/cli/azure/cosmosdb/gremlin/database#az-cosmosdb-gremlin-database-create) | Creates an Azure Cosmos Gremlin database. |
| [az cosmosdb gremlin graph create](/cli/azure/cosmosdb/gremlin/graph#az-cosmosdb-gremlin-graph-create) | Creates an Azure Cosmos Gremlin graph. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).
