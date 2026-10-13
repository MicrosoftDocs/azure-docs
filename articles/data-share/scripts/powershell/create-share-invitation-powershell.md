---
title: "PowerShell script: Create an Azure Data Share invitation"
description: This PowerShell script sends a data share invitation.
author: chvukosw
ms.author: chvukosw
ms.service: azure-data-share
ms.topic: article
ms.date: 10/13/2026
ms.custom: devx-track-azurepowershell, msecd-doc-authoring-1030
ai-usage: ai-assisted
---

# Use a PowerShell script to monitor the usage of a sent data share

> [!IMPORTANT]
> Azure Data Share is being retired. You can no longer create new Azure Data Share accounts, and existing capabilities will remain in maintenance mode through October 30, 2027. For retirement timelines, transition guidance, and recommended next steps, see the [Azure Data Share retirement announcement](https://aka.ms/ADS-Deprecation).

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

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
