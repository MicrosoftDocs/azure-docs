---
title: Delivery and retry - Azure Event Grid IoT Edge | Microsoft Docs 
description: Delivery and retry in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Delivery and retry

Event Grid provides durable delivery. It tries to deliver each message at least once for each matching subscription immediately. If a subscriber's endpoint doesn't acknowledge receipt of an event or if there is a failure, Event Grid retries delivery based on a fixed **retry schedule** and **retry policy**.  By default, the Event Grid module delivers one event at a time to the subscriber. The payload is however an array with a single event. You can have the module deliver more than one event at a time by enabling the output batching feature. For details about this feature, see [output batching](delivery-output-batching.md).  

> [!IMPORTANT]
>There is no persistence support for event data. This means redeploying or restart of the Event Grid module will cause you to lose any events that aren't yet delivered.

## Retry schedule

Event Grid waits up to 60 seconds for a response after delivering a message. If the subscriber's endpoint doesn't ACK the response, then the message will be enqueued in one of our back off queues for subsequent retries.

There are two pre-configured back off queues that determine the schedule on which a retry will be attempted. They are:

| Schedule | Description |
| ---------| ------------ |
| 1 minute | Messages that end up here are attempted every minute.
| 10 minutes | Messages that end up here are attempted every 10th minute.

### How it works

1. Message arrives into the Event Grid module. Attempt is made to deliver it immediately.
1. If delivery fails, then the message is enqueued into 1-minute queue and retried after a minute.
1. If delivery continues to fail, then the message is enqueued into 10-minute queue and retried every 10 minutes.
1. Deliveries are attempted until successful or retry policy limits are reached.

## Retry policy limits

There are two configurations that determine retry policy. They are:

* Maximum number of attempts
* Event time-to-live (TTL)

An event will be dropped if either of the limits of the retry policy is reached. The retry schedule itself was described in the Retry Schedule section. Configuration of these limits can be done either for all subscribers or per subscription basis. The following section describes each one is further detail.

## Configuring defaults for all subscribers

There are two properties: `brokers__defaultMaxDeliveryAttempts` and `broker__defaultEventTimeToLiveInSeconds` that can be configured as part of the Event Grid deployment, which controls retry policy defaults for all subscribers.

| Property Name | Description |
| ---------------- | ------------ |
| `broker__defaultMaxDeliveryAttempts` | Maximum number of attempts to deliver an event. Default value: 30.
| `broker__defaultEventTimeToLiveInSeconds` | Event TTL in seconds after which an event will be dropped if not delivered. Default value: **7200** seconds

## Configuring defaults per subscriber

You can also specify retry policy limits on a per subscription basis.
See our [API  documentation](api.md) for information on how to do configure defaults per subscriber. Subscription level defaults override the module level configurations.

## Examples

The following example sets up retry policy in the Event Grid module with maxNumberOfAttempts = 3 and Event TTL of 30 minutes

```json
{
  "Env": [
    "broker__defaultMaxDeliveryAttempts=3",
    "broker__defaultEventTimeToLiveInSeconds=1800"
  ],
  "HostConfig": {
    "PortBindings": {
      "4438/tcp": [
        {
          "HostPort": "4438"
        }
      ]
    }
  }
}
```

The following example sets up a Web hook subscription with maxNumberOfAttempts = 3 and Event TTL of 30 minutes

```json
{
 "properties": {
  "destination": {
   "endpointType": "WebHook",
   "properties": {
    "endpointUrl": "<your_webhook_url>",
    "eventDeliverySchema": "eventgridschema"
   }
  },
  "retryPolicy": {
   "eventExpiryInMinutes": 30,
   "maxDeliveryAttempts": 3
  }
 }
}
```
