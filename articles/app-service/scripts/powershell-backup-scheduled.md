---
title: 'PowerShell: Create a scheduled backup'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to create a scheduled backup for an app.
author: msangapu-msft
tags: azure-service-management

ms.assetid: a2a27d94-d378-4c17-a6a9-ae1e69dc4a72
ms.topic: sample
ms.date: 10/30/2017
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurepowershell
---

# Create a scheduled backup for a web app using PowerShell

This sample script creates a web app in App Service with its related resources, and then creates a scheduled backup for it. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure. 

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/backup-scheduled/backup-scheduled.ps1?highlight=1-4 "Create a scheduled backup for a web app")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) | Creates a Storage account. |
| [New-AzStorageContainer](/powershell/module/az.storage/new-AzStoragecontainer) | Creates an Azure storage container. |
| [New-AzStorageContainerSASToken](/powershell/module/az.storage/new-AzStoragecontainersastoken) | Generates an SAS token for an Azure storage container. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app. |
| [Edit-AzWebAppBackupConfiguration](/powershell/module/az.websites/edit-azwebappbackupconfiguration) | Edits the backup configuration for web app. |
| [Get-AzWebAppBackupList](/powershell/module/az.websites/get-azwebappbackuplist) | Gets a list of backups for a web app. |
| [Get-AzWebAppBackupConfiguration](/powershell/module/az.websites/get-azwebappbackupconfiguration) | Gets the backup configuration for web app. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
