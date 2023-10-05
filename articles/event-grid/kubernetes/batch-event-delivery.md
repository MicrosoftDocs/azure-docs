---
title: Azure Event Grid on Kubernetes - Batch event delivery
description: This article describes how to deliver batch of events to the destination. 
author: jfggdl
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/25/2021
ms.topic: conceptual
---

# Event Grid on Kubernetes - Batch event delivery 
Event Grid on Kubernetes with Azure Arc has support to deliver more than one event in a single delivery request. This feature makes it possible to increase the overall delivery throughput without having the HTTP per-request overheads. Batch event delivery is turned off by default and can be turned on using the event subscription configuration. 

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]

> [!WARNING]
> The maximum allowed duration to process each delivery request does not change, even though the event handler code potentially has to do more work per batched request. Delivery timeout defaults to 60 seconds.

## Batch event delivery policy
The batch event delivery behavior in Event Grid on Kubernetes can be customized per event subscription, by tweaking the following two settings:

- **Maximum events per batch**
    
    This setting sets an upper limit on the number of events that can be added to a batched delivery request.
- **Preferred Batch Size in Kilobytes**
    
    This configuration item is used to further control the maximum number of kilobytes that can be sent over per delivery request.

## Batch event delivery behavior   

- **All or none**

    Event Grid on Kubernetes operates with all-or-none semantics. It doesn't support partial success of a batch event delivery. Event handlers should be careful to ask only for as many events per batch as they can reasonably handle in 60 seconds.
- **Optimistic batching**

    The batching policy settings aren't strict bounds on the batching behavior and are respected on a best-effort basis. At low event rates, you'll often observe the batch size being less than the requested maximum events per batch.
- **Batch delivery is set to OFF by default**

    By default, Event Grid on Kubernetes only adds one event to each delivery request. The way to turn on event delivery in batches is to set either one of the settings mentioned earlier in the article in the event subscription payload.
- **Default values**

    It isn't necessary to specify both the settings (Maximum events per batch and Approximate batch size in kilo bytes) when creating an event subscription. If only one setting is set, Event Grid on Kubernetes uses (configurable) default values. 

## Example
The following example shows how to se set `maxEventsPerBatch` and `preferredBatchSizeInKilobytes` in endpoint properties to enable batching. 

```json
{
    "properties":
    {
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
             {
                "endpointUrl": "<your_webhook_url>",
                "maxEventsPerBatch": 10,
                "preferredBatchSizeInKilobytes": 64
             }
        },
    }
}
```

## Next steps
To learn about destinations and handlers supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event handlers](event-handlers.md).