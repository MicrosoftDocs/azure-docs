---
title: Lsv2-series - Azure Virtual Machines
description: Specifications for the Lsv2-series VMs.
author: sasha-melamed
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/03/2020
ms.author: jushiman
---

# Lsv2-series

The Lsv2-series features high throughput, low latency, directly mapped local NVMe storage running on the [AMD EPYC<sup>TM</sup> 7551 processor](https://www.amd.com/en/products/epyc-7000-series) with an all core boost of 2.55GHz and a max boost of 3.0GHz. The Lsv2-series VMs come in sizes from 8 to 80 vCPU in a simultaneous multi-threading configuration.  There is 8 GiB of memory per vCPU, and one 1.92TB NVMe SSD M.2 device per 8 vCPUs, with up to 19.2TB (10x1.92TB) available on the L80s v2.

> [!NOTE]
> The Lsv2-series VMs are optimized to use the local disk on the node attached directly to the VM rather than using durable data disks. This allows for greater IOPs / throughput for your workloads. The Lsv2 and Ls-series do not support the creation of a local cache to increase the IOPs achievable by durable data disks.
>
> The high throughput and IOPs of the local disk makes the Lsv2-series VMs ideal for NoSQL stores such as Apache Cassandra and MongoDB which replicate data across multiple VMs to achieve persistence in the event of the failure of a single VM.
>
> To learn more, see Optimize performance on the Lsv2-series virtual machines for [Windows](../virtual-machines/windows/storage-performance.md) or [Linux](../virtual-machines/linux/storage-performance.md).  

ACU: 150-175

Bursting: Supported

Premium Storage: Supported

Premium Storage caching: Not Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Memory (GiB) | Temp disk<sup>1</sup> (GiB) | NVMe Disks<sup>2</sup> | NVMe Disk throughput<sup>3</sup> (Read IOPS/MBps) | Uncached data disk throughput (IOPs/MBps)<sup>4</sup> | Max burst uncached data disk throughput (IOPs/MBps)<sup>5</sup>| Max Data Disks | Max NICs / Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_L8s_v2   |  8 |  64 |  80 |  1x1.92 TB  | 400000/2000  | 8000/160   | 8000/1280 | 16 | 2 / 3200   |
| Standard_L16s_v2  | 16 | 128 | 160 |  2x1.92 TB  | 800000/4000  | 16000/320  | 16000/1280 | 32 | 4 / 6400   |
| Standard_L32s_v2  | 32 | 256 | 320 |  4x1.92 TB  | 1.5M/8000    | 32000/640  | 32000/1280 | 32 | 8 / 12800  |
| Standard_L48s_v2  | 48 | 384 | 480 |  6x1.92 TB  | 2.2M/14000   | 48000/960  | 48000/2000 | 32 | 8 / 16000+ |
| Standard_L64s_v2  | 64 | 512 | 640 |  8x1.92 TB  | 2.9M/16000   | 64000/1280 | 64000/2000 | 32 | 8 / 16000+ |
| Standard_L80s_v2<sup>6</sup> | 80 | 640 | 800 | 10x1.92TB | 3.8M/20000 | 80000/1400 | 80000/2000 | 32 | 8 / 16000+ |

<sup>1</sup> Lsv2-series VMs have a standard SCSI based temp resource disk for OS paging/swap file use (D: on Windows, /dev/sdb on Linux). This disk provides 80 GiB of storage, 4,000 IOPS, and 80 MBps transfer rate for every 8 vCPUs (e.g. Standard_L80s_v2 provides 800 GiB at 40,000 IOPS and 800 MBPS). This ensures the NVMe drives can be fully dedicated to application use. This disk is Ephemeral, and all data will be lost on stop/deallocate.

<sup>2</sup> Local NVMe Disks are ephemeral, data will be lost on these disks if you stop/deallocate your VM.

<sup>3</sup> Hyper-V NVMe Direct technology provides unthrottled access to local NVMe drives mapped securely into the guest VM space.  Achieving maximum performance requires using either the latest WS2019 build or Ubuntu 18.04 or 16.04 from the Azure Marketplace.  Write performance varies based on IO size, drive load, and capacity utilization.

<sup>4</sup> Lsv2-series VMs do not provide host cache for data disk as it does not benefit the Lsv2 workloads.  However, Lsv2 VMs can accommodate Azure’s Ephemeral VM OS disk option (up to 30 GiB).

<sup>5</sup> Lsv2-series VMs can [burst](linux/disk-bursting.md) their disk performance for up to 30 minutes at a time. 

<sup>6</sup> VMs with more than 64 vCPUs require one of these supported guest operating systems:

- Windows Server 2016 or later
- Ubuntu 16.04 LTS or later, with Azure tuned kernel (4.15 kernel or later)
- SLES 12 SP2 or later
- RHEL or CentOS version 6.7 through 6.10, with Microsoft-provided LIS package 4.3.1 (or later) installed
- RHEL or CentOS version 7.3, with Microsoft-provided LIS package 4.2.1 (or later) installed
- RHEL or CentOS version 7.6 or later
- Oracle Linux with UEK4 or later
- Debian 9 with the backports kernel, Debian 10 or later
- CoreOS with a 4.14 kernel or later

## Size table definitions

- Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- If you want to get the best performance for your VMs, you should limit the number of data disks to 2 disks per vCPU.
- **Expected network bandwidth** is the maximum aggregated [bandwidth allocated per VM type](../virtual-network/virtual-machine-network-throughput.md) across all NICs, for all destinations. Upper limits are not guaranteed, but are intended to provide guidance for selecting the right VM type for the intended application. Actual network performance will depend on a variety of factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimizing network throughput for Windows and Linux](../virtual-network/virtual-network-optimize-network-bandwidth.md). To achieve the expected network performance on Linux or Windows, it may be necessary to select a specific version or optimize your VM. For more information, see [How to reliably test for virtual machine throughput](../virtual-network/virtual-network-bandwidth-testing.md).

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
