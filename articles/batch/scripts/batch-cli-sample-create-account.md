---
title: Azure CLI Script Sample - Create a Batch account | Microsoft Docs
description: Azure CLI Script Sample - Create a Batch account
services: batch
documentationcenter: ''
author: annatisch
manager: daryls
editor: tysonn

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/25/2018
ms.author: danlep
---

# Create a Batch account

This script creates an Azure Batch account and shows how various properties of the account 
can be queried and updated.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Sample script

When you create a Batch account, by default its compute nodes are assigned internally by the Batch
service. Allocated compute nodes are subject to a separate core quota and the account can be 
authenticated either via shared key credentials or an Azure Active Dirctory token.

[!code-azurecli-interactive[main](../../../cli_scripts/batch/create-account/create-account.sh "Create Account")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myresourcegroup
```

## Script explanation

This script uses the following commands to create a resource group, Batch account, and all related resources. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az_batch_account_create) | Creates the Batch account.  |
| [az batch account set](/cli/azure/batch/account#az_batch_account_set) | Updates properties of the Batch account.  |
| [az batch account show](/cli/azure/batch/account#az_batch_account_show) | Retrieves details of the specified Batch account.  |
| [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) | Retrieves the access keys of the specified Batch account.  |
| [az batch account login](/cli/azure/batch/account#az_batch_account_login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates a storage account. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
