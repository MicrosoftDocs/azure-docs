---
title: Use compute-intensive Azure VMs with Batch | Microsoft Docs
description: How to take advantage of RDMA-capable or GPU-enabled VM sizes in Azure Batch pools
services: batch
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: danlep


---
# Use RDMA-capable or GPU-enabled instances in Batch pools

When running certain Batch jobs, you might want to take advantage of Azure VM sizes designed for large-scale computation. For example, to run multi-instance [MPI workloads](batch-mpi.md), you can choose RDMA-capable A8, A9, or H-series sizes. These sizes use an InfiniBand network for inter-node communcation, which can accelerate MPI applications. Or for CUDA applications, you can choose N-series sizes that include NVIDIA Tesla GPU cards.

This article provides guidance and examples to use some of Azure's specialized sizes in Batch pools. For specs and background on these sizes, see:

* High performance compute VM sizes - [Linux](../virtual-machines/linux/sizes-hpc.md), [Windows](../virtual-machines/windows/sizes-hpc.md) 

* GPU-enabled VM sizes - [Linux](../virtual-machines/linux/sizes-gpu.md), [Windows](../virtual-machines/windows/sizes-gpu.md) 


## Subscription and account considerations

* **Quotas** - One or more Azure quotas may limit the number or type of nodes you can add to a Batch pool. You are more likely to be limited when you choose RDMA-capable, GPU-enabled, or other multicore VM sizes. Depending on the type of Batch account you created, the quotas could apply to the account itself or to your subscription.

    * If you created your Batch account in the **Batch service** configuration, you are limited by the [dedicated cores quota per Batch account](batch-quota-limit.md#resource-quotas). By default, this quota is 20 cores.

    * If you created the account in the **User subscription** configuration, your subscription limits the number of VM cores per region that you can use. See [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md). A separate quota applies to [low-priority VMs](batch-low-pri-vms.md), if you use them. Your subsciption also applies a regional quota to certain VM sizes, including HPC and GPU instances. In the user subscription configuration, no additional quotas apply to the Batch account. 

  To request a quota increase, open an [online customer support request](../azure-supportability/how-to-create-azure-support-request.md) at no charge.

* **Region availability** - Compute-intensive VMs might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).


## Dependencies

The RDMA and GPU capabilties of compute-intensive sizes are supported only in certain operating systems. You might also need to install or configure additional driver or other software. The following tables summarize these dependencies. See linked articles for details. For options to configure Batch pools, see later in this article.


### Linux pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | -------- | ----- |  -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/linux/sizes-hpc,md#rdma-capable-instances) | RDMA | SUSE Linux Enterprise Server 12 HPC<br/>CentOS-based HPC<br/>(Azure Marketplace) | Intel MPI 5 | Enable inter-node communication, disable concurrent task execution |
| [NC series](../virtual-machines/linux/n-series-driver-setup.md#install-cuda-drivers-for-nc-vms) | NVIDIA Tesla K80 GPU | Ubuntu 16.04 LTS<br/>Red Hat Enterprise Linux 7.3<br/>CentOS-based 7.3<br/>(Azure Marketplace) | NVIDIA CUDA 8.0 drivers | N/A | 
| [NV series](../virtual-machines/linux/n-series-driver-setup.md#install-grid-drivers-for-nv-vms) | NVIDIA Tesla M60 GPU | Ubuntu 16.04 LTS<br/>Red Hat Enterprise Linux 7.3<br/>CentOS-based 7.3<br/>(Azure Marketplace) | NVIDIA GRID 4.2 drivers | N/A |





### Windows pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------ | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc,md#rdma-capable-instances) | RDMA | Windows Server 2012 R2<br/>Windows Server 2012 (Azure Marketplace) | Microsoft MPI 2012 R2 or later<br/> Intel MPI 5<br/><br/>HpcVMDrivers Azure VM extension | Enable inter-node communication, disable concurrent task execution |
| [NC series](../virtual-machines/linux/n-series-driver-setup.md#install-cuda-drivers-for-nc-vms) | NVIDIA Tesla K80 GPU | Windows Server 2016<br/>Windows Server 2012 R2 (Azure Marketplace) | NVIDIA Tesla drivers or CUDA Toolkit 8.0 | N/A | 
| [NV series](../virtual-machines/linux/n-series-driver-setup.md#install-grid-drivers-for-nv-vms) | NVIDIA Tesla M60 GPU | Windows Server 2016<br/>Windows Server 2012 R2 (Azure Marketplace) | NVIDIA GRID 4.2 drivers | N/A |

### Windows pools - Cloud service configuration

> [!NOTE]
> N-series sizes are not supported in Batch pools with the cloud service configuration.
>

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------- | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc,md#rdma-capable-instances) | RDMA | Windows Server 2012 R2<br/>Windows Server 2012<br/>Windows Server 2008 R2 (Guest OS family) | Microsoft MPI 2012 R2 or later<br/> Intel MPI 5<br/><br/>HpcVMDrivers Azure VM extension | Enable inter-node communication, disable concurrent task execution |





## Pool configuration options

When using a specialized VM size for your Batch pool, you have several options in the Batch APIs and tools to install required software or drivers. For example:

* [Start task](batch-api-basics.md#start-task) - Upload an installation package as a resource file to an Azure storage account in the same region as the Batch account. Create a start task command line to install the resource file silently when the pool starts. For example, see 

  > [!NOTE] 
  > The start task must run with elevated (admin) permissions, and it must wait for success.
  >

* [Application package](batch-application-package.md) - Add a zipped installation package to your Batch account, and configure a package reference in the pool. The setting uploads and unzips the package on to all nodes in the pool. If the package is an installer, configure a command line to silently install the app on all pool nodes as a start task, or when a task is scheduled to run on a node.

* [Custom VM image]() - Create a custom Windows or Linux VM image that contains drivers, software, or other settings required for a particular VM size. If you created your Batch account in the user subscription configuration, you can deploy the custom image to your Batch pool. Custom images can only be used with pools in the virtual machine configuration.

* [Batch Shipyard](https://github.com/Azure/batch-shipyard) - Use one of the recipes to create a Linux Batch pool with an RDMA-capable or GPU enabled VM size. Then, run Dockerized container tasks on the pool. For example, the [CNTK](https://github.com/Azure/batch-shipyard/tree/master/recipes/CNTK-GPU-OpenMPI) recipe uses N-series VM sizes and preconfigures GPU drivers and Microsoft Cognitive Toolkit software.












    





## Example: Microsoft MPI on an A8 VM pool


## Example: NVIDA Tesla drivers on NC VM pool












## Next steps

* [Run MPI jobs](batch-mpi.md)