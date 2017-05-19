---
title: Azure Virtual Machine PowerShell Samples | Microsoft Docs
description: Azure Virtual Machine PowerShell Samples
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/16/2017
ms.author: nepeters

---
# Azure Virtual Machine PowerShell samples

The following table includes links to PowerShell scripts samples that create and manage Windows virtual machines.

| | |
|---|---|
|**Create virtual machines**||
| [Create a fully configured virtual machine](./../scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a resource group, virtual machine, and all related resources.|
| [Create a VM and run configuration script](./../scripts/virtual-machines-windows-powershell-sample-create-vm-iis.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install IIS. |
| [Create a VM and run DSC configuration](./../scripts/virtual-machines-windows-powershell-sample-create-iis-using-dsc.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine and uses the Azure Desired State Configuration (DSC) extension to install IIS. |
| [Upload a VHD and create VMs](./../scripts/virtual-machines-windows-powershell-upload-generalized-script.md) | Uplaods a local VHD file to Azure, creates and image from the VHD and then creates a VM from that image. |
| [Create a VM from a managed OS disk](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine by attaching an existing Managed Disk as OS disk. |
| [Create a VM from a snapshot](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine from a snapshot by first creating a managed disk from snapshot and then attaching the new managed disk as OS disk. |
|**Monitor virtual machines**||
| [Monitor a VM with Operations Management Suite](./../scripts/virtual-machines-windows-powershell-sample-create-vm-oms.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a virtual machine, installs the Operations Management Suite agent, and enrolls the VM in an OMS Workspace.  |
| | |
