---
title: About compute-intensive VMs with Linux | Microsoft Docs
description: Get background information and considerations for using the H-series and A8, A9, A10, and A11 compute-intensive sizes for Linux VMs
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 16cf6e2d-f401-4b22-af8c-9a337179f5f6
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017
---
# About H-series and compute-intensive A-series VMs for Linux
Here is background information and some considerations for using the newer Azure H-series and the earlier A8, A9, A10, and A11 sizes, also known as *compute-intensive* instances. This article focuses on using these sizes for Linux VMs. You can also use them for [Windows VMs](../windows/a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

For basic specs, storage capacities, and disk details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network
You can create clusters of RDMA-capable Linux VMs that run one of the following supported Linux HPC distributions and a supported MPI implementation to take advantage of the Azure RDMA network. See [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json) for deployment options and sample configuration steps.

* **Distributions** - You must deploy VMs from RDMA-capable SUSE Linux Enterprise Server (SLES) or Rogue Wave Software (formerly OpenLogic) CentOS-based HPC images in the Azure Marketplace. The following Marketplace images support RDMA connectivity:
  
    * SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium)
    
    * CentOS-based 7.1 HPC, CentOS-based 6.5 HPC  
 
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
    
    Additional system configuration is needed to run MPI jobs on clustered VMs. For example, on a cluster of VMs, you need to establish trust among the compute nodes. For typical settings, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

## Considerations for HPC Pack and Linux
[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx), Microsoft’s free HPC cluster and job management solution, provides one option for you to use the compute-intensive instances with Linux. The latest releases of HPC Pack support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. With RDMA-capable Linux compute nodes running Intel MPI, HPC Pack can schedule and run Linux MPI applications that access the RDMA network. To get started, see [Get started with Linux compute nodes in an HPC Pack cluster in Azure](classic/hpcpack-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

## Network topology considerations
* On RDMA-enabled Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.
* In Azure, IP over InfiniBand (IB) is not supported. Only RDMA over IB is supported.



## Next steps
* For details about availability and pricing of the compute-intensive sizes, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux).
* For storage capacities and disk details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* To get started deploying and using compute-intensive sizes with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

