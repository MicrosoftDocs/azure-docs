---
title: Azure PowerShell Samples - Single-zone scale set | Microsoft Docs
description: Azure PowerShell Samples
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/05/2018
ms.author: cynthn
ms.custom: mvc

---

# Create a single-zone virtual machine scale set with PowerShell
This script creates a virtual machine scale set running Windows Server 2016 in a single Availability Zone. After running the script, you can access the virtual machine over RDP.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine-scale-sets/create-single-availability-zone/create-single-availability-zone.ps1 "Create single-zone scale set")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzVmss](/powershell/module/az.compute/new-azvmss) | Creates the virtual machine scale set and all supporting resources, including virtual network, load balancer, and NAT rules. |
| [Get-AzVmss](/powershell/module/az.compute/get-azvmss) | Gets information on a virtual machine scale set. |
| [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) | Adds a VM extension for Custom Script to install a basic web application. |
| [Update-AzVmss](/powershell/module/az.compute/update-azvmss) | Updates the virtual machine scale set model to apply the VM extension. |
| [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) | Gets information on the public IP address assigned used by the load balancer. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine scale set PowerShell script samples can be found in the [Azure virtual machine scale set documentation](../powershell-samples.md).
