---
title: Azure Linux VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Linux high performance computing virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-linux
documentationcenter: ''
author: jonbeck7
manager: gwallace
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

The SR-IOV enabled VM sizes on Azure allow almost any flavor of MPI to be used.
On non-SR-IOV enabled VMs, only Intel MPI 5.x versions are supported. Later versions (2017, 2018) of the Intel MPI runtime library may or may not be compatible with the Azure Linux RDMA drivers.


### Supported OS images
 
The Azure Marketplace has many Linux distributions that support RDMA connectivity:
  
* **CentOS-based HPC** - For non-SR-IOV enabled VMs, CentOS-based version 6.5 HPC or a later version, up to 7.5 are suitable. For H-series VMs, versions 7.1 to 7.5 are recommended. RDMA drivers and Intel MPI 5.1 are installed on the VM.
  For SR-IOV VMs, CentOS-HPC 7.6 comes optimized and pre-loaded with the RDMA drivers and various MPI packages installed.
  For other RHEL/CentOS VM images, add the InfiniBandLinux extension to enable InfiniBand. This Linux VM extension installs Mellanox OFED drivers (on SR-IOV VMs) for RDMA connectivity. The following PowerShell cmdlet installs the latest version (version 1.0) of the InfiniBandDriverLinux extension on an existing RDMA-capable VM. The RDMA-capable VM is named *myVM* and is deployed in the resource group named *myResourceGroup* in the *West US* region as follows:

  ```powershell
  Set-AzVMExtension -ResourceGroupName "myResourceGroup" -Location "westus" -VMName "myVM" -ExtensionName "InfiniBandDriverLinux" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverLinux" -TypeHandlerVersion "1.0"
  ```
  Alternatively, VM extensions can be included in Azure Resource Manager templates for easy deployment with the following JSON element:
  ```json
  "properties":{
  "publisher": "Microsoft.HpcCompute",
  "type": "InfiniBandDriverLinux",
  "typeHandlerVersion": "1.0",
  } 
  ```
  
  The following command installs the latest version 1.0 InfiniBandDriverLinux extension on all RDMA-capable VMs in an existing VM scale set named *myVMSS* deployed in the resource group named *myResourceGroup*:
  ```powershell
  $VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS"
  Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "InfiniBandDriverLinux" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverLinux" -TypeHandlerVersion "1.0"
  Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "MyVMSS" -VirtualMachineScaleSet $VMSS
  Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS" -InstanceId "*"
  ```
  
  > [!NOTE]
  > On the CentOS-based HPC images, kernel updates are disabled in the **yum** configuration file. This is because Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.
  >
  

* **SUSE Linux Enterprise Server** - SLES 12 SP3 for HPC, SLES 12 SP3 for HPC (Premium), SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium), SLES 12 SP4 and SLES 15. RDMA drivers are installed and Intel MPI packages are distributed on the VM. Install MPI by running the following command:

  ```bash
  sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm
  ```
  
* **Ubuntu** - Ubuntu Server 16.04 LTS, 18.04 LTS. Configure RDMA drivers on the VM and register with Intel to download Intel MPI:

  [!INCLUDE [virtual-machines-common-ubuntu-rdma](../../../includes/virtual-machines-common-ubuntu-rdma.md)]  

  For more details on enabling InfiniBand, setting up MPI, see [Enable InfiniBand](../workloads/hpc/enable-infiniband.md).


### Cluster configuration options

Azure provides several options to create clusters of Linux HPC VMs that can communicate using the RDMA network, including: 

* **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service. 

* **Virtual machine scale sets** - In a virtual machine scale set, ensure that you limit the deployment to a single placement group. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. 

* **MPI among virtual machines** - If MPI communication if required between virtual machines (VMs), ensure that the VMs are in the same availability set or the virtual machine same scale set.

* **Azure CycleCloud** - Create an HPC cluster in [Azure CycleCloud](/azure/cyclecloud/) to run MPI jobs on Linux nodes.

* **Azure Batch** - Create an [Azure Batch](/azure/batch/) pool to run MPI workloads on Linux compute nodes. For more information, see [Use RDMA-capable or GPU-enabled instances in Batch pools](../../batch/batch-pool-compute-intensive-sizes.md). Also see the [Batch Shipyard](https://github.com/Azure/batch-shipyard) project, for running container-based workloads on Batch.

* **Microsoft HPC Pack** - [HPC Pack](https://docs.microsoft.com/powershell/high-performance-computing/overview) supports several Linux distributions to run on compute nodes deployed in RDMA-capable Azure VMs, managed by a Windows Server head node. For an example deployment, see [Create HPC Pack Linux RDMA Cluster in Azure](https://docs.microsoft.com/powershell/high-performance-computing/hpcpack-linux-openfoam).


### Network considerations
* On non-SR-IOV, RDMA-enabled Linux VMs in Azure, eth1 is reserved for RDMA network traffic. Do not change any eth1 settings or any information in the configuration file referring to this network.
* On SR-IOV enabled VMs (HB and HC-series), ib0 is reserved for RDMA network traffic.
* The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.
* Depending on your choice of cluster management tool, additional system configuration may be needed to run MPI jobs. For example, on a cluster of VMs, you may need to establish trust among the cluster nodes by generating SSH keys or by establishing passwordless SSH logins.


## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU](../windows/sizes-gpu.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- Learn more about how to setup, optimize and scale [HPC workloads](../workloads/hpc/configure.md) on Azure.
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
