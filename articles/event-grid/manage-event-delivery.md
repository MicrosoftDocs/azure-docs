---
title: Manage delivery settings for Azure Event Grid subscriptions
description: Describes how to customize event delivery options for Event Grid.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/30/2018
ms.author: tomfitz
---

# Manage Event Grid delivery settings

When creating an event subscription, you can customize the settings for event delivery. You can set how long Event Grid tries to deliver the message. You can set a storage account to use for storing events that can't be delivered to an endpoint.

## Set retry policy

When creating an Event Grid subscription, you can set values for how long Event Grid should try to deliver the event. By default, Event Grid attempts for 24 hours (1440 minutes), and tries a maximum of 30 times. You can set either of these values for your event grid subscription.

To set the event time-to-live to a value other than 1440 minutes, use:

```azurecli-interactive
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL>
  --event-ttl 720
```

To set the maximum retry attempts to a value other than 30, use:

```azurecli-interactive
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL>
  --max-delivery-attempts 18
```

If you set both `event-ttl` and `max-deliver-attempts`, Event Grid uses the first to expire for retry attempts.

## Set deadletter location

When Event Grid can't deliver an event, it can store the undelivered event in a storage account. You pull events from this storage account to resolve deliveries.

Before setting the deadletter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

```azurecli-interactive
storagename=demostorage
containername=testcontainer

storageid=$(az storage account show --name $storagename --resource-group gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL>
  --deadletter-endpoint $storageid/blobServices/default/containers/$containername
```

To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the deadletter blob storage. The event subscription should send events to a handler that responds to undelivered events.

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
