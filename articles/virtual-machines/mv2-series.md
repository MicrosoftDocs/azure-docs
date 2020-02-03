---
 title: Mv2-series - Azure Virtual Machines
 description: Specifications for the Mv2-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# Mv2-series

The Mv2-series features high throughput, low latency, directly mapped local NVMe storage running on a hyper-threaded Intel® Xeon® Platinum 8180M 2.5GHz (Skylake) processor with an all core base frequency of 2.5 GHz and a max turbo frequency of 3.8 GHz. All Mv2-series virtual machine sizes can use both standard and premium persistent disks. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads, with a high memory-to-CPU ratio that is ideal for relational database servers, large caches, and in-memory analytics.

Premium Storage: Supported

Premium Storage caching: Supported

Write Accelerator: [Supported](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator)

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_M208ms_v2<sup>1, 2</sup> | 208 | 5700 | 4096 | 64 | 80000/800 (7040) | 40000/1000 | 8/16000 |
| Standard_M208s_v2<sup>1, 2</sup>  | 208 | 2850 | 4096 | 64 | 80000/800 (7040) | 40000/1000 | 8/16000 |

Mv2-series VM’s feature Intel® Hyper-Threading Technology  

<sup>1</sup> These large VMs require one of these supported guest OSes: Windows Server 2016, Windows Server 2019, SLES 12 SP4, SLES 15.

<sup>2</sup> Mv2-series VMs are generation 2 only. If you're using Linux, see the following section for how to find and select a SUSE Linux image.

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