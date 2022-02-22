---
title: Create reliable Websocket clients
description: How to create reliable Websocket clients
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: reference 
ms.date: 12/15/2021
---

# Create reliable Websocket with subprotocol

Websocket client connections may drop due to intermittent network issue and when connections drop, messages will also be lost. In a pubsub system, publishers are decoupled from subscribers, so publishers hard to detect subscribers' drop or message loss. It's crucial for clients to overcome intermittent network issue and keep the reliability of message delivery. To achieve that, you can create a reliable Websocket client with the help of reliable subprotocols.

> [!NOTE]
> Reliable protocols are still in preview. Some changes are expected in future.

## Reliable Protocol

Service supports two reliable subprotocols `json.reliable.webpubsub.azure.v1` and `protobuf.reliable.webpubsub.azure.v1`. Clients must follow the protocol, mainly including the part of reconnection, publisher and subscriber to achieve the reliability, or the message delivery may not work as expected or the service may terminate the client as it violates the protocol spec.

## Initialization

To use reliable subprotocols, you must set subprotocol when constructing Websocket connections. In JavaScript, you can use as following:

- Use Json reliable subprotocol
    ```js
    var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.reliable.webpubsub.azure.v1');
    ```

- Use Protobuf reliable subprotocol
    ```js
    var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.reliable.webpubsub.azure.v1');
    ```

## Reconnection

Websocket connections relay on TCP, so if the connection doesn't drop, all messages should be lossless and in order. When facing network issue and connections drop, all the status such as group and message info are kept by the service and wait for reconnection to recover. A Websocket connection owns a session in the service and the identifier is `connectionId`. Reconnection is the basis of achieving reliability and must be implemented. When a new connection connects to the service using reliable subprotocols, the connection will receive a `Connected` message contains `connectionId` and `reconnectionToken`.

```json
{
    "type":"system",
    "event":"connected",
    "connectionId": "<connection_id>",
    "reconnectionToken": "<reconnection_token>"
}
```

Once the WebSocket connection dropped, the client should first try to reconnect with the same `connectionId` to keep the session. Clients don't need to negotiate with server and obtain the `access_token`. Instead, reconnection should make a websocket connect request to service directly with `connection_id` and `reconnection_token` with the following uri:

```
wss://<service-endpoint>/client/hubs/<hub>?awps_connection_id=<connection_id>&awps_reconnection_token=<reconnection_token>
```

Reconnection may fail as network issue hasn't been recovered yet. Client should keep retrying reconnecting until
1. Websocket connection closed with status code 1008. The status code means the connectionId has been removed from the service.
2. Reconnection failure keeps more than 1 minute.

## Publisher

Clients who send events to event handler or publish message to other clients are called publishers in the document. Publishers should set `ackId` to the message to get acknowledged from the service about whether the message publishing success or not. The `ackId` in message is the identifier of the message, which means different messages should use different `ackId`s, while resending message should keep the same `ackId` for the service to de-duplicate.

A sample group send message:
```json
{
    "type": "sendToGroup",
    "group": "group1",
    "dataType" : "text",
    "data": "text data",
    "ackId": 1
}
```

A sample ack response:
```json
{
    "type": "ack",
    "ackId": 1,
    "success": true
}
```

If the service returns ack with `success: true`, the message has been processed by the service and the client can expect the message will be delivered to all subscribers.

However, In some cases, Service meets some transient internal error and the message can't be sent to subscriber. In such case, publisher will receive an ack like following and should resend message with the same `ackId` if it's necessary based on business logic.
 
```json
{
    "type": "ack",
    "ackId": 1,
    "success": false,
    "error": {
        "name": "InternalServerError",
        "message": "Internal server error"
    }
}
```

![Message Failure](./media/howto-develop-reliable-clients/message-failed.png)

Service's ack may be dropped because of WebSockets connection dropped. So, publishers should get notified when Websocket connection drops and resend message with the same `ackId` after reconnection. If the message has actually processed by the service, it will response ack with `Duplicate` and publishers should stop resending this message again.

```json
{
    "type": "ack",
    "ackId": 1,
    "success": false,
    "error": {
        "name": "Duplicate",
        "message": "Message with ack-id: 1 has been processed"
    }
}
```

![Message duplicated](./media/howto-develop-reliable-clients/message-duplicated.png)

## Subscriber

Clients who receive messages sent from event handlers or publishers are called subscriber in the document. When connections drop by network issues, the service doesn't know how many messages are actually sent to subscribers. So subscribers should tell the service which message has been received. Data Messages contains `sequenceId` and subscribers must ack the sequence-id with sequence ack message:

A sample sequence ack:
```json
{
    "type": "sequenceAck",
    "sequenceId": 1
}
```

The sequence-id is a uint64 incremental number with-in a connection-id session. Subscribers should record the largest sequence-id it ever received and accept all messages with larger sequence-id and drop all messages with smaller or equal sequence-id. The sequence ack supports cumulative ack, which means if you ack `sequence-id=5`, the service will treat all messages with sequence-id smaller than 5 have already been received by subscribers. Subscribers should ack with the largest sequence-id it recorded, so that the service can skip redelivering messages that subscribers have already received.

All messages are delivered to subscribers in order until the WebSockets connection drops. With sequence-id, the service can have the knowledge about how many messages subscribers have actually received across WebSockets connections with-in a connection-id session. After a WebSockets connection drop, the service will redeliver messages it should deliver but not ack-ed by the subscriber. The service hold messages that are not ack-ed with limit, if messages exceed the limit, the service will close the WebSockets connection and remove the connection-id session. Thus, subscribers should ack the sequence-id as soon as possible.
