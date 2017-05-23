---
title: Azure CLI Script Sample - Deploy a web app to a staging environment | Microsoft Docs
description: Azure CLI Script Sample - Deploy a web app to a staging environment
services: app-service\web
documentationcenter: 
author: cephalin
manager: erikre
editor: 
tags: azure-service-management

ms.assetid:
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: article
ms.date: 02/01/2017
ms.author: cephalin
---

# Deploy a web app to a staging environment

This sample script does the following using Azure CLI 2.0: 

* Create a web app in Azure App Service in the West Europe Azure region.
* Upgrade the App Service plan to STANDARD tier (minimum for deployment slots).
* Set up a deployment slot named "staging".
* Deploy your web app code from GitHub to the staging slot.
* Open the deployed staging slot in the browser for verification.
* Swap the staging slot into production.

## Prerequisites

* Run `az login` to log in to Azure.
* Put your web app code in a GitHub repository you own.

> [!NOTE]
> If you use a public GitHub repository you don't own, App Service will deploy code from that GitHub repository, but
> cannot set up the SSH key and webhooks necessary for continuous deployment.
>
>

## Create VM sample

[!code-azurecli[main](../../cli_scripts/app-service/deploy-deployment-slot/deploy-deployment-slot.sh "Deploy a web app to a staging environment")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, web app, and all related resources.

```azurecli
az group delete --name $webappname
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/en-us/cli/azure/appservice/plan#create) | Creates an App Service plan. |
| [az appservice web create](https://docs.microsoft.com/en-us/cli/azure/appservice/web#delete) | Creates a web app. |
| [az appservice plan update](https://docs.microsoft.com/en-us/cli/azure/appservice/plan#update) | Update an App Service plan to scale its pricing tier. |
| [az appservice web deployment slot create](https://docs.microsoft.com/en-us/cli/azure/appservice/web/deployment/slot#create) | Create a deployment slot. |
| [az appservice web source-control config](https://docs.microsoft.com/en-us/cli/azure/appservice/web/source-control#config) | Associates a web app with a Git or Mercurial repository. |
| [az appservice web browse](https://docs.microsoft.com/en-us/cli/azure/appservice/web#browse) | Open a web app in a browser. |
| [az appservice web deployment slot swap](https://docs.microsoft.com/en-us/cli/azure/appservice/web/deployment/slot#swap) | Swap a specified deployment slot into production. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional CLI script samples for Azure App Service Web Apps can be found in the [Azure CLI samples]().
