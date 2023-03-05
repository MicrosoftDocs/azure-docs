---
title: PowerShell script sample - Create an Azure App Configuration store
titleSuffix: Azure App Configuration
description: Create an Azure App Configuration store using a sample PowerShell script. See reference article links to commands used in the script.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: sample
ms.date: 02/12/2023
ms.author: malev 
ms.custom: devx-track-azurepowershell
---

# Create an Azure App Configuration store with PowerShell

This sample script creates a new instance of Azure App Configuration in a new resource group using PowerShell.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

To execute the sample scripts, you need a functional setup of [Azure PowerShell](/powershell/azure/).

Open a PowerShell window with admin rights and run `Install-Module -Name Az` to install Azure PowerShell

## Sample script

```powershell
# Create a resource group 
New-AzResourceGroup -Name <resource-group-name> -Location <location>

# Create an App Configuration store
New-AzAppConfigurationStore -Name <store-name> -ResourceGroupName <resource-group-name> -Location <location> -Sku <sku>

# Get the App Configuration connection string 
Get-AzAppConfigurationStoreKey -Name <store-name> -ResourceGroupName <resource-group-name>
```

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

```powershell
Remove-AzResourceGroup -Name <resource-group-name> 
```

## Script explanation

This script uses the following commands to create a new resource group and an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppConfigurationStore](/powershell/module/az.appconfiguration/new-azappconfigurationstore) | Creates an App Configuration store resource. |
| [Get-AzAppConfigurationStoreKey](/powershell/module/az.appconfiguration/get-azappconfigurationstorekey) | Lists access keys for an App Configuration store. |

## Next steps

For more information about Azure PowerShell, check out the [Azure PowerShell documentation](/powershell/azure/).

More App Configuration script samples for PowerShell can be found in the [Azure App Configuration PowerShell samples](../powershell-samples.md).
