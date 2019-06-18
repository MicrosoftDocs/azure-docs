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
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/05/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA Azure virtual machine storage configurations

Azure provides different types of storage that are suitable for Azure VMs that are running SAP HANA. The Azure storage types that can be considered for SAP HANA deployments list like: 

- Standard SSD disk drives (SSD)
- Premium solid state drives (SSD)
- Ultra SSD in public preview and not yet supported with production SAP applications

To learn about these disk types, see the article [Select a disk type](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types)

Azure offers two deployment methods for VHDs on Azure Standard and Premium Storage. If the overall scenario permits, take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) deployments. 

For a list of storage types and their SLAs in IOPS and storage throughput, review the [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

**Recommendation: Use Azure Premium Storage in conjunction with Azure Write Accelerator and use Azure Managed Disks for deployment**

In the on-premise world, you rarely had to care about the I/O subsystems and its capabilities. Reason was that the appliance vendor needed to make sure that the minimum storage requirements are met for SAP HANA. As you build the Azure infrastructure yourself, you should be aware of some of those requirements. Some of the minimum throughput characteristics that are asked are resulting in the need to:

- Enable read/write on **/hana/log** of a 250 MB/sec with 1 MB I/O sizes
- Enable read activity of at least 400 MB/sec for **/hana/data** for 16 MB and 64 MB I/O sizes
- Enable write activity of at least 250 MB/sec for **/hana/data** with 16 MB and 64 MB I/O sizes

Given that low storage latency is critical for DBMS systems, even as DBMS, like SAP HANA, keep data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But also operations like writing savepoints or loading data in-memory after crash recovery can be critical. Therefore, it is **mandatory** to leverage Azure Premium Disks for **/hana/data** and **/hana/log** volumes. In order to achieve the minimum throughput of **/hana/log** and **/hana/data** as desired by SAP, you need to build a RAID 0 using MDADM or LVM over multiple Azure Premium Storage disks. And use the RAID volumes as **/hana/data** and **/hana/log** volumes. 

**Recommendation: As stripe sizes for the RAID 0 the recommendation is to use:**

- 64 KB or 128 KB for **/hana/data**
- 32 KB for **/hana/log**

> [!NOTE]
> You don't need to configure any redundancy level using RAID volumes since Azure Premium and Standard storage keep three images of a VHD. The usage of a RAID volume is purely to configure volumes that provide sufficient I/O throughput.

Accumulating a number of Azure VHDs underneath a RAID, is accumulative from an IOPS and storage throughput side. So, if you put a RAID 0  over 3 x P30 Azure Premium Storage disks, it should give you three times the IOPS and three times the storage throughput of a single Azure Premium Storage P30 disk.

The caching recommendations below are assuming the I/O characteristics for SAP HANA that list like:

- There hardly is any read workload against the HANA data files. Exceptions are large sized I/Os after restart of the HANA instance or when data is loaded into HANA. Another case of larger read I/Os against data files can be HANA database backups. As a result read caching mostly does not make sense since in most of the cases, all data file volumes need to be read completely.
- Writing against the data files is experienced in bursts based by HANA savepoints and HANA crash recovery. Writing savepoints is asynchronous and are not holding up any user transactions. Writing data during crash recovery is performance critical in order to get the system responding fast again. However, crash recovery should be rather exceptional situations
- There are hardly any reads from the HANA redo files. Exceptions are large I/Os when performing transaction log backups, crash recovery, or in the restart phase of a HANA instance.  
- Main load against the SAP HANA redo log file is writes. Dependent on the nature of workload, you can have I/Os as small as 4 KB or in other cases I/O sizes of 1 MB or more. Write latency against the SAP HANA redo log is performance critical.
- All writes need to be persisted on disk in a reliable fashion

**Recommendation: As a result of these observed I/O patterns by SAP HANA, the caching for the different volumes using Azure Premium Storage should be set like:**

- **/hana/data** - no caching
- **/hana/log** - no caching - exception for M-Series (see later in this document)
- **/hana/shared** - read caching


Also keep the overall VM I/O throughput in mind when sizing or deciding for a VM. Overall VM storage throughput is documented in the article [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory).

## Linux I/O Scheduler mode
Linux has several different I/O scheduling modes. Common recommendation through Linux vendors and SAP is to reconfigure the I/O scheduler mode for disk volumes from the **cfq** mode to the **noop** mode. Details are referenced in [SAP Note #1984798](https://launchpad.support.sap.com/#/notes/1984787). 


## Production storage solution with Azure Write Accelerator for Azure M-Series virtual machines
Azure Write Accelerator is a functionality that is getting rolled out for Azure M-Series VMs exclusively. As the name states, the purpose of the functionality is to improve I/O latency of Writes against the Azure Premium Storage. For SAP HANA, Write Accelerator is supposed to be used against the **/hana/log** volume only. Therefore,  the **/hana/data** and **/hana/log** are separate volumes with Azure Write Accelerator supporting the **/hana/log** volume only. 

> [!IMPORTANT]
> SAP HANA certification for Azure M-Series virtual machines is exclusively with Azure Write Accelerator for the **/hana/log** volume. As a result, production scenario SAP HANA deployments on Azure M-Series virtual machines are expected to be configured with Azure Write Accelerator for the **/hana/log** volume.  

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

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

M416xx_v2 VM types are not yet made available by Microsoft to the public. Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Azure Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). So at least the Azure Premium Storage disks forming the **/hana/log** volume need to be deployed as managed disks.

There are limits of Azure Premium Storage VHDs per VM that can be supported by Azure Write Accelerator. The current limits are:

- 16 VHDs for an M128xx and M416xx VM
- 8 VHDs for an M64xx and M208xx VM
- 4 VHDs for an M32xx VM

More detailed instructions on how to enable Azure Write Accelerator can be found in the article [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator).

Details and restrictions for Azure Write Accelerator can be found in the same documentation.

**Recommendation: You need to use Write Accelerator for disks forming the /hana/log volume**


## Cost conscious Azure Storage configuration
The following table shows a configuration of VM types that customers also use to host SAP HANA on Azure VMs. There might be some VM types that might not meet all minimum storage criteria for SAP HANA or are not officially supported with SAP HANA by SAP. But so far those VMs seemed to perform fine for non-production scenarios. The **/hana/data** and **/hana/log** are combined to one volume. As a result the usage of Azure Write Accelerator can become a limitation in terms of IOPS.

> [!NOTE]
> For SAP supported scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

> [!NOTE]
> A change from former recommendations for a cost conscious solution, is to move from [Azure Standard HDD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-hdd) to better performing and more reliable [Azure Standard SSD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-ssd)


| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 112 GiB | 768 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E15 |
| E16v3 | 128 GiB | 384 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E15 |
| E32v3 | 256 GiB | 768 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| E64v3 | 432 GiB | 1200 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E30 |
| GS5 | 448 GiB | 2000 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E30 |
| M32ts | 192 GiB | 500 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| M32ls | 256 GiB | 500 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 | 1 x E20 |
| M64ls | 512 GiB | 1000 MB/s | 3 x P20 | 1 x E20 | 1 x E6 | 1 x E6 |1 x E30 |
| M64s | 1000 GiB | 1000 MB/s | 2 x P30 | 1 x E30 | 1 x E6 | 1 x E6 |2 x E30 |
| M64ms | 1750 GiB | 1000 MB/s | 3 x P30 | 1 x E30 | 1 x E6 | 1 x E6 | 3 x E30 |
| M128s | 2000 GiB | 2000 MB/s |3 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | 2 x E40 |
| M128ms | 3800 GiB | 2000 MB/s | 5 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | 2 x E50 |
| M208s_v2 | 2850 GiB | 1000 MB/s | 4 x P30 | 1 x E30 | 1 x E10 | 1 x E6 |  3 x E40 |
| M208ms_v2 | 5700 GiB | 1000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E40 |
| M416s_v2 | 5700 GiB | 2000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E40 |
| M416ms_v2 | 11400 GiB | 2000 MB/s | 8 x P40 | 1 x E30 | 1 x E10 | 1 x E6 |  4 x E50 |


M416xx_v2 VM types are not yet made available by Microsoft to the public. The disks recommended for the smaller VM types with 3 x P20 oversize the volumes regarding the space recommendations according to the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). However the choice as displayed in the table was made to provide sufficient disk throughput for SAP HANA. If you need changes to the **/hana/backup** volume, which was sized for keeping backups that represent twice the memory volume, feel free to adjust.   
Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type. 

> [!NOTE]
> The configurations above would NOT benefit from [Azure virtual machine single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_6/) since it does use a mixture of Azure Premium Storage and Azure Standard Storage. However, the selection was chosen in order to optimize costs. You would need to choose Premium Storage for all the disks above that listed as Azure Standard Storage (Sxx) to make the VM configuration compliant with the Azure single VM SLA.


> [!NOTE]
> The disk configuration recommendations stated are targeting minimum requirements SAP expresses towards  their infrastructure providers. In real customer deployments and workload scenarios, situations were encountered where these recommendations still did not provide sufficient capabilities. These could be situations where a customer required a faster reload of the data after a HANA restart or where backup configurations required higher bandwidth to the storage. Other cases included **/hana/log** where 5000 IOPS were not sufficient for the specific workload. So take these recommendations as a starting point and adapt based on the requirements of the workload.
>  

## Azure Ultra SSD storage configuration for SAP HANA
Microsoft is in the process of introducing a new Azure storage type called [Azure Ultra SSD](https://azure.microsoft.com/updates/ultra-ssd-new-azure-managed-disks-offering-for-your-most-latency-sensitive-workloads/). The big difference between Azure storage offered so far and Ultra SSD is that the disk capabilities are not bound to the disk size anymore. As a customer you can define these capabilities for Ultra SSD:

- Size of a disk ranging from 4 GiB to 65,536 GiB
- IOPS range from 100 IOPS to 160K IOPS (maximum depends on VM types as well)
- Storage throughput from 300 MB/sec to 2,000 MB/sec

For details look up the article [Announcing Ultra SSD – the next generation of Azure Disks technology (preview)](https://azure.microsoft.com/blog/announcing-ultra-ssd-the-next-generation-of-azure-disks-technology-preview/)

UltraSSD gives you the possibility to define a single disk that fulfills your size, IOPS, and disk throughput range. Instead of using logical volume managers like LVM or MDADM on top of Azure Premium Storage to construct volumes that fulfill IOPS and storage throughput requirements. You can run a configuration mix between UltraSSD and Premium Storage. As a result, you can limit the usage of UltraSSD to the performance critical /hana/data and /hana/log volumes and cover the other volumes with Azure Premium Storage

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data volume | /hana/data I/O throughput | /hana/data IOPS | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M32ts | 192 GiB | 500 MB/s | 250 GB | 500 MBps | 7500 | 256 GB | 500 MBps  | 2000 |
| M32ls | 256 GiB | 500 MB/s | 300 GB | 500 MBps | 7500 | 256 GB | 500 MBps  | 2000 |
| M64ls | 512 GiB | 1000 MB/s | 600 GB | 500 MBps | 7500 | 512 GB | 500 MBps  | 2000 |
| M64s | 1000 GiB | 1,000 MB/s |  1200 GB | 500 MBps | 7500 | 512 GB | 500 MBps  | 2000 |
| M64ms | 1750 GiB | 1,000 MB/s | 2100 GB | 500 MBps | 7500 | 512 GB | 500 MBps  | 2000 |
| M128s | 2000 GiB | 2,000 MB/s |2400 GB | 1200 MBps |9000 | 512 GB | 800 MBps  | 2000 | 
| M128ms | 3800 GiB | 2,000 MB/s | 4800 GB | 1200 MBps |9000 | 512 GB | 800 MBps  | 2000 | 
| M208s_v2 | 2850 GiB | 1,000 MB/s | 3500 GB | 1000 MBps | 9000 | 512 GB | 500 MBps  | 2000 | 
| M208ms_v2 | 5700 GiB | 1,000 MB/s | 7200 GB | 1000 MBps | 9000 | 512 GB | 500 MBps  | 2000 | 
| M416s_v2 | 5700 GiB | 2,000 MB/s | 7200 GB | 1500M Bps | 9000 | 512 GB | 800 MBps  | 2000 | 
| M416ms_v2 | 11400 GiB | 2,000 MB/s | 14400 GB | 1500 MBps | 9000 | 512 GB | 800 MBps  | 2000 |   

M416xx_v2 VM types are not yet made available by Microsoft to the public. The values listed are intended to be a starting point and need to be evaluated against the real demands. The advantage with Azure Ultra SSD is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.   

> [!NOTE]
> So far, storage snapshots with UltraSSD storage is not available. This blocks the usage of VM snapshots with Azure Backup Services

## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview).