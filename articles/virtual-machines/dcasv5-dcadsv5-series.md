---
title: 'DCasv5 and DCadsv5-series - Azure Confidential Virtual Machines'
description: Specifications for the DCasv5 and DCadsv5-series VMs. 
author: runcai 
ms.author: runcai
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-general
ms.topic: conceptual
ms.date: 11/15/2021

---

# DCasv5 and DCadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

The DCasv5-series and DCadsv5-series are confidential virtual machines, using AMD's third-Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache, which provide Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP) to provide hardware-isolated virtual machines that protect data from other virtual machines, the hypervisor, and host management code. Confidential virtual machines offer hardware-based VM memory encryption, OS disk pre-encryption before VM provisioning with different key management solutions. 

## DCasv5-series

DCasv5-series virtual machines use AMD's third-Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5 GHz. DCasv5-series offer a combination of vCPU and memory for most production workloads. The new VMs with no local disk provide a better value proposition for workloads that local temp disk is not required.
> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml). DCasv5-series VM is under Public Preview.

DCasv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. Disk storage is billed separately from virtual machines. 
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
| Standard_DC2as_v5  | 2  | 8   | Remote Storage Only | 4  | 3750/82    | 2 |
| Standard_DC4as_v5  | 4  | 16  | Remote Storage Only | 8  | 6400/144   | 2 |
| Standard_DC8as_v5  | 8  | 32  | Remote Storage Only | 16 | 12800/200  | 4 |
| Standard_DC16as_v5 | 16 | 64  | Remote Storage Only | 32 | 25600/384  | 4 |
| Standard_DC32as_v5 | 32 | 128 | Remote Storage Only | 32 | 51200/768  | 8 |
| Standard_DC48as_v5 | 48 | 192 | Remote Storage Only | 32 | 76800/1152 | 8 |
| Standard_DC64as_v5 | 64 | 256 | Remote Storage Only | 32 | 80000/1200 | 8 |
| Standard_DC96as_v5 | 96 | 384 | Remote Storage Only | 32 | 80000/1600 | 8 |



## DCadsv5-series

DCadsv5-series virtual machines use AMD's third-Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5 GHz. The DCadsv5-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads.

DCadsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. Disk storage is billed separately from virtual machines.

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
| Standard_DC2ads_v5  | 2  | 8   | 75   | 4  | 9000 / 125    | 3750/82    | 2 |
| Standard_DC4ads_v5  | 4  | 16  | 150  | 8  | 19000 / 250   | 6400/144   | 2 |
| Standard_DC8ads_v5  | 8  | 32  | 300  | 16 | 38000 / 500   | 12800/200  | 4 |
| Standard_DC16ads_v5 | 16 | 64  | 600  | 32 | 75000 / 1000  | 25600/384  | 4 |
| Standard_DC32ads_v5 | 32 | 128 | 1200 | 32 | 150000 / 2000 | 51200/768  | 8 |
| Standard_DC48ads_v5 | 48 | 192 | 1800 | 32 | 225000 / 3000 | 76800/1152 | 8 |
| Standard_DC64ads_v5 | 64 | 256 | 2400 | 32 | 300000 / 4000 | 80000/1200 | 8 |
| Standard_DC96ads_v5 | 96 | 384 | 3600 | 32 | 450000 / 4000 | 80000/1600 | 8 |

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
