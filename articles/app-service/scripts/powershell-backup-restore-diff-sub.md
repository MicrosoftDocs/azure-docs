---
title: 'PowerShell: Restore backup to another subscription'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to restore a backup in another subscription.
author: msangapu-msft
tags: azure-service-management

ms.assetid: a2a27d94-d378-4c17-a6a9-ae1e69dc4a72
ms.topic: sample
ms.date: 11/21/2018
ms.author: msangapu
ms.custom: mvc, seodec18
---

# Restore a web app from a backup in another subscription using PowerShell

This sample script retrieves a previously completed backup from an existing web app and restores it to a web app in another subscription. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure. 

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/backup-restore-diff-sub/backup-restore-diff-sub.ps1?highlight=1-6 "Restore a web app from a backup in another subscription")]

## Clean up deployment 

If you don't need the web app anymore, use the following command to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name $resourceGroupName -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Add-AzAccount](/powershell/module/az.accounts/connect-azaccount) | Adds an authenticated account to use for Azure Resource Manager cmdlet requests.  |
| [Get-AzWebAppBackupList](/powershell/module/az.websites/get-azwebappbackuplist) | Gets a list of backups for a web app. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app |
| [Restore-AzWebAppBackup](/powershell/module/az.websites/restore-azwebappbackup) | Restores a web app from a previously completed backup. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
