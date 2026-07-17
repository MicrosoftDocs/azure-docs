---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 01/24/2023
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

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. For details, see  [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

### Leave groups

Format:

```json
{
    "type": "leaveGroup",
    "group": "<group_name>",
    "ackId" : 1
}
```

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. For details, see [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

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

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. For details, see [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)
* `noEcho` is optional. If set to true, this message isn't echoed back to the same connection. If not set, the default value is false.
* `dataType` can be set to `json`, `text`, or `binary`:
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

* The subprotocol clients in `<group_name>` receive:

```json
{
    "type": "message",
    "from": "group",
    "group": "<group_name>",
    "dataType" : "text",
    "data" : "text data"
}
```

* The simple WebSocket clients in `<group_name>` receive the string `text data`.

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

* The subprotocol clients in `<group_name>` receive:

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

* The simple WebSocket clients in `<group_name>` receive the serialized string `{"hello": "world"}`.

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

* The subprotocol clients in `<group_name>` receive:

```json
{
    "type": "message",
    "from": "group",
    "group": "<group_name>",
    "dataType" : "binary",
    "data" : "<base64_binary>", 
}
```

* The simple WebSocket clients in `<group_name>` receive the **binary** data in the binary frame.

### Start streaming messages

To start a group stream, send a `sendToGroup` request with the `stream` property. A stream start request doesn't contain `data`, `dataType`, or `ackId`.

Format:

```json
{
    "type": "sendToGroup",
    "group": "<group_name>",
    "noEcho": true|false,
    "stream": {
        "streamId": "<stream_id>",
        "idleTimeoutMs": 300000
    }
}
```

* `stream.streamId` is the identifier of the logical stream. It must be a non-empty string and must be unique among active streams on the same client connection. Client libraries are recommended to generate a globally unique value, such as a GUID or UUID.
* `stream.idleTimeoutMs` is optional. If specified, it must be greater than `0`. If omitted, the service default is `300000` milliseconds. The value is an idle timeout, not a total stream lifetime. Send stream data, send a stream keepalive, or end the stream before this timeout elapses when the application needs to keep the stream open.
* `noEcho` is optional. If set to true, stream messages aren't echoed back to the same connection. If not set, the default value is false.

When the stream is accepted, the client receives a [stream ack response](#stream-ack-response) with `expectedSequenceId` set to `1`.

### Send streaming data

To send stream data, send a `streamData` request with `streamId`, `streamSequenceId`, `dataType`, and `data`.

Format:

```json
{
    "type": "streamData",
    "streamId": "<stream_id>",
    "streamSequenceId": 1,
    "dataType" : "json|text|binary",
    "data": {}
}
```

* `streamId` identifies an active stream on the same client connection.
* `streamSequenceId` is a positive uint64 number. The first data fragment in a stream uses `1`, and each following data fragment for the same `streamId` increases by exactly `1`.
* `dataType` can be set to `json`, `text`, or `binary`, with the same data encoding rules as [publish messages](#publish-messages).

To keep a stream active without delivering data to subscribers, send a `streamData` request with only `type` and `streamId`.

```json
{
    "type": "streamData",
    "streamId": "<stream_id>"
}
```

### End streaming messages

To end a stream, send a `streamEnd` request.

Format:

```json
{
    "type": "streamEnd",
    "streamId": "<stream_id>"
}
```

To end a stream with an application-defined error, include the optional `error` property.

```json
{
    "type": "streamEnd",
    "streamId": "<stream_id>",
    "error": {
        "message": "<error_detail>",
        "userErrorCode": "<application_error_code>"
    }
}
```

* `error.message` is an optional human-readable error message.
* `error.userErrorCode` is an optional application-defined error code.

When the stream is closed, the publisher receives a [stream closed response](#stream-closed-response).

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

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. For details, see [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

`dataType` can be one of `text`, `binary`, or `json`:

* `json`: data can be any type json supports and will be published as what it is; The default is `json`.
* `text`: data is in string format, and the string data will be published;
* `binary`: data is in base64 format, and the binary data will be published;

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

The upstream event handler receives data similar to:

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

The `Content-Type` for the CloudEvents HTTP request is `text/plain` when `dataType` is `text`.

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

The upstream event handler receives data similar to:

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

The `Content-Type` for the CloudEvents HTTP request is `application/json` when `dataType` is `json`

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

The upstream event handler receives data similar to:

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

The `Content-Type` for the CloudEvents HTTP request is `application/octet-stream` when `dataType` is `binary`.  The WebSocket frame can be `text` format for text message frames or UTF8 encoded binaries for `binary` message frames.

The Web PubSub service declines the client if the message doesn't match the described format.

### Ping

Format:

```json
{
    "type": "ping",
}
```

The client can send a `ping` message to the service to enable the Web PubSub service to detect the client's liveness.
