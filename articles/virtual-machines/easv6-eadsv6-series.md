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

# Easv6 and Eadsv6-series

**In this article** 
[Easv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Eadsv6-series](/azure/virtual-machines/dasv5-dadsv5-series) 

[Size table definitions](/azure/virtual-machines/dasv5-dadsv5-series) 

[Other sizes and information](/azure/virtual-machines/dasv5-dadsv5-series) 

[Next steps](/azure/virtual-machines/dasv5-dadsv5-series) 

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets ✔️ Uniform scale sets 
Important 
Azure Virtual Machine Series Easv6 and Eadsv6 are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 
The Easv6-series and Eadsv6-series utilize AMD's 4th Generation EPYCTM 9004 processor in a multi-threaded configuration with up to 320 MB L3 cache, increasing customer options for running most memory optimized workloads. The Easv6-series VMs are ideal for memory-intensive enterprise applications, data warehousing, business intelligence, in-memory analytics, and financial transactions. 

## Easv6-series 
Easv6-series VMs utilize AMD's 4th Generation EPYCTM 9004 processors that can achieve a boosted maximum frequency of 3.7GHz. These virtual machines offer up to 96 vCPU and 672 GiB of RAM. The Easv6-series sizes offer a combination of vCPU and memory that is ideal for memory-intensive enterprise applications. The new VMs with no local disk provide a better value proposition for workloads that do not require local temporary storage. 
 **Note** 
For frequently asked questions, see **[Azure VM sizes with no local temp disk](/azure/virtual-machines/azure-vms-no-temp-disk)**. 
Easv6-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported

## Eadsv6-series 
Eadsv6-series VMs utilize AMD's 4th Generation EPYCTM 9004 processors that can achieve a boosted maximum frequency of 3.7GHz. These virtual machines offer up to 96 vCPU and 672 GiB of RAM. The Eadsv6-series sizes offer a combination of vCPU, memory and fast local NVMe temporary storage that is ideal for memory-intensive enterprise applications. 
Eadsv6-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](/azure/virtual-machines/premium-storage-performance): Supported   
[Premium Storage caching](/azure/virtual-machines/premium-storage-performance): Supported   
[Live Migration](/azure/virtual-machines/maintenance-and-updates): Not Supported for Preview   
[Memory Preserving Updates](/azure/virtual-machines/maintenance-and-updates): Supported   
[VM Generation Support](/azure/virtual-machines/generation-2): Generation 2   
[Accelerated Networking](/azure/virtual-network/create-vm-accelerated-networking-cli): Supported   
[Ephemeral OS Disks](/azure/virtual-machines/ephemeral-os-disks): Not Supported for Preview   
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported 
