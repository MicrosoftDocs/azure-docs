---
title: Dlsv6 and Dldsv6-series
description: Specifications for the Dlsv6 and Dldsv6-series VMs
author:      misha-bansal
ms.author:   mishabansal
ms.service: virtual-machines
ms.topic: reference
ms.date:     07/16/2024
ms.subservice: sizes
ms.reviewer: wwilliams
---

# Dlsv6 and Dldsv6-series (Preview)

Applies to ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 

> [!NOTE]
> Azure Virtual Machine Series Dsv6 and Ddsv6 are currently in **Preview**. See the [Preview Terms Of Use | Microsoft Azure](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Dlsv6 and Dldsv6-series Virtual Machines runs on Intel® Xeon® Platinum 8473C (Emerald Rapids) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration. This new processor features an all core turbo clock speed of 3.0 GHz with [Intel® Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel® Advanced-Vector Extensions 512 (Intel® AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel® Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). The Dlsv6 and Dldsv6 VM series provides 2GiBs of RAM per vCPU and optimized for workloads that require less RAM per vCPU than standard VM sizes. Target workloads include web servers, gaming, video encoding, AI/ML, and batch processing.

These new Intel based VMs have two variants: Dlsv6 without local SSD and Dldsv6 with local SSD.

## Dlsv6-series

Dlsv6-series virtual machines run on 5<sup>th</sup> Generation Intel® Xeon® Platinum 8473C (Emerald Rapids) CPU processor reaching an all- core turbo clock speed of up to 3.0 GHz. These virtual machines offer up to 128 vCPU and 256 GiB of RAM. These VM sizes can reduce cost when running non-memory intensive applications.

Dlsv6-series virtual machines do not have any temporary storage thus lowering the price of entry. You can attach Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported <br>[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported <br>[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview <br>[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported <br>[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2<br>[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported <br>[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview<br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

| **Size** | **vCPU** | **Memory: GiB** | **Temp storage (SSD) GiB** | **Max data disks** | **Max temp storage throughput: IOPS/MBPS (RR)** | **Max temp storage throughput:  IOPS/MBPS (RW)** | **Max** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max burst** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max burst** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Network bandwidth (Mbps)** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Standard_D2ls_v6** | 2 | 4 | 0 | 8 | NA | NA | 3750/106 | 40000/1250 | 4167/124 | 44444/1463 | 2 | 12500 |
| **Standard_D4ls_v6** | 4 | 8 | 0 | 12 | NA | NA | 6400/212 | 40000/1250 | 8333/248 | 52083/1463 | 2 | 12500 |
| **Standard_D8ls_v6** | 8 | 16 | 0 | 24 | NA | NA | 12800/424 | 40000/1250 | 16667/496 | 52083/1463 | 4 | 12500 |
| **Standard_D16ls_v6** | 16 | 32 | 0 | 48 | NA | NA | 25600/848 | 40000/1250 | 33333/992 | 52083/1463 | 8 | 12500 |
| **Standard_D32ls_v6** | 32 | 64 | 0 | 64 | NA | NA | 51200/1696 | 80000/1696 | 66667/1984 | 104167/1984 | 8 | 16000 |
| **Standard_D48ls_v6** | 48 | 96 | 0 | 64 | NA | NA | 76800/2544 | 80000/2544 | 100000/2976 | 104167/2976 | 8 | 24000 |
| **Standard_D64ls_v6** | 64 | 128 | 0 | 64 | NA | NA | 102400/3392 | 102400/3392 | 133333/3969 | 133333/3969 | 8 | 30000 |
| **Standard_D96ls_v6** | 96 | 192 | 0 | 64 | NA | NA | 153600/5088 | 153600/5088 | 200000/5953 | 200000/5953 | 8 | 41000 |
| **Standard_D128ls_v6** | 128 | 256 | 0 | 64 | NA | NA | 204800/6782 | 204800/6782 | 266667/7935 | 266667/7935 | 8 | 54000 |

## Dldsv6-series

Dldsv6-series virtual machines run on the 5th Generation Intel® Xeon® Platinum 8473C (Emerald Rapids) processor reaching an all- core turbo clock speed of up to 3.0 GHz. These virtual machines offer up to 128 vCPU and 256 GiB of RAM as well as fast, local SSD storage up to 4x1760 GiB. These VM sizes can reduce cost when running non-memory intensive applications.

Dldsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported <br>[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported <br>[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview <br>[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported <br>[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2<br>[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported <br>[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

| **Size** | **vCPU** | **Memory: GiB** | **Temp storage (SSD) GiB** | **Max data disks** | **Max temp storage throughput: IOPS/MBPS (RR)** | **Max temp storage throughput:  IOPS/MBPS (RW)** | **Max** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max burst** **uncached Premium SSD and Standard SSD/HDD disk throughput: IOPS/MBps** | **Max** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max burst** **uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps** | **Max NICs** | **Network bandwidth** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Standard_D2lds_v6** | 2 | 4 | 1x110 | 8 | 37500/180 | 15000/90 | 3750/106 | 40000/1250 | 4167/124 | 44444/1463 | 2 | 12500 |
| **Standard_D4lds_v6** | 4 | 8 | 1x220 | 12 | 75000/360 | 30000/180 | 6400/212 | 40000/1250 | 8333/248 | 52083/1463 | 2 | 12500 |
| **Standard_D8lds_v6** | 8 | 16 | 1x440 | 24 | 150000/720 | 60000/360 | 12800/424 | 40000/1250 | 16667/496 | 52083/1463 | 4 | 12500 |
| **Standard_D16lds_v6** | 16 | 32 | 2x440 | 48 | 300000/1440 | 120000/720 | 25600/848 | 40000/1250 | 33333/992 | 52083/1463 | 8 | 12500 |
| **Standard_D32lds_v6** | 32 | 64 | 4x440 | 64 | 600000/2880 | 240000/1440 | 51200/1696 | 80000/1696 | 66667/1984 | 104167/1984 | 8 | 16000 |
| **Standard_D48lds_v6** | 48 | 96 | 6x440 | 64 | 900000/4320 | 360000/2160 | 76800/2544 | 80000/2544 | 100000/2976 | 104167/2976 | 8 | 24000 |
| **Standard_D64lds_v6** | 64 | 128 | 4x880 | 64 | 1200000/5760 | 480000/2880 | 102400/3392 | 102400/3392 | 133333/3969 | 133333/3969 | 8 | 30000 |
| **Standard_D96lds_v6** | 96 | 192 | 6x880 | 64 | 1800000/8640 | 720000/4320 | 153600/5088 | 153600/5088 | 200000/5953 | 200000/5953 | 8 | 41000 |
| **Standard_D128lds_v6** | 128 | 256 | 4x1760 | 64 | 2400000/11520 | 960000/5760 | 204800/6782 | 204800/6782 | 266667/7935 | 266667/7935 | 8 | 54000 |

## Size table definitions

Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.

Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.

Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**. For uncached data disk operation, the host cache mode is set to **None**.

To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](https://learn.microsoft.com/azure/virtual-machines/disks-performance).

**Expected network bandwidth** is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../virtual-network/virtual-machine-network-throughput.md).

Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](https://learn.microsoft.com/azure/virtual-network/virtual-network-optimize-network-bandwidth). To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](https://learn.microsoft.com/azure/virtual-network/virtual-network-bandwidth-testing)

