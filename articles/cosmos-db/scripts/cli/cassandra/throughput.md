---
title: Perform throughput (RU/s) operations for Azure Cosmos DB for Apache Cassandra resources
description: Azure CLI scripts for throughput (RU/s) operations for Azure Cosmos DB for Apache Cassandra resources
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: sample
ms.date: 02/21/2022
---

# Throughput (RU/s) operations with Azure CLI for a keyspace or table for Azure Cosmos DB - API for Cassandra

[!INCLUDE[Cassandra](../../../includes/appliesto-cassandra.md)]

The script in this article creates a Cassandra keyspace with shared throughput and a Cassandra table with dedicated throughput, then updates the throughput for both the keyspace and table. The script then migrates from standard to autoscale throughput then reads the value of the autoscale throughput after it has been migrated.

[!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/cassandra/throughput.sh" id="FullScript":::

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
| [az cosmosdb cassandra keyspace create](/cli/azure/cosmosdb/cassandra/keyspace#az-cosmosdb-cassandra-keyspace-create) | Creates an Azure Cosmos DB Cassandra keyspace. |
| [az cosmosdb cassandra table create](/cli/azure/cosmosdb/cassandra/table#az-cosmosdb-cassandra-table-create) | Creates an Azure Cosmos DB Cassandra table. |
| [az cosmosdb cassandra keyspace throughput update](/cli/azure/cosmosdb/cassandra/keyspace/throughput#az-cosmosdb-cassandra-keyspace-throughput-update) | Update RU/s for an Azure Cosmos DB Cassandra keyspace. |
| [az cosmosdb cassandra table throughput update](/cli/azure/cosmosdb/cassandra/table/throughput#az-cosmosdb-cassandra-table-throughput-update) | Update RU/s for an Azure Cosmos DB Cassandra table. |
| [az cosmosdb cassandra keyspace throughput migrate](/cli/azure/cosmosdb/cassandra/keyspace/throughput#az-cosmosdb-cassandra-keyspace-throughput-migrate) | Migrate throughput for an Azure Cosmos DB Cassandra keyspace. |
| [az cosmosdb cassandra table throughput migrate](/cli/azure/cosmosdb/cassandra/table/throughput#az-cosmosdb-cassandra-table-throughput-migrate) | Migrate throughput for an Azure Cosmos DB Cassandra table. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).
