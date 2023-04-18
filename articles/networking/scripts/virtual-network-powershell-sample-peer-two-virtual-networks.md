---
title: Azure PowerShell Script Sample - Peer two virtual networks
description: Create and connect two virtual networks in the same region. Use the Azure script for two peer virtual networks to connect the networks through Azure.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/23/2023
ms.author: allensu 
ms.custom: devx-track-azurepowershell
---

# Peer two virtual networks

This script creates and connects two virtual networks in the same region through the Azure network. After running the script, you'll create a peering between two virtual networks.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell[main](../../../powershell_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.ps1 "Peer two networks")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. | 
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)| Creates an Azure virtual network and subnet. |
| [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) | Creates a peering between two virtual networks.  |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/).

More networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).