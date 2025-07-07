---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2025
ms.author: glenga
---

Now that you have deployed a function app and related resources to Azure, can continue to the next step of publishing project code to your app. Otherwise, use these commands to delete the resources, when you no longer need them. 

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name exampleRG
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

You can also remove resources by using the [Azure portal](https://portal.azure.com). 
