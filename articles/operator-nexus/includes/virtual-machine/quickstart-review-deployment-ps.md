---
author: rashirg
ms.author: rajeshwarig
ms.date: 09/15/2023
ms.topic: include
ms.service: azure-operator-nexus
---

After the deployment finishes, you can view the resources using PowerShell or the Azure portal.

To view the details of the ```myNexusVirtualMachine``` cluster in the ```myResourceGroup``` resource group, execute the following

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzNetworkCloudVirtualMachine -Name myNexusVirtualMachine `
 -ResourceGroupName myResourceGroup -SubscriptionId mySubscription
```
