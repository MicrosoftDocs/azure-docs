---
title: Azure PowerShell Script Sample - Delete a backup for a web app | Microsoft Docs
description: Azure PowerShell Script Sample - Delete a backup for a web app
services: app-service\web
documentationcenter: 
author: msangapu
manager: jeconnoc
editor: 
tags: azure-service-management

ms.assetid: ebcadb49-755d-4202-a5eb-f211827a9168
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: sample
ms.date: 10/30/2017
ms.author: msangapu
ms.custom: mvc
ms.custom: seodec18
---

# Delete a backup for a web using Azure PowerShell

This sample script creates a web app in App Service with its related resources, and then creates a one-time backup for it. 

To run this script, you need an existing backup for a web app. To create one, see [Backup up a web app](powershell-backup-onetime.md) or [Create a scheduled backup for a web app](powershell-backup-scheduled.md).

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/backup-delete/backup-delete.ps1?highlight=1-2,11 "Delete a backup for a web app")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzWebAppBackupList](/powershell/module/az.websites/get-azwebappbackuplist) | Gets a list of backups for a web app. |
| [Remove-AzWebAppBackup](/powershell/module/az.websites/remove-azwebappbackup) | Removes the specified backup of a web app. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
