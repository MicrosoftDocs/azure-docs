---
title: Azure CLI Script Sample - Create a web app with continuous deployment from Visual Studio Team Services | Microsoft Docs
description: Azure CLI Script Sample - Create a web app with continuous deployment from Visual Studio Team Services
services: app-service\web
documentationcenter: 
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 389d3bd3-cd8e-4715-a3a1-031ec061d385
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: article
ms.date: 02/21/2017
ms.author: cfowler
---

# Create a web app with continuous deployment from Visual Studio Team Services

This sample script does the following using Azure CLI 2.0: 

* Create a web app in Azure App Service in the West Europe Azure region. 
* Deploy your web app code from Visual Studio Team Services.
* Display the deployed Azure web app in the browser.

## Prerequisites

* Run `az login` to log in to Azure.
* Put your web app code in a Visual Studio Team Services repository.
* For a Visual Studio Team Services repository you own, [create an access token](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/use-personal-access-tokens-to-authenticate).

## Create app sample

[!code-azurecli[main](../../../cli_scripts/app-service/deploy-vsts-continuous/deploy-vsts-continuous.sh?highlight=3-4 "Create a web app with continuous deployment from Visual Studio Team Services")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#create) | Creates an App Service plan. |
| [az appservice web create](https://docs.microsoft.com/cli/azure/appservice/web#delete) | Creates an Azure web app. |
| [az appservice web source-control config](https://docs.microsoft.com/cli/azure/appservice/web/source-control#config) | Associates an Azure web app with a Git or Mercurial repository. |
| [az appservice web browse](https://docs.microsoft.com/cli/azure/appservice/web#browse) | Open an Azure web app in a browser. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../app-service-cli-samples.md).