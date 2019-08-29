---
title: "PowerShell script: Create and view share snapshot triggers| Microsoft Docs"
description: This PowerShell script creates and gets share snapshot triggers.
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

This PowerShell script creates and gets share snapshot triggers.

## Sample script

```powershell
# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"
$subscriptionName = "<Share subscription name>"
$recurrenceInterval = "<Synchronization recurrence interval>"
$synchronizationTime = "<Synchronization time>"

# Create a new snapshot trigger
New-AzDataShareTrigger -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareSubscriptionName $subscriptionName -Name $dataShareName  -RecurrenceInterval $recurrenceInterval -SynchronizationTime $synchronizationTime

#List snapshot triggers
Get-AzDataShareTrigger -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareSubscriptionName $subscriptionName  -Name $dataShareName

#Get a specific share snapshot trigger
Get-AzDataShareTrigger -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareSubscriptionName -Name $dataShareName
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareTrigger](/powershell/module/az.resources/new-azdatasharetrigger) | Create a share snapshot trigger. |
| [Get-AzDataShareTrigger](/powershell/module/az.resources/get-azdatasharetrigger) | Gets synchronization settings of a share synchronization. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
