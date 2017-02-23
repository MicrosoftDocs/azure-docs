---
title: Azure CLI Script Sample - Monitor a web app using Web Server Logs using Azure CLI 2.0 | Microsoft Docs
description: Azure CLI Script Sample - Monitor a web app using Web Server Logs using Azure CLI 2.0
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

# Monitor a web app with Web Server Logs using Azure CLI 2.0

In this scenario you will create a resource group, app service plan, web app and configure the web app to enable web server logs. You will then download the log files for review.

Before running this script, ensure that a connection with Azure has been created using the `az login` command.

## Create 

[!code-azurecli[main](../../../cli_scripts/app-service/monitor-with-logs/monitor-with-logs.sh?highlight=7-9 "Monitor Logs")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, web app, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/en-us/cli/azure/appservice/plan#create) | Creates an App Service Plan. This is like a Server Farm for your App Service Web Apps. |
| [az appservice web create](https://docs.microsoft.com/en-us/cli/azure/appservice/web#create) | Creates a Web App within the App Service Plan. |
| [az appservice web log config](https://docs.microsoft.com/en-us/cli/azure/appservice/web/log#config) | Configures which Logs your Web App will persist. |
| [az appservice web log download](https://docs.microsoft.com/en-us/cli/azure/appservice/web/log#download) | Downloads the logs of the Web App to your local machine. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](https://docs.microsoft.com/en-us/cli/azure/appservice).