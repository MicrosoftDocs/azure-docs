---
title: Azure CLI Samples Windows | Microsoft Docs
description: Azure CLI Samples Windows
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
ms.date: 02/27/2017
ms.author: nepeters

---
# Azure CLI Samples for Windows virtual machines

The following table includes links to bash scripts built using the Azure CLI that deploy Windows virtual machines.

| | |
|---|---|
|**Create virtual machines**||
| [Create a virtual machine](./../scripts/virtual-machines-windows-cli-sample-create-vm-quick-create.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a Windows virtual machine with minimal configuration. |
| [Create a fully configured virtual machine](./../scripts/virtual-machines-windows-cli-sample-create-vm.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a resource group, virtual machine, and all related resources.|
| [Create highly available virtual machines](./../scripts/virtual-machines-windows-cli-sample-nlb.md?toc=%2fcli%2fazure%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration. |
| [Create a VM and run configuration script](./../scripts/virtual-machines-windows-cli-sample-create-vm-iis.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install IIS. |
| [Create a VM and run DSC configuration](./../scripts/virtual-machines-windows-cli-sample-create-iis-using-dsc.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine and uses the Azure Desired State Configuration (DSC) extension to install IIS. |
|**Network virtual machines**||
| [Secure network traffic between virtual machines](./../scripts/virtual-machines-windows-cli-sample-create-vm-nsg.md?toc=%2fcli%2fazure%2ftoc.json) | Creates two virtual machines, all related resources, and an internal and external network security groups (NSG). |
|**Monitor virtual machines**||
| [Monitor a VM with Operations Management Suite](./../scripts/virtual-machines-windows-cli-sample-create-vm-oms.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine, installs the Operations Management Suite agent, and enrolls the VM in an OMS Workspace.  |
| | |
