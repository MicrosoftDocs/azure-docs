---
title: Ephemeral OS disks
description: Learn more about ephemeral OS disks for Azure VMs.
author: Aarthi-Vijayaraghavan
ms.service: virtual-machines
ms.custom:
ms.topic: how-to
ms.date: 07/23/2020
ms.author: aarthiv
ms.subservice: disks
---

# Ephemeral OS disks for Azure VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Ephemeral OS disks are created on the local virtual machine (VM) storage and not saved to the remote Azure Storage. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures but are more affected by VM deployment time or reimaging of individual VM instances. With Ephemeral OS disk, you get lower read/write latency to the OS disk and faster VM reimage.

The key features of ephemeral disks are:

- Ideal for stateless applications.
- Supported by  Marketplace, custom images, and by [Azure Compute Gallery](./shared-image-galleries.md) (formerly known as Shared Image Gallery).
- Ability to fast reset or reimage VMs and scale set instances to the original boot state.
- Lower latency, similar to a temporary disk.
- Ephemeral OS disks are free, you incur no storage cost for OS disks.
- Available in all Azure regions.

Key differences between persistent and ephemeral OS disks:

|   | Persistent OS Disk | Ephemeral OS Disk |
|---|---|---|
| **Size limit for OS disk** | 4* TiB | Cache size or temp size for the VM size or 2040 GiB, whichever is smaller. For the **cache or temp size in GiB**, see [DS](sizes-general.md), [ES](sizes-memory.md), [M](sizes-memory.md), [FS](sizes-compute.md), and [GS](sizes-previous-gen.md#gs-series) |
| **VM sizes supported** | All | VM sizes that support Premium storage such as DSv1, DSv2, DSv3, Esv3, Fs, FsV2, GS, M, Mdsv2, Bs, Dav4, Eav4 |
| **Disk type support**| Managed and unmanaged OS disk| Managed OS disk only|
| **Region support**| All regions| All regions|
| **Data persistence**| OS disk data written to OS disk are stored in Azure Storage| Data written to OS disk is stored on local VM storage and isn't persisted to Azure Storage. |
| **Stop-deallocated state**| VMs and scale set instances can be stop-deallocated and restarted from the stop-deallocated state | Not Supported |
| **Specialized OS disk support** | Yes| No|
| **OS disk resize**| Supported during VM creation and after VM is stop-deallocated| Supported during VM creation only|
| **Resizing to a new VM size**| OS disk data is preserved| Data on the OS disk is deleted, OS is reprovisioned |
| **Redeploy** | OS disk data is preserved | Data on the OS disk is deleted, OS is reprovisioned |
| **Stop/ Start of VM** | OS disk data is preserved | Not Supported |
| **Page file placement**| For Windows, page file is stored on the resource disk| For Windows, page file is stored on the OS disk (for both OS cache placement and Temp disk placement).|
| **Maintenance of VM/VMSS using [healing](understand-vm-reboots.md#unexpected-downtime)** | OS disk data is preserved | OS disk data is not preserved  |
| **Maintenance of VM/VMSS using [Live Migration](maintenance-and-updates.md#live-migration)** | OS disk data is preserved | OS disk data is preserved  |

\* 4 TiB is the maximum supported OS disk size for managed (persistent) disks. However, many OS disks are partitioned with master boot record (MBR) by default and because of this are limited to 2 TiB. For details, see [OS disk](managed-disks-overview.md#os-disk).

## Placement options for Ephemeral OS disks

Ephemeral OS disk can be stored either on VM's OS cache disk or VM's temp/resource disk.
[DiffDiskPlacement](/rest/api/compute/virtualmachines/list#diffdiskplacement) is the new property that can be used to specify where you want to place the Ephemeral OS disk. With this feature, when a Windows VM is provisioned, we configure the pagefile to be located on the OS Disk.

## Size requirements

You can choose to deploy Ephemeral OS Disk on VM cache or VM temp disk.
The image OS disk’s size should be less than or equal to the temp/cache size of the VM size chosen.

For example, if you want to opt for **OS cache placement**: Standard Windows Server images from the marketplace are about 127 GiB, which means that you need a VM size that has a cache equal to or larger than 127 GiB. The Standard_DS3_v2 has a cache size of 127 GiB, which is large enough. In this case, the Standard_DS3_v2 is the smallest size in the DSv2 series that you can use with this image.

For example, if you want to opt for **Temp disk placement**: Standard Ubuntu server image from marketplace is about 30 GiB. To enable Ephemeral OS disk on temp, the temp disk size must be equal to or larger than 30 GiB. Standard_B4ms has a temp size of 32 GiB, which can fit the 30 GiB OS disk. Upon creation of the VM, the temp disk space would be 2 GiB.

> [!IMPORTANT]
> If opting for temp disk placement the Final Temp disk size = (Initial temp disk size - OS image size).

In the case of **Temp disk placement**, as Ephemeral OS disk is placed on temp disk it will share the IOPS with temp disk as per the VM size chosen by you.

Basic Linux and Windows Server images in the Marketplace that are denoted by `[smallsize]` tend to be around 30 GiB and can use most of the available VM sizes.
Ephemeral disks also require that the VM size supports **Premium storage**. The sizes usually (but not always) have an `s` in the name, like DSv2 and EsV3. For more information, see [Azure VM sizes](sizes.md) for details around which sizes support Premium storage.

> [!NOTE]
>
> Ephemeral disk will not be accessible through the portal. You will receive a "Resource not Found" or "404" error when accessing the ephemeral disk which is expected.
>

## Unsupported features

- Capturing VM images
- Disk snapshots
- Azure Disk Encryption
- Azure Backup
- Azure Site Recovery
- OS Disk Swap

## Trusted Launch for Ephemeral OS disks

Ephemeral OS disks can be created with Trusted launch. All regions are supported for Trusted Launch; not all virtual machines sizes are supported. Check [Virtual machines sizes supported](trusted-launch.md#virtual-machines-sizes) for supported sizes.
VM guest state (VMGS) is specific to trusted launch VMs. It is a blob that is managed by Azure and contains the unified extensible firmware interface (UEFI) secure boot signature databases and other security information. When using trusted launch by default **1 GiB** from the **OS cache** or **temp storage** based on the chosen placement option is reserved for VMGS.The lifecycle of the VMGS blob is tied to that of the OS Disk.

For example, If you try to create a Trusted launch Ephemeral OS disk VM using OS image of size 56 GiB with VM size [Standard_DS4_v2](dv2-dsv2-series.md) using temp disk placement you would get an error as
**"OS disk of Ephemeral VM with size greater than 55 GB is not allowed for VM size Standard_DS4_v2 when the DiffDiskPlacement is ResourceDisk."**
This is because the temp storage for [Standard_DS4_v2](dv2-dsv2-series.md) is 56 GiB, and 1 GiB is reserved for VMGS when using trusted launch.
For the same example above, if you create a standard Ephemeral OS disk VM you would not get any errors and it would be a successful operation.

> [!IMPORTANT]
>
> While using ephemeral disks for Trusted Launch VMs, keys and secrets generated or sealed by the vTPM after VM creation may not be persisted for operations like reimaging and platform events like service healing.
>
For more information on [how to deploy a trusted launch VM](trusted-launch-portal.md)

## Confidential VMs using Ephemeral OS disks

AMD-based Confidential VMs cater to high security and confidentiality requirements of customers. These VMs provide a strong, hardware-enforced boundary to help meet your security needs. There are limitations to use Confidential VMs. Check the [region](../confidential-computing/confidential-vm-overview.md#regions), [size](../confidential-computing/confidential-vm-overview.md#size-support) and [OS supported](../confidential-computing/confidential-vm-overview.md#os-support) limitations for confidential VMs.
Virtual machine guest state (VMGS) blob contains the security information of the confidential VM.
Confidential VMs using Ephemeral OS disks by default **1 GiB** from the **OS cache** or **temp storage** based on the chosen placement option is reserved for VMGS.The lifecycle of the VMGS blob is tied to that of the OS Disk.
> [!IMPORTANT]
>
> When choosing a confidential VM with full OS disk encryption before VM deployment that uses a customer-managed key (CMK). [Updating a CMK key version](../storage/common/customer-managed-keys-overview.md#update-the-key-version) or [key rotation](../key-vault/keys/how-to-configure-key-rotation.md) is not supported with Ephemeral OS disk. Confidential VMs using Ephemeral OS disks need to be deleted before updating or rotating the keys and can be re-created subsequently.
>
For more information on [confidential VM](../confidential-computing/confidential-vm-overview.md)

## Customer Managed key

You can choose to use customer managed keys or platform managed keys when you enable end-to-end encryption for VMs using Ephemeral OS disk. Currently this option is available only via [PowerShell](./windows/disks-enable-customer-managed-keys-powershell.md), [CLI](./linux/disks-enable-customer-managed-keys-cli.md) and SDK in all regions.

> [!IMPORTANT]
>
> [Updating a CMK key version](../storage/common/customer-managed-keys-overview.md#update-the-key-version) or [key rotation](../key-vault/keys/how-to-configure-key-rotation.md) of customer managed key is not supported with Ephemeral OS disk. VMs using Ephemeral OS disks need to be deleted before updating or rotating the keys and can be re-created subsequently.
>
For more information on [Encryption at host](./disk-encryption.md)

## Next steps

Create a VM with ephemeral OS disk using [Azure Portal/CLI/PowerShell/ARM template](ephemeral-os-disks-deploy.md).
Check out the [frequently asked questions on ephemeral os disk](ephemeral-os-disks-faq.md).
