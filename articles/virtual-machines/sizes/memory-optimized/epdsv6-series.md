---
title: Epdsv6 size series
description: Information on and specifications of the Epdsv6-series sizes
author: tomvcassidy
ms.service: virtual-machines
ms.subservice: sizes
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: tomcassidy
ms.reviewer: mattmcinnes
---

# Epdsv6 sizes series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Client VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!IMPORTANT]
> Azure Virtual Machine series Epdsv6 is currently in **preview**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> For more information and to sign up for the preview, please [visit our announcement and follow the link to signup](https://aka.ms/Cobalt100-VM-Preview-Signup).

[!INCLUDE [epdsv6-summary](./includes/epdsv6-series-summary.md)]

## Host specifications
[!INCLUDE [epdsv6-series-specs](./includes/epdsv6-series-specs.md)]

## Feature Support
- [Premium Storage](../../premium-storage-performance.md): Supported 
- [Premium Storage caching](../../premium-storage-performance.md): Supported 
- [Live Migration](../../maintenance-and-updates.md): Supported 
- [Memory Preserving Updates](../../maintenance-and-updates.md): Supported 
- [VM Generation Support](../../generation-2.md): Generation 2 
- [Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported 
- [Ephemeral OS Disks](../../ephemeral-os-disks.md): Supported
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not supported

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_E2pds_v6 | 2 | 16 |
| Standard_E4pds_v6 | 4 | 32 |
| Standard_E8pds_v6 | 8 | 64 |
| Standard_E16pds_v6 | 16 | 128 |
| Standard_E32pds_v6 | 32 | 256 |
| Standard_E48pds_v6 | 48 | 384 |
| Standard_E64pds_v6 | 64 | 512 |
| Standard_E96pds_v6 | 96 | 672 |

> [!NOTE]
> The Epdsv6 VM series will only work on OS images that are tagged with NVMe support. If your current OS image is not supported for NVMe, you’ll see an error message. NVMe support is available on the most popular OS images, and we continuously improve the OS image coverage.

#### VM Basics resources
- [What are vCPUs (Qty.)](../../../virtual-machines/managed-disks-overview.md)
- [Check vCPU quotas](../../../virtual-machines/quotas.md)
- [Introduction to Azure compute units (ACUs)](../../../virtual-machines/acu.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage (Qty.) | Temp Storage Size (GiB) | Temp ReadWrite Storage IOPS | Temp ReadWrite Storage Speed (MBps) | Temp ReadOnly Storage IOPS | Temp ReadOnly Storage Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_E2pds_v6 | 1 | 110 | 15000 | 90 | 37500 | 180 |
| Standard_E4pds_v6 | 1 | 220 | 30000 | 180 | 75000 | 360 |
| Standard_E8pds_v6 | 1 | 440 | 60000 | 360 | 150000 | 720 |
| Standard_E16pds_v6 | 2 | 440 | 120000 | 720 | 300000 | 1440 |
| Standard_E32pds_v6 | 4 | 440 | 240000 | 1440 | 600000 | 2880 |
| Standard_E48pds_v6 | 6 | 440 | 360000 | 2160 | 900000 | 4320 |
| Standard_E64pds_v6 | 4 | 880 | 480000 | 2880 | 1200000 | 5760 |
| Standard_E96pds_v6 | 6 | 880 | 720000 | 4320 | 1800000 | 8640 |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly (R-O) or ReadWrite (R-W). For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).

### [Remote Storage](#tab/sizestorageremote)

Remote (uncached) storage info for each size

| Size Name | Max Remote Storage (Qty.) | Uncached Storage IOPS | Uncached Storage Speed (MBps) | Uncached Storage Burst<sup>1</sup> IOPS | Uncached Storage Burst<sup>1</sup> Speed (MBps) | Uncached Special<sup>2</sup> Storage IOPS | Uncached Special<sup>2</sup> Storage Speed (MBps) | Uncached Burst<sup>1</sup> Special<sup>2</sup> Storage IOPS | Uncached Burst<sup>1</sup> Special Storage Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_E2pds_v6 | 8 | 3750 | 106 | 10000 | 1250 | 4163 | 124 | 11100 | 1463 |
| Standard_E4pds_v6 | 12 | 6400 | 212 | 20000 | 1250 | 8333 | 248 | 26040 | 1463 |
| Standard_E8pds_v6 | 24 | 12800 | 424 | 20000 | 1250 | 16666 | 496 | 26040 | 1463 |
| Standard_E16pds_v6 | 48 | 25600 | 848 | 40000 | 1250 | 33331 | 992 | 52080 | 1463 |
| Standard_E32pds_v6 | 64 | 51200 | 1696 | 80000 | 2000 | 66662 | 1984 | 104160 | 2340 |
| Standard_E48pds_v6 | 64 | 76800 | 2544 | 80000 | 3000 | 99994 | 2976 | 104160 | 3510 |
| Standard_E64pds_v6 | 64 | 102400 | 3392 | 102400 | 3392 | 133325 | 3969 | 133325 | 4680 |
| Standard_E96pds_v6 | 64 | 153600 | 5000 | 153600 | 5000 | 199987 | 5850 | 199987 | 5953 |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- <sup>1</sup>These sizes support [bursting](../../disk-bursting.md) to temporarily increase disk performance. Burst speeds can be maintained for up to 30 minutes at a time.
- <sup>2</sup>Special Storage refers to either [Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) or [Premium SSD v2](../../../virtual-machines/disks-deploy-premium-v2.md) storage.
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).

### [Network](#tab/sizenetwork)

Network interface info for each size

| Size Name | Max NICs (Qty.) | Max Bandwidth (Mbps) |
| --- | --- | --- |
| Standard_E2pds_v6 | 2 | 12500 |
| Standard_E4pds_v6 | 2 | 12500 |
| Standard_E8pds_v6 | 4 | 15000 |
| Standard_E16pds_v6 | 8 | 15000 |
| Standard_E32pds_v6 | 8 | 20000 |
| Standard_E48pds_v6 | 8 | 30000 |
| Standard_E64pds_v6 | 8 | 40000 |
| Standard_E96pds_v6 | 8 | 60000 |

#### Networking resources
- [Virtual networks and virtual machines in Azure](../../../virtual-network/network-overview.md)
- [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)

> [!NOTE]
> Accelerated networking is required and turned on by default on all Epdsv6 machines.

#### Table definitions
- Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)
- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](../../../virtual-network/virtual-network-optimize-network-bandwidth.md). 
-  To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](../../../virtual-network/virtual-network-bandwidth-testing.md).
### [Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

> [!NOTE]
> No accelerators are present in this series.

---

[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
