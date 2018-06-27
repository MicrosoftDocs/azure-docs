---
title: Use compute-intensive Azure VMs with Batch | Microsoft Docs
description: How to take advantage of RDMA-capable or GPU-enabled VM sizes in Azure Batch pools
services: batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/01/2018
ms.author: danlep


---
# Use RDMA-capable or GPU-enabled instances in Batch pools

To run certain Batch jobs, you might want to take advantage of Azure VM sizes designed for large-scale computation. For example, to run multi-instance [MPI workloads](batch-mpi.md), you can choose A8, A9, or H-series sizes that have a network interface for Remote Direct Memory Access (RDMA). These sizes connect to an InfiniBand network for inter-node communication, which can accelerate MPI applications. Or for CUDA applications, you can choose N-series sizes that include NVIDIA Tesla graphics processing unit (GPU) cards.

This article provides guidance and examples to use some of Azure's specialized sizes in Batch pools. For specs and background, see:

* High performance compute VM sizes ([Linux](../virtual-machines/linux/sizes-hpc.md), [Windows](../virtual-machines/windows/sizes-hpc.md)) 

* GPU-enabled VM sizes ([Linux](../virtual-machines/linux/sizes-gpu.md), [Windows](../virtual-machines/windows/sizes-gpu.md)) 


## Subscription and account limits

* **Quotas and limits** - The [cores quota per Batch account](batch-quota-limit.md#resource-quotas) can limit the number of nodes of a given size you can add to a Batch pool. You are more likely to reach a quota when you choose RDMA-capable, GPU-enabled, or other multicore VM sizes. 

  Additionally, use of certain VM families in your Batch account, such as NCv2, NCv3, and ND, is restricted because of limited capacity. Use of these families is only available by requesting a quota increase from the default of 0 cores.  

  If you need to, [request a quota increase](batch-quota-limit.md#increase-a-quota) at no charge.

* **Region availability** - Compute-intensive VMs might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).


## Dependencies

The RDMA and GPU capabilities of compute-intensive sizes are supported only in certain operating systems. Depending on your operating system, you might need to install or configure additional driver or other software. The following tables summarize these dependencies. See linked articles for details. For options to configure Batch pools, see later in this article.


### Linux pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | -------- | ----- |  -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/linux/sizes-hpc.md#rdma-capable-instances) | RDMA | Ubuntu 16.04 LTS,<br/>SUSE Linux Enterprise Server 12 HPC, or<br/>CentOS-based HPC<br/>(Azure Marketplace) | Intel MPI 5 | Enable inter-node communication, disable concurrent task execution |
| [NC, NCv2, NCv3, ND series*](../virtual-machines/linux/n-series-driver-setup.md) | NVIDIA Tesla GPU (varies by series) | Ubuntu 16.04 LTS,<br/>Red Hat Enterprise Linux 7.3 or 7.4, or<br/>CentOS 7.3 or 7.4<br/>(Azure Marketplace) | NVIDIA CUDA Toolkit drivers | N/A | 
| [NV series](../virtual-machines/linux/n-series-driver-setup.md) | NVIDIA Tesla M60 GPU | Ubuntu 16.04 LTS,<br/>Red Hat Enterprise Linux 7.3, or<br/>CentOS 7.3<br/>(Azure Marketplace) | NVIDIA GRID drivers | N/A |

*RDMA connectivity on RDMA-capable N-series VMs may require [additional configuration](../virtual-machines/linux/n-series-driver-setup.md#rdma-network-connectivity) that varies by distribution.



### Windows pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------ | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc.md#rdma-capable-instances) | RDMA | Windows Server 2016, 2012 R2, or<br/>2012 (Azure Marketplace) | Microsoft MPI 2012 R2 or later, or<br/> Intel MPI 5<br/><br/>HpcVMDrivers Azure VM extension | Enable inter-node communication, disable concurrent task execution |
| [NC, NCv2, NCv3, ND series*](../virtual-machines/windows/n-series-driver-setup.md) | NVIDIA Tesla GPU (varies by series) | Windows Server 2016 or <br/>2012 R2 (Azure Marketplace) | NVIDIA Tesla drivers or CUDA Toolkit drivers| N/A | 
| [NV series](../virtual-machines/windows/n-series-driver-setup.md) | NVIDIA Tesla M60 GPU | Windows Server 2016 or<br/>2012 R2 (Azure Marketplace) | NVIDIA GRID drivers | N/A |

*RDMA connectivity on RDMA-capable N-series VMs is supported on Windows Server 2016 or Windows Server 2012 R2 (from Azure Marketplace) with HpcVMDrivers extension and Microsoft MPI or Intel MPI.

### Windows pools - Cloud services configuration

> [!NOTE]
> N-series sizes are not supported in Batch pools with the Cloud Service configuration.
>

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------- | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc.md#rdma-capable-instances) | RDMA | Windows Server 2016, 2012 R2, 2012, or<br/>2008 R2 (Guest OS family) | Microsoft MPI 2012 R2 or later, or<br/>Intel MPI 5<br/><br/>HpcVMDrivers Azure VM extension | Enable inter-node communication,<br/> disable concurrent task execution |





## Pool configuration options

To configure a specialized VM size for your Batch pool, the Batch APIs and tools provide several options to install required software or drivers, including:

* [Start task](batch-api-basics.md#start-task) - Upload an installation package as a resource file to an Azure storage account in the same region as the Batch account. Create a start task command line to install the resource file silently when the pool starts. For more information, see the [REST API documentation](/rest/api/batchservice/add-a-pool-to-an-account#bk_starttask).

  > [!NOTE] 
  > The start task must run with elevated (admin) permissions, and it must wait for success.
  >

* [Application package](batch-application-packages.md) - Add a zipped installation package to your Batch account, and configure a package reference in the pool. This setting uploads and unzips the package on all nodes in the pool. If the package is an installer, create a start task command line to silently install the app on all pool nodes. Optionally, install the package when a task is scheduled to run on a node.

* [Custom pool image](batch-custom-images.md) - Create a custom Windows or Linux VM image that contains drivers, software, or other settings required for the VM size. 

* [Batch Shipyard](https://github.com/Azure/batch-shipyard) automatically configures the GPU and RDMA to work transparently with containerized workloads on Azure Batch. Batch Shipyard is entirely driven with configuration files. There are many sample recipe configurations available that enable GPU and RDMA workloads such as the [CNTK GPU Recipe](https://github.com/Azure/batch-shipyard/tree/master/recipes/CNTK-GPU-OpenMPI)  which preconfigures GPU drivers on N-series VMs and loads Microsoft Cognitive Toolkit software as a Docker image.


## Example: Microsoft MPI on an A8 VM pool

To run Windows MPI applications on a pool of Azure A8 nodes, you need to install a supported MPI implementation. Here are sample steps to install [Microsoft MPI](https://msdn.microsoft.com/library/bb524831(v=vs.85).aspx) on a Windows pool using a Batch application package.

1. Download the [setup package](http://go.microsoft.com/FWLink/p/?LinkID=389556) (MSMpiSetup.exe) for the latest version of Microsoft MPI.
2. Create a zip file of the package.
3. Upload the package to your Batch account. For steps, see the [application packages](batch-application-packages.md) guidance. Specify an application id such as *MSMPI*, and a version such as *8.1*. 
4. Using the Batch APIs or Azure portal, create a pool in the cloud services configuration with the desired number of nodes and scale. The following table shows sample settings to set up MPI in unattended mode using a start task:

| Setting | Value |
| ---- | ----- | 
| **Image Type** | Cloud Services |
| **OS family** | Windows Server 2012 R2 (OS family 4) |
| **Node size** | A8 Standard |
| **Internode communication enabled** | True |
| **Max tasks per node** | 1 |
| **Application package references** | MSMPI |
| **Start task enabled** | True<br>**Command line** - `"cmd /c %AZ_BATCH_APP_PACKAGE_MSMPI#8.1%\\MSMpiSetup.exe -unattend -force"`<br/>**User identity** - Pool autouser, admin<br/>**Wait for success** - True

## Example: NVIDIA Tesla drivers on NC VM pool

To run CUDA applications on a pool of Linux NC nodes, you need to install CUDA Toolkit 9.0 on the nodes. The Toolkit installs the necessary NVIDIA Tesla GPU drivers. Here are sample steps to deploy a custom Ubuntu 16.04 LTS image with the GPU drivers:

1. Deploy an Azure NC-series VM running Ubuntu 16.04 LTS. For example, create the VM in the US South Central region. Make sure that you create the VM with a managed disk.
2. Follow the steps to connect to the VM and [install CUDA drivers](../virtual-machines/linux/n-series-driver-setup.md).
3. Deprovision the Linux agent, and then [capture the Linux VM image](../virtual-machines/linux/capture-image.md).
4. Create a Batch account in a region that supports NC VMs.
5. Using the Batch APIs or Azure portal, create a pool [using the custom image](batch-custom-images.md) and with the desired number of nodes and scale. The following table shows sample pool settings for the image:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Custom Image |
| **Custom Image** | Name of the image |
| **Node agent SKU** | batch.node.ubuntu 16.04 |
| **Node size** | NC6 Standard |



## Next steps

* To run MPI jobs on an Azure Batch pool, see the [Windows](batch-mpi.md) or [Linux](https://blogs.technet.microsoft.com/windowshpc/2016/07/20/introducing-mpi-support-for-linux-on-azure-batch/) examples.

* For examples of GPU workloads on Batch, see the [Batch Shipyard](https://github.com/Azure/batch-shipyard/) recipes.