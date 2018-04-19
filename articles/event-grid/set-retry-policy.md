---
title: Set retry policy for Azure Event Grid subscriptions
description: Describes how to use a customized retry policy for Azure Event Grid subscriptions.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/19/2018
ms.author: tomfitz
---

# Customize Event Grid retry policy

When creating an Event Grid subscription, you can set values for how long Event Grid should try to deliver the event. By default, Event Grid attempts for 24 hours (1440 minutes), and tries a maximum of 30 times. You can set either of these values for your event grid subscription.

## Set retry policy

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

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
