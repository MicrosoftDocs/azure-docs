---
title: Azure Event Grid delivery and retry
description: Describes how Azure Event Grid delivers events and how it handles undelivered messages.
ms.topic: conceptual
ms.date: 10/29/2020
---

# Event Grid message delivery and retry

This article describes how Azure Event Grid handles events when delivery isn't acknowledged.

Event Grid provides durable delivery. It delivers each message **at least once** for each subscription. Events are sent to the registered endpoint of each subscription immediately. If an endpoint doesn't acknowledge receipt of an event, Event Grid retries delivery of the event.

> [!NOTE]
> Event Grid doesn't guarantee order for event delivery, so subscriber may receive them out of order. 

## Batched event delivery

Event Grid defaults to sending each event individually to subscribers. The subscriber receives an array with a single event. You can configure Event Grid to batch events for delivery for improved HTTP performance in high-throughput scenarios.

Batched delivery has two settings:

* **Max events per batch** - Maximum number of events Event Grid will deliver per batch. This number will never be exceeded, however fewer events may be delivered if no other events are available at the time of publish. Event Grid does not delay events in order to create a batch if fewer events are available. Must be between 1 and 5,000.
* **Preferred batch size in kilobytes** - Target ceiling for batch size in kilobytes. Similar to max events, the batch size may be smaller if more events are not available at the time of publish. It is possible that a batch is larger than the preferred batch size *if* a single event is larger than the preferred size. For example, if the preferred size is 4 KB and a 10-KB event is pushed to Event Grid, the 10-KB event will still be delivered in its own batch rather than being dropped.

Batched delivery in configured on a per-event subscription basis via the portal, CLI, PowerShell, or SDKs.

### Azure portal: 
![Batch delivery settings](./media/delivery-and-retry/batch-settings.png)

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

## Retry schedule and duration

When EventGrid receives an error for an event delivery attempt, EventGrid decides whether it should retry the delivery or dead-letter or drop the event based on the type of the error. 

If the error returned by the subscribed endpoint is configuration related error that can't be fixed with retries (for example, if the endpoint is deleted), EventGrid will either perform dead lettering the event or drop the event if dead letter is not configured.

Following are the types of endpoints for which retry doesn't happen:

| Endpoint Type | Error codes |
| --------------| -----------|
| Azure Resources | 400 Bad Request, 413 Request Entity Too Large, 403 Forbidden | 
| Webhook | 400 Bad Request, 413 Request Entity Too Large, 403 Forbidden, 404 Not Found, 401 Unauthorized |
 
> [!NOTE]
> If Dead-Letter is not configured for endpoint, events will be dropped when above errors happen. Consider configuring Dead-Letter, if you don't want these kinds of events to be dropped.

If the error returned by the subscribed endpoint is not among the above list, EventGrid performs the retry using policies described below:

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


If the endpoint responds within 3 minutes, Event Grid will attempt to remove the event from the retry queue on a best effort basis but duplicates may still be received.

Event Grid adds a small randomization to all retry steps and may opportunistically skip certain retries if an endpoint is consistently unhealthy, down for a long period, or appears to be overwhelmed.

For deterministic behavior, set the event time to live and max delivery attempts in the [subscription retry policies](manage-event-delivery.md).

By default, Event Grid expires all events that aren't delivered within 24 hours. You can [customize the retry policy](manage-event-delivery.md) when creating an event subscription. You provide the maximum number of delivery attempts (default is 30) and the event time-to-live (default is 1440 minutes).

## Delayed Delivery

As an endpoint experiences delivery failures, Event Grid will begin to delay the delivery and retry of events to that endpoint. For example, if the first 10 events published to an endpoint fail, Event Grid will assume that the endpoint is experiencing issues and will delay all subsequent retries *and new* deliveries for some time - in some cases up to several hours.

The functional purpose of delayed delivery is to protect unhealthy endpoints as well as the Event Grid system. Without back-off and delay of delivery to unhealthy endpoints, Event Grid's retry policy and volume capabilities can easily overwhelm a system.

## Dead-letter events
When Event Grid can't deliver an event within a certain time period or after trying to deliver the event a certain number of times, it can send the undelivered event to a storage account. This process is known as **dead-lettering**. Event Grid dead-letters an event when **one of the following** conditions is met. 

- Event isn't delivered within the **time-to-live** period. 
- The **number of tries** to deliver the event has exceeded the limit.

If either of the conditions is met, the event is dropped or dead-lettered.  By default, Event Grid doesn't turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the event subscription. You pull events from this storage account to resolve deliveries.

Event Grid sends an event to the dead-letter location when it has tried all of its retry attempts. If Event Grid receives a 400 (Bad Request) or 413 (Request Entity Too Large) response code, it immediately schedules the event for dead-lettering. These response codes indicate delivery of the event will never succeed.

The time-to-live expiration is checked ONLY at the next scheduled delivery attempt. Therefore, even if time-to-live expires before the next scheduled delivery attempt, event expiry is checked only at the time of the next delivery and then subsequently dead-lettered. 

There is a five-minute delay between the last attempt to deliver an event and when it is delivered to the dead-letter location. This delay is intended to reduce the number Blob storage operations. If the dead-letter location is unavailable for four hours, the event is dropped.

Before setting the dead-letter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

You might want to be notified when an event has been sent to the dead letter location. To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the dead-letter blob storage. Every time your dead-letter blob storage receives an undelivered event, Event Grid notifies your handler. The handler responds with actions you wish to take for reconciling undelivered events. For an example of setting up a dead letter location and retry policies, see [Dead letter and retry policies](manage-event-delivery.md).

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

Event Grid considers **only** the following HTTP response codes as successful deliveries. All other status codes are considered failed deliveries and will be retried or deadlettered as appropriate. Upon receiving a successful status code, Event Grid considers delivery complete.

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


## Next steps

* To view the status of event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* To customize event delivery options, see [Dead letter and retry policies](manage-event-delivery.md).
