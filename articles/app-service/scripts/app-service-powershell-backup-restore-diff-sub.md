---
title: Azure PowerShell Script Sample - Restore a web app from a backup in another subscription | Microsoft Docs
description: Azure PowerShell Script Sample - Restore a web app from a backup in another subscription
services: app-service\web
documentationcenter: 
author: cephalin
manager: jpconnoc
editor: 
tags: azure-service-management

ms.assetid: a2a27d94-d378-4c17-a6a9-ae1e69dc4a72
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: sample
ms.date: 11/21/2018
ms.author: cephalin
ms.custom: mvc
---

# Restore a web app from a backup in another subscription

This sample script retrieves a previously completed backup from an existing web app and restores it to a web app in another subscription. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzureRmAccount` to create a connection with Azure. 

## Sample script

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/backup-restore-diff-sub/backup-restore-diff-sub.ps1?highlight=1-6 "Restore a web app from a backup in another subscription")]

## Clean up deployment 

If you don't need the web app anymore, use the following command to remove the resource group, web app, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroupName -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Add-AzureRmAccount](/powershell/module/azurerm.profile/add-azurermaccount) | Adds an authenticated account to use for Azure Resource Manager cmdlet requests.  |
| [Get-AzureRmWebAppBackupList](/powershell/module/azurerm.websites/get-azurermwebappbackuplist) | Gets a list of backups for a web app. |
| [New-AzureRmWebApp](/powershell/module/azurerm.websites/new-azurermwebapp) | Creates a web app |
| [Restore-AzureRmWebAppBackup](/powershell/module/azurerm.websites/restore-azurermwebappbackup) | Restores a web app from a previously completed backup. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../app-service-powershell-samples.md).
