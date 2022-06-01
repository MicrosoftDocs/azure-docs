---
title: Overview of the Epv5-series sizes
description: Overview of memory-optimized Epv5-series of ARM64-based Azure Virtual Machines featuring the 80 core, 3.0 GHz Ampere Altra processor. These sizes include Epdsv5-series, Epldsv5-series, Epsv5-series, and Eplsv5-series.
author: noahwood28
ms.author: noahwood
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 07/01/2022
ms.custom: template-sizes 

---


# Epv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The general purpose Epv5-series are ARM64-based VMs featuring the 80 core, 3.0 GHz Ampere Altra processor. The Epdsv5, Epldsv5, Epsv5, and Eplsv5 series are designed for common enterprise workloads. The series are optimized for database, in-memory caching, analytics, gaming, web, and application servers running on Linux. These instances deliver up to 80% better per-vCPU performance with up to 20% lower pricing than equivalent x86-based instances. 

## Epdsv5-series

- [ACU](acu.md): XXX - XXX
- [Premium Storage](premium-storage-performance.md): Not Supported\Supported 
- [Premium Storage caching](premium-storage-performance.md): Not Supported\Supported 
- [Live Migration](maintenance-and-updates.md): Not Supported\Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Not Supported\Supported 
- [VM Generation Support](generation-2.md): Generation 1\Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported\Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported\Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Network bandwidth |
|---|---|---|---|---|---|---|
| Standard_E2pds_v5	| 2	| 16	| 75	| 4	| 19000/120	| 2/2000 |
| Standard_E4pds_v5	| 4	| 32	| 150	| 8	| 38500/242	| 2/4000 |
| Standard_E8pds_v5	| 8	| 64	| 300	| 16	| 77000/485	| 4/8000 |
| Standard_E16pds_v5	| 16	| 128	| 600	| 32	| 154000/968	| 4/12000 |
| Standard_E20pds_v5	| 20	| 160	| 750	| 32	| 308000/1936	| 8/15000 |
| Standard_E32pds_v5	| 32	| 208	| 1200	| 32	| 462000/2904	| 8/20000 |


## Epldsv5-series

- [ACU](acu.md): XXX - XXX
- [Premium Storage](premium-storage-performance.md): Not Supported\Supported 
- [Premium Storage caching](premium-storage-performance.md): Not Supported\Supported 
- [Live Migration](maintenance-and-updates.md): Not Supported\Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Not Supported\Supported 
- [VM Generation Support](generation-2.md): Generation 1\Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported\Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported\Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Network bandwidth |
|---|---|---|---|---|---|---|
| Standard_XX_XX    | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |

## Epsv5-series

- [ACU](acu.md): XXX - XXX
- [Premium Storage](premium-storage-performance.md): Not Supported\Supported 
- [Premium Storage caching](premium-storage-performance.md): Not Supported\Supported 
- [Live Migration](maintenance-and-updates.md): Not Supported\Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Not Supported\Supported 
- [VM Generation Support](generation-2.md): Generation 1\Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported\Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported\Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Network bandwidth |
|---|---|---|---|---|---|---|
| Standard_E2ps_v5	| 2	| 16	| Not applicable	| 4	| 19000/120	| 2/2000 |
| Standard_E4ps_v5	| 4	| 32	| Not applicable	| 8	| 38500/242	| 2/4000 |
| Standard_E8ps_v5	| 8	| 64	| Not applicable	| 16	| 77000/485	| 4/8000 |
| Standard_E16ps_v5	| 16	| 128	| Not applicable	| 32	| 154000/968	| 4/12000 |
| Standard_E20ps_v5	| 20	| 160	| Not applicable	| 32	| 308000/1936	| 8/15000 |
| Standard_E32ps_v5	| 32	| 208	| Not applicable	| 32	| 462000/2904	| 8/20000 |


## Eplsv5-series

- [ACU](acu.md): XXX - XXX
- [Premium Storage](premium-storage-performance.md): Not Supported\Supported 
- [Premium Storage caching](premium-storage-performance.md): Not Supported\Supported 
- [Live Migration](maintenance-and-updates.md): Not Supported\Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Not Supported\Supported 
- [VM Generation Support](generation-2.md): Generation 1\Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported\Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported\Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Network bandwidth |
|---|---|---|---|---|---|---|
| Standard_XX_XX    | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |
| Standard_XX_XX                | X  | XX  | XX   | X  | XXX/XX/XX      | X/XXXX  |


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.