---
 title: include file
 description: include file
 services: load-balancer
 author: mbender
 ms.service: load-balancer
 ms.topic: include
 ms.date: 05/31/2024
 ms.author: mbender-ms
ms.custom: include-file
---

## Clean up resources

When no longer needed, you can use the Remove-AzResourceGroup command to remove the resource group you created along with the load balancer, and the remaining resources.

# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Remove-AzResourceGroup -Name 'myResourceGroupLB'
```

# [Azure CLI](#tab/azurecli)

```azurecli
az group delete --name myResourceGroupLB
```
---