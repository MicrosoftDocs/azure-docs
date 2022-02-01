---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
##### [bash](#tab/terminal-bash)

```azurecli
# Change these values to the ones used to create the App Service.
RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'
APP_SERVICE_NAME='msdocs-expressjs-mongodb-123'

az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

##### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Change these values to the ones used to create the App Service.
$resourceGroupName='msdocs-expressjs-mongodb-tutorial'
$appServiceName='msdocs-expressjs-mongodb-123'

az webapp config appsettings set `
    --resource-group $resourceGroupName `
    --name $appServiceName `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

---
