---
title: Azure PowerShell Script Sample -  Copy (move) snapshot of a managed disk to same or different subscription | Microsoft Docs
description: Azure PowerShell Script Sample -  Copy (move) snapshot of a managed disk to same or different subscription
services: virtual-machines-windows
documentationcenter: storage
author: ramankumarlive
manager: kavithag
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 06/06/2017
ms.author: ramankum
---

# Copy snapshot of a managed disk in same subscription or different subscription with PowerShell

This script creates a copy of a snapshot in the same subscription or different subscription. Use this script to move a snapshot to different subscription for data retention. Storing snapshots in different subscription protect you from accidental deletion of snapshots in your main subscription. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/copy-snapshot-to-same-or-different-subscription/copy-snapshot-to-same-or-different-subscription.ps1 "Copy snapshot")]


## Script explanation

This script uses following commands to create a snapshot in the target subscription using the Id of the source snapshot. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmSnapshotConfig](/powershell/module/azurerm.compute/New-AzureRmSnapshotConfig) | Creates snapshot configuration that is used for snapshot creation. It includes the resource Id of the parent snapshot and location that is same as the parent snapshot.  |
| [New-AzureRmSnapshot](/powershell/module/azurerm.compute/New-AzureRmDisk) | Creates a snapshot using snapshot configuration, snapshot name, and resource group name passed as parameters. |


## Next steps

[Create a virtual machine from a snapshot](./virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).