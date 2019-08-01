---
title: Azure Windows VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Windows high performance computing virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-windows
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 10/12/2018
ms.author: amverma
ms.reviewer: jonbeck
---

# High performance compute VM sizes

[!INCLUDE [virtual-machines-common-sizes-hpc](../../../includes/virtual-machines-common-sizes-hpc.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../includes/virtual-machines-common-sizes-table-defs.md)]

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]


* **Operating system** - Windows Server 2016 on all the above HPC series VMs. Windows Server 2012 R2, Windows Server 2012 are also supported on the non-SR-IOV enabled VMs (hence excluding HB and HC).

* **MPI** - The SR-IOV enabled VM sizes on Azure (HB, HC) allow almost any flavor of MPI to be used with Mellanox OFED.
On non-SR-IOV enabled VMs, supported MPI implementations use the Microsoft Network Direct (ND) interface to communicate between instances. Hence, only Microsoft MPI (MS-MPI) 2012 R2 or later and Intel MPI 5.x versions are supported. Later versions (2017, 2018) of the Intel MPI runtime library may or may not be compatible with the Azure RDMA drivers.

* **InfiniBandDriverWindows VM extension** - On RDMA-capable VMs, add the InfiniBandDriverWindows extension to enable InfiniBand. This Windows VM extension installs Windows Network Direct drivers (on non-SR-IOV VMs) or Mellanox OFED drivers (on SR-IOV VMs) for RDMA connectivity.
In certain deployments of A8 and A9 instances, the HpcVmDrivers extension is added automatically. Note that the HpcVmDrivers VM extension is being deprecated; it will not be updated. To add the VM extension to a VM, you can use [Azure PowerShell](/powershell/azure/overview) cmdlets. 

  The following command installs the latest version 1.0 InfiniBandDriverWindows extension on an existing RDMA-capable VM named *myVM* deployed in the resource group named *myResourceGroup* in the *West US* region:

  ```powershell
  Set-AzVMExtension -ResourceGroupName "myResourceGroup" -Location "westus" -VMName "myVM" -ExtensionName "InfiniBandDriverWindows" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverWindows" -TypeHandlerVersion "1.0"
  ```
  Alternatively, VM extensions can be included in Azure Resource Manager templates for easy deployment, with the following JSON element:
  ```json
  "properties":{
  "publisher": "Microsoft.HpcCompute",
  "type": "InfiniBandDriverWindows",
  "typeHandlerVersion": "1.0",
  } 
  ```

  The following command installs the latest version 1.0 InfiniBandDriverWindows extension on all RDMA-capable VMs in an existing VM scale set named *myVMSS* deployed in the resource group named *myResourceGroup*:

  ```powershell
  $VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS"
  Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "InfiniBandDriverWindows" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverWindows" -TypeHandlerVersion "1.0"
  Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "MyVMSS" -VirtualMachineScaleSet $VMSS
  Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS" -InstanceId "*"
  ```

  For more information, see [Virtual machine extensions and features](extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). You can also work with extensions for VMs deployed in the [classic deployment model](classic/manage-extensions.md).

* **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.


### Cluster configuration options

Azure provides several options to create clusters of Windows HPC VMs that can communicate using the RDMA network, including: 

* **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service. 

* **Virtual machine scale sets** - In a virtual machine scale set, ensure that you limit the deployment to a single placement group. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. 

* **MPI among virtual machines** - If MPI communication if required between virtual machines (VMs), ensure that the VMs are in the same availability set or the virtual machine same scale set.

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
