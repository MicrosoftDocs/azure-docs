---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 10/19/2021
ms.author: cephalin
ms.subservice: web-apps
ms.custom: devx-track-azurepowershell
---
## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following PowerShell command:

```azurecli-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

This command may take a minute to run.
