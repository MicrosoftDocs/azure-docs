---
title: Azure CLI script sample - Subscribe to Blob storage account | Microsoft Docs
description: This article provides a sample Azure CLI script that shows how to subscribe to events for a Azure Blob Storage account. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 07/08/2020 
ms.custom: devx-track-azurecli
---

# Subscribe to events for a Blob storage account with Azure CLI

This script creates an Event Grid subscription to the events for a Blob storage account. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/event-grid/subscribe-to-blob-storage/subscribe-to-blob-storage.sh "Subscribe to Blob storage")]

## Script explanation

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az_eventgrid_event_subscription_create) | Create an Event Grid subscription. |
| [az eventgrid event-subscription create](/cli/azure/ext/eventgrid/eventgrid/event-subscription#ext-eventgrid-az-eventgrid-event-subscription-create) - extension version | Create an Event Grid subscription. |

## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
