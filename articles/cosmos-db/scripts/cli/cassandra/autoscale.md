---
title: Azure Cosmos DB Cassandra API keyspace and table with autoscale
description: Use Azure CLI to create an Azure Cosmos DB Cassandra API account, keyspace, and table with autoscale.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: sample
ms.date: 05/02/2022
---

# Use Azure CLI to create an Azure Cosmos DB Cassandra account, keyspace, and table with autoscale

[!INCLUDE [appliesto-cassandra-api](../../../includes/appliesto-cassandra-api.md)]

The script in this article demonstrates creating an Azure Cosmos DB Cassandra API account, keyspace, and table with autoscale.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

- This script requires Azure CLI version 2.12.1 or later.

  - You can run the script in the Bash environment in [Azure Cloud Shell](../articles/cloud-shell/quickstart.md). The Cloud Shell environment has the latest version of Azure CLI. For more information, see [Azure Cloud Shell Quickstart - Bash](../articles/cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  - If you prefer, you can [install Azure CLI](/cli/azure/install-azure-cli) to run the script locally. Run [az version](/cli/azure/reference-index?#az-version) to find your Azure CLI version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) if you need to upgrade. Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

## Sample script

This script uses the following commands:

- The [az group create](/cli/azure/group#az-group-create) command creates a resource group to store all resources.
- The [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command with the `--capabilities EnableCassandra` parameter creates a Cassandra API-enabled Azure Cosmos DB account.
- The [az cosmosdb cassandra keyspace create](/cli/azure/cosmosdb/cassandra/keyspace#az-cosmosdb-cassandra-keyspace-create) command creates an Azure Cosmos DB Cassandra API keyspace.
- The [az cosmosdb cassandra table create](/cli/azure/cosmosdb/cassandra/table#az-cosmosdb-cassandra-table-create) command with `--max-throughput` set to minimum `4000` creates an Azure Cosmos DB Cassandra API table with autoscale.

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/cassandra/autoscale.sh" id="FullScript":::

## Delete resources

If you don't need the resources you created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains, including the Azure Cosmos DB account and keyspace.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

[Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)
