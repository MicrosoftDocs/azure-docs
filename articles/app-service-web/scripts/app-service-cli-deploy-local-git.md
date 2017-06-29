---
title: Azure CLI Script Sample - Create a web app and deploy code from a local Git repository | Microsoft Docs
description: Azure CLI Script Sample - Create a web app and deploy code from a local Git repository
services: app-service\web
documentationcenter: 
author: cephalin
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 048f98aa-f708-44cb-9b9e-953f67dc6da8
ms.service: app-service-web
ms.workload: web
ms.devlang: azurecli
ms.tgt_pltfrm: na
ms.topic: sample
ms.date: 06/19/2017
ms.author: cephalin
ms.custom: mvc
---

# Create a web app and deploy code from a local Git repository

This sample script creates a web app in App Service with its related resources, and then deploys your web app code in a local Git repository.


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/deploy-local-git/deploy-local-git.sh?highlight=3-5 "Create a web app and deploy code from a local Git repository")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#create) | Creates an App Service plan. |
| [az webapp create](https://docs.microsoft.com/cli/azure/webapp#create) | Creates an Azure web app. |
| [az webapp deployment user set](https://review.docs.microsoft.com/cli/azure/webapp/deployment/user#set) | Sets the account-level deployment credentials for App Service. |
| [az webapp deployment source config-local-git](https://review.docs.microsoft.com/cli/azure/webapp/deployment/source#config-local-git) | Creates a source control configuration for a local Git repository. |
| [az webapp browse](https://docs.microsoft.com/cli/azure/webapp#browse) | Open an Azure web app in a browser. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../app-service-cli-samples.md).
