---
title: Mount a file share to a Python function app - Azure CLI
description: Create a serverless Python function app and mount an existing file share using the Azure CLI.
ms.topic: sample
ms.date: 03/24/2022 
ms.custom: devx-track-azurecli, devx-track-python
---

# Mount a file share to a Python function app using Azure CLI

This Azure Functions sample script creates a function app using the [Consumption plan](../consumption-plan.md) and creates a share in Azure Files. It then mounts the share so that the data can be accessed by your functions.  

>[!NOTE]
>The function app created runs on Python version 3.9. Azure Functions also [supports Python versions 3.7 and 3.8](../functions-reference-python.md#python-version).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/functions-cli-mount-files-storage-linux/functions-cli-mount-files-storage-linux.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

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
