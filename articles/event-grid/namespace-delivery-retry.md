---
title: Delivery and retry mechanism for push delivery with Event Grid namespaces
description: This article describes how delivery and retry works with Azure Event Grid namespaces.
ms.topic: conceptual
ms.date: 10/20/2023
author: robece
ms.author: robece
---

# Delivery and retry with Azure Event Grid namespaces

Event Grid namespaces provides durable delivery. It tries to deliver each message at least once for each matching subscription immediately. If a subscriber's endpoint doesn't acknowledge receipt of an event or if there's a failure, Event Grid retries delivery based on a fixed [retry schedule](#retry-schedule) and [retry policy](#retry-policy). By default, Event Grid delivers one event at a time to the subscriber. The payload is however an array with a single event.

> [!NOTE]
> Event Grid namespaces doesn't guarantee order for event delivery, so subscribers may receive them out of order.

## Retry schedule

When Event Grid namespace receives an error when delivering, events can be retried, dropped or dead-lettered depending on the type of error. Even though you may have configured retention and maximum delivery count. Event Grid drop or dead-letter events depending on the following errors:

- ArgumentException
- TimeoutException
- UnauthorizedAccessException
- OperationCanceledException
- SocketException
- Http exception with any of the following status code:
    - NotFound
    - Unauthorized
    - Forbidden
    - BadRequest
    - RequestUriTooLong

For other errors, Event Grid namespace does a best effort retry with an exponential backoff retry of 0 sec, 10 sec, 30 sec, 1 min, and 5 min. After reaching 5 minutes, Event Grid continues retrying every 5 min until it’s delivered or event retention is expired.

## Retry policy

You can customize the retry policy when creating an event subscription by using the following two configurations. An event is dropped if either of the limits of the retry policy is reached.

- **Maximum delivery count** - The value must be an integer between 1 and 10. The default value is 10.
- **Retention** -  The value must be an integer between 1 and 7. The default value is 7 days. [Learn more about retention with Event Grid namespaces](event-retention.md).

> [!NOTE]
> If you set both `Retention` and `Maximum delivery count`, Event Grid namespaces uses the first to expire to determine when to stop event delivery. For example, if you set 1 day as retention and 5 max delivery count. When an event isn't delivered after 1 day (or) isn't delivered after 5 attempts, whichever happens first, the event is dropped or dead-lettered.

## Next steps

- [Monitor Pull Delivery](monitor-pull-reference.md).
- [Monitor Push Delivery](monitor-namespace-push-reference.md).
