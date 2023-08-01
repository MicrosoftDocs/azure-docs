---
title: Azure ECas_cc_v5 and ECads_cc_v5-series
description: Specifications for Azure Confidential Computing's Azure ECas_cc_v5 and ECads_cc_v5-series confidential computing capable virtual machines. 
author: ananyagarg
ms.author: ananyagarg
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 03/29/2022

---

# ECas_cc_v5 and ECads_cc_v5-series (Preview)

**Applies to:** :heavy_check_mark: Linux VMs in Azure Kubernetes Service

> [!NOTE]
> Preview Terms - These VM sizes are subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Confidential child capable VMs are currently enabled only through [Azure Kubernetes Service (AKS)](../../articles/aks/index.yml) when you choose these VMs as your agent node sizes. If you wish to enable it outside AKS, please contact [azconfidentialpm@microsoft.com](mailto:azconfidentialpm@microsoft.com).

Confidential child capable VMs allow you to borrow resources from the parent VM you deploy, to create AMD SEV-SNP protected child VMs. The parent VM has almost complete feature parity with any other general purpose Azure VM (for example, [E-series VMs](easv5-eadsv5-series.md)). This parent-child deployment model can help you achieve higher levels of isolation from the Azure host and parent VM. These confidential child capable VMs are built on the same hardware that powers our [Azure confidential VMs](../../articles/confidential-computing/confidential-vm-overview.md). Azure confidential VMs are now generally available.  

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/). For more information on disk types, see [What disk types are available in Azure?](disks-types.md)


> [!NOTE]
> There are some [pricing differences based on your encryption settings](../../articles/confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for nested confidential VMs.

### ECas_cc_v5-series products


The ECas_cc_v5-series sizes offer a combination of vCPU and memory for most production workloads. The ECas_cc_v5-series sizes offer a combination of vCPU and memory that is ideal for memory-intensive enterprise applications. These new VMs with no local disk provide a better value proposition for workloads that do not require local temp disk.

[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Not Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported <br>
[VM Generation Support](generation-2.md): Generation 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>


| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_EC4as_cc_v5  | 4  | 32  | Remote Storage Only | 8  | 6400/144   | 2 |
| Standard_EC8as_cc_v5  | 8  | 64  | Remote Storage Only | 16 | 12800/200  | 4 |
| Standard_EC16as_cc_v5 | 16 | 128 | Remote Storage Only | 32 | 25600/384  | 4 |
| Standard_EC20as_cc_v5 | 20 | 160 | Remote Storage Only | 32 | 32000/480  | 8 |
| Standard_EC32as_cc_v5 | 32 | 256 | Remote Storage Only | 32 | 51200/768  | 8 |
| Standard_EC48as_cc_v5 | 48 | 384 | Remote Storage Only | 32 | 76800/1152 | 8 |
| Standard_EC64as_cc_v5 | 64 | 512 | Remote Storage Only | 32 | 80000/1200 | 8 |
| Standard_EC96as_cc_v5 | 96 | 672 | Remote Storage Only | 32 | 80000/1600 | 8 |


### ECads_cc_v5-series products

The ECads_cc_v5-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads. The ECads_cc_v5-series sizes offer a combination of vCPU, memory and temporary storage that is ideal for memory-intensive enterprise applications. 

[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Not Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported <br>
[VM Generation Support](generation-2.md): Generation 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_EC4ads_cc_v5  | 4  | 32  | 150 | 8  | 6400/144   | 2 |
| Standard_EC8ads_cc_v5  | 8  | 64  | 300 | 16 | 12800/200  | 4 |
| Standard_EC16ads_cc_v5 | 16 | 128 | 600 | 32 | 25600/384  | 4 |
| Standard_EC20ads_cc_v5 | 20 | 160 | 750 | 32 | 32000/480  | 8 |
| Standard_EC32ads_cc_v5 | 32 | 256 | 1200 | 32 | 51200/768  | 8 |
| Standard_EC48ads_cc_v5 | 48 | 384 | 1800 | 32 | 76800/1152 | 8 |
| Standard_EC64ads_cc_v5 | 64 | 512 | 2400 | 32 | 80000/1200 | 8 |
| Standard_EC96ads_cc_v5 | 96 | 672 | 3600 | 32 | 80000/1600 | 8 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)


## Next steps

> [!div class="nextstepaction"]
> [Confidential virtual machine options on AMD processors](../../articles/confidential-computing/confidential-vm-overview.md)
