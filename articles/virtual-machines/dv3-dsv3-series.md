---
 title: Dv3 and Dsv3-series - Azure Virtual Machines
 description: Specifications for the Dv3 and Dsv3-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# Dv3 and Dsv3-series

Dv3 and Dsv3-series, a follow-on to the original D-series, features a more powerful CPU and optimal CPU-to-memory configuration making them suitable for most production workloads.  Memory has been expanded (from ~3.5 GiB/vCPU to 4 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyperthreading. The Dv3 and Dsv3-series no longer has the high memory VM sizes of the D/Dv2 families, those have been moved to the new Ev3 family. Example use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

## Dv3-series

Dv3-series sizes are based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor or 2.3 GHz Intel XEON ® E5-2673 v4 (Broadwell) processor that can achieve 3.5GHz with Intel Turbo Boost Technology 2.0 and also utilize Intel® Hyper-Threading Technology. The Dv3-series sizes offer a combination of vCPU, memory, and temporary storage for most production workloads.

Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Dsv3 sizes. The pricing and billing meters for Dsv3 sizes are the same as Dv3-series.

ACU: 160-190

Premium Storage:  Not Supported

Premium Storage caching:  Not Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max NICs/Network bandwidth |
|---|---|---|---|---|---|---|
| Standard_D2_v3  | 2  | 8   | 50   | 4  | 3000/46/23     | 2/1000  |
| Standard_D4_v3  | 4  | 16  | 100  | 8  | 6000/93/46     | 2/2000  |
| Standard_D8_v3  | 8  | 32  | 200  | 16 | 12000/187/93   | 4/4000  |
| Standard_D16_v3 | 16 | 64  | 400  | 32 | 24000/375/187  | 8/8000  |
| Standard_D32_v3 | 32 | 128 | 800  | 32 | 48000/750/375  | 8/16000 |
| Standard_D48_v3 | 48 | 192 | 1200 | 32 | 96000/1000/500 | 8/24000 |
| Standard_D64_v3 | 64 | 256 | 1600 | 32 | 96000/1000/500 | 8/30000 |

## Dsv3-series

Dsv3-series sizes are based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor or the latest 2.3 GHz Intel XEON ® E5-2673 v4 (Broadwell) processor that can achieve 3.5GHz with Intel Turbo Boost Technology 2.0, use premium storage, and also utilize Intel® Hyper-Threading Technology. The Dsv3-series sizes offer a combination of vCPU, memory, and temporary storage for most production workloads.

ACU: 160-190

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs/Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2s_v3  | 2  | 8   | 16  | 4  | 4000/32 (50)       | 3200/48    | 2/1000  |
| Standard_D4s_v3  | 4  | 16  | 32  | 8  | 8000/64 (100)      | 6400/96    | 2/2000  |
| Standard_D8s_v3  | 8  | 32  | 64  | 16 | 16000/128 (200)    | 12800/192  | 4/4000  |
| Standard_D16s_v3 | 16 | 64  | 128 | 32 | 32000/256 (400)    | 25600/384  | 8/8000  |
| Standard_D32s_v3 | 32 | 128 | 256 | 32 | 64000/512 (800)    | 51200/768  | 8/16000 |
| Standard_D48s_v3 | 48 | 192 | 384 | 32 | 96000/768 (1200)   | 76800/1152 | 8/24000 |
| Standard_D64s_v3 | 64 | 256 | 512 | 32 | 128000/1024 (1600) | 80000/1200 | 8/30000 |

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