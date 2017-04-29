---
title: Azure CLI Script Sample - Connect a web app to documentdb | Microsoft Docs
description: Azure CLI Script Sample - Connect a web app to documentdb
services: appservice
documentationcenter: appservice
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: bbbdbc42-efb5-4b4f-8ba6-c03c9d16a7ea
ms.service: app-service
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 03/20/2017
ms.author: cfowler
---

# Connect a web app to a documentdb

In this scenario you will learn how to create an Azure documentdb and an Azure web app. Then you will link the documentdb to the web app using app settings.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/app-service/connect-to-documentdb/connect-to-documentdb.sh "Azure DocumentDB")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group, web app, documentdb and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#create) | Creates an App Service plan. This is like a server farm for your Azure web app. |
| [az appservice web create](https://docs.microsoft.com/cli/azure/appservice/web#create) | Creates an Azure web app within the App Service plan. |
| [az documentdb create](https://docs.microsoft.com/en-us/cli/azure/documentdb#create) | Creates a documentdb. This is where the data will be stored. |
| [az documentdb list-keys](https://docs.microsoft.com/en-us/cli/azure/documentdb#list-keys) | Lists the access keys for the specified Azure DocumentDB database account. |
| [az appservice web config appsetings update](https://docs.microsoft.com/cli/azure/appservice/web/config/appsettings#update) | Creates or updates an app setting for an Azure web app. App settings are exposed as environment variables for your app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../app-service-cli-samples.md).