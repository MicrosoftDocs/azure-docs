---
title: SAP HANA Azure virtual machine Ultra Disk configurations | Microsoft Docs
description: Storage recommendations for SAP HANA using Ultra disk.
author: msjuergent
manager: bburns
tags: azure-resource-manager
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 08/30/2023
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA Azure virtual machine Ultra Disk storage configurations
This document is about HANA storage configurations for Azure Ultra Disk storage as it was introduced as ultra low latency storage for DBMS and other applications that need ultra low latency storage. For general considerations around stripe sizes when using LVM, HANA data volume partitioning or other considerations that are independent of the particular storage type, check these two documents:

- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)


## Azure Ultra disk storage configuration for SAP HANA
Another Azure storage type is called [Azure Ultra disk](../../virtual-machines/disks-types.md#ultra-disks). The significant difference between Azure storage offered so far and Ultra disk is that the disk capabilities aren't bound to the disk size anymore. As a customer you can define these capabilities for Ultra disk:

- Size of a disk ranging from 4 GiB to 65,536 GiB
- IOPS range from 100 IOPS to 160,000 IOPS (maximum depends on VM types as well)
- Storage throughput from 300 MB/sec to 2,000 MB/sec

Ultra disk gives you the possibility to define a single disk that fulfills your size, IOPS, and disk throughput range. Instead of using logical volume managers like LVM or MDADM on top of Azure premium storage to construct volumes that fulfill IOPS and storage throughput requirements. You can run a configuration mix between Ultra disk and premium storage. As a result, you can limit the usage of Ultra disk to the performance critical **/hana/data** and **/hana/log** volumes and cover the other volumes with Azure premium storage

Other advantages of Ultra disk can be the better read latency in comparison to premium storage. The faster read latency can have advantages when you want to reduce the HANA startup times and the subsequent load of the data into memory. Advantages of Ultra disk storage also can be felt when HANA is writing savepoints. 

> [!NOTE]
> Ultra disk might not be present in all the Azure regions. For detailed information where Ultra disk is available and which VM families are supported, check the article [What disk types are available in Azure?](../../virtual-machines/disks-types.md#ultra-disks).

> [!IMPORTANT]
> You have the possibility to define the sector size of Ultra disk as 512 Bytes or 4096 Bytes. Default sector size is 4096 Bytes. Tests conducted with HCMT did not reveal any significant differences in performance and throughput between the different sector sizes. This sector size is different than stripe sizes that you need to define when using a logical volume manager. 

## Production recommended storage solution with pure Ultra disk configuration
In this configuration, you keep the **/hana/data** and **/hana/log** volumes separately. The suggested values are derived out of the KPIs that SAP has to certify VM types for SAP HANA and storage configurations as recommended in the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2017/09/e6519450-d47c-0010-82c7-eda71af511fa.html).

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

> [!NOTE]
> Azure Ultra disk is enforcing a minimum of 2 IOPS per Gigabyte capacity of a disk


| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data volume | /hana/data I/O throughput | /hana/data IOPS | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| E20ds_v4 | 160 GiB | 480 MBps | 200 GB | 400 MBps | 2,500 | 80 GB | 250 MB | 1,800 |
| E32ds_v4 | 256 GiB | 768 MBps | 300 GB | 400 MBps | 2,500 | 128 GB | 250 MBps | 1,800 |
| E48ds_v4 | 384 GiB | 1152 MBps | 460 GB | 400 MBps | 3,000 | 192 GB | 250 MBps | 1,800 |
| E64ds_v4 | 504 GiB | 1200 MBps | 610 GB | 400 MBps | 3,500 |  256 GB | 250 MBps | 1,800 |
| E64s_v3 | 432 GiB | 1,200 MBps | 610 GB | 400 MBps | 3,500 | 220 GB | 250 MB | 1,800 |
| M32ts | 192 GiB | 500 MBps | 250 GB | 400 MBps | 2,500 | 96 GB | 250 MBps  | 1,800 |
| M32ls | 256 GiB | 500 MBps | 300 GB | 400 MBps | 2,500 | 256 GB | 250 MBps  | 1,800 |
| M64ls | 512 GiB | 1,000 MBps | 620 GB | 400 MBps | 3,500 | 256 GB | 250 MBps  | 1,800 |
| M32dms_v2, M32ms_v2 | 875 GiB | 500 MBps |  1,200 GB | 600 MBps | 5,000 | 512 GB | 250 MBps  | 2,500 |
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps |  1,200 GB | 600 MBps | 5,000 | 512 GB | 250 MBps  | 2,500 |
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 2,100 GB | 600 MBps | 5,000 | 512 GB | 250 MBps  | 2,500 |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps |2,400 GB | 750 MBps | 7,000 | 512 GB | 250 MBps  | 2,500 |
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MBps |2,400 GB | 750 MBps | 7,000 | 512 GB | 250 MBps  | 2,500 | 
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 4,800 GB | 750 MBps |9,600 | 512 GB | 250 MBps  | 2,500 | 
| M192idms_v2, M192ims_v2 | 4,096 GiB | 2,000 MBps | 4,800 GB | 750 MBps |9,600 | 512 GB | 250 MBps  | 2,500 | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 3,500 GB | 750 MBps | 7,000 | 512 GB | 250 MBps  | 2,500 | 
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 7,200 GB | 750 MBps | 14,400 | 512 GB | 250 MBps  | 2,500 | 
| M416s_v2 | 5,700 GiB | 2,000 MBps | 7,200 GB | 1,000 MBps | 14,400 | 512 GB | 400 MBps  | 4,000 |
| M416s_8_v2 | 7,600 | 2,000 MBps | 9,500 GB | 1,250 MBps | 20,000 | 512 GB | 400 MBps  | 4,000 |
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 14,400 GB | 1,500 MBps | 28,800 | 512 GB | 400 MBps  | 4,000 |   
| M832isx<sup>1</sup> | 14902 GiB | larger than 2,000 Mbps | 19,200 GB | 2,000 MBps<sup>2</sup> | 40,000 | 512 GB | 600 MBps | 9,000 |
| M832isx_v2<sup>1</sup> | 23088 GiB | larger than 2,000 Mbps | 28,400 GB | 2,000 MBps<sup>2</sup> | 60,000 | 512 GB | 600 MBps | 9,000 |

<sup>1</sup> VM type not available by default. Please contact your Microsoft account team

<sup>2</sup> Maximum throughput provided by the VM and throughput requirement by SAP HANA workload, especially savepoint activity,  can force you to deploy significant more throughput and IOPS


**The values listed are intended to be a starting point and need to be evaluated against the real demands.** The advantage with Azure Ultra disk is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.   

> [!NOTE]
> So far, storage snapshots with Ultra disk storage is not available. This blocks the usage of VM snapshots with Azure Backup Services


## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
