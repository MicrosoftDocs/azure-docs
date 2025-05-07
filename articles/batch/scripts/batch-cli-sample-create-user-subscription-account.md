---
title: Azure CLI Script Example - Create Batch account - user subscription | Microsoft Docs
description: Learn how to create an Azure Batch account in user subscription mode. This account allocates compute nodes into your subscription.
ms.topic: sample
ms.date: 06/24/2024
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: batch, azure cli samples, azure cli examples, azure cli code samples
---

# CLI example: Create a Batch account in user subscription mode

This script creates an Azure Batch account in user subscription mode. An account that allocates compute nodes into your subscription must be authenticated via a Microsoft Entra token. The compute nodes allocated count toward your subscription's vCPU (core) quota.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/batch/create-account/create-account-user-subscription.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az role assignment create](/cli/azure/role) | Create a new role assignment for a user, group, or service principal. |
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az keyvault create](/cli/azure/keyvault#az-keyvault-create) | Creates a key vault. |
| [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) | Update the security policy of the specified key vault. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account.  |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
