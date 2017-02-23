---
title: Azure Windows VM sizes - GPU| Microsoft Docs
description: Lists the different GPU optimized sizes available for Windows virtual machines in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: cynthn

---

# GPU 

The NC and NV sizes are also known as GPU-enabled instances. These are specialized virtual machines that include NVIDIA's GPU cards, optimized for different scenarios and use cases. The NV sizes are optimized and designed for remote visualization, streaming, gaming, encoding and VDI scenarios utilizing frameworks such as OpenGL and DirectX. The NC sizes are more optimized for compute-intensive and network-intensive applications and algorithms, including CUDA- and OpenCL-based applications and simulations. 


The NV instances are powered by NVIDIA’s Tesla M60 GPU card and NVIDIA GRID for desktop accelerated applications and virtual desktops where customers will be able to visualize their data or simulations. Users will be able to visualize their graphics intensive workflows on the NV instances to get superior graphics capability and additionally run single precision workloads such as encoding and rendering. The Tesla M60 delivers 4096 CUDA cores in a dual-GPU design with up to 36 streams of 1080p H.264. 

The NC instances are powered by NVIDIA’s Tesla K80 card. Users can now crunch through data much faster by leveraging CUDA for energy exploration applications, crash simulations, ray traced rendering, deep learning and more. The Tesla K80 delivers 4992 CUDA cores with a dual-GPU design, up to 2.91 Teraflops of double-precision and up to 8.93 Teraflops of single-precision performance.


[!INCLUDE [virtual-machines-common-sizes-gpu](../../includes/virtual-machines-common-sizes-gpu.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes
- [General purpose](virtual-machines-windows-sizes-general.md)
- [Compute optimized](virtual-machines-windows-sizes-compute.md)
- [High performance compute](virtual-machines-windows-sizes-hpc.md)
- [Memory optimized](virtual-machines-windows-sizes-memory.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)