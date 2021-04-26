---
title: Mount a file share to a Python function app - Azure CLI
description: Create a serverless Python function app and mount an existing file share using the Azure CLI.
ms.topic: sample
ms.date: 03/01/2020 
ms.custom: devx-track-azurecli
---

# Mount a file share to a Python function app using Azure CLI

This Azure Functions sample script creates a function app and creates a share in Azure Files. It them mounts the share so that the data can be accessed by your functions.  

>[!NOTE]
>The function app created runs on Python version 3.7. Azure Functions also [supports Python versions 3.6 and 3.8](../functions-reference-python.md#python-version).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

This script creates a function app in Azure Functions using the [Consumption plan](../consumption-plan.md).

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/functions-cli-mount-files-storage-linux/functions-cli-mount-files-storage-linux.sh "Create a function app on a Consumption plan")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates an Azure Storage account. |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app. |
| [az storage share create](/cli/azure/storage/share#az_storage_share_create) | Creates an Azure Files share in storage account. | 
| [az storage directory create](/cli/azure/storage/directory#az_storage_directory_create) | Creates a directory in the share. |
| [az webapp config storage-account add](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) | Mounts the share to the function app. |
| [az webapp config storage-account list](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_list) | Shows file shares mounted to the function app. | 

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
