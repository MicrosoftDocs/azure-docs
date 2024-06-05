---
title: Find an existing Azure Cosmos DB free-tier account in a subscription
description: Find an existing Azure Cosmos DB free-tier account in a subscription
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: devx-track-azurecli
ms.topic: sample
ms.date: 07/08/2022
---

# Find an existing Azure Cosmos DB free-tier account in a subscription using Azure CLI

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../../../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The script in this article demonstrates how to locate an Azure Cosmos DB free-tier account within a subscription.

Each Azure subscription can have up to one Azure Cosmos DB free-tier account. If you're trying to create a free-tier account, the option may be disabled in the Azure portal, or you get an error when attempting to create a free-tier account. If either of these issues occur, use this script to locate the name of the existing free-tier account, and the resource group it belongs to.

[!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/common/find-free-tier-account.sh" id="FullScript":::

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group list](/cli/azure/group#az-group-list) | Lists all resource groups in an Azure subscription. |
| [az cosmosdb list](/cli/azure/cosmosdb#az-cosmosdb-list) | Lists all Azure Cosmos DB account in a resource group. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

For Azure CLI samples for specific APIs, see:

- [CLI Samples for Cassandra](../../../cassandra/cli-samples.md)
- [CLI Samples for Gremlin](../../../graph/cli-samples.md)
- [CLI Samples for API for MongoDB](../../../mongodb/cli-samples.md)
- [CLI Samples for SQL](../../../sql/cli-samples.md)
- [CLI Samples for Table](../../../table/cli-samples.md)
