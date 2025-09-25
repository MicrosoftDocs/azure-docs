---
title: Choose VM sizes and images for pools
description: How to choose from the available VM sizes and OS versions for compute nodes in Azure Batch pools
ms.topic: concept-article
ms.date: 04/23/2025
# Customer intent: "As a cloud engineer, I want to select the appropriate VM sizes and images for Azure Batch pools, so that I can optimize performance and cost for my workloads."
---

# Choose a VM size and image for compute nodes in an Azure Batch pool

When you select a node size for an Azure Batch pool, you can choose from almost all the VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows VMs for different workloads.

## Supported VM series and sizes

### Pools in Virtual Machine configuration

Batch pools in the Virtual Machine configuration support almost all [VM sizes](/azure/virtual-machines/sizes) available in Azure.
The supported VM sizes in a region can be obtained via the Batch Management API. You can use one of the following methods to
return a list of VM sizes supported by Batch in a region:

- PowerShell: [Get-AzBatchSupportedVirtualMachineSku](/powershell/module/az.batch/get-azbatchsupportedvirtualmachinesku)
- Azure CLI: [az batch location list-skus](/cli/azure/batch/location#az-batch-location-list-skus)
- [Batch Management APIs](batch-apis-tools.md#batch-management-apis): [List Supported Virtual Machine SKUs](/rest/api/batchmanagement/location/list-supported-virtual-machine-skus)

For example, using the Azure CLI, you can obtain the list of skus for a particular Azure region with the following command:

```azurecli-interactive
az batch location list-skus --location <azure-region>
```

> [!TIP]
> Avoid VM SKUs/families with impending Batch support end of life (EOL) dates. These dates can be discovered
> via the [`ListSupportedVirtualMachineSkus` API](/rest/api/batchmanagement/location/list-supported-virtual-machine-skus),
> [PowerShell](/powershell/module/az.batch/get-azbatchsupportedvirtualmachinesku),
> or [Azure CLI](/cli/azure/batch/location#az-batch-location-list-skus).
> For more information, see the [Batch best practices guide](best-practices.md) regarding Batch pool VM SKU selection.

### Using Generation 2 VM Images

Some VM series, such as [FX](/azure/virtual-machines/fx-series) and [Mv2](/azure/virtual-machines/mv2-series), can only be used
with [generation 2 VM images](/azure/virtual-machines/generation-2). Generation 2 VM images are specified like any VM image,
using the `sku` property of the [`imageReference`](/rest/api/batchservice/pool/add#imagereference) configuration; the `sku`
strings have a suffix such as `-g2` or `-gen2`. To get a list of VM images supported by Batch, including generation 2 images,
use the ['list supported images'](/rest/api/batchservice/account/listsupportedimages) API,
[PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or [Azure CLI](/cli/azure/batch/pool/supported-images).

## Size considerations

- **Application requirements** - Consider the characteristics and requirements of the application run on the nodes. Aspects like whether the application is multithreaded and how much memory it consumes can help determine the most suitable and cost-effective node size. For multi-instance [MPI workloads](batch-mpi.md) or CUDA applications, consider specialized [HPC](/azure/virtual-machines/sizes-hpc) or [GPU-enabled](/azure/virtual-machines/sizes-gpu) VM sizes, respectively. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).

- **Tasks per node** - It's typical to select a node size assuming one task runs on a node at a time. However, it might be advantageous to have multiple tasks (and therefore multiple application instances) [run in parallel](batch-parallel-node-tasks.md) on compute nodes during job execution. In this case, it's common to choose a multicore node size to accommodate the increased demand of parallel task execution.

- **Load levels for different tasks** - All of the nodes in a pool are the same size. If you intend to run applications with differing system requirements and/or load levels, we recommend that you use separate pools.

- **Region availability** - A VM series or size might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).

- **Quotas** - The [cores quotas](batch-quota-limit.md#resource-quotas) in your Batch account can limit the number of nodes of a given size you can add to a Batch pool. When needed, you can [request a quota increase](batch-quota-limit.md#increase-a-quota).

## Supported VM images

Use one of the following APIs to return a list of Windows and Linux VM images currently supported by Batch, including the node agent SKU IDs for each image:

- PowerShell: [Get-AzBatchSupportedImage](/powershell/module/az.batch/get-azbatchsupportedimage)
- Azure CLI: [az batch pool supported-images](/cli/azure/batch/pool/supported-images)
- [Batch Service APIs](batch-apis-tools.md#batch-service-apis): [List Supported Images](/rest/api/batchservice/account/listsupportedimages)

For example, using the Azure CLI, you can obtain the list of supported VM images with the following command:

```azurecli-interactive
az batch pool supported-images list
```

Images that have a `verificationType` of `verified` undergo regular interoperability validation testing with the Batch service
by the Azure Batch team. The `verified` designation doesn't mean that every possible application or usage scenario is validated,
but that functionality exposed by the Batch API such as executing tasks, mounting a supported virtual filesystem, etc. are
regularly tested as part of release processes. Images that have a `verificationType` of `unverified` don't undergo regular
validation testing but were initially verified to boot on Azure Batch compute nodes and transition to an `idle` compute
node state. Support for `unverified` images isn't guaranteed.

> [!TIP]
> Avoid images with impending Batch support end of life (EOL) dates. These dates can be discovered via
> the [`ListSupportedImages` API](/rest/api/batchservice/account/listsupportedimages),
> [PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or [Azure CLI](/cli/azure/batch/pool/supported-images).
> For more information, see the [Batch best practices guide](best-practices.md) regarding Batch pool VM image selection.

> [!TIP]
> The value of the `AZ_BATCH_NODE_ROOT_DIR` compute node environment variable is dependent upon if the VM has a local temporary disk or not. See [Batch root directory location](files-and-directories.md#batch-root-directory-location) for more information.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about using specialized VM sizes with [RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).
