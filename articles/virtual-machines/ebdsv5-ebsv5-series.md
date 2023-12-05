---
title: Ebdsv5 and Ebsv5 series 
description: Specifications for the Ebdsv5-series and Ebsv5-series Azure virtual machines.
author: priyashan-19
ms.author: priyashan
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/05/2022
ms.custom: references_regions
---

# Ebdsv5 and Ebsv5 series 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The memory-optimized Ebsv5 and Ebdsv5 Azure virtual machine (VM) series deliver higher remote storage performance in each VM size than the [Ev4 series](ev4-esv4-series.md). The increased remote storage performance of the Ebsv5 and Ebdsv5 VMs is ideal for storage throughput-intensive workloads. For example, relational databases and data analytics applications.  

The Ebsv5 and Ebdsv5 VMs offer up to 260000 IOPS and 8000 MBps of remote disk storage throughput. Both series also include up to 672 GiB of RAM. The Ebdsv5 series has local SSD storage up to 3800 GiB. Both series provide a 3X increase in remote storage performance of data-intensive workloads compared to prior VM generations. You can use these series to consolidate existing workloads on fewer VMs or smaller VM sizes while achieving potential cost savings. The Ebdsv5 series comes with a local disk and Ebsv5 is without a local disk. We recommend choosing Premium SSD, Premium SSD v2 or Ultra disks to attain the published disk performance.

The Ebdsv5 and Ebsv5 series run on the Intel® Xeon® Platinum 8370C (Ice Lake) processors in a hyper-threaded configuration. The series are ideal for various memory-intensive enterprise applications. They feature:

- Up to 512 GiB of RAM
- [Intel® Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html)
- [Intel® Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html)
- [Intel® Advanced Vector Extensions 512 (Intel® AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html)
- Support for [Intel® Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html) 
- NVMe interface for higher remote disk storage IOPS and throughput performance 

> [!IMPORTANT]
> - Accelerated networking is required and turned on by default on all Ebsv5 and Ebdsv5 VMs. 
> - Ebsv5 and Ebdsv5-series VMs can [burst their disk performance](disk-bursting.md) and get up to their bursting max for up to 30 minutes at a time.
> - The E112i size is offered as NVMe only to provide the highest IOPS and throughput performance. If you wish to achieve higher remote storage performance for small sizes, refer to the [instructions](enable-nvme-interface.md) on how to switch to the NVMe interface for sizes ranging from 2-96 vCPU. See the NVMe VM spec table to see the improved performance details.
> - Please note that the NVMe capability is only available in the following regions: US North, Southeast Asia, West Europe, Australia East, North Europe, West US 3, UK South, Sweden Central, East US, Central US, West US2, East US 2, South Central US. 

## Ebdsv5 series

Ebdsv5-series sizes run on the Intel® Xeon® Platinum 8370C (Ice Lake) processors. The Ebdsv5 VM sizes feature up to 672 GiB of RAM, in addition to fast and large local SSD storage (up to 3800 GiB). These VMs are ideal for memory-intensive enterprise applications and applications that benefit from high remote storage performance, low latency, high-speed local storage. Remote Data disk storage is billed separately from VMs. 

- [Premium Storage](premium-storage-performance.md): Supported
- [Premium Storage caching](premium-storage-performance.md): Supported
- [Live Migration](maintenance-and-updates.md): Supported
- [Memory Preserving Updates](maintenance-and-updates.md): Supported
- [VM Generation Support](generation-2.md): Generation 1 and Generation 2
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported (required)
- [Ephemeral OS Disks](ephemeral-os-disks.md): Supported
- Nested virtualization: Supported
- NVMe Interface: Supported only on Generation 2 VMs
- SCSI Interface: Supported on Generation 1 and 2 VMs

## Ebdsv5 Series (SCSI)
| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / MBps | Max uncached Premium SSD disk throughput: IOPS/MBps  | Max burst uncached Premium SSD disk throughput: IOPS/MBps  | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max NICs | Network bandwidth |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Standard_E2bds_v5 | 2 | 16 | 75 | 4 | 9000/125 | 5500/156 | 10000/1200 | 7370/156 | 15000/1200 | 2 | 12500 |
| Standard_E4bds_v5 | 4 | 32 | 150 | 8 | 19000/250 | 11000/350 | 20000/1200 | 14740/350|30000/1200 | 2 | 12500 |
| Standard_E8bds_v5 | 8 | 64 | 300 | 16 | 38000/500 | 22000/625 | 40000/1200 |29480/625 |60000/1200 | 4 | 12500 |
| Standard_E16bds_v5 | 16 | 128 | 600 | 32 | 75000/1000 | 44000/1250 | 64000/2000 |58960/1250 |96000/2000 |  8 | 12500 |
| Standard_E32bds_v5 | 32 | 256 | 1200 | 32 | 150000/2000 | 88000/2500 | 120000/4000 | 117920/2500|160000/4000|  8 | 16000 | 
| Standard_E48bds_v5 | 48 | 384 | 1800 | 32 | 225000/3000 | 120000/4000 | 120000/4000 | 160000/4000|160000/4000 | 8 | 16000 | 
| Standard_E64bds_v5 | 64 | 512 | 2400 | 32 | 300000/4000 | 120000/4000 | 120000/4000 |160000/4000 | 160000/4000| 8 | 20000 |
| Standard_E96bds_v5 | 96 | 672 | 3600 | 32 | 450000/4000 | 120000/4000 | 120000/4000 |160000/4000 | 160000/4000| 8 | 25000 |

## Ebdsv5 Series (NVMe)
| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / MBps | Max uncached Premium SSD  disk throughput: IOPS/MBps  | Max burst uncached Premium SSD disk throughput: IOPS/MBps  | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max NICs | Network bandwidth |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Standard_E2bds_v5 | 2 | 16 | 75 | 4 | 9000/125 | 5500/156 | 10000/1200 | 7370/156 | 15000/1200 | 2 | 12500 |
| Standard_E4bds_v5 | 4 | 32 | 150 | 8 | 19000/250 | 11000/350 | 20000/1200 | 14740/350|30000/1200 | 2 | 12500 |
| Standard_E8bds_v5 | 8 | 64 | 300 | 16 | 38000/500 | 22000/625 | 40000/1200 |29480/625 |60000/1200 | 4 | 12500 |
| Standard_E16bds_v5 | 16 | 128 | 600 | 32 | 75000/1000 | 44000/1250 | 64000/2000 |58960/1250 |96000/2000 |  8 | 12500 |
| Standard_E32bds_v5 | 32 | 256 | 1200 | 32 | 150000/2000 | 88000/2500 | 120000/4000 | 117920/2500|160000/4000|  8 | 16000 | 
| Standard_E48bds_v5 | 48 | 384 | 1800 | 32 | 225000/3000 | 132000/4000 | 150000/5000 | 160000/4000|160000/4000 | 8 | 16000 | 
| Standard_E64bds_v5 | 64 | 512 | 2400 | 32 | 300000/4000 | 176000/5000 | 200000/5000 |160000/4000 | 160000/4000| 8 | 20000 |
| Standard_E96bds_v5 | 96 | 672 | 3600 | 32 | 450000/4000 | 260000/7500 | 260000/8000 |260000/6500 | 260000/6500 | 8 | 25000 |
| Standard_E112ibds_v5 | 112| 672 | 3800 | 64 | 450000/4000 | 260000/8000 | 260000/8000 |260000/6500 | 260000/6500| 8 | 40000 |
## Ebsv5 series

Ebsv5-series sizes run on the Intel® Xeon® Platinum 8272CL (Cascade Lake). These VMs are ideal for memory-intensive enterprise applications and applications that benefit from high remote storage performance but with no local SSD storage. Ebsv5-series VMs feature Intel® Hyper-Threading Technology. Remote Data disk storage is billed separately from VMs. 

- [Premium Storage](premium-storage-performance.md): Supported
- [Premium Storage caching](premium-storage-performance.md): Supported
- [Live Migration](maintenance-and-updates.md): Supported
- [Memory Preserving Updates](maintenance-and-updates.md): Supported
- [VM Generation Support](generation-2.md): Generation 1 and Generation 2
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported (required)
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not supported
- Nested virtualization: Supported
- NVMe Interface: Supported only on Generation 2 VMs
- SCSI Interface: Supported on Generation 1 and Generation 2 VMs
## Ebsv5 Series (SCSI)
| Size | vCPU | Memory: GiB | Max data disks |  Max uncached Premium SSD disk throughput: IOPS/MBps  | Max burst uncached Premium SSD disk throughput: IOPS/MBps  | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max NICs | Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_E2bs_v5 | 2 | 16 | 4 | 5500/156 | 10000/1200 | 7370/156|15000/1200 | 2 | 12500 |
| Standard_E4bs_v5 | 4 | 32 | 8 | 11000/350 | 20000/1200 | 14740/350|30000/1200 | 2 | 12500 |
| Standard_E8bs_v5 | 8 | 64 | 16 | 22000/625 | 40000/1200 |29480/625 |60000/1200 | 4 | 12500 |
| Standard_E16bs_v5 | 16 | 128 | 32 | 44000/1250 | 64000/2000 |58960/1250 |96000/2000 | 8 | 12500 
| Standard_E32bs_v5 | 32 | 256 | 32 | 88000/2500 | 120000/4000 |117920/2500 |160000/4000 | 8 | 16000 |
| Standard_E48bs_v5 | 48 | 384 | 32 | 120000/4000 | 120000/4000 | 160000/4000| 160000/4000| 8 | 16000 |
| Standard_E64bs_v5 | 64 | 512 | 32 | 120000/4000 | 120000/4000 | 160000/4000|160000/4000 | 8 | 20000 | 
| Standard_E96bs_v5 | 96 | 672 | 32 | 120000/4000 | 120000/4000 | 160000/4000|160000/4000 | 8 | 25000 |

## Ebsv5 Series (NVMe)
| Size | vCPU | Memory: GiB | Max data disks |  Max uncached Premium SSD disk throughput: IOPS/MBps  | Max burst uncached Premium SSD disk throughput: IOPS/MBps  | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps  | Max NICs | Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_E2bs_v5 | 2 | 16 | 4 | 5500/156 | 10000/1200 | 7370/156|15000/1200 | 2 | 12500 |
| Standard_E4bs_v5 | 4 | 32 | 8 | 11000/350 | 20000/1200 | 14740/350|30000/1200 | 2 | 12500 |
| Standard_E8bs_v5 | 8 | 64 | 16 | 22000/625 | 40000/1200 |29480/625 |60000/1200 | 4 | 12500 |
| Standard_E16bs_v5 | 16 | 128 | 32 | 44000/1250 | 64000/2000 |58960/1250 |96000/2000 | 8 | 12500 
| Standard_E32bs_v5 | 32 | 256 | 32 | 88000/2500 | 120000/4000 |117920/2500 |160000/4000 | 8 | 16000 |
| Standard_E48bs_v5 | 48 | 384 | 32 | 132000/4000 | 150000/5000 | 160000/4000| 160000/4000| 8 | 16000 |
| Standard_E64bs_v5 | 64 | 512 | 32 | 176000/5000 | 200000/5000 | 160000/4000|160000/4000 | 8 | 20000 | 
| Standard_E96bs_v5 | 96 | 672 | 32 | 260000/7500 | 260000/8000 | 260000/6500|260000/6500 | 8 | 25000 |
| Standard_E112ibs_v5 | 112| 672 | 64 | 260000/8000 | 260000/8000 | 260000/6500|260000/6500 | 8 | 40000 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)



## Next steps

- [Enabling NVMe Interface](enable-nvme-interface.md)
- [Enable NVMe FAQs](enable-nvme-faqs.yml)
- Use the Azure [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
