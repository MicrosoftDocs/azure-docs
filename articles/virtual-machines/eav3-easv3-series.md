---
 title: Eav3-series and Easv3-series - Azure Virtual Machines
 description: Specifications for the Eav3 and Easv3-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# Eav3 and Easv3-series (Preview)

The preview sizes of Eav3-series and Easv3-series utilize AMD’s 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256 MB L3 cache, increasing options for running most memory optimized workloads. The Eav3-series and Easv3-series have the same memory and disk configurations as the Ev3 & Esv3-series.

## Eav3-series (Preview)

Premium Storage: Not Supported

Premium Storage caching: Not Supported

Eav3-series sizes are based on the 2.35 Ghz AMD EPYC<sup>TM</sup> 7452 processor that can achieve a boosted Fmax of 3.35 GHz and use premium storage. The Eav3-series sizes are ideal for memory-intensive enterprise applications. Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Easv3-series sizes. The pricing and billing meters for Easv3 sizes are the same as the Eav3-series.

[Sign up for the preview](http://aka.ms/azureamdpreview).

| Size | vCPU | Memory: GiB | Temp storage (SSD): GiB |
|---|---|---|---|
| Standard_E2a_v3  | 2  | 16  | 50   |
| Standard_E4a_v3  | 4  | 32  | 100  |
| Standard_E8a_v3  | 8  | 64  | 200  |
| Standard_E16a_v3 | 16 | 128 | 400  |
| Standard_E32a_v3 | 32 | 256 | 800  |
| Standard_E48a_v3 | 48 | 384 | 1200 |
| Standard_E64a_v3 | 64 | 432 | 1600 |

## Easv3-series (Preview)

Premium Storage: Supported

Premium Storage caching: Supported

Easv3-series sizes are based on the 2.35Ghz AMD EPYC<sup>TM</sup> 7452 processor that can achieve a boosted Fmax of 3.35 GHz and use premium storage. The Easv3-series sizes are ideal for memory-intensive enterprise applications.

[Sign up for the preview](http://aka.ms/azureamdpreview).

| Size | vCPU | Memory: GiB | Temp storage (SSD): GiB |
|---|---|---|---|
| Standard_E2as_v3  | 2  | 16  | 32  |
| Standard_E4as_v3  | 4  | 32  | 64  |
| Standard_E8as_v3  | 8  | 64  | 128 |
| Standard_E16as_v3 | 16 | 128 | 256 |
| Standard_E32as_v3 | 32 | 256 | 512 |
| Standard_E48as_v3 | 48 | 384 | 768 |
| Standard_E64as_v3 | 64 | 432 | 864 |

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