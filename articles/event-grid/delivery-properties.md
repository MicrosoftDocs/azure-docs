---
title: Azure Event Grid - Set custom headers on delivered events 
description: Describes how you can set custom headers (or delivery properties) on delivered events. 
ms.topic: conceptual
ms.date: 03/24/2021
---

# Custom delivery properties
Event subscriptions allow you to set up HTTP headers that are included in delivered events. This capability allows you to set custom headers that are required by a destination. You can set up to 10 headers when creating an event subscription. Each header value shouldn't be greater than 4,096 (4K) bytes.

You can set custom headers on the events that are delivered to the following destinations:

- Webhooks
- Azure Service Bus topics and queues
- Azure Event Hubs
- Relay Hybrid Connections

When creating an event subscription in the Azure portal, you can use the **Delivery Properties** tab to set custom HTTP headers. This page lets you set fixed and dynamic header values.

## Setting static header values
To set headers with a fixed value, provide the name of the header and its value in the corresponding fields:

:::image type="content" source="./media/delivery-properties/static-header-property.png" alt-text="Delivery properties - static":::

You may want check **Is secret?** when providing sensitive data. Sensitive data won't be displayed on the Azure portal. 

## Setting dynamic header values
You can set the value of a header based on a property in an incoming event. Use JsonPath syntax to refer to an incoming event's property value to be used as the value for a header in outgoing requests. For example, to set the value of a header named **Channel** using the value of the incoming event property **system** in the event data, configure your event subscription in the following way:

:::image type="content" source="./media/delivery-properties/dynamic-header-property.png" alt-text="Delivery properties - dynamic":::

## Examples
This section gives you a few examples of using delivery properties.

### Setting the Authorization header with a bearer token (non-normative example)

Set a value to an Authorization header to identify the request with your Webhook handler. An Authorization header can be set if you aren't [protecting your Webhook with Azure Active Directory](secure-webhook-delivery.md).

| Header name   | Header type | Header value |
| :--           | :--         | :--            |
|`Authorization` | Static | `BEARER SlAV32hkKG...`|

Outgoing requests should now contain the header set on the event subscription:

```console
GET /home.html HTTP/1.1

Host: acme.com

User-Agent: <user-agent goes here>

Authorization: BEARER SlAV32hkKG...
```

> [!NOTE]
> Defining authorization headers is a sensible option when your destination is a Webhook. It should not be used for [functions subscribed with a resource id](/rest/api/eventgrid/version2020-06-01/eventsubscriptions/createorupdate#azurefunctioneventsubscriptiondestination), Service Bus, Event Hubs, and Hybrid Connections as those destinations support their own authentication schemes when used with Event Grid.

### Service Bus example
Azure Service Bus supports the use of a [BrokerProperties HTTP header](/rest/api/servicebus/message-headers-and-properties#message-headers) to define message properties when sending single messages. The value of the `BrokerProperties` header should be provided in the JSON format. For example, if you need to set message properties when sending a single message to Service Bus, set the  header in the following way:

| Header name | Header type | Header value |
| :-- | :-- | :-- |
|`BrokerProperties` | Static     | `BrokerProperties:  { "MessageId": "{701332E1-B37B-4D29-AA0A-E367906C206E}", "TimeToLive" : 90}` |


### Event Hubs example

If you need to publish events to a specific partition within an event hub, define a [BrokerProperties HTTP header](/rest/api/eventhub/event-hubs-runtime-rest#common-headers) on your event subscription to specify the partition key that identifies the target event hub partition.

| Header name | Header type | Header value                                  |
| :-- | :-- | :-- |
|`BrokerProperties` | Static | `BrokerProperties: {"PartitionKey": "0000000000-0000-0000-0000-000000000000000"}`  |


### Configure time to live on outgoing events to Azure Storage Queues
For the Azure Storage Queues destination, you can only configure the time-to-live the outgoing message will have once it has been delivered to an Azure Storage queue. If no time is provided, the message's default time to live is 7 days. You can also set the event to never expire.

:::image type="content" source="./media/delivery-properties/delivery-properties-storage-queue.png" alt-text="Delivery properties - storage queue":::

## Next steps
For more information about event delivery, see the following article:

- [Delivery and retry](delivery-and-retry.md)
- [Webhook event delivery](webhook-event-delivery.md)
- [Event filtering](event-filtering.md)
