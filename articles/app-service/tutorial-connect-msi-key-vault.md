---
title: 'Tutorial: .NET connect to Azure services securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively from a .NET web app.
ms.devlang: csharp, azurecli
ms.topic: tutorial
ms.date: 10/26/2021
author: cephalin
ms.author: cephalin

ms.reviewer: madsd 
ms.custom: devx-track-azurecli, devx-track-dotnet, AppServiceConnectivity
---

# Tutorial: Secure Cognitive Service connection from .NET App Service using Key Vault


[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure .NET app

Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

```azurecli-interactive
# Save app name as variable for convenience
appName=<app-name>

# Clone sample application
git clone https://github.com/Azure-Samples/app-service-language-detector.git
cd app-service-language-detector/dotnet

az webapp up --sku F1 --resource-group $groupName --name $appName --plan $appName --location $region
```

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]
