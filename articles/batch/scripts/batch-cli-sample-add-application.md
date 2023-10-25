---
title: Azure CLI Script Example - Add an Application in Batch | Microsoft Docs
description: Learn how to add an application for use with an Azure Batch pool or a task using the Azure CLI.
ms.topic: sample
ms.date: 05/24/2022
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: batch, azure cli samples, azure cli code samples, azure cli script samples
---

# CLI example: Add an application to an Azure Batch account

This script demonstrates how to add an application for use with an Azure Batch pool or task. To set up an application to add to your Batch account, package your executable, together with any dependencies, into a zip file.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Create batch account and new application

:::code language="azurecli" source="~/azure_cli_scripts/batch/add-application/add-application.sh" id="FullScript":::

### Create batch application package

An application can reference multiple application executable packages of different versions. The executables and any dependencies need to be zipped up for the package. Once uploaded, the CLI attempts to activate the package so that it's ready for use.

```azurecli
az batch application package create \
    --resource-group $resourceGroup \
    --name $batchAccount \
    --application-name "MyApplication" \
    --package-file my-application-exe.zip \
    --version-name 1.0
```

### Update the application

Update the application to assign the newly added application package as the default version.

```azurecli
az batch application set \
    --resource-group $resourceGroup \
    --name $batchAccount \
    --application-name "MyApplication" \
    --default-version 1.0
```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands.
Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az batch application create](/cli/azure/batch/application#az-batch-application-create) | Creates an application.  |
| [az batch application package create](/cli/azure/batch/application/package#az-batch-application-package-create) | Adds an application package to the specified application.  |
| [az batch application set](/cli/azure/batch/application#az-batch-application-set) | Updates properties of an application.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
