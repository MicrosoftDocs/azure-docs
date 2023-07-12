---
title: Azure PowerShell - subscribe to Blob storage account
description: This article provides a sample Azure PowerShell script that shows how to subscribe to Event Grid events for a Blob Storage account. 
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 09/15/2021
---

# Subscribe to events for a Blob storage account with PowerShell

This script creates an Event Grid subscription to the events for a Blob storage account.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script - stable

[!code-powershell[main](../../../powershell_scripts/event-grid/subscribe-to-blob-storage/subscribe-to-blob-storage.ps1 "Subscribe to Blob storage")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) | Create an Event Grid subscription. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](/powershell/azure/get-started-azureps).
