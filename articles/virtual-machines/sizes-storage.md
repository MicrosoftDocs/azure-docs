---
title: Azure VM sizes - Storage | Microsoft Docs
description: Lists the different storage optimized sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
ms.subservice: sizes
documentationcenter: ''
author: sasha-melamed
ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: jushiman

---

# Storage optimized virtual machine sizes

Storage optimized VM sizes offer high disk throughput and IO, and are ideal for Big Data, SQL, NoSQL databases, data warehousing, and large transactional databases.  Examples include Cassandra, MongoDB, Cloudera, and Redis. This article provides information about the number of vCPUs, data disks, and NICs as well as local storage throughput and network bandwidth for each optimized size.

The [Lsv2-series](lsv2-series.md) features high throughput, low latency, directly mapped local NVMe storage running on the [AMD EPYC<sup>TM</sup> 7551 processor](https://www.amd.com/en/products/epyc-7000-series) with an all core boost of 2.55GHz and a max boost of 3.0GHz. The Lsv2-series VMs come in sizes from 8 to 80 vCPU in a simultaneous multi-threading configuration.  There is 8 GiB of memory per vCPU, and one 1.92TB NVMe SSD M.2 device per 8 vCPUs, with up to 19.2TB (10x1.92TB) available on the L80s v2.

## Other sizes

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

Learn how to optimize performance on the Lsv2-series virtual machines for [Windows](windows/storage-performance.md) or [Linux](linux/storage-performance.md).
