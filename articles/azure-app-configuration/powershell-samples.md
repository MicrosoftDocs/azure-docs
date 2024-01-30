---
title: PowerShell samples
description: Learn about the Azure PowerShell sample scripts available for App Configuration.
ms.service: azure-app-configuration
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 01/19/2023
ms.author: malev
author: maud-lv
---
# PowerShell samples for Azure App Configuration

The following table includes links to PowerShell scripts built using the [Az.AppConfiguration](/powershell/module/az.appconfiguration) Azure PowerShell command.

| Script | Description |
|-|-|
|**Create store**||
| [Create a configuration store with the specified parameters](scripts/powershell-create-service.md) | Creates an  Azure App Configuration store with some specified parameters. |
|**Delete store**||
| [Delete a configuration store](scripts/powershell-delete-service.md) | Deletes an Azure App Configuration store. |
| [Purge a deleted configuration store](/powershell/module/az.appconfiguration/Clear-AzAppConfigurationDeletedStore) | Purges a deleted Azure App Configuration store, permanently removing all data. |
|**Get and list stores**||
| [Get a deleted configuration store](/powershell/module/az.appconfiguration/Get-AzAppConfigurationDeletedStore) | Gets a deleted Azure App Configuration store. |
| [Get or list configuration stores](/powershell/module/az.appconfiguration/Get-AzAppConfigurationStore) | Gets or lists existing Azure App Configuration stores. |
|**Check store name**||
| [Checks store name availability](/powershell/module/az.appconfiguration/Test-AzAppConfigurationStoreNameAvailability) | Checks whether an Azure App Configuration store name is available for use.|
|**Update store**||
| [Update a store with the specified parameters](/powershell/module/az.appconfiguration/Update-AzAppConfigurationStore) | Updates an Azure App Configuration store with specified parameters. |
|**Manage access keys**||
| [List the access key for the specified store](/powershell/module/az.appconfiguration/Get-AzAppConfigurationStoreKey) | Lists the access key for a specified Azure App Configuration store. |
| [Regenerate an access key for the specified store](/powershell/module/az.appconfiguration/New-AzAppConfigurationStoreKey) | Regenerates an access key for the specified Azure App Configuration store. |
