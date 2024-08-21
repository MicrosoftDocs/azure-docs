---
title: Set up InfiniBand on HPC VMs - Azure Virtual Machines | Microsoft Docs
description: Learn how to set up InfiniBand on Azure HPC VMs.
ms.service: azure-virtual-machines
ms.subservice: hpc
ms.topic: article
ms.date: 08/05/2024
ms.reviewer: cynthn
ms.author: padmalathas
author: padmalathas
---

# Set up InfiniBand

> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!TIP]
> Try the **[Virtual machines selector tool](https://aka.ms/vm-selector)** to find other sizes that best fit your workload.

This article shares some information on RDMA-capable instances to be used over an InfiniBand (IB) network.

## RDMA-capable instances

Most of the HPC VM sizes feature a network interface for remote direct memory access (RDMA) connectivity. Selected [N-series](./nc-series.md) sizes designated with 'r' are also RDMA-capable. This interface is in addition to the standard Azure Ethernet network interface available in the other VM sizes.

This secondary interface allows the RDMA-capable instances to communicate over an InfiniBand (IB) network, operating at HDR rates for HBv4, HBv3, HBv2, EDR rates for HB, HC, HX, NDv2, and FDR rates for H16r, H16mr, and other RDMA-capable N-series virtual machines. These RDMA capabilities can boost the scalability and performance of Message Passing Interface (MPI) based applications.

> [!NOTE]
> **SR-IOV support**: In Azure HPC, currently there are two classes of VMs depending on whether they are SR-IOV enabled for InfiniBand. Currently, almost all the newer generation, RDMA-capable or InfiniBand enabled VMs on Azure are SR-IOV enabled except for H16r, H16mr, and NC24r.
> RDMA is only enabled over the InfiniBand (IB) network and is supported for all RDMA-capable VMs.
> IP over IB is only supported on the SR-IOV enabled VMs.
> RDMA is not enabled over the Ethernet network.

- **Operating System** - Linux distributions such as CentOS, RHEL, AlmaLinux, Ubuntu, SUSE are commonly used. Windows Server 2016 and newer versions are supported on all the HPC series VMs. Note that [Windows Server 2012 R2 is not supported on HBv2 onwards as VM sizes with more than 64 (virtual or physical) cores](/windows-server/virtualization/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows). See [VM Images](./workloads/hpc/configure.md) for a list of supported Linux VM images on the Azure Marketplace and how they can be configured appropriately. The respective VM size pages also list out the software stack support.

- **InfiniBand and Drivers** - On InfiniBand enabled VMs, the appropriate drivers are required to enable RDMA. See [enabling InfiniBand](./workloads/hpc/enable-infiniband.md) to learn about VM extensions or manual installation of InfiniBand drivers.

- **MPI** - The SR-IOV enabled VM sizes on Azure allow almost any flavor of MPI to be used with Mellanox OFED. See [Setup MPI for HPC](./workloads/hpc/setup-mpi.md) for more details on setting up MPI on HPC VMs on Azure.

  > [!NOTE]
  > **RDMA network address space**: The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

## Cluster configuration options

Azure provides several options to create clusters of HPC VMs that can communicate using the RDMA network, including: 

- **Virtual machines**  - Deploy the RDMA-capable HPC VMs in the same scale set or availability set (when you use the Azure Resource Manager deployment model). If you use the classic deployment model, deploy the VMs in the same cloud service.

- **Virtual machine scale sets** - In a virtual machine scale set, ensure that you limit the deployment to a single placement group for InfiniBand communication within the scale set. For example, in a Resource Manager template, set the `singlePlacementGroup` property to `true`. Note that the maximum scale set size that can be spun up with `singlePlacementGroup=true` is capped at 100 VMs by default. If your HPC job scale needs are higher than 100 VMs in a single tenant, you may request an increase, [open an online customer support request](../azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. The limit on the number of VMs in a single scale set can be increased to 300. Note that when deploying VMs using Availability Sets the maximum limit is at 200 VMs per Availability Set.

  > [!NOTE]
  > **MPI among virtual machines**: If RDMA (e.g. using MPI communication) is required between virtual machines (VMs), ensure that the VMs are in the same virtual machine scale set or availability set.

- **Azure CycleCloud** - Create an HPC cluster using [Azure CycleCloud](/azure/cyclecloud/) to run MPI jobs.

- **Azure Batch** - Create an [Azure Batch](../batch/index.yml) pool to run MPI workloads. To use compute-intensive instances when running MPI applications with Azure Batch, see [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../batch/batch-mpi.md).

- **Microsoft HPC Pack** - [HPC Pack](/powershell/high-performance-computing/overview) includes a runtime environment for MS-MPI that uses the Azure RDMA network when deployed on RDMA-capable Linux VMs. For example deployments, see [Set up a Linux RDMA cluster with HPC Pack to run MPI applications](/powershell/high-performance-computing/hpcpack-linux-openfoam).

## Deployment considerations

- **Azure subscription** – To deploy more than a few compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

- **Pricing and availability** - Check [VM pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [availability](https://azure.microsoft.com/global-infrastructure/services/) by Azure regions.

- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the H-series. To request a quota increase, [open an online customer support request](../azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. (Default limits may vary depending on your subscription category.)

  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  
- **Virtual network** – An Azure [virtual network](../virtual-network/index.yml) is not required to use the compute-intensive instances. However, for many deployments you need at least a cloud-based Azure virtual network, or a site-to-site connection if you need to access on-premises resources. When needed, create a new virtual network to deploy the instances. Adding compute-intensive VMs to a virtual network in an affinity group is not supported.

- **Resizing** – Because of their specialized hardware, you can only resize compute-intensive instances within the same size family (H-series or N-series). For example, you can only resize an H-series VM from one H-series size to another. Additional considerations around InfiniBand driver support and NVMe disks may need to be considered for certain VMs.


## Next steps

- Learn more about [configuring your VMs](./workloads/hpc/configure.md), [enabling InfiniBand](./workloads/hpc/enable-infiniband.md), [setting up MPI](./workloads/hpc/setup-mpi.md) and optimizing HPC applications for Azure at [HPC Workloads](./workloads/hpc/overview.md).
- Review the [HBv3-series overview](hbv3-series-overview.md) and [HC-series overview](hc-series-overview.md).
- Read about the latest announcements, HPC workload examples, and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
