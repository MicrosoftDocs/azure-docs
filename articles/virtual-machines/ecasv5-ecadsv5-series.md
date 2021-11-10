---
title: 'ECasv5 and ECadsv5-series - Azure Virtual Machines'
description: Specifications for the ECasv5 and ECadsv5-series VMs.
author: runcai
ms.author: runcai
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-memory
ms.topic: conceptual 
ms.date: 11/15/2021

---

# ECasv5 and ECadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

The ECasv5-series and ECadsv5-series are confidential virtual machines, using AMD's third-Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache, which provide Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP) to provide hardware-isolated virtual machines that protect data from other virtual machines, the hypervisor, and host management code. Confidential virtual machines offer hardware-based VM memory encryption, OS disk pre-encryption before VM provisioning with different key management solutions.  These virtual machines offer a combination of vCPUs and memory to meet the requirements associated with most memory-intensive enterprise applications.

## ECasv5-series

ECasv5-series use AMD's third-Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5 GHz. The ECasv5-series sizes offer a combination of vCPU and memory that is ideal for memory-intensive enterprise applications. The new VMs with no local disk provide a better value proposition for workloads that do not require local temp disk.
> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

ECasv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. Disk storage is billed separately from virtual machines.
> [!NOTE] 
> Starting 2022, encrypted OS disks will be charged a higher fee since they occupy more space (compression is not possible). Please refer here for more information. In addition to the OS disk, confidential VMs utilize a small encrypted "VMGS" disk of several megabytes. This VMGS disk encapsulates the VM security state of components such the vTPM and UEFI bootloader. This small disk may result in an associated storage fee of a fraction of one US cent per VM per month. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Not Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported <br>
[VM Generation Support](generation-2.md): Generation 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br><br>

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

ECadsv5-series utilize AMD's third-Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5 GHz. The ECadsv5-series sizes offer a combination of vCPU, memory and temporary storage that is ideal for memory-intensive enterprise applications. The VMs offer local storage.

ECadsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. Disk storage is billed separately from virtual machines.
> [!NOTE] 
> Starting 2022, encrypted OS disks will be charged a higher fee since they occupy more space (compression is not possible). Please refer here for more information. In addition to the OS disk, confidential VMs utilize a small encrypted "VMGS" disk of several megabytes. This VMGS disk encapsulates the VM security state of components such the vTPM and UEFI bootloader. This small disk may result in an associated storage fee of a fraction of one US cent per VM per month. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). 

[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Not Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported <br>
[VM Generation Support](generation-2.md): Generation 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br><br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|---|
| Standard_E2ads_v5  | 2  | 16  | 75   | 4  | 9000 / 125    | 3750/82      | 2 |
| Standard_E4ads_v5  | 4  | 32  | 150  | 8  | 19000 / 250   | 6400/144     | 2 |
| Standard_E8ads_v5  | 8  | 64  | 300  | 16 | 38000 / 500   | 12800/200    | 4 |
| Standard_E16ads_v5 | 16 | 128 | 600  | 32 | 75000 / 1000  | 25600/384    | 4 |
| Standard_E20ads_v5 | 20 | 160 | 750  | 32 | 94000 / 1250  | 32000/480    | 8 |
| Standard_E32ads_v5 | 32 | 256 | 1200 | 32 | 150000 / 2000 | 51200/768    | 8 |
| Standard_E48ads_v5 | 48 | 384 | 1800 | 32 | 225000 / 3000 | 76800/1152   | 8 |
| Standard_E64ads_v5 | 64 | 512 | 2400 | 32 | 300000 / 4000 | 80000/1200   | 8 |
| Standard_E96ads_v5 | 96 | 672 | 3600 | 32 | 450000 / 4000 | 80000/1600   | 8 |

* These IOPs values can be achieved by using Gen2 VMs.<br>


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
