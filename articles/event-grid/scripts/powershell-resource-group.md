---
title: Azure PowerShell script sample - Subscribe to resource group | Microsoft Docs
description: This article provides a sample Azure PowerShell script that shows how to subscribe to Event Grid events for a resource group. 
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 09/15/2021
---

# Subscribe to events for a resource group with PowerShell

This script creates an Event Grid subscription to the events for a resource group.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

The preview sample script requires the Event Grid module. To install, run
`Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`

## Sample script - stable

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/event-grid/subscribe-to-resource-group/subscribe-to-resource-group.ps1 "Subscribe to resource group")]

## Sample script - preview module

[!INCLUDE [requires-azurerm](../../../includes/requires-azurerm.md)]

[!code-powershell[main](../../../powershell_scripts/event-grid/subscribe-to-resource-group-preview/subscribe-to-resource-group-preview.ps1 "Subscribe to resource group")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) | Create an Event Grid subscription. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](/powershell/azure/get-started-azureps).
