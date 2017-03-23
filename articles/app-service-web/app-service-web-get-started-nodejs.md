---
title: Create a Node.js Application on Web App with the Azure CLI 2.0 | Microsoft Docs
description: Learn how easy it is to run web apps in App Service by deploying a sample Node.js app. 
services: app-service\web
documentationcenter: ''
author: cephalin
manager: wpickett
editor: ''

ms.assetid: 412cc786-5bf3-4e1b-b696-6a08cf46501e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/17/2017
ms.author: cephalin

---
# Create a Node.js Application on Web App with the Azure CLI 2.0
[!INCLUDE [app-service-web-selector-get-started](../../includes/app-service-web-selector-get-started.md)] 

The Azure CLI 2.0 is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a Node.js Application on Web App.

If needed, install the Azure CLI using the instruction found in the [Azure CLI installation guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), and then run `az login` to create a connection with Azure.

## Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](https://docs.microsoft.com/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

```azurecli
az group create --name myResourceGroup --location westeurope 
```

> [!TIP]
> To see what possible values you can use for `--location`, use the `az appservice list-locations` Azure CLI command.

## Create an App Service plan

Create an App Service plan on Linux Worker with the [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#create) command.

The following example creates an App Service Plan on Linux Workers named `quickStartASP` using the **Standard** pricing tier.

```azurecli
az appservice plan create --name quickStartASP --resource-group myResourceGroup --sku S1 --is-linux 
```

When the App Service Plan has been created, the Azure CLI shows information similar to the following example.

```azurecli
{
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/quickStarts/providers/Microsoft.Web/serverfarms/quickStartASP",
    "kind": "linux",
    "location": "West Europe",
    "sku": {
    "capacity": 1,
    "family": "S",
    "name": "S1",
    "tier": "Standard"
    },
    "status": "Ready",
    "type": "Microsoft.Web/serverfarms"
}
``` 

## Create a web app 

Create a web app using the [az appservice web create](https://docs.microsoft.com/cli/azure/appservice/web#create) command.

The following example creates the Web App in the previously created App Service Plan.

```azurecli
az appservice web create --name <app-name> --plan quickStartPlan --resource-group myResourceGroup
```

When the Web App has been created, the Azure CLI shows information similar to the following example.

```azurecli
{
    "clientAffinityEnabled": true,
    "defaultHostName": "<app-name>.azurewebsites.net",
    "id": "/subscriptions/5d6c94cd-6781-43e3-8a94-ceef4c28850e/resourceGroups/quickStarts/providers/Microsoft.Web/sites/<app-name>",
    "isDefaultContainer": null,
    "kind": "app",
    "location": "West Europe",
    "name": "<app-name>",
    "repositorySiteName": "<app-name>",
    "reserved": true,
    "resourceGroup": "quickStarts",
    "serverFarmId": "/subscriptions/5d6c94cd-6781-43e3-8a94-ceef4c28850e/resourceGroups/quickStarts/providers/Microsoft.Web/serverfarms/quickStartPlan",
    "state": "Running",
    "type": "Microsoft.Web/sites",
}
```

## Configure the Node.js version

Use the [az appservice web config update](https://docs.microsoft.com/en-us/cli/azure/appservice/web/config#update) command to configure the Web App to use Node.js version `6.9.3`. Setting the node.js version this way uses a default container provided by the platform, if you would like to use your own container refer to the reference for the [az appservice web config container update](https://docs.microsoft.com/en-us/cli/azure/appservice/web/config/container#update) command.

```azurecli
az appservice web config update --node-version 6.9.3 --name <app_name> --resource-group myResourceGroup
```

## Configure deployment from GitHub

Use the [az appservice web source-control config](https://docs.microsoft.com/en-us/cli/azure/appservice/web/source-control#config) command to configure continuous integration of your application from GitHub. Using the `--manual-integration` flag is required on GitHub repositories of which you do not have administrative permissions.

```azurecli
az appservice web source-control config --name <app_name> --resource-group myResourceGroup \
--repo-url "https://github.com/Azure-Samples/app-service-web-nodejs-get-started.git" --branch master --manual-integration 
```

## Browse to the app

Use the [az appservice web browse](https://docs.microsoft.com/en-us/cli/azure/appservice/web#browse) command to launch the application using your default web browser.

```azurecli
az appservice web browse --name <app_name> --resource-group myResourceGroup
```

Congratulations, your first Node.js web app is running live in Azure App Service.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Explore pre-created [Web apps CLI scripts](app-service-cli-samples.md).
