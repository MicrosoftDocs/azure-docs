---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 08/06/2021
---

### Join groups

Format:

```json
{
    "type": "joinGroup",
    "group": "<group_name>",
    "ackId" : 1
}
```

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

### Leave groups

Format:

```json
{
    "type": "leaveGroup",
    "group": "<group_name>",
    "ackId" : 1
}
```

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

### Publish messages

Format:

```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "ackId" : 1,
    "noEcho": true|false,
    "dataType" : "json|text|binary",
    "data": {}, // data can be string or valid json token depending on the dataType 
}
```

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)
* `noEcho` is optional. If set to true, this message is not echoed back to the same connection. If not set, the default value is false.
* `dataType` can be one of `json`, `text`, or `binary`:
     * `json`: `data` can be any type that JSON supports and will be published as what it is; If `dataType` isn't specified, it defaults to `json`.
     * `text`: `data` should be in string format, and the string data will be published;
     * `binary`: `data` should be in base64 format, and the binary data will be published;

#### Case 1: publish text data:
```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "dataType" : "text",
    "data": "text data",
    "ackId": 1
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
    "data": "<base64_binary>",
    "ackId": 1
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
    "ackId": 1,
    "dataType" : "json|text|binary",
    "data": {}, // data can be string or valid json token depending on the dataType 
}
```

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

`dataType` can be one of `text`, `binary`, or `json`:
* `json`: data can be any type json supports and will be published as what it is; If `dataType` is not specified, it defaults to `json`.
* `text`: data should be in string format, and the string data will be published;
* `binary`: data should be in base64 format, and the binary data will be published;

#### Case 1: send event with text data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "ackId": 1,
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
    "ackId": 1,
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
    "ackId": 1,
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