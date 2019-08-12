---
title: "PowerShell script: Set and view share sychronization settings| Microsoft Docs"
description: This PowerShell script sets and gets share synchronization settings.
services: data-share
author: t-roupa
ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 07/07/2019
ms.author: t-roupa
---

# Use PowerShell to monitor the usage of a sent data share

This PowerShell script sets and gets share synchronization settings.

## Prerequisites
* **Azure Resource Group**. If you don't have an Azure resource group, see [Create a resource group](../../azure-resource-manager/deploy-to-subscription.md) on creating one.
* **Azure Data Share Account**. If you don't have an Azure data share account, see [Create a data share account](/create-new-share-account.md) on creating one.
* **Azure Data Share**. If you don't have an Azure data share, see [Create a data share](/create-new-share.md) on creating one.

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
| [New-AzDataShareSynchronizationSetting](/powershell/module/az.resources/new-azdatasharesynchronizationsettings) | Create a share synchronization. |
| [Get-AzDataShareSynchronizationSetting](/powershell/module/az.resources/get-azdatasharesynchronizationsetting) | Gets synchronization settings of a share synchronization. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
