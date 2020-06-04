---
title: SAP HANA Azure virtual machine storage configurations | Microsoft Docs
description: Storage recommendations for VM that have SAP HANA deployed in them.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/19/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA Azure virtual machine storage configurations

Azure provides different types of storage that are suitable for Azure VMs that are running SAP HANA. The **SAP HANA certified Azure storage types** that can be considered for SAP HANA deployments list like: 

- Azure Premium SSD  
- [Ultra disk](https://docs.microsoft.com/azure/virtual-machines/linux/disks-enable-ultra-ssd)
- [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) 

To learn about these disk types, see the article [Select a disk type](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types)

Azure offers two deployment methods for VHDs on Azure Standard and Premium Storage. If the overall scenario permits, take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) deployments. 

For a list of storage types and their SLAs in IOPS and storage throughput, review the [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

> [!IMPORTANT]
> Independent of the Azure storage type chosen, the file system that is used on that storage needs to be supported by SAP for the specific operating system and DBMS. [SAP support note #405827](https://launchpad.support.sap.com/#/notes/405827) lists the supported file systems for different operating systems and databases, including SAP HANA. This applies to all volumes SAP HANA might access for reading and writing for whatever task. Specifically using NFS on Azure for SAP HANA, additional restrictions of NFS versions apply as stated later in this article 


The minimum SAP HANA certified conditions for the different storage types are: 

- Azure Premium SSD - /hana/log is required to be cached with Azure [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator). The /hana/data volume could be placed on Premium SSD without Azure Write Accelerator or on Ultra disk
- Azure Ultra disk at least for the /hana/log volume. The /hana/data volume can be placed on either Premium SSD without Azure Write Accelerator or in order to get faster restart times Ultra disk
- **NFS v4.1** volumes on top of Azure NetApp Files for /hana/log **and** /hana/data. The volume of /hana/shared can use NFS v3 or NFS v4.1 protocol. The NFS v4.1 protocol is mandatory for /hana/data and/hana/log volumes.

Some of the storage types can be combined. For example, it is possible to put /hana/data onto Premium Storage and /hana/log can be placed on Ultra disk storage in order to get the required low latency. However, if you use an NFS v4.1 volume based on ANF for /hana/data, you are required to use another NFS v4.1 volume based on ANF for /hana/log. Using NFS on top of ANF for one of the volumes (like /hana/data) and Azure Premium Storage or Ultra disk for the other volume (like /hana/log) is **not supported**.

In the on-premises world, you rarely had to care about the I/O subsystems and its capabilities. Reason was that the appliance vendor needed to make sure that the minimum storage requirements are met for SAP HANA. As you build the Azure infrastructure yourself, you should be aware of some of these SAP issued requirements. Some of the minimum throughput characteristics that are required from SAP, are resulting in the need to:

- Enable read/write on **/hana/log** of a 250 MB/sec with 1 MB I/O sizes
- Enable read activity of at least 400 MB/sec for **/hana/data** for 16 MB and 64 MB I/O sizes
- Enable write activity of at least 250 MB/sec for **/hana/data** with 16 MB and 64 MB I/O sizes

Given that low storage latency is critical for DBMS systems, even as DBMS, like SAP HANA, keep data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But also operations like writing savepoints or loading data in-memory after crash recovery can be critical. Therefore, it is **mandatory** to leverage Azure Premium Disks for **/hana/data** and **/hana/log** volumes. In order to achieve the minimum throughput of **/hana/log** and **/hana/data** as desired by SAP, you need to build a RAID 0 using MDADM or LVM over multiple Azure Premium Storage disks. And use the RAID volumes as **/hana/data** and **/hana/log** volumes. 

> [!IMPORTANT]
>The three SAP HANA FileSystems /data, /log and /shared must not be put in a default or root volume group.  It is highly recommended to follow the Linux Vendors guidance which is typically to create individual Volume Groups for /data, /log and /shared.

**Recommendation: As stripe sizes for the RAID 0 the recommendation is to use:**

- 256 KB for **/hana/data**
- 32 KB for **/hana/log**

> [!IMPORTANT]
> The stripe size for /hana/data got changed from earlier recommendations calling for 64 KB or 128 KB to 256 KB based on customer experiences with more recent Linux versions. The size of 256 KB is providing slightly better performance

> [!NOTE]
> You don't need to configure any redundancy level using RAID volumes since Azure Premium and Standard storage keep three images of a VHD. The usage of a RAID volume is purely to configure volumes that provide sufficient I/O throughput.

Accumulating a number of Azure VHDs underneath a RAID, is accumulative from an IOPS and storage throughput side. So, if you put a RAID 0  over 3 x P30 Azure Premium Storage disks, it should give you three times the IOPS and three times the storage throughput of a single Azure Premium Storage P30 disk.

Also keep the overall VM I/O throughput in mind when sizing or deciding for a VM. Overall VM storage throughput is documented in the article [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory).

## Linux I/O Scheduler mode
Linux has several different I/O scheduling modes. Common recommendation through Linux vendors and SAP is to reconfigure the I/O scheduler mode for disk volumes from the **mq-deadline** or **kyber** mode to the **noop** (non-multiqueue) or **none** for (multiqueue) mode. Details are referenced in [SAP Note #1984787](https://launchpad.support.sap.com/#/notes/1984787). 


## Solutions with Premium Storage and Azure Write Accelerator for Azure M-Series virtual machines
Azure Write Accelerator is a functionality that is available for Azure M-Series VMs exclusively. As the name states, the purpose of the functionality is to improve I/O latency of writes against the Azure Premium Storage. For SAP HANA, Write Accelerator is supposed to be used against the **/hana/log** volume only. Therefore,  the **/hana/data** and **/hana/log** are separate volumes with Azure Write Accelerator supporting the **/hana/log** volume only. 

> [!IMPORTANT]
> When using Azure Premium Storage, the usage of Azure [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator) or the /hana/log volume is mandatory. Write Accelerator is available for premium Storage and M-Series and Mv2-Series VMs only.

The caching recommendations below are assuming the I/O characteristics for SAP HANA that list like:

- There hardly is any read workload against the HANA data files. Exceptions are large sized I/Os after restart of the HANA instance or when data is loaded into HANA. Another case of larger read I/Os against data files can be HANA database backups. As a result read caching mostly does not make sense since in most of the cases, all data file volumes need to be read completely.
- Writing against the data files is experienced in bursts based by HANA savepoints and HANA crash recovery. Writing savepoints is asynchronous and are not holding up any user transactions. Writing data during crash recovery is performance critical in order to get the system responding fast again. However, crash recovery should be rather exceptional situations
- There are hardly any reads from the HANA redo files. Exceptions are large I/Os when performing transaction log backups, crash recovery, or in the restart phase of a HANA instance.  
- Main load against the SAP HANA redo log file is writes. Dependent on the nature of workload, you can have I/Os as small as 4 KB or in other cases I/O sizes of 1 MB or more. Write latency against the SAP HANA redo log is performance critical.
- All writes need to be persisted on disk in a reliable fashion

**Recommendation: As a result of these observed I/O patterns by SAP HANA, the caching for the different volumes using Azure Premium Storage should be set like:**

- **/hana/data** - no caching
- **/hana/log** - no caching - exception for M- and Mv2-Series where Write Accelerator should be enabled without read caching. 
- **/hana/shared** - read caching

### Production recommended storage solution

> [!IMPORTANT]
> SAP HANA certification for Azure M-Series virtual machines is exclusively with Azure Write Accelerator for the **/hana/log** volume. As a result, production scenario SAP HANA deployments on Azure M-Series virtual machines are expected to be configured with Azure Write Accelerator for the **/hana/log** volume.  

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

**Recommendation: The recommended configurations for production scenarios look like:**

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | /hana/log | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M32ts | 192 GiB | 500 MB/s | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P20 |
| M32ls | 256 GiB | 500 MB/s | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P20 |
| M64ls | 512 GiB | 1000 MB/s | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P30 |
| M64s | 1000 GiB | 1000 MB/s | 4 x P20 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 |2 x P30 |
| M64ms | 1750 GiB | 1000 MB/s | 3 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 3 x P30 |
| M128s | 2000 GiB | 2000 MB/s |3 x P30 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 2 x P40 |
| M128ms | 3800 GiB | 2000 MB/s | 5 x P30 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 4 x P40 |
| M208s_v2 | 2850 GiB | 1000 MB/s | 4 x P30 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 3 x P40 |
| M208ms_v2 | 5700 GiB | 1000 MB/s | 4 x P40 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 3 x P50 |
| M416s_v2 | 5700 GiB | 2000 MB/s | 4 x P40 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 3 x P50 |
| M416ms_v2 | 11400 GiB | 2000 MB/s | 8 x P40 | 2 x P20 | 1 x P30 | 1 x P10 | 1 x P6 | 4 x P50 |

Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Azure Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). So at least the Azure Premium Storage disks forming the **/hana/log** volume need to be deployed as managed disks.

There are limits of Azure Premium Storage VHDs per VM that can be supported by Azure Write Accelerator. The current limits are:

- 16 VHDs for an M128xx and M416xx VM
- 8 VHDs for an M64xx and M208xx VM
- 4 VHDs for an M32xx VM

More detailed instructions on how to enable Azure Write Accelerator can be found in the article [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator).

Details and restrictions for Azure Write Accelerator can be found in the same documentation.

**Recommendation: You need to use Write Accelerator for disks forming the /hana/log volume**


### Cost conscious Azure Storage configuration
The following table shows a configuration of VM types that customers also use to host SAP HANA on Azure VMs. There might be some VM types that might not meet all minimum storage criteria for SAP HANA or are not officially supported with SAP HANA by SAP. But so far those VMs seemed to perform fine for non-production scenarios. The **/hana/data** and **/hana/log** are combined to one volume. As a result the usage of Azure Write Accelerator can become a limitation in terms of IOPS.

> [!NOTE]
> For SAP supported scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

> [!NOTE]
> A change from former recommendations for a cost conscious solution, is to move from [Azure Standard HDD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-hdd) to better performing and more reliable [Azure Standard SSD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-ssd)

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 112 GiB | 768 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E15 |
| E16v3 | 128 GiB | 384 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E15 |
| E32v3 | 256 GiB | 768 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| E64v3 | 432 GiB | 1,200 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E30 |
| GS5 | 448 GiB | 2,000 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E30 |
| M32ts | 192 GiB | 500 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| M32ls | 256 GiB | 500 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| M64ls | 512 GiB | 1,000 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 |1 x E30 |
| M64s | 1,000 GiB | 1,000 MB/s | 2 x P30 | 1 x E30 | 1 x E6 | 1 x E6 |2 x E30 |
| M64ms | 1,750 GiB | 1,000 MB/s | 3 x P30 | 1 x E30 | 1 x E6 | 1 x E6 | 3 x E30 |
| M128s | 2,000 GiB | 2,000 MB/s |3 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | 2 x E40 |
| M128ms | 3,800 GiB | 2,000 MB/s | 5 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | 2 x E50 |
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 4 x P30 | 1 x E30 | 1 x E10 | 1 x E6 |  3 x E40 |
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E40 |
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E40 |
| M416ms_v2 | 11400 GiB | 2,000 MB/s | 8 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E50 |


The disks recommended for the smaller VM types with 3 x P20 oversize the volumes regarding the space recommendations according to the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). However the choice as displayed in the table was made to provide sufficient disk throughput for SAP HANA. If you need changes to the **/hana/backup** volume, which was sized for keeping backups that represent twice the memory volume, feel free to adjust.   
Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type. 

> [!NOTE]
> The configurations above would NOT benefit from [Azure virtual machine single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_6/) since it does use a mixture of Azure Premium Storage and Azure Standard Storage. However, the selection was chosen in order to optimize costs. You would need to choose Premium Storage for all the disks above that listed as Azure Standard Storage (Sxx) to make the VM configuration compliant with the Azure single VM SLA.


> [!NOTE]
> The disk configuration recommendations stated are targeting minimum requirements SAP expresses towards  their infrastructure providers. In real customer deployments and workload scenarios, situations were encountered where these recommendations still did not provide sufficient capabilities. These could be situations where a customer required a faster reload of the data after a HANA restart or where backup configurations required higher bandwidth to the storage. Other cases included **/hana/log** where 5000 IOPS were not sufficient for the specific workload. So take these recommendations as a starting point and adapt based on the requirements of the workload.
>  

## Azure Ultra disk storage configuration for SAP HANA
Microsoft is in the process of rolling out a new Azure storage type called [Azure Ultra disk](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#ultra-disk). The significant difference between Azure storage offered so far and Ultra disk is that the disk capabilities are not bound to the disk size anymore. As a customer you can define these capabilities for Ultra disk:

- Size of a disk ranging from 4 GiB to 65,536 GiB
- IOPS range from 100 IOPS to 160K IOPS (maximum depends on VM types as well)
- Storage throughput from 300 MB/sec to 2,000 MB/sec

Ultra disk gives you the possibility to define a single disk that fulfills your size, IOPS, and disk throughput range. Instead of using logical volume managers like LVM or MDADM on top of Azure Premium Storage to construct volumes that fulfill IOPS and storage throughput requirements. You can run a configuration mix between Ultra disk and Premium Storage. As a result, you can limit the usage of Ultra disk to the performance critical /hana/data and /hana/log volumes and cover the other volumes with Azure Premium Storage

Other advantages of Ultra disk can be the better read latency in comparison to Premium Storage. The faster read latency can have advantages when you want to reduce the HANA startup times and the subsequent load of the data into memory. Advantages of Ultra disk storage also can be felt when HANA is writing savepoints. Since Premium Storage disks for /hana/data are usually not Write Accelerator cached, the write latency to /hana/data on Premium Storage compared to the Ultra disk is higher. It can be expected that savepoint writing with Ultra disk is performing better on Ultra disk.

> [!IMPORTANT]
> Ultra disk is not yet present in all the Azure regions and is also not yet supporting all VM types listed below. For detailed information where Ultra disk is available and which VM families are supported, check the article [What disk types are available in Azure?](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#ultra-disk).

### Production recommended storage solution with pure Ultra disk configuration
In this configuration, you keep the /hana/data and /hana/log volumes separately. The suggested values are derived out of the KPIs that SAP has to certify VM types for SAP HANA and storage configurations as recommended in the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html).

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data volume | /hana/data I/O throughput | /hana/data IOPS | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| E64s_v3 | 432 GiB | 1,200 MB/s | 600 GB | 700 MBps | 7,500 | 512 GB | 500 MBps  | 2,000 |
| M32ts | 192 GiB | 500 MB/s | 250 GB | 400 MBps | 7,500 | 256 GB | 250 MBps  | 2,000 |
| M32ls | 256 GiB | 500 MB/s | 300 GB | 400 MBps | 7,500 | 256 GB | 250 MBps  | 2,000 |
| M64ls | 512 GiB | 1,000 MB/s | 600 GB | 600 MBps | 7,500 | 512 GB | 400 MBps  | 2,500 |
| M64s | 1,000 GiB | 1,000 MB/s |  1,200 GB | 600 MBps | 7,500 | 512 GB | 400 MBps  | 2,500 |
| M64ms | 1,750 GiB | 1,000 MB/s | 2,100 GB | 600 MBps | 7,500 | 512 GB | 400 MBps  | 2,500 |
| M128s | 2,000 GiB | 2,000 MB/s |2,400 GB | 1,200 MBps |9,000 | 512 GB | 800 MBps  | 3,000 | 
| M128ms | 3,800 GiB | 2,000 MB/s | 4,800 GB | 1200 MBps |9,000 | 512 GB | 800 MBps  | 3,000 | 
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 3,500 GB | 1,000 MBps | 9,000 | 512 GB | 400 MBps  | 2,500 | 
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 7,200 GB | 1,000 MBps | 9,000 | 512 GB | 400 MBps  | 2,500 | 
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 7,200 GB | 1,500 MBps | 9,000 | 512 GB | 800 MBps  | 3,000 | 
| M416ms_v2 | 11,400 GiB | 2,000 MB/s | 14,400 GB | 1,500 MBps | 9,000 | 512 GB | 800 MBps  | 3,000 |   

The values listed are intended to be a starting point and need to be evaluated against the real demands. The advantage with Azure Ultra disk is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.   

> [!NOTE]
> So far, storage snapshots with Ultra disk storage is not available. This blocks the usage of VM snapshots with Azure Backup Services

### Cost conscious storage solution with pure Ultra disk configuration
In this configuration, you the /hana/data and /hana/log volumes on the same disk. The suggested values are derived out of the KPIs that SAP has to certify VM types for SAP HANA and storage configurations as recommended in the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). 

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

| VM SKU | RAM | Max. VM I/O<br /> Throughput | Volume for /hana/data and /log | /hana/data and log I/O throughput | /hana/data and log IOPS |
| --- | --- | --- | --- | --- | --- |
| E64s_v3 | 432 GiB | 1,200 MB/s | 1,200 GB | 1,200 MBps | 9,500 | 
| M32ts | 192 GiB | 500 MB/s | 512 GB | 400 MBps | 9,500 | 
| M32ls | 256 GiB | 500 MB/s | 600 GB | 400 MBps | 9,500 | 
| M64ls | 512 GiB | 1,000 MB/s | 1,100 GB | 900 MBps | 10,000 | 
| M64s | 1,000 GiB | 1,000 MB/s |  1,700 GB | 900 MBps | 10,000 | 
| M64ms | 1,750 GiB | 1,000 MB/s | 2,600 GB | 900 MBps | 10,000 | 
| M128s | 2,000 GiB | 2,000 MB/s |2,900 GB | 1,800 MBps |12,000 | 
| M128ms | 3,800 GiB | 2,000 MB/s | 5,300 GB | 1,800 MBps |12,000 |  
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 4,000 GB | 900 MBps | 10,000 |  
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 7,700 GB | 900 MBps | 10,000 | 
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 7,700 GB | 1,800MBps | 12,000 |  
| M416ms_v2 | 11,400 GiB | 2,000 MB/s | 15,000 GB | 1,800 MBps | 12,000 |    

The values listed are intended to be a starting point and need to be evaluated against the real demands. The advantage with Azure Ultra disk is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.  

## NFS v4.1 volumes on Azure NetApp Files
Azure NetApp Files provides native NFS shares that can be used for /hana/shared, /hana/data, and /hana/log volumes. Using ANF based NFS shares for the /hana/data and /hana/log volumes requires the usage of the v4.1 NFS protocol. The NFS protocol v3 is not supported for the usage of /hana/data and /hana/log volumes when basing the shares on ANF. 

> [!IMPORTANT]
> The NFS v3 protocol implemented on Azure NetApp Files is **not** supported to be used for /hana/data and /hana/log. The usage of the NFS 4.1 is mandatory for /hana/data and /hana/log volumes from a functional point of view. Whereas for the /hana/shared volume the NFS v3 or the NFS v4.1 protocol can be used from a functional point of view.

### Important considerations
When considering Azure NetApp Files for the SAP Netweaver and SAP HANA, be aware of the following important considerations:

- The minimum capacity pool is 4 TiB.  
- The minimum volume size is 100 GiB
- Azure NetApp Files and all virtual machines, where Azure NetApp Files volumes will be mounted, must be in the same Azure Virtual Network or in [peered virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) in the same region.  
- The selected virtual network must have a subnet, delegated to Azure NetApp Files.
- The throughput of an Azure NetApp volume is a function of the volume quota and Service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). When sizing the HANA Azure NetApp volumes, make sure the resulting throughput meets the HANA system requirements.  
- Azure NetApp Files offers [export policy](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-configure-export-policy): you can control the allowed clients, the access type (Read&Write, Read Only, etc.). 
- Azure NetApp Files feature isn't zone aware yet. Currently Azure NetApp Files feature isn't deployed in all Availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.  
- It is important to have the virtual machines deployed in close proximity to the Azure NetApp storage for low latency. 
- The User ID for <b>sid</b>adm and the Group ID for `sapsys` on the virtual machines must match the configuration in Azure NetApp Files. 

> [!IMPORTANT]
> For SAP HANA workloads, low latency is critical. Work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity.  

> [!IMPORTANT]
> If there is a mismatch between User ID for <b>sid</b>adm and the Group ID for `sapsys` between the virtual machine and the Azure NetApp configuration, the permissions for files on Azure NetApp volumes, mounted on virtual machines, will be displayed as `nobody`. Make sure to specify the correct User ID for <b>sid</b>adm and the Group ID for `sapsys`, when [on-boarding a new system](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxjSlHBUxkJBjmARn57skvdUQlJaV0ZBOE1PUkhOVk40WjZZQVJXRzI2RC4u) to Azure NetApp Files.

### Sizing for HANA database on Azure NetApp Files

The throughput of an Azure NetApp volume is a function of the volume size and Service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). 

As you design the infrastructure for SAP in Azure you should be aware of some minimum storage throughput requirements by SAP, which translate into minimum throughput characteristics of:

- Enable read/write on /hana/log of a 250 MB/sec with 1 MB I/O sizes  
- Enable read activity of at least 400 MB/sec for /hana/data for 16 MB and 64 MB I/O sizes  
- Enable write activity of at least 250 MB/sec for /hana/data with 16 MB and 64 MB I/O sizes  

The [Azure NetApp Files throughput limits](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) per 1 TiB of volume quota are:
- Premium Storage Tier - 64 MiB/s  
- Ultra Storage Tier - 128 MiB/s  

> [!IMPORTANT]
> Independent of the capacity you deploy on a single NFS volume, the throughput, is expected to plateau in the range of 1.2-1.4 GB/sec bandwidth leveraged by a consumer in a virtual machine. This has to do with the underlying architecture of the ANF offer and related Linux session limits around NFS. The performance and throughput numbers as documented in the article [Performance benchmark test results for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/performance-benchmarks-linux) were conducted against one shared NFS volume with multiple client VMs and as a result with multiple sessions. That scenario is different to the scenario we measure in SAP. Where we measure throughput from a single VM against an NFS volume. hosted on ANF.

To meet the SAP minimum throughput requirements for data and log, and according to the guidelines for `/hana/shared`, the recommended sizes would look like:

| Volume | Size<br /> Premium Storage tier | Size<br /> Ultra Storage tier | Supported NFS protocol |
| --- | --- | --- |
| /hana/log/ | 4 TiB | 2 TiB | v4.1 |
| /hana/data | 6.3 TiB | 3.2 TiB | v4.1 |
| /hana/shared | Max(512 GB, 1xRAM) per 4 worker nodes | Max(512 GB, 1xRAM) per 4 worker nodes | v3 or v4.1 |


> [!NOTE]
> The Azure NetApp Files sizing recommendations stated here are targeting to meet the minimum requirements SAP expresses towards  their infrastructure providers. In real customer deployments and workload scenarios, that may not be enough. Use these recommendations as a starting point and adapt, based on the requirements of your specific workload.  

Therefore you could consider to deploy similar throughput for the ANF volumes as listed for Ultra disk storage already. Also consider the sizes for the sizes listed for the volumes for the different VM SKUs as done in the Ultra disk tables already.

> [!TIP]
> You can re-size Azure NetApp Files volumes dynamically, without the need to `unmount` the volumes, stop the virtual machines or stop SAP HANA. That allows flexibility to meet your application both expected and unforeseen throughput demands.

Documentation on how to deploy an SAP HANA scale-out configuration with standby node using NFS v4.1 volumes that are hosted in ANF is published in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse).


## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview).
