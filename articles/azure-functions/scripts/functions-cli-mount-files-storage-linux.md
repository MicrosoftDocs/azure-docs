---
title: Mount a file share to a Python function app - Azure CLI
description: Create a serverless Python function app and mount an existing file share using the Azure CLI.
ms.topic: sample
ms.date: 03/01/2020
---

# Mount a file share to a Python function app using Azure CLI

This Azure Functions sample script creates a function app and creates a share in Azure Files. It them mounts the share so that the data can be accessed by your functions.  

>[!NOTE]
>The function app created runs on Python version 3.7. Azure Functions also [supports Python versions 3.6 and 3.8](../functions-reference-python.md#python-version).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). Examples are written for Bash shell and must be modified to run in a Windows command prompt. 

## Sample script

This script creates an Azure Function app using the [Consumption plan](../functions-scale.md#consumption-plan).

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/functions-cli-mount-files-storage-linux/functions-cli-mount-files-storage-linux.sh "Create an Azure Function on a Consumption plan")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates an Azure Storage account. |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app. |
| [az storage share create](/cli/azure/storage/share#az-storage-share-create) | Creates an Azure Files share in storage account. | 
| [az storage directory create](/cli/azure/storage/directory#az-storage-directory-create) | Creates a directory in the share. |
| [az webapp config storage-account add](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) | Mounts the share to the function app. |
| [az webapp config storage-account list](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-list) | Shows file shares mounted to the function app. | 

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
