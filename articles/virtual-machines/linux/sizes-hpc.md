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
ms.date: 07/06/2018
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
 
### Cluster configuration 
    
Additional system configuration is needed to run MPI jobs on clustered VMs. For example, on a cluster of VMs, you need to establish trust among the compute nodes. For typical settings, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

### Network topology considerations
* On RDMA-enabled Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.

* The RDMA network in Azure reserves the address space 172.16.0.0/16. 


## Using HPC Pack
[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx), Microsoft’s free HPC cluster and job management solution, is one option for you to use the compute-intensive instances with Linux. The latest releases of HPC Pack support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. With RDMA-capable Linux compute nodes running Intel MPI, HPC Pack can schedule and run Linux MPI applications that access the RDMA network. See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](classic/hpcpack-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU](../windows/sizes-gpu.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- To get started deploying and using compute-intensive sizes with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.




