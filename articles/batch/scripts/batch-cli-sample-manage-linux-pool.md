---
title: Azure CLI Script Example - Linux Pool in Batch | Microsoft Docs
description: Learn the commands available in the Azure CLI to create and manage a pool of Linux compute nodes in Azure Batch.
ms.topic: sample
ms.date: 05/24/2022 
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: linux, azure cli samples, azure cli code samples, azure cli script samples
---

# CLI example: Create and manage a Linux pool in Azure Batch

This script demonstrates some of the commands available in the Azure CLI to create and manage a pool of Linux compute nodes in Azure Batch.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create a Linux pool in Azure Batch

:::code language="azurecli" source="~/azure_cli_scripts/batch/manage-pool/manage-pool-linux.sh" id="FullScript":::

### To reboot a batch node

If a particular node in the pool is having issues, it can be rebooted or reimaged. The ID of the node can be retrieved with the list command above. A typical node ID is in the format `tvm-xxxxxxxxxx_1-<timestamp>`.

```azurecli
az batch node reboot \
    --pool-id mypool-linux \
    --node-id tvm-123_1-20170316t000000z
```

### To delete a batch node

One or more compute nodes can be deleted from the pool, and any work already assigned to it can be re-allocated to another node.

```azurecli
az batch node delete \
    --pool-id mypool-linux \
    --node-list tvm-123_1-20170316t000000z tvm-123_2-20170316t000000z \
    --node-deallocation-option requeue
```

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
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az batch pool node-agent-skus list](../batch-linux-nodes.md#list-of-virtual-machine-images) | Lists available node agent SKUs and image information.  |
| [az batch pool create](/cli/azure/batch/pool#az-batch-pool-create) | Creates a pool of compute nodes.  |
| [az batch pool resize](/cli/azure/batch/pool#az-batch-pool-resize) | Resizes the number of running VMs in the specified pool.  |
| [az batch pool show](/cli/azure/batch/pool#az-batch-pool-show) | Displays the properties of a pool.  |
| [az batch node list](/cli/azure/batch/node#az-batch-node-list) | Lists all the compute node in the specified pool.  |
| [az batch node reboot](/cli/azure/batch/node#az-batch-node-reboot) | Reboots the specified compute node.  |
| [az batch node delete](/cli/azure/batch/node#az-batch-node-delete) | Deletes the listed nodes from the specified pool.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
