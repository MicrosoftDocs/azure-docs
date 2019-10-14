---
title: Azure Event Grid delivery and retry
description: Describes how Azure Event Grid delivers events and how it handles undelivered messages.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/15/2019
ms.author: spelluru
---

# Event Grid message delivery and retry

This article describes how Azure Event Grid handles events when delivery isn't acknowledged.

Event Grid provides durable delivery. It delivers each message at least once for each subscription. Events are sent to the registered endpoint of each subscription immediately. If an endpoint doesn't acknowledge receipt of an event, Event Grid retries delivery of the event.

Currently, Event Grid sends each event individually to subscribers. The subscriber receives an array with a single event.

## Retry schedule and duration

Event Grid waits 30 seconds for a response after delivering a message. After 30 seconds, if the endpoint hasn’t responded, the message is queued for retry. Event Grid uses an exponential backoff retry policy for event delivery. Event Grid retries delivery on the following schedule on a best effort basis:

- 10 seconds
- 30 seconds
- 1 minute
- 5 minutes
- 10 minutes
- 30 minutes
- 1 hour
- Hourly for up to 24 hours

If the endpoint responds within 3 minutes, Event Grid will attempt to remove the event from the retry queue on a best effort basis but duplicates may still be received.

Event Grid adds a small randomization to all retry steps and may opportunistically skip certain retries if an endpoint is consistently unhealthy, down for a long period, or appears to be overwhelmed.

For deterministic behavior, set the event time to live and max delivery attempts in the [subscription retry policies](manage-event-delivery.md).

By default, Event Grid expires all events that aren't delivered within 24 hours. You can [customize the retry policy](manage-event-delivery.md) when creating an event subscription. You provide the maximum number of delivery attempts (default is 30) and the event time-to-live (default is 1440 minutes).

## Delayed Delivery

As an endpoint experiences delivery failures, Event Grid will begin to delay the delivery and retry of events to that endpoint. For example, if the first ten events published to an endpoint fail, Event Grid will assume that the endpoint is experiencing issues and will delay all subsequent retries *and new* deliveries for some time - in some cases up to several hours.

The functional purpose of delayed delivery is to protect unhealthy endpoints as well as the Event Grid system. Without back-off and delay of delivery to unhealthy endpoints, Event Grid's retry policy and volume capabilities can easily overwhelm a system.

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

Event Grid considers **only** the following HTTP response codes as successful deliveries. All other status codes are considered failed deliveries and will be retried or deadlettered as appropriate. Upon receiving a successful status code, Event Grid considers delivery complete.

- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content

### Failure codes

All other codes not in the above set (200-204) are considered failures and will be retried. Some have specific retry policies tied to them outlined below, all others follow the standard exponential back-off model. It's important to keep in mind that due to the highly parallelized nature of Event Grid's architecture, the retry behavior is non-deterministic. 

| Status code | Retry behavior |
| ------------|----------------|
| 400 Bad Request | Retry after 5 minutes or more (Deadletter immediately if deadletter setup) |
| 401 Unauthorized | Retry after 5 minutes or more |
| 403 Forbidden | Retry after 5 minutes or more |
| 404 Not Found | Retry after 5 minutes or more |
| 408 Request Timeout | Retry after 2 minutes or more |
| 413 Request Entity Too Large | Retry after 10 seconds or more (Deadletter immediately if deadletter setup) |
| 503 Service Unavailable | Retry after 30 seconds or more |
| All others | Retry after 10 seconds or more |


## Next steps

* To view the status of event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* To customize event delivery options, see [Dead letter and retry policies](manage-event-delivery.md).
