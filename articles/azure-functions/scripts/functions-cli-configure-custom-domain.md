---
title: Azure CLI Script Sample - Map a custom domain to a function app | Microsoft Docs
description: Azure CLI Script Sample - Map a custom domain to a function app in Azure.
services: functions
documentationcenter: 
author: ggailey777   
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: d127e347-7581-47d7-b289-e0f51f2fbfbc
ms.service: functions
ms.workload: na
ms.devlang: azurecli
ms.tgt_pltfrm: na
ms.topic: sample
ms.date: 06/01/2017
ms.author: glenga
ms.custom: mvc
---
# Map a custom domain to a function app

This sample script creates a function app with related resources, and then maps `www.<yourdomain>` to it. To map to a custom domain, your function app must be created in an App Service plan and not in a consumption plan. Azure Functions only supports mapping a custom domain using an A record.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/configure-custom-domain/configure-custom-domain.sh?highlight=3 "Map a custom domain to a function app")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#create) | Creates a storage account required by the function app. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#create) | Creates an App Service plan required to map a custom domain. |
| [az functionapp create]() | Creates a function app. |
| [az appservice web config hostname add](https://docs.microsoft.com/cli/azure/appservice/web/config/hostname#add) | Maps a custom domain to a function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Functions CLI script samples can be found in the [Azure Functions documentation]().
