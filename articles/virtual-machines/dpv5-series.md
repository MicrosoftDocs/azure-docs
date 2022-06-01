---
title: Overview of the Dpv5-series sizes
description: Overview of Dpv5 series of ARM64-based Azure Virtual Machines featuring the 80 core, 3.0 GHz Ampere Altra processor. These sizes include Dpdsv5-series, Dpldsv5-series, Dpsv5-series, and Dplsv5-series.
author: noahwood28
ms.author: noahwood
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/01/2022
ms.custom: template-sizes

---

# Dpv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The general purpose Dpv5-series are ARM64-based VMs featuring the 80 core, 3.0 GHz Ampere Altra processor. The Dpdsv5, Dpldsv5, Dpsv5, and Dplsv5 series are designed for common enterprise workloads. The series are optimized for database, in-memory caching, analytics, gaming, web, and application servers running on Linux. These instances deliver up to 80% better per-vCPU performance with up to 20% lower pricing than equivalent x86-based instances. 

## Dpdsv5-series

Dpdsv5-series are Local Disk Premium Capable with a vCPU range of 2-64.

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
| Standard_D2pds_v5	| 2	| 8	| 75	| 4	| 19000/120	| 2/2000 |
| Standard_D4pds_v5	| 4	| 16	| 150	| 8	| 38500/242	| 2/4000 |
| Standard_D8pds_v5	| 8	| 32	| 300	| 16	| 77000/485	| 4/8000 |
| Standard_D16pds_v5	| 16	| 64	| 600	| 32	| 154000/968	| 4/12000 |
| Standard_D32pds_v5	| 32	| 128	| 1200	| 32	| 308000/1936	| 8/20000 |
| Standard_D48pds_v5	| 48	| 192	| 1800	| 32	| 462000/2904	| 8/30000 |
| Standard_D64pds_v5	| 64	| 256	| 2400	| 32	| 615000/3872	| 8/40000 |


## Dpldsv5-series

Dpldsv5-series are Low Memory Local Disk Premium Capable with a vCPU range of 2-64.

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
| Standard_D2plds_v5    | 2  | 4  | 75   | 4  | 19000/120     | 2/2000  |
| Standard_D4plds_v5 | 4 | 8 | 150 | 8 | 38500/242 | 2/4000 |
| Standard_D8plds_v5 | 8 | 16 | 300 | 16 | 77000/485 | 4/8000 |
| Standard_D16plds_v5 | 16 | 32 | 600 | 32 | 154000/968 | 4/12000 |
| Standard_D32plds_v5 | 32 | 64 | 1200 | 32 | 308000/1936 | 8/20000 |
| Standard_D48plds_v5 | 48 | 96 | 1800 | 32 | 462000/2904 | 8/30000 |
| Standard_D64plds_v5 | 64 | 128 | 2400 | 32 | 615000/3872 | 8/40000 |

## Dpsv5-series

Dpsv5-series are Diskless Premium Capable with a vCPU range of 2-64. 

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
| Standard_D2ps_v5	| 2	| 8	| Not applicable	| 4	| 19000/120	| 2/2000 |
| Standard_D4ps_v5	| 4	| 16	| Not applicable	| 8	| 38500/242	| 2/4000 |
| Standard_D8ps_v5	| 8	| 32	| Not applicable	| 16	| 77000/485	| 4/8000 |
| Standard_D16ps_v5	| 16	| 64	| Not applicable	| 32	| 154000/968	| 4/12000 |
| Standard_D32ps_v5	| 32	| 128	NA	| 32	| 308000/1936	| 8/20000 |
| Standard_D48ps_v5	| 48	| 192	| Not applicable	| 32	| 462000/2904	| 8/30000 |
| Standard_D64ps_v5	| 64	| 256	| Not applicable	| 32	| 615000/3872	| 8/40000 |

## Dplsv5-series

Dplsv5-series are Low Memory Local Diskless Premium Capable with a vCPU range of 2-64.

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
| Standard_D2pls_v5	| 2	| 4	| Not applicable	| 4	| 19000/120	| 2/2000 |
| Standard_D4pls_v5	| 4	| 8	| Not applicable	| 8	| 38500/242	| 2/4000 |
| Standard_D8pls_v5	| 8	| 16	| Not applicable	| 16	| 77000/485	| 4/8000 |
| Standard_D16pls_v5	| 16	| 32	| Not applicable	| 32	| 154000/968	| 4/12000 |
| Standard_D32pls_v5	| 32	| 64	| Not applicable	| 32	| 308000/1936	| 8/20000 |
| Standard_D48pls_v5	| 48	| 96	| Not applicable	| 32	| 462000/2904	| 8/30000 |
| Standard_D64pls_v5	| 64	| 128	| Not applicable	| 32	| 615000/3872	| 8/40000 |


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