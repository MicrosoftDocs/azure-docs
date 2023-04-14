---
author: msmbaldwin
ms.service: key-vault
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 03/25/2022
ms.author: msmbaldwin
# Generic PowerShell create resource group include for quickstarts.
---

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *eastus* location. 

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "EastUS"
```
