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

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP_NAME `
    --name $APP_SERVICE_NAME `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---
