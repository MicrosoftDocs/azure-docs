---
title: Azure PowerShell script sample - Create custom topic | Microsoft Docs
description: Azure PowerShell script sample - Create custom topic
services: event-grid
documentationcenter: na
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/10/2018
ms.author: tomfitz
---

# Create Event Grid custom topic with PowerShell

This script creates an Event Grid custom topic.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/event-grid/create-custom-topic/create-custom-topic.ps1 "Create custom topic")]

## Script explanation

This script uses the following command to create the custom topic. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzEventGridTopic](https://docs.microsoft.com/powershell/module/az.eventgrid/new-azeventgridtopic) | Create an Event Grid custom topic. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/get-started-azureps).
