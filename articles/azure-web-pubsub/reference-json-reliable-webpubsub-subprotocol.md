---
title: Reference - Azure Web PubSub JSON WebSocket subprotocol `json.reliable.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `json.reliable.webpubsub.azure.v1`
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 01/09/2023
---

# Azure Web PubSub Reliable JSON WebSocket subprotocol

The JSON WebSocket subprotocol, `json.reliable.webpubsub.azure.v1`, enables the highly reliable exchange of publish/subscribe messages directly between clients through the service without a round trip to the upstream server.

This document describes the subprotocol `json.reliable.webpubsub.azure.v1`.

> [!NOTE]
> Reliable protocols are still in preview. Some changes are expected in the future.

When WebSocket client connections drop due to intermittent network issues, messages can be lost. In a pub/sub system, publishers are decoupled from subscribers and may not detect a subscribers' dropped connection or message loss. 

To overcome intermittent network issues and maintain reliable message delivery, you can use the Azure WebPubSub `json.reliable.webpubsub.azure.v1` subprotocol to create a *Reliable PubSub WebSocket client*.  

A *Reliable PubSub WebSocket client* can:

* recover a connection from intermittent network issues.
* recover from message loss.
* join a group using [join requests](#join-groups).
* leave a group using [leave requests](#leave-groups).
* publish messages directly to a group using [publish requests](#publish-messages).
* route messages directly to upstream event handlers using [event requests](#send-custom-events).

For example, you can create a *Reliable PubSub WebSocket client* with the following JavaScript code:

```js
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.reliable.webpubsub.azure.v1');
```

See [How to create reliable clients](./howto-develop-reliable-clients.md) to implement reconnection and message reliability for publisher and subscriber clients.

When the client is using this subprotocol, both outgoing and incoming data frames must contain JSON payloads.

[!INCLUDE [reference-permission](includes/reference-permission.md)]

## Requests

[!INCLUDE [json-requests](includes/reference-json-requests.md)]

### Sequence Ack

Format:

```json
{
    "type": "sequenceAck",
    "sequenceId": "<sequenceId>",
}
```

Reliable PubSub WebSocket client must send a sequence ack message once it receives a message from the service. For more information, see [How to create reliable clients](./howto-develop-reliable-clients.md#subscriber)
 
* `sequenceId` is an incremental uint64 number from the message received.

## Responses

Messages received by the client can be several types: `ack`, `message`, and `system`. Messages with type `message` have `sequenceId` property. Client must send a [Sequence Ack](#sequence-ack) to the service once it receives a message.

### Ack response

When the request contains `ackId`, the service will return an ack response for this request. The client implementation should handle this ack mechanism, including waiting for the ack response using an `async` `await` operation, and have a timeout handler when the ack response isn't received during a certain period.

Format:
```json
{
    "type": "ack",
    "ackId": 1, // The ack id for the request to ack
    "success": false, // true or false
    "error": {
        "name": "Forbidden|InternalServerError|Duplicate",
        "message": "<error_detail>"
    }
}
```

The client implementation SHOULD always check if the `success` is `true` or `false` first. Only when `success` is `false` the client reads from `error`.

### Message response

Clients can receive messages published from a group the client has joined or from the server, which, operating in a server management role, sends messages to specific clients or users.

1. The response message from a group:

    ```json
    {
        "sequenceId": 1,
        "type": "message",
        "from": "group",
        "group": "<group_name>",
        "dataType": "json|text|binary",
        "data" : {} // The data format is based on the dataType
        "fromUserId": "abc"
    }
    ```

1.  The response message from the server:

    ```json
    {
        "sequenceId": 1,
        "type": "message",
        "from": "server",
        "dataType": "json|text|binary",
        "data" : {} // The data format is based on the dataType
    }
    ```

#### Case 1: Sending data `Hello World` to the connection through REST API with `Content-Type`=`text/plain` 

* A simple WebSocket client receives a text WebSocket frame with data: `Hello World`;
* A PubSub WebSocket client receives the message in JSON:

    ```json
    {
        "sequenceId": 1,
        "type": "message",
        "from": "server",
        "dataType" : "text",
        "data": "Hello World", 
    }
    ```

#### Case 2: Sending data `{ "Hello" : "World"}` to the connection through REST API with `Content-Type`=`application/json`

* A simple WebSocket client receives a text WebSocket frame with stringified data: `{ "Hello" : "World"}`;
* A PubSub WebSocket client receives the message in JSON:

    ```json
    {
        "sequenceId": 1,
        "type": "message",
        "from": "server",
        "dataType" : "json",
        "data": {
            "Hello": "World"
        }
    }
    ```

If the REST API is sending a string `Hello World` using `application/json` content type, the simple WebSocket client receives the JSON string `"Hello World"` wrapped in `"`.

#### Case 3: Sending binary data to the connection through REST API with `Content-Type`=`application/octet-stream`

* A simple WebSocket client receives a binary WebSocket frame with the binary data.
* A PubSub WebSocket client receives the message in JSON:

    ```json
    {
        "sequenceId": 1,
        "type": "message",
        "from": "server",
        "dataType" : "binary",
        "data": "<base64_binary>"
    }
    ```

### System response

The Web PubSub service can return system-related responses to the client. 

#### Connected

The response to the client connect request:

```json
{
    "type": "system",
    "event": "connected",
    "userId": "user1",
    "connectionId": "abcdefghijklmnop",
    "reconnectionToken": "<token>"
}
```

`connectionId` and `reconnectionToken` are used for reconnection. Make connect request with uri for reconnection:

```
wss://<service-endpoint>/client/hubs/<hub>?awps_connection_id=<connectionId>&awps_reconnection_token=<reconnectionToken>
```

Find more details in [Connection Recovery](./howto-develop-reliable-clients.md#connection-recovery)

#### Disconnected

The response when the server closes the connection or when the service declines the client connection:

```json
{
    "type": "system",
    "event": "disconnected",
    "message": "reason"
}
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
