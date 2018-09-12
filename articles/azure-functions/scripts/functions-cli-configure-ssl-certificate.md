---
title: Azure CLI Script Sample - Bind a custom SSL certificate to a function app | Microsoft Docs
description: Azure CLI Script Sample - Bind a custom SSL certificate to a function app in Azure
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.assetid: eb95d350-81ea-4145-a1e2-6eea3b7469b2
ms.service: azure-functions
ms.devlang: azurecli
ms.topic: sample
ms.date: 07/03/2013
ms.author: glenga
ms.custom: mvc
---
# Bind a custom SSL certificate to a function app

This sample script creates a function app in App Service with its related resources, then binds the SSL certificate of a custom domain name to it. For this sample, you need:

* Access to your domain registrar's DNS configuration page.
* A valid .PFX file and its password for the SSL certificate you want to upload and bind.
* Have configured an A record in your custom domain that points to your web app's default domain name. For more information, see the [Map custom domain instructions for Azure App Service](https://aka.ms/appservicecustomdns).

To bind an SSL certificate, your function app must be created in an App Service plan and not in a consumption plan.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you must be running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/configure-ssl-certificate/configure-ssl-certificate.sh?highlight=3-5 "Bind a custom SSL certificate to a web app")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#az-storage-account-create) | Creates a storage account required by the function app. |
| [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan required to bind SSL certificates. |
| [az functionapp create](https://docs.microsoft.com/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the App Service plan. |
| [az functionapp config hostname add](https://docs.microsoft.com/cli/azure/functionapp/config/hostname#az-functionapp-config-hostname-add) | Maps a custom domain to a function app. |
| [az functionapp config ssl upload](https://docs.microsoft.com/cli/azure/functionapp/config/ssl#az-functionapp-config-ssl-upload) | Uploads an SSL certificate to a function app. |
| [az functionapp config ssl bind](https://docs.microsoft.com/cli/azure/functionapp/config/ssl#az-functionapp-config-ssl-bind) | Binds an uploaded SSL certificate to a function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../functions-cli-samples.md).
