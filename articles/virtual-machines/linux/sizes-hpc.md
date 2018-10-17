---
title: Azure Linux VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Linux high performance computing virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-linux
documentationcenter: ''
author: jonbeck7
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/12/2018
ms.author: jonbeck

---

# High performance compute virtual machine sizes

[!INCLUDE [virtual-machines-common-sizes-hpc](../../../includes/virtual-machines-common-sizes-hpc.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../includes/virtual-machines-common-sizes-table-defs.md)]

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]


### MPI 

Only Intel MPI 5.x versions are supported. Later versions (2017, 2018) of the Intel MPI runtime library are not compatible with the Azure Linux RDMA drivers.


### Distributions
 
Deploy a compute-intensive VM from one of the images in the Azure Marketplace that supports RDMA connectivity:
  
* **Ubuntu** - Ubuntu Server 16.04 LTS. Configure RDMA drivers on the VM and register with Intel to download Intel MPI:

  [!INCLUDE [virtual-machines-common-ubuntu-rdma](../../../includes/virtual-machines-common-ubuntu-rdma.md)]

* **SUSE Linux Enterprise Server** - SLES 12 SP3 for HPC, SLES 12 SP3 for HPC (Premium), SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium). RDMA drivers are installed and Intel MPI packages are distributed on the VM. Install MPI by running the following command:

  ```bash
  sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm
  ```
    
* **CentOS-based HPC** - CentOS-based 6.5 HPC or a later version (for H-series, version 7.1 or later is recommended). RDMA drivers and Intel MPI 5.1 are installed on the VM.  
 
  > [!NOTE]
  > On the CentOS-based HPC images, kernel updates are disabled in the **yum** configuration file. This is because the Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.
  > 
 
### Cluster configuration options

Azure provides several options to create clusters of Linux HPC VMs that can communicate using the RDMA network, including: 

* **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service. 

* **Virtual machine scale sets** - In a VM scale set, ensure that you limit the deployment to a single placement group. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. 

* **Azure CycleCloud** - Create an HPC cluster in [Azure CycleCloud](/azure/cyclecloud/) to run MPI jobs on Linux nodes.

* **Azure Batch** - Create an [Azure Batch](/azure/batch/) pool to run MPI workloads on Linux compute nodes. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](../../batch/batch-pool-compute-intensive-sizes.md). Also see the [Batch Shipyard](https://github.com/Azure/batch-shipyard) project, for running container-based workloads on Batch.

* **Microsoft HPC Pack** - [HPC Pack](https://docs.microsoft.com/powershell/high-performance-computing/overview) supports several Linux distributions to run on compute nodes deployed in RDMA-capable Azure VMs, managed by a Windows Server head node. For an example deployment, see [Create HPC Pack Linux RDMA Cluster in Azure](https://docs.microsoft.com/powershell/high-performance-computing/hpcpack-linux-openfoam).

Depending on your choice of cluster management tool, additional system configuration may be needed to run MPI jobs. For example, on a cluster of VMs, you may need to establish trust among the cluster nodes by generating SSH keys or by establishing passwordless SSH trust.

### Network topology considerations
* On RDMA-enabled Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.

* The RDMA network in Azure reserves the address space 172.16.0.0/16. 




## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU](../windows/sizes-gpu.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.




