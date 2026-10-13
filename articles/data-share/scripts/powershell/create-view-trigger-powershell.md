---
title: "PowerShell script: Create and view an Azure Data Share snapshot triggers"
description: This PowerShell script creates and gets share snapshot triggers.
author: chvukosw
ms.author: chvukosw
ms.service: azure-data-share
ms.topic: article
ms.date: 10/13/2026
ms.custom: devx-track-azurepowershell, msecd-doc-authoring-1030
ai-usage: ai-assisted
---

# Use PowerShell to create and share snapshot triggers

> [!IMPORTANT]
> Azure Data Share is being retired. You can no longer create new Azure Data Share accounts, and existing capabilities will remain in maintenance mode through October 30, 2027. For retirement timelines, transition guidance, and recommended next steps, see the [Azure Data Share retirement announcement](https://aka.ms/ADS-Deprecation).

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
| [New-AzDataShareTrigger](/powershell/module/az.datashare/new-azdatasharetrigger) | Create a share snapshot trigger. |
| [Get-AzDataShareTrigger](/powershell/module/az.datashare/get-azdatasharesynchronizationsetting) | Gets synchronization settings of a share synchronization. |
|||

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
