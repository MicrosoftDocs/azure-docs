---
title: "PowerShell script: List Azure Data Share invitations sent to a consumer"
description: Learn how this PowerShell script gets invitations sent to a consumer and see an example of the script that you can use.
author: sidontha
ms.author: sidontha
ms.service: azure-data-share
ms.topic: article
ms.date: 02/12/2025
---

# Use PowerShell to get a data share invitation

This PowerShell script gets invitations sent to a consumer.

## Sample script

```powershell
# Set variables with your own values
$invitationId = "<invitationId>"
$location = "<location>"

#List invitations sent to a consumer
Get-AzDataShareInvitation

#Get a specific invitation sent to a consumer
Get-AzDataShareInvitation -location -invitationId 

```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzDataShareInvitation](/powershell/module/az.datashare/get-azdatashareinvitation) | Get and list sent data share invitations. |
|||

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
