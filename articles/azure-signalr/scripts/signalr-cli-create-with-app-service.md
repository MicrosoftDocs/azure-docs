---
title: Azure CLI Script Sample - Create a SignalR Service with an App Service | Microsoft Docs
description: Azure CLI Script Sample - Create SignalR Service with an App Service
services: signalr
documentationcenter: signalr
author: wesmc7777
manager: cfowler
editor: 
tags: azure-service-management

ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: signalr
ms.date: 04/20/2018
ms.author: wesmc
ms.custom: mvc
---

# Create a SignalR Service with an App Service

This sample script creates a new Azure SignalR Service resource, which is used to push real-time content updates to clients. This script also adds a new Web App and App Service plan to host your ASP.NET Core Web App that uses the Azure SignalR Service. The web app is configured with an App Setting named *SignalRConnectionString* to connection to the SignalR service.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/azure-signalr/create-signalr-with-app-service/create-signalr-with-app-service.sh "Create a new Azure SignalR Service and Web App")]

Make a note of the actual name generated for the new resource group. It will be shown in the output. You will use that resource group name when you want to delete all group resources.

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az signalr create](/cli/azure/signalr#az_signalr_create) | Creates an Azure SignalR Service resource. |
| [az signalr key list](/cli/azure/signalr/key#az_signalr_key_list) | List the keys which will be used by your aaplication when pushing real-time content updates with SignalR. |
| [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an Azure App Service Plan for hosting web apps. |
| [az webapp create](/cli/azure/webapp#az_webapp_create) | Creates an Azure Web app using the App Service hosting plan. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure SignalR Service CLI script samples can be found in the [Azure SignalR Service documentation](../signalr-cli-samples.md).
