---
title: Azure Virtual Machine PowerShell Samples 
description: Azure Virtual Machine PowerShell Samples
author: cynthn
ms.service: virtual-machines-windows
ms.topic: sample
ms.workload: infrastructure
ms.date: 03/01/2019
ms.author: cynthn
ms.custom: mvc
---
# Azure Virtual Machine PowerShell samples

The following table provides links to PowerShell script samples that create and manage Windows virtual machines (VMs).

| | |
|---|---|
|**Create virtual machines**||
| [Quickly create a virtual machine](./../scripts/virtual-machines-windows-powershell-sample-create-vm-quick.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a resource group, a virtual machine, and all related resources, with a minimum of prompts.|
| [Create a fully configured virtual machine](./../scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a resource group, a virtual machine, and all related resources.|
| [Create highly available virtual machines](./../scripts/virtual-machines-windows-powershell-sample-create-nlb-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates several virtual machines in a highly-available and load-balanced configuration.|
| [Create a VM and run a configuration script](./../scripts/virtual-machines-windows-powershell-sample-create-vm-iis.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install IIS. |
| [Create a VM and run a DSC configuration](./../scripts/virtual-machines-windows-powershell-sample-create-iis-using-dsc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a virtual machine and uses the Azure Desired State Configuration (DSC) extension to install IIS. |
| [Upload a VHD and create VMs](./../scripts/virtual-machines-windows-powershell-upload-generalized-script.md) | Uploads a local VHD file to Azure, creates an image from the VHD, and then creates a VM from that image. |
| [Create a VM from a managed OS disk](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a virtual machine by attaching an existing Managed Disk as OS disk. |
| [Create a VM from a snapshot](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a virtual machine from a snapshot by first creating a managed disk from the snapshot and then attaching the new managed disk as OS disk. |
|**Manage storage**||
| [Create a managed disk from a VHD in the same or a different subscription](../scripts/virtual-machines-windows-powershell-sample-create-managed-disk-from-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a managed disk from a specialized VHD as an OS disk, or from a data VHD as a data disk, in the same or a different subscription.  |
| [Create a managed disk from a snapshot](../scripts/virtual-machines-windows-powershell-sample-create-managed-disk-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a managed disk from a snapshot. |
| [Copy a managed disk to the same or a different subscription](../scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-to-same-or-different-subscription.md?toc=%2fcli%2fmodule%2ftoc.json) | Copies a managed disk to the same or a different subscription that is in the same region as the parent managed disk.
| [Export a snapshot as a VHD to a storage account](../scripts/virtual-machines-windows-powershell-sample-copy-snapshot-to-storage-account.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Exports a managed snapshot as a VHD to a storage account in a different region. |
| [Export the VHD of a managed disk to a storage account](../scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Exports the underlying VHD of a managed disk to a storage account in a different region. |
| [Create a snapshot from a VHD](../scripts/virtual-machines-windows-powershell-sample-create-snapshot-from-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a snapshot from a VHD and then uses that snapshot to create multiple identical managed disks quickly.  |
| [Copy a snapshot to the same or a different subscription](../scripts/virtual-machines-windows-powershell-sample-copy-snapshot-to-same-or-different-subscription.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Copies snapshot to the same or a different subscription that is in the same region as the parent snapshot. |
|**Secure virtual machines**||
| [Encrypt a VM and its data disks](./../scripts/virtual-machines-windows-powershell-sample-encrypt-vm.md?toc=%2fpowershell%2fazure%2ftoc.json) | Creates an Azure key vault, an encryption key, and a service principal, and then encrypts a VM. |
|**Monitor virtual machines**||
| [Monitor a VM with Azure Monitor](./../scripts/virtual-machines-windows-powershell-sample-create-vm-oms.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a virtual machine, installs the Azure Log Analytics agent, and enrolls the VM in a Log Analytics workspace.  |
| [Collect details about all VMs in a subscription with PowerShell](../scripts/virtual-machines-powershell-sample-collect-vm-details.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) | Creates a csv that contains the VM Name, Resource Group Name, Region, Virtual Network, Subnet, Private IP Address, OS Type, and Public IP Address of the VMs in the provided subscription.
| | |
