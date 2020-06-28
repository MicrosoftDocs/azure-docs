---
title: Ev4 and Esv4-series - Azure Virtual Machines
description: Specifications for the Ev4, and Esv4-series VMs.
author: brbell
ms.author: brbell
ms.reviewer: cynthn
ms.custom: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 6/8/2020

---

# Ev4 and Esv4-series

The Ev4 and Esv4-series runs on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, are ideal for various memory-intensive enterprise applications and feature up to 504GiB of RAM.

> [!NOTE]
> For frequently asked questions, refer to  [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.md).

## Ev4-series

Ev4-series sizes run on the Intel Xeon&reg; Platinum 8272CL (Cascade Lake). The Ev4-series instances are ideal for memory-intensive enterprise applications. Ev4-series VMs feature Intel&reg; Hyper-Threading Technology.

Remote Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Esv4 sizes. The pricing and billing meters for Esv4 sizes are the same as Ev4-series.

> [!IMPORTANT]
> These new sizes are currently under Public Preview Only. You can signup for these Dv4 and Dsv4-series [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRURE1ZSkdDUzg1VzJDN0cwWUlKTkcyUlo5Mi4u). 

ACU: 195 - 210

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

Live Migration: Supported

Memory Preserving Updates: Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max NICs/Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|
| Standard_E2_v4  | 2 | 16   | Remote Storage Only | 4 | 2/1000  |
| Standard_E4_v4  | 4 | 32  | Remote Storage Only | 8 | 2/2000  |
| Standard_E8_v4  | 8 | 64 | Remote Storage Only | 16 | 4/4000 |
| Standard_E16_v4 | 16 | 128 | Remote Storage Only | 32 | 8/8000 |
| Standard_E20_v4 | 20 | 160 | Remote Storage Only | 32 | 8/10000 |
| Standard_E32_v4 | 32 | 256 | Remote Storage Only | 32 | 8/16000 |
| Standard_E48_v4 | 48 | 384 | Remote Storage Only | 32 | 8/24000 |
| Standard_E64_v4 | 64 | 504 | Remote Storage Only | 32| 8/30000 |


## Esv4-series

Esv4-series sizes run on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Esv4-series instances are ideal for memory-intensive enterprise applications. Evs4-series VMs feature Intel&reg; Hyper-Threading Technology. Remote Data disk storage is billed separately from virtual machines.

> [!IMPORTANT]
> These new sizes are currently under Public Preview Only. You can signup for these Dv4 and Dsv4-series [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRURE1ZSkdDUzg1VzJDN0cwWUlKTkcyUlo5Mi4u). 

ACU: 195-210

Premium Storage:  Supported

Premium Storage caching:  Supported

Live Migration: Supported

Memory Preserving Updates: Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_E2s_v4  | 2 | 16  | Remote Storage Only | 4 | 19000/120 (50) | 3200/48 | 2/1000  |
| Standard_E4s_v4  | 4 | 32  | Remote Storage Only | 8 | 38500/242 (100) | 6400/96 | 2/2000  |
| Standard_E8s_v4  | 8 | 64  | Remote Storage Only | 16 | 77000/485 (200) | 12800/192 | 4/4000 |
| Standard_E16s_v4 | 16 | 128 | Remote Storage Only | 32 | 154000/968 (400) | 25600/384 | 8/8000 |
| Standard_E20s_v4 | 20 | 160 | Remote Storage Only | 32 | 193000/1211 (500) | 32000/480  | 8/10000 |
| Standard_E32s_v4 | 32 | 256 | Remote Storage Only | 32 | 308000/1936 (800) | 51200/768  | 8/16000 |
| Standard_E48s_v4 | 48 | 384 | Remote Storage Only | 32 | 462000/2904 (1200) | 76800/1152 | 8/24000 |
| Standard_E64s_v4 <sup>1</sup> | 64 | 504| Remote Storage Only | 32 | 615000/3872 (1600) | 80000/1200 | 8/30000 |

<sup>1</sup> [Constrained core sizes available](https://docs.microsoft.com/azure/virtual-machines/windows/constrained-vcpu).

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
