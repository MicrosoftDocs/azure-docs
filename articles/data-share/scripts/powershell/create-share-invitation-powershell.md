---
title: "PowerShell script: Create an Azure Data Share invitation"
description: This PowerShell script sends a data share invitation.
author: joannapea
ms.service: data-share
ms.topic: article
ms.date: 01/03/2022
ms.author: joanpo 
ms.custom: devx-track-azurepowershell
---

# Use a PowerShell script to monitor the usage of a sent data share

This PowerShell script creates a data share invitation.

## Sample script


```powershell
# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"
$targetEmail = "<Target email>"

# Send a data share invitation
New-AzDataShareInvitation -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName -Name $dataShareName -TargetEmail $targetEmail

```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareInvitation](/powershell/module/az.datashare/new-azdatashareinvitation) | Create a data share invitation. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
