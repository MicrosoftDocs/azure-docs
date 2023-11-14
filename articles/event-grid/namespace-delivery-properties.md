---
title: Azure Event Grid namespaces - Set custom headers on delivered events
description: Describes how you can set custom headers (or delivery properties) for events delivered using namespaces.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/10/2023
---

# Delivery properties for namespace topics' subscriptions

Event subscriptions allow you to set up HTTP headers that will be included in the delivered events. This capability allows you to set custom headers that the destination requires. You can set up to 10 headers when creating an event subscription. Each header value shouldn't be greater than 4,096 (4K) bytes.

You can set custom headers on the events that are delivered to the following destinations: Azure Event Hubs.

When creating an event subscription in the Azure portal, you can use the **Delivery Properties** tab to set custom HTTP headers. This page lets you set fixed and dynamic header values.

## Setting static header values

To set headers with a fixed value, provide the name of the header and its value in the corresponding fields:

:::image type="content" source="./media/namespace-delivery-properties/namespace-delivery-properties-static.png" alt-text="Screenshot that shows the Delivery Properties tab of the Create Event Subscription page with an example static header.":::

You might want to check **Is secret?**, when you're providing sensitive data. The visibility of sensitive data on the Azure portal depends on the user's role-based access control (RBAC) permission.

## Setting dynamic header values

You can set the value of a header based on a property in an incoming event. Use JsonPath syntax to refer to an incoming event's property value to be used as the value for a header in outgoing requests. Only JSON values of string, number, and boolean are supported. For example, to set the value of a header named **channel** using the value of the incoming event property **system** in the event data, configure your event subscription in the following way:

:::image type="content" source="./media/namespace-delivery-properties/namespace-delivery-properties-dynamic.png" alt-text="Screenshot that shows the Delivery Properties tab of the Create Event Subscription page with an example dynamic header.":::

## Examples

This section gives you a few examples of using delivery properties.

### Event Hubs example

If you need to publish events to a specific partition within an event hub, set the `PartitionKey` property on your event subscription to specify the partition key that identifies the target event hub partition.

| Header name | Header type |
| :-- | :-- |
|`PartitionKey` | Static or dynamic |

You can also specify custom properties when sending messages to an event hub. Don't use the `aeg-` prefix for the property name as it's used by system properties in message headers. For a list of message header properties, see [Event Hubs as an event handler](namespace-handler-event-hubs.md#message-headers).

## Next steps

For more information about event delivery, see the following article:

- [Event filtering](namespace-event-filtering.md)
