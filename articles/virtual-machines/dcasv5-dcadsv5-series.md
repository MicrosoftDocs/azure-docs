---
title: Azure DCasv5 and DCadsv5-series confidential virtual machines
description: Specifications for Azure Confidential Computing's DCasv5 and DCadsv5-series confidential virtual machines. 
author: runcai 
ms.author: runcai
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 11/15/2021

---

# DCasv5 and DCadsv5-series confidential VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

The DCasv5-series and DCadsv5-series are [confidential VMs](../confidential-computing/confidential-vm-overview.md) for use in Confidential Computing. 

These confidential VMs use AMD's third-Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache. These processors can achieve a boosted maximum frequency of 3.5 GHz. Both series offer Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP). SEV-SNP provides hardware-isolated VMs that protect data from other VMs, the hypervisor, and host management code. Confidential VMs offer hardware-based VM memory encryption. These series also offer OS disk pre-encryption before VM provisioning with different key management solutions. 

## DCasv5-series

DCasv5-series VMs offer a combination of vCPU and memory for most production workloads. These VMs with no local disk provide a better value proposition for workloads where you don't need a local temporary disk. For more information, see the [FAQ for Azure VM sizes with no local temporary disk](azure-vms-no-temp-disk.yml). 

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for confidential VMs.

### DCasv5-series feature support

*Supported* features in DCasv5-series VMs:

- [Premium Storage](premium-storage-performance.md)
- [Premium Storage caching](premium-storage-performance.md)
- [VM Generation 2](generation-2.md)

*Unsupported* features in DCasv5-series VMs:

- [Live Migration](maintenance-and-updates.md)
- [Memory Preserving Updates](maintenance-and-updates.md)
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)
- [Ephemeral OS Disks](ephemeral-os-disks.md)
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)

### DCasv5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_DC2as_v5  | 2  | 8   | Remote Storage Only | 4  | 3750/82    | 2 |
| Standard_DC4as_v5  | 4  | 16  | Remote Storage Only | 8  | 6400/144   | 2 |
| Standard_DC8as_v5  | 8  | 32  | Remote Storage Only | 16 | 12800/200  | 4 |
| Standard_DC16as_v5 | 16 | 64  | Remote Storage Only | 32 | 25600/384  | 4 |
| Standard_DC32as_v5 | 32 | 128 | Remote Storage Only | 32 | 51200/768  | 8 |
| Standard_DC48as_v5 | 48 | 192 | Remote Storage Only | 32 | 76800/1152 | 8 |
| Standard_DC64as_v5 | 64 | 256 | Remote Storage Only | 32 | 80000/1200 | 8 |
| Standard_DC96as_v5 | 96 | 384 | Remote Storage Only | 32 | 80000/1600 | 8 |

## DCadsv5-series

DCadsv5-series offer a combination of vCPU, memory, and temporary storage for most production workloads.

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for confidential VMs.

### DCadsv5-series feature support

*Supported* features in DCadsv5-series VMs:

- [Premium Storage](premium-storage-performance.md)
- [Premium Storage caching](premium-storage-performance.md)
- [VM Generation 2](generation-2.md)
- [Ephemeral OS Disks](ephemeral-os-disks.md)

*Unsupported* features in DCadsv5-series VMs:

- [Live Migration](maintenance-and-updates.md)
- [Memory Preserving Updates](maintenance-and-updates.md)
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)

### DCadsv5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|---|
| Standard_DC2ads_v5  | 2  | 8   | 75   | 4  | 9000 / 125    | 3750/82    | 2 |
| Standard_DC4ads_v5  | 4  | 16  | 150  | 8  | 19000 / 250   | 6400/144   | 2 |
| Standard_DC8ads_v5  | 8  | 32  | 300  | 16 | 38000 / 500   | 12800/200  | 4 |
| Standard_DC16ads_v5 | 16 | 64  | 600  | 32 | 75000 / 1000  | 25600/384  | 4 |
| Standard_DC32ads_v5 | 32 | 128 | 1200 | 32 | 150000 / 2000 | 51200/768  | 8 |
| Standard_DC48ads_v5 | 48 | 192 | 1800 | 32 | 225000 / 3000 | 76800/1152 | 8 |
| Standard_DC64ads_v5 | 64 | 256 | 2400 | 32 | 300000 / 4000 | 80000/1200 | 8 |
| Standard_DC96ads_v5 | 96 | 384 | 3600 | 32 | 450000 / 4000 | 80000/1600 | 8 |

> [!NOTE]
> To achieve these IOPs, use [Gen2 VMs](generation-2.md).

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Next steps

> [!div class="nextstepaction"]
> [Confidential virtual machine options on AMD processors](../confidential-computing/virtual-machine-solutions.md)
