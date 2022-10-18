---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/29/2022
---
#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment list-publishing-credentials \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query "{Username:publishingUserName, Password:publishingPassword}" \
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:publishingUserName, Password:publishingPassword}" `
    --output table
```

---
