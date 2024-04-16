---
author: rashirg
ms.author: rajeshwarig
ms.date: 09/19/2023
ms.topic: include
ms.service: azure-operator-nexus
---

When no longer needed, delete the resource group. The resource group and all the resources in the resource group are deleted.

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, virtual machine, and all related resources except the Operator Nexus network resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```
---

<!-- LINKS - internal -->
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
