---
author: rashrig
ms.author: rajeshwarig
ms.date: 09/19/2023
ms.topic: include
ms.service: azure-operator-nexus
---

When no longer needed, delete the resource group. The resource group and all the resources in the resource group are deleted.

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, virtual machine, and all related resources except the Operator Nexus network resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

---

<!-- LINKS - internal -->
[az-group-delete]: /cli/azure/group#az_group_delete