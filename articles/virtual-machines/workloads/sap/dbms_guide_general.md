---
title: Considerations for Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: Considerations for Azure Virtual Machines DBMS deployment for SAP workload
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/06/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# Considerations for Azure Virtual Machines DBMS deployment for SAP workload
[1114181]:https://launchpad.support.sap.com/#/notes/1114181
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
[2171857]:https://launchpad.support.sap.com/#/notes/2171857
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[deployment-guide]:deployment-guide.md 
[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e 
[planning-guide]:planning-guide.md 

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png


[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-rm-include.md)]

This guide is part of the documentation on implementing and deploying the SAP software on Microsoft Azure. Before reading this guide, read the [Planning and Implementation Guide][planning-guide]. This document covers the  generic deployment aspects of SAP-related DBMS systems on Microsoft Azure Virtual Machines (VMs) using the Azure Infrastructure as a Service (IaaS) capabilities.

The paper complements the SAP Installation Documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP software on given platforms.

In this document, considerations of running SAP-related DBMS systems in Azure VMs are introduced. There are few references to specific DBMS systems in this chapter. Instead the specific DBMS systems are handled within this paper, after this document.

## Definitions upfront
Throughout the document, the following terms are used:

* IaaS: Infrastructure as a Service.
* PaaS: Platform as a Service.
* SaaS: Software as a Service.
* SAP Component: An individual SAP application such as ECC, BW, Solution Manager, or EP.  SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
* SAP Environment: one or more SAP components logically grouped to perform a business function such as Development, QAS, Training, DR, or Production.
* SAP Landscape: This term refers to the entire SAP assets in a customer's IT landscape. The SAP landscape includes all production and non-production environments.
* SAP System: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, SAP BW test system, SAP CRM production system, etc. In Azure deployments, it is not supported to divide these two layers between on-premises and Azure. This means an SAP system is either deployed on-premises or it is deployed in Azure. However, you can deploy the different systems of an SAP landscape in Azure or on-premises. For example, you could deploy the SAP CRM development and test systems in Azure but the SAP CRM production system on-premises.
* Cross-Premises: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site, or ExpressRoute connectivity between the on-premises datacenter(s) and Azure. In common Azure documentation, these kinds of deployments are also described as Cross-Premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Active Directory, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the subscription. Having this extension, the VMs can be part of the on-premises domain. Domain users of the on-premises domain can access the servers and can run services on those VMs (like DBMS services). Communication and name resolution between VMs deployed on-premises and VMs deployed in Azure is possible. This scenario is the most common scenario for deploying SAP assets on Azure. For more information, see [Planning and design for VPN gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-plan-design).

> [!NOTE]
> Cross-Premises deployments of SAP systems where Azure Virtual Machines running SAP systems are members of an on-premises domain are supported for production SAP systems. Cross-Premises configurations are supported for deploying parts or complete SAP landscapes into Azure. Even running the complete SAP landscape in Azure requires having those VMs being part of on-premises domain and AD/LDAP. In former versions of the documentation, Hybrid-IT scenarios were mentioned, where the term *Hybrid* is rooted in the fact that there is a cross-premises connectivity between on-premises and Azure. In this case *Hybrid* also means that the VMs in Azure are part of the on-premises Active Directory.
> 
> 

Some Microsoft documentation describes Cross-Premises scenarios a bit differently, especially for DBMS HA configurations. In the case of the SAP-related documents, the Cross-Premises scenario boils down to having a site-to-site or private [ExpressRoute](https://azure.microsoft.com/services/expressroute/) connectivity and to the fact that the SAP landscape is distributed between on-premises and Azure.

## Resources
The  are various articles on SAP workload on Azure released.  Recommendation is to start in [SAP workload on Azure - Get Started](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started) and then pick the area of interests

The following SAP Notes are related to SAP on Azure regarding the area covered in this document:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Azure VM types |
| [2015553] |SAP on Microsoft Azure: Support Prerequisites |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [2178632] |Key Monitoring Metrics for SAP on Microsoft Azure |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2039619] |SAP Applications on Microsoft Azure using the Oracle Database: Supported Products and Versions |
| [2233094] |DB6: SAP Applications on Azure Using IBM DB2 for Linux, UNIX, and Windows - Additional Information |
| [2243692] |Linux on Microsoft Azure (IaaS) VM: SAP license issues |
| [1984787] |SUSE LINUX Enterprise Server 12: Installation notes |
| [2002167] |Red Hat Enterprise Linux 7.x: Installation and Upgrade |
| [2069760] |Oracle Linux 7.x SAP Installation and Upgrade |
| [1597355] |Swap-space recommendation for Linux |
| [2171857] |Oracle Database 12c - file system support on Linux |
| [1114181] |Oracle Database 11g - file system support on Linux |


Also read the [SCN Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) that contains all SAP Notes for Linux.

You should have a working knowledge about the Microsoft Azure Architecture and how Microsoft Azure Virtual Machines are deployed and operated. You can find more information at [Azure Documentation](https://docs.microsoft.com/azure/).

Though discussing IaaS, in general the Windows, Linux, and DBMS installation and configuration are essentially the same as any virtual machine or bare metal machine you would install on-premises. However, there are some architecture and system management implementation decisions, which are different when utilizing Azure IaaS. The purpose of this document is to explain the specific architectural and system management differences that you must be prepared for when using Azure IaaS.


## <a name="65fa79d6-a85f-47ee-890b-22e794f51a64"></a>Storage structure of a VM for RDBMS Deployments
In order to follow this chapter, it is necessary to understand what was presented in [this][deployment-guide-3] chapter of the [Deployment Guide][deployment-guide]. Knowledge about the different VM-Series and their differences and differences of Azure Standard and [Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage) should be understood and known before reading this chapter.

In terms of Azure Storage for Azure VMs, you should be familiar with the articles:

- [About disks storage for Azure Windows VMs](https://docs.microsoft.com/azure/virtual-machines/windows/about-disks-and-vhds)
- [About disks storage for Azure Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/about-disks-and-vhds) 

In a basic configuration, we usually recommend a structure of deployment where the operating system, DBMS, and eventual SAP binaries are separate from the database files. Therefore, we recommend SAP systems running in Azure Virtual Machines to have the base VHD (or disk) installed with the operating system, database management system executables, and SAP executables. The DBMS data and log files are stored in Azure Storage (Standard or Premium Storage) in separate disks and attached as logical disks to the original Azure operating system image VM. Especially in Linux deployments, there can be different recommendations documented. Especially around SAP HANA.  

When planning your disk layout, you need to find the best balance between the following items:

* The number of data files.
* The number of disks that contain the files.
* The IOPS quotas of a single disk.
* The data throughput per disk.
* The number of additional data disks possible per VM size.
* The overall storage throughput a VM can provide.
* The latency different Azure Storage types can provide.
* VM SLAs

Azure enforces an IOPS quota per data disk. These quotas are different for disks hosted on Azure Standard Storage and Premium Storage. I/O latency is also different between the two storage types.  With Premium Storage delivering factors better I/O latency. Each of the different VM types has a limited number of data disks that you are able to attach. Another restriction is that only certain VM types can leverage Azure Premium Storage. As a result, the decision for a certain VM type might not only be driven by the CPU and memory requirements, but also by the IOPS, latency and disk throughput requirements that usually are scaled with the number of disks or the type of Premium Storage disks. Especially with Premium Storage the size of a disk also might be dictated by the number of IOPS and throughput that needs to be achieved by each disk.

> [!NOTE]
> For DBMS deployments, the usage of Premium Storage for any data, transaction log, or redo files is highly recommended. Thereby it does not matter whether you want to deploy production or non-production systems.

> [!NOTE]
> In order to benefit from Azure's unique [single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) all disks attached need to be of the type Azure Premium Storage, including the base VHD.
>

The placement of the database files and log/redo files and the type of Azure Storage used, should be defined by IOPS, latency, and throughput requirements. In order to have enough IOPS, you might be forced to leverage multiple disks or use a larger Premium Storage disk. In case of using multiple disks, you would build a software stripe across the disks, which contain the data files or log/redo files. In such cases, the IOPS and the disk throughput SLAs of the underlying Premium Storage disks or the maximum achievable IOPS of Azure Standard Storage disks are accumulative for the resulting stripe set. 

As already stated, if your IOPS requirement exceeds what a single VHD can provide, you need to balance the number of IOPS needed for the database files across a number of VHDs. Easiest way to distribute the IOPS load across disks is to build a software stripe over the different disks. Then place a number of data files of the SAP DBMS on the LUNS carved out of the software stripe. the number of disks in the stripe is driven by IOPs demands, disk throughput demands, and volume demands. 


- - -
> ![Windows][Logo_Windows] Windows
> 
> We recommend using Windows Storage Spaces to create such stripe sets across multiple Azure VHDs. It is recommended to use at least Windows Server 2012 R2 or Windows Server 2016.
> 
> ![Linux][Logo_Linux] Linux
> 
> Only MDADM and LVM (Logical Volume Manager) are supported to build a software RAID on Linux. For more information, read the following articles:
> 
> - [Configure Software RAID on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/configure-raid) using  MDADM
> - [Configure LVM on a Linux VM in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/configure-lvm) using LVM
> 
> 

- - -
 
> [!NOTE]
> Since Azure Storage is keeping three images of the VHDs, it does not make sense to configure a redundancy when striping. You only need to configure striping, so, that the I/Os are getting distributed over the different VHDs.
>

### Managed or non-managed disks
An Azure Storage Account is not only an administrative construct, but also a subject of limitations. The limitations are different between Azure Standard Storage Accounst and Azure Premium Storage Accounts. The exact capabilities and limitations are listed in the article [Azure Storage Scalability and Performance Targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets)

For Azure Standard Storage, it is important to recall that there is a limit on the IOPS per storage account (Row containing **Total Request Rate** in the article [Azure Storage Scalability and Performance Targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets)). In addition, there is an initial limit of the number of Storage Accounts per Azure subscription. Therefore, you need to balance VHDs for larger SAP landscape across different storage accounts to avoid hitting the limits of these storage accounts. A tedious work when you are talking about a few hundred virtual machines with more than thousand VHDs. 

Since it is not recommended to use Azure Standard Storage for DBMS deployments in conjunction with SAP workload, references and recommendations to Azure Standard storage are limited to this short [article](https://blogs.msdn.com/b/mast/archive/2014/10/14/configuring-azure-virtual-machines-for-optimal-storage-performance.aspx)

In order to avoid the administrative work of planning and deploying VHDs across different Azure Storage accounts, Microsoft introduced what is called [Managed Disks](https://azure.microsoft.com/services/managed-disks/) in 2017. Managed Disks are available for Azure Standard Storage as well as Azure Premium Storage. The major advantages of Managed Disks compared to non-managed disks list like:

- For Managed Disks, Azure distributes the different VHDs across different storage accounts automatically at deployment time and thereby avoids hitting the limits of an Azure Storage account in terms of data volume, I/O throughput, and IOPS.
- Using Managed Disks, Azure Storage is honoring the concepts of Azure Availability Sets and with that deploys the base VHD and attached disk of a VM into different fault and update domains if the VM is part of an Azure Availability Set.


> [!IMPORTANT]
> Given the advantages of Azure Managed Disks, it is highly recommended to use Azure Managed Disks for your DBMS deployments and SAP deployments in general.
>

To convert from unmanaged to managed disks, consult the articles:

- [Convert a Windows virtual machine from unmanaged disks to managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/convert-unmanaged-to-managed-disks)
- [Convert a Linux virtual machine from unmanaged disks to managed disks](https://docs.microsoft.com/azure/virtual-machines/linux/convert-unmanaged-to-managed-disks)


### <a name="c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f"></a>Caching for VMs and data disks
When you mount disks to VMs, you can choose whether the I/O traffic between the VM and those disks located in Azure storage are cached. Azure Standard and Premium Storage use two different technologies for this type of cache. 

The recommendations below are assuming these I/O characteristics for Standard DBMS:

- It is mostly read workload against data files of a database. These reads are performance critical for the DBMS system
- Writing against the data files is experienced in bursts based on checkpoints or a constant stream. Nevertheless, averaged over the day, the writes are lesser than the reads. In opposite to reads from data files, these writes are asynchronous and are not holding up any user transactions.
- There are hardly any reads from the transaction log or redo files. Exceptions are large I/Os when performing transaction log backups. 
- Main load against transaction or redo log files is writes. Dependent on the nature of workload, you can have I/Os as small as 4 KB or in other cases I/O sizes of 1 MB or more.
- All writes need to be persisted on disk in a reliable fashion

For Azure Standard Storage, the possible cache types are:

* None
* Read
* Read/Write

In order to get consistent and deterministic performance, you should set the caching on Azure Standard Storage for all disks containing **DBMS-related data files, log/redo files, and table space to 'NONE'**. The caching of the base VHD can remain with the default.

For Azure Premium Storage, the following caching options exist:

* None
* Read 
* Read/write 
* None + Write Accelerator (only for Azure M-Series VMs)
* Read + Write Accelerator (only for Azure M-Series VMs)

Recommendation for Azure Premium Storage is to leverage **Read caching for data files** of the SAP database and chose **No caching for the disks of log file(s)**.

For M-Series deployments, it is highly recommended to use Azure Write Accelerator for your DBMS deployment. For details, restrictions and deployment of Azure Write Accelerator consult the document [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator). 


### Azure non-persistent disks
Azure VMs offer non-persistent disks after a VM is deployed. In case of a VM reboot, all content on those drives will be wiped out. Hence, it is a given that data files and log/redo files of databases should under no circumstances be located on those non-persisted drives. There might be exceptions for some of the databases, where these non-persisted drives could be suitable for tempdb and temp tablespaces. However, avoid using those drives for A-Series VMs since those non-persisted drives are limited in throughput with that VM family. For further details, read the article [Understanding the temporary drive on Windows Azure Virtual Machines](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)

- - -
> ![Windows][Logo_Windows] Windows
> 
> Drive D:\ in an Azure VM is a non-persisted drive, which is backed by some local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to the content on the D:\ drive is lost when the VM is rebooted. By "any changes",  like files stored, directories created, applications installed, etc.
> 
> ![Linux][Logo_Linux] Linux
> 
> Linux Azure VMs automatically mount a drive at /mnt/resource that is a non-persisted drive backed by local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to content in /mnt/resource are lost when the VM is rebooted. By any changes, like files stored, directories created, applications installed, etc.
> 
> 

- - -



### <a name="10b041ef-c177-498a-93ed-44b3441ab152"></a>Microsoft Azure Storage resiliency
Microsoft Azure Storage stores the base VHD (with OS) and attached disks or BLOBs on at least three separate storage nodes. This fact is called Local Redundant Storage (LRS). LRS is default for all types of storage in Azure. 

There are several more redundancy methods, which are all described in the article [Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).

> [!NOTE]
>As of Azure Premium Storage, which is the recommended type of storage for DBMS VMs and disks that store database and log/redo files, the only available method is LRS. As a result, you need to configure database methods, like SQL Server Always On, Oracle Data Guard or HANA System Replication to enable database data replication into another Azure Region or another Azure Availability Zone.


> [!NOTE]
> For DBMS deployments, the usage of Geo Redundant Storage as available with Azure Standard Storage is not recommended since it has severe performance impact and does not honor the write order across different VHDs that are attached to a VM. The fact of not honoring the write order across different VHDs bears a high potential to end up in inconsistent databases on the replication target side if database and log/redo files are spread across multiple VHDs (as mostly the case) on the source VM side.

 

## VM node resiliency
The Azure Platform offers several different SLAs for VMs. The exact details can be found in the most recent release of [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/). Since the DBMS layer is usually an availability critical part of an SAP system, you need to make yourself familiar with the concepts of Availability Sets, Availability Zones, and maintenance events. The articles that describe all these concepts is [Manage the availability of Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability) and [Manage the availability of Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/manage-availability).  

Minimum recommendation for production DBMS scenarios with SAP workload is to:

- Deploy two VMs in a separate Availability Set in the same Azure Region.
- These two VMs would run in the same Azure VNet and would have NICs attached out of the same subnets.
- Use database methods to keep a hot standby with the second VM. Methods can be SQL Server Always On, Oracle Data Guard, or HANA System Replication.

Additionally, you can deploy a third VM in another Azure Region and use the same database methods to supply an asynchronous replica in another Azure region.

The way to set up Azure Availability Sets is demonstrated in this [tutorial](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets).



## Azure Network considerations 
In large-scale SAP deployments, recommendation is that you are using the blueprint of [Azure Virtual Datacenter](https://docs.microsoft.com/azure/architecture/vdc/networking-virtual-datacenter) for their VNet configuration and permissions and role assignments to different parts of their organization.

There are several best practices, which resulted out of hundreds of customer deployments:

- The VNet(s) the SAP application is deployed into, does not have access to the Internet.
- The database VMs are running in the same VNet as the application layer.
- The VMs within the VNet have a static allocation of the private IP address. See the article [IP address types and allocation methods in Azure](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm) as reference.
- Routing restrictions to and from the DBMS VMs are **NOT** set with firewalls installed on the local DBMS VMs. Instead traffic routing is defined with [Azure Network Security Groups (NSG)](https://docs.microsoft.com/azure/virtual-network/security-overview)
- For the purpose of separating and isolating traffic to the DBMS VM, you assign different NICs to the VM. Where every NIC has a different IP address and every NIC is an assigned to a different VNet subnet, which again has different NSG rules. Keep in mind that the isolation or separation of network traffic is just a measure for routing and does not allow setting quotas for network throughput.

> [!NOTE]
> You should assign static IP addresses through Azure means to individual vNICs. You should not assign static IP addresses within the guest OS to a vNIC. Some Azure services like Azure Backup Service rely on the fact that at least the primary vNIC is set to DHCP and not to static IP addresses. See also the document [Troubleshoot Azure virtual machine backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-troubleshoot#networking). If you need to assign multiple static IP addresses to a VM, you need to assign multiple vNICs to a VM.
>
>

Using two VMs for your production DBMS deployment within an Azure Availability Set plus a separate routing for the SAP application layer and the management and operations traffic to the two DBMS VMs, the rough diagram would look like:

![Diagram of two VMs in two subnets](./media/virtual-machines-shared-sap-deployment-guide/general_two_dbms_two_subnets.PNG)


### Azure load balancer for redirecting traffic
The usage of private virtual IP addresses used in functionalities like SQL Server Always On or HANA System replication requires the configuration of an Azure Load Balancer. The Azure Load Balancer is able through probe ports to determine the active DBMS node and route the traffic exclusively to that active database node. In case of a failover of the database node, there is no need for the SAP application to reconfigure. Instead the most common SAP applications architectures will reconnect against the private virtual IP address. Meanwhile the Azure load balancer reacted on the node failover by redirecting the traffic against the private virtual IP address to the second node.

Azure offers two different [load balancer SKUs](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview). A basic SKU and a standard SKU. Unless you want to deploy across Azure Availability Zones, the basic load balancer SKU does fine. 

Is the traffic between the DBMS VMs and the SAP application layer always routed through the Azure load balancer all the time? The answer depends on how you configure the load balancer. At this point in time, the incoming traffic to the DBMS VM will always be routed through the Azure load balancer. The outgoing traffic route from the DBMS VM to the application layer VM depends on the configuration of the Azure load balancer. The load balancer offers an option of DirectServerReturn. If that option is configured, the traffic directed from the DBMS VM to the SAP application layer will **NOT** be routed through the Azure load balancer. Instead it will directly go to the application layer. If DirectServerReturn is not configured, the return traffic to the SAP application layer is routed through the Azure load balancer

It is recommended configuring DirectServerReturn in combination with Azure load balancers that are positioned between the SAP application layer and the DBMS layer to reduce network latency between the two layers

An example of setting up such a configuration is published around SQL server Always On in [this article](https://docs.microsoft.com/azure/virtual-machines/windows/sqlclassic/virtual-machines-windows-classic-ps-sql-int-listener).

If you choose to use published github JSON templates as reference for your SAP infrastructure deployments in Azure, you should study this [template for an SAP 3-Tier system](https://github.com/Azure/azure-quickstart-templates/tree/4099ad9bee183ed39b88c62cd33f517ae4e25669/sap-3-tier-marketplace-image-converged-md). In this template, you also can study the correct settings of the Azure load balancer.

### Azure Accelerated Networking
In order to further reduce network latency between Azure VMs, it is highly recommended to choose the option of [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) when deploying Azure VMs for SAP workload. Especially for the SAP application layer and the SAP DBMS layer. 

> [!NOTE]
> Not all VM types are supporting Accelerated Networking. The referenced article is listing the VM types that support Accelerated Networking. 
>  

- - -
> ![Windows][Logo_Windows] Windows
> 
> For Windows consult the article [Create a Windows virtual machine with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-powershell) to understand the concepts and the way how to deploy VMs with Accelerated Networking
> 
> ![Linux][Logo_Linux] Linux
> 
> For Linux read the article [Create a Linux virtual machine with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli) in order to get details for Linux distribution. 
> 
> 

- - -

> [!NOTE]
> In the case of SUSE, Red Hat, and Oracle Linux, Accelerated Networking is supported with recent releases. Older releases like SLES 12 SP2 or RHEL 7.2 are not supporting Azure Accelerated Networking 
>  


## Deployment of Host Monitoring
For production usage of SAP Applications in Azure Virtual Machines, SAP requires the ability to get host monitoring data from the physical hosts running the Azure Virtual Machines. A specific SAP Host Agent patch level is required that enables this capability in SAPOSCOL and SAP Host Agent. The exact patch level is documented in SAP Note [1409604].

For the details regarding deployment of components that deliver host data to SAPOSCOL and SAP Host Agent and the life cycle management of those components, refer to the [Deployment Guide][deployment-guide]


## Next Steps
For documentation on particular DBMS, consult these articles:

- [SQL Server Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_sqlserver.md)
- [Oracle Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_oracle.md)
- [IBM DB2 Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_ibm.md)
- [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_sapase.md)
- [SAP maxDB, Live Cache and Content Server deployment on Azure](dbms_guide_maxdb.md)
- [SAP HANA on Azure operations guide](hana-vm-operations.md)
- [SAP HANA high availability for Azure virtual machines](sap-hana-availability-overview.md)
- [Backup guide for SAP HANA on Azure Virtual Machines](sap-hana-backup-guide.md)

