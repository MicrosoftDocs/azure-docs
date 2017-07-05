---
title: Azure CLI Script Sample - Create a Function App for serverless execution | Microsoft Docs
description: Azure CLI Script Sample - Create a Function App for serverless execution
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
---

# Create a Function App for serverless execution

This sample script creates an Azure Function App, which is a container for your functions. The Function App is created using the [consumption plan](../functions-scale.md#consumption-plan), which is ideal for event-driven serverless workloads.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

This script creates an Azure Function app using the [consumption plan](../functions-scale.md#consumption-plan).

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-consumption/create-function-app-consumption.sh "Create an Azure Function on a consumption plan")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#create) | Creates an Azure Storage account. |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#create) | Creates an Azure Function. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
