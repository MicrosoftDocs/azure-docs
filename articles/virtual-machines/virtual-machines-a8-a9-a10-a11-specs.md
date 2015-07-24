<properties
 pageTitle="About the A8, A9, A10, and A11 instances | Microsoft Azure"
 description="Get background information and considerations for using the Azure A8, A9, A10, and A11 compute-intensive instances."
 services="virtual-machines, cloud-services"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="infrastructure-services"
 ms.date="07/22/2015"
 ms.author="danlep"/>

# About the A8, A9, A10, and A11 compute-intensive instances

This article provides background information and considerations for using the Azure A8, A9, A10, and A11 instances, also known as *compute-intensive* instances. Key features of these instances include:

* **High-performance hardware** – The Azure datacenter hardware that runs these instances is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations.

* **RDMA network connection for MPI applications** – When configured with the necessary network drivers, the A8 and A9 instances can communicate with other A8 and A9 instances over a low-latency, high-throughput network in Azure that is based on remote direct memory access (RDMA) technology. This feature can boost the performance of applications that use supported Linux or Windows Message Passing Interface (MPI) implementations.

* **Support for Linux and Windows HPC clusters** – Deploy cluster management and job scheduling software on the A8, A9, A10, and A11 instances in Azure to create a stand-alone HPC cluster or to add capacity to an on-premises cluster. Like other Azure VM sizes, the A8, A9, A10, and A11 instances support standard or custom Windows Server and Linux operating system images or Azure Resource Manager templates in Azure VMs (IaaS), or Azure Guest OS releases in cloud services (PaaS, for Windows Server only).

>[AZURE.NOTE]A10 and A11 instances have the same performance optimizations and specifications as the A8 and A9 instances. However, they do not include access to the RDMA network in Azure. They are designed for HPC applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications. And for running workloads other than MPI applications, the A8 and A9 instances do not access the RDMA network and are functionally equivalent to the A10 and A11 instances.


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


>[AZURE.IMPORTANT]On A8 and A9 VMs running Linux in IaaS, access to the RDMA network is currently enabled only through applications that use Azure Linux RDMA and Intel MPI Library 5.0 on SUSE Linux Enterprise Server 12 (SLES 12). On A8 and A9 instances running Windows Server in IaaS or PaaS, access to the RDMA network is currently enabled only through applications that use the Microsoft Network Direct interface. See [Access to the RDMA network](#access-the-rdma-network) in this article for additional requirements.

A10 and A11 instances have a single, 10-Gbps Ethernet network adapter that connects to Azure services and the Internet.

## Considerations for the Azure subscription

* **Azure account** – If you want to deploy more than a small number of compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. You can also use your MSDN subscription. See [Azure benefit for MSDN subscribers](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). If you're using an [Azure free trial](http://azure.microsoft.com/pricing/free-trial/), you can use only a limited number of Azure compute cores.

* **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default of 20 cores, which is not enough for many scenarios with 8-core or 16-core instances. For initial tests, you might consider requesting a quota increase to 100 cores. To do this, open a free support ticket as shown in [Understanding Azure limits and increases](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/).

>[AZURE.NOTE]Azure quotas are credit limits, not capacity guarantees. You are charged only for cores that you use.

* **Affinity group** – Currently, an affinity group is not recommended for most new deployments. However, note that if you're using an affinity group that contains instances of sizes other than A8–A11, you won't be able to use it for the A8–A11 instances, and vice versa.

* **Virtual network** – An Azure virtual network is not required to use the compute-intensive instances. However, you may need at least a cloud-based Azure virtual network for many IaaS scenarios, or a site-to-site connection if you need to access on-premises resources such as an application license server. You will need to create a new (regional) virtual network before deploying the instances. Adding an A8, A9, A10, or A11 VM to a virtual network in an affinity group is not supported. For more information, see [How to create a virtual network (VNet)](../virtual-network/virtual-networks-create-vnet.md) and [Configure a virtual network with a site-to-site VPN connection](../vpn-gateway/vpn-gateway-site-to-site-create.md).

* **Cloud service or availability set** – To connect through the RDMA network, the A8 and A9 instances must be deployed in the same cloud service (for IaaS scenarios with Linux-based VMs or Windows-based VMs in Azure Service Management, or PaaS scenarios with Windows Server) or the same availability set (for Linux-based VMs or Windows-based VMs in Azure Resource Manager).

## Considerations for using HPC Pack

### Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft’s free HPC cluster and job management solution for Windows. Starting with HPC Pack 2012 R2 Update 2, HPC Pack supports several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. With the latest release of HPC Pack, you can deploy a Linux-based cluster that can run MPI applications that access the RDMA network in Azure. For more information, see the [HPC Pack documentation](http://go.microsoft.com/fwlink/?LinkId=617894).

### Considerations for HPC Pack and Windows

HPC Pack is not required for you to use the A8, A9, A10, and A11 instances with Windows Server, but it is a recommended tool to create Windows HPC Server–based clusters in Azure. In the case of A8 and A9 instances, HPC Pack is the most efficient way to run Windows-based MPI applications that access the RDMA network in Azure. HPC Pack includes a runtime environment for the Microsoft implementation of the Message Passing Interface for Windows.

For more information and checklists to deploy and use the compute-intensive instances in IaaS and PaaS scenarios with HPC Pack on Windows Server, see [A8 and A9 compute intensive instances: Quick start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx).

## Access to the RDMA network

### Access from Linux A8 and A9 VMs

Within a single cloud service or an availability set, the A8 and A9 instances can access the RDMA network in Azure for running MPI applications that use the Linux RDMA drivers to communicate between instances. At this time, Azure Linux RDMA is supported only with [Intel MPI Library 5.0](https://software.intel.com/en-us/intel-mpi-library/).

>[AZURE.NOTE] Currently, Azure Linux RDMA drivers are not available for installation via driver extensions. They are available only by using the RDMA-enabled SLES 12 image from the Azure Marketplace.

See the following table for prerequisites for Linux MPI applications to access the RDMA network in clusters of compute nodes (IaaS). See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-cluster-rdma.md) for deployment options and configuration steps.

Prerequisite | Virtual machines (IaaS)
------------ | -------------
Operating system | SLES 12 HPC image from the Azure Marketplace
MPI | Intel MPI Library 5.0

### Access from Windows A8 and A9 instances

Within a single cloud service or availability set, the A8 and A9 instances can access the RDMA network in Azure for running MPI applications that use the Microsoft Network Direct interface to communicate between instances. The A10 and A11 instances do not include access to the RDMA network.

See the following table for prerequisites for MPI applications to access the RDMA network in virtual machine (IaaS) and cloud service (PaaS) deployments of the A8 or A9 instances. For typical deployment scenarios, see [A8 and A9 compute intensive instances: Quick start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx).


Prerequisite | Virtual machines (IaaS) | Cloud services (PaaS)
---------- | ------------ | -------------
Operating system | Windows Server 2012 R2 or Windows Server 2012 | Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 Guest OS family
MPI | MS-MPI 2012 R2 or later, either stand-alone or installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5.0 | MS-MPI 2012 R2 or later, installed via HPC Pack 2012 R2 or later<br/><br/>Intel MPI Library 5.0


>[AZURE.NOTE]For IaaS scenarios, the [HpcVmDrivers extension](https://msdn.microsoft.com/library/azure/dn690126.aspx) must be added to the VMs to install Windows drivers that are needed for RDMA connectivity.


## Additional things to know

* The A8–A11 VM sizes are available only in the Standard pricing tier.

* You can't resize an existing Azure VM to the A8, A9, A10, or A11 size.

* A8, A9, A10, and A11 instances can't currently be deployed by using a cloud service that is part of an existing affinity group. Likewise, an affinity group with a cloud service that contains A8, A9, A10, and A11 instances can't be used for deployments of other instance sizes. If you attempt these deployments, you will see an error message similar to `Azure deployment failure (Compute.OverconstrainedAllocationRequest): The VM size (or combination of VM sizes) required by this deployment cannot be provisioned due to deployment request constraints.`

* The RDMA network in Azure reserves the address space 172.16.0.0/12. If you plan to run MPI applications on A8 and A9 instances that are deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

## Next steps

* For details about availability and pricing of the A8, A9, A10, and  A11 instances, see [Virtual Machines pricing](http://azure.microsoft.com/pricing/details/virtual-machines/) and [Cloud Services pricing](http://azure.microsoft.com/pricing/details/cloud-services/).
* To deploy and configure a Linux-based cluster with A8 and A9 instances to access the Azure RDMA network, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-cluster-rdma.md).
* To get started deploying and using A8 and A9 instances with HPC Pack on Windows, see [A8 and A9 compute intensive instances: Quick start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx) and [Run MPI applications on A8 and A9 instances](https://msdn.microsoft.com/library/azure/dn592104.aspx).
