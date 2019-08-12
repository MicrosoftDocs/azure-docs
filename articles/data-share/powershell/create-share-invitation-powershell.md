---
title: "PowerShell script: Create a data share invitation| Microsoft Docs"
description: This PowerShell script sends a data share invitation.
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

This PowerShell script creates a data share invitation.

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
$targetEmail = "<Target email>"

# Send a data share invitation
New-AzDataShareInvitation -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName -Name $dataShareName -TargetEmail $targetEmail

```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareInvitation](/powershell/module/az.resources/get-azdatasharesynchronizationdetails) | Create a data share invitation. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
