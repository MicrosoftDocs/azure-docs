---
title: Hibernation overview
description: Overview of hibernating your VM.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/14/2024
ms.author: jainan
ms.reviewer: mattmcinnes
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Hibernation for Azure virtual machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

[!INCLUDE [hibernate-resume-intro](./includes/hibernate-resume-intro.md)]

## How hibernation works
When you hibernate a VM, Azure signals the VM's operating system to perform a suspend-to-disk action. Azure stores the memory contents of the VM in the OS disk, then deallocates the VM. When the VM is started again, the memory contents are transferred from the OS disk back into memory. Applications and processes that were previously running in your VM resume from the state prior to hibernation.

Once a VM is in a hibernated state, you aren't billed for the VM usage. Your account is only billed for the storage (OS disk, data disks) and networking resources (IPs, etc.) attached to the VM.

When hibernating a VM:
- Hibernation is triggered on a VM using the Azure portal, CLI, PowerShell, SDKs, or APIs. Azure then signals the guest operating system to perform suspend-to-disk (S4). 
- The VM's memory contents are stored on the OS disk. The VM is then deallocated, releases the lease on the underlying hardware, and is powered off. Refer to VM [states and billing](states-billing.md) for more details on the VM deallocated state.
- Data in the temporary disk isn't persisted.
- The OS disk, data disks, and NICs remain attached to your VM. Any static IPs remain unchanged.
- You aren't billed for the VM usage for a hibernated VM.
- You continue to be billed for the storage and networking resources associated with the hibernated VM.

## Supported configurations
Hibernation support is limited to certain VM sizes and OS versions. Make sure you have a supported configuration before using hibernation.

### Supported operating systems
Supported operating systems, OS specific limitations, and configuration procedures are listed in the OS's documentation section.

[Windows VM hibernation documentation](./windows/hibernate-resume-windows.md#supported-configurations)

[Linux VM hibernation documentation](./linux/hibernate-resume-linux.md#supported-configurations)

### Supported VM sizes 

VM sizes with up to 64-GB RAM from the following General Purpose VM series support hibernation.
- [Dasv5-series](dasv5-dadsv5-series.md) 
- [Dadsv5-series](dasv5-dadsv5-series.md) 
- [Dsv5-series](../virtual-machines/dv5-dsv5-series.md)
- [Ddsv5-series](ddv5-ddsv5-series.md)
- [Easv5-series](easv5-eadsv5-series.md)
- [Eadsv5-series](easv5-eadsv5-series.md)
- [Esv5-series](ev5-esv5-series.md)
- [Edsv5-series](edv5-edsv5-series.md)

VM sizes with up to 112-GB RAM from the following GPU VM series support hibernation.
- [NVv4-series](../virtual-machines/nvv4-series.md) (in preview)
- [NVadsA10v5-series](../virtual-machines/nva10v5-series.md) (in preview)

> [!IMPORTANT]
> Azure Virtual Machines - Hibernation for GPU VMs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### General limitations
- You can resize VMs that have hibernation enabled, but not when the VM is in a *Hibernated* state. The VM should either be in a *Running* or *Stopped* state.
- Hibernation is only supported with Nested Virtualization when Trusted Launch is enabled on the VM
- When a VM is hibernated, you can't attach, detach, or modify any disks or NICs associated with the VM. The VM must instead be moved to a Stop-Deallocated state.
-	When a VM is hibernated, there's no capacity guarantee to ensure that there's sufficient capacity to start the VM later. In the rare case that you encounter capacity issues, you can try starting the VM at a later time. Capacity reservations don't guarantee capacity for hibernated VMs.
-	You can only hibernate a VM using the Azure portal, CLI, PowerShell, SDKs and API. Hibernating the VM using guest OS operations don't result in the VM moving to a hibernated state and the VM continues to be billed.

### Azure feature limitations
-	Ephemeral OS disks
-	Shared disks
-	Availability Sets
-	Virtual Machine Scale Sets in Uniform orchestration mode are not supported. Virtual Machine Scale Sets in [Flexible orchestration mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md) are supported.
-	Spot VMs
-	Managed images
-	Azure Backup
-	Capacity reservations

## Prerequisites to use hibernation
- Hibernation must be enabled on your VM.
- A persistent OS disk large enough to store the contents of the RAM, OS and other applications running on the VM is connected.
- The VM size supports hibernation.
-	The VM OS supports hibernation.
- The Azure VM Agent is installed if you're using the Windows or Linux Hibernate Extensions.
- If a VM is being created from an OS disk or a Compute Gallery image, then the OS disk or Gallery Image definition supports hibernation. 

## Setting up hibernation

Enabling hibernation is detailed in the OS specific setup and configuration documentation:

### Linux VMs
To configure hibernation on a Linux VM, check out the [Linux hibernation documentation](./linux/hibernate-resume-linux.md).

### Windows VMs
To configure hibernation on a Windows VM, check out the [Windows hibernation documentation](./windows/hibernate-resume-windows.md).

## Troubleshooting
Refer to the [Hibernation troubleshooting guide](./hibernate-resume-troubleshooting.md) for general troubleshooting information.

Refer to the [Windows hibernation troubleshooting guide](./windows/hibernate-resume-troubleshooting-windows.md) for issues with Windows guest hibernation.

Refer to the [Linux hibernation troubleshooting guide](./linux/hibernate-resume-troubleshooting-linux.md) for issues with Linux guest hibernation.

## FAQs
- What are the charges for using this feature?
    - Once a VM is placed in a hibernated state, you aren't charged for the VM, just like how you aren't charged for VMs in a stop (deallocated) state. You're only charged for the OS disk, data disks and any static IPs associated with the VM.

- Can I enable hibernation on existing VMs?
    - Yes, you can enable hibernation on existing VMs.

- Can I resize a VM with hibernation enabled?
    - Yes, you can resize a VM with hibernation enabled. You cannot resize the VM if it's in a *Hibernated* state. Move the VM to either a *Running* or *Stopped* state before resizing.

- Can I modify a VM once it is in a hibernated state?
    - No, once a VM is in a hibernated state, you can't perform actions like resizing the VM and modifying the disks. Additionally, you can't detach any disks or networking resources that are currently attached to the VM or attach new resources to the VM. You can however stop(deallocate) or delete the VM if you want to detach these resources. 

- What is the difference between stop(deallocating) and hibernating a VM?
    - When you stop(deallocate) a VM, the VM shuts down without persisting the memory contents. You can resize stop(deallocated) VMs and detach/attach disks to the VM.

    - When you hibernate a VM, the memory contents are first persisted in the OS disk, then the VM hibernates. You can't resize VMs in a hibernated state, nor detach/attach disks and networking resources to the VM.


- Can I initiate hibernation from within the VM?
    - To hibernate a VM you should use the Azure portal, CLI, PowerShell commands, SDKs and APIs. Triggering hibernation from inside the VM still results in your VM being billed for the compute resources. 

- When a VM is hibernated, is there a capacity assurance at the time of starting the VM?
    - No, there's no capacity assurance for starting hibernated VMs. In rare scenarios if you encounter a capacity issue, then you can try starting the VM at a later time. 

## Next steps
- [Learn more about Azure billing](/azure/cost-management-billing/)
- [Learn about Azure Virtual Desktop](../virtual-desktop/overview.md)
- [Look into Azure VM Sizes](sizes.md)
