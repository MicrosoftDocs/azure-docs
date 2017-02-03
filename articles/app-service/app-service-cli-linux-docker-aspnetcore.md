---
title: Azure CLI Script Sample - 
description: Azure CLI Script Sample - 
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

# 

In this scenario

Before running this script, ensure that a connection with Azure has been created using the `az login` command.

## Create 

```azurecli
#/bin/bash

# Ensures unique id
random=$(python -c 'import uuid; print(str(uuid.uuid4())[0:8])')

# Variables
resourceGroupName="myResourceGroup$random"
appName="AppServiceLinuxDocker$random"
location="WestUS"
dockerHubContainerPath="cfowler/aspnetcoresample:0.1"

# Create a Resource Group
az group create --name $resourceGroupName --location $location

# Create an App Service Plan
az appservice plan create --name AppServiceLinuxDockerPlan --resource-group $resourceGroupName --location $location --is-linux --sku S1

# Create a Web App
az appservice web create --name $appName --plan AppServiceLinuxDockerPlan --resource-group $resourceGroupName

# Configure Web App with a Custom Docker Container from Docker Hub
az appservice web config container update --docker-custom-image-name $dockerHubContainerPath --name $appName --resource-group $resourceGroupName
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
| [az appservice web config container update](https://docs.microsoft.com/en-us/cli/azure/appservice/web/config/container#update) | Sets the Docker Container for the Web App. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation]().