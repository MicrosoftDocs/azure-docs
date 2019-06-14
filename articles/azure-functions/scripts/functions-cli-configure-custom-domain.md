---
title: Azure CLI Script Sample - Map a custom domain to a function app | Microsoft Docs
description: Azure CLI Script Sample - Map a custom domain to a function app in Azure.
services: functions
documentationcenter: 
author: ggailey777   
manager: jeconnoc

ms.assetid: d127e347-7581-47d7-b289-e0f51f2fbfbc
ms.service: azure-functions
ms.devlang: azurecli
ms.topic: sample
ms.date: 07/04/2018
ms.author: glenga
ms.custom: mvc
---
# Map a custom domain to a function app

This sample script creates a function app in an App Service plan and then maps it to a custom domain that you provide. When your function app is hosted in a [Premium plan](../functions-scale.md#premium-plan) or an [App Service plan](../functions-scale.md#app-service-plan), you can map a custom domain using either a CNAME or an A record. For function apps in a [Consumption plan](../functions-scale.md#consumption-plan), only the CNAME option is supported. This sample creates an App Service plan and requires an A record to map the domain. 

To run this sample script, you must have already configured an A record in your custom domain that points to your web app's default domain name. For more information, see the [Map custom domain instructions for Azure App Service](https://aka.ms/appservicecustomdns). 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you must use the Azure CLI version 2.0 or a later version. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 


## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/configure-custom-domain/configure-custom-domain.sh?highlight=3 "Map a custom domain to a function app")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#az-storage-account-create) | Creates a storage account required by the function app. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan required to map a custom domain. |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the App Service plan. |
| [az functionapp config hostname add](https://docs.microsoft.com/cli/azure/functionapp/config/hostname#az-functionapp-config-hostname-add) | Maps a custom domain to a function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
