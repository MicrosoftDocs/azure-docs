---
title: Azure Cosmos DB for Apache Cassandra keyspace and table with autoscale
description: Use Azure CLI to create an Azure Cosmos DB for Apache Cassandra account, keyspace, and table with autoscale.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: sample
ms.date: 05/02/2022
ms.custom: kr2b-contr-experiment, devx-track-azurecli
---

# Use Azure CLI to create a API for Cassandra account, keyspace, and table with autoscale

[!INCLUDE[Cassandra](../../../includes/appliesto-cassandra.md)]

The script in this article creates an Azure Cosmos DB for Apache Cassandra account, keyspace, and table with autoscale.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

- This script requires Azure CLI version 2.12.1 or later.

  - You can run the script in the Bash environment in [Azure Cloud Shell](../../../../cloud-shell/get-started.md). When Cloud Shell opens, make sure to select **Bash** in the environment field at the upper left of the shell window. Cloud Shell has the latest version of Azure CLI.

    :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  - If you prefer, you can [install Azure CLI](/cli/azure/install-azure-cli) to run the script locally. Run [az version](/cli/azure/reference-index?#az-version) to find your Azure CLI version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) if you need to upgrade. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).

## Sample script

This script uses the following commands:

- [az group create](/cli/azure/group#az-group-create) creates a resource group to store all resources.
- [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) with the `--capabilities EnableCassandra` parameter creates a API for Cassandra-enabled Azure Cosmos DB account.
- [az cosmosdb cassandra keyspace create](/cli/azure/cosmosdb/cassandra/keyspace#az-cosmosdb-cassandra-keyspace-create) creates an Azure Cosmos DB Cassandra keyspace.
- [az cosmosdb cassandra table create](/cli/azure/cosmosdb/cassandra/table#az-cosmosdb-cassandra-table-create) with the `--max-throughput` parameter set to minimum `4000` creates an Azure Cosmos DB Cassandra table with autoscale.

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/cassandra/autoscale.sh" id="FullScript":::

## Delete resources

If you don't need the resources you created, use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all resources it contains, including the Azure Cosmos DB account and keyspace.

```azurecli
az group delete --name $resourceGroup
```

## Next steps

[Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb)
