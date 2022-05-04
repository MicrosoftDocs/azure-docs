---
title: Reference - Azure Web PubSub supported JSON WebSocket subprotocol `json.reliable.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `json.reliable.webpubsub.azure.v1`
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 11/06/2021
---

#  Azure Web PubSub supported Reliable JSON WebSocket subprotocol
     
This document describes the subprotocol `json.reliable.webpubsub.azure.v1`.

When the client is using this subprotocol, both outgoing data frame and incoming data frame are expected to be **JSON** payloads.

> [!NOTE]
> Reliable protocols are still in preview. Some changes are expected in future.

## Overview

Subprotocol `json.reliable.webpubsub.azure.v1` empowers the client to have a high reliable message delivery experience under network issues and do a publish-subscribe (PubSub) directly instead of doing a round trip to the upstream server. The WebSocket connection with the `json.reliable.webpubsub.azure.v1` subprotocol is called a Reliable PubSub WebSocket client.

For example, in JS, a Reliable PubSub WebSocket client can be created using:
```js
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.reliable.webpubsub.azure.v1');
```

When using `json.reliable.webpubsub.azure.v1` subprotocol, the client must follow the [How to create reliable clients](./howto-develop-reliable-clients.md) to implement reconnection, publisher and subscriber.

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

Reliable PubSub WebSocket client must send sequence ack message once it received a message from the service. Find more in [How to create reliable clients](./howto-develop-reliable-clients.md#subscriber)
 
* `sequenceId` is a incremental uint64 number from the message received.

## Responses

Messages received by the client can be several types: `ack`, `message`, and `system`. Messages with type `message` have `sequenceId` property. Client must send [Sequence Ack](#sequence-ack) to the service once it receives a message.

### Ack response

If the request contains `ackId`, the service will return an ack response for this request. The client implementation should handle this ack mechanism, including waiting for the ack response for an `async` `await` operation, and having a timeout check when the ack response is not received during a certain period.

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

Clients can receive messages published from one group the client joined, or from the server management role that the server sends messages to the specific client or the specific user.

1. When the message is from a group

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

1. When The message is from the server.

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
* What a simple WebSocket client receives is a text WebSocket frame with data: `Hello World`;
* What a PubSub WebSocket client receives is as follows:
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
* What a simple WebSocket client receives is a text WebSocket frame with stringified data: `{ "Hello" : "World"}`;
* What a PubSub WebSocket client receives is as follows:
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

If the REST API is sending a string `Hello World` using `application/json` content type, what the simple WebSocket client receives is a JSON string, which is `"Hello World"` that wraps the string with `"`.

#### Case 3: Sending binary data to the connection through REST API with `Content-Type`=`application/octet-stream`
* What a simple WebSocket client receives is a binary WebSocket frame with the binary data.
* What a PubSub WebSocket client receives is as follows:
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

The Web PubSub service can also send system-related responses to the client. 

#### Connected

When the connection connects to service.

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

Find more details in [Reconnection](./howto-develop-reliable-clients.md#reconnection)

#### Disconnected

When the server closes the connection, or when the service declines the client.

```json
{
    "type": "system",
    "event": "disconnected",
    "message": "reason"
}
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
