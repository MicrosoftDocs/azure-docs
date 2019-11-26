---
title: Azure CLI Script Sample - Create app and deploy code to staging slot | Microsoft Docs
description: Azure CLI Script Sample - Create an App Service app and deploy code to a staging slot
services: app-service\web
documentationcenter: 
author: msangapu
manager: jeconnoc
editor: 
tags: azure-service-management

ms.assetid: 2b995dcd-e471-4355-9fda-00babcdb156e
ms.service: app-service-web
ms.workload: web
ms.devlang: azurecli
ms.tgt_pltfrm: na
ms.topic: sample
ms.date: 12/11/2017
ms.author: cephalin
ms.custom: mvc
ms.custom: seodec18
---

# Create an App Service app and deploy code to a staging environment using Azure CLI

This sample script creates an app in App Service with an additional deployment slot called "staging", and then deploys a sample app to the "staging" slot.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you need Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/deploy-deployment-slot/deploy-deployment-slot.sh "Create an app and deploy code to a staging environment")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) | Creates an App Service app. |
| [`az webapp deployment slot create`](/cli/azure/webapp/deployment/slot?view=azure-cli-latest#az-webapp-deployment-slot-create) | Create a deployment slot. |
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-config) | Associates an App Service app with a Git or Mercurial repository. |
| [`az webapp deployment slot swap`](/cli/azure/webapp/deployment/slot?view=azure-cli-latest#az-webapp-deployment-slot-swap) | Swap a specified deployment slot into production. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
