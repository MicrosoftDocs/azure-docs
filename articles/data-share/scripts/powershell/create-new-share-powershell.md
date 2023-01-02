---
title: "PowerShell script: create a new Azure Data Share"
description: This PowerShell script creates a new data share within an existing Data Share account.
author: joannapea
ms.service: data-share
ms.topic: article
ms.date: 01/03/2022
ms.author: joanpo 
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to create a Data Share in Azure

This PowerShell script creates a new Data Share within an existing Data Share account.

## Sample script

```powershell

# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"

# Create a new Azure Data Share
New-AzDataShare -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -Name $dataShareName

```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShare](/powershell/module/az.datashare/new-azdatashare) | Creates a data share. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
