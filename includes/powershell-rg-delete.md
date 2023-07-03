---
author: msmbaldwin
ms.service: key-vault
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 03/25/2022
ms.author: msmbaldwin
# Generic PowerShell delete resource group include for quickstarts.
---

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with other quickstarts and tutorials, you may want to leave these resources in place.

When no longer needed, you can use the Azure PowerShell [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup"
```
