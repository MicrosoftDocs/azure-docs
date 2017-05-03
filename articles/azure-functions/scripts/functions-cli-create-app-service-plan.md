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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 04/11/2017
ms.author: cfowler
---

# Create a Function App in an App Service plan

This sample script creates an Azure Function App, which is a container for your functions. The Function App will be created using a dedicated App Service plan, which means your server resources are always on.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

Create app sample

[!code-azurecli[main](../../../cli_scripts/azure-functions/create-function-app-app-service-plan/create-function-app-app-service-plan.sh "Create an Azure Function on an App Service plan")]

## Clean up deployment

After the script sample has been run, the follow command can be used to remove the resource group, App Service app, and all related resources.

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appserviceplan create](https://docs.microsoft.com/cli/azure/appserviceplan#create) | Creates an App Service plan. |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#delete) | Creates an Azure Function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).