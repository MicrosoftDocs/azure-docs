---
title: "PowerShell script: Monitor usage a sent share | Microsoft Docs"
description: This PowerShell script retrieves usage metrics of a sent data share.
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

This PowerShell script monitors data usage by listing the synchronizations of a sent data share and getting the details of a specific synchronization.

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
$synchronizationId = "<Azure synchronization id>"

# List synchronizations on a share
Get-AzDataShareSynchronization -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName

#Get details of a specific synchronization
Get-AzDataShareSynchronizationDetails -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName -SynchronizationId $synchronizationId
```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzDataShareSynchronization](/powershell/module/az.resources/get-azdatasharesynchronizationdetails) | List synchronizations on a share. |
| [Get-AzDataShareSynchronizationDetails](/powershell/module/az.resources/get-azdatasharesynchronizationdetails) | Gets synchronization details of a share synchronization. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
