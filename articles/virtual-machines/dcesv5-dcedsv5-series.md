---
title: Azure DCesv5 and DCedsv5-series confidential virtual machines
description: Specifications for Azure Confidential Computing's DCesv5 and DCedsv5-series confidential virtual machines.
author: michamcr
ms.author: mmcrey
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/14/2023
---

# DCesv5 and DCedsv5-series confidential VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

The DCesv5-series and DCedsv5-series are [Azure confidential VMs](../confidential-computing/confidential-vm-overview.md) which can be used to protect the confidentiality and integrity of your code and data while it's being processed in the public cloud. Organizations can use these VMs to seamlessly bring confidential workloads to the cloud without any code changes to the application. 

These machines are powered by Intel® 4th Generation Xeon® Scalable processors with All Core Frequency of 2.1 GHz, and use Intel® Turbo Boost Max Technology to reach 2.9 GHz.

Featuring [Intel® Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html), these VMs are hardened from the cloud virtualized environment by denying the hypervisor, other host management code and administrators access to the VM memory and state. It helps to protect VMs against a broad range of sophisticated [hardware and software attacks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html). 

These VMs have native support for [confidential disk encryption](disk-encryption-overview.md) meaning organizations can encrypt their VM disks at boot with either a customer-managed key (CMK), or platform-managed key (PMK). This feature is fully integrated with [Azure KeyVault](../key-vault/general/overview.md) or [Azure Managed HSM](../key-vault/managed-hsm/overview.md) with validation for FIPS 140-2 Level 3. For organizations wanting further separation of duties for flexibility over key management, attestation, and disk encryption, these VMs also provide this experience.

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for confidential VMs.

### DCesv5 and DCedsv5-series feature support

*Supported* features include: 

- [Premium Storage](premium-storage-performance.md)
- [Premium Storage caching](premium-storage-performance.md)
- [VM Generation 2](generation-2.md)

*Unsupported* features include:

- [Live Migration](maintenance-and-updates.md)
- [Memory Preserving Updates](maintenance-and-updates.md)
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)
- [Ephemeral OS Disks](ephemeral-os-disks.md) - DCedsv5 only
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)

## DCesv5-series

The DCesv5 offer a balance of memory to vCPU performance which will suit most production workloads. With up to 96 vCPUs, 384 GiB of RAM, and support for remote disk storage. If you require a local disk, please consider DCedsv5-series. These VMs work well for many general computing workloads, e-commerce systems, web front ends, desktop virtualization solutions, sensitive databases, other enterprise applications and more.

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

### DCesv5-series specifications

| Size | vCPU | RAM (GiB) | Temp storage (SSD) GiB | Max data disks | Max temp disk throughput IOPS/MBps | Max uncached disk throughput IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max Network Bandwidth (Mbps) |
|:------:|:----:|:---------:|:------------------------:|:--------------:|:-------------------------------------:|:--------------------------------------:|:-----------------------------------------------:|:--------:|:-------------------------------------:|
| Standard_DC2es_v5 | 2 | 8 | RS* | 4 | N/A | 3750/80 | 10000/1200 | 2 | 3000 |
| Standard_DC4es_v5 | 4 | 16 | RS* | 8 | N/A | 6400/140 | 20000/1200 | 2 | 5000 |
| Standard_DC8es_v5 | 8 | 32 | RS* | 16 | N/A | 12800/300 | 20000/1200 | 4 | 5000 |
| Standard_DC16es_v5 | 16 | 64 | RS* | 32 | N/A | 25600/600 | 40000/1200 | 8 | 10000 |
| Standard_DC32es_v5 | 32 | 128 | RS* | 32 | N/A | 51200/860  	|80000/2000  	|8  	|12500  	|
| Standard_DC48es_v5  	|48  	|192  	|RS*  	|32  	| N/A  	|76800/1320  	|80000/3000  	|8  	|15000  	|
| Standard_DC64es_v5  	|64  	|256  	|RS*  	|32  	| N/A  	|80000/1740  	|80000/3000  	|8  	|20000  	|
| Standard_DC96es_v5  	|96  	|384  	|RS*  	|32  	| N/A  	|80000/2600   	|120000/4000   	|8   	|30000    |

*RS: These VMs have support for remote storage only

## DCedsv5-series

The DCedsv5 offer a balance of memory to vCPU performance which will suit most production workloads. With up to 96 vCPUs, 384 GiB of RAM, and support for up to 2.8 TB of local disk storage. These VMs work well for many general computing workloads, e-commerce systems, web front ends, desktop virtualization solutions, sensitive databases, other enterprise applications and more.

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

### DCedsv5-series specifications

| Size | vCPU | RAM (GiB) | Temp storage (SSD) GiB | Max data disks | Max temp disk throughput IOPS/MBps | Max uncached disk throughput IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max Network Bandwidth (Mbps) |
|:------:|:----:|:---------:|:------------------------:|:--------------:|:-------------------------------------:|:--------------------------------------:|:-----------------------------------------------:|:--------:|:-------------------------------------:|
| Standard_DC2eds_v5  	|2  	|8  	|47  	|4  	|9300/100  	|3750/80  	| 10000/1200 | 2 | 3000 |
| Standard_DC4eds_v5  	|4  	|16  	|105  	|8  	|19500/200  	|6400/140  	| 20000/1200 | 2 | 5000 |
| Standard_DC8eds_v5  	|8  	|32  	|227  	|16  	|38900/500  	|12800/300  	| 20000/1200 | 4 | 5000 |
| Standard_DC16eds_v5  |16  |64  |463  |32  |76700/1000  |25600/600  | 40000/1200 | 8 | 10000 |
| Standard_DC32eds_v5  |32  |128  |935  |32  |153200/2000  |51200/860  |80000/2000  	|8  	|12500  	|
| Standard_DC48eds_v5  |48  |192  |1407  |32  |229700/3000  |76800/1320  |80000/3000  	|8  	|15000  	|
| Standard_DC64eds_v5  |64  |256  |2823  |32  |306200/4000  |80000/1740  |80000/3000  	|8  	|20000  	|
| Standard_DC96eds_v5  |96  |384  |2823  |32  |459200/4000  |80000/2600   	|120000/4000   	|8   	|30000    |

> [!NOTE]
> To achieve these IOPs, use [Gen2 VMs](generation-2.md).

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a confidential VM in Azure Portal](../confidential-computing/quick-create-confidential-vm-portal-amd.md)
> [Create a confidential VM in Azure CLI](../confidential-computing/quick-create-confidential-vm-azure-cli-amd.md)
