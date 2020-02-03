---
 title: Fsv2-series - Azure Virtual Machines
 description: Specifications for the Fsv2-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# Fsv2-series

Fsv2-series is based on the Intel® Xeon® Platinum 8168 processor, featuring a sustained all core Turbo clock speed of 3.4GHz and a maximum single-core turbo frequency of 3.7 GHz. Intel® AVX-512 instructions, which are new on Intel Scalable Processors, will provide up to a 2X performance boost to vector processing workloads on both single and double precision floating point operations. Fsv2-series VMs also feature Intel® Hyper-Threading Technology. In other words, they are fast for any computational workload.

At a lower per-hour list price, the Fsv2-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per vCPU.

ACU: 195 - 210

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU's | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_F2s_v2  | 2  | 4   | 16  | 4  | 4000/31 (32)       | 3200/47    | 2/875   |
| Standard_F4s_v2  | 4  | 8   | 32  | 8  | 8000/63 (64)       | 6400/95    | 2/1750  |
| Standard_F8s_v2  | 8  | 16  | 64  | 16 | 16000/127 (128)    | 12800/190  | 4/3500  |
| Standard_F16s_v2 | 16 | 32  | 128 | 32 | 32000/255 (256)    | 25600/380  | 4/7000  |
| Standard_F32s_v2 | 32 | 64  | 256 | 32 | 64000/512 (512)    | 51200/750  | 8/14000 |
| Standard_F48s_v2 | 48 | 96  | 384 | 32 | 96000/768 (768)    | 76800/1100 | 8/21000 |
| Standard_F64s_v2 | 64 | 128 | 512 | 32 | 128000/1024 (1024) | 80000/1100 | 8/28000 |
| Standard_F72s_v2<sup>1, 2</sup> | 72 | 144 | 576 | 32 | 144000/1152 (1520) | 80000/1100 | 8/30000 |

<sup>1</sup> More than 64 vCPU’s require one of these supported guest OSes: Windows Server 2016, Ubuntu 16.04 LTS, SLES 12 SP2, and Red Hat Enterprise Linux, CentOS 7.3, or Oracle Linux 7.3 with LIS 4.2.1

<sup>2</sup> Instance is isolated to hardware dedicated to a single customer.

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