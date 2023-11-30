---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

A resource group is a logical container into which Azure resources are deployed and managed. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group named *myResourceGroup* in the *southcentralus* location.

```azurecli
az group create --name "myResourceGroup" --location "SouthCentralUS"
```