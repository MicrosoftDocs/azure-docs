---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *southcentralus* location.

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "SouthCentralUS"
```