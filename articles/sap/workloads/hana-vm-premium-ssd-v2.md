---
title: SAP HANA Azure virtual machine Premium SSD v2 configurations | Microsoft Docs
description: Storage recommendations HANA using Premium SSD v2.
author: msjuergent
manager: bburns
tags: azure-resource-manager
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage, Premium SSD v2'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 03/27/2023
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA Azure virtual machine Premium SSD v2 storage configurations
This document is about HANA storage configurations for Azure Premium SSD v2. Azure Premium SSD v2 is a new storage that was developed to more flexible block storage with submillisecond latency for general purpose and DBMS workload. Premium SSD v2 simplifies the way how you build storage architectures and let's you tailor and adapt the storage capabilities to your workload. Premium SSD v2 allows you to configure and pay for capacity, IOPS, and throughput independent of each other. 

For general considerations around stripe sizes when using LVM, HANA data volume partitioning or other considerations that are independent of the particular storage type, check these two documents:

- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)


> [!IMPORTANT]
> The suggestions for the storage configurations in this document are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you're not utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage then. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity, IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your HANA workload.

## Major differences of Premium SSD v2 to premium storage and Ultra disk
The major difference of Premium SSD v2 to the existing netWeaver and HANA certified storages can be listed like:

- With Premium SSD v2, you pay the exact deployed capacity. Unlike with premium disk and Ultra disk, where brackets of sizes are being taken to determine the costs of capacity
- Every Premium SSD v2 storage disk comes with 3,000 IOPS and 125 MBps on throughput that is included in the capacity pricing
- Extra IOPS and throughput on top of the default ones that come with each disk can be provisioned at any point in time and are charged separately
- Changes to the provisioned IOPS and throughput can be executed once in 6 hours
- Latency of Premium SSD v2 is lower than premium storage, but higher than Ultra disk. But is submilliseconds, so, that it passes the SAP HANA KPIs without the help of any other functionality, like Azure Write Accelerator
- **Like with Ultra disk, you can use Premium SSD v2 for /hana/data and /hana/log volumes without the need of any accelerators or other caches**.
- Like Ultra disk, Azure Premium SSD doesn't offer caching options as premium storage does
- With Premium SSD v2, the same storage configuration applies to the HANA certified Ev4, Ev5, and M-series VMs that offer the same memory 
- Unlike premium storage, there's no disk bursting for Premium SSD v2

Not having Azure Write Accelerator support or support by other caches makes the configuration of Premium SSD v2 for the different VM families easier and more unified and avoid variations that need to be considered in deployment automation. Not having bursting capabilities makes throughput and IOPS delivered more deterministic and reliable. Since Premium SSD v2 is a new storage type, there are still some restrictions related to its features and capabilities. to read up on these limitations and differences between the different storages, start with reading the document [Azure managed disk types](../../virtual-machines/disks-types.md).


## Production recommended storage solution based on Azure premium storage

> [!NOTE]
> The configurations suggested below keep the HANA minimum KPIs, as listed in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) in mind. Our tests so far gave no indications that with the values listed, SAP HCMT tests would fail in throughput or latency. That stated, not all variations possible and combinations around stripe sets stretched across multiple disks or different stripe sizes were tested. Tests condcuted with striped volumes across multiple disks were done with the stripe sizes documented in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md). 


> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;iaas;ve:24).

When you look up the price list for Azure managed disks, then it becomes apparent that the cost scheme introduced with Premium SSD v2, gives you two general paths to pursue:

- You try to simplify your storage architecture by using a single disk for **/hana/data** and **/hana/log** and pay for more IOPS and throughput as needed to achieve the levels we recommend below. With the awareness that a single disk has a throughput level of 1,200 MBps and 80,000 IOPS.
- You want to benefit of the 3,000 IOPS and 125MBps that come for free with each disk. To do so, you would build multiple smaller disks that sum up to the capacity you need and then build a striped volume with a logical volume manager across these multiple disks. Striping across multiple disks would give you the possibility to reduce the IOPS and throughput cost factors. But would result in some more efforts in automating deployments and operating such solutions.

Since we don't want to define which direction you should go, we're leaving the decision to you on whether to take the single disk approach or to take the multiple disk approach. Though keep in mind that the single disk approach can hit its limitations with the 1,200MB/sec throughput. There might be a point where you need to stretch /hana/data across multiple volumes. also keep in mind that the capabilities of Azure VMs in providing storage throughput are going to grow over time. And that HANA savepoints are extremely critical and demand high throughput for the **/hana/data** volume

> [!IMPORTANT]
> You have the possibility to define the sector size of Azure Premium SSD v2 as 512 Bytes or 4096 Bytes. All the tests conducted and the certification as storage for SAP HANA were done with a sector size of 4096 Bytes. Therefore, you should make sure that this is the sector size of choice when you deploy disks. This sector size is different than stripe sizes that you need to define when using a logical volume manager.

**Recommendation: The recommended configurations with Azure premium storage for production scenarios look like:**

Configuration for SAP **/hana/data** volume:

| VM SKU | RAM |   Max. VM I/O<br /> Throughput | Max VM IOPS | /hana/data capacity | /hana/data throughput| /hana/data IOPS | 
| --- | --- | --- | --- | --- | --- | --- | 
| E20ds_v4 | 160 GiB | 480 MBps | 32,000 | 192 GB | 425 MBps | 3,000 | 
| E20(d)s_v5| 160 GiB | 750 MBps | 32,000 | 192 GB | 425 MBps | 3,000 | 
| E32ds_v4 | 256 GiB | 769 MBps | 51,200 |  304 GB | 425 MBps | 3,000 | 
| E32ds_v5 | 256 GiB | 865 MBps | 51,200|  304 GB | 425 MBps | 3,000 | 
| E48ds_v4 | 384 GiB | 1,152 MBps | 76,800 |  464 GB |425 MBps | 3,000  | 
| E48ds_v4 | 384 GiB | 1,315 MBps | 76,800 |  464 GB |425 MBps | 3,000  | 
| E64ds_v4 | 504 GiB | 1,200 MBps | 80,000 |  608 GB | 425 MBps | 3,000 |  
| E64(d)s_v5 | 512 GiB | 1,735 MBps | 80,000 |  608 GB| 425 MBps | 3,000 |
| E96(d)s_v5 | 672 GiB | 2,600 MBps | 80,000 |  800 GB | 425 MBps | 3,000 | 
| M32ts | 192 GiB | 500 MBps | 20,000 | 224 GB | 425 MBps | 3,000| 
| M32ls | 256 GiB | 500 MBps | 20,000 | 304 GB | 425 MBps | 3,000 | 
| M64ls | 512 GiB | 1,000 MBps | 40,000 | 608 GB | 425 MBps | 3,000 | 
| M32dms_v2, M32ms_v2 | 875 GiB  | 500 MBps | 30,000 | 1056 GB | 425 MBps | 3,000 | 
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps | 40,000 | 1232 GB | 600 MBps | 5,000 | 
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 50,000 | 2144 GB | 600 MBps | 5,000 |  
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps | 80,000 | 2464 GB | 800 MBps | 12,000| 
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MBps | 80,000| 2464 GB | 800 MBps | 12,000| 
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 80,000 | 4672 GB | 800 MBps | 12,000 | 
| M192ims, M192idms_v2 | 4,096 GiB | 2,000 MBps | 80,000 | 4912 GB | 800 MBps | 12,000 | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 40,000 | 3424 GB | 1,000 MBps| 15,000 | 
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 40,000 | 6,848 GB | 1,000 MBps | 15,000 | 
| M416s_v2 | 5,700 GiB | 2,000 MBps | 80,000 | 6,848 GB | 1,200 MBps| 17,000 | 
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 80,000 | 13,680 GB | 1,200 MBps| 25,000 | 


For the **/hana/log** volume. the configuration would look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | Max VM IOPS | **/hana/log** capacity | **/hana/log** throughput | **/hana/log** IOPS | **/hana/shared** capacity <br />using default IOPS <br /> and throughput |
| --- | --- | --- | --- | --- | --- | --- | 
| E20ds_v4 | 160 GiB | 480 MBps | 32,000 | 80 GB | 275 MBps | 3,000 | 160 GB |
| E20(d)s_v5 | 160 GiB | 750 MBps | 32,000 | 80 GB | 275 MBps | 3,000 | 160 GB |
| E32ds_v4 | 256 GiB | 768 MBps | 51,200 | 128 GB | 275 MBps | 3,000 | 256 GB | 
| E32(d)s_v5 | 256 GiB | 865 MBps | 51,200 | 128 GB | 275 MBps | 3,000 | 256 GB | 
| E48ds_v4 | 384 GiB | 1,152 MBps | 76,800 | 192 GB | 275 MBps | 3,000 | 384 GB | 
| E48(d)s_v5 | 384 GiB | 1,315 MBps | 76,800 | 192 GB | 275 MBps | 3,000 | 384 GB | 
| E64ds_v4 | 504 GiB | 1,200 MBps | 80,000 | 256 GB | 275 MBps | 3,000 | 504 GB | 
| E64(d)s_v5 | 512 GiB | 1,735 MBps | 80,000 | 256 GB | 275 MBps | 3,000 | 512 GB | 
| E96(d)s_v5 | 672 GiB | 2,600 MBps | 80,000 | 512 GB | 275 MBps | 3,000 | 672 GB |
| M32ts | 192 GiB | 500 MBps | 20,000 | 96 GB | 275 MBps | 3,000 | 192 GB | 
| M32ls | 256 GiB | 500 MBps | 20,000 | 128 GB | 275 MBps | 3,000 | 256 GB | 
| M64ls | 512 GiB | 1,000 MBps | 40,000 | 256 GB | 275 MBps | 3,000 | 512 GB | 
| M32dms_v2, M32ms_v2 | 875 GiB | 500 MBps | 20,000 | 512 GB | 275 MBps | 3,000 | 875 GB | 
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps | 40,000 | 512 GB | 275 MBps | 3,000 | 1,024 GB |
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 40,000 | 512 GB | 275 MBps | 3,000 | 1,024 GB | 
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps | 80,000 | 512 GB | 300 MBps | 4,000 | 1,024 GB |
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MBps | 80,000 | 512 GB | 300 MBps | 4,000 | 1,024 GB |
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 80,000 | 512 GB | 300 MBps | 4,000 | 1,024 GB |
| M192idms_v2, M192ims_v2 | 4,096 GiB | 2,000 MBps | 80,000 | 512 GB | 300 MBps | 4,000 | 1,024 GB |
| M208s_v2 | 2,850 GiB | 1,000 MBps | 40,000 | 512 GB | 300 MBps | 4,000 | 1,024 GB |
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 40,000 | 512 GB | 350 MBps | 4,500 | 1,024 GB |
| M416s_v2 | 5,700 GiB | 2,000 MBps | 80,000 | 512 GB | 400 MBps | 5,000 | 1,024 GB |
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 80,000 | 512 GB | 400 MBps | 5,000 | 1,024 GB |


Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase either IOPS, and/or throughput on the individual disks you're using. 

A few examples on how combining multiple Premium SSD v2 disks with a stripe set could impact the requirement to provision more IOPS or throughput for **/hana/data** is displayed in this table:

| VM SKU | RAM | number of <br />disks | individual disk<br /> capacity | Proposed IOPS | Default IOPS provisioned | Extra IOPS <br />provisioned | Proposed throughput<br /> for volume | Default throughput provisioned | Extra throughput <br />provisioned |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E32(d)s_v5 | 256 GiB | 1 | 304 GB | 3,000 | 3,000 | 0 | 425 MBps | 125 MBps | 300 MBps |
| E32(d)s_v5 | 256 GiB | 2 | 152 GB | 3,000 | 6,000 | 0 | 425 MBps | 250 MBps | 175 MBps |
| E32(d)s_v5 | 256 GiB | 4 | 76 GB | 3,000 | 12,000 | 0 | 425 MBps | 500 MBps | 0 MBps |
| E96(d)s_v5 | 672 GiB | 1 | 304 GB | 3,000 | 3,000 | 0 | 425 MBps | 125 MBps | 300 MBps |
| E96(d)s_v5 | 672 GiB | 2 | 152 GB | 3,000 | 6,000 | 0 | 425 MBps | 250 MBps | 175 MBps |
| E96(d)s_v5 | 672 GiB | 4 | 76 GB | 3,000 | 12,000 | 0 | 425 MBps | 500 MBps | 0 MBps |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 1 | 2,464 GB | 12,000 | 3,000 | 9,000 | 800 MBps | 125 MBps | 675 MBps |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2 | 1,232 GB | 12,000 | 6,000 | 6,000 | 800 MBps | 250 MBps | 550 MBps |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 4 | 616 GB | 12,000 | 12,000 | 0 | 800 MBps | 500 MBps | 300 MBps |
| M416ms_v2 | 11,400 GiB | 1 | 13,680 | 25,000 | 3,000 | 22,000 | 1,200 MBps | 125 MBps | 1,075 MBps |
| M416ms_v2 | 11,400 GiB | 2 | 6,840 | 25,000 | 6,000 | 19,000 | 1,200 MBps | 250 MBps | 950 MBps |
| M416ms_v2 | 11,400 GiB | 4 | 3,420 | 25,000 | 12,000 | 13,000 | 1,200 MBps | 500 MBps | 700 MBps |

For **/hana/log**, a similar approach of using two disks could look like:

| VM SKU | RAM | number of <br />disks | individual disk<br /> capacity | Proposed IOPS | Default IOPS provisioned | Extra IOPS <br />provisioned | Proposed throughput<br /> for volume | Default throughput provisioned | Extra throughput <br />provisioned |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E32(d)s_v5 | 256 GiB | 1 | 128 GB | 3,000 | 3,000 | 0 | 275 MBps | 125 MBps | 150 MBps |
| E32(d)s_v5 | 256 GiB | 2 | 64 GB | 3,000 | 6,000 | 0 | 275 MBps | 250 MBps | 25 MBps |
| E96(d)s_v5 | 672 GiB | 1 | 512 GB | 3,000 | 3,000 | 0 | 275 MBps | 125 MBps | 150 MBps |
| E96(d)s_v5 | 672 GiB | 2 | 256 GB | 3,000 | 6,000 | 0 | 275 MBps | 250 MBps | 25 MBps |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 1 | 512 GB | 4,000 | 3,000 | 1,000 | 300 MBps | 125 MBps | 175 MBps |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2 | 256 GB | 4,000 | 6,000 | 0 | 300 MBps | 250 MBps | 50 MBps |
| M416ms_v2 | 11,400 GiB | 1 | 512 GB | 5,000 | 3,000 | 2,000 | 400 MBps | 125 MBps | 275 MBps |
| M416ms_v2 | 11,400 GiB | 2 | 256 GB | 5,000 | 6,000 | 0 | 400 MBps | 250 MBps | 150 MBps |

These tables combined with the [prices of IOPS and throughput](https://azure.microsoft.com/pricing/details/managed-disks/) should give you an idea how striping across multiple Premium SSD v2 disks could reduce the costs for the particular storage configuration you're looking at. Based on these calculations, you can decide whether to move ahead with a single disk approach for **/hana/data** and/or **/hana/log**. 

## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
