---
title: Azure CLI - subscribe to resource group & filter by resource
description: This article provides a sample Azure CLI script that shows how to subscribe to Event Grid events for a resource and filter for a resource. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 07/08/2020 
ms.custom: devx-track-azurecli
---

# Subscribe to events for a resource group and filter for a resource with Azure CLI

This script creates an Event Grid subscription to the events for a resource group. It uses a filter to get only events for a specified resource in the resource group.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

The preview sample script requires the Event Grid extension. To install, run `az extension add --name eventgrid`.

## Sample script - stable

[!code-azurecli[main](../../../cli_scripts/event-grid/filter-events/filter-events.sh "Subscribe to Azure subscription")]

## Sample script - preview extension

[!code-azurecli[main](../../../cli_scripts/event-grid/filter-events-preview/filter-events-preview.sh "Subscribe to Azure subscription")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az_eventgrid_event_subscription_create) | Create an Event Grid subscription. |
| [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az_eventgrid_event_subscription_create) - extension version | Create an Event Grid subscription. |

## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
