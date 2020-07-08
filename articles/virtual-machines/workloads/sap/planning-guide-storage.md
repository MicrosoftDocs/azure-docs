---
title: 'Azure storage types for SAP workload'
description: Planning Azure storage types for SAP workloads
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: d7c59cc1-b2d0-4d90-9126-628f9c7a5538
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/23/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# Azure Storage types for SAP workload
Azure has numerous storage types that differ vastly in capabilities, throughput, latency, and prices. Some of the storage types are not, or of limited usable for SAP scenarios. Whereas, several Azure storage types are well suited or optimized for specific SAP workload scenarios. Especially for SAP HANA, some Azure storage types got certified for the usage with SAP HANA. In this document, we are going through the different types of storage and describe their capability and usability with SAP workloads and SAP components.

Remark about the units used throughout this article. The public cloud vendors moved to use GiB ([Gibibyte](https://en.wikipedia.org/wiki/Gibibyte)) or TiB ([Tebibyte](https://en.wikipedia.org/wiki/Tebibyte) as size units, instead of Gigabyte or Terabyte. Therefore all Azure documentation and prizing are using those units.  Throughout the document, we are referencing these size units of MiB, GiB, and TiB units exclusively. You might need to plan with MB, GB, and TB. So, be aware of some small differences in the calculations if you need to size for a 400 MiB/sec throughput, instead of a 250 MiB/sec throughput.

## Microsoft Azure Storage resiliency

Microsoft Azure storage of Standard HDD, Standard SSD, Azure premium storage, and Ultra disk keeps the base VHD (with OS) and VM attached data disks or VHDs in three copies on three different storage nodes. Failing over to another replica and seeding of a new replica in case of a storage node failure is transparent. As a result of this redundancy, it is **NOT** required to use any kind of storage redundancy layer across multiple Azure disks. This fact is called Local Redundant Storage (LRS). LRS is default for these types of storage in Azure. [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) provides sufficient redundancy to achieve the same SLAs as other native Azure storage.

There are several more redundancy methods, which are all described in the article [Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) that apply to some of the different storage types Azure has to offer. 

### Azure managed disks

Managed disks are a resource type in Azure Resource Manager that can be used instead of VHDs that are stored in Azure Storage Accounts. Managed Disks automatically align with the [availability set][virtual-machines-manage-availability] of the virtual machine they are attached to and therefore increase the availability of your virtual machine and the services that are running on the virtual machine. For more information, read the [overview article](https://docs.microsoft.com/azure/storage/storage-managed-disks-overview).

Related to resiliency, this example demonstrates the advantage of managed disks:

- You are deploying your two DBMS VMs for your SAP system in an Azure availability set 
- As Azure deploys the VMs, the disk with the OS image will be placed in a different storage cluster. This avoids that both VMs get impacted by an issue of a single Azure storage cluster
- As you create new managed disks that you assign to these VMs to store the data and log files of your database, these new disks for the two VMs are also deployed in separate storage clusters, so, that none of disks of the first VM are sharing storage clusters with the disks of the second VM

Deploying without managed disks in customer defined storage accounts, disk allocation is arbitrary and has no awareness of the fact that VMs are deployed within an AvSet for resiliency purposes.

> [!NOTE]
> Out of this reason and several other improvements that are exclusively available through managed disks, we require that new deployments of VMs that use Azure block storage for their disks (all Azure storage except Azure NetApp Files) need to use Azure managed disks for the base VHD/OS disks, data disks that contain SAP database files. Independent on whether you deploy the VMs through availability set, across Availability Zones or independent of the sets and zones. Disks that are used for the purpose of storing backups are not necessarily required to be managed disks.

> [!NOTE]
> Azure managed disks provide local redundancy (LRS) only. 


## Storage scenarios with SAP workloads
Persisted storage is needed in SAP workload in various components of the stack that you deploy in Azure. These scenarios list at minimum like:

- Persistent the base VHD of your VM that holds the operating system and other software you install in that disk. This disk/VHD is the root of your VM. Any changes made to it, need to be persisted. So, that the next time, you stop and restart the VM, all the changes made before still exist. Especially in cases where the VM is getting deployed by Azure onto another host than it was running originally
- Persisted data disks. These disks are VHDs you attach to store application data in. This application data could be data and log/redo files of a database, backup files, or software installations. Means any disk beyond your base VHD that holds the operating system
- File shares or shared disks that contain your global transport directory for NetWeaver or S/4HANA. Content of those shares is either consumed by software running in multiple VMs or is used to build high-availability failover cluster scenarios
- The /sapmnt directory or common file shares for EDI processes or similar. Content of those shares is either consumed by software running in multiple VMs or is used to build high-availability failover cluster scenarios

In the next few sections, the different Azure storage types and their usability for SAP workload gets discussed that apply to the three scenarios above. A general categorization of how the different Azure storage types should be used is documented in the article [What disk types are available in Azure?](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types). The recommendations for using the different Azure storage types for SAP workload are not going to be majorly different.

For support restrictions on Azure storage types for SAP NetWeaver/application layer of S/4HANA, read the [SAP support note 2015553](https://launchpad.support.sap.com/#/notes/2015553)
For SAP HANA certified and supported Azure storage types read the article [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage).

The sections describing the different Azure storage types will give you more background about the restrictions and possibilities using the SAP supported storage. 

## Storage recommendations for SAP storage scenarios
Before going into the details, we are presenting the summary and recommendations already at the beginning of the document. Whereas the details for the particular types of Azure storage are following this section of the document. Summarizing the storage recommendations for the SAP storage scenarios in a table, it looks like:

| Usage scenario | Standard HDD | Standard SSD | Premium Storage | Ultra disk | Azure NetApp Files |
| --- | --- | --- | --- | --- | --- |
| OS disk | not suitable |  restricted suitable (non-prod) | recommended | not possible | not possible |
| Global transport Directory | not supported | not supported | recommended | recommended | recommended |
| /sapmnt | not suitable | restricted suitable (non-prod) | recommended | recommended | recommended |
| DBMS Data volume SAP HANA M/Mv2 VM families | not supported | not supported | recommended | recommended | recommended<sup>2</sup> |
| DBMS log volume SAP HANA M/Mv2 VM families | not supported | not supported | recommended<sup>1</sup> | recommended | recommended<sup>2</sup> | 
| DBMS Data volume SAP HANA Esv3/Edsv4 VM families | not supported | not supported | recommended | recommended | recommended<sup>2</sup> |
| DBMS log volume SAP HANA Esv3/Edsv4 VM families | not supported | not supported | not supported | recommended | recommended<sup>2</sup> | 
| DBMS Data volume non-HANA | not supported | restricted suitable (non-prod) | recommended | recommended | not supported |
| DBMS log volume non-HANA M/Mv2 VM families | not supported | restricted suitable (non-prod) | recommended<sup>1</sup> | recommended | not supported |
| DBMS log volume non-HANA non-M/Mv2 VM families | not supported | restricted suitable (non-prod) | suitable for up to medium workload | recommended | not supported |


<sup>1</sup> With usage of [Azure Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) for M/Mv2 VM families for log/redo log volumes
<sup>2</sup> Using ANF requires /hana/data as well as /hana/log to be on ANF 

Characteristics you can expect from the different storage types list like:

| Usage scenario | Standard HDD | Standard SSD | Premium Storage | Ultra disk | Azure NetApp Files |
| --- | --- | --- | --- | --- | --- |
| Throughput/ IOPS SLA | no | no | yes | yes | yes |
| Latency Reads | high | medium to high | low | sub-millisecond | sub-millisecond |
| Latency Writes | high | medium to high  | low (sub-millisecond<sup>1</sup>) | sub-millisecond | sub-millisecond |
| HANA supported | no | no | yes<sup>1</sup> | yes | yes |
| Disk snapshots possible | yes | yes | yes | no | yes |
| Allocation of disks on different storage clusters when using availability sets | through managed disks | through managed disks | through managed disks | disk type not supported with VMs deployed through availability sets | no<sup>3</sup> |
| Aligned with Availability Zones | yes | yes | yes | yes | needs engagement of Microsoft |
| Zonal redundancy | not for managed disks | not for managed disks | not for managed disks | no | no |
| Geo redundancy | not for managed disks | not for managed disks | no | no | no |


<sup>1</sup> With usage of [Azure Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) for M/Mv2 VM families for log/redo log volumes

<sup>2</sup> Costs depend on provisioned IOPS and throughput

<sup>3</sup> Creation of different ANF capacity pools does not guarantee deployment of capacity pools onto different storage units


> [!IMPORTANT]
> To achieve less than 1 millisecond I/O latency using Azure NetApp Files (ANF), you need to work with Microsoft to arrange the correct placement between your VMs and the NFS shares based on ANF. So far there is no mechanism in place that provides an automatic proximity between a VM deployed and the NFS volumes hosted on ANF. Given the different setup of the different Azure regions, the network latency added could push the I/O latency beyond 1 millisecond if the VM and the NFS share are not allocated in proximity.


> [!IMPORTANT]
> None of the currently offered Azure block storage based managed disks, or Azure NetApp Files offer any zonal or geographical redundancy. As a result, you need to make sure that your high availability and disaster recovery architectures are not relying on any type of Azure native storage replication for these managed disks, NFS or SMB shares.


## Azure premium storage
Azure premium SSD storage got introduced with the goal to provide:

* Low I/O latency
* SLAs for IOPS and throughput
* Less variability in I/O latency

This type of storage is targeting DBMS workloads, storage traffic that requires low single digit millisecond latency, and SLAs on IOPS and throughput
Cost basis in the case of Azure premium storage is not the actual data volume stored in such disks, but the size category of such a disk, independent of the amount of the data that is stored within the disk. You also can create disks on premium storage that are not directly mapping into the size categories shown in the article [Premium SSD](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types#premium-ssd). Conclusions out of this article are:

- The storage is organized in ranges. For example, a disk in the range 513 GiB to 1024 GiB capacity share the same capabilities and the same monthly costs
- The IOPS per GiB are not tracking linear across the size categories. Smaller disks below 32 GiB have higher IOPS rates per GiB. For disks beyond 32 GiB to 1024 GiB, the IOPS rate per GiB is between 4-5 IOPS per GiB. For larger disks up to 32,767 GiB, the IOPS rate per GiB is going below 1
- The I/O throughput for this storage is not linear with the size of the disk category. For smaller disks, like the category between 65 GiB and 128 GiB capacity, the throughput is around 780KB/GiB. Whereas for the extreme large disks like a 32,767 GiB disk, the throughput is around 28KB/GiB
- The IOPS and throughput SLAs cannot be changed without changing the capacity of the disk

Azure has a single instance VM SLA of 99.9% that is tied to the usage of Azure premium storage or Azure Ultra disk storage. The SLA is documented in [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/). In order to comply with this single VM SLA, the base VHD disk as well as **all** attached disk need to be either Azure premium storage or Azure Ultra disk storage.

The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | suitable | all systems |
| Data disk | suitable | all systems - [specially for SAP HANA](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) |
| SAP global transport directory | YES | [Supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | suitable | all systems |
| Backup storage | suitable | for short term storage of backups |
| Shares/shared disk | not available | Needs Azure Premium Files or third party |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | low-to medium | - |
| IOPS SLA | YES | - |
| IOPS linear to capacity | semi linear in brackets  | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| Maximum IOPS per disk | 20,000 [dependent on disk size](https://azure.microsoft.com/pricing/details/managed-disks/) | Also consider [VM limits](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) |
| Throughput SLA | YES | - |
| Throughput linear to capacity | semi linear in brackets | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| HANA certified | YES | [specially for SAP HANA](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) |
| Disk snapshots possible | YES | - |
| Azure Backup VM snapshots possible | YES | except for [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) cached disks  |
| Costs | MEDIUM | - |

Azure premium storage does not fulfill SAP HANA storage latency KPIs with the common caching types offered with Azure premium storage. In order to fulfill the storage latency KPIs for SAP HANA log writes, you need to use Azure Write Accelerator caching as described in the article [Enable Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator). Azure Write Accelerator benefits all other DBMS systems for their transaction log writes and redo log writes. Therefore, it is recommended to use it across all the SAP DBMS deployments. For SAP HANA, the usage of Azure Write Accelerator in conjunction with Azure premium storage is mandatory.



**Summary:** Azure premium storage is one of the Azure storage types recommended for SAP workload. This recommendation applies for non-production as well as production systems. Azure premium storage is suited to handle database workloads. The usage of Azure Write Accelerator is going to improve write latency against Azure premium disks substantially. However, for DBMS systems with high IOPS and throughput rates, you need to either over-provision storage capacity or you need to use functionality like Windows Storage Spaces or logical volume managers in Linux to build stripe sets that give you the desired capacity on the one side, but also the necessary IOPS or throughput at best cost efficiency.


### Azure burst functionality for premium storage
For Azure premium storage disks smaller or equal to 512 GiB in capacity, burst functionality is offered. The exact way how disk bursting works is described in the article [Disk bursting](https://docs.microsoft.com/azure/virtual-machines/linux/disk-bursting). When you read the article, you understand the concept of accruing IOPS and throughput in the times when your I/O workload is below the nominal IOPS and throughput of the disks (for details on the nominal throughput see [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/)). You are going to accrue the delta of IOPS and throughput between your current usage and the nominal values of the disk. The bursts  are limited to a maximum of 30 minutes.

The ideal cases where this burst functionality can be planned in is likely going to be the volumes or disks that contain data files for the different DBMS. The I/O workload expected against those volumes, especially with small to mid-ranged systems is expected to look like:

- Low to moderate read workload since data ideally is cached in memory, or like in the case of HANA should be completely in memory
- Bursts of write triggered by database checkpoints or savepoints that are issued on a regular basis
- Backup workload that reads in a continuous stream in cases where backups are not executed via storage snapshots
- For SAP HANA, load of the data into memory after an instance restart

Especially on smaller DBMS systems where your workload is handling a few hundred transactions per seconds only, such a burst functionality can make sense as well for the disks or volumes that store the transaction or redo log. Expected workload against such a disk or volumes looks like:

- Regular writes to the disk that are dependent on the workload and the nature of workload since every commit issued by the application is likely to trigger an I/O operation
- Higher workload in throughput for cases of operational tasks, like creating or rebuilding indexes
- Read bursts when performing transaction log or redo log backups


## Azure Ultra disk
Azure ultra disks deliver high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. Some additional benefits of ultra disks include the ability to dynamically change the IOPS and throughput of the disk, along with your workloads, without the need to restart your virtual machines (VM). Ultra disks are suited for data-intensive workloads such as SAP DBMS workload. Ultra disks can only be used as data disks and can't be used as base VHD disk that stores the operating system. We would recommend the usage of Azure premium storage as based VHD disk.

As you create an ultra disk, you have three dimensions you can define:

- The capacity of the disk. Ranges are from 4 GiB to 65,536 GiB
- Provisioned IOPS for the disk. Different maximum values apply to the capacity of the disk. Read the article [Ultra disk](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types#ultra-disk) for more details
- Provisioned storage bandwidth. Different maximum bandwidth applies dependent on the capacity of the disk. Read the article [Ultra disk](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types#ultra-disk) for more details

The cost of a single disk is determined by the three dimensions you can define for the particular disks separately. 


The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | does not work | - |
| Data disk | suitable | all systems  |
| SAP global transport directory | YES | [Supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | suitable | all systems |
| Backup storage | suitable | for short term storage of backups |
| Shares/shared disk | not available | Needs third party |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | very low | - |
| IOPS SLA | YES | - |
| IOPS linear to capacity | semi linear in brackets  | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| Maximum IOPS per disk | 1,200 to 160,000 | dependent of disk capacity |
| Throughput SLA | YES | - |
| Throughput linear to capacity | semi linear in brackets | [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/) |
| HANA certified | YES | - |
| Disk snapshots possible | NO | - |
| Azure Backup VM snapshots possible | NO | - |
| Costs | Higher than Premium storage | - |



**Summary:** Azure ultra disks are a suitable storage with low latency for all kinds of SAP workload. So far, Ultra disk can only be used in combinations with VMs that have been deployed through Availability Zones (zonal deployment). Ultra disk is not supporting storage snapshots at this point in time. In opposite to all other storage, Ultra disk cannot be used for the base VHD disk. Ultra disk is ideal for cases where I/O workload fluctuates a lot and you want to adapt deployed storage throughput or IOPS to storage workload patterns instead of sizing for maximum usage of bandwidth and IOPS.


## Azure NetApp files (ANF)
[Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is the result out of a cooperation between Microsoft and NetApp with the goal to provide high performing Azure native NFS and SMB shares. The emphasis is to provide high bandwidth and low latency storage that enables DBMS deployment scenarios, and over time enable typical operational functionality of the NetApp storage through Azure as well. NFS/SMB shares are offered in three different service levels that differentiate in storage throughput and in price. The service levels are documented in the article [Service levels for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). For the different types of SAP workload the following service levels are highly recommended:

- SAP DBMS workload:  	Performance, ideally Ultra
- SAPMNT share:			Performance, ideally Ultra
- Global transport directory: Performance, ideally Ultra

> [!NOTE]
> The minimum provisioning size is a 4 TiB unit that is called capacity pool. You then create volumes out of this capacity pool. Whereas the smallest volume you can build is 100 GiB. You can expand a capacity pool in TiB steps. For pricing, check the article [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/)

ANF storage is currently supported for several SAP workload scenarios:

- Providing SMB or NFS shares for SAP's global transport directory
- The share sapmnt in high availability scenarios as documented in:
	- [High availability for SAP NetWeaver on Azure VMs on Windows with Azure NetApp Files(SMB) for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-windows-netapp-files-smb)
	- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files)
	- [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files)
- SAP HANA deployments using NFS v4.1 shares for /hana/data and /hana/log volumes and/or NFS v4.1 or NFS v3 volumes for /hana/shared volumes as documented in the article [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)

> [!NOTE]
> No other DBMS workload is supported for Azure NetApp Files based NFS or SMB shares. Updates and changes will be provided if this is going to change.

As already with Azure premium storage, a fixed or linear throughput size per GB can be a problem when you are required to adhere to some minimum numbers in throughput. Like this is the case for SAP HANA. With ANF, this problem can become more pronounced than with Azure premium disk. In case of Azure premium disk, you can take several smaller disks with a relatively high throughput per GiB and stripe across them to be cost efficient and have higher throughput at lower capacity. This kind of striping does not work for NFS or SMB shares hosted on ANF. This restriction resulted in deployment of overcapacity like:

- To achieve, for example, a throughput of 250 MiB/sec on an NFS volume hosted on ANF, you need to deploy 1.95 TiB capacity of the Ultra service level. 
- To achieve 400 MiB/sec, you would need to deploy 3.125 TiB capacity. But you may need the over-provisioning of capacity to achieve the throughput you require of the volume. This over-provisioning of capacity impacts the pricing of smaller HANA instances. 
- In the space of using NFS on top of ANF for the SAP /sapmnt directory, you are usually going far with the minimum capacity of 100 GiB to 150 GiB that is enforced by Azure NetApp Files. However customer experience showed that the related throughput of 12.8 MiB/sec (using Ultra service level) may not be enough and may have negative impact on the stability of the SAP system. In such cases, customers could avoid issues by increasing the volume of the /sapmnt volume, so, that more throughput is provided to that volume.

The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | does not work | - |
| Data disk | suitable | SAP HANA only  |
| SAP global transport directory | YES | SMB as well as NFS |
| SAP sapmnt | suitable | all systems SMB (Windows only) or NFS (Linux only) |
| Backup storage | suitable | - |
| Shares/shared disk | YES | SMB 3.0, NFS v3, and NFS v4.1 |
| Resiliency | LRS | No GRS or ZRS available for disks |
| Latency | very low | - |
| IOPS SLA | YES | - |
| IOPS linear to capacity | strictly linear  | Dependent on [Service Level](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) |
| Throughput SLA | YES | - |
| Throughput linear to capacity | semi linear in brackets | Dependent on [Service Level](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) |
| HANA certified | YES | - |
| Disk snapshots possible | YES | - |
| Azure Backup VM snapshots possible | NO | - |
| Costs | Higher than Premium storage | - |


Additional built-in functionality of ANF storage:

- Capability to perform snapshots of volume
- Cloning of ANF volumes from snapshots
- Restore volumes from snapshots (snap-revert)

**Summary**: Azure NetApp Files is a HANA certified low latency storage that allows to deploy NFS and SMB volumes or shares. The storage comes with three different service levels that provide different throughput  and IOPS in a linear manner per GiB capacity of the volume. The ANF storage is enabling to deploy SAP HANA scale-out scenarios with a standby node. The storage is suitable for providing file shares as needed for /sapmnt or SAP global transport directory. ANF storage come with functionality availability that is available as native NetApp functionality.  



## Azure standard SSD storage
Compared to Azure standard HDD storage, Azure standard SSD storage delivers better availability, consistency, reliability, and latency. It is optimized for workloads that need consistent performance at lower IOPS levels. This storage is the minimum storage used for non-production SAP systems that have low IOPS and throughput demands. The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | restricted suitable | non-production systems |
| Data disk | restricted suitable | some non-production systems with low IOPS and latency demands |
| SAP global transport directory | NO | [Not supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | restricted suitable | non-production systems |
| Backup storage | suitable | - |
| Shares/shared disk | not available | Needs third party |
| Resiliency | LRS, GRS | No ZRS available for disks |
| Latency | high | too high for SAP Global Transport directory, or production systems |
| IOPS SLA | NO | - |
| Maximum IOPS per disk | 500 | Independent of the size of disk |
| Throughput SLA | NO | - |
| HANA certified | NO | - |
| Disk snapshots possible | YES | - |
| Azure Backup VM snapshots possible | YES | - |
| Costs | LOW | - |



**Summary:** Azure standard SSD storage is the minimum recommendation for non-production VMs for base VHD, eventual DBMS deployments with relative latency insensitivity and/or low IOPS and throughput rates. This Azure storage type is not supported anymore for hosting the SAP Global Transport Directory. 



## Azure standard HDD storage
The Azure Standard HDD storage was the only storage type when Azure infrastructure got certified for SAP NetWeaver workload in the year 2014. In the year 2014, the Azure virtual machines were small and low in storage throughput. Therefore, this storage type was able to just keep up with the demands. The storage is ideal for latency insensitive workloads, that you hardly experience in the SAP space. With the increasing throughput of Azure VMs and the increased workload these VMs are producing, this storage type is not considered for the usage with SAP scenarios anymore. The capability matrix for SAP workload looks like:

| Capability| Comment| Notes/Links | 
| --- | --- | --- | 
| OS base VHD | not suitable | - |
| Data disk | not suitable | - |
| SAP global transport directory | NO | [Not supported](https://launchpad.support.sap.com/#/notes/2015553) |
| SAP sapmnt | NO | Not supported |
| Backup storage | suitable | - |
| Shares/shared disk | not available | Needs Azure Files or third party |
| Resiliency | LRS, GRS | No ZRS available for disks |
| Latency | high | too high for DBMS usage, SAP Global Transport directory, or sapmnt/saploc |
| IOPS SLA | NO | - |
| Maximum IOPS per disk | 500 | Independent of the size of disk |
| Throughput SLA | NO | - |
| HANA certified | NO | - |
| Disk snapshots possible | YES | - |
| Azure Backup VM snapshots possible | YES | - |
| Costs | LOW | - |



**Summary:** Standard HDD is an Azure storage type that should only be used to store SAP backups. It should only be used as base VHD for rather inactive systems, like retired systems used for looking up data here and there. But no active development, QA or production VMs should be based on that storage. Nor should database files being hosted on that storage


## Azure VM limits in storage traffic
In opposite to on-premise scenarios, the individual VM type you are selecting, plays a vital role in the storage bandwidth you can achieve. For the different storage types, you need to consider:

| Storage type| Linux | Windows | Comments |
| --- | --- | --- | --- |
| Standard HDD | [Sizes for Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) | [Sizes for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) | Likely hard to touch the storage limits of medium or large VMs |
| Standard SSD | [Sizes for Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) | [Sizes for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) | Likely hard to touch the storage limits of medium or large VMs |
| Premium Storage | [Sizes for Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) | [Sizes for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) | Easy to hit IOPS or storage throughput VM limits with storage configuration |
| Ultra disk storage | [Sizes for Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) | [Sizes for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) | Easy to hit IOPS or storage throughput VM limits with storage configuration |
| Azure NetApp Files | [Sizes for Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) | [Sizes for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) | Storage traffic is using network throughput bandwidth and not storage bandwidth! |

As limitations, you can note that:

- The smaller the VM, the fewer disks you can attach. This does not apply to ANF. Since you mount NFS or SMB shares, you don't encounter a limit of number of shared volumes to be attached
- VMs have I/O throughput and IOPS limits that easily could be exceeded with premium storage disks and Ultra disks
- With ANF, the traffic to the shared volumes is consuming the VM's network bandwidth and not storage bandwidth
- With large NFS volumes in the double digit TiB capacity space, the throughput accessing such a volume out of a single VM is going to plateau based on limits of Linux for a single session interacting with the shared volume. 

As you up-size Azure VMs in the lifecycle of an SAP system, you should evaluate the IOPS and storage throughput limits of the new and larger VM type. In some cases, it also could make sense to adjust the storage configuration to the new capabilities of the Azure VM. 


## Striping or not striping
Creating a stripe set out of multiple Azure disks into one larger volume allows you to accumulate the IOPS and throughput of the individual disks into one volume. It is used for Azure standard storage and Azure premium storage only. Azure Ultra disk where you can configure the throughput and IOPS independent of the capacity of a disk, does not require the usage of stripe sets. Shared volumes based on NFS or SMB can't be striped. Due to the non-linear nature of Azure premium storage throughput and IOPS, you can provision smaller capacity with the same IOPS and throughput than large single Azure premium storage disks. That is the method to achieve higher throughput or IOPS at lower cost using Azure premium storage. For example:

- Striping across two P15 premium storage disks gets you to a throughput of 
- 250 MiB/sec. Such a volume is going to have 512 GiB capacity. If you want to have a single disk that gives you 250 MiB throughput per second, you would need to pick a P40 disk with 2 TiB capacity. 
- Or you could achieve a throughput of 400 MiB/sec by striping four P10 premium storage disks with an overall capacity of 512 GiB by striping. If you would like to have a single disk with a minimum of 500 MiB throughput per second, you would need to pick a P60 premium storage disk with 8 TiB. Since costing or premium storage is near linear with the capacity, you can sense the cost savings by using striping.

Some rules need to be followed on striping:

- No in-VM configured storage should be used since Azure storage keeps the data redundant already
- The disks the stripe set is applied to, need to be of the same size

Striping across multiple smaller disks is the best way to achieve a good price/performance ratio using Azure premium storage. It is understood that striping has some additional deployment and management overhead.

For specific stripe size recommendations, read the documentation for the different DBMS, like [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage).




## Next steps
Read the articles:

- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general)
- [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)
 