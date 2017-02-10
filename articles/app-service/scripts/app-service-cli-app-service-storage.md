---
title: Azure CLI Script Sample - Connect a storage account to a web app | Microsoft Docs
description: Azure CLI Script Sample - Connect a storage account to a web app
services: appservice
documentationcenter: appservice
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid:
ms.service: app-service
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 02/01/2017
ms.author: cfowler
---

# Connect a storage account to a web app using Azure CLI 2.0

In this scenario you will learn how to create an azure storage account and a web app then you will link the storage account to the web app using app settings.

Before running this script, ensure that a connection with Azure has been created using the `az login` command.

## Create 

[!code-azurecli[main](../../cli_scripts/app-service/connect-to-storage/setup.sh?highlight=7-10 "Azure Storage")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, web app, storage account and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/en-us/cli/azure/appservice/plan#create) | Creates an App Service Plan. This is like a Server Farm for your App Service Web Apps. |
| [az appservice web create](https://docs.microsoft.com/en-us/cli/azure/appservice/web#create) | Creates a Web App within the App Service Plan. |
| [az storage account create](https://docs.microsoft.com/en-us/cli/azure/storage/account#create) | Creates a storage account. This is where the static assets will be stored. |
| [az storage account show-connection-string](https://docs.microsoft.com/en-us/cli/azure/storage/account#show-connection-string) | |
| [az appservice web config appsetings update](https://docs.microsoft.com/en-us/cli/azure/appservice/web/config/appsettings#update) | Creates or Updates an App Setting. App Settings are exposed as Environment Variables to be consumed by your App |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](https://docs.microsoft.com/en-us/cli/azure/appservice).