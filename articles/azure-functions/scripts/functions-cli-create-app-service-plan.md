---
title: Azure CLI Script Sample - Create a Function App in an App Service plan | Microsoft Docs
description: Azure CLI Script Sample - Create a Function App in an App Service plan
services: functions
documentationcenter: functions
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 0e221db6-ee2d-4e16-9bf6-a456cd05b6e7
ms.service: functions
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 04/11/2017
ms.author: cfowler
ms.custom: mvc
---
# Create a Function App in an App Service plan

This sample script creates an Azure Function App, which is a container for your functions. The Function App is created using a dedicated App Service plan, which means your server resources are always on.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script

This script creates an Azure Function app using a dedicated [App Service plan](../functions-scale.md#app-service-plan).

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-app-service-plan/create-function-app-app-service-plan.sh "Create an Azure Function on an App Service plan")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#create) | Creates an Azure Storage account. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appserviceplan#create) | Creates an App Service plan. |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#delete) | Creates an Azure Function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
