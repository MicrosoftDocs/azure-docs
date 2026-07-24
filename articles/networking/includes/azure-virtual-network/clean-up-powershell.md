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

When you finish using the virtual network and the virtual machines, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all its resources:

```azurepowershell-interactive
# Variable declarations
$resourceGroupName = 'test-rg'       # <resource-group>

$rgParams = @{
    Name = $resourceGroupName
    Force = $true
}
Remove-AzResourceGroup @rgParams
```
