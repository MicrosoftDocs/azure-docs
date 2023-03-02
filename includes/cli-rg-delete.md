---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 03/25/2022
ms.author: msmbaldwin

# Generic CLI delete resource group include for quickstarts.

---

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, you can use the Azure CLI [az group delete](/cli/azure/group) command to remove the resource group and all related resources:

```azurecli
az group delete --name "myResourceGroup"
```
