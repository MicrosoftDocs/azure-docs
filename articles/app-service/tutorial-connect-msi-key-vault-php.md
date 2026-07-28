---
title: 'Tutorial: PHP Connect to Azure Services Securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively by using a PHP web app.
ms.devlang: csharp
# ms.devlang: csharp, azurecli
ms.topic: tutorial
ms.date: 04/07/2026
author: cephalin
ms.author: cephalin

ms.reviewer: jordanselig 
ms.custom: devx-track-azurecli, AppServiceConnectivity
ms.service: azure-app-service
---

# Tutorial: Secure Foundry Tools connection from a PHP App Service by using Key Vault

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure a PHP app

Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

```azurecli-interactive
# Clone and prepare the sample application
git clone https://github.com/Azure-Samples/app-service-language-detector.git
cd app-service-language-detector/php
zip default.zip index.php

# Save the app name as a variable for convenience
appName=<app-name>

az appservice plan create --resource-group $groupName --name $appName --sku FREE --location $region
az webapp create --resource-group $groupName --plan $appName --name $appName
az webapp deploy --resource-group $groupName --name $appName --src-path ./default.zip
```

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]