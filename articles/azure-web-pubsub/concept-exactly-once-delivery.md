---
title: Exactly Once Message Delivery
description: The concept of exactly once message delivery
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: reference 
ms.date: 12/15/2021
---

# Azure Web PubSub Service supports exactly once message delivery guarantees 

Exactly once message delivery guarantees are desirable in a real-time pub-sub service. The service supports exactly once message delivery within a connection-id.
The connection-id works like a session and it can cross WebSockets connections. Once a message published to the service and received a success ack, the message
can be delivered to desired connections exactly once.

## How to achieve exactly once message delivery

It's crucial to mention that exactly once needs the whole system including publisher, service, and subscriber play their role correctly.

### Service

Service provides a message delivery option to control the type of messaging semantics per hub. By default, it's `AtMostOnce`. Select to `ExactlyOnce` to enable exactly once message delivery in service side.

### Reconnection

All connections what to achieve exactly once message delivery should implement reconnection. When a new connection connect to service, as long as the hub enabled `ExactlyOnce`, the connection will receive a `Connected` message contains `connectionId` and `reconnectionToken`.

```json
{
    "type":"system",
    "event":"connected",
    "connectionId": "<connection_id>",
    "reconnectionToken": "<reconnection_token>"
}
```

Once the WebSockets connection dropped, client should first try to reconnect with the same `connectionId` to keep the session. Clients don't need to negotiate with server and obtain the `access_token`. Instead, reconnection should make a websocket connect request to service directly with `connection_id` and `reconnection_token` with following uri:

```
wss://<service-endpoint>/client/hubs/<hub>?awps_connection_id=<connection_id>&awps_reconnection_token=<reconnection_token>
```

The reconnection can be success or failed. If it's failed, client should keep retrying reconnection or giving up and make a new connection depend on the response:

- Response status code 404: Giving up keep reconnecting and make a new connection. The response means the connection-id has been deleted from the service.
- Response status code 5XX or socket error: Keep retrying reconnecting.

### Publisher

Publisher should set `ackId` to the message to get acknowledged from the service about whether the message publishing success or not. The `ackId` in message is the identity of the message, which means different message should use different `ackId`, while resending message should keep the same `ackId` for the service to de-duplicate.

```json
{
    "type": "ack",
    "ackId": 1, // The ack id for the request to ack
    "success": true, // true or false
    "error": {
        "name": "Forbidden|InternalServerError|Duplicate",
        "message": "<error_detail>"
    }
}
```

- Service response ack with `success=false` because of transient internal error. In such case, client should resend message with the same message-id.

![Message Failure](./media/concept-exactly-once-delivery/message-failed.png)

- Service's response may be dropped because of WebSockets connection dropped. Client should wait for ack with timeout, and resend message with the same message-id after timeout. If the message has actually processed by the service, it will response ack with duplicated to achieve publisher side exactly once.

![Message duplicated](./media/concept-exactly-once-delivery/message-duplicated.png)

### Subscriber

Messages send to client contains `sequenceId` and client must ack the sequence-id with sequence ack message:

```json
{
    "type": "ack",
    "sequenceId": 1
}
```

The sequence-id is a uint64 incremental number with-in a connection-id session. Client should record the largest sequence-id it ever received and accept all messages with larger sequence-id and drop all messages with smaller or equal sequence-id. The sequence ack supports quick ack, which means if you ack `sequence-id=5`, the service will treat all messages with sequence-id smaller than 5 have already been received by client. Client should ack with the largest sequence-id it recorded, so that the service can skip redelivering messages that clients have already received.

All messages are delivered to clients in order until the WebSockets connection drops. With sequence-id, the service can have the knowledge about how many messages have clients actually received across WebSockets connections with-in a connection-id session. After a WebSockets connection drop, the service will redelivery messages it should deliver but not ack-ed by the client. The service hold messages that are not ack-ed but it's limited, if messages exceed the limit, the service will close the WebSockets connection and remove the connection-id session. Thus, client should ack the sequence-id as soon as possible.
