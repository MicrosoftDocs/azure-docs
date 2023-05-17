---
title: Choose VM sizes and images for pools
description: How to choose from the available VM sizes and OS versions for compute nodes in Azure Batch pools
ms.topic: conceptual
ms.date: 02/13/2023
ms.custom: seodec18

---

# Choose a VM size and image for compute nodes in an Azure Batch pool

When you select a node size for an Azure Batch pool, you can choose from almost all the VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows VMs for different workloads.

## Supported VM series and sizes

### Pools in Virtual Machine configuration

Batch pools in the Virtual Machine configuration support almost all [VM sizes](../virtual-machines/sizes.md) available in Azure.
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
> Batch **does not** support any VM SKU sizes that have only remote storage. A local temporary disk is required for Batch.
> For example, Batch supports [ddv4 and ddsv4](../virtual-machines/ddv4-ddsv4-series.md), but does not support
> [dv4 and dsv4](../virtual-machines/dv4-dsv4-series.md).

### Using Generation 2 VM Images

Some VM series, such as [FX](../virtual-machines/fx-series.md) and [Mv2](../virtual-machines/mv2-series.md), can only be used
with [generation 2 VM images](../virtual-machines/generation-2.md). Generation 2 VM images are specified like any VM image,
using the `sku` property of the [`imageReference`](/rest/api/batchservice/pool/add#imagereference) configuration; the `sku`
strings have a suffix such as `-g2` or `-gen2`. To get a list of VM images supported by Batch, including generation 2 images,
use the ['list supported images'](/rest/api/batchservice/account/listsupportedimages) API,
[PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or [Azure CLI](/cli/azure/batch/pool/supported-images).

### Pools in Cloud Services Configuration

> [!WARNING]
> Cloud Services Configuration pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). Please use Virtual Machine Configuration pools instead.

Batch pools in Cloud Services Configuration support all [VM sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md) **except** for the following:

| VM series  | Unsupported sizes |
|------------|-------------------|
| A-series   | Extra small       |
| Av2-series | Standard_A1_v2, Standard_A2_v2, Standard_A2m_v2 |

## Size considerations

- **Application requirements** - Consider the characteristics and requirements of the application you'll run on the nodes. Aspects like whether the application is multithreaded and how much memory it consumes can help determine the most suitable and cost-effective node size. For multi-instance [MPI workloads](batch-mpi.md) or CUDA applications, consider specialized [HPC](../virtual-machines/sizes-hpc.md) or [GPU-enabled](../virtual-machines/sizes-gpu.md) VM sizes, respectively. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).

- **Tasks per node** - It's typical to select a node size assuming one task runs on a node at a time. However, it might be advantageous to have multiple tasks (and therefore multiple application instances) [run in parallel](batch-parallel-node-tasks.md) on compute nodes during job execution. In this case, it's common to choose a multicore node size to accommodate the increased demand of parallel task execution.

- **Load levels for different tasks** - All of the nodes in a pool are the same size. If you intend to run applications with differing system requirements and/or load levels, we recommend that you use separate pools.

- **Region availability** - A VM series or size might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).

- **Quotas** - The [cores quotas](batch-quota-limit.md#resource-quotas) in your Batch account can limit the number of nodes of a given size you can add to a Batch pool. When needed, you can [request a quota increase](batch-quota-limit.md#increase-a-quota).

- **Pool configuration** - In general, you have more VM size options when you create a pool in Virtual Machine configuration, compared with Cloud Services Configuration.

## Supported VM images

Use one of the following APIs to return a list of Windows and Linux VM images currently supported by Batch, including the node agent SKU IDs for each image:

- PowerShell: [Get-AzBatchSupportedImage](/powershell/module/az.batch/get-azbatchsupportedimage)
- Azure CLI: [az batch pool supported-images](/cli/azure/batch/pool/supported-images)
- [Batch Service APIs](batch-apis-tools.md#batch-service-apis): [List Supported Images](/rest/api/batchservice/account/listsupportedimages)

For example, using the Azure CLI, you can obtain the list of supported VM images with the following command:

```azurecli-interactive
az batch pool supported-images list
```

It's recommended to avoid images with impending Batch support end of life (EOL) dates. These dates can be discovered via
the [`ListSupportedImages` API](/rest/api/batchservice/account/listsupportedimages),
[PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or [Azure CLI](/cli/azure/batch/pool/supported-images).
For more information, see the [Batch best practices guide](best-practices.md) regarding Batch pool VM image selection.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- For information about using compute-intensive VM sizes, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).
