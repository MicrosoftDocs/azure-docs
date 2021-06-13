---
title: Create a function app in a Premium plan - Azure CLI
description: Create a function app in a scalable Premium plan in Azure using the Azure CLI
ms.service: azure-functions
ms.topic: sample
ms.date: 11/23/2019 
ms.custom: devx-track-azurecli
---

# Create a function app in a Premium plan - Azure CLI

This Azure Functions sample script creates a function app, which is a container for your functions. The function app that is created uses a [scalable Premium plan](../functions-premium-plan.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This script creates a function app using a [Premium plan](../functions-premium-plan.md).

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-premium-plan/create-function-app-premium-plan.sh "Create an Azure Function on an App Service plan")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates an Azure Storage account. |
| [az functionapp plan create](/cli/azure/functionapp/plan#az_functionapp_plan_create) | Creates a Premium plan in a [specific SKU](../functions-premium-plan.md#available-instance-skus). |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app in the App Service plan. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
