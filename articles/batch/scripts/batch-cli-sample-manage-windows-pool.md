---
title: Azure CLI Script Example - Windows Pool in Batch
description: This script demonstrates some of the commands available in the Azure CLI to create and manage a pool of Windows compute nodes in Azure Batch.
services: batch
documentationcenter: ''
author: ju-shim
manager: gwallace
editor: 

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 12/12/2019
ms.author: jushiman
---

# CLI example: Create and manage a Windows pool in Azure Batch

This script demonstrates some of the commands available in the Azure CLI to create and
manage a pool of Windows compute nodes in Azure Batch. A Windows pool can be configured in two ways, with either a Cloud Services configuration 
or a Virtual Machine configuration. This example shows how to create a Windows pool with the Cloud Services configuration.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

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
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az batch account login](https://docs.microsoft.com/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction. |
| [az batch pool create](https://docs.microsoft.com/cli/azure/batch/pool#az-batch-pool-create) | Creates a pool of compute nodes.  |
| [az batch pool set](https://docs.microsoft.com/cli/azure/batch/pool#az-batch-pool-set) | Updates the properties of a pool.  |
| [az batch pool autoscale enable](https://docs.microsoft.com/cli/azure/batch/pool/autoscale#az-batch-pool-autoscale-enable) | Enables auto-scaling on a pool and applies a formula.  |
| [az batch pool show](https://docs.microsoft.com/cli/azure/batch/pool#az-batch-pool-show) | Displays the properties of a pool.  |
| [az batch pool autoscale disable](https://docs.microsoft.com/cli/azure/batch/pool/autoscale#az-batch-pool-autoscale-disable) | Disables auto-scaling on a pool. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
