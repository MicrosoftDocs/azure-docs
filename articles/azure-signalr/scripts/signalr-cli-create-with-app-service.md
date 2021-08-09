---
title: Create SignalR Service with App Service using Azure CLI
description: Use Azure CLI to create SignalR Service with App Service. Learn all CLI commands for Azure SignalR Service.
author: sffamily
ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.date: 11/13/2018
ms.author: zhshang
ms.custom: mvc, devx-track-azurecli
---

# Create a SignalR Service with an App Service

This sample script creates a new Azure SignalR Service resource, which is used to push real-time content updates to clients. This script also adds a new Web App and App Service plan to host your ASP.NET Core Web App that uses the SignalR Service. The web app is configured with an App Setting named *AzureSignalRConnectionString* to connect to the new SignalR service resource.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This script uses the *signalr* extension for the Azure CLI. Execute the following command to install the *signalr* extension for the Azure CLI before using this sample script:

```azurecli-interactive
#!/bin/bash

# Generate a unique suffix for the service name
let randomNum=$RANDOM*$RANDOM

# Generate unique names for the SignalR service, resource group, 
# app service, and app service plan
SignalRName=SignalRTestSvc$randomNum
#resource name must be lowercase
mySignalRSvcName=${SignalRName,,}
myResourceGroupName=$SignalRName"Group"
myWebAppName=SignalRTestWebApp$randomNum
myAppSvcPlanName=$myAppSvcName"Plan"

# Create resource group 
az group create --name $myResourceGroupName --location eastus

# Create the Azure SignalR Service resource
az signalr create \
  --name $mySignalRSvcName \
  --resource-group $myResourceGroupName \
  --sku Standard_S1 \
  --unit-count 1 \
  --service-mode Default

# Create an App Service plan.
az appservice plan create --name $myAppSvcPlanName --resource-group $myResourceGroupName --sku FREE

# Create the Web App
az webapp create --name $myWebAppName --resource-group $myResourceGroupName --plan $myAppSvcPlanName  

# Get the SignalR primary connection string
primaryConnectionString=$(az signalr key list --name $mySignalRSvcName \
  --resource-group $myResourceGroupName --query primaryConnectionString -o tsv)

#Add an app setting to the web app for the SignalR connection
az webapp config appsettings set --name $myWebAppName --resource-group $myResourceGroupName \
  --settings "AzureSignalRConnectionString=$primaryConnectionString"
```

Make a note of the actual name generated for the new resource group. It will be shown in the output. You will use that resource group name when you want to delete all group resources.

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az signalr create](/cli/azure/signalr#az_signalr_create) | Creates an Azure SignalR Service resource. |
| [az signalr key list](/cli/azure/signalr/key#az_signalr_key_list) | List the keys, which will be used by your application when pushing real-time content updates with SignalR. |
| [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an Azure App Service Plan for hosting web apps. |
| [az webapp create](/cli/azure/webapp#az_webapp_create) | Creates an Azure Web app using the App Service hosting plan. |
| [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) | Adds a new app setting for the web app. This app setting is used to store the SignalR connection string. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure SignalR Service CLI script samples can be found in the [Azure SignalR Service documentation](../signalr-reference-cli.md).
