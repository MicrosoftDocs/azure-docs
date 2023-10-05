---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 11/21/2018
ms.author: cephalin
ms.subservice: web-apps
---
## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name myResourceGroup
```

This command may take a minute to run.