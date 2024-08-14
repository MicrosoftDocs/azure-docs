---
title:       Overview of Mbsv3 and Mbdsv3 Series
description:  Overview of Mbsv3 and Mbdsv3 virtual machines
author:      mingjiongz
ms.author:   zhangjay
ms.service:  virtual-machines
# ms.prod:   sizes
ms.topic:    conceptual
ms.date:     07/15/2024
---

# Mbsv3 and Mbdsv3 Series (Public Preview)




The Storage optimized Mbv3 VM (Mbsv3 and Mbdsv3) series are based on the  4th generation Intel® Xeon® Scalable processors and deliver higher remote disk storage performance. These new VM sizes offer up to 650,000 IOPS and 10GBps of remote disk storage throughput Premium SSD v2/Ultra Disk, up to 4TB of RAM. 

The increased remote storage performance of these VMs is ideal for storage throughput-intensive workloads such as relational databases and data analytics applications.  

## Mbsv3 series

| **Size** | **vCPU** | **Memory: GiB** | **Max data disks** | **Max uncached Premium** **SSD  throughput: IOPS/MBps** | **Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Max network bandwidth (Mbps)** |
|---|---|---|---|---|---|---|---|
| **Standard_M16bs_v3** | 16 | 128 | 64 | 44,000/1,000 | 64,000/1,000 | 8 | 8,000 |
| **Standard_M32bs_v3** | 32 | 256 | 64 | 88,000/2,000 | 88,000/2,000 | 8 | 16,000 |
| **Standard_M48bs_v3** | 48 | 384 | 64 | 88,000/2,000 | 120,000/2,000 | 8 | 16,000 |
| **Standard_M64bs_v3** | 64 | 512 | 64 | 88,000/2, 000 | 160,000/2, 000 | 8 | 16,000 |
| **Standard_M96bs_v3** | 96 | 768 | 64 | 260,000/4,000 | 260,000/4,000 | 8 | 25,000 |
| **Standard_M128bs_v3** | 128 | 1024 | 64 | 260,000/4,000 | 400,000/4,000 | 8 | 40,000 |
| **Standard_M176bs_v3** | 176 | 1536 | 64 | 260,000/6,000 | 650,000/6,000 | 8 | 50,000 |
| **Standard_M176bs_3_v3** | 176 | 2796 | 64 | 260,000/8,000 | 650,000/10,000 | 8 | 40,000 |

## Mbdsv3 series

| **Size** | **vCPU** | **Memory: GiB** | **Temp storage (SSD) GiB** | **Max data disks** | **Max temp storage throughput: IOPS/MBps*** | **Max uncached Premium** **SSD  throughput: IOPS/MBps** | **Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Max network bandwidth (Mbps)** |
|---|---|---|---|---|---|---|---|---|---|
| **Standard_M16bds_v3** | 16 | 128 | 400 | 64 | 10,000/100 | 44,000/1,000 | 64,000/1,000 | 8 | 8,000 |
| **Standard_M32bds_v3** | 32 | 256 | 400 | 64 | 20,000/200 | 88,000/2,000 | 88,000/2,000 | 8 | 16,000 |
| **Standard_M48bds_v3** | 48 | 384 | 400 | 64 | 40,000/400 | 88,000/2,000 | 120,000/2,000 | 8 | 16,000 |
| **Standard_M64bds_v3** | 64 | 512 | 400 | 64 | 40,000/400 | 88,000/2,000 | 160,000/2,000 | 8 | 16,000 |
| **Standard_M96bds_v3** | 96 | 768 | 400 | 64 | 40,000/400 | 260,000/4,000 | 260,000/4,000 | 8 | 25,000 |
| **Standard_M128bds_v3** | 128 | 1,024 | 400 | 64 | 160,000/1600 | 260,000/4,000 | 400,000/4,000 | 8 | 40,000 |
| **Standard_M176bds_v3** | 176 | 1,536 | 400 | 64 | 160,000/1600 | 260,000/6,000 | 650,000/6,000 | 8 | 50,000 |
| **Standard_M176bds_3_v3** | 176 | 2796 | 400 | 64 | 160,000/1600 | 260,000/8,000 | 650,000/10,000 | 8 | 40,000 |
| **Standard_M64bds_1_v3** | 64 | 1397 | 3000 | 64 | 40,000/400 | 130,000/6,000 | 160, 000/6,000 | 8 | 20,000 |
| **Standard_M96bds_2_v3** | 96 | 1946 | 4500 | 64 | 40,000/400 | 130,000/8,000 | 260,000/8,000 | 8 | 20,000 |
| **Standard_M128bds_3_v3** | 128 | 2794 | 6000 | 64 | 160,000/1600 | 260,000/8,000 | 400,000/10,000 | 8 | 40,000 |
| **Standard_M176bds_4_v3** | 176 | 3892 | 8000 | 64 | 160,000/1600 | 260,000/8,000 | 650,000/10,000 | 8 | 40,000 |

## Size table definitions

• Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.

• Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.

• IOPS/MBps listed here refer to uncached mode for data disks.

• To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](https://learn.microsoft.com/azure/virtual-machines/disks-performance).

• IOPS spec is defined using common small random block sizes like 4KiB or 8KiB. Maximum IOPS is defined as "up-to" and measured using 4KiB random reads workloads.

• TPUT spec is defined using common large sequential block sizes like 128KiB or 1024KiB. Maximum TPUT is defined as "up-to" and measured using 128KiB sequential reads workloads.

## Other sizes and information

[General purpose](/azure/virtual-machines/sizes-general)

[Memory optimized](/azure/virtual-machines/sizes-memory)

[Storage optimized](/azure/virtual-machines/sizes-storage)

[GPU optimized](/azure/virtual-machines/sizes-gpu)

[High performance compute](/azure/virtual-machines/sizes-hpc)

[Previous generations](/azure/virtual-machines/sizes-previous-gen)

[Deploy a Premium SSD v2 managed disk - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disks-deploy-premium-v2) 

[Ultra disks for VMs - Azure managed disks - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disks-enable-ultra-ssd)
