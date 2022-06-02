---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
First, configure the deployment source for your web app to be local Git using the [az webapp deployment](/cli/azure/webapp/deployment) command.  

#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment source config-local-git \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --output tsv
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$resourceGroupName='msdocs-expressjs-mongodb-tutorial'
$appServiceName='msdocs-expressjs-mongodb-123'

az webapp deployment source config-local-git `
    --name $appServiceName `
    --resource-group $resourceGroupName `
    --output tsv
```

---

Retrieve the deployment credentials for your application.  These will be needed for Git to authenticate to Azure when you push code to Azure in a later step.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment list-publishing-credentials \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query "{Username:publishingUserName, Password:publishingPassword}"
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $appServiceName `
    --resource-group $resourceGroupName `
    --query "{Username:publishingUserName, Password:publishingPassword}"
```

---
