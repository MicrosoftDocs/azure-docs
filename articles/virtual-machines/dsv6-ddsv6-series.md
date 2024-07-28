---
title: Dsv6 and Ddsv6-series
description: Specifications for Dsv6 and Ddsv6-series
author:      misha-bansal # GitHub alias
ms.author:   mishabansal # Microsoft alias
ms.service: virtual-machines
ms.topic: feature-availability
ms.date:     07/17/2024
ms.subservice: sizes
---

# Dsv6 and Ddsv6-series (Preview)

Applies to ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 


>[!NOTE]
>Azure Virtual Machine Series Dsv6 and Ddsv6 are currently in **Preview**. See the [Preview Terms Of Use | Microsoft Azure](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

The new Dsv6 and Ddsv6 Virtual Machine (VM) series only works on OS images that are tagged with NVMe support.  If your current OS image is not supported for NVMe, an error message is shown. NVMe support is available in 50+ of the most popular OS images, and we continuously improve the OS image coverage. Refer to our up-to-date [**lists**](/azure/virtual-machines/enable-nvme-interface) for information on which OS images are tagged as NVMe supported.  For more information on NVMe enablement, see our [**FAQ**](/azure/virtual-machines/enable-nvme-faqs).

The new Dsv6 and Ddsv6 VM series virtual machines public preview is now available. To get more information or sign up for the preview, visit our announcement and follow the link to the sign-up form. This is an opportunity to experience our latest innovation.

The Dsv6-series and Ddsv6-series Virtual Machines run on the 5<sup>th</sup> Generation Intel® Xeon® Platinum 8473C (Emerald Rapids) CPU processor in a  multi-threaded configuration  and the latest DDR5 memory technology, providing a better value proposition for most general-purpose workloads. This new processor features [Intel® Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel® Advanced-Vector Extensions 512 (Intel® AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html) Advanced Matrix Extensions (AMX). The Dsv6 and Ddsv6 VM series offer 4 GiBs of RAM per vCPU to meet the requirements associated with most enterprise workloads including e-commerce systems, web front ends, desktop virtualization solutions, customer relationship management applications, entry-level and mid-range databases, application servers, and more. 

These new Intel based VMs have two variants: Dsv6 without local SSD and Ddsv6 with local SSD.

## Dsv6-series

Dsv6-series virtual machines run on the 5<sup>th</sup> Generation Intel® Xeon® Platinum 8473C (Emerald Rapids) processor reaching an all-core turbo clock speed of 3.0 GHz . These virtual machines offer up to 128 vCPU and 512 GiB of RAM. Dsv6-series virtual machines provide a better performance for most general-purpose workloads compared to the prior generation (for example, increased scalability, upgraded CPU, elevated memory bandwidth, faster remote storage access)

Dsv6-series virtual machines do not have any temporary storage thus lowering the price of entry.  You can attach Standard SSDs, Standard HDDs, Premium SSDs, and Premium SSD V2 disk storage to these virtual machines. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines.

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported <br>[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported <br>Live Migration: Not Supported for Preview <br>Memory Preserving Updates: Supported <br>[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2 <br>[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported <br>[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview<br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

| **Size** | **vCPU** | **Memory: GiB** | **Temp storage (SSD) GiB** | **Max data disks** | **Max temp storage throughput: IOPS/MBPS (RR)** | **Max temp storage throughput:  IOPS/MBPS (RW)** | **Max** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max burst** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max burst** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Network bandwidth** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Standard_D2s_v6** | 2 | 8 | 0 | 8 | NA | NA | 3750/106 | 40000/1250 | 4167/124 | 44444/1463 | 2 | 12500 |
| **Standard_D4s_v6** | 4 | 16 | 0 | 12 | NA | NA | 6400/212 | 40000/1250 | 8333/248 | 52083/1463 | 2 | 12500 |
| **Standard_D8s_v6** | 8 | 32 | 0 | 24 | NA | NA | 12800/424 | 40000/1250 | 16667/496 | 52083/1463 | 4 | 12500 |
| **Standard_D16s_v6** | 16 | 64 | 0 | 48 | NA | NA | 25600/848 | 40000/1250 | 33333/992 | 52083/1463 | 8 | 12500 |
| **Standard_D32s_v6** | 32 | 128 | 0 | 64 | NA | NA | 51200/1696 | 80000/1696 | 66667/1984 | 104167/1984 | 8 | 16000 |
| **Standard_D48s_v6** | 48 | 192 | 0 | 64 | NA | NA | 76800/2544 | 80000/2544 | 100000/2976 | 104167/2976 | 8 | 24000 |
| **Standard_D64s_v6** | 64 | 256 | 0 | 64 | NA | NA | 102400/3392 | 102400/3392 | 133333/3969 | 133333/3969 | 8 | 30000 |
| **Standard_D96s_v6** | 96 | 384 | 0 | 64 | NA | NA | 153600/5088 | 153600/5088 | 200000/5953 | 200000/5953 | 8 | 41000 |
| **Standard_D128s_v6** | 128 | 512 | 0 | 64 | NA | NA | 204800/6782 | 204800/6782 | 266667/7935 | 266667/7935 | 8 | 54000 |

## Ddsv6-series

Ddsv6-series virtual machines run on the 5<sup>th</sup> Generation Intel® Xeon® Platinum 8473C (Emerald Rapids) processor reaching an all- core turbo clock speed of 3.0 GHz. These virtual machines offer up to 128 vCPU and 512 GiB of RAM. Ddsv6-series virtual machines provide a better performance for most general-purpose workloads compared to the prior generation (for example, increased scalability, upgraded CPU, elevated memory bandwidth, faster NVMe local and remote storage access, larger local storage capacity)

Ddsv6-series virtual machines offer local storage disks. You can attach Standard SSDs, Standard HDDs, Premium SSDs, and Premium SSD V2 disk storage to these virtual machines. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines.

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported <br>[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported <br>[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview <br>[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported <br>[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2<br>[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported <br>[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

| **Size** | **vCPU** | **Memory: GiB** | **Temp storage (SSD) GiB** | **Max data disks** | **Max temp storage throughput: IOPS/MBPS (RR)** | **Max temp storage throughput:  IOPS/MBPS (RW)** | **Max** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max burst** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max burst** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Network bandwidth** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Standard_D2ds_v6** | 2 | 8 | 1x110 | 8 | 37500/180 | 15000/90 | 3750/106 | 40000/1250 | 4167/124 | 44444/1463 | 2 | 12500 |
| **Standard_D4ds_v6** | 4 | 16 | 1x220 | 12 | 75000/360 | 30000/180 | 6400/212 | 40000/1250 | 8333/248 | 52083/1463 | 2 | 12500 |
| **Standard_D8ds_v6** | 8 | 32 | 1x440 | 24 | 150000/720 | 60000/360 | 12800/424 | 40000/1250 | 16667/496 | 52083/1463 | 4 | 12500 |
| **Standard_D16ds_v6** | 16 | 64 | 2x440 | 48 | 300000/1440 | 120000/720 | 25600/848 | 40000/1250 | 33333/992 | 52083/1463 | 8 | 12500 |
| **Standard_D32ds_v6** | 32 | 128 | 4x440 | 64 | 600000/2880 | 240000/1440 | 51200/1696 | 80000/1696 | 66667/1984 | 104167/1984 | 8 | 16000 |
| **Standard_D48ds_v6** | 48 | 192 | 6x440 | 64 | 900000/4320 | 360000/2160 | 76800/2544 | 80000/2544 | 100000/2976 | 104167/2976 | 8 | 24000 |
| **Standard_D64ds_v6** | 64 | 256 | 4x880 | 64 | 1200000/5760 | 480000/2880 | 102400/3392 | 102400/3392 | 133333/3969 | 133333/3969 | 8 | 30000 |
| **Standard_D96ds_v6** | 96 | 384 | 6x880 | 64 | 1800000/8640 | 720000/4320 | 153600/5088 | 153600/5088 | 200000/5953 | 200000/5953 | 8 | 41000 |
| **Standard_D128ds_v6** | 128 | 512 | 4x1760 | 64 | 2400000/11520 | 960000/5760 | 204800/6782 | 204800/6782 | 266667/7935 | 266667/7935 | 8 | 54000 |

## Size table definitions

Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.

Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.

Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**. For uncached data disk operation, the host cache mode is set to **None**.

To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](/azure/virtual-machines/disks-performance).

**Expected network bandwidth** is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](/azure/virtual-network/virtual-machine-network-throughput).

Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance depends on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](/azure/virtual-network/virtual-network-optimize-network-bandwidth). To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](/azure/virtual-network/virtual-network-bandwidth-testing).

