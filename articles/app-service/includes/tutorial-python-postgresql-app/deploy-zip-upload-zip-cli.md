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
az webapp deploy \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME  \
    --src-path <zip-file-path> \
    --type zip
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deploy `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME  `
    --src-path <zip-file-path> `
    --type zip
```

---
