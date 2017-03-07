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

This sample script creates a web app in App Service with its related resources, and then sets up continuous deployment from a Visual Studio Team Services (VSTS) repository. 

Before running this script, ensure the following:

- A connection with Azure has been created using the `az login` command.
- The application code is in a public or private Visual Studio Team Services repository that you own.
- You have [created an access token in VSTS](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/use-personal-access-tokens-to-authenticate).

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../../virtual-machines/virtual-machines-windows-cli-options.md).

## Create app sample

[!code-azurecli[main](../../../cli_scripts/app-service/deploy-vsts-continuous/deploy-vsts-continuous.sh?highlight=3-4 "Create a web app with continuous deployment from Visual Studio Team Services")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, web app, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

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