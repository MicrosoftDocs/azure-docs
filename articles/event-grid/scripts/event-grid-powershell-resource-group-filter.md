---
title: Azure PowerShell - subscribe to resource group
description: This article provides a sample Azure PowerShell script that shows how to subscribe to Event Grid events for a resource group and filter for a resource.
services: event-grid
documentationcenter: na
author: spelluru

ms.service: event-grid
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/23/2020
ms.author: spelluru
---

# Subscribe to events for a resource group and filter for a resource with PowerShell

This script creates an Event Grid subscription to the events for a resource group. It uses a filter to get only events for a specified resource in the resource group.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script - stable

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/event-grid/filter-events/filter-events.ps1 "Filter events")]

## Sample script - preview module

[!INCLUDE [requires-azurerm](../../../includes/requires-azurerm.md)]

The preview sample script requires the Event Grid module. To install, run
`Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`

[!code-powershell[main](../../../powershell_scripts/event-grid/filter-events-preview/filter-events-preview.ps1 "Filter events")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzEventGridSubscription](https://docs.microsoft.com/powershell/module/az.eventgrid/new-azeventgridsubscription) | Create an Event Grid subscription. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/get-started-azureps).
