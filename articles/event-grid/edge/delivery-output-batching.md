---
title: Output batching in Azure Event Grid IoT Edge | Microsoft Docs 
description: Output batching in Event Grid on IoT Edge.
author: HiteshMadan
manager: rajarv
ms.author: himad
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Output batching

Event Grid has support to deliver more than one event in a single delivery request. This feature makes it possible to increase the overall delivery throughput without paying the HTTP per-request overheads. Batching is turned off by default and can be turned on per-subscription.

> [!WARNING]
> The maximum allowed duration to process each delivery request does not change, even though the subscriber code potentially has to do more work per batched request. Delivery timeout defaults to 60 seconds.

## Batching policy

Event Grid's batching behavior can be customized per subscriber, by tweaking the following two settings:

* Maximum events per batch

  This setting sets an upper limit on the number of events that can be added to a batched delivery request.

* Preferred Batch Size In Kilobytes

  This knob is used to further control the max number of kilobytes that can be sent over per delivery request

## Batching behavior

* All or none

  Event Grid operates with all-or-none semantics. It doesn't support partial success of a batch delivery. Subscribers should be careful to only ask for as many events per batch as they can reasonably handle in 60 seconds.

* Optimistic batching

  The batching policy settings aren't strict bounds on the batching behavior, and are respected on a best-effort basis. At low event rates, you'll often observe the batch size being less than the requested maximum events per batch.

* Default is set to OFF

  By default, Event Grid only adds one event to each delivery request. The way to turn on batching is to set either one of the settings mentioned earlier in the article in the event subscription JSON.

* Default values

  It isn't necessary to specify both the settings (Maximum events per batch and Approximate batch size in kilo bytes) when creating an event subscription. If only one setting is set, Event Grid uses (configurable) default values. See the following sections for the default values, and how to override them.

## Turn on output batching

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

## Configuring maximum allowed values

The following deployment time settings control the maximum value allowed when creating an event subscription.

| Property Name | Description |
| ------------- | ----------- | 
| `api__deliveryPolicyLimits__maxpreferredBatchSizeInKilobytes` | Maximum value allowed for the `PreferredBatchSizeInKilobytes` knob. Default `1033`.
| `api__deliveryPolicyLimits__maxEventsPerBatch` | Maximum value allowed for the `MaxEventsPerBatch` knob. Default `50`.

## Configuring runtime default values

The following deployment time settings control the runtime default value of each knob when it isn't specified in the Event Subscription. To reiterate, at least one knob must be set on the Event Subscription to turn on batching behavior.

| Property Name | Description |
| ------------- | ----------- |
| `broker__defaultMaxBatchSizeInBytes` | Maximum delivery request size when only `MaxEventsPerBatch` is specified. Default `1_058_576`.
| `broker__defaultMaxEventsPerBatch` | Maximum number of events to add to a batch when only `MaxBatchSizeInBytes` is specified. Default `10`.
