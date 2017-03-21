---
title: Azure CLI Script Sample - Create a Batch account | Microsoft Docs
description: Azure CLI Script Sample - Create a Batch account
services: batch
documentationcenter: batch
author: annatisch
manager: daryls
editor: tamram
tags: azure-batch

ms.assetid:
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: batch
ms.workload: infrastructure
ms.date: 03/20/2017
ms.author: antisch
---

# Create a Batch Account with the Azure CLI

This script creates an Azure Batch Account and shows how various properties of the account 
can be queried and updated.
A Batch account can be created to allocate VM pools either in the user's subscription, or outside 
of the user's subscription.

If needed, install the Azure CLI using the instruction found in the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli), 
and then run `az login` to create a connection with Azure.

Accounts that allocate VMs outside of the user's subscription will be subject to a separate core
quota and can be authenticated either via Shared Key credentials or an Azure Active Dirctory token.
An account will be created in this mode by default.

## Batch Account Sample script

[!code-azurecli[main](../../../cli_scripts/batch/create-account/create-account.sh "Create Account")]

Accounts that allocate VMs into the users subscription must be authenticated via an Azure Active
Directory token and the VMs allocated will count towards the user's subscription quota. To create 
an account in this mode, one must specify a Key Vault reference when creating the account.

## Batch Account with User Subscription Pool Allocation Sample script

[!code-azurecli[main](../../../cli_scripts/batch/create-account/create-account-user-subscription.sh  "Create Account using User Subscription")]

## Clean up deployment

After either of the above sample scripts have been run, the following command can be used to remove the
resource group and all related resources (including Batch Acounts, Storage Accounts and Key Vaults).

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, Batch account, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az batch account create](https://docs.microsoft.com/cli/azure/batch/account#create) | Creates the Batch account.  |
| [az batch account set](https://docs.microsoft.com/cli/azure/batch/account#set) | Updates properties of the Batch account.  |
| [az batch account show](https://docs.microsoft.com/cli/azure/batch/account#show) | Retrieves details of the specified Batch account.  |
| [az batch account keys list](https://docs.microsoft.com/cli/azure/batch/account/keys#list) | Retrives the access keys of the specified Batch account.  |
| [az batch account login](https://docs.microsoft.com/cli/azure/batch/account#login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#create) | Creates a storage account. |
| [az keyvault create](https://docs.microsoft.com/cli/azure/keyvault#create) | Creates a KeyVault. |
| [az keyvault set-policy](https://docs.microsoft.com/cli/azure/keyvault#set-policy) | Update the security policy of the specified KeyVault. |
| [az group delete](https://docs.microsoft.com/cli/azure/group#delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Batch CLI script samples can be found in the [Azure Batch CLI documentation](../batch-cli-samples.md).
