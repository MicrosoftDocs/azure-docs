---
title: SAP HANA Azure virtual machine storage configurations | Microsoft Docs
description: Storage recommendations for VM that have SAP HANA deployed in them.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage'
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/21/2021
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA Azure virtual machine storage configurations

Azure provides different types of storage that are suitable for Azure VMs that are running SAP HANA. The **SAP HANA certified Azure storage types** that can be considered for SAP HANA deployments list like: 

- Azure premium SSD or premium storage 
- [Ultra disk](../../disks-enable-ultra-ssd.md)
- [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) 

To learn about these disk types, see the article [Azure Storage types for SAP workload](./planning-guide-storage.md) and [Select a disk type](../../disks-types.md)

Azure offers two deployment methods for VHDs on Azure Standard and premium storage. We expect you to take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) for Azure block storage deployments. 

For a list of storage types and their SLAs in IOPS and storage throughput, review the [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

> [!IMPORTANT]
> Independent of the Azure storage type chosen, the file system that is used on that storage needs to be supported by SAP for the specific operating system and DBMS. [SAP support note #2972496](https://launchpad.support.sap.com/#/notes/2972496) lists the supported file systems for different operating systems and databases, including SAP HANA. This applies to all volumes SAP HANA might access for reading and writing for whatever task. Specifically using NFS on Azure for SAP HANA, additional restrictions of NFS versions apply as stated later in this article 


The minimum SAP HANA certified conditions for the different storage types are: 

- Azure premium storage - **/hana/log** is required to be supported by Azure [Write Accelerator](../../how-to-enable-write-accelerator.md). The **/hana/data** volume could be placed on premium storage without Azure Write Accelerator or on Ultra disk
- Azure Ultra disk at least for the **/hana/log** volume. The **/hana/data** volume can be placed on either premium storage without Azure Write Accelerator or in order to get faster restart times Ultra disk
- **NFS v4.1** volumes on top of Azure NetApp Files for **/hana/log and /hana/data**. The volume of /hana/shared can use NFS v3 or NFS v4.1 protocol

Some of the storage types can be combined. For example, it is possible to put **/hana/data** onto premium storage and **/hana/log** can be placed on Ultra disk storage in order to get the required low latency. If you use a volume based on ANF for **/hana/data**,  **/hana/log** volume needs to be based on NFS on top of ANF as well. Using NFS on top of ANF for one of the volumes (like /hana/data) and Azure premium storage or Ultra disk for the other volume (like **/hana/log**) is **not supported**.

In the on-premises world, you rarely had to care about the I/O subsystems and its capabilities. Reason was that the appliance vendor needed to make sure that the minimum storage requirements are met for SAP HANA. As you build the Azure infrastructure yourself, you should be aware of some of these SAP issued requirements. Some of the minimum throughput characteristics that SAP is recommending, are:

- Read/write on **/hana/log** of 250 MB/sec with 1 MB I/O sizes
- Read activity of at least 400 MB/sec for **/hana/data** for 16 MB and 64 MB I/O sizes
- Write activity of at least 250 MB/sec for **/hana/data** with 16 MB and 64 MB I/O sizes

Given that low storage latency is critical for DBMS systems, even as DBMS, like SAP HANA, keep data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But also operations like writing savepoints or loading data in-memory after crash recovery can be critical. Therefore, it is **mandatory** to leverage Azure premium storage, Ultra disk, or ANF for **/hana/data** and **/hana/log** volumes. 


Some guiding principles in selecting your storage configuration for HANA can be listed like:

- Decide on the type of storage based on [Azure Storage types for SAP workload](./planning-guide-storage.md) and [Select a disk type](../../disks-types.md)
- The overall VM I/O throughput and IOPS limits in mind when sizing or deciding for a VM. Overall VM storage throughput is documented in the article [Memory optimized virtual machine sizes](../../sizes-memory.md)
- When deciding for the storage configuration, try to stay below the overall throughput of the VM with your **/hana/data** volume configuration. Writing savepoints, SAP HANA can be aggressive issuing I/Os. It is easily possible to push up to throughput limits of your **/hana/data** volume when writing a savepoint. If your disk(s) that build the **/hana/data** volume have a higher throughput than your VM allows, you could run into situations where throughput utilized by the savepoint writing is interfering with throughput demands of the redo log writes. A situation that can impact the application throughput


> [!IMPORTANT]
> The suggestions for the storage configurations are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you are not utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage then. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity, IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your HANA workload.


## Stripe sets versus SAP HANA data volume partitioning
Using Azure premium storage you may hit the best price/performance ratio when you stripe the **/hana/data** and/or **/hana/log** volume across multiple Azure disks. Instead of deploying larger disk volumes that provide the more on IOPS or throughput needed. So far this was accomplished with LVM and MDADM volume managers which are part of Linux. The method of striping disks is decades old and well known. As beneficial as those striped volumes are to get to the IOPS or throughput capabilities you may need, it adds complexities around managing those striped volumes. Especially in cases when the volumes need to get extended in capacity. At least for **/hana/data**, SAP introduced an alternative method that achieves the same goal as striping across multiple Azure disks. Since SAP HANA 2.0 SPS03, the HANA indexserver is able to stripe its I/O activity across multiple HANA data files which are located on different Azure disks. The advantage is that you don't have to take care of creating and managing a striped volume across different Azure disks. The SAP HANA functionality of data volume partitioning is described in detail in:

- [The HANA Administrator's Guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.05/en-US/40b2b2a880ec4df7bac16eae3daef756.html?q=hana%20data%20volume%20partitioning)
- [Blog about SAP HANA – Partitioning Data Volumes](https://blogs.sap.com/2020/10/07/sap-hana-partitioning-data-volumes/)
- [SAP Note #2400005](https://launchpad.support.sap.com/#/notes/2400005)
- [SAP Note #2700123](https://launchpad.support.sap.com/#/notes/2700123)

Reading through the details, it is apparent that leveraging this functionality takes away complexities of volume manager based stripe sets. You also realize that the HANA data volume partitioning is not only working for Azure block storage, like Azure premium storage. You can use this functionality as well to stripe across NFS shares in case these shares have IOPS or throughput limitations.  


## Linux I/O Scheduler mode
Linux has several different I/O scheduling modes. Common recommendation through Linux vendors and SAP is to reconfigure the I/O scheduler mode for disk volumes from the **mq-deadline** or **kyber** mode to the **noop** (non-multiqueue) or **none** for (multiqueue) mode if not done yet by the SLES saptune profiles. Details are referenced in: 

- [SAP Note #1984787](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP Note #2578899](https://launchpad.support.sap.com/#/notes/2578899) 
- [Issue with noop setting in SLES 12 SP4](https://www.suse.com/support/kb/doc/?id=000019547)

On Red Hat, leave the settings as established by the specific tune profiles for the different SAP applications.


## Solutions with premium storage and Azure Write Accelerator for Azure M-Series virtual machines
Azure Write Accelerator is a functionality that is available for Azure M-Series VMs exclusively. As the name states, the purpose of the functionality is to improve I/O latency of writes against the Azure premium storage. For SAP HANA, Write Accelerator is supposed to be used against the **/hana/log** volume only. Therefore,  the **/hana/data** and **/hana/log** are separate volumes with Azure Write Accelerator supporting the **/hana/log** volume only. 

> [!IMPORTANT]
> When using Azure premium storage, the usage of Azure [Write Accelerator](../../how-to-enable-write-accelerator.md) for the **/hana/log** volume is mandatory. Write Accelerator is available for premium storage and M-Series and Mv2-Series VMs only. Write Accelerator is not working in combination with other Azure VM families, like Esv3 or Edsv4.

The caching recommendations for Azure premium disks below are assuming the I/O characteristics for SAP HANA that list like:

- There hardly is any read workload against the HANA data files. Exceptions are large sized I/Os after restart of the HANA instance or when data is loaded into HANA. Another case of larger read I/Os against data files can be HANA database backups. As a result read caching mostly does not make sense since in most of the cases, all data file volumes need to be read completely. 
- Writing against the data files is experienced in bursts based by HANA savepoints and HANA crash recovery. Writing savepoints is asynchronous and are not holding up any user transactions. Writing data during crash recovery is performance critical in order to get the system responding fast again. However, crash recovery should be rather exceptional situations
- There are hardly any reads from the HANA redo files. Exceptions are large I/Os when performing transaction log backups, crash recovery, or in the restart phase of a HANA instance.  
- Main load against the SAP HANA redo log file is writes. Dependent on the nature of workload, you can have I/Os as small as 4 KB or in other cases I/O sizes of 1 MB or more. Write latency against the SAP HANA redo log is performance critical.
- All writes need to be persisted on disk in a reliable fashion

**Recommendation: As a result of these observed I/O patterns by SAP HANA, the caching for the different volumes using Azure premium storage should be set like:**

- **/hana/data** - no caching or read caching
- **/hana/log** - no caching - exception for M- and Mv2-Series VMs where Azure Write Accelerator should be enabled 
- **/hana/shared** - read caching
- **OS disk** - don't change default caching that is set by Azure at creation time of the VM


If you are using LVM or mdadm to build stripe sets across several Azure premium disks, you need to define stripe sizes. These sizes differ between **/hana/data** and **/hana/log**. **Recommendation: As stripe sizes the recommendation is to use:**

- 256 KB for **/hana/data**
- 64 KB for **/hana/log**

> [!NOTE]
> The stripe size for **/hana/data** got changed from earlier recommendations calling for 64 KB or 128 KB to 256 KB based on customer experiences with more recent Linux versions. The size of 256 KB is providing slightly better performance. We also changed the recommendation for stripe sizes of **/hana/log** from 32 KB to 64 KB in order to get enough throughput with larger I/O sizes.

> [!NOTE]
> You don't need to configure any redundancy level using RAID volumes since Azure block storage keeps three images of a VHD. The usage of a stripe set with Azure premium disks is purely to configure volumes that provide sufficient IOPS and/or I/O throughput.

Accumulating a number of Azure VHDs underneath a stripe set, is accumulative from an IOPS and storage throughput side. So, if you put a stripe set across  over 3 x P30 Azure premium storage disks, it should give you three times the IOPS and three times the storage throughput of a single Azure premium Storage P30 disk.

> [!IMPORTANT]
> In case you are using LVM or mdadm as volume manager to create stripe sets across multiple Azure premium disks, the three SAP HANA FileSystems /data, /log and /shared must not be put in a default or root volume group. It is highly recommended to follow the Linux Vendors guidance which is typically to create individual Volume Groups for /data, /log and /shared.


### Azure burst functionality for premium storage
For Azure premium storage disks smaller or equal to 512 GiB in capacity, burst functionality is offered. The exact way how disk bursting works is described in the article [Disk bursting](../../disk-bursting.md). When you read the article, you understand the concept of accruing IOPS and throughput in the times when your I/O workload is below the nominal IOPS and throughput of the disks (for details on the nominal throughput see [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/)). You are going to accrue the delta of IOPS and throughput between your current usage and the nominal values of the disk. The bursts  are limited to a maximum of 30 minutes.

The ideal cases where this burst functionality can be planned in is likely going to be the volumes or disks that contain data files for the different DBMS. The I/O workload expected against those volumes, especially with small to mid-ranged systems is expected to look like:

- Low to moderate read workload since data ideally is cached in memory, or like in the case of HANA should be completely in memory
- Bursts of write triggered by database checkpoints or savepoints that are issued on a regular basis
- Backup workload that reads in a continuous stream in cases where backups are not executed via storage snapshots
- For SAP HANA, load of the data into memory after an instance restart

Especially on smaller DBMS systems where your workload is handling a few hundred transactions per seconds only, such a burst functionality can make sense as well for the disks or volumes that store the transaction or redo log. Expected workload against such a disk or volumes looks like:

- Regular writes to the disk that are dependent on the workload and the nature of workload since every commit issued by the application is likely to trigger an I/O operation
- Higher workload in throughput for cases of operational tasks, like creating or rebuilding indexes
- Read bursts when performing transaction log or redo log backups


### Production recommended storage solution based on Azure premium storage

> [!IMPORTANT]
> SAP HANA certification for Azure M-Series virtual machines is exclusively with Azure Write Accelerator for the **/hana/log** volume. As a result, production scenario SAP HANA deployments on Azure M-Series virtual machines are expected to be configured with Azure Write Accelerator for the **/hana/log** volume.  

> [!NOTE]
> In scenarios that involve Azure premium storage, we are implementing burst capabilities into the configuration. As you are using storage test tools of whatever shape or form, keep the way [Azure premium disk bursting works](../../disk-bursting.md) in mind. Running the storage tests delivered through the SAP HWCCT or HCMT tool, we are not expecting that all tests will pass the criteria since some of the tests will exceed the bursting credits you can accumulate. Especially when all the tests run sequentially without break.

> [!NOTE]
> With M32ts and M32ls VMs it can happen that disk throughput could be lower than expected using HCMT/HWCCT disk tests. Even with disk bursting or with sufficiently provisioned I/O throughput of the underlying disks. Root cause of the observed behavior was that the HCMT/HWCCT storage test files were completely cached in the read cache of the Premium storage data disks. This cache is located on the compute host that hosts the virtual machine and can cache the test files of HCMT/HWCCT completely. In such a case the quotas listed in the column **Max cached and temp storage throughput: IOPS/MBps (cache size in GiB)** in  the article [M-series](https://docs.microsoft.com/azure/virtual-machines/m-series) are relevant. Specifically for M32ts and M32ls, the throughput quota against the read cache is only 400MB/sec. As a result of the tests files being completely cached, it is possible that despite disk bursting or higher provisioned I/O throughput, the tests can fall slightly short of 400MB/sec maximum throughput. As an alternative, you can test without read cache enabled on the Azure Premium storage data disks.


> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

**Recommendation: The recommended configurations with Azure premium storage for production scenarios look like:**

Configuration for SAP **/hana/data** volume:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- | 
| M32ts | 192 GiB | 500 MBps | 4 x P6 | 200 MBps | 680 MBps | 960 | 14,000 |
| M32ls | 256 GiB | 500 MBps | 4 x P6 | 200 MBps | 680 MBps | 960 | 14,000 |
| M64ls | 512 GiB | 1,000 MBps | 4 x P10 | 400 MBps | 680 MBps | 2,000 | 14,000 |
| M64s | 1,000 GiB | 1,000 MBps | 4 x P15 | 500 MBps | 680 MBps | 4,400 | 14,000 |
| M64ms | 1,750 GiB | 1,000 MBps | 4 x P20 | 600 MBps | 680 MBps | 9,200 | 14,000 |  
| M128s | 2,000 GiB | 2,000 MBps | 4 x P20 | 600 MBps | 680 MBps | 9,200| 14,000 | 
| M128ms | 3,800 GiB | 2,000 MBps | 4 x P30 | 800 MBps | no bursting | 20,000 | no bursting | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 4 x P30 | 800 MBps | no bursting | 20,000| no bursting | 
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 4 x P40 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M416s_v2 | 5,700 GiB | 2,000 MBps | 4 x P40 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 4 x P50 | 2,000 MBps | no bursting | 30,000 | no bursting |


For the **/hana/log** volume. the configuration would look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | **/hana/log** volume | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- | 
| M32ts | 192 GiB | 500 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M32ls | 256 GiB | 500 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M64ls | 512 GiB | 1,000 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M64s | 1,000 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M64ms | 1,750 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M128s | 2,000 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500|  
| M128ms | 3,800 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M416s_v2 | 5,700 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 


For the other volumes, the configuration would look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/shared | /root volume | /usr/sap |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M32ts | 192 GiB | 500 MBps | 1 x P15 | 1 x P6 | 1 x P6 |
| M32ls | 256 GiB | 500 MBps |  1 x P15 | 1 x P6 | 1 x P6 |
| M64ls | 512 GiB | 1000 MBps | 1 x P20 | 1 x P6 | 1 x P6 |
| M64s | 1,000 GiB | 1,000 MBps | 1 x P30 | 1 x P6 | 1 x P6 |
| M64ms | 1,750 GiB | 1,000 MBps | 1 x P30 | 1 x P6 | 1 x P6 | 
| M128s | 2,000 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M128ms | 3,800 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 |
| M208s_v2 | 2,850 GiB | 1,000 MBps |  1 x P30 | 1 x P10 | 1 x P6 |
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M416s_v2 | 5,700 GiB | 2,000 MBps |  1 x P30 | 1 x P10 | 1 x P6 | 
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 


Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure premium storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Azure Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). So at least the Azure premium storage disks forming the **/hana/log** volume need to be deployed as managed disks. More detailed instructions and restrictions of Azure Write Accelerator can be found in the article [Write Accelerator](../../how-to-enable-write-accelerator.md).

For the HANA certified VMs of the Azure [Esv3](../../ev3-esv3-series.md?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#esv3-series) family and the [Edsv4](../../edv4-edsv4-series.md?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#edsv4-series), you need to ANF for the **/hana/data** and **/hana/log** volume. Or you need to leverage Azure Ultra disk storage instead of Azure premium storage only for the **/hana/log** volume. As a result, the configurations for the **/hana/data** volume on Azure premium storage could look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- |
| E20ds_v4 | 160 GiB | 480 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 |
| E32ds_v4 | 256 GiB | 768 MBps | 3 x P10 |  300 MBps | 510 MBps | 1,500 | 10,500|
| E48ds_v4 | 384 GiB | 1,152 MBps | 3 x P15 |  375 MBps |510 MBps | 3,300  | 10,500 | 
| E64ds_v4 | 504 GiB | 1,200 MBps | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 
| E64s_v3 | 432 GiB | 1,200 MB/s | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 

For the other volumes, including **/hana/log** on Ultra disk, the configuration could look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS | /hana/shared | /root volume | /usr/sap |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| E20ds_v4 | 160 GiB | 480 MBps | 80 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E32ds_v4 | 256 GiB | 768 MBps | 128 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E48ds_v4 | 384 GiB | 1,152 MBps | 192 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E64ds_v4 | 504 GiB | 1,200 MBps | 256 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E64s_v3 | 432 GiB | 1,200 MBps | 220 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |


## Azure Ultra disk storage configuration for SAP HANA
Another Azure storage type is called [Azure Ultra disk](../../disks-types.md#ultra-disk). The significant difference between Azure storage offered so far and Ultra disk is that the disk capabilities are not bound to the disk size anymore. As a customer you can define these capabilities for Ultra disk:

- Size of a disk ranging from 4 GiB to 65,536 GiB
- IOPS range from 100 IOPS to 160K IOPS (maximum depends on VM types as well)
- Storage throughput from 300 MB/sec to 2,000 MB/sec

Ultra disk gives you the possibility to define a single disk that fulfills your size, IOPS, and disk throughput range. Instead of using logical volume managers like LVM or MDADM on top of Azure premium storage to construct volumes that fulfill IOPS and storage throughput requirements. You can run a configuration mix between Ultra disk and premium storage. As a result, you can limit the usage of Ultra disk to the performance critical **/hana/data** and **/hana/log** volumes and cover the other volumes with Azure premium storage

Other advantages of Ultra disk can be the better read latency in comparison to premium storage. The faster read latency can have advantages when you want to reduce the HANA startup times and the subsequent load of the data into memory. Advantages of Ultra disk storage also can be felt when HANA is writing savepoints. 

> [!NOTE]
> Ultra disk is not yet present in all the Azure regions and is also not yet supporting all VM types listed below. For detailed information where Ultra disk is available and which VM families are supported, check the article [What disk types are available in Azure?](../../disks-types.md#ultra-disk).

### Production recommended storage solution with pure Ultra disk configuration
In this configuration, you keep the **/hana/data** and **/hana/log** volumes separately. The suggested values are derived out of the KPIs that SAP has to certify VM types for SAP HANA and storage configurations as recommended in the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html).

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

> [!NOTE]
> Azure Ultra disk is enforcing a minimum of 2 IOPS per Gigabyte capacity of a disk


| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data volume | /hana/data I/O throughput | /hana/data IOPS | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| E20ds_v4 | 160 GiB | 480 MB/s | 200 GB | 400 MBps | 2,500 | 80 GB | 250 MB | 1,800 |
| E32ds_v4 | 256 GiB | 768 MB/s | 300 GB | 400 MBps | 2,500 | 128 GB | 250 MBps | 1,800 |
| E48ds_v4 | 384 GiB | 1152 MB/s | 460 GB | 400 MBps | 3,000 | 192 GB | 250 MBps | 1,800 |
| E64ds_v4 | 504 GiB | 1200 MB/s | 610 GB | 400 MBps | 3,500 |  256 GB | 250 MBps | 1,800 |
| E64s_v3 | 432 GiB | 1,200 MB/s | 610 GB | 400 MBps | 3,500 | 220 GB | 250 MB | 1,800 |
| M32ts | 192 GiB | 500 MB/s | 250 GB | 400 MBps | 2,500 | 96 GB | 250 MBps  | 1,800 |
| M32ls | 256 GiB | 500 MB/s | 300 GB | 400 MBps | 2,500 | 256 GB | 250 MBps  | 1,800 |
| M64ls | 512 GiB | 1,000 MB/s | 620 GB | 400 MBps | 3,500 | 256 GB | 250 MBps  | 1,800 |
| M64s | 1,000 GiB | 1,000 MB/s |  1,200 GB | 600 MBps | 5,000 | 512 GB | 250 MBps  | 2,500 |
| M64ms | 1,750 GiB | 1,000 MB/s | 2,100 GB | 600 MBps | 5,000 | 512 GB | 250 MBps  | 2,500 |
| M128s | 2,000 GiB | 2,000 MB/s |2,400 GB | 750 MBps | 7,000 | 512 GB | 250 MBps  | 2,500 | 
| M128ms | 3,800 GiB | 2,000 MB/s | 4,800 GB | 750 MBps |9,600 | 512 GB | 250 MBps  | 2,500 | 
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 3,500 GB | 750 MBps | 7,000 | 512 GB | 250 MBps  | 2,500 | 
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 7,200 GB | 750 MBps | 14,400 | 512 GB | 250 MBps  | 2,500 | 
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 7,200 GB | 1,000 MBps | 14,400 | 512 GB | 400 MBps  | 4,000 | 
| M416ms_v2 | 11,400 GiB | 2,000 MB/s | 14,400 GB | 1,500 MBps | 28,800 | 512 GB | 400 MBps  | 4,000 |   

**The values listed are intended to be a starting point and need to be evaluated against the real demands.** The advantage with Azure Ultra disk is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.   

> [!NOTE]
> So far, storage snapshots with Ultra disk storage is not available. This blocks the usage of VM snapshots with Azure Backup Services


## NFS v4.1 volumes on Azure NetApp Files
For detail on ANF for HANA, read the document [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)




## Cost conscious solution with Azure premium storage
So far, the Azure premium storage solution described in this document in section [Solutions with premium storage and Azure Write Accelerator for Azure M-Series virtual machines](#solutions-with-premium-storage-and-azure-write-accelerator-for-azure-m-series-virtual-machines) were meant for SAP HANA production supported scenarios. One of the characteristics of production supportable configurations is the separation of the volumes for SAP HANA data and redo log into two different volumes. Reason for such a separation is that the workload characteristics on the volumes are different. And that with the suggested production configurations, different type of caching or even different types of Azure block storage could be necessary. For non-production scenarios, some of the considerations taken for production systems may not apply to more low end non-production systems. As a result the HANA data and log volume could be combined. Though eventually with some culprits, like eventually not meeting certain throughput or latency KPIs that are required for production systems. Another aspect to reduce costs in such environments can be the usage of [Azure Standard SSD storage](./planning-guide-storage.md#azure-standard-ssd-storage). Keep in mind that choosing Standard SSD or Standard HDD Azure storage has impact on your single VM SLAs as documented in the article  [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines).

A less costly alternative for such configurations could look like:


| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | comments |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 112 GiB | 768 MB/s | 4 x P6 | 1 x E10 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| E16v3 | 128 GiB | 384 MB/s | 4 x P6 | 1 x E10 | 1 x E6 | 1 x E6 | VM type not HANA certified <br /> Will not achieve less than 1ms storage latency<sup>1</sup> |
| M32ts | 192 GiB | 500 MB/s | 3 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 5,000<sup>2</sup> |
| E20ds_v4 | 160 GiB | 480 MB/s | 4 x P6 | 1 x E15 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| E32v3 | 256 GiB | 768 MB/s | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | VM type not HANA certified <br /> Will not achieve less than 1ms storage latency<sup>1</sup> |
| E32ds_v4 | 256 GiB | 768 MBps | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| M32ls | 256 GiB | 500 MB/s | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 5,000<sup>2</sup> |
| E48ds_v4 | 384 GiB | 1,152 MBps | 6 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| E64v3 | 432 GiB | 1,200 MB/s | 6 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| E64ds_v4 | 504 GiB | 1200 MB/s |  7 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | Will not achieve less than 1ms storage latency<sup>1</sup> |
| M64ls | 512 GiB | 1,000 MB/s | 7 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M64s | 1,000 GiB | 1,000 MB/s | 7 x P15 | 1 x E30 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M64ms | 1,750 GiB | 1,000 MB/s | 6 x P20 | 1 x E30 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M128s | 2,000 GiB | 2,000 MB/s |6 x P20 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 4 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M128ms | 3,800 GiB | 2,000 MB/s | 5 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M416ms_v2 | 11400 GiB | 2,000 MB/s | 7 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |


<sup>1</sup> [Azure Write Accelerator](../../how-to-enable-write-accelerator.md) can't be used with the Ev4 and Ev4 VM families. As a result of using Azure premium storage the I/O latency will not be less than 1ms

<sup>2</sup> The VM family supports [Azure Write Accelerator](../../how-to-enable-write-accelerator.md), but there is a potential that the IOPS limit of Write accelerator could limit the disk configurations IOPS capabilities

In the case of combining the data and log volume for SAP HANA, the disks building the striped volume should not have read cache or read/write cache enabled.

There are VM types listed that are not certified with SAP and as such not listed in the so called [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure). Feedback of customers was that those non-listed VM types were used successfully for some non-production tasks.


## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).