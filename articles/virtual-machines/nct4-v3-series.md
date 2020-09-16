---
title: NCas T4 v3-series 
description: Specifications for the NCas T4 v3-series VMs.
services: virtual-machines
ms.subservice: sizes
author: vikancha-MSFT
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 08/10/2020
ms.author: vikancha
---

# NCasT4_v3-series (In Preview) 

The NCasT4_v3-series virtual machines are powered by [Nvidia Tesla T4](https://www.nvidia.com/en-us/data-center/tesla-t4/) GPUs and AMD EPYC 7V12(Rome) CPUs. The VMs feature up to 4 NVIDIA T4 GPUs with 16 GB of memory each, up to 64 non-multithreaded AMD EPYC 7V12(Rome) processor cores, and 440 GiB of system memory. These virtual machines are ideal to run ML and AI workloads utilizing CUDA, TensorFlow, Pytorch, Caffe, and other Frameworks or the graphics workloads using NVIDIA GRID technology. NCasT4_v3-series is ideal for running inference workloads.

You can [submit a request](https://aka.ms/NCT4v3Preview) to be part of the preview program.

<br>

ACU: 230-260

Premium Storage:  Supported

Premium Storage caching:  Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NC4as_T4_v3 |4 |28 |180 | 1 | 16 | 8 | 2 |
| Standard_NC8as_T4_v3 |8 |56 |360 | 1 | 16 | 16 | 4  |
| Standard_NC16as_T4_v3 |16 |110 |360 | 1 | 16 | 32 | 8  |
| Standard_NC64as_T4_v3 |64 |440 |2880 | 4 | 64 | 32 | 8  |


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure NCasT4_v3-series VMs running Windows or Linux, Nvidia GPU drivers must be installed.

To install Nvidia GPU drivers manually, see [N-series GPU driver setup for Windows](./windows/n-series-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
