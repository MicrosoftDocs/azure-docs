---
title: Reference - Azure Web PubSub supported JSON WebSocket subprotocol `json.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `json.webpubsub.azure.v1`
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/16/2021
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

## Permissions

You may have noticed that when we describe the PubSub WebSocket clients, a client can publish to other clients only when it's *authorized* to. The `role`s of the client determines the *initial* permissions the client have:

| Role | Permission |
|---|---|
| Not specified | The client can send event requests.
| `webpubsub.joinLeaveGroup` | The client can join/leave any group.
| `webpubsub.sendToGroup` | The client can publish messages to any group.
| `webpubsub.joinLeaveGroup.<group>` | The client can join/leave group `<group>`.
| `webpubsub.sendToGroup.<group>` | The client can publish messages to group `<group>`.

The server-side can also grant or revoke permissions of the client dynamically through REST APIs or server SDKs.

## Requests

### Join groups

Format:

```json
{
    "type": "joinGroup",
    "group": "<group_name>",
    "ackId" : 1 // optional
}
```

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

### Leave groups

Format:

```json
{
    "type": "leaveGroup",
    "group": "<group_name>",
    "ackId" : 1 // optional
}
```

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

### Publish messages

Format:

```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "ackId" : 1, // optional
    "dataType" : "json|text|binary",
    "data": {}, // data can be string or valid json token depending on the dataType 
}
```

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

`dataType` can be one of `json`, `text`, or `binary`:
* `json`: `data` can be any type that JSON supports and will be published as what it is; If `dataType` isn't specified, it defaults to `json`.
* `text`: `data` should be in string format, and the string data will be published;
* `binary`: `data` should be in base64 format, and the binary data will be published;

#### Case 1: publish text data:
```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "dataType" : "text",
    "data": "text data" 
}
```

* What subprotocol client in this group `<group_name>` receives:
```json
{
    "type": "message",
    "from": "group",
    "group": "<group_name>",
    "dataType" : "text",
    "data" : "text data"
}
```
* What the raw client in this group `<group_name>` receives is string data `text data`.

#### Case 2: publish JSON data:
```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "dataType" : "json",
    "data": {
        "hello": "world"
    }
}
```

* What subprotocol client in this group `<group_name>` receives:
```json
{
    "type": "message",
    "from": "group",
    "group": "<group_name>",
    "dataType" : "json",
    "data" : {
        "hello": "world"
    }
}
```
* What the raw client in this group `<group_name>` receives is serialized string data `{"hello": "world"}`.


#### Case 3: publish binary data:
```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "dataType" : "binary",
    "data": "<base64_binary>"
}
```

* What subprotocol client in this group `<group_name>` receives:
```json
{
    "type": "message",
    "from": "group",
    "group": "<group_name>",
    "dataType" : "binary",
    "data" : "<base64_binary>", 
}
```
* What the raw client in this group `<group_name>` receives is the **binary** data in the binary frame.

### Send custom events

Format:

```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "json|text|binary",
    "data": {}, // data can be string or valid json token depending on the dataType 
}
```

`dataType` can be one of `text`, `binary`, or `json`:
* `json`: data can be any type json supports and will be published as what it is; If `dataType` is not specified, it defaults to `json`.
* `text`: data should be in string format, and the string data will be published;
* `binary`: data should be in base64 format, and the binary data will be published;

#### Case 1: send event with text data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "text",
    "data": "text data", 
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `text/plain` for `dataType`=`text`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: text/plain
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>

text data

```

#### Case 2: send event with JSON data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "json",
    "data": {
        "hello": "world"
    }, 
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `application/json` for `dataType`=`json`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>

{
    "hello": "world"
}

```

#### Case 3: send event with binary data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "binary",
    "data": "base64_binary", 
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `application/octet-stream` for `dataType`=`binary`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/octet-stream
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>

binary

```

The WebSocket frame can be `text` format for text message frames or UTF8 encoded binaries for `binary` message frames.

Service declines the client if the message does not match the described format.

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
        "name": "Forbidden|InternalServerError|Duplicate|InvocationFailed",
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