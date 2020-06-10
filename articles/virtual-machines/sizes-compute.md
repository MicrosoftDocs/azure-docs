---
title: Azure VM sizes - Compute optimized | Microsoft Docs
description: Lists the different compute optimized sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: mimckitt

---

# Compute optimized virtual machine sizes

Compute optimized VM sizes have a high CPU-to-memory ratio. These sizes are good for medium traffic web servers, network appliances, batch processes, and application servers. This article provides information about the number of vCPUs, data disks, and NICs. It also includes information about storage throughput and network bandwidth for each size in this grouping.

The [Fsv2-series](fsv2-series.md) runs on 2nd Generation Intel® Xeon® Platinum 8272CL (Cascade Lake) processors and Intel® Xeon® Platinum 8168 processors. It features a sustained all core Turbo clock speed of 3.4 GHz and a maximum single-core turbo frequency of 3.7 GHz. Intel® AVX-512 instructions are new on Intel Scalable Processors. These instructions provide up to a 2X performance boost to vector processing workloads on both single and double precision floating point operations. In other words, they're really fast for any computational workload.

At a lower per-hour list price, the Fsv2-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per vCPU.

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
