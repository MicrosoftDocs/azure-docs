<properties
 pageTitle="About the A8 - A11 instances and Linux | Microsoft Azure"
 description="Get background information and considerations for using the Azure A8, A9, A10, and A11 compute-intensive sizes for Linux VMs"
 services="virtual-machines-linux"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="infrastructure-services"
 ms.date="01/26/2016"
 ms.author="danlep"/>

# About using the A8, A9, A10, and A11 compute-intensive instances with Linux

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network

Within a single cloud service or an availability set, the A8 and A9 instances can access the RDMA network in Azure to run Linux MPI applications. At this time, Azure Linux RDMA is only supported with [Intel MPI Library 5](https://software.intel.com/en-us/intel-mpi-library/).

>[AZURE.NOTE] Currently, Azure Linux RDMA drivers are not available for installation via driver extensions. They are available only by using the RDMA-enabled SLES 12 image from the Azure Marketplace.

The following table summarizes prerequisites for Linux MPI applications to access the RDMA network in clusters of compute nodes (IaaS). See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md) for deployment options and configuration steps.

Prerequisite | Virtual machines (IaaS)
------------ | -------------
Operating system | SLES 12 HPC image from the Azure Marketplace
MPI | Intel MPI Library 5

## Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft’s free HPC cluster and job management solution for Windows. The latest releases of HPC Pack 2012 R2 support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. Linux compute nodes deployed on A8 or A9 VMs and running a supported MPI implementation can run MPI applications that access the RDMA network. To get started, see the [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md).

## Next steps

* For details about availability and pricing of the A8, A9, A10, and A11 instances, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/).

* To get started deploying and using A8 and A9 instances with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).


