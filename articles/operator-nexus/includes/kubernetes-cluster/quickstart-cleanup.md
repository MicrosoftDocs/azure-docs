---
author: dramasamy
ms.author: dramasamy
ms.date: 06/26/2023
ms.topic: include
ms.service: azure-operator-nexus
---

When no longer needed, delete the resource group. The resource group and all the resources in the resource group are deleted.

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, Kubernetes cluster, and all related resources except the Operator Nexus network resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, Kubernetes cluster, and all related resources except the Operator Nexus network resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```
---

<!-- LINKS - internal -->
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[az-group-delete]: /cli/azure/group#az_group_delete