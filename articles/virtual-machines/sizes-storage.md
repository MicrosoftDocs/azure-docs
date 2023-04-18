--- 
title: Storage optimized virtual machine sizes
description: Learn about the different storage optimized sizes available for Azure Virtual Machines (Azure VMs). Find information about the number of vCPUs, data disks, NICs, storage throughput, and network bandwidth for sizes in this series. 
author: sasha-melamed
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.workload: infrastructure-services 
ms.date: 06/01/2022
ms.author: sasham 
--- 

# Storage optimized virtual machine sizes

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets 
 
Storage optimized virtual machine (VM) sizes offer high disk throughput and IO, and are ideal for Big Data, SQL, NoSQL databases, data warehousing, and large transactional databases.  Examples include Cassandra, MongoDB, Cloudera, and Redis. This article provides information about the number of vCPUs, data disks, NICs, local storage throughput, and network bandwidth for each optimized size. 

> [!TIP] 
> Try the [virtual machines selector tool](https://aka.ms/vm-selector) to find other sizes that best fit your workload. 

The Lsv3, Lasv3, and Lsv2-series feature high-throughput, low latency, directly mapped local NVMe storage. These VM series come in sizes from 8 to 80 vCPU.  There are 8 GiB of memory per vCPU, and one 1.92TB NVMe SSD device per 8 vCPUs, with up to 19.2TB (10x1.92TB) available on the largest VM sizes. 

- The [Lsv3-series](lsv3-series.md) runs on the third Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper-threaded configuration](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html). This new processor features an all-core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). 
- The [Lasv3-series](lasv3-series.md) runs on the AMD 3rd Generation EPYC&trade; 7763v processor. This series runs in a multi-threaded configuration with up to 256 MB L3 cache, which can achieve a boosted maximum frequency of 3.5 GHz. 
- The [Lsv2-series](lsv2-series.md) runs on the [AMD EPYC&trade; 7551 processor](https://www.amd.com/en/products/epyc-7000-series) with an all-core boost of 2.55 GHz and a max boost of 3.0 GHz. 

## Other sizes 

- [General purpose](sizes-general.md) 
- [Compute optimized](sizes-compute.md) 
- [Memory optimized](sizes-memory.md) 
- [GPU optimized](sizes-gpu.md) 
- [High performance compute](sizes-hpc.md) 
- [Previous generations](sizes-previous-gen.md) 

## Next steps 

- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs. 
- Learn how to optimize performance on the Lsv2-series [Windows VMs](windows/storage-performance.md) and [Linux VMs](linux/storage-performance.md). 
- For more information on how Azure names its VMs, see [Azure virtual machine sizes naming conventions](./vm-naming-conventions.md). 
