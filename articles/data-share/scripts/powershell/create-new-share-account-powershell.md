---
title: "PowerShell script: Create new Azure Data Share account"
description: This PowerShell script creates a new Data Share account.
author: chvukosw
ms.author: sidontha 
ms.service: azure-data-share
ms.topic: article
ms.date: 10/13/2026
ms.custom: devx-track-azurepowershell, msecd-doc-authoring-1030
ai-usage: ai-assisted
---

# Use PowerShell to create a data share account in Azure

> [!IMPORTANT]
> Azure Data Share is being retired. You can no longer create new Azure Data Share accounts, and existing capabilities will remain in maintenance mode through October 30, 2027. For retirement timelines, transition guidance, and recommended next steps, see the [Azure Data Share retirement announcement](https://aka.ms/ADS-Deprecation).

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

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
