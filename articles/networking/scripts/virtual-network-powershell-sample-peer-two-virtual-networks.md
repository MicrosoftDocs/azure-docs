---
title: Azure PowerShell Script Sample - Peer two virtual networks | Microsoft Docs
description: Azure PowerShell Script Sample - Peer two virtual networks
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: powershell
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 05/16/2017
ms.author: kumud
---

# Peer two virtual networks

This script creates and connects two virtual networks in the same region through the Azure network. After running the script, you will create a peering between two virtual networks.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and then run `Connect-AzAccount` to create a connection with Azure.

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

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
