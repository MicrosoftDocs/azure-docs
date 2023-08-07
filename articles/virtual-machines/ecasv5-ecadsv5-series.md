---
title: Azure ECasv5 and ECadsv5-series
description: Specifications for Azure Confidential Computing's ECasv5 and ECadsv5-series  confidential virtual machines. 
author: runcai
ms.author: runcai
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 11/15/2021

---

# ECasv5 and ECadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

The ECasv5-series and ECadsv5-series are [confidential VMs](../confidential-computing/confidential-vm-overview.md) for use in Confidential Computing. 

These confidential VMs use AMD's third-Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache. This processor can achieve a boosted maximum frequency of 3.5 GHz. Both series offer Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP). SEV-SNP provides hardware-isolated VMs that protect data from other VMs, the hypervisor, and host management code. Confidential VMs offer hardware-based VM memory encryption. These series also offer OS disk pre-encryption before VM provisioning with different key management solutions. 

These VM series also offer a combination of vCPUs and memory to meet the requirements of most memory-intensive enterprise applications.

## ECasv5-series

ECasv5-series VMs offer a combination of vCPU and memory for memory-intensive enterprise applications. These VMs with no local disk provide a better value proposition for workloads where you don't need a local temp disk. For more information, see the [FAQ for Azure VM sizes with no local temporary disk](azure-vms-no-temp-disk.yml). 

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for confidential VMs.

### ECasv5-series feature support

*Supported* features in ECasv5-series VMs:

- [Premium Storage](premium-storage-performance.md)
- [Premium Storage caching](premium-storage-performance.md)
- [VM Generation 2](generation-2.md)

*Unsupported* features in ECasv5-series VMs:

- [Live Migration](maintenance-and-updates.md)
- [Memory Preserving Updates](maintenance-and-updates.md)
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)
- [Ephemeral OS Disks](ephemeral-os-disks.md)
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)

### ECasv5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_EC2as_v5  | 2  | 16  | Remote Storage Only | 4  | 3750/82    | 2 |
| Standard_EC4as_v5  | 4  | 32  | Remote Storage Only | 8  | 6400/144   | 2 |
| Standard_EC8as_v5  | 8  | 64  | Remote Storage Only | 16 | 12800/200  | 4 |
| Standard_EC16as_v5 | 16 | 128 | Remote Storage Only | 32 | 25600/384  | 4 |
| Standard_EC20as_v5 | 20 | 160 | Remote Storage Only | 32 | 32000/480  | 8 |
| Standard_EC32as_v5 | 32 | 256 | Remote Storage Only | 32 | 51200/768  | 8 |
| Standard_EC48as_v5 | 48 | 384 | Remote Storage Only | 32 | 76800/1152 | 8 |
| Standard_EC64as_v5 | 64 | 512 | Remote Storage Only | 32 | 80000/1200 | 8 |
| Standard_EC96as_v5 | 96 | 672 | Remote Storage Only | 32 | 80000/1600 | 8 |

## ECadsv5-series

ECadsv5-series VMs offer a combination of vCPU, memory, and temporary storage for memory-intensive enterprise applications. These VMs offer local storage.

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for confidential VMs.

### ECadsv5-series feature support

*Supported* features in DCasv5-series VMs:

- [Premium Storage](premium-storage-performance.md)
- [Premium Storage caching](premium-storage-performance.md)
- [VM Generation 2](generation-2.md)
- [Ephemeral OS Disks](ephemeral-os-disks.md)

*Unsupported* features in DCasv5-series VMs:

- [Live Migration](maintenance-and-updates.md)
- [Memory Preserving Updates](maintenance-and-updates.md)
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)

### ECadsv5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|---|
| Standard_EC2ads_v5  | 2  | 16  | 75   | 4  | 9000 / 125    | 3750/82      | 2 |
| Standard_EC4ads_v5  | 4  | 32  | 150  | 8  | 19000 / 250   | 6400/144     | 2 |
| Standard_EC8ads_v5  | 8  | 64  | 300  | 16 | 38000 / 500   | 12800/200    | 4 |
| Standard_EC16ads_v5 | 16 | 128 | 600  | 32 | 75000 / 1000  | 25600/384    | 4 |
| Standard_EC20ads_v5 | 20 | 160 | 750  | 32 | 94000 / 1250  | 32000/480    | 8 |
| Standard_EC32ads_v5 | 32 | 256 | 1200 | 32 | 150000 / 2000 | 51200/768    | 8 |
| Standard_EC48ads_v5 | 48 | 384 | 1800 | 32 | 225000 / 3000 | 76800/1152   | 8 |
| Standard_EC64ads_v5 | 64 | 512 | 2400 | 32 | 300000 / 4000 | 80000/1200   | 8 |
| Standard_EC96ads_v5 | 96 | 672 | 3600 | 32 | 450000 / 4000 | 80000/1600   | 8 |

> [!NOTE]
> To achieve these IOPs, use [Gen2 VMs](generation-2.md).

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Next steps

> [!div class="nextstepaction"]
> [Confidential virtual machine options on AMD processors](../confidential-computing/virtual-machine-solutions-amd.md)
