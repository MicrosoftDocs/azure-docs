---
title: 'Bpsv2 Series (preview)' #Required; page title is displayed in search results. 60 characters max.
description: Overview of Bpsv2 ARM series; this appears in search as the short description
author:  iamwilliew
ms.author:  wwilliams
ms.service: virtual-machines 
ms.subservice: sizes 
ms.topic: conceptual 
ms.date: 06/09/2023 

---

# Bpsv2-series (Public Preview)

The Bpsv2-series virtual machines are based on the Arm architecture, featuring the Ampere® Altra® Arm-based processor operating at 3.0 GHz, delivering outstanding price-performance for general-purpose workloads, These virtual machines offer a range of VM sizes, from 0.5 GiB to up to 4 GiB of memory per vCPU, to meet the needs of applications that do not need the full performance of the CPU continuously, such as development and test servers, low traffic web servers, small databases, micro services, servers for proof-of-concepts, build servers, and code repositories. These workloads typically have burstable performance requirements. The Bpsv2-series VMs provides you with the ability to purchase a VM size with baseline performance that can build up credits when it is using less than its baseline performance. When the VM has accumulated credits, the VM can burst above the baseline using up to 100% of the vCPU when your application requires higher CPU performance.

## Bpsv2-series
Bpsv2 VMs offer up to 16 vCPU and 64 GiB of RAM and are optimized for scale-out and most enterprise workloads. Bpsv2-series virtual machines support Standard SSD, Standard HDD, Premium SSd disk types with no local-SSD support (i.e. no local or temp disk) and you can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).


[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br> 

| Size               | vCPU | RAM | Base CPU Performance / vCPU (%) | Initial Credits (#) | Credits banked/hour | Max Banked Credits (#) | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max Data Disks | Max Network Bandwidth (Gbps) (up to) | Max NICs |
|--------------------|------|-----|--------------------------------|---------------------|---------------------|------------------------|-----------------------------------------|-----------------------------------------------|----------------|------------------------------|----------|
| Standard_B2pts_v2  | 2    | 1   | 20%                            | 60                  | 24                  | 576                    | 3750/85                                 | 10,000/960                                    | 4              | 6.250                        | 2        |
| Standard_B2pls_v2  | 2    | 4   | 30%                            | 60                  | 24                  | 576                    | 3750/85                                 | 10,000/960                                    | 4              | 6.250                         | 2        |
| Standard_B2ps_v2   | 2    | 8   | 40%                            | 60                  | 24                  | 576                    | 3750/85                                 | 10,000/960                                    | 4              | 6.250                         | 2        |
| Standard_B4pls_v2  | 4    | 8   | 30%                            | 120                 | 48                  | 1152                   | 6,400/145                               | 20,000/960                                    | 8              | 6.250                        | 2        |
| Standard_B4ps_v2   | 4    | 16  | 40%                            | 120                 | 48                  | 1152                   | 6,400/145                               | 20,000/960                                    | 8              | 6.250                        | 2        |
| Standard_B8pls_v2  | 8    | 16  | 30%                            | 240                 | 96                  | 2304                   | 12,800/290                              | 20,000/960                                    | 16             | 6.250                        | 2        |
| Standard_B8ps_v2   | 8    | 32  | 40%                            | 240                 | 96                  | 2304                   | 12,800/290                              | 20,000/960                                    | 16             | 6.250                        | 2        |
| Standard_B16pls_v2 | 16   | 32  | 30%                            | 480                 | 192                 | 4608                   | 25,600/600                              | 40,000/960                                    | 32             | 6.250                        | 4        |
| Standard_B16ps_v2  | 16   | 64  | 40%                            | 480                 | 192                 | 4608                   | 25,600/600                              | 40,000/960                                    | 32             | 6.250                        | 4        |

<sup>*</sup> Accelerated networking is required and turned on by default on all Dpsv5 machines <br>





[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)



More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)
