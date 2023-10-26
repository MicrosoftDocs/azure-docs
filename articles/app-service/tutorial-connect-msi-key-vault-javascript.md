---
title: 'Tutorial: JavaScript connect to Azure services securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively from a JavaScript web app
ms.devlang: javascript, azurecli
ms.topic: tutorial
ms.date: 10/26/2021
author: cephalin
ms.author: cephalin

ms.reviewer: madsd 
ms.custom: devx-track-azurecli, devx-track-js, AppServiceConnectivity
---

# Tutorial: Secure Cognitive Service connection from JavaScript App Service using Key Vault


[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure JavaScript app

Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

```azurecli-interactive
# Clone and prepare sample application
git clone https://github.com/Azure-Samples/app-service-language-detector.git
cd app-service-language-detector/javascript
zip default.zip *.*

# Save app name as variable for convenience
appName=<app-name>

az appservice plan create --resource-group $groupName --name $appName --sku FREE --location $region --is-linux
az webapp create --resource-group $groupName --plan $appName --name $appName --runtime "node|14-lts"
az webapp config appsettings set --resource-group $groupName --name $appName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
az webapp deployment source config-zip --resource-group $groupName --name $appName --src ./default.zip
```

The preceding commands:
* Create a linux app service plan
* Create a web app for Node.js 14 LTS
* Configure the web app to install the npm packages on deployment
* Upload the zip file, and install the npm packages

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]