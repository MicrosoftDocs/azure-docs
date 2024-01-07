---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---


Run `az webapp ssh` to open an SSH session for the web app in the browser:

#### [bash](#tab/terminal-bash)

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME \
              --name $APP_SERVICE_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME `
              --name $APP_SERVICE_NAME
```

---
