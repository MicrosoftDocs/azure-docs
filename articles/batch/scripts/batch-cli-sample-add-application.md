---
title: Azure CLI Script Example - Add an Application in Batch | Microsoft Docs
description: Azure CLI Script Example - Add an Application in Batch
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: 

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/29/2018
ms.author: lahugh
---

# CLI example: Add an application to an Azure Batch account

This script demonstrates how to add an application for use with an Azure Batch
pool or task. To set up an application to add to your Batch account, package your executable, together with any dependencies, into a zip file. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch/add-application/add-application.sh "Add Application")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

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

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
