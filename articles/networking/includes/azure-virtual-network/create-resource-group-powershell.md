---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Create a resource group

Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group for the virtual network. Run the following code to create a resource group named **\<resource-group\>** in the **\<region\>** Azure region:

```azurepowershell-interactive
# Variable declarations
$resourceGroupName = 'test-rg'       # <resource-group>
$location = 'eastus2'                # <region>

$rg = @{
    Name = $resourceGroupName
    Location = $location
}
New-AzResourceGroup @rg
```
