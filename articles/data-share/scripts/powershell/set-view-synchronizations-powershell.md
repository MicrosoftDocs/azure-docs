---
title: "PowerShell script: Set and view Azure Data Share synchronization settings"
description: This PowerShell script sets and gets share synchronization settings.
author: sidontha
ms.service: data-share
ms.topic: article
ms.date: 10/31/2022
ms.author: sidontha 
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to set Azure Data Share synchronization settings

This PowerShell script sets and gets share synchronization settings.

## Sample script


```powershell
# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"
$settingName = "<Synchronization setting name>"
$recurrenceInterval = "<Synchronization recurrence interval>"
$synchronizationTime = "<Synchronization time>"

# Create a new synchronization setting
New-AzDataShareSynchronizationSetting -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName -Name $settingName  -RecurrenceInterval $recurrenceInterval -SynchronizationTime $synchronizationTime

#List share synchronization settings
Get-AzDataShareSynchronizationSetting -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName  -ShareName $dataShareName 

#Get a specific share synchronization setting
Get-AzDataShareSynchronizationSetting -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName  -ShareName $dataShareName -Name $settingName  
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareSynchronizationSetting](/powershell/module/az.datashare/new-azdatasharesynchronizationsetting) | Create a share synchronization. |
| [Get-AzDataShareSynchronizationSetting](/powershell/module/az.datashare/get-azdatasharesynchronizationsetting) | Gets synchronization settings of a share synchronization. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
