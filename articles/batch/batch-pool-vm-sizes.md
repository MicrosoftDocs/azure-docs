---
title: Choose VM sizes and images for pools
description: How to choose from the available VM sizes and OS versions for compute nodes in Azure Batch pools
ms.topic: conceptual
ms.date: 11/24/2020
ms.custom: seodec18

---

# Choose a VM size and image for compute nodes in an Azure Batch pool

When you select a node size for an Azure Batch pool, you can choose from among almost all the VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows VMs for different workloads.

## Supported VM series and sizes

There are a few exceptions and limitations to choosing a VM size for your Batch pool:

- Some VM series or VM sizes are not supported in Batch.
- Some VM sizes are restricted and need to be specifically enabled before they can be allocated.

### Pools in Virtual Machine configuration

Batch pools in the Virtual Machine configuration support almost all [VM sizes](../virtual-machines/sizes.md). See the following table to learn more about supported sizes and restrictions.

| VM series  | Supported sizes |
|------------|---------|
| Basic A | All sizes *except* Basic_A0 (A0) |
| A | All sizes *except* Standard_A0, Standard_A8, Standard_A9, Standard_A10, Standard_A11 |
| Av2 | All sizes |
| B | Not supported |
| DC | Not supported |
| Dv2, DSv2 | All sizes |
| Dv3, Dsv3 | All sizes |
| Dav4 | All sizes |
| Dasv4 | All sizes |
| Ddv4, Ddsv4 |  All sizes |
| Dv4, Dsv4 | Not supported |
| Ev3, Esv3 | All sizes, except for E64is_v3 |
| Eav4 | All sizes |
| Easv4 | All sizes |
| Edv4, Edsv4 |  All sizes |
| Ev4, Esv4 | Not supported |
| F, Fs | All sizes |
| Fsv2 | All sizes |
| G, Gs | All sizes |
| H | All sizes |
| HB | All sizes |
| HBv2 | All sizes |
| HC | All sizes |
| Ls | All sizes |
| Lsv2 | All sizes |
| M | All sizes |
| Mv2<sup>1</sup> | All sizes |
| NC | All sizes |
| NCv2 | All sizes |
| NCv3 | All sizes |
| NCasT4_v3 | None - not yet available |
| ND | All sizes |
| NDv2 | None - not yet available |
| NV | All sizes |
| NVv3 | All sizes |
| NVv4 | All sizes |
| SAP HANA | Not supported |

<sup>1</sup> These VM series can only be used with generation 2 VM Images.

### Using Generation 2 VM Images

Some VM series, such as [Mv2](../virtual-machines/mv2-series.md), can only be used with [generation 2 VM images](../virtual-machines/generation-2.md). Generation 2 VM images are specified like any VM image, using the 'sku' property of the ['imageReference'](/rest/api/batchservice/pool/add#imagereference) configuration; the 'sku' strings have a suffix such as "-g2" or "-gen2". To get a list of VM images supported by Batch, including generation 2 images, use the ['list supported images'](/rest/api/batchservice/account/listsupportedimages) API, [PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or [Azure CLI](/cli/azure/batch/pool/supported-images).

### Pools in Cloud Service configuration

Batch pools in the Cloud Service configuration support all [VM sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md) **except** for the following:

| VM series  | Unsupported sizes |
|------------|-------------------|
| A-series   | Extra small       |
| Av2-series | Standard_A1_v2, Standard_A2_v2, Standard_A2m_v2 |

## Size considerations

- **Application requirements** - Consider the characteristics and requirements of the application you'll run on the nodes. Aspects like whether the application is multithreaded and how much memory it consumes can help determine the most suitable and cost-effective node size. For multi-instance [MPI workloads](batch-mpi.md) or CUDA applications, consider specialized [HPC](../virtual-machines/sizes-hpc.md) or [GPU-enabled](../virtual-machines/sizes-gpu.md) VM sizes, respectively. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).

- **Tasks per node** - It's typical to select a node size assuming one task runs on a node at a time. However, it might be advantageous to have multiple tasks (and therefore multiple application instances) [run in parallel](batch-parallel-node-tasks.md) on compute nodes during job execution. In this case, it is common to choose a multicore node size to accommodate the increased demand of parallel task execution.

- **Load levels for different tasks** - All of the nodes in a pool are the same size. If you intend to run applications with differing system requirements and/or load levels, we recommend that you use separate pools.

- **Region availability** - A VM series or size might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).

- **Quotas** - The [cores quotas](batch-quota-limit.md#resource-quotas) in your Batch account can limit the number of nodes of a given size you can add to a Batch pool. When needed, you can [request a quota increase](batch-quota-limit.md#increase-a-quota).

- **Pool configuration** - In general, you have more VM size options when you create a pool in the Virtual Machine configuration, compared with the Cloud Service configuration.

## Supported VM images

Use one of the following APIs to return a list of Windows and Linux VM images currently supported by Batch, including the node agent SKU IDs for each image:

- Batch Service REST API: [List Supported Images](/rest/api/batchservice/account/listsupportedimages)
- PowerShell: [Get-AzBatchSupportedImage](/powershell/module/az.batch/get-azbatchsupportedimage)
- Azure CLI: [az batch pool supported-images](/cli/azure/batch/pool/supported-images)

Avoid the following images with impending end-of-life (EOL) dates, past which Batch support will be retired:

| Publisher              | Offer                        | Version                                        | End-of-Life (EOL) Date |
|------------------------|------------------------------|------------------------------------------------|------------------------|
| Canonical              | UbuntuServer                 | 16.04-LTS                                      | 2021-05-21             |
| Canonical              | UbuntuServer                 | 16_04-lts-gen2                                 | 2021-05-21             |
| Canonical              | UbuntuServer                 | 16.04.0-LTS                                    | 2021-05-21             |
| microsoft-azure-batch  | ubuntu-server-container      | 16.04-lts                                      | 2021-05-21             |
| microsoft-azure-batch  | ubuntu-server-container-rdma | 16.04-lts                                      | 2021-05-21             |
| microsoft-azure-batch  | centos-container-rdma        | 8-1                                            | 2021-12-31             |
| microsoft-azure-batch  | centos-container             | 8-2                                            | 2021-12-31             |
| OpenLogic              | CentOS                       | 8_2                                            | 2021-12-31             |
| OpenLogic              | CentOS                       | 8_1                                            | 2021-12-31             |
| OpenLogic              | CentOS                       | 8_2-gen2                                       | 2021-12-31             |
| Oracle                 | Oracle-Linux                 | 81                                             | 2021-12-31             |
| MicrosoftWindowsServer | WindowsServer                | Datacenter-Core-2004-with-Containers-smalldisk | 2022-01-14             |

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- For information about using compute-intensive VM sizes, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).
