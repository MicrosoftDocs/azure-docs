---
title: PowerShell Script Sample - Create an Azure App Configuration Store
titleSuffix: Azure App Configuration
description: Create an Azure App Configuration store using a sample PowerShell script. See reference article links to commands used in the script.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: sample
ms.date: 01/18/2023
ms.author: malev 
ms.custom: devx-track-azurepowershell
---

# Create an Azure App Configuration store

This sample script creates a new instance of Azure App Configuration in a new resource group.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

To execute the sample scripts, you need a functional setup of [Azure PowerShell](/powershell/azure/).

1. Open a PowerShell window with admin rights and run `Install-Module -Name Az` to install Azure PowerShell
1. Run: `Install-Module -Name Az.AppConfiguration` to install the App Configuration module.

## Sample script

```powershell

# Create resource group 
New-AzResourceGroup -Name <rg-name> -Location <location>

# Create App Configuration store
New-AzAppConfigurationStore -Name <store-name> -ResourceGroupName <rg-name> -Location <location> -Sku <sku>

# Get the AppConfig connection string 
Get-AzAppConfigurationStoreKey -Name <store-name> -ResourceGroupName <rg-name>
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a new resource group and an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppConfigurationStore](/powershell/module/az.appconfiguration/new-azappconfigurationstore) | Creates an App Configuration store resource. |
| [Get-AzAppConfigurationStoreKey](/powershell/module/az.appconfiguration/get-azappconfigurationstorekey) | List access keys for an App Configuration store. |

## Next steps

For more information on Azure PowerShell, see [Azure CLI documentation](/cli/azure).

Additional App Configuration PowerShell script samples can be found in the [Azure App Configuration  PowerShell samples](../powershell-samples.md).
