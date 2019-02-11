---
title: Azure CLI Script Example - Create Batch account - Batch service | Microsoft Docs
description: Azure CLI Script Example - Create a Batch account in Batch service mode
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

# CLI example: Create a Batch account in Batch service mode

This script creates an Azure Batch account in Batch service mode and shows how to query or update various properties of the account. When you create a Batch account in the default Batch service mode, its compute nodes are assigned internally by the Batch
service. Allocated compute nodes are subject to a separate vCPU (core) quota and the account can be 
authenticated either via shared key credentials or an Azure Active Directory token.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch/create-account/create-account.sh "Create Account")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [az batch account set](/cli/azure/batch/account#az-batch-account-set) | Updates properties of the Batch account.  |
| [az batch account show](/cli/azure/batch/account#az-batch-account-show) | Retrieves details of the specified Batch account.  |
| [az batch account keys list](/cli/azure/batch/account/keys#az-batch-account-keys-list) | Retrieves the access keys of the specified Batch account.  |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
