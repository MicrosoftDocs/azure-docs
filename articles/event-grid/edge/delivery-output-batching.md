---
title: Output batching - Azure Event Grid IoT Edge | Microsoft Docs 
description: Output batching in Event Grid on IoT Edge.
author: HiteshMadan
manager: rajarv
ms.author: himad
ms.reviewer: 
ms.date: 08/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Output batching

Event Grid has support for delivering more than one event in a single delivery request. This makes it possible to increase the overall delivery throughput without paying the HTTP per-request overheads. Batching is turned off by default and can be turned on per-subscription.

> [!WARNING]
> The maximum allowed duration to process each delivery request does not change, even though the subscriber code potentially has to do more work per batched request. Delivery timeout defaults to 60 seconds.

## Batching policy

Event Grid's batching behavior can be customized per subscriber, by tweaking the following two knobs:

* Maximum Events per Batch

  This knob sets an upper limit on the number of events that will be added to a batched delivery request.

* Approximate Batch Size in Bytes

  This knob is used to further control the max number of bytes that will be sent over per delivery request

## Batching behavior

* All or None

  Event Grid operates with all-or-none semantics. It does not support partial success of a batch delivery. Subscribers should be careful to only ask for as many events per batch as they can reasonably handle in 60 seconds.

* Optimistic Batching

  The batching policy knobs are not strict bounds on the batching behavior, and are respected on a best-effort basis. At low event rates, you will often observe the batch size being less than the requested Max Events Per Batch.

* Default Off
  By default Event Grid only adds one event to each delivery request. The way to turn on Batching is to set either one of the aforementioned knobs on the Event Subscription json.

* Default Values

  It is not necessary to specify both the knobs when creating an Event Subscription. Event Grid uses (configurable) default values to be used if only one knob is set. See below for the default values, and how to override them.

## Turning on output batching

```json
{
    "properties":
    {
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<your_webhook_url>"
            }
        },
        "deliveryPolicy":
        {
            "maxEventsPerBatch": 10,
            "approxBatchSizeInBytes": 65536
        }
    }
}
```

## Configuring maximum allowed values

The following deployment time settings control the maximum value allowed when creating an Event Subscription.

| Property Name | Description |
| -- | -- |
| `api:deliveryPolicyLimits:maxBatchSizeInBytes` | Maximum value allowed for the `ApproxBatchSizeInBytes` knob. Default `1_058_576`.
| `api:deliveryPolicyLimits:maxEventsPerBatch` | Maximum value allowed for the `MaxEventsPerBatch` knob. Default `50`.

## Configuring default values

The following deployment time settings control the default value of each knob when it is not specified in the Event Subscription. To reiterate - at least one knob must be set on the Event Subscription to turn on batching behavior.

| Property Name | Description |
| -- | -- |
| `broker:defaultMaxBatchSizeInBytes` | Maximum delivery request size when only `MaxEventsPerBatch` is specified. Default `1_058_576`.
| `broker:defaultMaxEventsPerBatch` | Maximum number of events to add to a batch when only `MaxBatchSizeInBytes` is specified. Default `10`.
