---
title: Azure Event Grid publisher and subscriber operations
description: Describes publisher and subscriber operations supported by Azure Event Grid when using namespaces. 
ms.topic: conceptual
ms.date: 09/27/2023
---

# Azure Event Grid - publisher and subscriber operations 
This article describes the publisher and subscriber operations supported by Azure Event Grid when using namespaces. 

## Publisher operations

### Publish cloud events
Use the publish operation to publish a single cloud event or a batch of cloud events in the JSON format. 

Here's an example of a REST API command to publish cloud events. For more information about the operation and the command, see [REST API - Publish Cloud Events](/rest/api/eventgrid/dataplanepreview-version2023-06-01/publish-cloud-events/publish-cloud-events).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic:publish?api-version=2023-06-01-preview

[
  {
    "id": "b3ccc7e3-c1cb-49bf-b7c8-0d4e60980616",
    "source": "/microsoft/autorest/examples/eventgrid/cloud-events/publish",
    "specversion": "1.0",
    "data": {
      "Property1": "Value1",
      "Property2": "Value2"
    },
    "type": "Microsoft.Contoso.TestEvent",
    "time": "2023-05-04T23:06:09.147165Z"
  }
]
```

Here's the sample response when the status is 200. 

```json
{
}
```


## Subscriber operations

### Acknowledge cloud events
Use this operation to acknowledge events from a queue subscription to indicate that they have been successfully processed and those events shouldn't be redelivered. The operation is considered successful if at least one event in the batch is successfully acknowledged. The response includes a set of successfully acknowledged lock tokens, along with other failed lock tokens with their corresponding information. The successfully acknowledged events will no longer be available to any consumer. 

Here's an example of a REST API command to acknowledge cloud events. For more information about the operation and the command, see [REST API - Acknowledge Cloud Events](/rest/api/eventgrid/dataplanepreview-version2023-06-01/acknowledge-cloud-events/acknowledge-cloud-events).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:acknowledge?api-version=2023-06-01-preview

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

### Receive cloud events
Use this operation to receive a single cloud event or a batch of cloud events from a queue subscription. 

Here's an example of a REST API command to receive events. For more information about the operation and the command, see [REST API - Receive Cloud Events](/rest/api/eventgrid/dataplanepreview-version2023-06-01/receive-cloud-events/receive-cloud-events).


```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:receive?api-version=2023-06-01-preview&maxEvents=1&maxWaitTime=60
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

### Reject cloud events
Use this operation to reject a cloud event to signal that such event should be redelivered again because it's not actionable. If there's a dead-letter configured, the event is sent to the dead-letter destination. 

Here's an example of the REST API command to reject events. For more information about the operation and the command, see [REST API - Reject Cloud Events](/rest/api/eventgrid/dataplanepreview-version2023-06-01/reject-cloud-events/reject-cloud-events).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:reject?api-version=2023-06-01-preview

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


### Release cloud events
A client releases an event to be available again for delivery. The request may contain a delay time before the event is available for delivery. If the delay time isn't specified or is zero, the associated event is released immediately and hence, is immediately available for redelivery. The delay time specified must be one of the following and is bound by the subscription’s event time to live, if set, or the topic’s retention time. 

- 0 seconds
- 10 seconds
- 1 minute
- 10 minutes
- 1 hour

The operation is considered successful if at least one event in a batch is successfully released. The response body includes a set of successfully release lock tokens along with other failed lock tokens with corresponding error information. 

Here's an example of the REST API command to release events. For more information about the operation and the command, see [REST API - Release Cloud Events](/rest/api/eventgrid/dataplanepreview-version2023-06-01/release-cloud-events/release-cloud-events).

```http
POST myNamespaceName.westus-1.eventgrid.azure.net/topics/myTopic/eventsubscriptions/myEventSubscription:release?api-version=2023-06-01-preview&delayInSeconds=3600

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


### Renew lock
A client renews an event lock to extend the time they can hold on to a received message before it acknowledges it. With a non-expired lock token, a client can successfully perform such operations as release, reject, acknowledge, and renew lock.

A client requests to renew a lock within 1 hour from the time the lock was created, that is, from the time the event was first received. It's the window of time on which lock renewal requests should succeed. It isn't the effective limit for the total lock duration (through continuous lock renewals). If an event subscription’s `receiveLockDurationInSeconds` is set to 300 (5 minutes) and the request comes in at minute 00:59:59 (1 second before the 1 hour limit (right) since the lock was first created when the message was received, then the lock renewal should succeed. It results in an effective total lock time of about 1:04:59. Hence, 1 hour is NOT an absolute limit for total lock duration, but it's for the time window within which a lock renewal can be requested regardless of the `receiveLockDurationInSeconds` value. If a subsequent lock renewal request comes in when the effective total lock time is more than 1 hour, then that request should fail as the lock has been extended beyond 1 hour.

Here's an example of the REST API command to renew locks. For more information about the operation and the command, see [REST API - Renews Locks](/rest/api/eventgrid/).

```http
https://{namespaceName}.{region}.eventgrid.azure.net/topics/{topicResourceName}/eventsubscriptions/{eventSubscriptionName}:renewLock&api-version={apiVersion}

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

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).