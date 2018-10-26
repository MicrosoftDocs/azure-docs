---
title: Dead letter and retry policies for Azure Event Grid subscriptions
description: Describes how to customize event delivery options for Event Grid. Set a dead-letter destination, and specify how long to retry delivery.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: tomfitz
---

# Dead letter and retry policies

When creating an event subscription, you can customize the settings for event delivery. This article shows you how to set up a dead letter location and customize the retry settings. For information about these features, see [Event Grid message delivery and retry](delivery-and-retry.md).

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Set dead-letter location

To set a dead letter location, you need a storage account for holding events that can't be delivered to an endpoint. The following script gets the resource ID of an existing storage account, and creates an event subscription that uses a container in that storage account for the dead-letter endpoint.

```azurecli-interactive
# if you have not already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

storagename=demostorage
containername=testcontainer

storageid=$(az storage account show --name $storagename --resource-group gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --deadletter-endpoint $storageid/blobServices/default/containers/$containername
```

To turn off dead-lettering, rerun the command to create the event subscription but don't provide a value for `deadletter-endpoint`. You don't need to delete the event subscription.

## Set retry policy

When creating an Event Grid subscription, you can set values for how long Event Grid should try to deliver the event. By default, Event Grid attempts for 24 hours (1440 minutes), and tries a maximum of 30 times. You can set either of these values for your event grid subscription. The value for event time-to-live must be an integer from 1 to 1440. The value for maximum delivery attempts must be an integer from 1 to 30.

You can't configure the [retry schedule](delivery-and-retry.md#retry-schedule-and-duration).

To set the event time-to-live to a value other than 1440 minutes, use:

```azurecli-interactive
# if you have not already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --event-ttl 720
```

To set the maximum retry attempts to a value other than 30, use:

```azurecli-interactive
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --max-delivery-attempts 18
```

If you set both `event-ttl` and `max-deliver-attempts`, Event Grid uses the first to expire for retry attempts.

## Next steps

* For a sample application that uses an Azure Function app to process dead letter events, see [Azure Event Grid Dead Letter Samples for .NET](https://azure.microsoft.com/resources/samples/event-grid-dotnet-handle-deadlettered-events/).
* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
