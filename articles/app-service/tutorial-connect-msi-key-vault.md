---
title: 'Tutorial: Secure Foundry Tools Connection from .NET App Service Using Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively from a .NET web app.
ms.devlang: csharp
# ms.devlang: csharp, azurecli
ms.topic: tutorial
ms.date: 04/06/2026
author: cephalin
ms.author: cephalin

ms.reviewer: jordanselig 
ms.custom: devx-track-azurecli, devx-track-dotnet, AppServiceConnectivity
ms.service: azure-app-service
---

# Tutorial: Secure Foundry Tools connection from .NET App Service using Key Vault


[!INCLUDE [tutorial-content-above-code](./includes/tutorial-connect-msi-key-vault/introduction.md)]

## Configure a .NET app

Install the .NET 8 SDK before you begin. The sample project targets .NET 5; the publish command overrides its target framework to use the supported .NET 8 runtime without changing the sample repository.

1. Clone the sample repository and replace `<app-name>` with a globally unique name:

    ```azurecli-interactive
    appName=<app-name>
    git clone https://github.com/Azure-Samples/app-service-language-detector.git
    cd app-service-language-detector/dotnet
    ```

1. Provision the Linux App Service plan and web app in the resource group created earlier:

    ```azurecli-interactive
    az appservice plan create --sku P0v3 --resource-group $groupName --name $appName --location $region --is-linux
    az webapp create --resource-group $groupName --name $appName --plan $appName --runtime "DOTNETCORE:8.0"
    ```

1. Build the application and package the contents of the publish directory:

    ```azurecli-interactive
    dotnet publish --configuration Release -p:TargetFramework=net8.0 --output publish
    cd publish
    zip -r ../app.zip .
    cd ..
    ```

1. Deploy the package.

    ```azurecli-interactive
    az webapp deploy --resource-group $groupName --name $appName --src-path app.zip --type zip
    ```

## Configure secrets as app settings

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-connect-msi-key-vault/cleanup.md)]
