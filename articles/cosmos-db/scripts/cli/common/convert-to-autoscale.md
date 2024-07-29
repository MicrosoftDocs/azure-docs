---
title: Convert all Azure Cosmos DB resources from standard to autoscale throughput
description: Convert all resources to autoscale in a user subscription
author: markjbrown
ms.author: mjbrown
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: devx-track-azurecli
ms.topic: sample
ms.date: 07/26/2024
---

# Convert every Azure Cosmos DB resource from standard to autoscale throughput

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../../../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The script in this article demonstrates how to convert every resource using standard provisioned throughput to autoscale within a subscription.

Many customers start with standard provisioned throughput when developing new applications. However standard throughput is best used in workloads that have sustained throughput requirements. Most workloads are variable. This means autoscale is often less expensive to use. In scenarios where there may be tens or hundreds of resources to migrate, this can be tedious and time consuming. This script is designed to migrate all resources in a single step. 


[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/common/convert-to-autoscale.sh" :::

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group list](/cli/azure/group#az-group-list) | Lists all resource groups in an Azure subscription. |
| [az cosmosdb list](/cli/azure/cosmosdb#az-cosmosdb-list) | Lists all Azure Cosmos DB accounts in a resource group. |
| [az cosmosdb sql database list](/cli/azure/cosmosdb#az-cosmosdb-sql-database-list) | Lists all NoSQL databases in an account. |
| [az cosmosdb sql database throughput show](/cli/azure/cosmosdb#az-cosmosdb-sql-database-throughput-show) | Read the throughput value for the NoSQL database in an account. |
| [az cosmosdb sql database throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-sql-database-throughput-migrate) | Migrate the throughput for the NoSQL database resource. |
| [az cosmosdb sql container list](/cli/azure/cosmosdb#az-cosmosdb-sql-container-list) | Lists all NoSQL containers in a database. |
| [az cosmosdb sql container throughput show](/cli/azure/cosmosdb#az-cosmosdb-sql-container-throughput-show) | Read the throughput value for the NoSQL container in an account. |
| [az cosmosdb sql container throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-sql-container-throughput-migrate) | Migrate the throughput for a NoSQL container in an account. |
| [az cosmosdb mongodb database list](/cli/azure/cosmosdb#az-cosmosdb-mongodb-database-list) | Lists all MongoDB databases in an account. |
| [az cosmosdb mongodb database throughput show](/cli/azure/cosmosdb#az-cosmosdb-mongodb-database-throughput-show) | Read the throughput value for the MongoDB database in an account. |
| [az cosmosdb mongodb database throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-mongodb-database-throughput-migrate) | Migrate the throughput for a database resource in the MongoDB account. |
| [az cosmosdb mongodb collection list](/cli/azure/cosmosdb#az-cosmosdb-mongodb-collection-list) | Lists all MongoDB collections in a database. |
| [az cosmosdb mongodb collection throughput show](/cli/azure/cosmosdb#az-cosmosdb-mongodb-collection-throughput-show) | Read the throughput value for the MongoDB collection in an account. |
| [az cosmosdb mongodb collection throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-mongodb-collection-throughput-migrate) | Migrate the throughput for a collection resource in the MongoDB account. |
| [az cosmosdb cassandra keyspace list](/cli/azure/cosmosdb#az-cosmosdb-cassandra-keyspace-list) | Lists all Cassandra keyspaces in an account. |
| [az cosmosdb cassandra keyspace throughput show](/cli/azure/cosmosdb#az-cosmosdb-cassandra-keyspace-throughput-show) | Read the throughput value for the Cassandra keyspace in an account. |
| [az cosmosdb cassandra keyspace throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-cassandra-keyspace-throughput-migrate) | Migrate the throughput for a Cassandra keyspace in the account. |
| [az cosmosdb cassandra table list](/cli/azure/cosmosdb#az-cosmosdb-cassandra-table-list) | Lists all Cassandra tables in a keyspace. |
| [az cosmosdb cassandra table throughput show](/cli/azure/cosmosdb#az-cosmosdb-cassandra-table-throughput-show) | Read the throughput value for the Cassandra table in an account. |
| [az cosmosdb cassandra table throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-cassandra-table-throughput-migrate) | Migrate the throughput for a cassandra table in an account. |
| [az cosmosdb gremlin database list](/cli/azure/cosmosdb#az-cosmosdb-gremlin-database-list) | Lists all Gremlin databases in an account. |
| [az cosmosdb gremlin database throughput show](/cli/azure/cosmosdb#az-cosmosdb-gremlin-database-throughput-show) | Read the throughput value for the Gremlin database in an account. |
| [az cosmosdb gremlin database throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-gremlin-database-throughput-migrate) | Migrate the throughput for the Gremlin database resource. |
| [az cosmosdb gremlin container list](/cli/azure/cosmosdb#az-cosmosdb-gremlin-graph-list) | Lists all Gremlin graphs in a database. |
| [az cosmosdb gremlin container throughput show](/cli/azure/cosmosdb#az-cosmosdb-gremlin-graph-throughput-show) | Read the throughput value for the Gremlin graph in an account. |
| [az cosmosdb gremlin graph throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-gremlin-graph-throughput-migrate) | Migrate the throughput for a Gremlin graph in an account. |
| [az cosmosdb table list](/cli/azure/cosmosdb#az-cosmosdb-table-list) | Lists all Tables in an account. |
| [az cosmosdb table throughput show](/cli/azure/cosmosdb#az-cosmosdb-table-throughput-show) | Read the throughput value for the table in an account. |
| [az cosmosdb table throughput migrate](/cli/azure/cosmosdb#az-cosmosdb-table-throughput-migrate) | Migrate the throughput for a table in an account. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

For Azure CLI samples for specific APIs, see:

- [CLI Samples for Cassandra](../../../cassandra/cli-samples.md)
- [CLI Samples for Gremlin](../../../graph/cli-samples.md)
- [CLI Samples for API for MongoDB](../../../mongodb/cli-samples.md)
- [CLI Samples for SQL](../../../sql/cli-samples.md)
- [CLI Samples for Table](../../../table/cli-samples.md)
