---
title: 'Tutorial: Python connect to Azure services securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively from a Python web app
ms.devlang: python
# ms.devlang: python, azurecli
ms.topic: tutorial
ms.date: 08/05/2024
author: cephalin
ms.author: cephalin

ms.reviewer: madsd 
ms.custom: devx-track-azurecli, devx-track-python, AppServiceConnectivity
---

# Tutorial: Secure Cognitive Service connection from Python App Service using Key Vault


[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure Python app

Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

```azurecli-interactive
# Clone and prepare sample application
git clone https://github.com/Azure-Samples/app-service-language-detector.git
cd app-service-language-detector/python
zip -r default.zip .

# Save app name as variable for convenience
appName=<app-name>

az appservice plan create --resource-group $groupName --name $appName --sku FREE --location $region --is-linux
az webapp create --resource-group $groupName --plan $appName --name $appName --runtime "python:3.11"
az webapp config appsettings set --resource-group $groupName --name $appName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
az webapp deploy --resource-group $groupName --name $appName --src-path ./default.zip
```

The preceding commands:
* Create a linux app service plan
* Create a web app for Python 3.11
* Configure the web app to install the python packages on deployment
* Upload the zip file, and install the python packages

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]