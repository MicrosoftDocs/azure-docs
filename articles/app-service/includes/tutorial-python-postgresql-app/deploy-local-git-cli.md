---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python, devx-track-azurecli
---

First, you need to tell Azure what branch to use for deployment. This value is stored in the app settings for the web app with a key of `DEPLOYMENT_BRANCH`. For this example, you will be deploying code from the `main` branch.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --settings DEPLOYMENT_BRANCH='main'
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --settings DEPLOYMENT_BRANCH='main'
```

---

Next, configure the deployment source for your web app to be local Git using the `az webapp deployment source` command.  This command will output the URL of the remote Git repository that you will be pushing code to.  Make a copy of this value as you will need it in a later step.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment source config-local-git \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --output tsv
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deployment source config-local-git `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --output tsv
```

---

Retrieve the deployment credentials for your application.  These will be needed for Git to authenticate to Azure when you push code to Azure in a later step.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment list-publishing-credentials \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query "{Username:join(\`\u005C\`, [name,publishingUserName]), Password:publishingPassword}" \
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:join(\`\u005C\`, [name,publishingUserName]), Password:publishingPassword}" `
    --output table
```

---
