---
title: 'Tutorial: PHP connect to Azure services securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively from a PHP web app
ms.devlang: csharp, azurecli
ms.topic: tutorial
ms.date: 10/26/2021
author: cephalin
ms.author: cephalin

ms.reviewer: madsd 
ms.custom: devx-track-azurecli, AppServiceConnectivity
---

# Tutorial: Secure Cognitive Service connection from PHP App Service using Key Vault


[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure PHP app

Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

```azurecli-interactive
# Clone and prepare sample application
git clone https://github.com/Azure-Samples/app-service-language-detector.git
cd app-service-language-detector/php
zip default.zip index.php

# Save app name as variable for convenience
appName=<app-name>

az appservice plan create --resource-group $groupName --name $appName --sku FREE --location $region
az webapp create --resource-group $groupName --plan $appName --name $appName
az webapp deployment source config-zip --resource-group $groupName --name $appName --src ./default.zip
```

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]