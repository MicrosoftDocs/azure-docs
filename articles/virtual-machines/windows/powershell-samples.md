---
title: Azure Virtual Machine PowerShell Samples | Microsoft Docs
description: Azure Virtual Machine PowerShell Samples
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/30/2017
ms.author: cynthn
ms.custom: mvc
---
# Azure Virtual Machine PowerShell samples

The following table includes links to PowerShell scripts samples that create and manage Windows virtual machines.

| | |
|---|---|
|**Create virtual machines**||
| [Quickly create a virtual machine](./../scripts/virtual-machines-windows-powershell-sample-create-vm-quick.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a resource group, virtual machine, and all related resources, with the minimum of prompts.|
| [Create a fully configured virtual machine](./../scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a resource group, virtual machine, and all related resources .|
| [Create highly available virtual machines](./../scripts/virtual-machines-windows-powershell-sample-create-nlb-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration.|
| [Create a VM and run configuration script](./../scripts/virtual-machines-windows-powershell-sample-create-vm-iis.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install IIS. |
| [Create a VM and run DSC configuration](./../scripts/virtual-machines-windows-powershell-sample-create-iis-using-dsc.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine and uses the Azure Desired State Configuration (DSC) extension to install IIS. |
| [Upload a VHD and create VMs](./../scripts/virtual-machines-windows-powershell-upload-generalized-script.md) | Uploads a local VHD file to Azure, creates and image from the VHD and then creates a VM from that image. |
| [Create a VM from a managed OS disk](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine by attaching an existing Managed Disk as OS disk. |
| [Create a VM from a snapshot](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine from a snapshot by first creating a managed disk from snapshot and then attaching the new managed disk as OS disk. |
|**Manage storage**||
| [Create managed disk from a VHD in same or different subscription](../scripts/virtual-machines-windows-powershell-sample-create-managed-disk-from-vhd.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a managed disk from a specialized VHD as a OS disk or from a data VHD as data disk in same or different subscription.  |
| [Create a managed disk from a snapshot](../scripts/virtual-machines-windows-powershell-sample-create-managed-disk-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a managed disk from a snapshot. |
| [Copy managed disk to same or different subscription](../scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-to-same-or-different-subscription.md?toc=%2fcli%2fmodule%2ftoc.json) | Copies managed disk to same or different subscription but in the same region as the parent managed disk. 
| [Export a snapshot as VHD to a storage account](../scripts/virtual-machines-windows-powershell-sample-copy-snapshot-to-storage-account.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Exports a managed snapshot as VHD to a storage account in different region. |
| [Export the VHD of a managed disk to a storage account](../scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-vhd.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Exports the underlying VHD of a managed disk to a storage account in different region. |
| [Create a snapshot from a VHD](../scripts/virtual-machines-windows-powershell-sample-create-snapshot-from-vhd.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates snapshot from a VHD to create multiple identical managed disks from snapshot in short amount of time.  |
| [Copy snapshot to same or different subscription](../scripts/virtual-machines-windows-powershell-sample-copy-snapshot-to-same-or-different-subscription.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Copies snapshot to same or different subscription but in the same region as the parent snapshot. |
|**Secure virtual machines**||
| [Encrypt a VM and data disks](./../scripts/virtual-machines-windows-powershell-sample-encrypt-vm.md?toc=%2fpowershell%2fazure%2ftoc.json) | Creates an Azure Key Vault, encryption key, and service principal, then encrypts a VM. |
|**Monitor virtual machines**||
| [Monitor a VM with Operations Management Suite](./../scripts/virtual-machines-windows-powershell-sample-create-vm-oms.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine, installs the Operations Management Suite agent, and enrolls the VM in an OMS Workspace.  |
| | |

