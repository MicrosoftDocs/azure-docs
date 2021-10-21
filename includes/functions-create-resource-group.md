---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/04/2018
ms.author: glenga
---
## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources like function apps, databases, and storage accounts are deployed and managed.

The following example creates a resource group named `myResourceGroup`.  
If you aren't using Cloud Shell, sign in first using `az login`.

```azurecli-interactive
az group create --name myResourceGroup --location westeurope
```

You generally create your resource group and the resources in a [region](https://azure.microsoft.com/global-infrastructure/regions/) near you. 
