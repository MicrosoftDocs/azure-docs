---
title: Retention of events in namespace topics and subscriptions
description: Describes the retention of events in Azure Event Grid namespace topics and event subscriptions to those topics.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 09/29/2023
---

# Event retention for Azure Event Grid namespace topics and event subscriptions
This article describes event retention for Azure Event Grid namespace topics and event subscriptions to those topics. 

## Event retention for namespace topics
Namespace topic retention refers to the time Event Grid can retain events that aren't delivered, not dropped, or not dead-lettered. Namespace topic configuration for `properties.eventRetentionDurationInDays` is now editable (it was read-only with a 1 day retention in the public preview) and allows users to specify an integer between 1 to 7 days, inclusive.

## Event time to live for event subscriptions
An event's time to live is a time span duration in ISO 8601 format that determines how long messages are available to the subscription from the time the message was published. This duration value is expressed using the following format: `P(n)Y(n)M(n)DT(n)H(n)M(n)S`. 

- `(n)` is replaced by the value of each time element that follows the (n). 
- `P` is the duration (or Period) designator and is always placed at the beginning of the duration. 
- `Y` is the year designator, and it follows the value for the number of years. 
- `M` is the month designator, and it follows the value for the number of months. 
- `W` is the week designator, and it follows the value for the number of weeks. 
- `D` is the day designator, and it follows the value for the number of days. 
- `T` is the time designator, and it precedes the time components. 
- `H` is the hour designator, and it follows the value for the number of hours. 
- `M` is the minute designator, and it follows the value for the number of minutes. 
- `S` is the second designator, and it follows the value for the number of seconds. 

This duration value can't be set greater than the topic’s `eventRetentionInDays`. It's an optional field where its minimum value is 1 minute, and its maximum is determined by topic’s `eventRetentionInDays` value. Here are examples of valid values:

- `P0DT23H12M` or `PT23H12M` for duration of 23 hours and 12 minutes. 
- `P1D` or `P1DT0H0M0S`: for duration of 1 day.

Event subscription’s time to live configurations for queue and push subscriptions (`properties.deliveryConfiguration.queue.eventTimeToLive`, `properties.deliveryConfiguration.push.eventTimeToLive`) have the same default and maximum values. They now have a maximum value bound to the topic’s retention value. The default is 7 days or topic retention, whichever is lower.

An error is raised in conditions such as the following ones: 
- When the configuration in the event subscription’s `eventTimeToLive` is less than `receiveLockDurationInSeconds`. An event that stays in the broker for less than its intended lock duration.
- If `eventTimeToLive` is greater than its associated topic’s `eventRetentionInDays`.
- If the topic's `eventRetentionInDays` is set to a value lower than an event subscription’s time to live duration.

For push event subscriptions, there's no change as to the maximum retry period. It's still 1 day.

## Configure event retention for namespace topics

### Use Azure portal
When creating a namespace topic, you can configure the retention setting on the **Create topic** page.

:::image type="content" source="./media/event-retention/create-topic-retention-setting.png" alt-text="Screenshot showing the Create Topic page with the Retention section highlighted.":::


### Use Azure Resource Manager template
Use the `eventRetentionInDays` specifies the maximum number of days published messages are stored by the topic regardless of the message state (acknowledged, etc.). The default value for this property is 7, minimum is 1, and the maximum is 7. 

```json
{
    "type": "Microsoft.EventGrid/namespaces/topics",
    "apiVersion": "2023-06-01-preview",
    "name": "contosotopic1002",
    "properties": {
        "publisherType": "Custom",
        "inputSchema": "CloudEventSchemaV1_0",
        "eventRetentionInDays": 4
    }
}
```

### Use SDKs
For example, use the [`NamespaceTopicData.EventRetentionInDays`](/dotnet/api/azure.resourcemanager.eventgrid.namespacetopicdata.eventretentionindays?view=azure-dotnet-preview&&preserve-view=true) property.

## Configure event time to live for event subscriptions


### Use Azure portal
When creating a subscription to a namespace topic, you can configure the retention setting as on the **Additional Features** tab of the **Create Subscription** page. 

:::image type="content" source="./media/event-retention/create-subscription-retention-setting.png" alt-text="Screenshot showing the Create Subscription page with the Retention section highlighted.":::


### Use Azure Resource Manager template
Use the `eventTimeToLive` determines how long messages are in the subscription from the time the message was published. It can't be set  to a value greater than topic’s `eventRetentionInDays`. The minimum value is  1 minute, maximum value is topic’s retention, and the default value is 7 days or topic retention, whichever is lower. If the user species a value (no default use) and that TTL > topic’s event retention, then the service throws an exception.

```json
{
    "type": "Microsoft.EventGrid/namespaces/topics/eventSubscriptions",
    "apiVersion": "2023-06-01-preview",
    "name": "spegirdnstopic0726sub",
    "properties": {
        "deliveryConfiguration": {
            "deliveryMode": "Queue",
            "queue": {
                "receiveLockDurationInSeconds": 300,
                "maxDeliveryCount": 10,
                "eventTimeToLive": "P4D"
            }
        },
        "eventDeliverySchema": "CloudEventSchemaV1_0"
    }
}
```

### Use Azure SDKs
For example, use the [`QueueInfo.EventTimeToLive`](/dotnet/api/azure.resourcemanager.eventgrid.models.queueinfo?view=azure-dotnet-preview&&preserve-view=true) property.




## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
