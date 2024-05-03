---
title:       Falsv6, Fasv6, and Famsv6-series
description: Specifications for Fasv6, Falsv6 and Famsv6 
author:      iamwilliew 
ms.author:   wwilliams
ms.service:  virtual-machines
ms.subservice: sizes
ms.topic:    conceptual
ms.date:     01/29/2024
---

# Falsv6, Fasv6, and Famsv6-series (Preview)

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 

> [!Important]
> Azure Virtual Machine Series Falsv6, Fasv6, and Famsv6 are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

The Falsv6, Fasv6, and Famsv6-series utilize AMD's 4th Generation EPYC<sup>TM</sup> 9004 processor that can achieve a boosted maximum frequency of 3.7GHz with up to 320 MB L3 cache.  The Falsv6, Fasv6, and Famsv6 VM series come without Simultaneous Multithreading (SMT), meaning a vCPU is now mapped to a full physical core, allowing software processes to run on dedicated and uncontested resources. These new full core VMs will suit workloads demanding the highest CPU performance. 

Falsv6, Fasv6, and Famsv6-series offer up to 64 full core vCPUs and 512 GiB of RAM in three memory to core ratios, and are optimized for scientific simulations, financial and risk analysis, gaming, rendering and other workloads able to take advantage of the exceptional performance. Customers running software licensed on per-vCPU basis can leverage these VMs to optimize compute costs within their infrastructure. 

> [!NOTE]
>
> For frequently asked questions, see **[Azure VM sizes with no local temp disk](/azure/virtual-machines/azure-vms-no-temp-disk)**. The Falsv6, Fasv6, and Famsv6-series virtual machines do not have any temporary storage. You can attach Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).
>
> The new Falsv6, Fasv6, and Famsv6 VM series will only work on OS images that are tagged with NVMe support.  If your current OS image is not supported for NVMe, you’ll see an error message. NVMe support is available in 50+ of the most popular OS images, and we continuously improve the OS image coverage. Please refer to our up-to-date [lists](enable-nvme-interface.md) for information on which OS images are tagged as NVMe supported.  For more information on NVMe enablement, see our [FAQ](enable-nvme-faqs.yml).
>
> The new Falsv6, Fasv6, and Famsv6VM series virtual machines public preview now available. For more information and to sign up for the preview, please visit our [announcement](https://techcommunity.microsoft.com/t5/azure-compute-blog/public-preview-new-amd-based-vms-with-increased-performance/ba-p/3981351) and follow the link to the [sign-up form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR9RmLSiOpIpImo4Q01A_jJlUM1ZSRVlYU04wMUJQVjNQRFZHQzdEVFc1VyQlQCN0PWcu). This is an opportunity to experience our latest innovation. 

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

## Falsv6-series (2:1 memory to vCPU ratio)

| Size               | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps<sup>1</sup> | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|--------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2als_v6  | 2    | 4           | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4als_v6  | 4    | 8           | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8als_v6  | 8    | 16          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16als_v6 | 16   | 32          | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32als_v6 | 32   | 64          | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48als_v6 | 48   | 96          | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64als_v6 | 64   | 128         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | 36,000                            |

## Fasv6-series (4:1 memory to vCPU ratio)

| Size              | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps<sup>1</sup> | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|-------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2as_v6  | 2    | 8           | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4as_v6  | 4    | 16          | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8as_v6  | 8    | 32          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16as_v6 | 16   | 64          | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32as_v6 | 32   | 128         | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48as_v6 | 48   | 192         | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64as_v6 | 64   | 256         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | 36000                        |

## Famsv6-series (8:1 memory to vCPU ratio)

| Size               | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps<sup>1</sup> | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|--------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2ams_v6  | 2    | 16          | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4ams_v6  | 4    | 32          | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8ams_v6  | 8    | 64          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16ams_v6 | 16   | 128         | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32ams_v6 | 32   | 256         | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48ams_v6 | 48   | 384         | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64ams_v6 | 64   | 512         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | 36000                        |


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

[Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
