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
ms.devlang: na
ms.topic: article
ms.date: 02/21/2017
ms.author: cephalin
---

# Create a web app and deploy code from a local Git repository

This sample script creates a web app in App Service with its related resources, and then deploys your web app code in a local Git repository.

Before running this script, ensure that a connection with Azure has been created using the `az login` command, and that your application code is committed into a local Git repository.

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../../virtual-machines/virtual-machines-windows-cli-options.md).

## Sample script

[!code-azurecli[main](../../../cli_scripts/app-service/deploy-local-git/deploy-local-git.sh?highlight=3-5 "Create a web app and deploy code from a local Git repository")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, App Service app, and all related resources.

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
| [az appservice web deployment user set](https://docs.microsoft.com/cli/azure/appservice/web/deployment/user#set) | Sets the account-level deployment credentials for App Service. |
| [az appservice web source-control config-local-git](https://docs.microsoft.com/cli/azure/appservice/web/source-control#config-local-git) | Creates a source control configuration for a local Git repository. |
| [az appservice web browse](https://docs.microsoft.com/cli/azure/appservice/web#browse) | Open an Azure web app in a browser. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../app-service-cli-samples.md).