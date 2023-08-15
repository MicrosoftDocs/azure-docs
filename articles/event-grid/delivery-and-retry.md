---
title: Azure Event Grid delivery and retry
description: Describes how Azure Event Grid delivers events and how it handles undelivered messages.
ms.topic: conceptual
ms.date: 03/01/2023
---

# Event Grid message delivery and retry
Event Grid provides durable delivery. It tries to deliver each message **at least once** for each matching subscription immediately. If a subscriber's endpoint doesn't acknowledge receipt of an event or if there's a failure, Event Grid retries delivery based on a fixed [retry schedule](#retry-schedule) and [retry policy](#retry-policy). By default, Event Grid delivers one event at a time to the subscriber. The payload is however an array with a single event.

> [!NOTE]
> Event Grid doesn't guarantee order for event delivery, so subscribers may receive them out of order. 

## Retry schedule
When Event Grid receives an error for an event delivery attempt, Event Grid decides whether it should retry the delivery, dead-letter the event, or drop the event based on the type of the error. 

If the error returned by the subscribed endpoint is a configuration-related error that can't be fixed with retries (for example, if the endpoint is deleted), Event Grid will either perform dead-lettering on the event or drop the event if dead-letter isn't configured.

The following table describes the types of endpoints and errors for which retry doesn't happen:

| Endpoint Type | Error codes |
| --------------| -----------|
| Azure Resources | 400 (Bad request), 413 (Request entity is too large) | 
| Webhook | 400 (Bad request), 413 (Request entity is too large), 401 (Unauthorized) |
 
> [!NOTE]
> If dead-letter isn't configured for an endpoint, events will be dropped when the above errors happen. Consider configuring dead-letter if you don't want these kinds of events to be dropped. Dead lettered events will be dropped when the dead-letter destination isn't found.

If the error returned by the subscribed endpoint isn't among the above list, Event Grid performs the retry using the policy described below:

Event Grid waits 30 seconds for a response after delivering a message. After 30 seconds, if the endpoint hasn’t responded, the message is queued for retry. Event Grid uses an exponential backoff retry policy for event delivery. Event Grid retries delivery on the following schedule on a best effort basis:

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


If the endpoint responds within 3 minutes, Event Grid attempts to remove the event from the retry queue on a best effort basis, but duplicates may still be received.

Event Grid adds a small randomization to all retry steps and may opportunistically skip certain retries if an endpoint is consistently unhealthy, down for a long period, or appears to be overwhelmed.

## Retry policy
You can customize the retry policy when creating an event subscription by using the following two configurations. An event is dropped if either of the limits of the retry policy is reached. 

- **Maximum number of attempts** - The value must be an integer between 1 and 30. The default value is 30.
- **Event time-to-live (TTL)** -  The value must be an integer between 1 and 1440. The default value is 1440 minutes

For sample CLI and PowerShell command to configure these settings, see [Set retry policy](manage-event-delivery.md#set-retry-policy).

> [!NOTE]
> If you set both `Event time to live (TTL)` and `Maximum number of attempts`, Event Grid uses the first to expire to determine when to stop event delivery. For example, if you set 30 minutes as time-to-live (TTL) and 5 max delivery attempts. When an event isn't delivered after 30 minutes (or) isn't delivered after 5 attempts, whichever happens first, the event is dead-lettered. If you set max delivery attempts to 10, with respect to [exponential retry schedule](#retry-schedule), max 6 number of delivery attempts happen before 30 minutes TTL will be reached, therefore setting max number of attempts to 10 will have no impact in this case and events will be dead-lettered after 30 minutes.

## Output batching 
Event Grid defaults to sending each event individually to subscribers. The subscriber receives an array with a single event. You can configure Event Grid to batch events for delivery for improved HTTP performance in high-throughput scenarios. Batching is turned off by default and can be turned on per-subscription.

### Batching policy
Batched delivery has two settings:

* **Max events per batch** - Maximum number of events Event Grid delivers per batch. This number will never be exceeded, however fewer events may be delivered if no other events are available at the time of publish. Event Grid doesn't delay events to create a batch if fewer events are available. Must be between 1 and 5,000.
* **Preferred batch size in kilobytes** - Target ceiling for batch size in kilobytes. Similar to max events, the batch size may be smaller if more events aren't available at the time of publish. It's possible that a batch is larger than the preferred batch size *if* a single event is larger than the preferred size. For example, if the preferred size is 4 KB and a 10-KB event is pushed to Event Grid, the 10-KB event will still be delivered in its own batch rather than being dropped.

Batched delivery in configured on a per-event subscription basis via the portal, CLI, PowerShell, or SDKs.

### Batching behavior

* All or none

  Event Grid operates with all-or-none semantics. It doesn't support partial success of a batch delivery. Subscribers should be careful to only ask for as many events per batch as they can reasonably handle in 30 seconds.

* Optimistic batching

  The batching policy settings aren't strict bounds on the batching behavior, and are respected on a best-effort basis. At low event rates, you'll often observe the batch size being less than the requested maximum events per batch.

* Default is set to OFF

  By default, Event Grid only adds one event to each delivery request. The way to turn on batching is to set either one of the settings mentioned earlier in the article in the event subscription JSON.

* Default values

  It isn't necessary to specify both the settings (Maximum events per batch and Approximate batch size in kilo bytes) when creating an event subscription. If only one setting is set, Event Grid uses (configurable) default values. See the following sections for the default values, and how to override them.

### Azure portal: 
You see these settings on the **Additional Features** tab of the **Event Subscription** page. 

:::image type="content" source="./media/delivery-and-retry/batch-settings.png" alt-text="Screenshot sowing the Additional Features tab of Event Subscription page with Batching section highlighted. ":::

### Azure CLI
When creating an event subscription, use the following parameters: 

- **max-events-per-batch** - Maximum number of events in a batch. Must be a number between 1 and 5000.
- **preferred-batch-size-in-kilobytes** - Preferred batch size in kilobytes. Must be a number between 1 and 1024.

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


## Delayed Delivery
As an endpoint experiences delivery failures, Event Grid begins to delay the delivery and retry of events to that endpoint. For example, if the first 10 events published to an endpoint fail, Event Grid assumes that the endpoint is experiencing issues and will delay all subsequent retries *and new* deliveries for some time - in some cases up to several hours.

The functional purpose of delayed delivery is to protect unhealthy endpoints and the Event Grid system. Without back-off and delay of delivery to unhealthy endpoints, Event Grid's retry policy and volume capabilities can easily overwhelm a system.

## Dead-letter events
When Event Grid can't deliver an event within a certain time period or after trying to deliver the event a certain number of times, it can send the undelivered event to a storage account. This process is known as **dead-lettering**. Event Grid dead-letters an event when **one of the following** conditions is met. 

- Event isn't delivered within the **time-to-live** period. 
- The **number of tries** to deliver the event has exceeded the limit.

If either of the conditions is met, the event is dropped or dead-lettered.  By default, Event Grid doesn't turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the event subscription. You pull events from this storage account to resolve deliveries.

Event Grid sends an event to the dead-letter location when it has tried all of its retry attempts. If Event Grid receives a 400 (Bad Request) or 413 (Request Entity Too Large) response code, it immediately schedules the event for dead-lettering. These response codes indicate delivery of the event will never succeed.

The time-to-live expiration is checked ONLY at the next scheduled delivery attempt. So, even if time-to-live expires before the next scheduled delivery attempt, event expiry is checked only at the time of the next delivery and then subsequently dead-lettered. 

There's a five-minute delay between the last attempt to deliver an event and when it's delivered to the dead-letter location. This delay is intended to reduce the number of Blob storage operations. If the dead-letter location is unavailable for four hours, the event is dropped.

Before setting the dead-letter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

You might want to be notified when an event has been sent to the dead-letter location. To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the dead-letter blob storage. Every time your dead-letter blob storage receives an undelivered event, Event Grid notifies your handler. The handler responds with actions you wish to take for reconciling undelivered events. For an example of setting up a dead-letter location and retry policies, see [Dead letter and retry policies](manage-event-delivery.md).

> [!NOTE]
> If you enable managed identity for dead-lettering, you'll need to add the managed identity to the appropriate role-based access control (RBAC) role on the Azure Storage account that will hold the dead-lettered events. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).

## Delivery event formats
This section gives you examples of events and dead-lettered events in different delivery schema formats (Event Grid schema, CloudEvents 1.0 schema, and custom schema). For more information about these formats, see [Event Grid schema](event-schema.md) and [Cloud Events 1.0 schema](cloud-event-schema.md) articles. 

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

An event subscription is put into probation for a duration by Event Grid if event deliveries to that destination start failing. Probation time is different for different errors returned by the destination endpoint. If an event subscription is in probation, events may get dead-lettered or dropped without even trying delivery depending on the error code due to which it's in probation.

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

Event Grid considers **only** the following HTTP response codes as successful deliveries. All other status codes are considered failed deliveries and will be retried or deadlettered as appropriate. When Event Grid receives a successful status code, it considers delivery complete.

- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content

### Failure codes

All other codes not in the above set (200-204) are considered failures and will be retried (if needed). Some have specific retry policies tied to them outlined below, all others follow the standard exponential back-off model. It's important to keep in mind that due to the highly parallelized nature of Event Grid's architecture, the retry behavior is non-deterministic. 

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
- Azure Service Bus topics and queues
- Azure Event Hubs
- Relay Hybrid Connections

For more information, see [Custom delivery properties](delivery-properties.md). 

## Next steps

* To view the status of event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* To customize event delivery options, see [Dead letter and retry policies](manage-event-delivery.md).
