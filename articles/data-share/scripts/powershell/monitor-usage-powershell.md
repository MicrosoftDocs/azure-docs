---
title: "PowerShell script: Monitor usage of an Azure Data Share"
description: This PowerShell script retrieves usage metrics of a sent data share.
author: sidontha
ms.service: data-share
ms.topic: article
ms.date: 10/31/2022
ms.author: sidontha 
ms.custom:
---

# Use PowerShell to monitor the usage of a sent data share

This PowerShell script monitors data usage by listing the synchronizations of a sent data share and getting the details of a specific synchronization.

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
| [Get-AzDataShareSynchronization](/powershell/module/az.datashare/get-azdatasharesynchronization) | List synchronizations on a share. |
| [Get-AzDataShareSynchronizationDetails](/powershell/module/az.datashare/get-azdatasharesynchronizationdetail) | Gets synchronization details of a share synchronization. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
