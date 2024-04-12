---
title: Azure Event Grid on Kubernetes - Event delivery and retry
description: This article describes how Event Grid on Kubernetes with Azure Arc delivers events and how it handles undelivered messages.
author: jfggdl
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/25/2021
ms.topic: conceptual
---

# Event Grid on Kubernetes - event delivery and retry
Event Grid on Kubernetes with Azure Arc tries to deliver each message at least once for each matching subscription immediately. If it doesn't get a successful HTTP 200 response from the subscriber or if there is any failure, Event Grid on Kubernetes retries delivery based on a fixed retry schedule and retry policy. 

By default, Event Grid on Kubernetes delivers one event at a time to the subscriber. However, the payload of the delivery request is an array with a single event. It can deliver more than one event at a time if you enable the output batching feature. For details about this feature, see [Batch event delivery](batch-event-delivery.md).

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]

> [!NOTE]
> During the preview, Event Grid on Kubernetes features are supported through API version [2020-10-15-Preview](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update). 


## Retry schedule
Event Grid on Kubernetes waits up to 60 seconds for a response after delivering an event. If the subscriber's endpoint doesn't send success response (HTTP 200 or so), it retries to send the event. Here's how it works. 

1. Message arrives into the Event Grid on Kubernetes. Attempt is made to deliver it immediately.
1. If the delivery fails, the message is enqueued into 1-minute queue and retried after a minute.
1. If the delivery continues to fail, the message is enqueued into 10-minute queue and retried every 10 minutes.
1. Deliveries are attempted until successful or retry policy limits are reached.
 
## Retry policy
There are two configurations that determine retry policy. They are:

- Maximum number of attempts
- Event time-to-live (TTL)

An event is dropped if either of the limits of the retry policy is reached. Configuration of these limits is done per subscription basis. The following section describes each one is further detail.

### Configuring defaults per subscriber
You can also specify retry policy limits on a per subscription basis. See our [API documentation](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update) for information on configuring defaults per subscriber. Subscription level defaults override the Event Grid module on Kubernetes level configurations.

The following example sets up a Web hook subscription with `maxNumberOfAttempts` to 3 and `eventTimeToLiveInMinutes` to 30 minutes.

```json
{
 "properties": {
  "destination": {
   "endpointType": "WebHook",
   "properties": {
    "endpointUrl": "<your_webhook_url>",
    "eventDeliverySchema": " CloudEventSchemaV1_0"
   }
  },
  "retryPolicy": {
   "eventTimeToLiveInMinutes": 30,
   "maxDeliveryAttempts": 3
  }
 }
```

## Next steps
To learn about destinations and handlers supported by Event Grid on Azure Arc for Kubernetes, see [Event Grid on Kubernetes - Event handlers](event-handlers.md).
