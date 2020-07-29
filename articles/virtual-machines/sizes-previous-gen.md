---
title: Azure VM sizes - previous generations | Microsoft Docs
description: Lists the previous generations of sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines
ms.subservice: sizes
author: mimckitt
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/20/2020
ms.author: jushiman

---

# Previous generations of virtual machine sizes

This section provides information on previous generations of virtual machine sizes. These sizes can still be used, but there are newer generations available.

## F-series

F-series is based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, which can achieve clock speeds as high as 3.1 GHz with the Intel Turbo Boost Technology 2.0. This is the same CPU performance as the Dv2-series of VMs.  

F-series VMs are an excellent choice for workloads that demand faster CPUs but do not need as much memory or temporary storage per vCPU.  Workloads such as analytics, gaming servers, web servers, and batch processing will benefit from the value of the F-series.

ACU: 210 - 250

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max data disks/throughput: IOPS | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_F1  | 1  | 2  | 16  | 3000/46/23    | 4/4x500   | 2/750   |
| Standard_F2  | 2  | 4  | 32  | 6000/93/46    | 8/8x500   | 2/1500  |
| Standard_F4  | 4  | 8  | 64  | 12000/187/93  | 16/16x500 | 4/3000  |
| Standard_F8  | 8  | 16 | 128 | 24000/375/187 | 32/32x500 | 8/6000  |
| Standard_F16 | 16 | 32 | 256 | 48000/750/375 | 64/64x500 | 8/12000 |

## Fs-series <sup>1</sup>

The Fs-series provides all the advantages of the F-series, in addition to Premium storage.

ACU: 210 - 250

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_F1s  | 1  | 2  | 4  | 4  | 4000/32 (12)    | 3200/48   | 2/750   |
| Standard_F2s  | 2  | 4  | 8  | 8  | 8000/64 (24)    | 6400/96   | 2/1500  |
| Standard_F4s  | 4  | 8  | 16 | 16 | 16000/128 (48)  | 12800/192 | 4/3000  |
| Standard_F8s  | 8  | 16 | 32 | 32 | 32000/256 (96)  | 25600/384 | 8/6000  |
| Standard_F16s | 16 | 32 | 64 | 64 | 64000/512 (192) | 51200/768 | 8/12000 |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

<sup>1</sup> The maximum disk throughput (IOPS or MBps) possible with a Fs series VM may be limited by the number, size, and striping of the attached disk(s).  For details, see designing for high performance for [Windows](windows/premium-storage-performance.md) or [Linux](linux/premium-storage-performance.md).  


## NVv2-series

**Newer size recommendation**: [NVv3-series](nvv3-series.md)

The NVv2-series virtual machines are powered by [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPUs and NVIDIA GRID technology with Intel Broadwell CPUs. These virtual machines are targeted for GPU accelerated graphics applications and virtual desktops where customers want to visualize their data, simulate results to view, work on CAD, or render and stream content. Additionally, these virtual machines can run single precision workloads such as encoding and rendering. NVv2 virtual machines support Premium Storage and come with twice the system memory (RAM) when compared with its predecessor NV-series.  

Each GPU in NVv2 instances comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs | Virtual Workstations | Virtual Applications |
|---|---|---|---|---|---|---|---|---|---|
| Standard_NV6s_v2  | 6  | 112 | 320  | 1 | 8  | 12 | 4 | 1 | 25  |
| Standard_NV12s_v2 | 12 | 224 | 640  | 2 | 16 | 24 | 8 | 2 | 50  |
| Standard_NV24s_v2 | 24 | 448 | 1280 | 4 | 32 | 32 | 8 | 4 | 100 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Older generations of virtual machine sizes

This section provides information on older generations of virtual machine sizes. These sizes are still supported but will not receive additional capacity. There are newer or alternative sizes that are generally available. Please refer to [Sizes for Linux virtual machines in Azure](linux/sizes.md) to choose the VM sizes that will best fit your need.  

For more information on resizing a Linux VM, see [Resize a Linux VM](linux/change-vm-size.md).  

<br>

### Basic A  

**Newer size recommendation**: [Av2-series](av2-series.md)

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

The basic tier sizes are primarily for development workloads and other applications that don't require load balancing, auto-scaling, or memory-intensive virtual machines.

| Size – Size\Name | vCPU | Memory|NICs (Max)| Max temporary disk size | Max. data disks (1023 GB each)| Max. IOPS (300 per disk) |
|---|---|---|---|---|---|---|
| A0\Basic_A0 | 1 | 768 MB  | 2 | 20 GB  | 1  | 1x300  |
| A1\Basic_A1 | 1 | 1.75 GB | 2 | 40 GB  | 2  | 2x300  |
| A2\Basic_A2 | 2 | 3.5 GB  | 2 | 60 GB  | 4  | 4x300  |
| A3\Basic_A3 | 4 | 7 GB    | 2 | 120 GB | 8  | 8x300  |
| A4\Basic_A4 | 8 | 14 GB   | 2 | 240 GB | 16 | 16x300 |

<br>

### Standard A0 - A4 using CLI and PowerShell

In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge

### A-series  

**Newer size recommendation**: [Av2-series](av2-series.md)

ACU: 50-100

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (HDD): GiB | Max data disks | Max data disk throughput: IOPS | Max NICs/Expected network bandwidth (Mbps) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0&nbsp;<sup>1</sup> | 1 | 0.768 | 20 | 1 | 1x500 | 2/100 |
| Standard_A1 | 1 | 1.75 | 70  | 2  | 2x500  | 2/500  |
| Standard_A2 | 2 | 3.5  | 135 | 4  | 4x500  | 2/500  |
| Standard_A3 | 4 | 7    | 285 | 8  | 8x500  | 2/1000 |
| Standard_A4 | 8 | 14   | 605 | 16 | 16x500 | 4/2000 |
| Standard_A5 | 2 | 14   | 135 | 4  | 4x500  | 2/500  |
| Standard_A6 | 4 | 28   | 285 | 8  | 8x500  | 2/1000 |
| Standard_A7 | 8 | 56   | 605 | 16 | 16x500 | 4/2000 |

<sup>1</sup> The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

<br>

### A-series - compute-intensive instances  

**Newer size recommendation**: [Av2-series](av2-series.md)

ACU: 225

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz.  

| Size | vCPU | Memory: GiB | Temp storage (HDD): GiB | Max data disks | Max data disk throughput: IOPS | Max NICs|
|---|---|---|---|---|---|---|
| Standard_A8&nbsp;<sup>1</sup> | 8  | 56  | 382 | 32 | 32x500 | 2 |
| Standard_A9&nbsp;<sup>1</sup> | 16 | 112 | 382 | 64 | 64x500 | 4 |
| Standard_A10 | 8  | 56  | 382 | 32 | 32x500 | 2 |
| Standard_A11 | 16 | 112 | 382 | 64 | 64x500 | 4 |

<sup>1</sup>For MPI applications, dedicated RDMA backend network is enabled by FDR InfiniBand network, which delivers ultra-low-latency and high bandwidth.  

> [!NOTE]
> The A8 – A11 VMs are planned for retirement on 3/2021. For more information, see [HPC Migration Guide](https://azure.microsoft.com/resources/hpc-migration-guide/).

<br>

### D-series  

**Newer size recommendation**: [Dv3-series](dv3-dsv3-series.md)

ACU: 160-250 <sup>1</sup>

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max data disks/throughput: IOPS | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_D1  | 1 | 3.5 | 50  | 3000/46/23    | 4/4x500   | 2/500  |
| Standard_D2  | 2 | 7   | 100 | 6000/93/46    | 8/8x500   | 2/1000 |
| Standard_D3  | 4 | 14  | 200 | 12000/187/93  | 16/16x500 | 4/2000 |
| Standard_D4  | 8 | 28  | 400 | 24000/375/187 | 32/32x500 | 8/4000 |

<sup>1</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  

<br>

### D-series - memory optimized  

**Newer size recommendation**: [Dv3-series](dv3-dsv3-series.md)

ACU: 160-250 <sup>1</sup>

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max data disks/throughput: IOPS | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_D11 | 2  | 14  | 100 | 6000/93/46    | 8/8x500   | 2/1000 |
| Standard_D12 | 4  | 28  | 200 | 12000/187/93  | 16/16x500 | 4/2000 |
| Standard_D13 | 8  | 56  | 400 | 24000/375/187 | 32/32x500 | 8/4000 |
| Standard_D14 | 16 | 112 | 800 | 48000/750/375 | 64/64x500 | 8/8000 |

<sup>1</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  

<br>

## Preview: DC-series

**Newer size recommendation**: [DCsv2-series](dcv2-series.md)

Premium Storage: Supported

Premium Storage caching: Supported

The DC-series uses the latest generation of 3.7GHz Intel XEON E-2176G Processor with SGX technology, and with the Intel Turbo Boost Technology can go up to 4.7GHz. 

| Size          | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|---------------|------|-------------|------------------------|----------------|-------------------------------------------------------------------------|-------------------------------------------|----------------------------------------------|
| Standard_DC2s | 2    | 8           | 100                    | 2              | 4000 / 32 (43)                                                          | 3200 /48                                  | 2 / 1500                                     |
| Standard_DC4s | 4    | 16          | 200                    | 4              | 8000 / 64 (86)                                                          | 6400 /96                                  | 2 / 3000                                     |

> [!IMPORTANT]
>
> DC-series VMs are [generation 2 VMs](./linux/generation-2.md#creating-a-generation-2-vm) and only support `Gen2` images.


### DS-series  

**Newer size recommendation**: [Dsv3-series](dv3-dsv3-series.md)

ACU: 160-250 <sup>1</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_DS1 | 1 | 3.5 | 7  | 4  | 4000/32 (43)    | 3200/32   | 2/500  |
| Standard_DS2 | 2 | 7   | 14 | 8  | 8000/64 (86)    | 6400/64   | 2/1000 |
| Standard_DS3 | 4 | 14  | 28 | 16 | 16000/128 (172) | 12800/128 | 4/2000 |
| Standard_DS4 | 8 | 28  | 56 | 32 | 32000/256 (344) | 25600/256 | 8/4000 |

<sup>1</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  

<br>

### DS-series - memory optimized  

**Newer size recommendation**: [Dsv3-series](dv3-dsv3-series.md)

ACU: 160-250 <sup>1,2</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_DS11 | 2  | 14  | 28  | 8  | 8000/64 (72)    | 6400/64   | 2/1000 |
| Standard_DS12 | 4  | 28  | 56  | 16 | 16000/128 (144) | 12800/128 | 4/2000 |
| Standard_DS13 | 8  | 56  | 112 | 32 | 32000/256 (288) | 25600/256 | 8/4000 |
| Standard_DS14 | 16 | 112 | 224 | 64 | 64000/512 (576) | 51200/512 | 8/8000 |

<sup>1</sup> The maximum disk throughput (IOPS or MBps) possible with a DS series VM may be limited by the number, size and striping of the attached disk(s).  For details, see designing for high performance for [Windows](windows/premium-storage-performance.md) or [Linux](linux/premium-storage-performance.md).
<sup>2</sup> VM Family can run on one of the following CPU's: 2.2 GHz Intel Xeon® E5-2660 v2,  2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) or 2.3 GHz Intel XEON® E5-2673 v4 (Broadwell)  

<br>

### Ls-series

The Ls-series offers up to 32 vCPUs, using the [Intel® Xeon® processor E5 v3 family](https://www.intel.com/content/www/us/en/processors/xeon/xeon-e5-solutions.html). The Ls-series gets the same CPU performance as the G/GS-Series and comes with 8 GiB of memory per vCPU.

The Ls-series does not support the creation of a local cache to increase the IOPS achievable by durable data disks. The high throughput and IOPS of the local disk makes Ls-series VMs ideal for NoSQL stores such as Apache Cassandra and MongoDB which replicate data across multiple VMs to achieve persistence in the event of the failure of a single VM.

ACU: 180-240

Premium Storage:  Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory (GiB) | Temp storage (GiB) | Max data disks | Max temp storage throughput (IOPS/MBps) | Max uncached disk throughput (IOPS/MBps) | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_L4s   | 4  | 32  | 678  | 16 | 20000/200 | 5000/125  | 2/4000  |
| Standard_L8s   | 8  | 64  | 1388 | 32 | 40000/400 | 10000/250 | 4/8000  |
| Standard_L16s  | 16 | 128 | 2807 | 64 | 80000/800 | 20000/500 | 8/16000 |
| Standard_L32s&nbsp;<sup>1</sup> | 32 | 256 | 5630 | 64 | 160000/1600 | 40000/1000 | 8/20000 |

The maximum disk throughput possible with Ls-series VMs may be limited by the number, size, and striping of any attached disks. For details, see designing for high performance for [Windows](windows/premium-storage-performance.md) or [Linux](linux/premium-storage-performance.md).

<sup>1</sup> Instance is isolated to hardware dedicated to a single customer.

### GS-series

ACU: 180 - 240 <sup>1</sup>

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_GS1 | 2 | 28  | 56  | 8  | 10000/100 (264)  | 5000/ 125  | 2/2000 |
| Standard_GS2 | 4 | 56  | 112 | 16 | 20000/200 (528)  | 10000/ 250 | 2/4000 |
| Standard_GS3 | 8 | 112 | 224 | 32 | 40000/400 (1056) | 20000/ 500 | 4/8000 |
| Standard_GS4&nbsp;<sup>3</sup> | 16 | 224 | 448 | 64 | 80000/800 (2112) | 40000/1000 | 8/16000 |
| Standard_GS5&nbsp;<sup>2,&nbsp;3</sup> | 32 | 448 |896 | 64 |160000/1600 (4224) | 80000/2000 | 8/20000 |

<sup>1</sup> The maximum disk throughput (IOPS or MBps) possible with a GS series VM may be limited by the number, size and striping of the attached disk(s). For details, see designing for high performance for [Windows](windows/premium-storage-performance.md) or [Linux](linux/premium-storage-performance.md).

<sup>2</sup> Instance is isolated to hardware dedicated to a single customer.

<sup>3</sup> Constrained core sizes available.

<br>

### G-series

ACU: 180 - 240

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max data disks/throughput: IOPS | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_G1  | 2  | 28  | 384  | 6000/93/46    | 8/8x500   | 2/2000  |
| Standard_G2  | 4  | 56  | 768  | 12000/187/93  | 16/16x500 | 2/4000  |
| Standard_G3  | 8  | 112 | 1536 | 24000/375/187 | 32/32x500 | 4/8000  |
| Standard_G4  | 16 | 224 | 3072 | 48000/750/375 | 64/64x500 | 8/16000 |
| Standard_G5&nbsp;<sup>1</sup> | 32 | 448 | 6144 | 96000/1500/750| 64/64x500 | 8/20000 |

<sup>1</sup> Instance is isolated to hardware dedicated to a single customer.
<br>

## NV-series
**Newer size recommendation**: [NVv3-series](nvv3-series.md) and [NVv4-series](nvv4-series.md)

The NV-series virtual machines are powered by [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPUs and NVIDIA GRID technology for desktop accelerated applications and virtual desktops where customers are able to visualize their data or simulations. Users are able to visualize their graphics intensive workflows on the NV instances to get superior graphics capability and additionally run single precision workloads such as encoding and rendering. NV-series VMs are also powered by Intel Xeon E5-2690 v3 (Haswell) CPUs.

Each GPU in NV instances comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs | Virtual Workstations | Virtual Applications |
|---|---|---|---|---|---|---|---|---|---|
| Standard_NV6  | 6  | 56  | 340  | 1 | 8  | 24 | 1 | 1 | 25  |
| Standard_NV12 | 12 | 112 | 680  | 2 | 16 | 48 | 2 | 2 | 50  |
| Standard_NV24 | 24 | 224 | 1440 | 4 | 32 | 64 | 4 | 4 | 100 |

1 GPU = one-half M60 card.
<br>

## Other sizes

* [General purpose](sizes-general.md)
* [Compute optimized](sizes-compute.md)
* [Memory optimized](sizes-memory.md)
* [Storage optimized](sizes-storage.md)
* [GPU](sizes-gpu.md)
* [High performance compute](sizes-hpc.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
