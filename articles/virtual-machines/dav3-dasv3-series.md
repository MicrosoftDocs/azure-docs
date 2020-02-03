---
 title: Dav3 and Dasv3-series - Azure Virtual Machines
 description: Specifications for the Dav3 and Dasv3-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# Dav3 and Dasv3-series (Preview)

The Dav3 and Dasv3-series are new preview sizes utilizing AMD’s 2.35Ghz EPYC<sup>TM</sup> 7452V processor in a multi-threaded configuration with up to 256 GB L3 cache dedicating 8 GB of that L3 cache to every 8 cores increasing customer options for running their general purpose workloads. The Dav3 and Dasv3-series have the same memory and disk configurations as the Dv3 & Dsv3-series.

## Dav3-series (Preview)

Dav3-series sizes are based on the 2.35Ghz AMD EPYC<sup>TM</sup> 7452V processor that can achieve a boosted Fmax of 3.35 GHz. The Dav3-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads. Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Dasv3 sizes. The pricing and billing meters for Dasv3 sizes are the same as the Dav3-series.

Premium Storage: Not Supported

Premium Storage caching: Not Supported

[Sign up for the preview](http://aka.ms/azureamdpreview).

| Size | vCPU | Memory: GiB | Temp storage (SSD): GiB |
|---|---|---|---|
| Standard_D2a_v3  | 2  | 8   | 50   |
| Standard_D4a_v3  | 4  | 16  | 100  |
| Standard_D8a_v3  | 8  | 32  | 200  |
| Standard_D16a_v3 | 16 | 64  | 400  |
| Standard_D32a_v3 | 32 | 128 | 800  |
| Standard_D48a_v3 | 48 | 192 | 1200 |
| Standard_D64a_v3 | 64 | 256 | 1600 |

## Dasv3-series (Preview)

Dasv3-series sizes are based on the 2.35Ghz AMD EPYC<sup>TM</sup> 7452V processor that can achieve a boosted Fmax of 3.35 GHz and use premium storage. The Dasv3-series sizes offer a combination of vCPU, memory, and temporary storage for most production workloads.

Premium Storage: Supported

Premium Storage caching: Supported

[Sign up for the preview](http://aka.ms/azureamdpreview).

| Size | vCPU | Memory: GiB | Temp storage (SSD): GiB |
|---|---|---|---|
| Standard_D2as_v3  | 2  | 8   | 16  |
| Standard_D4as_v3  | 4  | 16  | 32  |
| Standard_D8as_v3  | 8  | 32  | 64  |
| Standard_D16as_v3 | 16 | 64  | 128 |
| Standard_D32as_v3 | 32 | 128 | 256 |
| Standard_D48as_v3 | 48 | 192 | 384 |
| Standard_D64as_v3 | 64 | 256 | 512 |

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