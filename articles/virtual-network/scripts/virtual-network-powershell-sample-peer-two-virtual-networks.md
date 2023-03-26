---
title: Peer two virtual networks - Azure PowerShell script sample
description: Create and connect two virtual networks in the same region. Use the Azure script for two peer virtual networks to connect the networks through the Azure network.
author: asudbring
ms.service: virtual-network
ms.topic: sample
ms.date: 03/23/2023
ms.author: allensu 
ms.custom: devx-track-azurepowershell
---

# Peer two virtual networks script sample

This script sample creates and connects two virtual networks in the same region through the Azure network. After running the script, you'll create a peering between two virtual networks.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. If you use PowerShell locally, this script requires the Az PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.ps1 "Peer two networks")]

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the following table links to command specific documentation:

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)| Creates an Azure virtual network and subnet. |
| [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) | Creates a peering between two virtual networks.  |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/).

More virtual network PowerShell script samples can be found in [Virtual network PowerShell samples](../powershell-samples.md).
