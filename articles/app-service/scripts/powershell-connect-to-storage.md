---
title: 'PowerShell: Connect to a storage account'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to connect an app to a storage account.
tags: azure-service-management

ms.assetid: e4831bdc-2068-4883-9474-0b34c2e3e255
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
---

# Connect an App Service app to a storage account

In this scenario you will learn how to create an Azure storage account and an App Service app. Then you will link the storage account to the app using app settings.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/connect-to-storage/connect-to-storage.ps1 "Connect an app to a storage account")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, App Service app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates an App Service app. |
| [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) | Creates a Storage account. |
| [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) | Gets the access keys for an Azure Storage account. |
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies an App Service app's configuration. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service can be found in the [Azure PowerShell samples](../samples-powershell.md).
