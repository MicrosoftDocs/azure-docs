---
title: Azure Virtual Machine PowerShell Samples | Microsoft Docs
description: Azure Virtual Machine PowerShell Samples
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/01/2019
ms.author: cynthn

---
# Azure Virtual Machine PowerShell samples

The following table includes links to PowerShell scripts samples that create and manage Linux virtual machines.

| | |
|---|---|
|**Create virtual machines**||
| [Create a fully configured virtual machine](./../scripts/virtual-machines-linux-powershell-sample-create-vm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a resource group, virtual machine, and all related resources.|
| [Create a VM with Docker enabled](./../scripts/virtual-machines-linux-powershell-sample-create-docker-host.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine, configures this VM as a Docker host, and runs an NGINX container. |
| [Create a VM and run configuration script](./../scripts/virtual-machines-linux-powershell-sample-create-vm-nginx.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install NGINX. |
| [Create a VM with WordPress installed](./../scripts/virtual-machines-linux-powershell-sample-create-vm-wordpress.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install WordPress. |
| [Create a VM from a managed OS disk](./../scripts/virtual-machines-linux-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine by attaching an existing Managed Disk as OS disk. |
| [Create a VM from a snapshot](./../scripts/virtual-machines-linux-powershell-sample-create-vm-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine from a snapshot by first creating a managed disk from the snapshot and then attaching the new managed disk as OS disk. |
|**Manage storage**||
| [Create a managed disk from a VHD in the same or a different subscription](../scripts/virtual-machines-linux-powershell-sample-create-managed-disk-from-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a managed disk from a specialized VHD as an OS disk, or from a data VHD as a data disk, in the same or a different subscription.  |
| [Create a managed disk from a snapshot](../scripts/virtual-machines-linux-powershell-sample-create-managed-disk-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a managed disk from a snapshot. |
| [Export a snapshot as a VHD to a storage account](../scripts/virtual-machines-linux-powershell-sample-copy-snapshot-to-storage-account.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Exports a managed snapshot as a VHD to a storage account in a different region. |
| [Export the VHD of a managed disk to a storage account](../scripts/virtual-machines-linux-powershell-sample-copy-managed-disks-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Exports the underlying VHD of a managed disk to a storage account in a different region. |
| [Create a snapshot from a VHD](../scripts/virtual-machines-linux-powershell-sample-create-snapshot-from-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a snapshot from a VHD and then uses that snapshot to create multiple identical managed disks quickly.  |
| [Copy a snapshot to the same or a different subscription](../scripts/virtual-machines-linux-powershell-sample-copy-snapshot-to-same-or-different-subscription.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Copies snapshot to the same or a different subscription that is in the same region as the parent snapshot. |
|**Monitor virtual machines**||
| [Monitor a VM with Azure Monitor logs](./../scripts/virtual-machines-linux-powershell-sample-create-vm-oms.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a virtual machine, installs the Log Analytics agent, and enrolls the VM in a Log Analytics workspace.  |
| [Copy a managed disk to the same or a different subscription](../scripts/virtual-machines-linux-powershell-sample-copy-managed-disks-to-same-or-different-subscription.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Copies a managed disk to the same or a different subscription that is in the same region as the parent managed disk.
| [Collect details about all VMs in a subscription with PowerShell](../scripts/virtual-machines-powershell-sample-collect-vm-details.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) | Creates a csv that contains the VM Name, Resource Group Name, Region, Virtual Network, Subnet, Private IP Address, OS Type, and Public IP Address of the VMs in the provided subscription.
| | |
