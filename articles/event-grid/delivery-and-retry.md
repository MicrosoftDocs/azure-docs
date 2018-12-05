---
title: Azure Event Grid delivery and retry
description: Describes how Azure Event Grid delivers events and how it handles undelivered messages.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: tomfitz
---

# Event Grid message delivery and retry

This article describes how Azure Event Grid handles events when delivery isn't acknowledged.

Event Grid provides durable delivery. It delivers each message at least once for each subscription. Events are sent to the registered endpoint of each subscription immediately. If an endpoint doesn't acknowledge receipt of an event, Event Grid retries delivery of the event.

Currently, Event Grid sends each event individually to subscribers. The subscriber receives an array with a single event.

## Retry schedule and duration

Event Grid uses an exponential backoff retry policy for event delivery. If an endpoint doesn't respond or returns a failure code, Event Grid retries delivery on the following schedule:

1. 10 seconds
2. 30 seconds
3. 1 minute
4. 5 minutes
5. 10 minutes
6. 30 minutes
7. 1 hour

Event Grid adds a small randomization to all retry steps. After one hour, event delivery is retried once an hour.

By default, Event Grid expires all events that aren't delivered within 24 hours. You can [customize the retry policy](manage-event-delivery.md) when creating an event subscription. You provide the maximum number of delivery attempts (default is 30) and the event time-to-live (default is 1440 minutes).

## Dead-letter events

When Event Grid can't deliver an event, it can send the undelivered event to a storage account. This process is known as dead-lettering. By default, Event Grid doesn't turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the event subscription. You pull events from this storage account to resolve deliveries.

Event Grid sends an event to the dead-letter location when it has tried all of its retry attempts. If Event Grid receives a 400 (Bad Request) or 413 (Request Entity Too Large) response code, it immediately sends the event to the dead-letter endpoint. These response codes indicate delivery of the event will never succeed.

There is a five-minute delay between the last attempt to deliver an event and when it is delivered to the dead-letter location. This delay is intended to reduce the number Blob storage operations. If the dead-letter location is unavailable for four hours, the event is dropped.

Before setting the dead-letter location, you must have a storage account with a container. You provide the endpoint for this container when creating the event subscription. The endpoint is in the format of:
`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/blobServices/default/containers/<container-name>`

You might want to be notified when an event has been sent to the dead letter location. To use Event Grid to respond to undelivered events, [create an event subscription](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) for the dead-letter blob storage. Every time your dead-letter blob storage receives an undelivered event, Event Grid notifies your handler. The handler responds with actions you wish to take for reconciling undelivered events.

For an example of setting up a dead letter location, see [Dead letter and retry policies](manage-event-delivery.md).

## Message delivery status

Event Grid uses HTTP response codes to acknowledge receipt of events. 

### Success codes

The following HTTP response codes indicate that an event has been delivered successfully to your webhook. Event Grid considers delivery complete.

- 200 OK
- 202 Accepted

### Failure codes

The following HTTP response codes indicate that an event delivery attempt failed.

- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 408 Request timeout
- 413 Request Entity Too Large
- 414 URI Too Long
- 429 Too Many Requests
- 500 Internal Server Error
- 503 Service Unavailable
- 504 Gateway Timeout

## Next steps

* To view the status of event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* To customize event delivery options, see [Dead letter and retry policies](manage-event-delivery.md).