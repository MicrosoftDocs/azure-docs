---
title: Azure VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for high performance computing virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: vermagit
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: amverma
ms.reviewer: jushiman
---

# High performance computing VM sizes

Azure H-series virtual machines (VMs) are designed to deliver leadership-class performance, MPI scalability, and cost efficiency for a variety of real-world HPC workloads.

[HBv2-series](hbv2-series.md) VMs feature 200 Gb/sec Mellanox HDR InfiniBand, while both HB and HC-series VMs feature 100 Gb/sec Mellanox EDR InfiniBand. Each of these VM types are connected in a non-blocking fat tree for optimized and consistent RDMA performance. HBv2 VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in additional to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and usage of them is strongly recommended.

[HB-series](hb-series.md) VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC 7551 processor cores, 4 GB of RAM per CPU core, and no hyperthreading. The AMD EPYC platform provides more than 260 GB/sec of memory bandwidth.

[HC-series](hc-series.md) VMs are optimized for applications driven by dense computation, such as implicit finite element analysis, molecular dynamics, and computational chemistry. HC VMs feature 44 Intel Xeon Platinum 8168 processor cores, 8 GB of RAM per CPU core, and no hyperthreading. The Intel Xeon Platinum platform supports Intel’s rich ecosystem of software tools such as the Intel Math Kernel Library.

[H-series](h-series.md) VMs are optimized for applications driven by high CPU frequencies or large memory per core requirements. H-series VMs feature 8 or 16 Intel Xeon E5 2667 v3 processor cores, 7 or 14 GB of RAM per CPU core, and no hyperthreading. H-series features 56 Gb/sec Mellanox FDR InfiniBand in a non-blocking fat tree configuration for consistent RDMA performance. H-series VMs support Intel MPI 5.x and MS-MPI.

> [!NOTE]
> The A8 – A11 VMs are planned for retirement on 3/2021. For more information, see [HPC Migration Guide](https://azure.microsoft.com/resources/hpc-migration-guide/).

## RDMA-capable instances

Most of the HPC VM sizes (HBv2, HB, HC, H16r, H16mr, A8 and A9) feature a network interface for remote direct memory access (RDMA) connectivity. Selected [N-series](https://docs.microsoft.com/azure/virtual-machines/nc-series) sizes designated with 'r' such as the NC24rs configurations (NC24rs_v3, NC24rs_v2 and NC24r) are also RDMA-capable. This interface is in addition to the standard Azure network interface available in the other VM sizes.

This interface allows the RDMA-capable instances to communicate over an InfiniBand (IB) network, operating at HDR rates for HBv2, EDR rates for HB, HC, FDR rates for H16r, H16mr, and RDMA-capable N-series virtual machines, and QDR rates for A8 and A9 VMs. These RDMA capabilities can boost the scalability and performance of certain Message Passing Interface (MPI) applications. For more information on speed, see the details in the tables on this page.

> [!NOTE]
> In Azure HPC, there are two classes of VMs depending on whether they are SR-IOV enabled for InfiniBand. Currently, the SR-IOV for InfiniBand enabled VMs are: HBv2, HB, HC and NCv3. Rest of the InfiniBand enabled VMs are not SR-IOV enabled.
> RDMA over IB is supported for all RDMA-capable VMs.
> IP over IB is only supported on the SR-IOV enabled VMs.

- **Operating system** - Linux is very well supported for HPC VMs, distros such as CentOS, RHEL, Ubuntu, SUSE are common. Regarding Windows support, Windows Server 2016 is supported on all the HPC series VMs. Windows Server 2012 R2, Windows Server 2012 are also supported on the non-SR-IOV enabled VMs.

- **MPI** - The SR-IOV enabled VM sizes on Azure (HBv2, HB, HC, NCv3) allow almost any flavor of MPI to be used with Mellanox OFED.
On non-SR-IOV enabled VMs, supported MPI implementations use the Microsoft Network Direct (ND) interface to communicate between VMs. Hence, only Microsoft MPI (MS-MPI) 2012 R2 or later and Intel MPI 5.x versions are supported. Later versions (2017, 2018) of the Intel MPI runtime library may or may not be compatible with the Azure RDMA drivers.

- **InfiniBandDriver<Linux|Windows> VM extension** - On RDMA-capable VMs, add the InfiniBandDriver<Linux|Windows> extension to enable InfiniBand. On Linux, the InfiniBandDriverLinux VM extension installs the Mellanox OFED drivers (on SR-IOV VMs) for RDMA connectivity. On Windows, the InfiniBandDriverWindows VM extension installs Windows Network Direct drivers (on non-SR-IOV VMs) or Mellanox OFED drivers (on SR-IOV VMs) for RDMA connectivity.
In certain deployments of A8 and A9 instances, the HpcVmDrivers extension is added automatically. Note that the HpcVmDrivers VM extension is being deprecated; it will not be updated.
To add the VM extension to a VM, you can use [Azure PowerShell](/powershell/azure/overview) cmdlets. 

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

  The following command installs the latest version 1.0 InfiniBandDriverWindows extension on all RDMA-capable VMs in an existing virtual machine scale set named *myVMSS* deployed in the resource group named *myResourceGroup*:

  ```powershell
  $VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS"
  Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "InfiniBandDriverWindows" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverWindows" -TypeHandlerVersion "1.0"
  Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "MyVMSS" -VirtualMachineScaleSet $VMSS
  Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS" -InstanceId "*"
  ```

  For more information, see [Virtual machine extensions and features](./extensions/overview.md). You can also work with extensions for VMs deployed in the [classic deployment model](https://docs.microsoft.com/previous-versions/azure/virtual-machines/windows/classic/agents-and-extensions-classic).

- **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

## Cluster configuration options

Azure provides several options to create clusters of Windows HPC VMs that can communicate using the RDMA network, including: 

- **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same scale set or availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service.

- **Virtual machine scale sets** - In a virtual machine scale set (VMSS), ensure that you limit the deployment to a single placement group for InfiniBand communication within the VMSS. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. Note that the maximum VMSS size that can be spun up with `singlePlacementGroup` property to `true` is capped at 100 VMs by default. If your HPC job scale needs are higher than 100 VMs in a single VMSS tenant, you may request an increase, [open an online customer support request](../azure-supportability/how-to-create-azure-support-request.md) at no charge. The limit on the number of VMs in a single VMSS can be increased to 300. Note that when deploying VMs using Availability Sets the maximum limit is at 200 VMs per Availability Set.

- **MPI among virtual machines** - If RDMA (e.g. using MPI communication) is required between virtual machines (VMs), ensure that the VMs are in the same virtual machine scale set or availability set.

- **Azure CycleCloud** - Create an HPC cluster in [Azure CycleCloud](/azure/cyclecloud/) to run MPI jobs.

- **Azure Batch** - Create an [Azure Batch](/azure/batch/) pool to run MPI workloads. To use compute-intensive instances when running MPI applications with Azure Batch, see [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../batch/batch-mpi.md).

- **Microsoft HPC Pack** - [HPC Pack](https://docs.microsoft.com/powershell/high-performance-computing/overview) includes a runtime environment for MS-MPI that uses the Azure RDMA network when deployed on RDMA-capable Linux VMs. For example deployments, see [Set up a Linux RDMA cluster with HPC Pack to run MPI applications](https://docs.microsoft.com/powershell/high-performance-computing/hpcpack-linux-openfoam).

## Deployment considerations

- **Azure subscription** – To deploy more than a few compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

- **Pricing and availability** - These VM sizes are offered only in the Standard pricing tier. Check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) for availability in Azure regions.

- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the H-series. To request a quota increase, [open an online customer support request](../azure-supportability/how-to-create-azure-support-request.md) at no charge. (Default limits may vary depending on your subscription category.)

  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  
- **Virtual network** – An Azure [virtual network](https://azure.microsoft.com/documentation/services/virtual-network/) is not required to use the compute-intensive instances. However, for many deployments you need at least a cloud-based Azure virtual network, or a site-to-site connection if you need to access on-premises resources. When needed, create a new virtual network to deploy the instances. Adding compute-intensive VMs to a virtual network in an affinity group is not supported.

- **Resizing** – Because of their specialized hardware, you can only resize compute-intensive instances within the same size family (H-series or compute-intensive A-series). For example, you can only resize an H-series VM from one H-series size to another. In addition, resizing from a non-compute-intensive size to a compute-intensive size is not supported.  


## Other sizes

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- Learn more about optimizing your HPC application for Azure and some examples at [HPC Workloads](https://docs.microsoft.com/azure/virtual-machines/workloads/hpc/overview) 

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
