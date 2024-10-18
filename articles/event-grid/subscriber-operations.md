---
title: Azure Event Grid subscriber operations for namespace topics
description: Describes subscriber operations supported by Azure Event Grid when using namespaces.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
---

# Azure Event Grid - subscriber operations 

This article describes HTTP subscriber operations supported by Azure Event Grid when using namespace topics.

## Receive cloud events

Use this operation to read a single CloudEvent or a batch of CloudEvents from a queue subscription. A queue subscription is an event subscription that has as a *deliveryMode* the value *queue*.

Here's an example of a REST API command to receive events. For more information about the receive operation, see [Event Grid REST API](/rest/api/eventgrid/).


```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:receive?api-version=2023-11-01&maxEvents=1&maxWaitTime=60
```

Here's the sample response:

```json
{
  "value": [
    {
      "brokerProperties": {
        "lockToken": "CgMKATESCQoHdG9rZW4tMQ==",
        "deliveryCount": 1
      },
      "event": {
        "specversion": "1.0",
        "type": "demo-started",
        "source": "/test",
        "subject": "all-hands-0405",
        "id": "e770f36b-381a-41db-8b2b-b7199daeb202",
        "time": "2023-05-05T17:31:00Z",
        "datacontenttype": "application/json",
        "data": "test"
      }
    }
  ]
}
```

The response includes a *lockToken* property, which serves as an identifier of the event received and is used when your app needs to acknowledge, release, or reject an event.

## Acknowledge CloudEvents

Use this operation to acknowledge events from a queue subscription to indicate that they have been successfully processed and those events shouldn't be redelivered. The operation is considered successful if at least one event in the batch is successfully acknowledged. The response includes a set of successfully acknowledged lock tokens, along with other failed lock tokens with their corresponding information. Successfully acknowledged events will no longer be available to any consumer client.

Here's an example of a REST API command to acknowledge cloud events. For more information about the acknowledge operation, see [Event Grid REST API](/rest/api/eventgrid/).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:acknowledge?api-version=2023-11-01

{
  "lockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```

Here's the sample response:

```json
{
  "failedLockTokens": [
    {
      "lockToken": "CgMKATESCQoHdG9rZW4tMQ==",
      "errorCode": "BadToken",
      "errorDescription": ""
    }
  ],
  "succeededLockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```

## Reject CloudEvents

Use this operation to signal that an event should NOT be redelivered because it's not actionable. If there's a dead-letter configured, the event is sent to the dead-letter destination. Otherwise, it's dropped.

Here's an example of the REST API command to reject events. For more information about the reject operation, see [Event Grid REST API](/rest/api/eventgrid/).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:reject?api-version=2023-11-01

{
  "lockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```

Here's the sample response:

```json
{
  "failedLockTokens": [],
  "succeededLockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```


## Release CloudEvents

A client releases an event to be available again for delivery. The request can contain a delay time before the event is available for delivery. If the delay time isn't specified or is zero, the associated event is released immediately and hence, is immediately available for redelivery. The delay time specified must be one of the following and is bound by the subscription’s event time to live, if set, or the topic’s retention time.

* 0 seconds
* 10 seconds
* 60 seconds (1 minute)
* 600 seconds (10 minutes)
* 3600 seconds (1 hour)

The operation is considered successful if at least one event in a batch is successfully released. The response body includes a set of successfully release lock tokens along with other failed lock tokens with corresponding error information. 

Here's an example of the REST API command to release events. For more information about the release operation, see [Event Grid REST API](/rest/api/eventgrid/).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:release?api-version=2023-11-01&releaseDelayInSeconds=3600

{
  "lockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```

Here's the sample response:

```json
{
  "failedLockTokens": [],
  "succeededLockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```


## Renew lock

Once a client has received an event, that event is locked, that is, unavailable for redelivery for the amount specified in *receiveLockDurationInSeconds* on the event subscription. A client renews an event lock to extend the time they can hold on to a received message. With a nonexpired lock token, a client can successfully perform such operations as release, reject, acknowledge, and renew lock.

A client requests to renew a lock within 1 hour from the time the lock was created, that is, from the time the event was first received. It's the window of time on which lock renewal requests should succeed. It isn't the effective limit for the total lock duration (through continuous lock renewals). If an event subscription’s `receiveLockDurationInSeconds` is set to 300 (5 minutes) and the request comes in at minute 00:59:59 (1 second before the 1 hour limit (right) since the lock was first created when the message was received, then the lock renewal should succeed. It results in an effective total lock time of about 1:04:59. Hence, 1 hour is NOT an absolute limit for total lock duration, but it's for the time window within which a lock renewal can be requested regardless of the `receiveLockDurationInSeconds` value. If a subsequent lock renewal request comes in when the effective total lock time is more than 1 hour, then that request should fail as the lock has been extended beyond 1 hour.

Here's an example of the REST API command to renew locks. For more information about the renew lock operation, see [Event Grid REST API](/rest/api/eventgrid/).

```http
https://{namespaceName}.{region}.eventgrid.azure.net/topics/{topicResourceName}/eventsubscriptions/{eventSubscriptionName}:renewLock&api-version=2023-11-01

{
  "lockTokens": [
    "CgMKATESCQoHdG9rZW4tMQ=="
  ]
}
```

Here's the sample response:

```json
{
        "succeededLockTokens": [
        "CgMKATESCQoHdG9rZW4tMQ=="
    ],
        "failedLockTokens": [
        {
            "lockToken": "CiYKJDc4NEQ4NDgyxxxx",
            "errorCode": "TokenLost",
            "errorDescription": "Token has expired."
        }
    ]
}
```

## Next steps

* To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
