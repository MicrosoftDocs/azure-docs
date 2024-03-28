---
title:       'Easv6 and Eadsv6-series - Azure Virtual Machines'
description: Specifications for the Easv6 and Eadsv6-series VMs.
author:      iamwilliew 
ms.author:   wwilliams
ms.service:  virtual-machines
ms.subservice: sizes
ms.topic:    conceptual
ms.date:     01/29/2024
---

# Easv6 and Eadsv6-series (Preview)

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 

> [!IMPORTANT]
> Azure Virtual Machine Series Easv6 and Eadsv6 are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

The Easv6-series and Eadsv6-series utilize AMD's 4th Generation EPYC<sup>TM</sup> 9004 processor in a multi-threaded configuration with up to 320 MB L3 cache, increasing customer options for running most memory optimized workloads. The Easv6-series VMs are ideal for memory-intensive enterprise applications, data warehousing, business intelligence, in-memory analytics, and financial transactions. 

> [!NOTE]
> The new Easv6 and Eadsv6 VM series will only work on OS images that are tagged with NVMe support.  If your current OS image is not supported for NVMe, you’ll see an error message. NVMe support is available in 50+ of the most popular OS images, and we continuously improve the OS image coverage. Please refer to our up-to-date [lists](./enable-nvme-interface.md) for information on which OS images are tagged as NVMe supported.  For more information on NVMe enablement, see our [FAQ](./enable-nvme-faqs.yml).
>
> The new Easv6 and Eadsv6 VM series virtual machines public preview now available. For more information and to sign up for the preview, please visit our [announcement](https://techcommunity.microsoft.com/t5/azure-compute-blog/public-preview-new-amd-based-vms-with-increased-performance/ba-p/3981351) and follow the link to the [sign-up form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR9RmLSiOpIpImo4Q01A_jJlUM1ZSRVlYU04wMUJQVjNQRFZHQzdEVFc1VyQlQCN0PWcu). This is an opportunity to experience our latest innovation. 


## Easv6-series 
Easv6-series VMs utilize AMD's 4th Generation EPYC<sup>TM</sup> 9004 processors that can achieve a boosted maximum frequency of 3.7GHz. These virtual machines offer up to 96 vCPU and 672 GiB of RAM. The Easv6-series sizes offer a combination of vCPU and memory that is ideal for memory-intensive enterprise applications. The new VMs with no local disk provide a better value proposition for workloads that do not require local temporary storage. 

> [!Note]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](/azure/virtual-machines/azure-vms-no-temp-disk).

Easv6-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported

| Size              | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB    | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps<sup>1</sup> | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|-------------------|------|-------------|-------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_E2as_v6  | 2    | 16          | Remote Storage Only                       | 4              | 4000/90                                             | 20000/1250                                                 | 4000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_E4as_v6  | 4    | 32          | Remote Storage Only                       | 8              | 7600/180                                            | 20000/1250                                                 | 7600/180                                                              | 20000/1250                                                                   | 2        | 12500                        |
| Standard_E8as_v6  | 8    | 64          | Remote Storage Only                       | 16             | 15200/360                                           | 20000/1250                                                 | 15200/360                                                             | 20000/1250                                                                   | 4        | 12500                        |
| Standard_E16as_v6 | 16   | 128         | Remote Storage Only                       | 32             | 30400/720                                           | 40000/1250                                                 | 30400/720                                                             | 40000/1250                                                                   | 8        | 16000                        |
| Standard_E20as_v6 | 20   | 160         | Remote Storage Only                       | 32             | 38000/900                                           | 64000/1600                                                 | 38000/900                                                             | 64000/1600                                                                   | 8        | 16000                        |
| Standard_E32as_v6 | 32   | 256         | Remote Storage Only                       | 32             | 57600/1440                                          | 80000/1700                                                 | 57600/1440                                                            | 80000/1700                                                                   | 8        | 20000                        |
| Standard_E48as_v6 | 48   | 384         | Remote Storage Only                       | 32             | 86400/2160                                          | 90000/2550                                                 | 86400/2160                                                            | 90000/2550                                                                   | 8        | 28000                        |
| Standard_E64as_v6 | 64   | 512         | Remote Storage Only                       | 32             | 115200/2880                                         | 120000/3400                                                | 115200/2880                                                           | 120000/3400                                                                  | 8        | 36000                        |
| Standard_E96as_v6 | 96   | 672         | Remote Storage Only                       | 32             | 175000/4320                                         | 175000/5090                                                | 175000/4320                                                           | 175000/5090                                                                  | 8        | 40000                        |

<sup>1</sup> Easv6-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

## Eadsv6-series 
Eadsv6-series VMs utilize AMD's 4th Generation EPYC<sup>TM</sup> 9004 processors that can achieve a boosted maximum frequency of 3.7GHz. These virtual machines offer up to 96 vCPU and 672 GiB of RAM. The Eadsv6-series sizes offer a combination of vCPU, memory and fast local NVMe temporary storage that is ideal for memory-intensive enterprise applications. 
Eadsv6-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 

| Size               | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps<sup>1</sup> | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) | Max temp storage read throughput: IOPS / MBps |
|--------------------|------|-------------|------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|-----------------------------------------------|
| Standard_E2ads_v6  | 2    | 16          | 1x110 GiB                          | 4              | 4000/90                                             | 20000/1250                                                 | 4000/90                                                               | 20000/1250                                                                   | 2        | 12500                        | 37500/180                                     |
| Standard_E4ads_v6  | 4    | 32          | 1x220 GiB                          | 8              | 7600/180                                            | 20000/1250                                                 | 7600/180                                                              | 20000/1250                                                                   | 2        | 12500                        | 75000/360                                     |
| Standard_E8ads_v6  | 8    | 64          | 1x440 GiB                          | 16             | 15200/360                                           | 20000/1250                                                 | 15200/360                                                             | 20000/1250                                                                   | 4        | 12500                        | 150000/720                                    |
| Standard_E16ads_v6 | 16   | 128         | 2x440 GiB                          | 32             | 30400/720                                           | 40000/1250                                                 | 30400/720                                                             | 40000/1250                                                                   | 8        | 16000                        | 300000/1440                                   |
| Standard_E20ads_v6 | 20   | 160         | 2x550 GiB                          | 32             | 38000/900                                           | 64000/1600                                                 | 38000/900                                                             | 64000/1600                                                                   | 8        | 16000                        | 375000/1800                                   |
| Standard_E32ads_v6 | 32   | 256         | 4x440 GiB                          | 32             | 57600/1440                                          | 80000/1700                                                 | 57600/1440                                                            | 80000/1700                                                                   | 8        | 20000                        | 600000/2880                                   |
| Standard_E48ads_v6 | 48   | 384         | 6x440 GiB                          | 32             | 86400/2160                                          | 90000/2550                                                 | 86400/2160                                                            | 90000/2550                                                                   | 8        | 28000                        | 900000/4320                                   |
| Standard_E64ads_v6 | 64   | 512         | 4x880 GiB                          | 32             | 115200/2880                                         | 120000/3400                                                | 115200/2880                                                           | 120000/3400                                                                  | 8        | 36000                        | 1200000/5760                                  |
| Standard_E96ads_v6 | 96   | 672         | 6x880 GiB                          | 32             | 175000/4320                                         | 175000/5090                                                | 175000/4320                                                           | 175000/5090                                                                  | 8        | 40000                        | 1800000/8640                                  |

<sup>1</sup> Eadsv6-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
