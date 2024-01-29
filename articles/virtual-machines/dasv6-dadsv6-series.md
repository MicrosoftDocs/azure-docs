---
title: 'Dasv5 and Dadsv5-series - Azure Virtual Machines'
description: Specifications for the Dasv5 and Dadsv5-series VMs.
author: ju-shim
ms.author: jushiman
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/8/2021
---

# Dasv6 and Dadsv6-series

**In this article** 

[Dasv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Dadsv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Size table definitions](/azure/virtual-machines/dasv5-dadsv5-series) 

[Other sizes and information](/azure/virtual-machines/dasv5-dadsv5-series) 

[Next steps](/azure/virtual-machines/dasv5-dadsv5-series) 

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 
Important 
Azure Virtual Machine Series Dasv6 and Dadsv6 are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 
The Dasv6-series and Dadsv6-series utilize AMD's 4th Generation EPYCTM 9004 processor in a multi-threaded configuration with up to 320 MB L3 cache, increasing customer options for running their general-purpose workloads. The Dasv6-series VMs work well for many general computing workloads, such as e-commerce systems, web front ends, desktop virtualization solutions, customer relationship management applications, entry-level and mid-range databases, application servers, and more. 
**Dasv6-series** 
Dasv6-series VMs utilize AMD's 4th Generation EPYCTM 9004 processors that can achieve a boosted maximum frequency of 3.7GHz. These virtual machines offer up to 96 vCPU and 384 GiB of RAM. The Dasv6-series sizes offer a combination of vCPU and memory for most production workloads. The new VMs with no local disk provide a better value proposition for workloads that do not require local temporary storage. 
 **Note** 
For frequently asked questions, see **[Azure VM sizes with no local temp disk](/azure/virtual-machines/azure-vms-no-temp-disk)**. 
Dasv6-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 
[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator : [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
