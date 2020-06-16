---
title: Choose VM sizes for pools
description: How to choose from the available VM sizes for compute nodes in Azure Batch pools
ms.topic: conceptual
ms.date: 06/10/2020
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

| VM series  | Supported sizes |
|------------|---------|
| Basic A | All sizes *except* Basic_A0 (A0) |
| A | All sizes *except* Standard_A0 |
| Av2 | All sizes |
| B | None |
| DC | None |
| Dv2, DSv2 | All sizes |
| Dv3, Dsv3 | All sizes |
| Dav4<sup>1</sup> | None - not yet available |
| Dasv4<sup>1</sup> | All sizes, except for Standard_D48as_v4, Standard_D64as_v4, Standard_D96as_v4 |
| Ddv4, Ddsv4 |  None - not yet available |
| Ev3, Esv3 | All sizes, except for E64is_v3 and E64i_v3 |
| Eav4<sup>1</sup> | All sizes, except for Standard_E48a_v4, Standard_E64a_v4, Standard_E96a_v4 |
| Easv4<sup>1</sup> | All sizes, except for Standard_E48as_v4, Standard_E64as_v4, Standard_E96as_v4 |
| Edv4, Edsv4 |  None - not yet available |
| F, Fs | All sizes |
| Fsv2 | All sizes |
| G, Gs | All sizes |
| H | All sizes |
| HB<sup>1</sup> | All sizes |
| HBv2<sup>1</sup> | All sizes |
| HC<sup>1</sup> | All sizes |
| Ls | All sizes |
| Lsv2<sup>1</sup> | All sizes |
| M<sup>1</sup> | All sizes |
| Mv2 | None - not yet available |
| NC | All sizes |
| NCv2<sup>1</sup> | All sizes |
| NCv3<sup>1</sup> | All sizes |
| ND<sup>1</sup> | All sizes |
| NDv2<sup>1</sup> | None - not yet available |
| NV | All sizes |
| NVv3<sup>1</sup> | All sizes |
| NVv4 | None |
| SAP HANA | None |

<sup>1</sup> These VM sizes can be allocated in Batch pools in Virtual Machine configuration, but you must create a new Batch account and request a specific [quota increase](batch-quota-limit.md#increase-a-quota). This limitation will be removed once vCPU quota per VM series is fully supported for Batch accounts.

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

* Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
* For information about using compute-intensive VM sizes, see [Use RDMA-capable or GPU-enabled instances in Batch pools](batch-pool-compute-intensive-sizes.md).
