<properties
 pageTitle="About the A8, A9, A10, and A11 instances | Microsoft Azure"
 description="Get background information and considerations for using the Azure A8, A9, A10, and A11 compute-intensive sizes for virtual machines and cloud services."
 services="virtual-machines, cloud-services"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="infrastructure-services"
 ms.date="01/26/2016"
 ms.author="danlep"/>

# About the A8, A9, A10, and A11 compute-intensive instances

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]


This article provides background information and considerations for using the Azure A8, A9, A10, and A11 instances, also known as *compute-intensive* instances. Key features of these instances include:

* **High-performance hardware** – The Azure datacenter hardware that runs these instances is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations.

* **RDMA network connection for MPI applications** – You can set up the A8 and A9 instances to communicate with other A8 and A9 instances over a low-latency, high-throughput network in Azure that is based on remote direct memory access (RDMA) technology. This feature can boost the performance of certain Linux and Windows Message Passing Interface (MPI) applications .

* **Support for Linux and Windows HPC clusters** – Deploy cluster management and job scheduling software on the A8, A9, A10, and A11 instances in Azure to create a stand-alone HPC cluster or to add capacity to an on-premises cluster.

>[AZURE.NOTE]A10 and A11 instances have the same performance optimizations and specifications as the A8 and A9 instances. However, they do not include access to the RDMA network in Azure. They are designed for HPC applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.


## Specs

### CPU and memory

The Azure A8, A9, A10, and A11 compute-intensive instances feature high-speed, multicore CPUs and large amounts of memory, as shown in the following table.

Size | CPU | Memory
------------- | ----------- | ----------------
A8 and A10 | Intel Xeon E5-2670<br/>8 cores @ 2.6 GHz | DDR3-1600 MHz<br/>56 GB
A9 and A11 | Intel Xeon E5-2670<br/>16 cores @ 2.6 GHz | DDR3-1600 MHz<br/>112 GB


>[AZURE.NOTE]Additional processor details, including supported instruction set extensions, are at the Intel.com website. For VM storage capacities and disk details, see [Sizes for virtual machines](virtual-machines-size-specs.md).

### Network adapters

A8 and A9 instances have two network adapters, which connect to the following two back-end Azure networks.


Network | Description
-------- | -----------
10-Gbps Ethernet | Connects to Azure services (such as Azure Storage and Azure Virtual Network) and to the Internet.
32-Gbps back end, RDMA capable | Enables low-latency, high-throughput application communication between instances within a single cloud service or availability set. Reserved for MPI traffic only.


>[AZURE.IMPORTANT]See [Access to the RDMA network](#access-the-rdma-network) in this article for additional requirements for Linux and Windows MPI applications to access the RDMA netowrk.

A10 and A11 instances have a single, 10-Gbps Ethernet network adapter that connects to Azure services and the Internet.

## Deployment considerations

* **Azure account** – If you want to deploy more than a small number of compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. You can also use your MSDN subscription. See [Azure benefit for MSDN subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). If you're using an [Azure free trial](https://azure.microsoft.com/pricing/free-trial/), you can use only a limited number of Azure compute cores.

* **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default of 20 cores per subscription (if you use the classic deployment model) or 20 cores per region (if you use the Azure Resource Manager deployment model). To request a quota increase, open a support ticket at no charge as shown in [Understanding Azure limits and increases](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/).

    >[AZURE.NOTE]Azure quotas are credit limits, not capacity guarantees. You are charged only for cores that you use.

* **Virtual network** – An Azure [virtual network](https://azure.microsoft.com/documentation/services/virtual-network/) is not required to use the compute-intensive instances. However, you may need at least a cloud-based Azure virtual network for many IaaS scenarios, or a site-to-site connection if you need to access on-premises resources such as an application license server. You will need to create a new virtual network to deploy the instances. Adding an A8, A9, A10, or A11 VM to a virtual network in an affinity group is not supported.

* **Cloud service or availability set** – To connect through the RDMA network, the A8 and A9 instances must be deployed in the same cloud service (if you use the classic deployment model) or the same availability set (if you use the Azure Resource Manager deployment model).

## Considerations for using HPC Pack

### Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft’s free HPC cluster and job management solution for Windows. The latest releases of HPC Pack 2012 R2 support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. For more information, see the [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-cluster-hpcpack.md).

### Considerations for HPC Pack and Windows

HPC Pack is not required for you to use the A8, A9, A10, and A11 instances with Windows Server, but it is a recommended tool to create Windows HPC Server–based clusters in Azure. In the case of A8 and A9 instances, HPC Pack is the most efficient way to run Windows-based MPI applications that access the RDMA network in Azure. HPC Pack includes a runtime environment for the Microsoft implementation of the Message Passing Interface (MS-MPI) for Windows.

For more information and checklists to use the compute-intensive instances with HPC Pack on Windows Server, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-hpcpack-cluster-rdma.md).

## Access to the RDMA network

### Access from Linux A8 and A9 VMs

Within a single cloud service or an availability set, the A8 and A9 instances can access the RDMA network in Azure to run Linux MPI applications. At this time, Azure Linux RDMA is supported only with [Intel MPI Library 5](https://software.intel.com/en-us/intel-mpi-library/).

>[AZURE.NOTE] Currently, Azure Linux RDMA drivers are not available for installation via driver extensions. They are available only by using the RDMA-enabled SLES 12 image from the Azure Marketplace.

The following table summarizes prerequisites for Linux MPI applications to access the RDMA network in clusters of compute nodes (IaaS). See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-cluster-rdma.md) for deployment options and configuration steps.

Prerequisite | Virtual machines (IaaS)
------------ | -------------
Operating system | SLES 12 HPC image from the Azure Marketplace
MPI | Intel MPI Library 5

### Access from Windows A8 and A9 instances

Within a single cloud service or availability set, the A8 and A9 instances can access the RDMA network in Azure to run Windows MPI applications that use the Microsoft Network Direct interface to communicate between instances.

See the following table for prerequisites for MPI applications to access the RDMA network in virtual machine (IaaS) and cloud service (PaaS) deployments of the A8 or A9 instances. For typical deployment scenarios, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-hpcpack-cluster-rdma.md).


Prerequisite | Virtual machines (IaaS) | Cloud services (PaaS)
---------- | ------------ | -------------
Operating system | Windows Server 2012 R2 or Windows Server 2012 | Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 Guest OS family
MPI | MS-MPI 2012 R2 or later, either stand-alone or installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5 | MS-MPI 2012 R2 or later, installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5


>[AZURE.NOTE]For IaaS scenarios, the HpcVmDrivers extension must be added to the VMs to install Windows network device drivers that are needed for RDMA connectivity. Depending on your deployment method, the HpcVmDrivers extension might by added to a size A8 or A9 VM automatically, or you might need to add it yourself. To add the extension, see [Manage VM extensions](virtual-machines-extensions-install.md).


## Additional things to know

* **Pricing** - The A8–A11 VM sizes are available only in the Standard pricing tier.

* **Resizing** – You can't resize an instance of size other than A8–A11 to one of the compute-intensive instance sizes (A8-11), and you can’t resize a compute-intensive instance to a non-compute-intensive size. This is because of the specialized hardware and the performance optimizations that are specific to compute-intensive instances.

* **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/12. If you plan to run MPI applications on A8 and A9 instances in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

## Next steps

* For details about availability and pricing of the A8, A9, A10, and A11 instances, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) and [Cloud Services pricing](https://azure.microsoft.com/pricing/details/cloud-services/).
* To deploy and configure a Linux-based cluster with A8 and A9 instances to access the Azure RDMA network, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-cluster-rdma.md).
* To get started deploying and using A8 and A9 instances with HPC Pack on Windows, see [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-hpcpack-cluster-rdma.md).
