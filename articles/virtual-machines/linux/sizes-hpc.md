---
title: Azure Linux VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Linux high performance computing virtual machines in Azure.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/30/2017
ms.author: cynthn

---

# High performance compute Linux VM sizes

[!INCLUDE [virtual-machines-common-sizes-hpc](../../../includes/virtual-machines-common-sizes-hpc.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../includes/virtual-machines-common-sizes-table-defs.md)]

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## RDMA-capable instances
A subset of the compute-intensive instances (H16r, H16mr, A8, and A9) feature a network interface for remote direct memory access (RDMA) connectivity. This interface is in addition to the standard Azure network interface available to other VM sizes. 
  
This interface allows the RDMA-capable instances to communicate over an InfiniBand network, operating at FDR rates for H16r and H16mr virtual machines, and QDR rates for A8 and A9 virtual machines. These RDMA capabilities can boost the scalability and performance of Message Passing Interface (MPI) applications.

Following are requirements for RDMA-capable Linux VMs to access the Azure RDMA network:
 
* **Distributions** - You must deploy VMs from RDMA-capable SUSE Linux Enterprise Server (SLES) or Rogue Wave Software (formerly OpenLogic) CentOS-based HPC images in the Azure Marketplace. The following Marketplace images support RDMA connectivity:
  
    * SLES 12 SP1 for HPC, or SLES 12 SP1 for HPC (Premium)
    
    * CentOS-based 7.1 HPC, or CentOS-based 6.5 HPC  
 
        > [!NOTE]
        > For H-series VMs, we recommend either a SLES 12 SP1 for HPC image or CentOS-based 7.1 HPC image.
        >
        > On the CentOS-based HPC images, kernel updates are disabled in the **yum** configuration file. This is because the Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.
        > 
        > 
* **MPI** - Intel MPI Library 5.x
  
    Depending on the Marketplace image you choose, separate licensing, installation, or configuration of Intel MPI may be needed, as follows: 
  
  * **SLES 12 SP1 for HPC image** - Intel MPI packages are distributed on the VM. Install by running the following command:

      ```bash
      sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm
      ```

  * **CentOS-based HPC images**  - Intel MPI 5.1 is already installed.  
    
    Additional system configuration is needed to run MPI jobs on clustered VMs. For example, on a cluster of VMs, you need to establish trust among the compute nodes. For typical settings, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)

### Network topology considerations
* On RDMA-enabled Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.

* In Azure, IP over InfiniBand (IB) is not supported. Only RDMA over IB is supported.

## Using HPC Pack
[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx), Microsoft’s free HPC cluster and job management solution, is one option for you to use the compute-intensive instances with Linux. The latest releases of HPC Pack support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. With RDMA-capable Linux compute nodes running Intel MPI, HPC Pack can schedule and run Linux MPI applications that access the RDMA network. See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](classic/hpcpack-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU](../windows/sizes-gpu.md)


## Next steps

- To get started deploying and using compute-intensive sizes with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.




