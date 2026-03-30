---
title: Considerations for Azure VMs DBMS deployment for SAP workload
description: Learn about considerations for Azure virtual machines DBMS deployment for SAP workloads.
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.date: 02/17/2026
author: msjuergent
ms.author: juergent
ms.reviewer: juergent
# Customer intent: "As an IT administrator responsible for deploying SAP workloads, I want to implement a robust and efficient DBMS on Azure virtual machines, so that I can ensure high availability, performance, and compliance with my organization's infrastructure requirements."
---

# Considerations for Azure virtual machines DBMS deployment for SAP workload

This guide is part of the documentation on how to implement and deploy SAP software on Microsoft Azure. Before you read this guide, read the [Planning and implementation guide](./planning-guide.md) and articles the planning guide points you to. This document covers the generic deployment aspects of SAP-related Database Management System (DBMS) on Microsoft Azure virtual machines (VMs) by using the Azure infrastructure as a service (IaaS) capabilities.

The paper complements the SAP installation documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP software on given platforms. In this document, considerations of running SAP-related DBMS systems in Azure VMs are introduced. There are few references to specific DBMS systems in this document. Instead, the specific DBMS systems are handled in other database system specific documents.

There are other articles available on SAP workload on Azure. Start with [SAP workload on Azure: Get started](./get-started.md) and then choose your area of interest.

The following SAP Notes are related to SAP on Azure in regard to the area covered in this document.

| Note number | Title |
| --- | --- |
| [1928533](https://launchpad.support.sap.com/#/notes/1928533) | SAP applications on Azure: Supported products and Azure VM types |
| [2015553](https://launchpad.support.sap.com/#/notes/2015553) | SAP on Microsoft Azure: Support prerequisites |
| [1999351](https://launchpad.support.sap.com/#/notes/1999351) | Troubleshooting enhanced Azure monitoring for SAP |
| [2178632](https://launchpad.support.sap.com/#/notes/2178632) | Key monitoring metrics for SAP on Microsoft Azure |
| [1409604](https://launchpad.support.sap.com/#/notes/1409604) | Virtualization on Windows: Enhanced monitoring |
| [2191498](https://launchpad.support.sap.com/#/notes/2191498) | SAP on Linux with Azure: Enhanced monitoring |
| [2039619](https://launchpad.support.sap.com/#/notes/2039619) | SAP applications on Microsoft Azure using the Oracle database: Supported products and versions |
| [2233094](https://launchpad.support.sap.com/#/notes/2233094) | DB6: SAP applications on Azure using IBM DB2 for Linux, UNIX, and Windows: Additional information |
| [2243692](https://launchpad.support.sap.com/#/notes/2243692) | Linux on Microsoft Azure (IaaS) VM: SAP license issues |
| [2578899](https://launchpad.support.sap.com/#/notes/2578899) | SUSE Linux Enterprise Server 15: Installation Note |
| [1984787](https://launchpad.support.sap.com/#/notes/1984787) | SUSE LINUX Enterprise Server 12: Installation notes |
| [2772999](https://launchpad.support.sap.com/#/notes/2772999) | Red Hat Enterprise Linux 8.x: Installation and Configuration |
| [2002167](https://launchpad.support.sap.com/#/notes/2002167) | Red Hat Enterprise Linux 7.x: Installation and upgrade |
| [2069760](https://launchpad.support.sap.com/#/notes/2069760) | Oracle Linux 7.x SAP installation and upgrade |
| [1597355](https://launchpad.support.sap.com/#/notes/1597355) | Swap-space recommendation for Linux |
| [2799900](https://launchpad.support.sap.com/#/notes/2799900) | Central Technical Note for Oracle Database 19c |
| [2171857](https://launchpad.support.sap.com/#/notes/2171857) | Oracle Database 12c: File system support on Linux |
| [1114181](https://launchpad.support.sap.com/#/notes/1114181) | Oracle Database 11g: File system support on Linux |
| [2969063](https://launchpad.support.sap.com/#/notes/2969063) | Microcode Validation Failed in HCMT on Azure |
| [3246210](https://launchpad.support.sap.com/#/notes/3246210) | Azure - HCMT Fails During Some Disk Performance Tests |

For information on all the SAP Notes for Linux, see the [SAP community wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes).

You need a working knowledge of Microsoft Azure architecture and how Microsoft Azure virtual machines are deployed and operated. For more information, see [Azure documentation](../../index.yml).

In general, the Windows, Linux, and DBMS installation and configuration are essentially the same as any virtual machine or bare metal machine you install on-premises. There are some architecture and system management implementation decisions that are different when you use Azure IaaS. This document explains the specific architectural and system management differences to be prepared for when you use Azure IaaS.

## Storage structure of a VM for RDBMS deployments

To follow this chapter, read the information presented in:

- [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)
- [What SAP software is supported for Azure deployments](./supported-product-on-azure.md)
- [SAP workload on Azure virtual machine supported scenarios](./planning-supported-configurations.md)

For Azure block storage, the usage of Azure Managed Disks is mandatory. For details about Azure Managed Disks read the article [Introduction to managed disks for Azure VMs](/azure/virtual-machines/managed-disks-overview).

In a basic configuration, we usually recommend a deployment structure where the operating system, DBMS, and eventual SAP binaries are separate from the database files. We recommend having separate Azure disks for:

- The operating system (base VHD or OS VHD)
- Database management system executables
- SAP executables like /usr/sap
- DBMS data files
- DBMS redo log files

A configuration that separates these components into five different volumes can result in higher resiliency. Excessive usage on one volume doesn't necessarily interfere with the usage of other volumes as long as VM storage quota and limits aren't exceeded.

The DBMS data, transaction, and redo log files are stored in Azure supported block storage or Azure NetApp Files. Azure Files or Azure Premium Files isn't supported as storage for DBSM data and/or redo log files with SAP workload. They're stored in separate disks and attached as logical disks to the original Azure operating system image VM. For Linux deployments, different recommendations are documented. Read the article [Azure Storage types for SAP workload](./planning-guide-storage.md) for the capabilities and the support of the different storage types for your scenario, specifically for SAP HANA. See [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md).

When you plan your disk layout, find the best balance between these items:

* The number of data files.
* The number of disks that contain the files.
* The IOPS quotas of a single disk or NFS share.
* The data throughput per disk or NFS share.
* The number of extra data disks possible per VM size.
* The overall storage or network throughput a VM can provide.
* The latency different Azure Storage types can provide.
* VM storage IOPS and throughput quota.
* VM network quota in case you're using NFS - traffic to NFS shares is counting against the VM's network quota and **not** the storage quota.
* VM SLAs.

Azure enforces an IOPS quota per data disk or NFS share. These quotas are different for disks hosted on the different Azure block storage solutions or shares. I/O latency is also different between these different storage types as well.

Each of the different VM types has a limited number of data disks that you can attach. Another restriction is that only certain VM types can use, for example, Azure Premium Storage. Typically, you decide to use a certain VM type based on CPU and memory requirements. You also need to consider the IOPS, latency, and disk throughput requirements that usually are scaled with the number of disks, or the type of Azure Premium Storage disks v1. The number of IOPS and the throughput to be achieved by each disk might dictate disk size, especially with Azure Premium Storage v1. With Azure Premium Storage v2 or Ultra Disk, you can select provisioned IOPS and throughput independent of the disk capacity.

For DBMS deployments, we highly recommend Azure Premium Storage (v1 and v2), Ultra Disk or Azure NetApp Files based NFS shares for any data, transaction log, or redo files. It doesn't matter whether you want to deploy production or nonproduction systems. Latency of Azure Standard HDD or SSD isn't acceptable for any type of production system.

> [!NOTE]
> To maximize Azure's [single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/), all disks that are attached must be Azure Premium Storage v1 or v2. It can also be an Azure Ultra Disk type, which includes the base VHD (Azure Premium Storage).

> [!NOTE]
> Using storage hardware in third‑party colocated data centers next to Azure data centers to host main SAP database files, including data and log files, isn't supported. Storage provided through software appliances hosted in Azure VMs, are also not supported for this use case. Only native Azure storage services are supported for the data and transaction log files used by SAP DBMS workloads. Different DBMS might support different Azure storage types. For more details, check the article [Azure Storage types for SAP workload](./planning-guide-storage.md)

IOPS, latency, and throughput requirements determine where database files, logs, and redo files are placed and which Azure storage type is used. Specifically for Azure Premium Storage v1, to achieve enough IOPS, you might be forced to use multiple disks or use a larger Azure Premium Storage disk. If you use multiple disks, build a software stripe across the disks that contain the data files or the log and redo files. In such cases, the striped set reflects the combined IOPS and throughput guarantees of the premium disks. For standard disks, it uses the summed maximum IOPS available.

If your IOPS requirement exceeds what a single VHD can provide, balance the IOPS that is needed for the database files across several VHDs. The easiest way to distribute the IOPS load across disks is to build a software stripe over the different disks. Then place several data files of the SAP DBMS on the LUNs carved out of the software stripe. The number of disks in a stripe depends on the required IOPS, throughput, and total volume capacity.

> ![Windows storage striping][Logo_Windows] Windows
>
> We recommend that you use Windows Storage Spaces to create stripe sets across multiple Azure VHDs. Use at least Windows Server 2012 R2 or Windows Server 2016.
>
> ![Linux storage striping][Logo_Linux] Linux
>
> Only MDADM and Logical Volume Manager (LVM) are supported to build a software RAID on Linux. For more information, see:
>
> - [Configure software RAID on Linux](/previous-versions/azure/virtual-machines/linux/configure-raid) using MDADM
> - [Configure LVM on a Linux VM in Azure](/previous-versions/azure/virtual-machines/linux/configure-lvm) using LVM

For Azure Premium Storage v2 and Ultra Disk, striping might not necessary since you can define IOPS and disk throughput independent of the size of the disk.

> [!NOTE]
> Because Azure Storage keeps three images of the VHDs, it doesn't make sense to configure a redundancy when you stripe. You only need to configure striping so that the I/Os are distributed over the different VHDs.

### Managed and unmanaged disks

An Azure storage account is an administrative construct and also a subject of limitations. For information on capabilities and limitations, see [Azure Storage scalability and performance targets](../../storage/common/scalability-targets-standard-account.md). For standard storage, remember that there's a limit on the IOPS per storage account. See the row that contains **Total Request Rate** in the article [Azure Storage scalability and performance targets](../../storage/common/scalability-targets-standard-account.md). There's also an initial limit on the number of storage accounts per Azure subscription.

As of 2017, Azure introduced the concepts of [Azure Disk Storage](https://azure.microsoft.com/services/managed-disks/) that relieve you of taking care of any storage account administration. Using Azure Managed Disks is the default to deploy for SAP workload in Azure.

> [!IMPORTANT]
> Given the advantages of Azure Managed Disks, it's mandatory that you use Azure Managed Disks for your DBMS deployments and SAP deployments in general.

If you happen to have SAP workload that isn't yet using managed disks, to convert from unmanaged to managed disks, see:

- [Convert a Windows virtual machine from unmanaged disks to managed disks](/azure/virtual-machines/windows/convert-unmanaged-to-managed-disks).
- [Convert a Linux virtual machine from unmanaged disks to managed disks](/azure/virtual-machines/linux/convert-unmanaged-to-managed-disks).

### Caching for VMs and data disks

When you mount disks to VMs, you can choose whether the I/O traffic between the VM and those disks located in Azure storage is cached.

The following recommendations assume these I/O characteristics for standard DBMS:

- It's mostly a read workload against data files of a database. These reads are performance critical for the DBMS system.
- Writing against the data files occurs in bursts based on checkpoints or a constant stream. Averaged over a day, there are fewer writes than reads. Opposite to reads from data files, these writes are asynchronous and don't hold up any user transactions.
- There are hardly any reads from the transaction log or redo files. Exceptions are large I/Os when you perform transaction log backups.
- The main load against transaction or redo log files is writes. Dependent on the nature of the workload, you can have I/Os as small as 4 KB or, in other cases, I/O sizes of 1 MB or more.
- All writes must be persisted on disk in a reliable fashion.

For Azure Premium Storage v1, the following caching options exist:

* None
* Read
* Read/write
* None + Write Accelerator, which is only for Azure M-Series VMs
* Read + Write Accelerator, which is only for Azure M-Series VMs

For Azure Premium Storage v1, we recommend that you use **Read caching for data files** of the SAP database and choose **No caching for the disks of log file(s)**.

> [!NOTE]
> With some of the new M(b)v3 VM types, the usage of read cached Premium SSD v1 storage could result in lower read and write IOPS rates and throughput than you would get if you don't use read cache.

For M-Series deployments, we recommend that you use Azure Write Accelerator only for the disks of your log files. For details, restrictions, and deployment of Azure Write Accelerator, see [Enable Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator).

For Azure Premium Storage v2, Ultra Disk, and Azure NetApp Files, no caching options are offered.

### Azure non-persistent disks

Azure VMs offer non-persistent disks after a VM is deployed. If a VM reboots, all content on those drives can be wiped out. It's a given that data files and log and redo files of databases should under no circumstances be located on those non-persistent drives. There might be exceptions for some databases, where these non-persistent drives could be suitable for tempdb and temp tablespaces.

For more information, see [Understand the temporary drive on Windows VMs in Azure](/archive/blogs/mast/understanding-the-temporary-drive-on-windows-azure-virtual-machines).

> ![Windows non-persistent disk][Logo_Windows] Windows
>
> Drive D: in an Azure VM is a non-persistent drive, which is backed by some local disks on the Azure compute node. Because it's non-persistent, any changes made to the content on drive D: are lost when the VM is rebooted. Changes include files that were stored, directories that were created, and applications that were installed.
>
> ![Linux non-persistent disk][Logo_Linux] Linux
>
> Linux Azure VMs automatically mount a drive at `/mnt/resource` that's a non-persistent drive backed by local disks on the Azure compute node. Because it's non-persistent, any changes made to content in `/mnt/resource` are lost when the VM is rebooted. Changes include files that were stored, directories that were created, and applications that were installed.

### Microsoft Azure Storage resiliency

Microsoft Azure Storage stores the base VHD, with OS and attached disks or blobs, on at least three separate storage nodes. This type of storage is called locally redundant storage (LRS). LRS is the default for all types of storage in Azure.

There are other redundancy methods. For more information, see [Azure Storage replication](../../storage/common/storage-redundancy.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).

> [!NOTE]
> For DBMS VMs and the disks holding database, log, and redo files, the recommended storage types are Azure Premium Storage v1 and v2, Ultra Disk, and Azure NetApp Files. With exception of Azure Premium Storage v1, the only available redundancy method for these storage types is LRS. As a result, you need to configure database methods to enable database data replication into another Azure region or availability zone. Database methods include SQL Server Always On, Oracle Data Guard, and HANA System Replication.

## VM node resiliency

Azure offers several different SLAs for VMs. For more information, see the most recent release of [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines). Because the DBMS layer is critical to availability in an SAP system, you need to understand [different deployment types](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) and maintenance events. For more information on these concepts, see [Manage the availability of virtual machines in Azure](/azure/virtual-machines/availability).

The minimum recommendation for production DBMS scenarios with an SAP workload is to:

- Deploy two VMs using the [chosen deployment type](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) in the same Azure region.
- Run these two VMs in the same Azure virtual network and have NICs attached out of the same subnets.
- Use database methods to keep a hot standby with the second VM. Methods can be SQL Server Always On, Oracle Data Guard, or HANA System Replication.

You also can deploy a third VM in another Azure region and use the same database methods to supply an asynchronous replica in another Azure region.

## Azure network considerations

In large-scale SAP deployments, use the blueprint of [Azure Virtual Datacenter](/azure/architecture/vdc/networking-virtual-datacenter). Use it for your virtual network configuration and permissions and role assignments to different parts of your organization.

These best practices are the result of thousands of customer deployments:

- The virtual networks the SAP application is deployed into don't have access to the internet.
- The database VMs run in the same virtual network as the application layer, separated in a different subnet from the SAP application layer.
- The VMs within the virtual network have a static allocation of the private IP address. For more information, see [IP address types and allocation methods in Azure](../../virtual-network/ip-services/public-ip-addresses.md).
- Routing restrictions to and from the DBMS VMs **aren't** set with firewalls installed on the local DBMS VMs. Instead, traffic routing is defined with [network security groups (NSGs)](../../virtual-network/network-security-groups-overview.md).
- To separate and isolate traffic to the DBMS VM, assign different NICs to the VM. Every NIC gets a different IP address, and every NIC is assigned to a different virtual network subnet. Every subnet has different NSG rules. The isolation or separation of network traffic is a measure for routing and isn't used to set quotas for network throughput.

> [!NOTE]
> Assigning static IP addresses through Azure means to assign them to individual virtual NICs. Don't assign static IP addresses within the guest OS to a virtual NIC. Some Azure services like Azure Backup rely on the fact that at least the primary virtual NIC in the guest OS is set to DHCP and not to static IP addresses. For more information, see [Troubleshoot Azure virtual machine backup](../../backup/backup-azure-vms-troubleshoot.md#networking). To assign multiple static IP addresses to a VM, assign multiple virtual NICs to a VM.

> [!WARNING]
> Trying to use [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and DBMS layers of an SAP NetWeaver, Hybris, or S/4HANA system **isn't** supported. This restriction is for functionality and performance reasons. The communication path between the SAP application layer and the DBMS layer must be a direct one. The restriction doesn't apply to [ASG and NSG rules](../../virtual-network/network-security-groups-overview.md). This exception remains true when the rules allow a direct communication path, including traffic to NFS shares used for DBMS data and redo log files.
>
> Other scenarios where network virtual appliances **aren't** supported:
>
> * In communication paths between Azure VMs acting as Linux Pacemaker cluster nodes, and the SBD devices. See [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP Applications](./high-availability-guide-suse.md).
> * In communication paths between Azure VMs and Windows Server Scale-Out File Server (SOFS). See [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure](./sap-high-availability-guide-wsfc-file-share.md).
>
> Network virtual appliances in communication paths can easily double the network latency between two communication partners. They also can restrict throughput in critical paths between the SAP application layer and the DBMS layer. In some customer scenarios, network virtual appliances can cause Pacemaker Linux clusters to fail. The mentioned scenario reflects communications between the Linux Pacemaker cluster nodes to communicate to their SBD device through a network virtual appliance.

> [!IMPORTANT]
> Another design that **isn't** supported is the segregation of the SAP application layer and the DBMS layer into different Azure virtual networks that aren't [peered](../../virtual-network/virtual-network-peering-overview.md) with each other. We recommend that you segregate the SAP application layer and DBMS layer by using subnets within an Azure virtual network instead of by using different Azure virtual networks.
>
> If you decide not to follow the recommendation and instead segregate the two layers into different virtual networks, the two virtual networks must be [peered](../../virtual-network/virtual-network-peering-overview.md).
>
> Network traffic between two [peered](../../virtual-network/virtual-network-peering-overview.md) Azure virtual networks is subject to transfer costs. Huge data volume that consists of many terabytes is exchanged between the SAP application layer and the DBMS layer. You can accumulate substantial costs if the SAP application layer and DBMS layer are segregated between two peered Azure virtual networks.

### Use Azure Load Balancer to redirect traffic

The use of private virtual IP addresses used in functionalities like SQL Server Always On or HANA System Replication requires the configuration of an Azure load balancer. The load balancer uses probe ports to determine the active DBMS node and route the traffic exclusively to that active database node.

If there's a failover of the database node, there's no need for the SAP application to reconfigure. Instead, the most common SAP application architectures reconnect against the private virtual IP address. Meanwhile, the load balancer reacts to the node failover by redirecting the traffic against the private virtual IP address to the second node.

Azure offers two different [load balancer SKUs](../../load-balancer/load-balancer-overview.md): A basic SKU and a standard SKU. Based on the advantages in setup and functionality, you should use the Standard SKU of the Azure load balancer. One of the large advantages of the Standard version of the load balancer is that the data traffic isn't routed through the load balancer itself.

An example how you can configure an internal load balancer can be found in the article [Tutorial: Configure a SQL Server availability group on Azure Virtual Machines manually](/azure/azure-sql/virtual-machines/windows/availability-group-manually-configure-tutorial-single-subnet#create-an-azure-load-balancer).

> [!NOTE]
> Differences exist between the basic and standard SKUs in how they handle access to public IP addresses and a workaround to standard SKU limitations is available. See [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).

## Deployment of host monitoring

For production use of SAP applications in Azure virtual machines, SAP requires the ability to get host monitoring data from the physical hosts that run the Azure virtual machines. A specific SAP Host Agent patch level is required that enables this capability in SAPOSCOL and SAP Host Agent. The exact patch level is documented in SAP Note [1409604](https://launchpad.support.sap.com/#/notes/1409604).

For more information on the deployment of components that deliver host data to SAPOSCOL and SAP Host Agent and the life-cycle management of those components, start with the article [Implement the Azure VM extension for SAP solutions](./vm-extension-for-sap.md).

## Next steps

For more information on a particular DBMS, see:

- [SQL Server Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-sqlserver.md)
- [Oracle Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-oracle.md)
- [IBM DB2 Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-ibm.md)
- [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](./dbms-guide-ha-ibm.md)
- [High availability of IBM Db2 LUW on Azure VMs on Red Hat Enterprise Linux Server](./high-availability-guide-rhel-ibm-db2-luw.md)
- [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-sapase.md)
- [SAP maxDB, Live Cache, and Content Server deployment on Azure](dbms-guide-maxdb.md)
- [SAP HANA on Azure operations guide](hana-vm-operations.md)
- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [SAP HANA high availability for Azure virtual machines](sap-hana-availability-overview.md)
- [Backup guide for SAP HANA on Azure virtual machines](../../backup/sap-hana-database-about.md)
- [SAP BW NLS implementation guide with SAP IQ on Azure](./dbms-guide-sapiq.md)

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png
