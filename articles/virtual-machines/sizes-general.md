---
title: Azure VM sizes - General purpose | Microsoft Docs
description: Lists the different general purpose sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: mamccrea
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/26/2022
ms.author: mamccrea
---

# General purpose virtual machine sizes

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

General purpose VM sizes provide balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. This article provides information about the offerings for general purpose computing.

> [!TIP]
> Try the **[Virtual machines selector tool](https://aka.ms/vm-selector)** to find other sizes that best fit your workload.

- The [Av2-series](av2-series.md) VMs can be deployed on various hardware types and processors. A-series VMs have CPU performance and memory configurations best suited for entry level workloads like development and test. This size is throttled, based on the hardware. The size offers consistent processor performance for the running instance, regardless of the hardware it's deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine. Example use cases include development and test servers, low traffic web servers, small to medium databases, proof-of-concepts, and code repositories.

- [B-series burstable](sizes-b-series-burstable.md) VMs are ideal for workloads that don't need the full performance of the CPU continuously, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. The B-Series provides these customers the ability to purchase a VM size with a price conscious baseline performance that allows the VM instance to build up credits when the VM is utilizing less than its base performance. When the VM has accumulated credit, the VM can burst above the VM’s baseline using up to 100% of the CPU when your application requires the higher CPU performance.

- The [DCv2-series](dcv2-series.md) can help protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the latest generation of Intel XEON E-2288G Processor with SGX technology. With the Intel Turbo Boost Technology, these machines can go up to 5.0 GHz. DCv2 series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

- The [Dpsv5 and Dpdsv5-series](dpsv5-dpdsv5-series.md) and [Dplsv5 and Dpldsv5-series](dplsv5-dpldsv5-series.md) are Arm-based VMs featuring the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer a combination of vCPUs and memory required for most enterprise workloads such as web and application servers, small to medium databases, caches, and more.

- [Dv2 and Dsv2-series](dv2-dsv2-series.md) VMs, a follow-on to the original D-series, features a more powerful CPU and optimal CPU-to-memory configuration making them suitable for most production workloads. The Dv2-series is about 35% faster than the D-series. Dv2-series run on 2nd Generation Intel® Xeon® Platinum 8272CL (Cascade Lake), Intel® Xeon® 8171M 2.1 GHz (Skylake), Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors with the Intel Turbo Boost Technology 2.0. The Dv2-series has the same memory and disk configurations as the D-series.

- The [Dv3 and Dsv3-series](dv3-dsv3-series.md) runs on 2nd Generation Intel® Xeon® Platinum 8272CL (Cascade Lake), Intel® Xeon® 8171M 2.1 GHz (Skylake), Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors. These series run in a hyper-threaded configuration, providing a better value proposition for most general purpose workloads. Memory has been expanded (from ~3.5 GiB/vCPU to 4 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyperthreading. The Dv3-series no longer has the high memory VM sizes of the D/Dv2-series. Those sizes have been moved to the memory optimized [Ev3 and Esv3-series](ev3-esv3-series.md).

- [Dav4 and Dasv4-series](dav4-dasv4-series.md) are new sizes utilizing AMD’s 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256 MB L3 cache dedicating 8 MB of that L3 cache to every eight cores increasing customer options for running their general purpose workloads. The Dav4-series and Dasv4-series have the same memory and disk configurations as the D & Dsv3-series.

- The [Dv4 and Dsv4-series](dv4-dsv4-series.md) runs on the Intel® Xeon® Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. It features an all core Turbo clock speed of 3.4 GHz.

- The [Ddv4 and Ddsv4-series](ddv4-ddsv4-series.md) runs on the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. It features an all core Turbo clock speed of 3.4 GHz, [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). They also support [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These new VM sizes will have 50% larger local storage, and better local disk IOPS for both read and write compared to the [Dv3/Dsv3](./dv3-dsv3-series.md) sizes with [Gen2 VMs](./generation-2.md).

- The [Dasv5 and Dadsv5-series](dasv5-dadsv5-series.md) utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache, increasing customer options for running their general purpose workloads. These virtual machines offer a combination of vCPUs and memory to meet the requirements associated with most enterprise workloads. For example, you can use these series with small-to-medium databases, low-to-medium traffic web servers, application servers, and more.

- The [Dv5 and Dsv5-series](dv5-dsv5-series.md) run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor in a hyper-threaded configuration. The Dv5 and Dsv5 virtual machine sizes don't have any temporary storage thus lowering the price of entry. The Dv5 VM sizes offer a combination of vCPUs and memory to meet the requirements associated with most enterprise workloads. For example, you can use these series with small-to-medium databases, low-to-medium traffic web servers, application servers, and more. 

- The [Ddv5 and Ddsv5-series](ddv5-ddsv5-series.md) run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core Turbo clock speed of 3.5 GHz, [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html), [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html).


## Other sizes

- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

For more information on how Azure names its VMs, see [Azure virtual machine sizes naming conventions](./vm-naming-conventions.md).
