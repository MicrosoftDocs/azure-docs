---
title: Azure CLI Script Example - Windows Pool in Batch | Microsoft Docs
description: Learn some of the commands available in the Azure CLI to create and manage a pool of Windows compute nodes in Azure Batch.
ms.topic: sample
ms.date: 05/24/2022 
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: windows pool, azure cli samples, azure cli code samples, azure cli script samples
---

# CLI example: Create and manage a Windows pool in Azure Batch

This script demonstrates some of the commands available in the Azure CLI to create and
manage a pool of Windows compute nodes in Azure Batch. A Windows pool can be configured in two ways, with either a Cloud Services configuration or a Virtual Machine configuration. This example shows how to create a Windows pool with the Cloud Services configuration.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/batch/manage-pool/manage-pool-windows.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction. |
| [az batch pool create](/cli/azure/batch/pool#az-batch-pool-create) | Creates a pool of compute nodes.  |
| [az batch pool set](/cli/azure/batch/pool#az-batch-pool-set) | Updates the properties of a pool.  |
| [az batch pool autoscale enable](/cli/azure/batch/pool/autoscale#az-batch-pool-autoscale-enable) | Enables auto-scaling on a pool and applies a formula.  |
| [az batch pool show](/cli/azure/batch/pool#az-batch-pool-show) | Displays the properties of a pool.  |
| [az batch pool autoscale disable](/cli/azure/batch/pool/autoscale#az-batch-pool-autoscale-disable) | Disables auto-scaling on a pool. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
