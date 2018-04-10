---
title: Create an Azure Function that connects to an Azure Cosmos DB | Microsoft Docs
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Cosmos DB
services: functions
documentationcenter: functions
author: ggailey777
manager: cfowler
editor: 
tags: functions
ms.assetid: 
ms.service: functions
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 01/22/2018
ms.author: glenga
ms.custom: mvc
---
# Create an Azure Function that connects to an Azure Cosmos DB

This Azure Functions sample script creates a function app and connects the function to an Azure Cosmos DB database. The created app setting that contains the connection can be used with an [Azure Cosmos DB trigger or binding](..\functions-bindings-cosmosdb.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you use the CLI locally, make sure that you are running the Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Sample script

This sample creates an Azure Function app and adds a Cosmos DB endpoint and access key to app settings.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-connect-to-cosmos-db/create-function-app-connect-to-cosmos-db.sh "Create an Azure Function that connects to an Azure Cosmos DB")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az login](https://docs.microsoft.com/cli/azure/reference-index#az_login) | Log in to Azure. |
| [az group create](https://docs.microsoft.com/cli/azure/group#az_group_create) | Create a resource group with location |
| [az storage accounts create](https://docs.microsoft.com/cli/azure/storage/account) | Create a storage account |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#az_functionapp_create) | Create a new function app |
| [az cosmosdb create](https://docs.microsoft.com/cli/azure/cosmosdb#az_cosmosdb_create) | Create cosmosdb database |
| [az group delete](https://docs.microsoft.com/cli/azure/group#az_group_delete) | Clean up |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).




