---
title: Azure VM sizes - General purpose | Microsoft Docs
description: Lists the different general purpose sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.devlang: na
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/20/2020
ms.author: mimckitt
---

# General purpose virtual machine sizes

General purpose VM sizes provide balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. This article provides information about the offerings for general purpose computing.

- The [Av2-series](av2-series.md) VMs can be deployed on a variety of hardware types and processors. A-series VMs have CPU performance and memory configurations best suited for entry level workloads like development and test. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine. Example use cases include development and test servers, low traffic web servers, small to medium databases, proof-of-concepts, and code repositories.

  > [!NOTE]
  > The A8 – A11 VMs are planned for retirement on 3/2021. For more information, see [HPC Migration Guide](https://azure.microsoft.com/resources/hpc-migration-guide/).

- [B-series burstable](sizes-b-series-burstable.md) VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. The B-Series provides these customers the ability to purchase a VM size with a price conscious baseline performance that allows the VM instance to build up credits when the VM is utilizing less than its base performance. When the VM has accumulated credit, the VM can burst above the VM’s baseline using up to 100% of the CPU when your application requires the higher CPU performance.

- [Dav4 and Dasv4-series](dav4-dasv4-series.md) are new sizes utilizing AMD’s 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256 MB L3 cache dedicating 8 MB of that L3 cache to every 8 cores increasing customer options for running their general purpose workloads. The Dav4-series and Dasv4-series have the same memory and disk configurations as the D & Dsv3-series.

- The [DCv2-series](dcv2-series.md) can help protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the latest generation of Intel XEON E-2288G Processor with SGX technology. With the Intel Turbo Boost Technology these machines can go up to 5.0GHz. DCv2 series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

- [Dv2 and Dsv2-series](dv2-dsv2-series.md) VMs, a follow-on to the original D-series, features a more powerful CPU and optimal CPU-to-memory configuration making them suitable for most production workloads. The Dv2-series is about 35% faster than the D-series. Dv2-series run on 2nd Generation Intel® Xeon® Platinum 8272CL (Cascade Lake), Intel® Xeon® 8171M 2.1GHz (Skylake), Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors with the Intel Turbo Boost Technology 2.0. The Dv2-series has the same memory and disk configurations as the D-series.

- [Dv3 and Dsv3-series](dv3-dsv3-series.md) VMs run on 2nd Generation Intel® Xeon® Platinum 8272CL (Cascade Lake), Intel® Xeon® 8171M 2.1GHz (Skylake), Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors in a hyper-threaded configuration, providing a better value proposition for most general purpose workloads. Memory has been expanded (from ~3.5 GiB/vCPU to 4 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyperthreading. The Dv3-series no longer has the high memory VM sizes of the D/Dv2-series, those have been moved to the memory optimized [Ev3 and Esv3-series](ev3-esv3-series.md).

- [Dv4 and Dsv4-series](dv4-dsv4-series.md) VMs run on the 2nd Generation Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors, providing a better value proposition for most general-purpose workloads. Dv4 and Dsv4 VMs series are a new category of virtual machines, which rely on remote disks and do not provide temporary local storage. It features a sustained all core Turbo clock speed of 3.4 GHz and features the [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). 

- [Ddv4 and Ddsv4-series](ddv4-ddsv4-series.md) VMs run on the 2nd Generation Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors, providing a better value proposition for most general-purpose workloads. Ddv4 and Ddsv4 VMs series are a new category of virtual machines which include local data temporary disks. It features a sustained all core Turbo clock speed of 3.4 GHz and features the [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). 

## Other sizes

- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
