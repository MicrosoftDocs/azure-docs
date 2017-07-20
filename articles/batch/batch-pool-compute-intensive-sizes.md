---
title: Use compute-intensive Azure VMs with Batch | Microsoft Docs
description: How to take advantage of compute-intensive and GPU-capable VM sizes in Azure Batch pools
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
# Use compute-intensive and GPU-enabled instances in Batch pools

When running certain Batch jobs, you might want to take advantage of Azure VM sizes designed for large-scale computation. For example, to run multi-instance [MPI workloads](batch-mpi.md), you can choose RDMA-capable A8, A9, or H-series sizes. These sizes use an InfiniBand network for inter-node communcation, which can accelerate MPI applications. Or for CUDA applications, you can use N-series sizes that include NVIDIA Tesla GPU cards.

This article provides guidance and examples for setting up an Azure Batch pool to use some of Azure's specialized sizes. For VM size specs, storage capacities, disk details, and general deployment considerations, see:

* High performance compute VM sizes - [Linux](../virtual-machines/linux/sizes-hpc.md), [Windows](../virtual-machines/windows/sizes-hpc.md) 

* GPU-enabled VM sizes - [Linux](../virtual-machines/linux/sizes-gpu.md), [Windows](../virtual-machines/windows/sizes-gpu.md) 


## Subscription and account considerations

* **Quotas** - One or more Azure quotas may limit the number or type of nodes you can add to a Batch pool. You are more likely to be limited when you choose HPC, GPU, or other multicore VM sizes, or when using a free subscription. Depending on the type of Batch account you use, the quotas may apply to the account itself or to your subscription.

    * If you created your Batch account in the **Batch service** configuration, you are limited by the [dedicated cores quota per Batch account](batch-quota-limit.md#resource-quotas). By default, this quota is 20 cores.

    * If you created the account in the **User subscription** configuration, your subscription limits the number of VM cores per region that you can use. See [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md). A separate quota applies to [low-priority VMs](batch-low-pri-vms.md), if you use them. Your subsciption also applies a regional quota to certain VM sizes, including HPC and GPU instances. In the user subscription configuration, no additional quotas apply to the Batch account. 

  To request a quota increase, open an [online customer support request](../azure-supportability/how-to-create-azure-support-request.md) at no charge.

* **Regional availability** - Compute-intensive VMs might not be available in the regions where you create your Batch accounts. To make sure the size is available, see [Products available by region](https://azure.microsoft.com/regions/services/).


## Dependencies

For full functionality, some compute-intensive sizes must be deployed with specific supported operating systems. You might also need to install or configure additional driver or other software. See the following tables and linked articles. For strategies to configure Batch pools, see later in this article.


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





## Pool configuration strategies




## Example: Microsoft MPI on an A8 VM pool


## Example: NVIDA Tesla drivers on NC VM pool








## RDMA-capable nodes

When choosing RDMA-capable sizes such as H16r, H16mr, A8, and A9, set the following pool properties:

* **Enable** inter-node communication 
* **Disable** concurrent task execution

Additional requirements follow for pools containing Windows or Linux nodes.

### Windows nodes
* **Supported Marketplace images**: Windows Server 2016, Windows Server 2012 R2, Windows Server 2012.

* **HpcVMDrivers extension**: 

* **MPI**: Install a supported MPI implementation such as [Microsoft MPI 8](https://msdn.microsoft.com/library/bb524831.aspx) or Intel MPI 5 on the pool nodes.

    Using a [StartTask](/dotnet/api/microsoft.azure.batch.starttask) is recommended to install MPI on the Windows nodes. A StartTask executes whenever a node joins a pool, or restarts. For example, if you download the MPI setup package and store it in Azure storage as a pool resource file, you can use code like the following to install MPI using a StartTask:

    ```C#
    // Create a StartTask for the pool which we use for installing MS-MPI on
    // the nodes as they join the pool (or when they are restarted).
    StartTask startTask = new StartTask
    {
        CommandLine = "cmd /c MSMpiSetup.exe -unattend -force",
        ResourceFiles = new List<ResourceFile> { new ResourceFile("https://mystorageaccount.blob.core.windows.net/mycontainer/MSMpiSetup.exe", "MSMpiSetup.exe") },
        RunElevated = true,
        WaitForSuccess = true
    };
    myCloudPool.StartTask = startTask;

    // Commit the fully configured pool to the Batch service to actually create
    // the pool and its compute nodes.
    await myCloudPool.CommitAsync();
    ```



### Linux nodes

* **Supported Marketplace images**: SUSE Linux Enterprise Server 12 SP1 for HPC, SLES 12 HPC, CentOS-based 7.1 HPC
* **MPI**: Intel MPI Library 5.x

    Depending on the Marketplace image you choose, separate licensing, installation, or configuration of Intel MPI may be needed. For details, see [Access to the RDMA network](../virtual-machines/virtual-machines-linux-a8-a9-a10-a11-specs.md#access-to-the-rdma-network).

    Using a [StartTask](/dotnet/api/microsoft.azure.batch.starttask) is recommended to install or configure MPI on the Linux nodes. For example, to install the MPI packages already distributed on SLES 12 for HPC images, use code like the following for your StartTask:

    ```C#
    // Create a StartTask for the pool which we use for installing Intel MPI on
    // the SLES 12 nodes as they join the pool (or when they are restarted).
    // NEED tested rpm command to run in silent mode
    StartTask startTask = new StartTask
    {
        CommandLine = "sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm
",
        RunElevated = true,
        WaitForSuccess = true
    };
    myCloudPool.StartTask = startTask;

    // Commit the fully configured pool to the Batch service to actually create
    // the pool and its compute nodes.
    await myCloudPool.CommitAsync();
    ```


No additional config needed?

### N-series

> [!NOTE]
> N-series sizes are not supported for the CloudService Configuration nodes.
>

### VM configuration







## Linux


## VM configuration only

### Supported distributions for A8, A9, H-series

* 


### Supported distributions for N-series

* Ubuntu 16.04 LTS

See [N-series ]



## Next steps

* [Run MPI jobs](batch-mpi.md)