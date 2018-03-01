---
title: Choose VM sizes for Azure Batch pools | Microsoft Docs
description: How to choose from the available VM sizes for compute nodes in Azure Batch pools
services: batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2018
ms.author: danlep


---
# Choose a VM size for compute nodes in an Azure Batch pool

When you create an Azure Batch pool, you can choose from among almost all the VM families and sizes available in Azure. Azure offers a range of sizes for Linux and Windows VMs for different workloads. For details about the available Azure VM families and sizes, see:

* [Sizes for virtual machines in Azure](../virtual-machines/linux/sizes.md) (Linux) 

* [Sizes for virtual machines in Azure](../virtual-machines/windows/sizes.md) (Windows)

* [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md), if you create a pool in the Cloud Services configuration.

There are a few exceptions and limitations to choosing a VM size:
* Some VM families or VM sizes are not supported in Batch. 
* Some VM sizes are restricted and need to be specifically enabled before they can be allocated.

## Size considerations

* **Application requirements** - Consider the characteristics and requirements of the application you'll run on the nodes. Aspects like whether the application is multithreaded and how much memory it consumes can help determine the most suitable and cost-effective node size. For multi-instance [MPI workloads](batch-mpi.md) or CUDA applications, consider specialized [HPC](../virtual-machines/linux/sizes-hpc.md) or [GPU-enabled](../virtual-machines/linux/sizes-gpu.md) VM sizes. (See [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).) 

* **Tasks per node** - It's typical to select a node size assuming one task runs on a node at a time. However, it might be advantageous to have multiple tasks (and therefore multiple application instances) [run in parallel](batch-parallel-node-tasks.md) on compute nodes during job execution. In this case, it is common to choose a multicore node size to accommodate the increased demand of parallel task execution.

* **Load levels for different tasks** - All of the nodes in a pool are the same size. If you intend to run applications with differing system requirements and/or load levels, we recommend that you use separate pools. 

* **Region availability** - A VM family or size might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).

* **Quotas** - The [cores quotas](batch-quota-limit.md#resource-quotas) in your Batch account can limit the number of nodes of a given size you can add to a Batch pool. To request a quota increase, see [this article](batch-quota-limit.md#increase-a-quota). 




## Unsupported VM families and sizes
The following VM families and VM sizes can't be used to create Azure Batch pools:

* B-series
*	M-series
*	DS-series
*	Fsv2-series<sup>*</sup> 
*	NCv3-series<sup>*</sup> 

<sup>*</sup>Sizes in this series are on the roadmap for future support.

The following are specific VM sizes that are not supported, but the other VM sizes in the VM family are supported:

|Family  |Unsupported sizes  |
|---------|---------|
| [Basic A](../virtual-machines/linux/sizes-general.md#basic-a) | Basic_A0 (A0) |
| [A-series](../virtual-machines/linux/sizes-general.md#a-series)  | Standard_A0 (ExtraSmall)
| [Av2-series](../virtual-machines/linux/sizes-general.md#av2-series)  |Standard_A1_v2, Standard_A2_v2

## Restricted VM families
The following VM families can be allocated in Batch pools, but you must request a specific quota increase (see [this article](batch-quota-limit.md#increase-a-quota)):
* [NCv2-series](../virtual-machines/linux/sizes-gpu.md#ncv2-instances)
* [ND-series](../virtual-machines/linux/sizes-gpu.md#nd-instances)


## Next steps

* For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
* For information about using compute-intensive VM sizes, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md). 


