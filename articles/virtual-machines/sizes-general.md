---
title: Azure VM sizes - General purpose | Microsoft Docs
description: Lists the different general purpose sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines
documentationcenter: ''
author: jonbeck7
manager: gwallace
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: jonbeck
---

# General purpose virtual machine sizes

[B-series burstable](sizes-b-series-burstable.md) VMs allow you to choose which VM size provides you the necessary base level performance for your workload, with the ability to burst CPU performance up to 100% of an Intel® Broadwell E5-2673 v4 2.3 GHz, or an Intel® Haswell 2.4 GHz E5-2673 v3 processor vCPU.

The [DC-series](dc-series.md) is a family of virtual machines in Azure that helps protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. These machines are backed by the latest generation of 3.7 GHz Intel XEON E-2176G Processor with SGX technology. With the Intel Turbo Boost Technology, these machines can go up to 4.7 GHz. DC series instances enable customers to build secure enclave-based applications to protect their code and data while it’s in use.

The [Av2-series](av2-series.md) VMs can be deployed on a variety of hardware types and processors. A-series VMs have CPU performance and memory configurations best suited for entry level workloads like development and test. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine. Example use cases include development and test servers, low traffic web servers, small to medium databases, proof-of-concepts, and code repositories.

[Dv2 and Dsv2-series](dv2-dsv2-series.md) VMs, a follow-on to the original D-series, features a more powerful CPU and optimal CPU-to-memory configuration making them suitable for most production workloads. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation Intel Xeon® E5-2673 v3 2.4 GHz (Haswell) or E5-2673 v4 2.3 GHz (Broadwell) processors, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

[Dv3 and Dsv3-series](dv3-dsv3-series.md) VMs feature the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor or the latest 2.3 GHz Intel XEON ® E5-2673 v4 (Broadwell) processor in a hyper-threaded configuration, providing a better value proposition for most general purpose workloads.  Memory has been expanded (from ~3.5 GiB/vCPU to 4 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyperthreading. The Dv3 no longer has the high memory VM sizes of the D/Dv2 families, those have been moved to the new Ev3 family. Example use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

[Dav4 and Dasv4-series](dav4-dasv4-series.md) are new sizes utilizing AMD’s 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256 MB L3 cache dedicating 8 GB of that L3 cache to every 8 cores increasing customer options for running their general purpose workloads. The Dav4-series and Dasv4-series have the same memory and disk configurations as the D & Dsv3-series.

## Other sizes

- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.