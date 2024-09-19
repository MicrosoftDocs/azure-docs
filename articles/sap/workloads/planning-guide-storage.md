---
title: 'Azure storage types for SAP workload'
description: Planning Azure storage types for SAP workloads
author: msjuergent
manager: bburns
ms.assetid: d7c59cc1-b2d0-4d90-9126-628f9c7a5538
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 07/25/2024
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# Azure Storage types for SAP workload
Azure has numerous storage types that differ vastly in capabilities, throughput, latency, and prices. Some of the storage types aren't, or of limited usable for SAP scenarios. Whereas several Azure storage types are well suited or optimized for specific SAP workload scenarios. Especially for SAP HANA, some Azure storage types got certified for the usage with SAP HANA. In this document, we're going through the different types of storage and describe their capability and usability with SAP workloads and SAP components.

Remark about the units used throughout this article. The public cloud vendors moved to use GiB ([Gibibyte](https://en.wikipedia.org/wiki/Gibibyte)) or TiB ([Tebibyte](https://en.wikipedia.org/wiki/Tebibyte) as size units, instead of Gigabyte or Terabyte. Therefore all Azure documentation and prizing are using those units.  Throughout the document, we're referencing these size units of MiB, GiB, and TiB units exclusively. You might need to plan with MB, GB, and TB. So, be aware of some small differences in the calculations if you need to size for a 400 MiB/sec throughput, instead of a 250 MiB/sec throughput.

## Microsoft Azure Storage resiliency

Microsoft Azure storage of Standard HDD, Standard SSD, Azure premium storage, Premium SSD v2, and Ultra disk keeps the base VHD (with OS) and VM attached data disks or VHDs (Virtual Hard Disk) in three copies on three different storage nodes. Failing over to another replica and seeding of a new replica if there's a storage node failure, is transparent. As a result of this redundancy, it's **NOT** required to use any kind of storage redundancy layer across multiple Azure disks. This fact is called Local Redundant Storage (LRS). LRS is default for these types of storage in Azure. [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) provides sufficient redundancy to achieve the same SLAs (Service Level Agreements) as other native Azure storage.

There are several more redundancy methods, which are all described in the article [Azure Storage replication](../../storage/common/storage-redundancy.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) that applies to some of the different storage types Azure has to offer. 

> [!NOTE]
> Using Azure storage for storing database data and redo log file, LRS is the only supported resiliency level at this point in time

Also keep in mind that different Azure storage types influence the single VM availability SLAs as released in [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines).


### Azure managed disks

Managed disks are a resource type in Azure Resource Manager that can be used instead of VHDs that are stored in Azure Storage Accounts. Managed Disks automatically align with the [availability set][virtual-machines-manage-availability] of the virtual machine they're attached to. With such an alignment, you experience an improvement of the availability of your virtual machine and the services that are running in the virtual machine. For more information, read the [overview article](/azure/virtual-machines/managed-disks-overview).

> [!NOTE]
> We require that new deployments of VMs that use Azure block storage for their disks (all Azure storage except Azure NetApp Files and Azure Files) need to use Azure managed disks for the base VHD/OS disks and data disks which store SAP database files. Independent on whether you deploy the VMs through availability set, across Availability Zones or independent of the sets and zones. Disks that are used for the purpose of storing backups aren't necessarily required to be managed disks.


## Storage scenarios with SAP workloads
Persisted storage is needed in SAP workload in various components of the stack that you deploy in Azure. These scenarios list at minimum like:

- Persistent the base VHD of your VM that holds the operating system and other software you install in that disk. This disk/VHD is the root of your VM. Any changes made to it, need to be persisted. So, that the next time, you stop and restart the VM, all the changes made before still exist. Especially in cases where the VM is getting deployed by Azure onto another host than it was running originally
- Persisted data disks. These disks are VHDs you attach to store application data in. This application data could be data and log/redo files of a database, backup files, or software installations. Means any disk beyond your base VHD that holds the operating system
- File shares or shared disks that contain your global transport directory for NetWeaver or S/4HANA. Content of those shares is either consumed by software running in multiple VMs or is used to build high-availability failover cluster scenarios
- The /sapmnt directory or common file shares for EDI (Electronic Data Interchange) processes or similar. Content of those shares is either consumed by software running in multiple VMs or is used to build high-availability failover cluster scenarios

In the next few sections, the different Azure storage types and their usability for the four SAP workload scenarios gets discussed. A general categorization of how the different Azure storage types should be used is documented in the article [What disk types are available in Azure?](/azure/virtual-machines/disks-types). The recommendations for using the different Azure storage types for SAP workload aren't going to be majorly different.

For support restrictions on Azure storage types for SAP NetWeaver/application layer of S/4HANA, read the [SAP support note 2015553](https://launchpad.support.sap.com/#/notes/2015553). For SAP HANA certified and supported Azure storage types, read the article [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md).

The sections describing the different Azure storage types will give you more background about the restrictions and possibilities using the SAP supported storage. 

### Storage choices when using DBMS replication
Our reference architectures foresee the usage of DBMS (Database Management System) functionality like SQL Server Always On, HANA System Replication, Db2 HADR, or Oracle Data Guard. In case, you're using these technologies between two or multiple Azure virtual machines, the storage types chosen for each of the VMs is required to be the same. Means the storage configuration between active node and replica node in DBMS HA configuration needs to be the same. 
  

## Storage recommendations for SAP storage scenarios
Before going into the details, we're presenting the summary and recommendations already at the beginning of the document. Whereas the details for the particular types of Azure storage are following this section of the document. When we summarize the storage recommendations for the SAP storage scenarios in a table, it looks like:

| Usage scenario | Standard HDD | Standard SSD | Premium Storage | Premium SSD v2 | Ultra disk | Azure NetApp Files | Azure Premium Files |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OS disk | Not suitable |  Restricted suitable (non-prod) | Recommended | Not possible | Not possible | Not possible | Not possible |
| Global transport Directory | Not supported | Not supported | Recommended | Recommended | Recommended | Recommended | Highly Recommended |
| /sapmnt | Not suitable | Restricted suitable (non-prod) | Recommended | Recommended | Recommended | Recommended | Highly Recommended |
| DBMS Data volume SAP HANA M/Mv2 VM families | Not supported | Not supported | Recommended | Recommended | Recommended | Recommended | Not supported |
| DBMS log volume SAP HANA M/Mv2 VM families | Not supported | Not supported | Recommended<sup>1</sup> | Recommended | Recommended | Recommended | Not supported |
| DBMS Data volume SAP HANA Esv3/Edsv4 VM families | Not supported | Not supported | Recommended | Recommended | Recommended | Recommended | Not supported |
| DBMS log volume SAP HANA Esv3/Edsv4 VM families | Not supported | Not supported | Not supported | Recommended | Recommended | Recommended | Not supported |
| HANA shared volume | Not supported | Not supported | Recommended | Recommended | Recommended | Recommended | Recommended |
| DBMS Data volume non-HANA | Not supported | Restricted suitable (non-prod) | Recommended | Recommended | Recommended | Only for specific Oracle releases on Oracle Linux, Db2 and SAP ASE on SLES/RHEL Linux | Not supported |
| DBMS log volume non-HANA M/Mv2 VM families | Not supported | Restricted suitable (non-prod) | Recommended<sup>1</sup> | Recommended | Recommended | Only for specific Oracle releases on Oracle Linux, Db2 and SAP ASE on SLES/RHEL Linux | Not supported |
| DBMS log volume non-HANA non-M/Mv2 VM families | Not supported | restricted suitable (non-prod) | Suitable for up to medium workload | Recommended | Recommended | Only for specific Oracle releases on Oracle Linux, Db2 and SAP ASE on SLES/RHEL Linux | Not supported |


<sup>1</sup>  With usage of [Azure Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator) for M/Mv2 VM families for log/redo log volumes


Characteristics you can expect from the different storage types list like:

| Usage scenario | Standard HDD | Standard SSD | Premium Storage | Premium SSD v2 | Ultra disk | Azure NetApp Files | Azure Premium Files |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Throughput/ IOPS SLA | No | No | Yes | Yes | Yes | Yes | Yes |
| Latency Reads | High | Medium to high | Low | submillisecond | submillisecond | submillisecond | low |
| Latency Writes | High | Medium to high  | Low (submillisecond<sup>1</sup>) | submillisecond | submillisecond | submillisecond | low |
| HANA supported | No | No | yes<sup>1</sup> | Yes | Yes | Yes | No |
| Disk snapshots possible | Yes | Yes | Yes | Yes<sup>3</sup> | No<sup>2</sup> | Yes | No |
| Allocation of disks on different storage clusters when using availability sets | Through managed disks | Through managed disks | Through managed disks | Disk type not supported with VMs deployed through availability sets | Disk type not supported with VMs deployed through availability sets | No<sup>3</sup> | No |
| Aligned with Availability Zones | Yes | Yes | Yes | Yes | Yes | In public preview | No |
| Synchronous Zonal redundancy | Not for managed disks | Not for managed disks | Not supported for DBMS | No | No | No | Yes |
| Asynchronous Zonal redundancy | Not for managed disks | Not for managed disks | Not supported for DBMS | No | No | In preview | No |
| Geo redundancy | Not for managed disks | Not for managed disks | No | No | No | Possible | No |


<sup>1</sup> With usage of [Azure Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator) for M/Mv2 VM families for log/redo log volumes

<sup>2</sup> Creation of different Azure NetApp Files capacity pools doesn't guarantee deployment of capacity pools onto different storage units

<sup>3</sup> (Incremental) Snapshots of a Premium SSD v2 or an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot


> [!IMPORTANT]
> Check out the Azure NetApp Files section of this document to find specifics around proximity placement of NFS volumes and VMs when less than 1 millisecond latencies are required.


## Azure premium storage
Azure premium SSD storage got introduced with the goal to provide:

* Low I/O latency
* SLAs for IOPS and throughput
* Less variability in I/O latency

This type of storage is targeting DBMS workloads, storage traffic that requires low single digit millisecond latency, and SLAs on IOPS and throughput. Cost basis for Azure premium storage isn't the actual data volume stored in such disks, but the size category of such a disk, independent of the amount of the data that is stored within the disk. You also can create disks on premium storage that aren't directly mapping into the size categories shown in the article [Premium SSD](/azure/virtual-machines/disks-types#premium-ssds). Conclusions out of this article are:

- The storage is organized in ranges. For example, a disk in the range 513 GiB to 1,024 GiB capacity share the same capabilities and the same monthly costs
- The IOPS per GiB aren't tracking linear across the size categories. Smaller disks below 32 GiB have higher IOPS rates per GiB. For disks beyond 32 GiB to 1,024 GiB, the IOPS rate per GiB is between 4-5 IOPS per GiB. For larger disks up to 32,767 GiB, the IOPS rate per GiB is going below 1
- The I/O throughput for this storage isn't linear with the size of the disk category. For smaller disks, like the category between 65 GiB and 128 GiB capacity, the throughput is around 780 KB per GiB. Whereas for the extreme large disks like a 32,767 GiB disk, the throughput is around 28 KB per GiB
- The IOPS and throughput SLAs can't be changed without changing the capacity of the disk


The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Suitable | All systems |
| Data disk | Suitable | All systems - [Specially for SAP HANA](/azure/virtual-machines/how-to-enable-write-accelerator) |
| SAP global transport directory | Yes | [Supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | Suitable | All systems |
| Backup storage | Suitable | For short term storage of backups |
| Shares/shared disk | Not available | Needs Azure Premium Files or third party |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | Low to medium | - |
| IOPS SLA | Yes | - |
| IOPS linear to capacity | semi linear in brackets  | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| Maximum IOPS per disk | 20,000 [dependent on disk size](https://azure.microsoft.com/pricing/details/managed-disks/) | Also consider [VM limits](/azure/virtual-machines/sizes) |
| Throughput SLA | Yes | - |
| Throughput linear to capacity | Semi linear in brackets | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| HANA certified | Yes | [specially for SAP HANA](/azure/virtual-machines/how-to-enable-write-accelerator) |
| Azure Write Accelerator support | No | - |
| Disk bursting | Yes | - |
| Disk snapshots possible | Yes | - |
| Azure Backup VM snapshots possible | Yes | - |
| Costs | Medium| - |

Azure premium storage doesn't fulfill SAP HANA storage latency KPIs with the common caching types offered with Azure premium storage. In order to fulfill the storage latency KPIs for SAP HANA log writes, you need to use Azure Write Accelerator caching as described in the article [Enable Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator). Azure Write Accelerator benefits all other DBMS systems for their transaction log writes and redo log writes. Therefore, it's recommended to use it across all the SAP DBMS deployments. For SAP HANA, the usage of Azure Write Accelerator for **/hana/log** with Azure premium storage is mandatory.



**Summary:** Azure premium storage is one of the Azure storage types recommended for SAP workload. This recommendation applies for nonproduction and production systems. Azure premium storage is suited to handle database workloads. The usage of Azure Write Accelerator is going to improve write latency against Azure premium disks substantially. However, for DBMS systems with high IOPS and throughput rates, you need to either overprovision storage capacity. Or you need to use functionality like Windows Storage Spaces or logical volume managers in Linux to build stripe sets that give you the desired capacity on the one side. But also the necessary IOPS or throughput at best cost efficiency.


### Azure burst functionality for premium storage
For Azure premium storage disks smaller or equal to 512 GiB in capacity, burst functionality is offered. The exact way how disk bursting works is described in the article [Disk bursting](/azure/virtual-machines/disk-bursting). When you read the article, you understand the concept of accruing IOPS and throughput in the times when your I/O workload is below the nominal IOPS and throughput of the disks (for details on the nominal throughput see [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/)). You're going to accrue the delta of IOPS and throughput between your current usage and the nominal values of the disk. The bursts  are limited to a maximum of 30 minutes.

The ideal cases where this burst functionality can be planned in is likely going to be the volumes or disks that contain data files for the different DBMS. The I/O workload expected against those volumes, especially with small to mid-ranged systems is expected to look like:

- Low to moderate read workload since data ideally is cached in memory. Or like with SAP HANA should be completely in memory
- Bursts of write triggered by database checkpoints or savepoints that are issued regularly
- Backup workload that reads in a continuous stream in cases where backups aren't executed via storage snapshots
- For SAP HANA, load of the data into memory after an instance restart

Especially on smaller DBMS systems where your workload is handling a few hundred transactions per seconds only, such a burst functionality can make sense as well for the disks or volumes that store the transaction or redo log. Expected workload against such a disk or volumes looks like:

- Regular writes to the disk that are dependent on the workload and the nature of workload since every commit issued by the application is likely to trigger an I/O operation
- Higher workload in throughput for cases of operational tasks, like creating or rebuilding indexes
- Read bursts when performing transaction log or redo log backups

## Azure Premium SSD v2
Azure Premium SSD v2 storage is a new version of premium storage that got introduced with the goal to provide:

* Submillisecond I/O latency for smaller read and write I/O sizes
* SLAs for IOPS and throughput
* Pay capacity by the provisioned GB
* Provide a default set of IOPS and storage throughput per disk
* Give the possibility to add more IOPS and throughput to each disk and pay separately for these extra provisioned resources
* Pass SAP HANA certification without the help of other functionality like Azure Write Accelerator or other caches

This type of storage is targeting DBMS workloads, storage traffic that requires submillisecond latency, and SLAs on IOPS and throughput. The Premium SSD v2 disks are delivered with a default set of 3,000 IOPS and 125 MBps throughput. And the possibility to add more IOPS and throughput to individual disks. The pricing of the storage is structured in a way that adding more throughput or IOPS isn't influencing the price majorly. Nevertheless, we leave it up to you to decide how your storage configuration for Premium SSD v2 is going to look like. For a base start, read [SAP HANA Azure virtual machine Premium SSD v2 storage configurations](./hana-vm-premium-ssd-v2.md).

For the actual regions, this new block storage type is available and the actual restrictions read the document [Premium SSD v2](/azure/virtual-machines/disks-types#premium-ssd-v2).

The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Not supported | No system |
| Data disk | Suitable | All systems |
| SAP global transport directory | Yes | All systems |
| SAP sapmnt | Suitable | All systems |
| Backup storage | Suitable | For short term storage of backups |
| Shares/shared disk | Not available | Needs Azure Premium Files or Azure NetApp Files |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | submillisecond | - |
| IOPS SLA | Yes | - |
| IOPS linear to capacity | semi linear  | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| Maximum IOPS per disk | 80,000 [dependent on disk size](https://azure.microsoft.com/pricing/details/managed-disks/) | Also consider [VM limits](/azure/virtual-machines/sizes) |
| Throughput SLA | Yes | - |
| Throughput linear to capacity | Semi linear | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| HANA certified | Yes | - |
| Azure Write Accelerator support | No | - |
| Disk bursting | No | - |
| Disk snapshots possible | Yes<sup>1</sup> | - |
| Azure Backup VM snapshots possible | Yes | -  |
| Costs | Medium | - |

<sup>1</sup> (Incremental) Snapshots of a Premium SSD v2 or an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot

In opposite to Azure premium storage, Azure Premium SSD v2 fulfills SAP HANA storage latency KPIs. As a result, you **DON'T need to use Azure Write Accelerator caching** as described in the article [Enable Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator). 

**Summary:** Azure Premium SSD v2 is the block storage that fits the best price/performance ratio for SAP workloads. Azure Premium SSD v2 is suited to handle database workloads. The submillisecond latency is ideal storage for demanding DBMS workloads. Though it's a newer storage type that got  released in November 2022. Therefore, there still might be some limitations that are going to go away over the next few months.


## Azure Ultra disk
Azure ultra disks deliver high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. Some benefits of ultra disks include the ability to dynamically change the IOPS and throughput of the disk, along with your workloads, without the need to restart your virtual machines (VM). Ultra disks are suited for data-intensive workloads such as SAP DBMS workload. Ultra disks can only be used as data disks and can't be used as base VHD disk that stores the operating system. We would recommend the usage of Azure premium storage as based VHD disk.

As you create an ultra disk, you have three dimensions you can define:

- The capacity of the disk. Ranges are from 4 GiB to 65,536 GiB
- Provisioned IOPS for the disk. Different maximum values apply to the capacity of the disk. Read the article [Ultra disk](/azure/virtual-machines/disks-types#ultra-disks) for more details
- Provisioned storage bandwidth. Different maximum bandwidth applies dependent on the capacity of the disk. Read the article [Ultra disk](/azure/virtual-machines/disks-types#ultra-disks) for more details

The cost of a single disk is determined by the three dimensions you can define for the particular disks separately. 


The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Doesn't work | - |
| Data disk | Suitable | All systems  |
| SAP global transport directory | Yes | [Supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | Suitable | All systems |
| Backup storage | Suitable | For short term storage of backups |
| Shares/shared disk | Not available | Needs third party |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | Very low | - |
| IOPS SLA | Yes | - |
| IOPS linear to capacity | Semi linear in brackets  | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| Maximum IOPS per disk | 1,200 to 160,000 | dependent of disk capacity |
| Throughput SLA | Yes | - |
| Throughput linear to capacity | Semi linear in brackets | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| HANA certified | Yes | - |
| Azure Write Accelerator support | No | - |
| Disk bursting | Yes | - |
| Disk snapshots possible | Yes<sup>1</sup> | - |
| Azure Backup VM snapshots possible | Yes | - |
| Costs | Higher than Premium storage | - |

<sup>1</sup> (Incremental) Snapshots of a Premium SSD v2 or an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot

**Summary:** Azure ultra disks are a suitable storage with low submillisecond latency for all kinds of SAP workload. So far, Ultra disk can only be used in combinations with VMs that have been deployed through Availability Zones (zonal deployment). In opposite to all other storage, Ultra disk can't be used for the base VHD disk. Ultra disk is ideal for cases where I/O workload fluctuates a lot and you want to adapt deployed storage throughput or IOPS to storage workload patterns instead of sizing for maximum usage of bandwidth and IOPS.

## Azure NetApp Files

[Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) is an Azure native, first-party, enterprise-class, high-performance file storage service certified for use with SAP HANA. It provides _Volumes as a service_ for which you create NetApp accounts, capacity pools, and volumes. With Azure NetApp Files, you select service and performance levels and manage data protection to create and manage high-performance, highly available, and scalable file shares by using the same protocols and tools that you're familiar with and rely on on-premises.

The following types of SAP workload are supported on Azure NetApp Files volumes:

- SAP DBMS workload
- SAPMNT share
- Global transport directory

Azure NetApp Files is available in three service levels, each with their own throughput and pricing specifications. Which one is right for your deployment depends on the size of the deployment. Customized sizing recommendations are available in the [SAP on Azure NetApp Files TCO Estimator](https://aka.ms/anfsapcalc).

For information about service levels, see [Service levels for Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-service-levels.md). 

### Deploying volumes 

For optimal results, use [Application volume group for SAP HANA](../../azure-netapp-files/application-volume-group-introduction.md) to deploy the volumes. Application volume group places volumes in optimal locations in the Azure infrastructure using affinity and anti-affinity rules to reduce contention and to allow for the best throughput and lowest latency.

> [!NOTE]
> Capacity pools are a basic provisioning unit for Azure NetApp Files. Capacity pools are offered beginning at 1 TiB in size; you can expand a capacity pool in 1-TiB increments. Capacity pools are the parent unit for volumes. For sizing information, see  [Azure NetApp Files resource limits](../../azure-netapp-files/azure-netapp-files-resource-limits.md). For pricing, see [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/).

Azure NetApp Files is supported for several SAP workload scenarios:

- SAP HANA deployments using NFS shares for /hana/data and /hana/log volumes for /hana/shared volumes as documented in the [SAP HANA Azure virtual machine storage configurations](hana-vm-operations-storage.md)
- Providing SMB or NFS shares for SAP's global transport directory
- The share sapmnt in high availability scenarios as documented in:
	- [High availability for SAP NetWeaver on Azure VMs on Windows with Azure NetApp Files(SMB) for SAP applications](./high-availability-guide-windows-netapp-files-smb.md)
	- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](./high-availability-guide-suse-netapp-files.md)
	- [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](./high-availability-guide-rhel-netapp-files.md)
- IBM Db2 in Suse or Red Hat Linux-based Azure VM
- SAP on Oracle deployments in Oracle Linux guest OS using [dNFS](https://docs.oracle.com/en/database/oracle/oracle-database/19/ntdbi/creating-an-oracle-database-on-direct-nfs.html#GUID-2A0CCBAB-9335-45A8-B8E3-7E8C4B889DEA) for Oracle data and redo log volumes. Some more details can be found in the article [Azure Virtual Machines Oracle DBMS deployment for SAP workload](./dbms-guide-oracle.md)
- SAP on ASE in Suse or Red Hat Linux guest OS
- AP on MAXDB in Suse or Red Hat Linux guest OS 
- SAP on Microsoft SQL Server with SMB volumes

> [!NOTE]
> For DBMS workloads on Linux, use NFS-based volumes on Azure NetApp Files.

### Decoupling throughput from volume size

Storage for database applications typically has throughput requirements that don't scale linearly with the size of the volumes, ie log volumes are relatively small in size but require high levels of throughput.

Azure NetApp Files allows you to allocate volume throughput independently from volume sizes when using a capacity pool of type [manual QoS](../../azure-netapp-files/azure-netapp-files-service-levels.md#throughput-limit-examples-of-volumes-in-a-manual-qos-capacity-pool).

Here's an example:

- A volume for database files requires 500 MiB/s throughput and 39 TiB capacity
- A volume for log files requires 2000 MiB/s throughput and 1 TiB capacity

You can create a manual QoS capacity pool for this scenario and allocate throughput independently of the volume sizes. The total capacity required is 40 TiB, and the total throughput budget is 2500 MiB/s. A capacity pool in the Premium service level (64 MiB/s per allocated TiB) accommodates both performance and capacity requirements (40 MiB * 64 iB/s/TiB = 2560 MiB).

Linear performance scaling would require considerable overprovisioning of the log volume to achieve the throughput requirement. To achieve the 2000 MiB/s throughput for the log volume, you'd need to deploy a capacity pool in the Ultra tier (128 MiB/s per allocated TiB) of 16 TiB, resulting in an overprovisioning and therefore a wasted capacity of 15 TiB.

Use the [Azure NetApp Files Performance Calculator](https://aka.ms/anfcalc) to get an estimate for your scenario.

The capability matrix for SAP workload on Azure NetApp Files looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Use managed disk | - |
| Data disk | Suitable | SAP HANA, Oracle on Oracle Linux, Db2 and SAP ASE on SLES/RHEL, MAXDB, SQL Server  |
| SAP global transport directory | Yes | SMB (Windows only) and  NFS (Linux only) |
| SAP sapmnt | Suitable |SMB (Windows only) or NFS (Linux only) |
| Backup storage | Suitable | Use snapshots and/or Azure NetApp Files backup; log backup for HANA can also be used as file based backup destination |
| Shares/shared disk | Yes | SMB, NFS |
| Resiliency | LRS and GRS | [GRS with cross-region replication](../../azure-netapp-files/cross-region-replication-introduction.md); [ZRS with cross-zone replication](../../azure-netapp-files/cross-zone-replication-introduction.md) |
| Latency | Very low | Typically less than 1 ms |
| IOPS SLA | Yes | - |
| IOPS linear to capacity | Linear with auto QoS; independently configurable with Manual QoS | Three [service levels](../../azure-netapp-files/azure-netapp-files-service-levels.md) available |
| Throughput SLA | Yes | Sizing recommendations are available in the SAP on the [Azure NetApp Files TCO Estimator](https://aka.ms/anfsapcalc) |
| Throughput linear to capacity | Linear with auto QoS; independently configurable with Manual QoS | Three [service levels](../../azure-netapp-files/azure-netapp-files-service-levels.md) available |
| HANA certified | [Yes](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24&sort=Latest%20Certification&sortDesc=true) | - |
| Disk snapshots possible | Yes | See [How Azure NetApp Files snapshots work](../../azure-netapp-files/snapshots-introduction.md) |
| Application consistent snapshot and backup orchestration | No | Use [AzAcSnap](../../azure-netapp-files/azacsnap-introduction.md) or [SnapCenter](https://docs.netapp.com/us-en/snapcenter/concept/concept_snapcenter_overview.html) |
| Costs | Use TCO estimation tools | Use the [SAP on Azure NetApp Files TCO Estimator](https://aka.ms/anfsapcalc) and enter the size of the landscape |

Other built-in functionality of Azure NetApp Files storage:

- Capability to perform application consistent [snapshots](../..//azure-netapp-files/snapshots-introduction.md) of volume using [AzAcSnap](../../azure-netapp-files/azacsnap-introduction.md)
- Cloning of Azure NetApp Files [volumes from snapshots](../../azure-netapp-files/snapshots-restore-new-volume.md) for testing and development
- Restoring [volumes from from snapshots (snap-revert)](../../azure-netapp-files/snapshots-revert-volume.md) for rapid restores from corruptions and errors

> [!IMPORTANT]
> Specifically for database deployments you want to achieve low latencies for at least your redo logs. Especially for SAP HANA, SAP requires a latency of less than 1 millisecond for HANA redo log writes of smaller sizes. To get to such latencies, see the possibilities below.

> [!IMPORTANT]
> When deploying Azure NetApp Files volumes take note of the zone in which the virtual machines are or will be deployed. Ensure you select the same zone. This functionality is documented in the article [Manage availability zone volume placement for Azure NetApp Files](../../azure-netapp-files/manage-availability-zone-volume-placement.md). Application volume group for SAP HANA uses the same functionality to deploy the volumes in the closest possible proximity to the application VMs. 

The motivation to have this type of Availability Zone alignment is the reduction of risk surface by having the NFS shares in the same availability zone as the application VMs.

* Deploy Azure NetApp Files volumes for your SAP HANA deployment using [application volume group for SAP HANA](../../azure-netapp-files/application-volume-group-introduction.md). The advantage of Application Volume Group is that data volumes are deployed over multiple storage endpoints, reducing network contention and improving performance. 

**Summary**: Azure NetApp Files is a certified low latency storage solution for SAP HANA. The service provides volumes carved out of one or more capacity pools. Capacity pools are available in three service levels which define the total capacity and throughput allocated. The volumes can be resized, and allocated throughput can be adjusted without service interruption to cater for changing requirements and to control cost.  The service provides functionality to replicate volumes to other regions or zones for disaster recovery and business continuance purposes.

## Azure Premium Files
[Azure Premium Files](../../storage/files/storage-files-planning.md) is a shared storage that offers SMB and NFS for a moderate price and sufficient latency to handle shares of the SAP application layer. On top, Azure premium Files offers synchronous zonal replication of the shares with an automatism that in case one replica fails, another replica in another zone can take over. In opposite to Azure NetApp Files, there are no performance tiers. There also is no need for a capacity pool. Charging is based on the real provisioned capacity of the different shares. Azure Premium Files haven't been tested as DBMS storage for SAP workload at all. But instead the usage scenario for SAP workload focused on all types of SMB and NFS shares as they're used on the SAP application layer. Azure Premium Files is also suited for the usage for **/hana/shared**. 

> [!NOTE]
> So far no SAP DBMS workloads are supported on shared volumes based on Azure Premium Files.

SAP scenarios supported on Azure Premium Files list like: 

- Providing SMB or NFS shares for SAP's global transport directory
- Usage as share for interfaces to SAP systems and EDI processes
- The share sapmnt in high availability scenarios as documented in:
	- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with NFS on Azure Files](./high-availability-guide-suse-nfs-azure-files.md)
	- [High availability for SAP NetWeaver on Azure VMs on Red Hat Enterprise Linux with NFS on Azure Files](./high-availability-guide-rhel-nfs-azure-files.md)
	- [High availability for SAP NetWeaver on Azure VMs on Windows with Azure Files Premium SMB for SAP applications](./high-availability-guide-windows-netapp-files-smb.md)
	- [High availability for SAP HANA scale-out system with HSR on SUSE Linux Enterprise Server](./sap-hana-high-availability-scale-out-hsr-suse.md)

Azure Premium Files is starting with larger amount of IOPS at the minimum share size of 100 GB compared to Azure NetApp Files. This higher bar of IOPS can avoid capacity overprovisioning to achieve certain IOPS and throughput values. For IOPS and storage throughput, read the section [Azure file share scale targets in Azure Files scalability and performance targets](../../storage/files/storage-files-scale-targets.md). 

> [!NOTE]
> Due to the tiered architecture of Azure Premium Files, the latency accessing metadata of the files stored in shares is significantly higher than with Azure NetApp Files. This higher latency can impact for instance mass creation and deletion of files. But it can also have noticeable impact on the time it takes to list the content of large directories, containing hundreds of thousands of files. The main use case we see this higher metadata latency affecting is the usage as interface share where customers can encounter hundreds of thousands or even millions of file creations and mass deletions every day. Therefore, you should test the interface share scenarios diligently. To determine if your workload is metadata heavy, check [Metadata or namespace heavy workload](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json#cause-2-metadata-or-namespace-heavy-workload)

The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Doesn't work | - |
| Data disk | Not supported for SAP workloads | - |
| SAP global transport directory | Yes | SMB and NFS |
| SAP sapmnt | Suitable | All systems SMB (Windows only) or NFS (Linux only) |
| Backup storage | Suitable | - |
| Shares/shared disk | Yes | SMB 3.0, NFS v4.1 |
| Resiliency | LRS and ZRS | No GRS available for Azure Premium Files |
| Latency | low | - |
| IOPS SLA | Yes | - |
| IOPS linear to capacity | strictly linear  | - |
| Throughput SLA | Yes | - |
| Throughput linear to capacity | strictly linear | - |
| HANA certified | No| - |
| Disk snapshots possible | Yes | - |
| Azure Backup VM snapshots possible | No | - |
| Costs | low | - |


**Summary**: Azure Premium Files is a low latency storage that allows to deploy NFS and SMB volumes or shares. Azure Premium Files provides excellent price/performance ratio for SAP application layer shares. It also provides synchronous zonal replication for these shares. So far, we don't support this storage type for SAP DBMS workload. Though it can be used for **/hana/shared** volumes. 



## Azure standard SSD storage
Compared to Azure standard HDD storage, Azure standard SSD storage delivers better availability, consistency, reliability, and latency. It's optimized for workloads that need consistent performance at lower IOPS levels. This storage is the minimum storage used for nonproduction SAP systems that have low IOPS and throughput demands. The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Restricted suitable | Nonproduction systems |
| Data disk | Restricted suitable | Some nonproduction systems with low IOPS and latency demands |
| SAP global transport directory | No | [Not supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | Restricted suitable | Nonproduction systems |
| Backup storage | Suitable | - |
| Shares/shared disk | Not available | Needs third party |
| Resiliency | LRS, GRS | No ZRS available for disks |
| Latency | high | Too high for SAP Global Transport directory, or production systems |
| IOPS SLA | No | - |
| Maximum IOPS per disk | 500 | Independent of the size of disk |
| Throughput SLA | No | - |
| HANA certified | No | - |
| Disk snapshots possible | Yes | - |
| Azure Backup VM snapshots possible | Yes | - |
| Costs | LOW | - |



**Summary:** Azure standard SSD storage is the minimum recommendation for nonproduction VMs for base VHD, eventual DBMS deployments with relative latency insensitivity and/or low IOPS and throughput rates. This Azure storage type isn't supported anymore for hosting the SAP Global Transport Directory. 



## Azure standard HDD storage
The Azure Standard HDD storage was the only storage type when Azure infrastructure got certified for SAP NetWeaver workload in the year 2014. In the year 2014, the Azure virtual machines were small and low in storage throughput. Therefore, this storage type was able to just keep up with the demands. The storage is ideal for latency insensitive workloads, that you hardly experience in the SAP space. With the increasing throughput of Azure VMs and the increased workload these VMs are producing, this storage type isn't considered for the usage with SAP scenarios anymore. The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | Not suitable | - |
| Data disk | Not suitable | - |
| SAP global transport directory | No | [Not supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | NO | Not supported |
| Backup storage | Suitable | - |
| Shares/shared disk | Not available | Needs Azure Files or third party |
| Resiliency | LRS, GRS | No ZRS available for disks |
| Latency | high | Too high for DBMS usage, SAP Global Transport directory, or sapmnt/saploc |
| IOPS SLA | No | - |
| Maximum IOPS per disk | 500 | Independent of the size of disk |
| Throughput SLA | No | - |
| HANA certified | No | - |
| Disk snapshots possible | Yes | - |
| Azure Backup VM snapshots possible | Yes | - |
| Costs | Low | - |



**Summary:** Standard HDD is an Azure storage type that should only be used to store SAP backups. It should only be used as base VHD for rather inactive systems, like retired systems used for looking up data here and there. But no active development, QA or production VMs should be based on that storage. Nor should database files being hosted on that storage


## Azure VM limits in storage traffic
In opposite to on-premises scenarios, the individual VM type you're selecting, plays a vital role in the storage bandwidth you can achieve. For the different storage types, you need to consider:

| Storage type| Linux | Windows | Comments |
| --- | --- | --- | --- |
| Standard HDD | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Likely hard to touch the storage limits of medium or large VMs |
| Standard SSD | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Likely hard to touch the storage limits of medium or large VMs |
| Premium Storage | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Easy to hit IOPS or storage throughput VM limits with storage configuration |
| Premium SSD v2 | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Easy to hit IOPS or storage throughput VM limits with storage configuration |
| Ultra disk storage | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Easy to hit IOPS or storage throughput VM limits with storage configuration |
| Azure NetApp Files | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Storage traffic is using network throughput bandwidth and not storage bandwidth! |
| Azure Premium Files | [Sizes for Linux VMs in Azure](/azure/virtual-machines/sizes) | [Sizes for Windows VMs in Azure](/azure/virtual-machines/sizes) | Storage traffic is using network throughput bandwidth and not storage bandwidth! |

As limitations, you need to note that:

- The smaller the VM, the fewer disks you can attach. This restriction doesn't apply to Azure NetApp Files. Since you mount NFS or SMB shares, you don't encounter a limit of number of shared volumes to be attached
- VMs have I/O throughput and IOPS limits that easily could be exceeded with premium storage disks and Ultra disks
- With Azure NetApp Files and Azure Premium Files, the traffic to the shared volumes is consuming the VM's network bandwidth and not storage bandwidth
- With large NFS volumes in the double digit TiB capacity space, the throughput accessing such a volume out of a single VM is going to plateau based on limits of Linux for a single session interacting with the shared volume. 

As you up-size Azure VMs in the lifecycle of an SAP system, you should evaluate the IOPS and storage throughput limits of the new and larger VM type. In some cases, it also could make sense to adjust the storage configuration to the new capabilities of the Azure VM. 


## Striping or not striping
Creating a stripe set out of multiple Azure disks into one larger volume allows you to accumulate the IOPS and throughput of the individual disks into one volume. It's used for Azure standard storage and Azure premium storage only. Azure Ultra disk where you can configure the throughput and IOPS independent of the capacity of a disk, doesn't require the usage of stripe sets. Shared volumes based on NFS or SMB can't be striped. Due to the non-linear nature of Azure premium storage throughput and IOPS, you can provision smaller capacity with the same IOPS and throughput than large single Azure premium storage disks. That is the method to achieve higher throughput or IOPS at lower cost using Azure premium storage. For example, striping across two P15 premium storage disks gets you to a throughput of: 

- 250 MiB/sec. Such a volume is going to have 512 GiB capacity. If you want to have a single disk that gives you 250 MiB throughput per second, you would need to pick a P40 disk with 2 TiB capacity. 
- 400 MiB/sec by striping four P10 premium storage disks with an overall capacity of 512 GiB by striping. If you would like to have a single disk with a minimum of 500 MiB throughput per second, you would need to pick a P60 premium storage disk with 8 TiB. Because the cost of premium storage is near linear with the capacity, you can sense the cost savings by using striping.

Some rules need to be followed on striping:

- No in-VM configured storage redundancy should be used since Azure storage keeps the data disk redundant already at the Azure storage backend
- The disks the stripe set is applied to, need to be of the same size
- With Premium SSD v2 and Ultra disk, the capacity, provisioned IOPS and provisioned throughput needs to be the same

Striping across multiple smaller disks is the best way to achieve a good price/performance ratio using Azure premium storage. It's understood that striping can have some extra deployment and management overhead.

For specific stripe size recommendations, read the documentation for the different DBMS, like [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md).




## Next steps
Read the articles:

- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](./dbms-guide-general.md)
- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
