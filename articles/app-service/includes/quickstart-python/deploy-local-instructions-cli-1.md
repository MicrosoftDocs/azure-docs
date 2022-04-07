---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/29/2022
---
#### [bash](#tab/terminal-bash)

```azurecli
# Change these values to the ones used to create the App Service.
RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'
APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'

az webapp deployment source config-local-git \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --output tsv
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Change these values to the ones used to create the App Service.
$RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'
$APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'

az webapp deployment source config-local-git `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --output tsv
```

---
