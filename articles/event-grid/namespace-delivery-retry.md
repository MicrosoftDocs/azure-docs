---
title: Delivery and retry mechanism for push delivery with Event Grid namespaces
description: This article describes how delivery and retry works with Azure Event Grid namespaces.
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 05/08/2024
author: robece
ms.author: robece
---

# Message push delivery and retry with namespace topics

Event Grid namespaces **push delivery** provides durable delivery. Event Grid tries to deliver each message at least once for each matching subscription immediately. If a subscriber's endpoint doesn't acknowledge receipt of an event or if there's a failure, Event Grid retries delivery based on a fixed [retry schedule](#retry-schedule) and [retry policy](#retry-policy). By default, Event Grid delivers one event at a time to the subscriber.

> [!NOTE]
> Event Grid doesn't guarantee order for event delivery, so subscribers may receive them out of order. 

## Event subscription

An event subscription is a configuration resource associated with a single namespace topic. Among other things, you use an event subscription to set the event selection criteria to define the event collection available to a subscriber out of the total set of events available in a topic. Using an event subscription, you also define the destination endpoint to which the events are sent. In addition, an event subscription allows you to set other properties, such as the maximum delivery retry count and the events' time to live, that define the event delivery's runtime behavior.

## Retry schedule

When Event Grid receives an error for an event delivery attempt, Event Grid decides whether it should retry delivery based on the type of the error. 

If the error returned by the subscribed endpoint is a configuration-related error that can't be fixed with retries, Event Grid sends the event to a configured dead-letter destination. If no dead-letter is configured, the event is dropped. For example, an event is dead-lettered or dropped when the endpoint configured on the event subscription can't be reached because it was deleted. Delivery retry doesn't happen for the following conditions and errors:

**Conditions**: 

- `ArgumentException`
- `TimeoutException`
- `UnauthorizedAccessException`
- `OperationCanceledException`
- `SocketException` |

**Error codes**

- `404 - NotFound`
- `401 - Unauthorized`
- `403 - Forbidden`
- `400 -BadRequest`
- `414 RequestUriTooLong`
 
> [!NOTE]
> If dead-letter isn't configured for an endpoint, events will be dropped when the above errors or conditions happen. Consider configuring dead-letter on your event subscription if you don't want these kinds of events to be dropped. Dead lettered events will be dropped when the dead-letter destination isn't found.

If the condition or error returned by the subscribed endpoint isn't among the ones in the above lists, Event Grid  retries on a base effort basis using the following exponential backoff retry schedule:

- 0 seconds  (immediate retry)
- 10 seconds
- 30 seconds
- 1 minute
- 5 minutes

After 5 minutes, Event Grid continues to retry every 5 minutes until the event is delivered or the maximum retry count or event time to live is reached.

## Retry policy

You can customize the retry policy by using the following two event subscription configuration properties. An event is dropped (no dead-letter configured) or dead-lettered if either property reaches its configured limit.

- **Maximum delivery count** - The value must be an integer between 1 and 10. The default value is 10. For push delivery, this property defines the maximum delivery **attempts**.
- **Retention** -  This property is also known as `event time to live`. The value must be an [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#durations) value with minute precision. Starting from the time the event was published, this property defines the time span after which the message expires. The minimum value allowed is "`PT1M`" (1 minute). The maximum value allowed is 7 days or the underlying topic’s retention time, whichever is lower. Azure portal provides a simple user experience where you specify the days, hours, and minutes as integers.

> [!NOTE]
> If you set both `Retention` and `Maximum delivery count`, Event Grid uses them to determine when to stop event delivery. Either one stops event delivery. For example, if you set 20 minutes as retention and 10 maximum delivery attempts, that means that when an event isn't delivered after 20 minutes or isn't delivered after 10 attempts, whichever happens first, the event is dead-lettered. However, because of the [retry schedule](#retry-schedule), setting the maximum number of delivery attempts to 10 has no impact as events will be dead-lettered first after 20 minutes. This is due to the fact at minute 20, the delivery attempt #8 (0, 10s, 30s, 1m, 5m, 10m, 15m, 20m) occurs, but at that time the event is dead-lettered.

## Output batching

When you use **Webhooks** as destination endpoint type, Event Grid defaults to sending each event individually to subscribers. You can configure Event Grid to batch events for delivery for improved HTTP performance in high throughput scenarios. Batching is turned off by default and can be turned on per event subscription.

When using **Event Hubs** as destination endpoint type, Event Grid always batches events for maximum efficiency and performance. There's no batch policy configuration available as by default Event Grid handles the batching behavior when delivering to Azure Event Hubs.

### Batching policy

Batched delivery has two settings:

- **Max events per batch** - Maximum number of events Event Grid delivers per batch. The value must be an integer between 1 and 5,000. This number is never exceeded. However, fewer events may be delivered if no more events are available at the time of delivery. Event Grid doesn't delay events to create a batch if fewer events are available.
- **Preferred batch size in kilobytes** - Target ceiling for batch size in kilobytes. The value must be a number between 1 and 1024. Similar to max events, the batch size may be smaller if enough events aren't available at the time of delivery. It's possible that a batch is larger than the preferred batch size **if** a single event is larger than the preferred size. For example, if the preferred size is 4Kb and a 10Kb event is pushed to Event Grid, the 10Kb event is delivered rather than being dropped.

Batched delivery is configured on a per event subscription basis via the portal, CLI, PowerShell, or SDKs.

### Batching behavior

* All or none

  Event Grid operates with all-or-none semantics. It doesn't support partial success of a batch delivery. Subscribers should be careful to only ask for as many events per batch as they can reasonably handle in 30 seconds.

* Optimistic batching

  The batching policy settings aren't strict bounds on the batching behavior, and are respected on a best-effort basis. At low event rates, you often observe the batch size being less than the requested maximum events per batch.

* Default is set to OFF

  By default, Event Grid only adds one event to each delivery request. The way to turn on batching is to set either one of the settings mentioned in [Batching policy](#batching-policy).

* Default values

  It isn't necessary to specify both settings (Maximum events per batch and Approximate batch size in kilo bytes) when creating an event subscription. If only one setting is set, Event Grid uses default values. See the following sections for the default values, and how to override them.

### Azure portal

You see these settings on the **Additional Features** tab of the **Event Subscription** page or once the event subscription is created, on the Configuration menu option when accessing the Event Subscription.

:::image type="content" source="./media/delivery-and-retry/batch-settings.png" alt-text="Screenshot sowing the Additional Features tab of Event Subscription page with Batching section highlighted. ":::

## Dead-letter events

When Event Grid can't deliver an event within a certain time period or after trying to deliver the event a certain number of times, it sends the event to a storage account. This process is known as **dead-lettering**. Event Grid dead-letters an event when **one of the following** conditions is met.

- Event isn't delivered within the **time-to-live** (retention defined in the event subscription) period.
- The **number of tries** to deliver the event has exceeded the limit.

If either is met, the event is dropped or dead-lettered.  By default, Event Grid doesn't turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the event subscription. You read the events from this storage account to resolve deliveries.

Event Grid sends an event to the dead-letter location when it has tried all of its retry attempts. If Event Grid receives a 400 (Bad Request) or 413 (Request Entity Too Large) response code, it immediately schedules the event for dead-lettering. These response codes indicate delivery of the event will never succeed.

The time-to-live expiration is checked ONLY at the next scheduled delivery attempt. So, even if time-to-live expires before the next scheduled delivery attempt, event expiry is checked only at the time of the next delivery and then subsequently dead-lettered.

There's a five-minute delay between the last attempt to deliver an event and when it's delivered to the dead-letter location. This delay is intended to reduce the number of Blob storage operations. If the dead-letter location is unavailable for four hours, the event is dropped.

Before setting the dead-letter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

You might want to be notified when an event has been sent to the dead-letter location. To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the dead-letter blob storage. Every time your dead-letter blob storage receives an undelivered event, Event Grid notifies your handler. The handler responds with actions you wish to take for reconciling undelivered events.

When configuring dead-lettering, you need to add the managed identity to the appropriate role-based access control (RBAC) role on the Azure Storage account that will hold the dead-lettered events. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).

## Delivery event formats

This section gives you examples of events and dead-lettered events using the CloudEvents 1.0 schema, the message metadata format supported in namespace topics.

### CloudEvents 1.0 schema

#### Event

```json
{
    "id": "caee971c-3ca0-4254-8f99-1395b394588e",
    "source": "mysource",
    "dataversion": "1.0",
    "subject": "mySubject",
    "type": "fooEventType",
    "datacontenttype": "application/json",
    "data": {
        "prop1": "value1",
        "prop2": 5
    }
}
```

#### Dead-letter event

```json
[
  {
    "deadLetterProperties": {
      "deadletterreason": "Maximum delivery attempts was exceeded.",
      "deliveryattempts": 1,
      "deliveryresult": "Event was not acknowledged nor rejected.",
      "publishutc": "2023-11-01T20:33:51.4521467Z",
      "deliveryattemptutc": "2023-11-01T20:33:52.3692079Z"
    },
    "event": {
      "comexampleextension1": "value1",
      "id": "A234-1234-1234",
      "comexampleothervalue": "5",
      "datacontenttype": "text/xml",
      "specversion": "1.0",
      "time": "2018-04-05T17:31:00Z",
      "source": "/mycontext",
      "type": "com.example.someevent",
      "data": <your-event-data>
    }
  }
]
```

**LastDeliveryOutcome: Probation**

An event subscription is put into probation by Event Grid for some time if event deliveries to the destination start failing. Probation time is different for different errors returned by the destination endpoint. If an event subscription is in probation, events may get dead-lettered or dropped without even trying delivery depending on the error code due to which it's in probation.

| Error | Probation Duration |
| ----- | ------------------ | 
| Busy | 10 seconds |
| NotFound | 5 minutes |
| SocketError | 30 seconds |
| ResolutionError | 5 minutes |
| Disabled | 5 minutes |
| Full | 5 minutes | 
| TimedOut | 10 seconds |
| Unauthorized | 5 minutes |
| Forbidden | 5 minutes |
| InvalidAzureFunctionDestination | 10 minutes |

> [!NOTE]
> Event Grid uses probation duration for better delivery management and the duration might change in the future.


## Message delivery status

Event Grid uses HTTP response codes to acknowledge receipt of events. 

### Success codes

Event Grid considers **only** the following HTTP response codes as successful deliveries. All other status codes are considered failed deliveries and will be retried or dead-lettered as appropriate. When Event Grid receives a successful status code, it considers delivery complete.

- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content

### Failure codes

All other codes not in the above set (200-204) are considered failures and will be retried, if needed. Some have specific retry policies tied to them outlined below, all others follow the standard retry schedule. It's important to keep in mind that due to the highly parallelized nature of Event Grid's architecture, the retry behavior is non-deterministic. 

| Status code | Retry behavior |
| ------------|----------------|
| 400 Bad Request | Not retried |
| 401 Unauthorized | Retry after 5 minutes or more for Azure Resources Endpoints |
| 403 Forbidden | Not retried |
| 404 Not Found | Retry after 5 minutes or more for Azure Resources Endpoints |
| 408 Request Timeout | Retry after 2 minutes or more |
| 413 Request Entity Too Large | Not retried |
| 503 Service Unavailable | Retry after 30 seconds or more |
| All others | Retry after 10 seconds or more |

## Custom delivery properties

Event subscriptions allow you to set up HTTP headers that are included in delivered events. This capability allows you to set custom headers that are required by a destination. You can set up to 10 headers when creating an event subscription. Each header value shouldn't be greater than 4,096 (4K) bytes. You can set custom headers on the events that are delivered to the following destinations:

- Webhooks
- Azure Event Hubs

## Next steps

* [Deliver events to Webhook endpoints](namespace-handler-webhook.md).
