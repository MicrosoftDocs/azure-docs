---
title: Azure PowerShell - subscribe to Azure subscription
description: This article provides a sample Azure PowerShell script that shows how to subscribe to Event Grid events for an Azure subscription. 
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 09/15/2021
---

# Subscribe to events for an Azure subscription with PowerShell

This script creates an Event Grid subscription to the events for an Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script - stable

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/event-grid/subscribe-to-azure-subscription/subscribe-to-azure-subscription.ps1 "Subscribe to Azure subscription")]

## Sample script - preview module

This preview sample script requires the Event Grid module. To install, run
`Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`

[!INCLUDE [requires-azurerm](../../../includes/requires-azurerm.md)]

[!code-powershell[main](../../../powershell_scripts/event-grid/subscribe-to-azure-subscription-preview/subscribe-to-azure-subscription-preview.ps1 "Subscribe to Azure subscription")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) | Create an Event Grid subscription. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](/powershell/azure/get-started-azureps).
