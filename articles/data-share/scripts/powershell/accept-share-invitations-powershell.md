---
title: "PowerShell script: Accept invitation from an Azure Data Share"
description: This PowerShell script accepts invitations from an existing data share.
author: sidontha
ms.author: sidontha
ms.service: azure-data-share
ms.topic: article
ms.date: 02/12/2025
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to accept a data share invitation

This PowerShell script accepts invitations sent to a consumer.

## Sample script
```powershell
#List invitations sent to a consumer
Get-AzDataShareInvitation

# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"
$invitationId = "<Invitation id>"

#Accept a specific invitation by creating a share subscription
New-AzDataShareSubscription -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -Name $dataShareName -InvitationId $invitationId

```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzDataShareInvitation](/powershell/module/az.datashare/get-azdatashareinvitation) | Get and list sent data share invitations. |
| [New-AzDataShareSubscription](/powershell/module/az.datashare/get-azdatasharesubscription) | Create a data share subscription. |
|||

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
