---
title: Azure CLI Script Sample - Store static files for your web app using Azure Storage | Microsoft Docs
description: Azure CLI Script Sample - Store static files for your web app using Azure Storage
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

# Store static files for your web app using Azure Storage

In this scenario

Before running this script, ensure that a connection with Azure has been created using the `az login` command.

## Create 

```azurecli
#/bin/bash

# Ensures unique id
random=$(python -c 'import uuid; print(str(uuid.uuid4())[0:8])')

# Variables
resourceGroupName="myResourceGroup$random"
appName="AppServiceMonitor$random"
location="WestUS"

# Create a Resource Group
az group create --name $resourceGroupName --location $location

# Create an App Service Plan
az appservice plan create --name AppServiceMonitorPlan --resource-group $resourceGroupName --location $location

# Create a Web App and save the URL
url=$(az appservice web create --name $appName --plan AppServiceMonitorPlan --resource-group $resourceGroupName --query defaultHostName | sed -e 's/^"//' -e 's/"$//')

# Enable all logging options for the Web App
az appservice web log config --name $appName --resource-group $resourceGroupName --application-logging true --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem

# Create a Web Server Log
curl -s -L $url/404

# Download the log files for review
az appservice web log download --name $appName --resource-group $resourceGroupName
```

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/en-us/cli/azure/appservice/plan#create) | Creates an App Service Plan. This is like a Server Farm for your App Service Web Apps. |
| [az appservice web create](https://docs.microsoft.com/en-us/cli/azure/appservice/web#create) | Creates a Web App within the App Service Plan. |
| [az appservice web log config]() | |
| [az appservice web log download]() | |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation]().