---
title: SAP HANA Azure virtual machine Premium SSD v2 configurations | Microsoft Docs
description: Storage recommendations HANA using Premium SSD v2.
author: msjuergent
manager: bburns
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage, Premium SSD v2'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 12/19/2024
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA Azure virtual machine Premium SSD v2 storage configurations
Premium SSD v2 simplifies the way how you build storage architectures and let's you tailor and adapt the storage capabilities to your workload. Premium SSD v2 allows you to configure and pay for capacity, IOPS (I/O operations per second), and throughput independent of each other. 

For general considerations around stripe sizes when using LVM, HANA data volume partitioning or other considerations that are independent of the particular storage type, check these two documents:

- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)

The suggestions for the storage configurations in this document are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you're not utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage or even start with smaller disk sizes and utilizing online expansion over time. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity, IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your HANA workload.

## Production recommended storage solution based on Azure Premium SSD v2

The recommended starting configurations with Azure Premium SSD v2 for production scenarios look like:

**/hana/data** - Size of 1.2 x VM memory, larger if necessary. See data throughput and IOPS values in the following table. 

**/hana/log**  - Size of 0.5 x VM memory, or 500 GiB if VM larger than 1 TiB memory. See log throughput and IOPS values in the following table. 

**/hana/shared** - Size of1 x VM memory, or 1 TiB if VM larger than 1 TiB memory. Use default IOPS and throughput as starting configuration. 

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
| M832ixs_v2<sup>1</sup>  (23,088 GiB)     | 2,000 MBps              | 60,000     | 600 MBps       | 10,000   |
| M896ixds_32_v3<sup>1</sup> (30,400 GiB)  | 2,000 MBps              | 80,000     | 600 MBps       | 10,000   |
| M1792ixds_32_v3<sup>1</sup> (30,400 GiB) | 2,000 MBps              | 80,000     | 600 MBps       | 10,000   |

<sup>1</sup> VM type not available by default. Contact your Microsoft account team. 

<sup>2</sup> Limit to 1,000 MBps on M208(m)s_v2 virtual machines, due to VM limit. 

See [M family memory optimized VM size series](/azure/virtual-machines/sizes/memory-optimized/m-family) and [E family memory optimized VM size series](/azure/virtual-machines/sizes/memory-optimized/e-family) for details on virtual machine memory and remote storage capabilities.

Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, you need to increase either IOPS, and/or throughput on the individual disks you're using.

Values in the table are given as aggregate total for the filesystem. With 1,200 MB/sec throughput limit on a single Premium SSD v2 disk, you require to use multiple disks and striping for larger VMs. Similarly, when using striping to benefit from the included 125 MB/sec and 3,000 IOPS per disk, split the total between the number of disks.

### Examples when using multiple disks ###

When you look up the price list for Azure managed disks, then it becomes apparent that the cost scheme introduced with Premium SSD v2, gives you two general paths to pursue:

1. You try to simplify your storage architecture by using a single disk for **/hana/data** and **/hana/log** and pay for more IOPS and throughput as needed to achieve the levels we recommend below. With the awareness that a single disk has a throughput ceiling of 1,200 MB/sec and 80,000 IOPS.
2. You want to benefit of the 3,000 IOPS and 125 MB/sec that come for free with each disk. To do so, you would build multiple smaller disks that sum up to the capacity you need and then build a striped volume with a logical volume manager across these multiple disks. Striping across multiple disks would give you the possibility to reduce the IOPS and throughput cost factors. But would result in some more efforts in automating deployments and operating such solutions.

Since we don't want to define which direction you should go, we're leaving the decision to you on whether to take the single disk approach or to take the multiple disk approach. Though keep in mind that the single disk approach can hit its limitations with the 1,200 MB/sec throughput. There might be a point where you need to stretch /hana/data across multiple volumes. Many Azure VMs allow for higher storage throughput that a single Premium SSD v2 disk can provide. Also keep in mind that the capabilities of Azure VMs in providing storage throughput are going to grow over time. And that HANA savepoints are critical and demand high throughput for the **/hana/data** volume.

This table combined with the [prices of IOPS and throughput](https://azure.microsoft.com/pricing/details/managed-disks/) should give you an idea how striping across multiple Premium SSD v2 disks can reduce the costs for the particular storage configuration you're looking at. Based on these calculations, you can decide whether to move ahead with a single disk approach for **/hana/data** and/or **/hana/log**.

| Total filesystem size | Number of disks | Individual disk size | Desired total throughput | Default throughput | Extra throughput provisioned | Desired total IOPS | Default IOPS            | Extra IOPS provisioned    |
| ---                   | ---             | ---                  | ---                      | ---                | ---                          | ---                | ---                     | ---                       |
| 512 GiB               | **`1`**         | 512 GiB              |   425 MBps               | 125 MBps           | + 300 MBps                   |  5,000 IOPS        |  3,000 IOPS             | + 2,000 IOPS              |
| 512 GiB               | **`2`**         | 256 GiB              |   425 MBps               | 250 MBps (2 x 125) | + 175 MBps (2 x 88)          |  5,000 IOPS        |  6,000 IOPS (2 x 3,000) | none                      |
| 512 GiB               | **`4`**         | 128 GiB              |   425 MBps               | 500 MBps (4 x 125) | none                         |  5,000 IOPS        | 12,000 IOPS (4 x 3,000) | none                      |
| ---                   | ---             | ---                  | ---                      | ---                | ---                          | ---                | ---                     | ---                       |
|   4 TiB               | **`1`**         |   4 TiB              | 1,000 MBps               | 125 MBps           | + 875 MBps                   | 20,000 IOPS        |  3,000 IOPS             | + 17,000 IOPS             |
|   4 TiB               | **`2`**         |   2 TiB              | 1,000 MBps               | 250 MBps (2 x 125) | + 750 MBps (2 x 375)         | 20,000 IOPS        |  6,000 IOPS (2 x 3,000) | + 14,000 IOPS (2 x 7,000) |
|   4 TiB               | **`4`**         |   1 TiB              | 1,000 MBps               | 500 MBps (4 x 125) | + 500 MBps (4 x 125)         | 20,000 IOPS        | 12,000 IOPS (4 x 3,000) | +  8,000 IOPS (4 x 2,000) |

> [!NOTE]
> The configurations suggested in this document keep the HANA minimum KPIs, as listed in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) in mind. Our tests so far gave no indications that with the values listed, SAP HCMT tests would fail in throughput or latency. That stated, not all variations possible and combinations around stripe sets stretched across multiple disks or different stripe sizes were tested. Tests conducted with striped volumes across multiple disks were done with the stripe sizes documented in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md). 

> [!IMPORTANT]
> You have the possibility to define the logical sector size of Azure Premium SSD v2 as 512 Bytes or 4096 Bytes. Default sector size is 4096 Bytes. Tests conducted with HCMT did not reveal any significant differences in performance and throughput between the different sector sizes. This sector size is different than [stripe sizes that you need to define when using a logical volume manager](./hana-vm-operations-storage.md#stripe-sizes-when-using-logical-volume-managers).

## Major differences of Premium SSD v2 to Premium SSD and Ultra disk
The major difference of Premium SSD v2 to the existing NetWeaver and HANA certified storages can be listed like:

- With Premium SSD v2, you pay the exact deployed capacity. Unlike with premium disk and Ultra disk, where brackets of sizes are being taken to determine the costs of capacity
- Every Premium SSD v2 storage disk comes with 3,000 IOPS and 125 MB/sec on throughput that is included in the capacity pricing
- Extra IOPS and throughput on top of the default ones that come with each disk can be provisioned at any point in time and are charged separately
- Changes to the provisioned IOPS and throughput can be executed four times in a 24 hour window
- Latency of Premium SSD v2 is lower than premium storage, but higher than Ultra disk. But is submillisecond, so, that it passes the SAP HANA KPIs without the help of any other functionality, like Azure Write Accelerator
- **Like with Ultra disk, you can use Premium SSD v2 for /hana/data and /hana/log volumes without the need of any accelerators or other caches**.
- Like Ultra disk, Azure Premium SSD v2 doesn't offer caching options as Premium SSD does
- With Premium SSD v2, the same storage configuration applies to the HANA certified Ev4, Ev5, and M-series virtual machines (VM) that offer the same memory 
- Unlike Premium SSD, there's no disk or VM bursting for Premium SSD v2

Not having Azure Write Accelerator support or support by other caches makes the configuration of Premium SSD v2 for the different VM families easier and more unified and avoid variations that need to be considered in deployment automation. Not having bursting capabilities makes throughput and IOPS delivered more deterministic and reliable. Since Premium SSD v2 is a new storage type, there are still some restrictions related to its features and capabilities. To read up on these limitations and differences between the different storages, start with reading the document [Azure managed disk types](/azure/virtual-machines/disks-types).

## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
