---
title: Create resource lock for a database and collection for MongoDB API for Azure Cosmos DB
description: Create resource lock for a database and collection for MongoDB API for Azure Cosmos DB
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: sample
ms.date: 07/29/2020
---

# Create a resource lock for Azure Cosmos DB's API for MongoDB using Azure CLI
[!INCLUDE[appliesto-mongodb-api](../../../includes/appliesto-mongodb-api.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.9.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

> [!IMPORTANT]
> Resource locks do not work for changes made by users connecting using any MongoDB SDK, Mongoshell, any tools or the Azure Portal unless the Cosmos DB account is first locked with the `disableKeyBasedMetadataWriteAccess` property enabled. To learn more about how to enable this property see, [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

## Sample script

[!code-azurecli-interactive[main](../../../../../cli_scripts/cosmosdb/mongodb/lock.sh "Create a resource lock for an Azure Cosmos DB MongoDB API database and collection.")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az lock create](/cli/azure/lock#az_lock_create) | Creates a lock. |
| [az lock list](/cli/azure/lock#az_lock_list) | List lock information. |
| [az lock show](/cli/azure/lock#az_lock_show) | Show properties of a lock. |
| [az lock delete](/cli/azure/lock#az_lock_delete) | Deletes a lock. |

## Next steps

- [Lock resources to prevent unexpected changes](../../../../azure-resource-manager/management/lock-resources.md)

- [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

- [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).
