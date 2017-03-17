---
title: Quickstart for Node.js in Azure Web App | Microsoft Docs
description: Deploy your first Node.js Hello World in App Service Web App in minutes. 
services: app-service\web
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/15/2017
ms.author: cfowler
---

# Create a Node.js Application on Web App with the Azure CLI 2.0

The Azure CLI 2.0 is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a Node.js Application on Web App.

If needed, install the Azure CLI using the instruction found in the Azure CLI installation guide, and then run az login to create a connection with Azure.

## Before you begin

Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. [Download and install Node.js and NPM](https://nodejs.org/)
1. Download, install and initialize the [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

This quickstart demonstrates a simple Node.js application.

## Download the Hello World app

Clone the Hello World sample app repository to your local machine.

```cli
git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
```

> [!TIP]
> Alternatively, you can [download the sample](https://github.com/Azure-Samples/nodejs-docs-hello-world/archive/master.zip) as a zip file and extract it.

Change to the directory that contains the sample code.

```cli
cd nodejs-docs-hello-world
```

## Run Hello World on your local machine

Run the start script using `npm`.

```cli
npm start
```

Open a web browser, and navigate to the sample.

```cli
http://localhost:1337
```

You can see the **Hello World** message from the sample app displayed in the page.

In your terminal window, press **Ctrl+C** to exit the web server.

## Create a resource group

Create a resource group with the az group create. An Azure resource group is a logical container into which Azure resources are deployed and managed.

```azurecli
az group create --location westeurope --name myResourceGroup
```

## Create an App Service plan

Create an App Service Plan on Linux Worker with the az appservice plan create command.

The following example creates an App Service Plan on Linux Workers named quickStartASP using the Standard pricing tier.

```azurecli
az appservice plan create --name <app_name> --resource-group myResourceGroup --sku S1 --is-linux
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

## Create a Web App

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan <app_name>
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
    "serverFarmId": "/subscriptions/5d6c94cd-6781-43e3-8a94-ceef4c28850e/resourceGroups/quickStarts/providers/Microsoft.Web/serverfarms/quickStartASP",
    "state": "Running",
    "type": "Microsoft.Web/sites",
}
```

## Configure the web app

Use the az appservice web config update command to configure the Web App to use Node.js version 6.9.3. Setting the node.js version this way uses a default container provided by the platform, if you would like to use your own container refer to the reference for the az appservice web config container update command.

```azurecli
az appservice web config update --node-version 6.9.3 --startup-file index.js --name <app_name> --resource-group myResourceGroup
```

## Configure local git deployment



```azurecli
az appservice web deployment user set --user-name <username> --password <password>
```

Use the [az appservice web source-control config-local-git](https://docs.microsoft.com/en-us/cli/azure/appservice/web/source-control#config-local-git) command to configure local git access to the Web App.

```azurecli
az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
```

## Push to Azure from Git

Add an Azure remote to your local Git repository.

```cli
git remote add azure <paste-previous-command-output-here>
```

Push to the Azure remote to deploy your application.

```azurecli
git push azure master
```

## Browse to the app

```azurecli
az appservice web browse --name <app_name> --resource-group myResourceGroup
```

This time, the page that displays the Hello World message is delivered by a web server running on App Service Web App.

**Congratulations!** You've deployed your first Node.js app to App Service Web App.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Explore pre-created [Web Apps CLI scripts](app-service-cli-samples.md).