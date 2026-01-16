---
title: SAP HANA Azure virtual machine Ultra Disk configurations | Microsoft Docs
description: Storage recommendations for SAP HANA using Ultra disk.
author: msjuergent
manager: bburns
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 11/04/2025
ms.author: juergent
ms.custom: H1Hack27Feb2017
# Customer intent: "As an IT administrator managing SAP HANA on Azure, I want to configure Ultra Disk storage for optimal IOPS and throughput, so that I can ensure low latency and high performance for critical data processing workloads."
---

# SAP HANA Azure virtual machine Ultra Disk storage configurations
This document is about HANA storage configurations for Azure Ultra Disk storage as it was introduced as ultra low latency storage for DBMS and other applications that need ultra low latency storage. For general considerations around stripe sizes when using LVM, HANA data volume partitioning or other considerations that are independent of the particular storage type, check these two documents:

- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)


## Azure Ultra disk storage configuration for SAP HANA
Another Azure storage type is called [Azure Ultra disk](/azure/virtual-machines/disks-types#ultra-disks). The significant difference between Azure storage offered so far and Ultra disk is that the disk capabilities aren't bound to the disk size anymore. As a customer you can define these capabilities for Ultra disk:

- Size of a disk ranging from 4 GiB to 65,536 GiB
- IOPS range from 100 IOPS to 160,000 IOPS (maximum depends on VM types as well)
- Storage throughput from 300 MB/sec to 2,000 MB/sec

Ultra disk gives you the possibility to define a single disk that fulfills your size, IOPS, and disk throughput range. Instead of using logical volume managers like LVM or MDADM on top of Azure premium storage to construct volumes that fulfill IOPS and storage throughput requirements. You can run a configuration mix between Ultra disk and premium storage. As a result, you can limit the usage of Ultra disk to the performance critical **/hana/data** and **/hana/log** volumes and cover the other volumes with Azure premium storage

Other advantages of Ultra disk can be the better read latency in comparison to premium storage. The faster read latency can have advantages when you want to reduce the HANA startup times and the subsequent load of the data into memory. Advantages of Ultra disk storage also can be felt when HANA is writing savepoints. 

> [!NOTE]
> Ultra disk might not be present in all the Azure regions. For detailed information where Ultra disk is available and which VM families are supported, check the article [What disk types are available in Azure?](/azure/virtual-machines/disks-types#ultra-disks).

> [!IMPORTANT]
> You have the possibility to define the sector size of Ultra disk as 512 Bytes or 4,096 Bytes. Default sector size is 4,096 Bytes. Tests conducted with HCMT didn't reveal any significant differences in performance and throughput between the different sector sizes. This sector size is different than stripe sizes that you need to define when using a logical volume manager. 

**/hana/data** - Size of 1.2 x VM memory, larger if necessary. See data throughput and IOPS values in the following table. 

**/hana/log**  - Size of 0.5 x VM memory, or 500 GiB if VM larger than 1 TiB memory. See log throughput and IOPS values in the following table. 

**/hana/shared** - Size of 1 x VM memory, or 1 TiB if VM larger than 1 TiB memory. Use default IOPS and throughput as starting configuration. 

## Production recommended storage solution with pure Ultra disk configuration
In this configuration, you keep the **/hana/data** and **/hana/log** volumes separately. The suggested values are derived out of the KPIs that SAP has to certify VM types for SAP HANA and storage configurations as recommended in the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2024/03/146274d3-ae7e-0010-bca6-c68f7e60039b.html).

The recommendations are often exceeding the SAP minimum requirements as stated earlier in this article. The listed recommendations are a compromise between the size recommendations by SAP and the maximum storage throughput the different VM types provide.

> [!NOTE]
> Azure Ultra disk is enforcing a minimum of two IOPS per Gigabyte capacity of a disk

| Virtual machine memory or SKU            | Data throughput         | Data IOPS  | Log throughput | Log IOPS |
| ---                                      | ---                     | ---        | ---            | ---      |
| Below 1 TiB                              |   425 MBps              | 3,000      | 275 MBps       | 3,000    |
| 1 TiB to below 2 TiB                     |   600 MBps              | 5,000      | 300 MBps       | 4,000    |
| 2 TiB to below 4 TiB                     |   800 MBps              | 12,000     | 300 MBps       | 4,000    |
| 4 TiB to below 8 TiB                     | 1,200 MBps<sup>2</sup>  | 20,000     | 400 MBps       | 5,000    |
| M416ms_v2 (11,400 GiB)                   | 1,300 MBps              | 25,000     | 400 MBps       | 5,000    |
| M624(d)s_12_v3 (11,400 GiB)              | 1,300 MBps              | 40,000     | 600 MBps       | 6,000    |
| M832(d)s_12_v3 (11,400 GiB)              | 1,300 MBps              | 40,000     | 600 MBps       | 6,000    |
| M832ixs<sup>1</sup> (14,902 GiB)         | 2,000 MBps              | 40,000     | 600 MBps       | 9,000    |
| M832i(d)s_16_v3 (15,200 GiB)             | 4,000 MBps              | 60,000     | 600 MBps       | 10,000   |
| M832ixs_v2<sup>1</sup>  (23,088 GiB)     | 2,000 MBps<sup>3</sup>  | 60,000     | 600 MBps       | 10,000   |
| M896ixds_32_v3<sup>1</sup> (30,400 GiB)  | 2,000 MBps<sup>3</sup>  | 80,000     | 600 MBps       | 10,000   |
| M1792ixds_32_v3<sup>1</sup> (30,400 GiB) | 2,000 MBps<sup>3</sup>  | 80,000     | 600 MBps       | 10,000   |

<sup>1</sup> VM type not available by default. Contact your Microsoft account team. 

<sup>2</sup> Limit to 1,000 MBps on M208(m)s_v2 virtual machines, due to VM limit. 

<sup>3</sup> Maximum throughput provided by the VM and throughput requirement by SAP HANA workload, especially savepoint activity,  can force you to deploy significant more throughput and IOPS


**The values listed are intended to be a starting point and need to be evaluated against the real demands.** The advantage with Azure Ultra disk is that the values for IOPS and throughput can be adapted without the need to shut down the VM or halting the workload applied to the system.   

> [!NOTE]
> Snapshot functionality with Ultra disk works distinctively different compared to Premium SSD (v1). For more information, see [Instant access snapshots for Azure managed disks](/azure/virtual-machines/disks-instant-access-snapshots?tabs=azure-cli%2Cazure-cli-snapshot-state#snapshots-of-ultra-disks-and-premium-ssd-v2)


## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
