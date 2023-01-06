---
title: Create reliable Websocket clients
description: How to create reliable Websocket clients
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: reference 
ms.date: 01/08/2023
---

# Create reliable Websocket with subprotocol

When Websocket client connections drop due to intermittent network issues, messages can be lost. In a pub/sub system, publishers are decoupled from subscribers, so publishers may not detect a subscribers' dropped connection or message loss. It's crucial for clients to overcome intermittent network issues and maintain reliable message delivery. To achieve that, you can create a reliable Websocket client with the help of reliable Azure Web PubSub subprotocols.

> [!NOTE]
> Reliable protocols are still in preview. Some changes are expected in future.

## Reliable Protocol

The Web PubSub service supports two reliable subprotocols `json.reliable.webpubsub.azure.v1` and `protobuf.reliable.webpubsub.azure.v1`. Clients must follow the reconnection, publisher and subscriber parts of the protocol to achieve the reliability.  Failing to follow the subprotocols, the message delivery may not work as expected or the service may terminate the client as it violates the protocol spec.

## Initialization

To use reliable subprotocols, you must set the subprotocol when constructing Websocket connections. In JavaScript, you can use the following command:

- Use Json reliable subprotocol

    ```js
    var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.reliable.webpubsub.azure.v1');
    ```

- Use Protobuf reliable subprotocol

    ```js
    var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.reliable.webpubsub.azure.v1');
    ```

## Reconnection

Websocket connections rely on TCP, so if the connection doesn't drop, all messages should be lossless and in order. When facing network issues and connection drops, all the status, such as group and message info, are kept by the Web PubSub service for reconnection. A Websocket connection owns a session in the service and the identifier is `connectionId`. Reconnection is the basis of achieving reliability and must be implemented. When the client reconnects to the service using reliable subprotocols, the client will receive a `Connected` message containing the  `connectionId` and `reconnectionToken`.

```json
{
    "type":"system",
    "event":"connected",
    "connectionId": "<connection_id>",
    "reconnectionToken": "<reconnection_token>"
}
```

Once the WebSocket connection drops, the client should first try to reconnect with the same `connectionId` to keep the session. Clients don't need to negotiate with server and obtain the `access_token`. Instead, reconnection should make a websocket connect request to service directly with `connection_id` and `reconnection_token` with the following uri:

```text
wss://<service-endpoint>/client/hubs/<hub>?awps_connection_id=<connection_id>&awps_reconnection_token=<reconnection_token>
```

Reconnection may fail if the network issue hasn't been recovered yet. The client should keep retrying to reconnect until:

1. The Websocket connection is closed with status code 1008. The status code means the connectionId has been removed from the service.
2. A reconnection failure continues to occur for more than 1 minute.

## Publisher

Clients that send events to event handler or publish messages to other clients are called publishers. Publishers should set `ackId` in the message to receive an acknowledgment from the Web PubSub service that publishing the message was successful or not. The `ackId` in message is the identifier of the message, each new message should use a unique ID.  The original `ackId` should be used when resending a message.

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

When the Web PubSub service returns an ack response with `success: true`, the message has been processed by the service, and the client can expect the message will be delivered to all subscribers.

When the service meets some transient internal error and the message can't be sent to subscriber, the publisher will receive an ack with `success: false`.  The publisher should read the error.  If the message is resent, the same `ackId` should be used.

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

When the service's ack response is dropped because the WebSockets connection dropped, the publisher should resend message with the same `ackId` after reconnection. When the message has previously processed by the service, it will send an ack containing a `Duplicate` error and the publisher should stop resending this message.

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

Clients that receive messages from event handlers or publishers are called subscribers. When connections drop due to network issues, the Web PubSub service doesn't know how many messages were sent to subscribers. To determine the last message received by the subscriber, the service sends a data message containing a `sequenceId`. The subscriber responds with a sequence ack message:

A sample sequence ack:

```json
{
    "type": "sequenceAck",
    "sequenceId": 1
}
```

The `sequenceId` is a uint64 incremental number in a connection-id session. Subscribers should record the largest `sequenceId` it received, accept all messages with larger `sequenceId`, and drop all messages with smaller or equal `sequenceId`. The sequence ack supports cumulative ack, which means if you ack `sequenceId: 5`, the service will treat all messages with `sequenceId` smaller than 5 have already been received by the subscriber. The subscriber should ack with the largest `sequenceId` it recorded, so that the service can skip redelivering messages that subscribers have already received.

All messages are delivered to subscribers in order until the WebSockets connection drops. With `sequenceId`, the service can know about how many messages subscribers have received across WebSockets connections in a connection-id session. After a WebSockets connection drops, the service will redeliver messages not acknowledged by the subscriber. The service stores a limited number of unacknowledged messages. When the number of messages exceed the limit, the service will close the WebSockets connection and remove the connection-id session. Thus, subscribers should ack the `sequenceId` as soon as possible.
