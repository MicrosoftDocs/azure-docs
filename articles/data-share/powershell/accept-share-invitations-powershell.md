---
title: "PowerShell script: Get invitations sent to a consumer | Microsoft Docs"
description: This PowerShell script accepts invitations from an existing data share.
services: data-share
author: t-roupa

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: t-roupa
---

# Use PowerShell to send a data share invitation

This PowerShell script gets invitations sent to a consumer.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

## Prerequisites
* **Azure Resource Group**. If you don't have an Azure resource group, see the [Create a resource group](../../azure-resource-manager/deploy-to-subscription.md) on creating one.
* **Azure Data Share Account**. If you don't have an Azure data share account, see the [Create a data share account](/create-new-share.md) on creating one.

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
| [Get-AzDataShareInvitation](/powershell/module/az.resources/get-azdatashareinvitation) | Get and list sent data share invitations. |
| [New-AzDataShareSubscription](/powershell/module/az.resources/get-azdatashareinvitation) | Create a data share subscription. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).

