---
title: About compute-intensive VMs with Windows | Microsoft Docs
description: Get background information and considerations for using the Azure H-series and A8, A9, A10, and A11 compute-intensive sizes for Windows VMs and cloud services
services: virtual-machines-windows, cloud-services
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 28d8e1f2-8e61-4fbe-bfe8-80a68443baba
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# About H-series and compute-intensive A-series VMs for Windows
Here is background information and some considerations for using the newer Azure H-series and the earlier A8, A9, A10, and A11 instances, also known as *compute-intensive* instances. This article focuses on using these instances for Windows VMs. You can also use them for [Linux VMs](../linux/a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For basic specs, storage capacities, and disk details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

[!INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network
To access the Azure RDMA network for Windows MPI traffic, RDMA-capable instances must meet the following requirements: 

* **Operating system**
  
  * **Virtual machines** - Windows Server 2012 R2, Windows Server 2012
  * **Cloud services** - Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 Guest OS family

    > [!NOTE]
    > Currently, Windows Server 2016 does not support RDMA connectivity in Azure.
    >
    
* **MPI** - Microsoft MPI (MS-MPI) 2012 R2 or later, Intel MPI Library 5.x

  Supported MPI implementations use the Microsoft Network Direct interface to communicate between instances. 
* **HpcVmDrivers VM extension** - On RDMA-capable VMs, the HpcVmDrivers extension must be added to install Windows network device drivers that enable RDMA connectivity. (In certain deployments of A8 and A9 instances, the HpcVmDrivers extension is added automatically.) If you need to add the VM extension to a VM, you can use [Azure PowerShell](/powershell/azure/overview) cmdlets. 

  
  For example, to install the latest version 1.1 HpcVMDrivers extension on an existing RDMA-capable VM named myVM deployed in the Resource Manager deployment model:

  ```PowerShell
  Set-AzureRmVMExtension -ResourceGroupName "myResourceGroup" -Location "westus" -VMName "myVM" -ExtensionName "HpcVmDrivers" -Publisher "Microsoft.HpcCompute" -Type "HpcVmDrivers" -TypeHandlerVersion "1.1"
  ```
  For more information, see [Virtual machine extensions and features](extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). You can also work with extensions for VMs deployed in the [classic deployment model](classic/manage-extensions.md).


## Considerations for HPC Pack and Windows
[Microsoft HPC Pack](https://technet.microsoft.com/library/jj899572.aspx), Microsoft’s free HPC cluster and job management solution, is not required for you to use the compute-intensive instances with Windows Server. However, it is one option for you to create a compute cluster in Azure to run Windows-based MPI applications and other HPC workloads. HPC Pack 2012 R2 and later versions include a runtime environment for MS-MPI that can use the Azure RDMA network when deployed on RDMA-capable VMs.

For more information and checklists to use the compute-intensive instances with HPC Pack on Windows Server, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## Next steps
* For details about availability and pricing of the compute-intensive sizes, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows) and [Cloud Services pricing](https://azure.microsoft.com/pricing/details/cloud-services/).
* For storage capacities and disk details, see [Sizes for virtual machines](../linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* To get started deploying and using compute-intensive instances with HPC Pack on Windows, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
* For information about using compute-intensive instances to run MPI applications with Azure Batch, see [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../../batch/batch-mpi.md).

