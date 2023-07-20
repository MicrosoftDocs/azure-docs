---
author: dramasamy
ms.author: dramasamy
ms.date: 07/09/2023
ms.topic: include
ms.service: azure-operator-nexus
---

After the deployment finishes, you can view the resources using the CLI or the Azure portal.

To view the details of the ```myNexusVirtualMachine``` cluster in the ```myResourceGroup``` resource group, execute the following Azure CLI command:

```azurecli
az networkcloud virtualmachine show \
  --name myNexusVirtualMachine \
  --resource-group myResourceGroup
```
