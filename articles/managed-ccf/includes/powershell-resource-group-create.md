---
author: msmbaldwin
ms.service: azure-confidential-ledger
ms.topic: include
ms.date: 04/16/2025
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *southcentralus* location.

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "SouthCentralUS"
```