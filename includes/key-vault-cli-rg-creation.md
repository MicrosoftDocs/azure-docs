---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by Key Vault CLI quickstarts.

---

A resource group is a logical container into which Azure resources are deployed and managed. Use the [az group create](/cli/azure/group#az_group_create) command to create a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name "myResourceGroup" -l "EastUS"
```
