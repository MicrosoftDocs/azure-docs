---
title: Azure CLI Script-Create a firewall for Azure Cosmos DB | Microsoft Docs
description: Azure CLI Script Sample - Create a firewall for Azure Cosmos DB
services: cosmos-db
documentationcenter: cosmosdb
author: SnehaGunda
manager: kfile
tags: azure-service-management

ms.service: cosmos-db
ms.custom: sammvcple
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: cosmosdb
ms.workload: database
ms.date: 06/02/2017
ms.author: sngun
---

# Azure Cosmos DB: Create a firewall using the Azure CLI

This sample CLI script creates a firewall policy for any kind of Azure Cosmos DB account. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/cosmosdb/secure-cosmosdb-create-firewall/secure-cosmosdb-create-firewall.sh?highlight=38-42 "Create an Azure Cosmos DB firewall")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](https://docs.microsoft.com/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure CosmosDB account. |
| [az cosmosdb update](https://docs.microsoft.com/cli/azure/cosmosdb#az-cosmosdb-update) | Updates an Azure CosmosDB account to include firewall settings. |
| [az group delete](https://docs.microsoft.com/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI documentation](../cli-samples.md).
