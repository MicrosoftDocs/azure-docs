---
title: Azure CLI Script Example - Windows Pool in Batch
description: This script demonstrates some of the commands available in the Azure CLI to create and manage a pool of Windows compute nodes in Azure Batch.
ms.topic: sample
ms.date: 12/12/2019 
ms.custom: devx-track-azurecli
---

# CLI example: Create and manage a Windows pool in Azure Batch

This script demonstrates some of the commands available in the Azure CLI to create and
manage a pool of Windows compute nodes in Azure Batch. A Windows pool can be configured in two ways, with either a Cloud Services configuration 
or a Virtual Machine configuration. This example shows how to create a Windows pool with the Cloud Services configuration.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.20 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch/manage-pool/manage-pool-windows.sh "Manage Windows Cloud Services Pool")]

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
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az_batch_account_create) | Creates the Batch account. |
| [az batch account login](/cli/azure/batch/account#az_batch_account_login) | Authenticates against the specified Batch account for further CLI interaction. |
| [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) | Creates a pool of compute nodes.  |
| [az batch pool set](/cli/azure/batch/pool#az_batch_pool_set) | Updates the properties of a pool.  |
| [az batch pool autoscale enable](/cli/azure/batch/pool/autoscale#az_batch_pool_autoscale_enable) | Enables auto-scaling on a pool and applies a formula.  |
| [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) | Displays the properties of a pool.  |
| [az batch pool autoscale disable](/cli/azure/batch/pool/autoscale#az_batch_pool_autoscale_disable) | Disables auto-scaling on a pool. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
