---
title: Reference - Azure Web PubSub supported JSON WebSocket subprotocol `json.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `json.webpubsub.azure.v1`
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: reference 
ms.date: 01/09/2023
---

# Azure Web PubSub supported JSON WebSocket subprotocol

The JSON WebSocket subprotocol, `json.webpubsub.azure.v1`, enables the exchange of publish/subscribe messages between clients through the service without a round trip to the upstream server.  A WebSocket connection using the `json.webpubsub.azure.v1` subprotocol is called a *PubSub WebSocket client*.


## Overview

A simple WebSocket connection triggers a `message` event when it sends messages and relies on the server-side to process messages and do other operations. 

With the `json.webpubsub.azure.v1` subprotocol, you can create *PubSub WebSocket clients* that can:

* join a group using [join requests](#join-groups).
* publish messages directly to a group using [publish requests](#publish-messages).
* route messages to different upstream event handlers using [event requests](#send-custom-events).

For example, you can create a *PubSub WebSocket client* with the following JavaScript code:

```javascript
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.webpubsub.azure.v1');
```

This document describes the subprotocol `json.webpubsub.azure.v1` requests and responses.  Both incoming and outgoing data frames must contain JSON payloads.

[!INCLUDE [reference-permission](includes/reference-permission.md)]

## Requests

[!INCLUDE [json-requests](includes/reference-json-requests.md)]

## Responses

Message types received by the client can be:

* ack - The response to a request containing an `ackId`.
* message - Messages from the group or server.
* system - Messages from the Web PubSub service.

### Ack response

When the client request contains `ackId`, the service will return an ack response for the request. The client should handle the ack mechanism, by waiting for the ack response with an `async` `await` operation and using a timeout operation when the ack response isn't received in a certain period.

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

The client implementation SHOULD always check if the `success` is `true` or `false` first, then only read the error when `success` is `false`.

### Message response

Clients can receive messages published from a group the client has joined or from the server, which, operating in a server management role, sends messages to specific clients or users. 

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

1. When the message is from the server.

    ```json
    {
        "type": "message",
        "from": "server",
        "dataType": "json|text|binary",
        "data" : {} // The data format is based on the dataType
    }
    ```

#### Case 1: Sending data `Hello World` to the connection through REST API with `Content-Type`=`text/plain` 

* A simple WebSocket client receives a text WebSocket frame with data: `Hello World`;
* A PubSub WebSocket client receives:

    ```json
    {
        "type": "message",
        "from": "server",
        "dataType" : "text",
        "data": "Hello World", 
    }
    ```

#### Case 2: Sending data `{ "Hello" : "World"}` to the connection through REST API with `Content-Type`=`application/json`

* A simple WebSocket client receives a text WebSocket frame with stringified data: `{ "Hello" : "World"}`.
* A PubSub WebSocket client receives:

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

If the REST API is sending a string `Hello World` using `application/json` content type, the simple WebSocket client receives a JSON string, which is `"Hello World"` wrapped with double quotes (`"`).

#### Case 3: Sending binary data to the connection through REST API with `Content-Type`=`application/octet-stream`

* A simple WebSocket client receives a binary WebSocket frame with the binary data.
* A PubSub WebSocket client receives:

    ```json
    {
        "type": "message",
        "from": "server",
        "dataType" : "binary",
        "data": "<base64_binary>"
    }
    ```

### System response

The Web PubSub service sends system-related messages to clients. 

#### Connected

The message sent to the client when the client successfully connects:

```json
{
    "type": "system",
    "event": "connected",
    "userId": "user1",
    "connectionId": "abcdefghijklmnop",
}
```

#### Disconnected

The message sent to the client when the server closes the connection, or when the service declines the client.

```json
{
    "type": "system",
    "event": "disconnected",
    "message": "reason"
}
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
