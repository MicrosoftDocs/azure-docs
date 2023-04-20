---
title: 'CLI: Restore an app from a backup'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to restore an app from a backup.
author: msangapu-msft
tags: azure-service-management

ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.author: msangapu
ms.reviewer: cephalin
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Backup and restore a web app from a backup using CLI

This sample script creates a web app in App Service with its related resources. It then creates a one-time backup for it, and also a scheduled backup for it. Finally, it restores the web app from backup. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/backup-one-time-schedule-restore/backup-restore.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az webapp config backup list`](/cli/azure/webapp/config/backup#az-webapp-config-backup-list) | Gets a list of backups for a web app. |
| [`az webapp config backup restore`](/cli/azure/webapp/config/backup#az-webapp-config-backup-restore) | Restores a web app from a backup. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
