<properties
 pageTitle="About the A8 - A11 instances with Windows | Microsoft Azure"
 description="Get background information and considerations for using the Azure A8, A9, A10, and A11 compute-intensive sizes for Windows VMs and cloud services"
 services="virtual-machines-windows, cloud-services"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines-windows"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-windows"
 ms.workload="infrastructure-services"
 ms.date="01/26/2016"
 ms.author="danlep"/>

# About using the A8, A9, A10, and A11 compute-intensive instances with Windows

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network

Within a single cloud service or availability set, the A8 and A9 instances can access the RDMA network in Azure to run Windows MPI applications that use the Microsoft Network Direct interface to communicate between instances.

See the following table for prerequisites for MPI applications to access the RDMA network in virtual machine (IaaS) and cloud service (PaaS) deployments of the A8 or A9 instances. For typical deployment scenarios, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-classic-hpcpack-rdma-cluster.md).


Prerequisite | Virtual machines (IaaS) | Cloud services (PaaS)
---------- | ------------ | -------------
Operating system | Windows Server 2012 R2 or Windows Server 2012 | Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 Guest OS family
MPI | MS-MPI 2012 R2 or later, either stand-alone or installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5 | MS-MPI 2012 R2 or later, installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5


>[AZURE.NOTE]For IaaS scenarios, the HpcVmDrivers extension must be added to the VMs to install Windows network device drivers that are needed for RDMA connectivity. Depending on your deployment method, the HpcVmDrivers extension might by added to a size A8 or A9 VM automatically, or you might need to add it yourself. To add the extension, see [Manage VM extensions](virtual-machines-windows-classic-manage-extensions.md).

## Considerations for HPC Pack and Windows

HPC Pack is not required for you to use the A8, A9, A10, and A11 instances with Windows Server, but it is a recommended tool to run Windows-based MPI applications that access the RDMA network in Azure. HPC Pack includes a runtime environment for the Microsoft implementation of the Message Passing Interface (MS-MPI) for Windows.

For more information and checklists to use the compute-intensive instances with HPC Pack on Windows Server, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-classic-hpcpack-rdma-cluster.md).

## Next steps

* For details about availability and pricing of the A8, A9, A10, and A11 instances, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) and [Cloud Services pricing](https://azure.microsoft.com/pricing/details/cloud-services/).

* To get started deploying and using A8 and A9 instances with HPC Pack on Windows, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-classic-hpcpack-rdma-cluster.md).

* For information about using A8 and A9 instances to run MPI applications with Azure Batch, see [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../batch/batch-mpi.md).
