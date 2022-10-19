---
title: Reference - Azure Web PubSub supported JSON WebSocket subprotocol `json.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `json.webpubsub.azure.v1`
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 11/06/2021
---

#  Azure Web PubSub supported JSON WebSocket subprotocol
     
This document describes the subprotocol `json.webpubsub.azure.v1`.

When the client is using this subprotocol, both outgoing data frame and incoming data frame are expected to be **JSON** payloads.

## Overview

Subprotocol `json.webpubsub.azure.v1` empowers the clients to do publish/subscribe directly instead of a round trip to the upstream server. We call the WebSocket connection with `json.webpubsub.azure.v1` subprotocol a PubSub WebSocket client.

For example, in JS, a PubSub WebSocket client can be created using:
```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.webpubsub.azure.v1');
```
For a simple WebSocket client, the *server* is a MUST HAVE role to handle the events from clients. A simple WebSocket connection always triggers a `message` event when it sends messages, and always relies on the server-side to process messages and do other operations. With the help of the `json.webpubsub.azure.v1` subprotocol, an authorized client can join a group using [join requests](#join-groups) and publish messages to a group using [publish requests](#publish-messages) directly. It can also route messages to different upstream (event handlers) by customizing the *event* the message belongs using [event requests](#send-custom-events).

[!INCLUDE [reference-permission](includes/reference-permission.md)]

## Requests

[!INCLUDE [json-requests](includes/reference-json-requests.md)]

## Responses

Messages received by the client can be several types: `ack`, `message`, and `system`: 

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
}
```

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
