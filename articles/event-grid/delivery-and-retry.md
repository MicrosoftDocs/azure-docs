---
title: Azure Event Grid Delivery and Retry Explained
description: Discover how Azure Event Grid delivers events and retries failed deliveries using exponential backoff policies. Ensure reliable event processing.
#customer intent: As a developer, I want to understand how Azure Event Grid delivers messages to event handlers so that I can ensure reliable event processing in my application.
ms.topic: concept-article
ms.date: 02/09/2026
# Customer intent: I want to know how Event Grid delivers messages to event handler and retries when a delivery attempt fails. 
---

# Event Grid message delivery and retry
Event Grid provides durable delivery. It tries to deliver each message **at least once** for each matching subscription immediately. If a subscriber's endpoint doesn't acknowledge receipt of an event or if there's a failure, Event Grid retries delivery based on a fixed [retry schedule](#retry-schedule) and [retry policy](#retry-policy). By default, Event Grid delivers one event at a time to the subscriber. However, the payload is an array with a single event.

> [!NOTE]
> Event Grid doesn't guarantee order for event delivery, so subscribers might receive events out of order. 

## Retry schedule
When Event Grid receives an error for an event delivery attempt, it decides whether it should retry the delivery, dead-letter the event, or drop the event based on the type of error. 

If the subscribed endpoint returns a configuration-related error that can't be fixed with retries (for example, if the endpoint is deleted), Event Grid either dead-letters the event or drops the event if dead-lettering isn't configured.

The following table describes the types of endpoints and errors for which Event Grid doesn't retry delivery:

| Endpoint Type | Error codes |
| --------------| -----------|
| Azure Resources | 400 (Bad request), 413 (Request entity is too large), 403 (Forbidden)|
| Webhook | 400 (Bad request), 413 (Request entity is too large), 401 (Unauthorized), 403 (Forbidden)|

> [!NOTE]
> If you don't configure dead-lettering for an endpoint, Event Grid drops events when the preceding errors happen. Consider configuring dead-lettering if you don't want these kinds of events to be dropped. Dead-lettered events are dropped when the dead-letter destination isn't found.

If the subscribed endpoint returns an error that's not in the preceding list, Event Grid retries delivery by using the following policy:

Event Grid waits 30 seconds for a response after delivering a message. After 30 seconds, if the endpoint doesn't respond, Event Grid queues the message for retry. Event Grid uses an exponential backoff retry policy for event delivery. Event Grid retries delivery on the following schedule on a best effort basis:

- 10 seconds
- 30 seconds
- 1 minute
- 5 minutes
- 10 minutes
- 30 minutes
- 1 hour
- 3 hours
- 6 hours
- Every 12 hours up to 24 hours


If the endpoint responds within 3 minutes, Event Grid attempts to remove the event from the retry queue on a best effort basis, but duplicates might still be received.

Event Grid adds a small randomization to all retry steps and might opportunistically skip certain retries if an endpoint is consistently unhealthy, down for a long period, or appears to be overwhelmed.

## Retry policy
You can customize the retry policy when creating an event subscription by using the following two configurations. Event Grid drops an event if either of the limits of the retry policy is reached. 

- **Maximum number of attempts** - The value must be an integer between 1 and 30. The default value is 30.
- **Event time-to-live (TTL)** -  The value must be an integer between 1 and 1440. The default value is 1440 minutes.

For sample CLI and PowerShell command to configure these settings, see [Set retry policy](manage-event-delivery.md#set-retry-policy).

> [!NOTE]
> If you set both `Event time to live (TTL)` and `Maximum number of attempts`, Event Grid uses the first to expire to determine when to stop event delivery. For example, if you set 30 minutes as time-to-live (TTL) and 5 max delivery attempts. When an event isn't delivered after 30 minutes or after 5 attempts, whichever happens first, Event Grid dead-letters the event. If you set max delivery attempts to 10, with respect to the [exponential retry schedule](#retry-schedule), a maximum of 6 delivery attempts happen before 30 minutes TTL is reached. Therefore, setting max number of attempts to 10 has no impact in this case and Event Grid dead-letters events after 30 minutes.

## Output batching 
Event Grid defaults to sending each event individually to subscribers. The subscriber receives an array with a single event. You can configure Event Grid to batch events for delivery for improved HTTP performance in high-throughput scenarios. Batching is turned off by default and you can turn it on per subscription.

### Batching policy
Batched delivery has two settings:

* **Max events per batch** - Maximum number of events Event Grid delivers per batch. This number is never exceeded. However, fewer events might be delivered if no other events are available at the time of publish. Event Grid doesn't delay events to create a batch if fewer events are available. Must be between 1 and 5,000.
* **Preferred batch size in kilobytes** - Target ceiling for batch size in kilobytes. Similar to max events, the batch size might be smaller if more events aren't available at the time of publish. It's possible that a batch is larger than the preferred batch size *if* a single event is larger than the preferred size. For example, if the preferred size is 4 KB and a 10-KB event is pushed to Event Grid, the 10-KB event is still delivered in its own batch rather than being dropped.

You configure batched delivery on a per-event subscription basis via the portal, CLI, PowerShell, or Software Development Kits (SDKs).

### Batching behavior

* All or none

    Event Grid operates with all-or-none semantics. It doesn't support partial success of a batch delivery. Subscribers should be careful to only ask for as many events per batch as they can reasonably handle in 30 seconds.

* Optimistic batching

  The batching policy settings aren't strict bounds on the batching behavior, and Event Grid respects them on a best-effort basis. At low event rates, you often observe the batch size being less than the requested maximum events per batch.

* Default is set to OFF

  By default, Event Grid adds only one event to each delivery request. To turn on batching, set either one of the earlier mentioned settings in the event subscription JSON.

* Default values

  You don't need to specify both the settings (Maximum events per batch and Approximate batch size in kilobytes) when creating an event subscription. If you set only one setting, Event Grid uses configurable default values. For more information about the default values and how to override them, see the following sections.

### Azure portal 
You see these settings on the **Additional Features** tab of the **Event Subscription** page. 

:::image type="content" source="./media/delivery-and-retry/batch-settings.png" alt-text="Screenshot of the Additional Features tab of Event Subscription page with Batching section highlighted." lightbox="./media/delivery-and-retry/batch-settings.png":::

### Azure CLI
When you create an event subscription, use the following parameters: 

- **max-events-per-batch** - Maximum number of events in a batch. Enter a number between 1 and 5,000.
- **preferred-batch-size-in-kilobytes** - Preferred batch size in kilobytes. Enter a number between 1 and 1,024.

```azurecli
storageid=$(az storage account show --name <storage_account_name> --resource-group <resource_group_name> --query id --output tsv)
endpoint=https://$sitename.azurewebsites.net/api/updates

az eventgrid event-subscription create \
  --resource-id $storageid \
  --name <event_subscription_name> \
  --endpoint $endpoint \
  --max-events-per-batch 1000 \
  --preferred-batch-size-in-kilobytes 512
```

For more information on using Azure CLI with Event Grid, see [Route storage events to web endpoint with Azure CLI](../storage/blobs/storage-blob-event-quickstart.md).


## Delayed delivery
As an endpoint experiences delivery failures, Event Grid begins to delay the delivery and retry of events to that endpoint. For example, if the first 10 events published to an endpoint fail, Event Grid assumes that the endpoint is experiencing problems and delays all subsequent retries *and new* deliveries for some time - in some cases, up to several hours.

The functional purpose of delayed delivery is to protect unhealthy endpoints and the Event Grid system. Without back-off and delay of delivery to unhealthy endpoints, Event Grid's retry policy and volume capabilities can easily overwhelm a system.

## Dead-letter events
When Event Grid can't deliver an event within a certain time period or after trying to deliver the event a certain number of times, it can send the undelivered event to a storage account. This process is known as **dead-lettering**. Event Grid dead-letters an event when **one of the following** conditions is met. 

- Event isn't delivered within the **time-to-live** period. 
- The **number of tries** to deliver the event exceeds the limit.

If either condition is met, the event is dropped or dead-lettered. By default, Event Grid doesn't turn on dead-lettering. To enable it, specify a storage account to hold undelivered events when creating the event subscription. You pull events from this storage account to resolve deliveries.

Event Grid sends an event to the dead-letter location when it tries all of its retry attempts. If Event Grid receives a 400 (Bad Request) or 413 (Request Entity Too Large) response code, it immediately schedules the event for dead-lettering. These response codes indicate delivery of the event never succeeds.

The time-to-live expiration is checked **only** at the next scheduled delivery attempt. So, even if time-to-live expires before the next scheduled delivery attempt, event expiry is checked only at the time of the next delivery and then subsequently dead-lettered. 

There's a five-minute delay between the last attempt to deliver an event and when it's delivered to the dead-letter location. This delay reduces the number of Blob storage operations. If the dead-letter location is unavailable for four hours, the event is dropped.

Before setting the dead-letter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

You might want to be notified when an event is sent to the dead-letter location. To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the dead-letter blob storage. Every time your dead-letter blob storage receives an undelivered event, Event Grid notifies your handler. The handler responds with actions you wish to take for reconciling undelivered events. For an example of setting up a dead-letter location and retry policies, see [Dead letter and retry policies](manage-event-delivery.md).

> [!NOTE]
> If you enable managed identity for dead-lettering, add the managed identity to the appropriate role-based access control (RBAC) role on the Azure Storage account that holds the dead-lettered events. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).

## Delivery event formats
This section gives you examples of events and dead-lettered events in different delivery schema formats (Event Grid schema, CloudEvents 1.0 schema, and custom schema). For more information about these formats, see the [Event Grid schema](event-schema.md) and [Cloud Events 1.0 schema](cloud-event-schema.md) articles. 

### Event Grid schema

#### Event 
```json
{
    "id": "93902694-901e-008f-6f95-7153a806873c",
    "eventTime": "2020-08-13T17:18:13.1647262Z",
    "eventType": "Microsoft.Storage.BlobCreated",
    "dataVersion": "",
    "metadataVersion": "1",
    "topic": "/subscriptions/000000000-0000-0000-0000-00000000000000/resourceGroups/rgwithoutpolicy/providers/Microsoft.Storage/storageAccounts/myegteststgfoo",
    "subject": "/blobServices/default/containers/deadletter/blobs/myBlobFile.txt",    
    "data": {
        "api": "PutBlob",
        "clientRequestId": "c0d879ad-88c8-4bbe-8774-d65888dc2038",
        "requestId": "93902694-901e-008f-6f95-7153a8000000",
        "eTag": "0x8D83FACDC0C3402",
        "contentType": "text/plain",
        "contentLength": 0,
        "blobType": "BlockBlob",
        "url": "https://myegteststgfoo.blob.core.windows.net/deadletter/myBlobFile.txt",
        "sequencer": "00000000000000000000000000015508000000000005101c",
        "storageDiagnostics": { "batchId": "cfb32f79-3006-0010-0095-711faa000000" }
    }
}
```

#### Dead-letter event

```json
{
    "id": "93902694-901e-008f-6f95-7153a806873c",
    "eventTime": "2020-08-13T17:18:13.1647262Z",
    "eventType": "Microsoft.Storage.BlobCreated",
    "dataVersion": "",
    "metadataVersion": "1",
    "topic": "/subscriptions/0000000000-0000-0000-0000-000000000000000/resourceGroups/rgwithoutpolicy/providers/Microsoft.Storage/storageAccounts/myegteststgfoo",
    "subject": "/blobServices/default/containers/deadletter/blobs/myBlobFile.txt",    
    "data": {
        "api": "PutBlob",
        "clientRequestId": "c0d879ad-88c8-4bbe-8774-d65888dc2038",
        "requestId": "93902694-901e-008f-6f95-7153a8000000",
        "eTag": "0x8D83FACDC0C3402",
        "contentType": "text/plain",
        "contentLength": 0,
        "blobType": "BlockBlob",
        "url": "https://myegteststgfoo.blob.core.windows.net/deadletter/myBlobFile.txt",
        "sequencer": "00000000000000000000000000015508000000000005101c",
        "storageDiagnostics": { "batchId": "cfb32f79-3006-0010-0095-711faa000000" }
    },

    "deadLetterReason": "MaxDeliveryAttemptsExceeded",
    "deliveryAttempts": 1,
    "lastDeliveryOutcome": "NotFound",
    "publishTime": "2020-08-13T17:18:14.0265758Z",
    "lastDeliveryAttemptTime": "2020-08-13T17:18:14.0465788Z" 
}
```

Here are the possible values of `lastDeliveryOutcome` and their descriptions. 

| LastDeliveryOutcome | Description |
| ------------------- | ----------- | 
| NotFound | Destination resource wasn't found. |
| Disabled | Destination has disabled receiving events. Applicable for Azure Service Bus and Azure Event Hubs. |
| Full | Exceeded maximum number of allowed operations on the destination. Applicable for Azure Service Bus and Azure Event Hubs. |
| Unauthorized | Destination returned unauthorized response code. |
| BadRequest | Destination returned bad request response code. |
| TimedOut | Delivery operation timed out. |
| Busy | Destination server is busy. |
| PayloadTooLarge | Size of the message exceeded the maximum allowed size by the destination. Applicable for Azure Service Bus and Azure Event Hubs. |
| Probation | Destination is put in probation by Event Grid. Delivery isn't attempted during probation. |
| Canceled | Delivery operation canceled. |
| Aborted | Delivery was aborted by Event Grid after a time interval. |
| SocketError | Network communication error occurred during delivery. |
| ResolutionError | DNS resolution of destination endpoint failed. |
| Delivering | Delivering events to the destination. | 
| SessionQueueNotSupported | Event delivery without session ID is attempted on an entity, which has session support enabled. Applicable for Azure Service Bus entity destination. |
| Forbidden | Delivery is forbidden by destination endpoint (could be because of IP firewalls or other restrictions) |
| InvalidAzureFunctionDestination | Destination Azure function isn't valid. Probably because it doesn't have the EventGridTrigger type. |

**LastDeliveryOutcome: Probation**

Event Grid puts an event subscription into probation for a duration if event deliveries to that destination start failing. Probation time is different for different errors returned by the destination endpoint. If an event subscription is in probation, events might get dead-lettered or dropped without even trying delivery depending on the error code that causes the probation.

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
    },

    "deadletterreason": "MaxDeliveryAttemptsExceeded",
    "deliveryattempts": 1,
    "lastdeliveryoutcome": "NotFound",
    "publishtime": "2020-08-13T21:21:36.4018726Z",
}
```

### Custom schema

#### Event

```json
{
    "prop1": "my property",
    "prop2": 5,
    "myEventType": "fooEventType"
}

```

#### Dead-letter event
```json
{
    "id": "8bc07e6f-0885-4729-90e4-7c3f052bd754",
    "eventTime": "2020-08-13T18:11:29.4121391Z",
    "eventType": "myEventType",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "topic": "/subscriptions/00000000000-0000-0000-0000-000000000000000/resourceGroups/rgwithoutpolicy/providers/Microsoft.EventGrid/topics/myCustomSchemaTopic",
    "subject": "subjectDefault",
  
    "deadLetterReason": "MaxDeliveryAttemptsExceeded",
    "deliveryAttempts": 1,
    "lastDeliveryOutcome": "NotFound",
    "publishTime": "2020-08-13T18:11:29.4121391Z",
    "lastDeliveryAttemptTime": "2020-08-13T18:11:29.4277644Z",
  
    "data": {
        "prop1": "my property",
        "prop2": 5,
        "myEventType": "fooEventType"
    }
}
```


## Message delivery status

Event Grid uses HTTP response codes to acknowledge receipt of events. 

### Success codes

Event Grid considers **only** the following HTTP response codes as successful deliveries. All other status codes are failed deliveries. Event Grid retries or dead-letters these failed deliveries as appropriate. When Event Grid receives a successful status code, it considers delivery complete.

- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content

### Failure codes

Event Grid considers all status codes outside the range of 200-204 as failures. If an event delivery fails, Event Grid retries the delivery. Some failure codes have specific retry policies, which are outlined in the following table. All other failure codes follow the standard exponential back-off model. Because of the highly parallelized nature of Event Grid's architecture, the retry behavior is nondeterministic. 

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
When you create an event subscription, you can add up to 10 custom HTTP headers to include in delivered events. Each header value can't exceed 4,096 (4K) bytes. This feature allows you to set custom headers that a destination requires. You can set custom headers on the events that are delivered to the following destinations:

- Webhooks
- Azure Service Bus topics and queues
- Azure Event Hubs
- Relay Hybrid Connections

For more information, see [Custom delivery properties](delivery-properties.md). 

## Related content

* To view the status of event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* To customize event delivery options, see [Dead letter and retry policies](manage-event-delivery.md).
