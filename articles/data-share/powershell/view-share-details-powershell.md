---
title: "PowerShell script: View details of data shares | Microsoft Docs"
description: This PowerShell script lists and displays details of shares.
services: data-share
author: t-roupa

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: t-roupa
---

# Use PowerShell to view the details of a sent data share

This PowerShell script lists data shares from an existing account and gets the details of a specific share.

## Prerequisites
* **Azure Resource Group**. If you don't have an Azure resource group, see the [Create a resource group](../../azure-resource-manager/deploy-to-subscription.md) on creating one.
* **Azure Data Share Account**. If you don't have an Azure data share account, see the [Create a data share account](/create-new-share.md) on creating one.
* **Azure Data Share**. If you don't have an Azure data share, see the [Create a data share](/create-new-share.md) on creating one.

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
| [Get-AzDataShare](/powershell/module/az.resources/get-az) | Gets and lists of shares in an account. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
