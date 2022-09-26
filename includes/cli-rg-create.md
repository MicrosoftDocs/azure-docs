---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 03/25/2022
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

A resource group is a logical container into which Azure resources are deployed and managed. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name "myResourceGroup" --location "EastUS"
```
