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
app1Name="AppServiceTM1$random"
app2Name="AppServiceTM2$random"
location1="WestUS"
location2="EastUS"

# Create a Resource Group
az group create --name $resourceGroupName --location $location1

# Create a Traffic Manager Profile
az network traffic-manager profile create --name $resourceGroupName-tmp --resource-group $resourceGroupName --routing-method Performance --unique-dns-name $resourceGroupName

# Create App Service Plans in two Regions
az appservice plan create --name $app1Name-Plan --resource-group $resourceGroupName --location $location1 --sku S1
az appservice plan create --name $app2Name-Plan --resource-group $resourceGroupName --location $location2 --sku S1

# Add a Web App to each App Service Plan
site1=$(az appservice web create --name $app1Name --plan $app1Name-Plan --resource-group $resourceGroupName --query id --output tsv)
site2=$(az appservice web create --name $app2Name --plan $app2Name-Plan --resource-group $resourceGroupName --query id --output tsv)

# Assign each Web App as an Endpoint for high-availabilty
az network traffic-manager endpoint create -n $app1Name-$location1 --profile-name $resourceGroupName-tmp -g $resourceGroupName --type azureEndpoints --target-resource-id $site1
az network traffic-manager endpoint create -n $app2Name-$location2 --profile-name $resourceGroupName-tmp -g $resourceGroupName --type azureEndpoints --target-resource-id $site2
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
| [az network traffic-manager profile create](https://docs.microsoft.com/en-us/cli/azure/network/traffic-manager/profile#create) | |
| [az network traffic-manager endpoint create](https://docs.microsoft.com/en-us/cli/azure/network/traffic-manager/endpoint#create) | |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation]().