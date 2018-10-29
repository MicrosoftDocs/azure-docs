---
title: How to filter events for Azure Event Grid
description: Shows how to create Azure Event Grid subscriptions that filter events.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: tomfitz
---

# Filter events for Event Grid

This article shows how to filter events when creating an Event Grid subscription. To learn about the options for event filtering, see [Understand event filtering for Event Grid subscriptions](event-filtering.md).

## Filter by event type

```powershell
$includedEventTypes = "Microsoft.Resources.ResourceWriteFailure", "Microsoft.Resources.ResourceWriteSuccess"

New-AzureRmEventGridSubscription `
  -EventSubscriptionName demoSubToResourceGroup `
  -Endpoint <endpoint-URL> `
  -ResourceGroupName myResourceGroup `
  -IncludedEventType $includedEventTypes
```

## Filter by subject


## Filter by data fields



## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
