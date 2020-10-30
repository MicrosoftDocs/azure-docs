---
title: Create resource lock for a Azure Cosmos DB Table API table
description: Create resource lock for a Azure Cosmos DB Table API table
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: sample
ms.date: 07/29/2020
---

# Create resource lock for a Azure Cosmos DB Table API table using Azure CLI
[!INCLUDE[appliesto-table-api](../../../includes/appliesto-table-api.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. Run [az version](/cli/azure/reference-index#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az_upgrade).

> [!IMPORTANT]
> Resource locks do not work for changes made by users connecting Cosmos DB Table SDK, Azure Storage Table SDK, any tools that connect via account keys, or the Azure Portal unless the Cosmos DB account is first locked with the `disableKeyBasedMetadataWriteAccess` property enabled. To learn more about how to enable this property see, [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

## Sample script

[!code-azurecli-interactive[main](../../../../../cli_scripts/cosmosdb/table/lock.sh "Create a resource lock for an Azure Cosmos DB Table API table.")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az lock create](/cli/azure/lock#az-lock-create) | Creates a lock. |
| [az lock list](/cli/azure/lock#az-lock-list) | List lock information. |
| [az lock show](/cli/azure/lock#az-lock-show) | Show properties of a lock. |
| [az lock delete](/cli/azure/lock#az-lock-delete) | Deletes a lock. |

## Next steps

-[Lock resources to prevent unexpected changes](../../../../azure-resource-manager/management/lock-resources.md)

-[Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

-[Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).
