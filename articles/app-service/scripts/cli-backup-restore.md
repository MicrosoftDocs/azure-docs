---
title: Azure CLI Script Sample - Restore a web app from a backup | Microsoft Docs
description: Azure CLI Script Sample - Restore a web app from a backup
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
ms.date: 12/07/2017
ms.author: msangapu
ms.reviewer: cephalin
ms.custom: mvc
ms.custom: seodec18
---

# Restore a web app from a backup using CLI

This sample script creates a web app in App Service with its related resources, and then creates a one-time backup for it. 

To run this script, you need an existing backup for a web app. To create one, see [Backup up a web app](cli-backup-onetime.md) or [Create a scheduled backup for a web app](cli-backup-scheduled.md).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you need Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/backup-restore/backup-restore.sh?highlight=3-4,9 "Restore a web app from a backup")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az webapp config backup list`](/cli/azure/webapp/config/backup?view=azure-cli-latest#az-webapp-config-backup-list) | Gets a list of backups for a web app. |
| [`az webapp config backup restore`](/cli/azure/webapp/config/backup?view=azure-cli-latest#az-webapp-config-backup-restore) | Restores a web app from a backup. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
