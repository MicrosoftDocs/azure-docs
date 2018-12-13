---
title: Azure Windows VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Windows high performance computing virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-windows
documentationcenter: ''
author: jonbeck7
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 10/12/2018
ms.author: jonbeck

---

# High performance compute VM sizes

[!INCLUDE [virtual-machines-common-sizes-hpc](../../../includes/virtual-machines-common-sizes-hpc.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../includes/virtual-machines-common-sizes-table-defs.md)]

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]


* **Operating system** - Windows Server 2016, Windows Server 2012 R2, Windows Server 2012

* **MPI** - Microsoft MPI (MS-MPI) 2012 R2 or later, Intel MPI Library 5.x

  Supported MPI implementations use the Microsoft Network Direct interface to communicate between instances. 

* **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

* **HpcVmDrivers VM extension** - On RDMA-capable VMs, add the HpcVmDrivers extension to install Windows network device drivers for RDMA connectivity. (In certain deployments of A8 and A9 instances, the HpcVmDrivers extension is added automatically.) To add the VM extension to a VM, you can use [Azure PowerShell](/powershell/azure/overview) cmdlets. 

  
  The following command installs the latest version 1.1 HpcVMDrivers extension on an existing RDMA-capable VM named *myVM* deployed in the resource group named *myResourceGroup* in the *West US* region:

  ```PowerShell
  Set-AzureRmVMExtension -ResourceGroupName "myResourceGroup" -Location "westus" -VMName "myVM" -ExtensionName "HpcVmDrivers" -Publisher "Microsoft.HpcCompute" -Type "HpcVmDrivers" -TypeHandlerVersion "1.1"
  ```
  
  For more information, see [Virtual machine extensions and features](extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). You can also work with extensions for VMs deployed in the [classic deployment model](classic/manage-extensions.md).

### Cluster configuration options

Azure provides several options to create clusters of Windows HPC VMs that can communicate using the RDMA network, including: 

* **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service. 

* **Virtual machine scale sets** - In a VM scale set, ensure that you limit the deployment to a single placement group. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. 

* **Azure CycleCloud** - Create an HPC cluster in [Azure CycleCloud](/azure/cyclecloud/) to run MPI jobs on Windows nodes.

* **Azure Batch** - Create an [Azure Batch](/azure/batch/) pool to run MPI workloads on Windows Server compute nodes. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](../../batch/batch-pool-compute-intensive-sizes.md). Also see the [Batch Shipyard](https://github.com/Azure/batch-shipyard) project, for running container-based workloads on Batch.

* **Microsoft HPC Pack** - [HPC Pack](https://docs.microsoft.com/powershell/high-performance-computing/overview) includes a runtime environment for MS-MPI that uses the Azure RDMA network when deployed on RDMA-capable Windows VMs. For example deployments, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](../virtual-machines-windows-sizes-memory.md)
- [Storage optimized](../virtual-machines-windows-sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- For checklists to use the compute-intensive instances with HPC Pack on Windows Server, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

- To use compute-intensive instances when running MPI applications with Azure Batch, see [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../../batch/batch-mpi.md).

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.




