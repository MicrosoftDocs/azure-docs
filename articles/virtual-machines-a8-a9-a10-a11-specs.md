<properties
 pageTitle="About the A8, A9, A10, and A11 instances | Microsoft Azure"
 description="This article provides background information and considerations to use the Azure A8, A9, A10, and A11 compute intensive instances."
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
 ms.date="06/09/2015"
 ms.author="danlep"/>

# About the A8, A9, A10, and A11 Compute Intensive Instances

This article provides background information and considerations to use the Azure A8, A9, A10, and A11 instances, also known as *compute intensive* instances. Key features that distinguish these instances include:

* **High performance hardware** - The Azure data center hardware running these instances is designed and optimized for compute and network intensive applications including high performance computing (HPC) cluster applications, modeling, and simulations.

* **RDMA network connection** - The A8 and A9 instances can communicate over a low latency, high throughput network in Azure that is based on remote direct memory access (RDMA) technology. This feature can boost performance for parallel Message Passing Interface (MPI) applications. (RDMA network access is currently only supported for cloud services and Windows Server-based VMs.)

>[AZURE.NOTE]A10 and A11 instances have the same performance optimizations and specifications as the A8 and A9 instances. However, they do not include access to the RDMA network in Azure. They are designed for HPC applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.

Like [other Azure VM sizes](virtual-machines-size-specs.md), the A8, A9, A10, and A11 instances support standard or custom Windows Server and Linux operating system images in Azure VMs (IaaS), or Azure Guest OS releases in cloud services (PaaS).

## Specs

### CPU and memory

The Azure A8, A9, A10, and A11 compute intensive instances feature high speed, multicore CPUs and large amounts of memory, as shown in the following table.

Size | CPU | Memory
------------- | ----------- | ----------------
A8 and A10 | Intel® Xeon® E5-2670<br/>8 cores @ 2.6 GHz | DDR3-1600 MHz<br/>56 GB
A9 and A11 | Intel® Xeon® E5-2670<br/>16 cores @ 2.6 GHz | DDR3-1600 MHz<br/>112 GB


>[AZURE.NOTE]Additional processor details including supported instruction set extensions are at the Intel.com website.


### Network adapters

A8 and A9 instances have two network adapters, which connect to the following two backend Azure networks.


Network | Description
-------- | -----------
10 Gbps Ethernet | Connects to Azure services (such as storage and virtual network) and to the Internet
32 Gbps backend, RDMA capable | Enables low latency, high throughput application communication between instances within a single cloud service


>[AZURE.IMPORTANT]Access to the RDMA network is currently enabled only through applications that use the Microsoft Network Direct interface. See [Access the RDMA network](#access-the-RDMA-network) in this article.


A10 and A11 instances have a single, 10 Gbps Ethernet network adapter that connects to Azure services and the Internet.

## Considerations for the Azure subscription

* **Azure account** - if you want to deploy more than a small number of compute intensive instances, consider a pay-as-you-go subscription or other purchase options. You can also use your MSDN subscription. See [Azure benefit for MSDN subscribers](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). If you're using an [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/), you can only use a limited number of Azure compute cores.

* **Cores quota** - You might need to increase the cores quota in your Azure subscription from the default of 20 cores, which is not enough for many scenarios with 8-core or 16-core instances. For initial tests you might consider requesting a quota increase to 100 cores. To do this, open a free support ticket as shown in [Understanding Azure Limits and Increases](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/).

>[AZURE.NOTE]Azure quotas are credit limits, not capacity gurantees. You are only charged for cores that you use.

* **Affinity group** - An Azure affinity group can help optimize performance by grouping services or VMs in the same Azure data center. To group the compute intensive instances, we recommend that you create a new affinity group in a region where you plan to deploy the instances. As a best practice, only use the affinity group for the compute intensive instances, not instances of other sizes.

* **Virtual network** - An Azure virtual network is not required to use the compute intensive instances. However, you may need at least a cloud-based Azure virtual network for many IaaS scenarios, or a site-to-site connection if you need to access on-premises resources. You will need to create a new (regional) virtual network before deploying the instances. Adding an A8, A9, A10, or A11 VM to a virtual network in an affinity group is not supported. For more information, see [Create a Virtual Network](https://msdn.microsoft.com/library/azure/dn631643.aspx) and [Configure a Virtual Network with a Site-to-Site VPN Connection](vpn-gateway-site-to-site-create.md).

## Considerations for using HPC Pack

[HPC Pack](https://technet.microsoft.com/library/cc514029), Microsoft’s free HPC cluster and job management solution, is not required for you to use the A8, A9, A10, and A11 instances, but it is a recommended tool to create Windows HPC clusters in Azure. In the case of A8 and A9 instances, HPC Pack is the most efficient way to run Windows MPI applications that access the RDMA network in Azure. HPC Pack includes a runtime environment for the Microsoft implementation of the Message Passing Interface (MS-MPI) for Windows.

For more information and checklists to use the compute intensive instances with HPC Pack, see [A8 and A9 Compute Intensive Instances: Quick Start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx).

## Access the RDMA network

Within a single cloud service, the A8 and A9 instances can access the RDMA network in Azure when running MPI applications that use the Microsoft Network Direct interface to communicate between instances. At this time Network Direct is only supported by Microsoft’s MS-MPI for Windows. The A10 and A11 instances do not include access to the RDMA network.

>[AZURE.NOTE]Like other Azure instances, A8 and A9 instances can run workloads other than MPI applications, by using their available CPU cores, memory, and disk space. However, in these cases, the instances do not connect to the RDMA network and are functionally equivalent to the A10 and A11 instances.


See the following table for prerequisites for MPI applications to access the RDMA network in virtual machine (IaaS) and cloud service (PaaS) deployments of the A8 or A9 instances. For typical deployment scenarios, see [A8 and A9 Compute Intensive Instances: Quick Start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx).


Prerequisite | Virtual machines (IaaS) | Cloud services (PaaS)
---------- | ------------ | -------------
Operating system | Windows Server 2012 R2 or Windows Server 2012 VMs | Windows Server 2012 R2 or Windows Server 2008 R2 Guest OS family
MPI | MS-MPI 2012 R2 or later, either standalone or installed via HPC Pack 2012 R2 or later | MS-MPI 2012 R2 or later, installed via HPC Pack 2012 R2 or later


>[AZURE.NOTE]For IaaS scenarios, the [HpcVmDrivers extension](https://msdn.microsoft.com/library/azure/dn690126.aspx) must be added to the VMs to install Windows drivers needed for RDMA connectivity.


## Additional things to know

* You can't resize an existing Azure VM to the A8, A9, A10, or A11 size.

* A8, A9, A10, and A11 instances can't currently be deployed by using a cloud service that is part of an existing affinity group. Likewise, an affinity group with a cloud service containing A8, A9, A10, and A11 instances can't be used for deployments of other instance sizes. If you attempt these deployments you will see an error message similar to `Azure deployment failure (Compute.OverconstrainedAllocationRequest): The VM size (or combination of VM sizes) required by this deployment cannot be provisioned due to deployment request constraints.`


## Next steps

* For details about availability and pricing of the A8, A9, A10, and  A11 instances, see [Virtual Machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/) and [Cloud Services Pricing](http://azure.microsoft.com/pricing/details/cloud-services/).
* To get started deploying and using A8 and A9 instances with HPC Pack, see [A8 and A9 Compute Intensive Instances: Quick Start with HPC Pack](https://msdn.microsoft.com/library/azure/dn594431.aspx) and [Run MPI Applications on A8 and A9 Instances](https://msdn.microsoft.com/library/azure/dn592104.aspx).
