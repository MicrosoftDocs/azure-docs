---
title: Choose VM sizes for pools - Azure Batch | Microsoft Docs
description: How to choose from the available VM sizes for compute nodes in Azure Batch pools
services: batch
documentationcenter: ''
author: ju-shim
manager: gwallace
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: 
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/12/2019
ms.author: jushiman
ms.custom: seodec18

---

# Choose a VM size for compute nodes in an Azure Batch pool

When you select a node size for an Azure Batch pool, you can choose from among almost all the VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows VMs for different workloads.

There are a few exceptions and limitations to choosing a VM size:

* Some VM series or VM sizes are not supported in Batch.
* Some VM sizes are restricted and need to be specifically enabled before they can be allocated.

## Supported VM series and sizes

### Pools in Virtual Machine configuration

Batch pools in the Virtual Machine configuration support almost all VM sizes ([Linux](../virtual-machines/linux/sizes.md), [Windows](../virtual-machines/windows/sizes.md)). See the following table to learn more about supported sizes and restrictions.

Any promotional or preview VM sizes not listed aren't guaranteed for support.

| VM series  | Supported sizes | Batch account pool allocation mode<sup>1</sup> |
|------------|---------|-----------------|
| Basic A-series | All sizes *except* Basic_A0 (A0) | Any |
| A-series | All sizes *except* Standard_A0 | Any |
| Av2-series | All sizes | Any |
| B-series | None | Not available |
| DC-series | None | Not available |
| Dv2, DSv2-series | All sizes | Any |
| Dv3, Dsv3-series | All sizes | Any |
| Ev3, Esv3-series | All sizes | Any |
| Fsv2-series | All sizes | Any |
| H-series | All sizes | Any |
| HB-series<sup>2</sup> | All sizes | Any |
| HC-series<sup>2</sup> | All sizes | Any |
| Ls-series | All sizes | Any |
| Lsv2-series | None | Not available |
| M-series | Standard_M64ms (low-priority only), Standard_M128s (low-priority only) | Any |
| Mv2-series | None | Not available |
| NC-series | All sizes | Any |
| NCv2-series<sup>2</sup> | All sizes | Any |
| NCv3-series<sup>2</sup> | All sizes | Any |
| ND-series<sup>2</sup> | All sizes | Any |
| NDv2-series | All sizes | User subscription mode |
| NV-series | All sizes | Any |
| NVv3-series | None | Not available |
| SAP HANA | None | Not available |

<sup>1</sup> Some newer VM series are partially supported initially. These VM series can be allocated by Batch accounts with the **pool allocation mode** set to **user subscription**. See [Manage Batch accounts](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode) for more information on Batch account configuration. See [Quotas and limits](batch-quota-limit.md) to learn how to request quota for these partially supported VM series for **user subscription** Batch accounts.  

<sup>2</sup> These VM sizes can be allocated in Batch pools in Virtual Machine configuration, but you must request a specific [quota increase](batch-quota-limit.md#increase-a-quota).

### Pools in Cloud Service configuration

Batch pools in the Cloud Service configuration support all [VM sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md) **except** for the following:

| VM series  | Unsupported sizes |
|------------|-------------------|
| A-series   | Extra small       |
| Av2-series | Standard_A1_v2, Standard_A2_v2, Standard_A2m_v2 |

## Size considerations

* **Application requirements** - Consider the characteristics and requirements of the application you'll run on the nodes. Aspects like whether the application is multithreaded and how much memory it consumes can help determine the most suitable and cost-effective node size. For multi-instance [MPI workloads](batch-mpi.md) or CUDA applications, consider specialized [HPC](../virtual-machines/linux/sizes-hpc.md) or [GPU-enabled](../virtual-machines/linux/sizes-gpu.md) VM sizes, respectively. (See [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).)

* **Tasks per node** - It's typical to select a node size assuming one task runs on a node at a time. However, it might be advantageous to have multiple tasks (and therefore multiple application instances) [run in parallel](batch-parallel-node-tasks.md) on compute nodes during job execution. In this case, it is common to choose a multicore node size to accommodate the increased demand of parallel task execution.

* **Load levels for different tasks** - All of the nodes in a pool are the same size. If you intend to run applications with differing system requirements and/or load levels, we recommend that you use separate pools.

* **Region availability** - A VM series or size might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).

* **Quotas** - The [cores quotas](batch-quota-limit.md#resource-quotas) in your Batch account can limit the number of nodes of a given size you can add to a Batch pool. To request a quota increase, see [this article](batch-quota-limit.md#increase-a-quota). 

* **Pool configuration** - In general, you have more VM size options when you create a pool in the Virtual Machine configuration, compared with the Cloud Service configuration.

## Next steps

* For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
* For information about using compute-intensive VM sizes, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).
