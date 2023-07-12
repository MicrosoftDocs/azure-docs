---
title: "PowerShell script: Create new Azure Data Share account"
description: This PowerShell script creates a new Data Share account.
author: sidontha
ms.service: data-share
ms.topic: article
ms.date: 10/31/2022
ms.author: sidontha 
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to create a data share account in Azure

This PowerShell script creates a new Data Share account. 

## Sample script

```powershell
# Set variables with your own values
$resourceGroupName = "<Resource group name"
$location = "<Location>"
$dataShareAccountName = "<Data share account name>"

# Create a new Azure Data Share account
New-AzDataShareAccount -ResourceGroupName $resourceGroupName -Name $dataShareAccountName -Location $location
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareAccount](/powershell/module/az.datashare/new-azdatashareaccount) | Creates a data share account. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
