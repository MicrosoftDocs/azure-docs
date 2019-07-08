---
title: Azure CLI Script Sample - Create a scheduled backup for an app | Microsoft Docs
description: Azure CLI Script Sample - Create a scheduled backup for an app
services: app-service\web
documentationcenter: 
author: msangapu
manager: jeconnoc
editor: 
tags: azure-service-management

ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: sample
ms.date: 12/11/2017
ms.author: msangapu
ms.reviewer: cephalin
ms.custom: mvc
ms.custom: seodec18
---

# Create a scheduled backup for an App Service app using CLI

This sample script creates an app in App Service with its related resources, and then creates a scheduled backup for it. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you need Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/backup-scheduled/backup-scheduled.sh?highlight=3-7 "Create a scheduled backup for an app")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az storage account create`](/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create) | Creates a storage account. |
| [`az storage container create`](/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-create) | Creates an Azure storage container. |
| [`az storage container generate-sas`](/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-generate-sas) | Generates an SAS token for an Azure storage container.  |
| [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) | Creates an App Service app. |
| [`az webapp config backup update`](/cli/azure/webapp/config/backup?view=azure-cli-latest#az-webapp-config-backup-update) | Configures a new backup schedule for an App Service app. |
| [`az webapp config backup show`](/cli/azure/webapp/config/backup?view=azure-cli-latest#az-webapp-config-backup-show) | Shows the backup schedule for an App Service app. |
| [`az webapp config backup list`](/cli/azure/webapp/config/backup?view=azure-cli-latest#az-webapp-config-backup-list) | Gets a list of backups for an App Service app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
