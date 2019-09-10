---
title: "PowerShell script: List existing shares in Azure Data Share | Microsoft Docs"
description: This PowerShell script lists and displays details of shares.
services: data-share
author: joannapea

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: joanpo
---

# Use PowerShell to view the details of a sent data share

This PowerShell script lists data shares from an existing account and gets the details of a specific share.


## Sample script

```powershell

# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"

#Lists all data shares within an account
Get-AzDataShare -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName

#Gets details of a specific data share
Get-AzDataShare -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -Name $dataShareName

```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzDataShare](/powershell/module/az.datashare/get-azdatashare?view=azps-2.6.0) | Gets and lists of shares in an account. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
