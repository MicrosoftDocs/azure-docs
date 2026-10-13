---
title: "PowerShell script: create a new Azure Data Share"
description: This PowerShell script creates a new data share within an existing Data Share account.
author: chvukosw
ms.author: chvukosw
ms.service: azure-data-share
ms.topic: article
ms.date: 10/13/2026
ms.custom: devx-track-azurepowershell, msecd-doc-authoring-1030
ai-usage: ai-assisted
---

# Use PowerShell to create a data share in Azure

> [!IMPORTANT]
> Azure Data Share is being retired. You can no longer create new Azure Data Share accounts, and existing capabilities will remain in maintenance mode through October 30, 2027. For retirement timelines, transition guidance, and recommended next steps, see the [Azure Data Share retirement announcement](https://aka.ms/ADS-Deprecation).

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

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
