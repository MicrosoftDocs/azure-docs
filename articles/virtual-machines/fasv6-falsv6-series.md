---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      iamwilliew # GitHub alias
ms.author:   iamwilliew # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     01/29/2024---

# Fasv6,Falsv6 and Famsv6-series

**In this article** 
[Falsv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Fasv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Famsv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Size table definitions](/azure/virtual-machines/dasv5-dadsv5-series) 

[Other sizes and information](/azure/virtual-machines/dasv5-dadsv5-series) 

[Next steps](/azure/virtual-machines/dasv5-dadsv5-series) 

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 
Important 
Azure Virtual Machine Series Falsv6, Fasv6, and Famsv6 are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 
The Falsv6, Fasv6, and Famsv6-series utilize AMD's 4th Generation EPYCTM 9004 processor that can achieve a boosted maximum frequency of 3.7GHz with up to 320 MB L3 cache.  The Falsv6, Fasv6, and Famsv6 VM series come without Simultaneous Multithreading (SMT), meaning a vCPU is now mapped to a full physical core, allowing software processes to run on dedicated and uncontested resources. These new full core VMs will suit workloads demanding the highest CPU performance. Falsv6, Fasv6, and Famsv6-series offer up to 64 full core vCPUs and 512 GiB of RAM in three memory to core ratios, and are optimized for scientific simulations, financial and risk analysis, gaming, rendering and other workloads able to take advantage of the exceptional performance. Customers running software licensed on per-vCPU basis can leverage these VMs to optimize compute costs within their infrastructure. 
**Note** 
For frequently asked questions, see **[Azure VM sizes with no local temp disk](/azure/virtual-machines/azure-vms-no-temp-disk)**. 
The Falsv6, Fasv6, and Famsv6-series virtual machines do not have any temporary storage. You can attach Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

Premium Storage: Supported   
Premium Storage caching: Supported   
Live Migration: Not Supported for Preview   
Memory Preserving Updates: Supported   
VM Generation Support: Generation 2   
Accelerated Networking: Supported   
Ephemeral OS Disks: Not Supported   
Nested Virtualization: Supported 

## Fasv6-series
 
| Size              | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps1 | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps1 | Max NICs | Max network bandwidth (Mbps) |
|-------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2as_v6  | 2    | 8           | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4as_v6  | 4    | 16          | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8as_v6  | 8    | 32          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16as_v6 | 16   | 64          | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32as_v6 | 32   | 128         | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48as_v6 | 48   | 192         | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64as_v6 | 64   | 256         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | 36000                        |

## Falsv6-series 

| Size               | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps1 | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps1 | Max NICs | Max network bandwidth (Mbps) |
|--------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2als_v6  | 2    | 4           | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4als_v6  | 4    | 8           | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8als_v6  | 8    | 16          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16als_v6 | 16   | 32          | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32als_v6 | 32   | 64          | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48als_v6 | 48   | 96          | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64als_v6 | 64   | 128         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | C                            |

## Famsv6-series 

| Size               | vCPU | Memory: GiB | Local NVMe Temporary storage (SSD) GiB   | Max data disks | Max uncached Premium SSD disk throughput: IOPS/MBps | Max burst uncached Premium SSD disk throughput: IOPS/MBps1 | Max uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps | Max burst uncached Ultra Disk and Premium SSD V2 disk throughput: IOPS/MBps1 | Max NICs | Max network bandwidth (Mbps) |
|--------------------|------|-------------|------------------------------------------|----------------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------|----------|------------------------------|
| Standard_F2ams_v6  | 2    | 16          | Remote Storage Only                      | 4              | 4000/90                                             | 20000/1250                                                 | 8000/90                                                               | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F4ams_v6  | 4    | 32          | Remote Storage Only                      | 8              | 7600/180                                            | 20000/1250                                                 | 15200/180                                                             | 20000/1250                                                                   | 2        | 12500                        |
| Standard_F8ams_v6  | 8    | 64          | Remote Storage Only                      | 16             | 15200/360                                           | 40000/1250                                                 | 30400/360                                                             | 80000/1250                                                                   | 4        | 12500                        |
| Standard_F16ams_v6 | 16   | 128         | Remote Storage Only                      | 32             | 30400/720                                           | 40000/1250                                                 | 60800/720                                                             | 80000/1250                                                                   | 8        | 16000                        |
| Standard_F32ams_v6 | 32   | 256         | Remote Storage Only                      | 32             | 57600/1440                                          | 57600/1700                                                 | 115200/1440                                                           | 115200/1700                                                                  | 8        | 20000                        |
| Standard_F48ams_v6 | 48   | 384         | Remote Storage Only                      | 32             | 86400/2160                                          | 86400/2550                                                 | 172800/2160                                                           | 172800/2550                                                                  | 8        | 28000                        |
| Standard_F64ams_v6 | 64   | 512         | Remote Storage Only                      | 32             | 115200/2880                                         | 115200/3400                                                | 230400/2880                                                           | 230400/3400                                                                  | 8        | 36000                        |
