---
title: "PowerShell script: create a new Data Share | Microsoft Docs"
description: This PowerShell script creates a new data share within an existing Data Share account.
services: data-share
author: t-roupa

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: t-roupa
---

# Use PowerShell to create a Data Share in Azure

This PowerShell script creates a new Data Share within an existing Data Share account.

## Prerequisites
* **Azure Resource Group**. If you don't have an Azure resource group, see [Create a resource group](../../azure-resource-manager/deploy-to-subscription.md) on creating one.
* **Azure Data Share Account**. If you don't have an Azure data share account, see [Create a Data Share account](/create-new-share-account-powershell.md) on creating one.


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
| [New-AzDataShare](/powershell/module/az.resources/new-azdatashare) | Creates a data share. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
