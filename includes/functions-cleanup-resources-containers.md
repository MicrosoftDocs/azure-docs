---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/05/2023
ms.author: glenga
---

## Clean up resources

If you want to continue working with Azure Function using the resources you created in this article, you can leave all those resources in place. Because you created a Premium Plan for Azure Functions, you'll incur one or two USD per day in ongoing costs.

To avoid ongoing costs, delete the `AzureFunctionsContainers-rg` resource group to clean up all the resources in that group:

```azurecli
az group delete --name AzureFunctionsContainers-rg
```
