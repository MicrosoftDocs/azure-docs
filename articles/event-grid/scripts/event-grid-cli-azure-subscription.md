---
title: Azure CLI script sample - Subscribe to Azure subscription | Microsoft Docs
description: This article provides a sample Azure CLI script that shows how to subscribe to Azure Event Grid events using Azure CLI. 
services: event-grid
documentationcenter: na
author: spelluru

ms.service: event-grid
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/23/2020
ms.author: spelluru
---

# Subscribe to events for an Azure subscription with Azure CLI

This script creates an Event Grid subscription to the events for an Azure subscription.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

The preview sample script requires the Event Grid extension. To install, run `az extension add --name eventgrid`.

## Sample script - stable

[!code-azurecli[main](../../../cli_scripts/event-grid/subscribe-to-azure-subscription/subscribe-to-azure-subscription.sh "Subscribe to Azure subscription")]

## Sample script - preview extension

[!code-azurecli[main](../../../cli_scripts/event-grid/subscribe-to-azure-subscription-preview/subscribe-to-azure-subscription-preview.sh "Subscribe to Azure subscription")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) | Create an Event Grid subscription. |
| [az eventgrid event-subscription create](/cli/azure/ext/eventgrid/eventgrid/event-subscription#ext-eventgrid-az-eventgrid-event-subscription-create) - extension version | Create an Event Grid subscription. |

## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
