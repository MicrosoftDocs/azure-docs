---
title: Reference - Azure Web PubSub supported Protobuf WebSocket subprotocol `protobuf.webpubsub.azure.v1`
description: The reference describes Azure Web PubSub supported WebSocket subprotocol `protobuf.webpubsub.azure.v1`
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/31/2021
---

#  Azure Web PubSub supported Protobuf WebSocket subprotocol
     
This document describes the subprotocol `protobuf.webpubsub.azure.v1`.

When the client is using this subprotocol, both outgoing data frame and incoming data frame are expected to be **protobuf** payloads.

## Overview

Subprotocol `protobuf.webpubsub.azure.v1` empowers the clients to do publish/subscribe directly instead of a round trip to the upstream server. We call the WebSocket connection with `protobuf.webpubsub.azure.v1` subprotocol a PubSub WebSocket client.

For example, in JS, a PubSub WebSocket client with Protobuf subprotocol can be created using:
```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.webpubsub.azure.v1');
```
For a simple WebSocket client, the *server* is a MUST HAVE role to handle the events from clients. A simple WebSocket connection always triggers a `message` event when it sends messages, and always relies on the server-side to process messages and do other operations. With the help of the `protobuf.webpubsub.azure.v1` subprotocol, an authorized client can join a group using [join requests](#join-groups) and publish messages to a group using [publish requests](#publish-messages) directly. It can also route messages to different upstream (event handlers) by customizing the *event* the message belongs using [event requests](#send-custom-events).

> [!NOTE]
> Currently, WebPubSub Service only support [proto3](https://developers.google.com/protocol-buffers/docs/proto3).

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

All request messages follow the following protobuf format.

```protobuf
syntax = "proto3";

import "google/protobuf/any.proto";

message UpstreamMessage {
    oneof message {
        SendToGroupMessage send_to_group_message = 1;
        EventMessage event_message = 5;
        JoinGroupMessage join_group_message = 6;
        LeaveGroupMessage leave_group_message = 7;
    }

    message SendToGroupMessage {
        string group = 1;
        optional int32 ack_id = 2;
        MessageData data = 3;
    }

    message EventMessage {
        string event = 1;
        MessageData data = 2;
    }
    
    message JoinGroupMessage {
        string group = 1;
        optional int32 ack_id = 2;
    }

    message LeaveGroupMessage {
        string group = 1;
        optional int32 ack_id = 2;
    }
}

message MessageData {
    oneof data {
        string text_data = 1;
        bytes binary_data = 2;
        google.protobuf.Any protobuf_data = 3;
    }
}
```

### Join groups

Format:

Set `join_group_message.group` to the group name.

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

### Leave groups

Format:

Set `leave_group_message.group` to the group name.

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

### Publish messages

Format:

* `ackId` is optional, it's an incremental integer for this command message. When the `ackId` is specified, the service sends a [ack response message](#ack-response) back to the client when the command is executed.

There's an implicit `dataType` which can be one of `protobuf`, `text`, or `binary`, base on the `data` in `MessageData` you set. The receiver clients can leverage the `dataType` to handle the content correctly.

* `protobuf`: If you set `send_to_group_message.data.protobuf_data`, the implicit is `protobuf`. `protobuf_data` can be in [Any](https://developers.google.com/protocol-buffers/docs/proto3#any) type. All other clients will receive protobuf encoded binary which can be deserialized by protobuf SDK. In clients that only support text-based content(e.g. `json.webpubsub.azure.v1`), they will receive base64 encoded binary;

* `text`: If you set `send_to_group_message.data.text_data`, the implicit is `text`. `text_data` should be a string. All clients with other protocol will receive a UTF-8 encoded string;

* `binary`: If you set `send_to_group_message.data.binary_data`, the implicit is `binary`. `binary_data` should be a byte array. All clients with other protocol will receive a raw binary without protobuf encoded. In clients that only support text-based content(e.g. `json.webpubsub.azure.v1`), they will receive base64 encoded binary;

#### Case 1: publish text data:

Set `send_to_group_message.group` to `group` and `send_to_group_message.data.text_data` to `"text data"`.

* what protobuf subprotocol client in this group `group` receives the binary frame and can use the [DownstreamMessage](#responses) to deserialize.

* What json subprotocol client in this group `group` receives:

```json
{
    "type": "message",
    "from": "group",
    "group": "group",
    "dataType" : "text",
    "data" : "text data"
}
```

* What the raw client in this group `group` receives is string data `text data`.

#### Case 2: publish protobuf data:

Assume you have a customer message:

```
message MyMessage {
    int32 value = 1;
}
```

Set `send_to_group_message.group` to `group` and `send_to_group_message.data.protobuf_data` to `Any.pack(MyMessage)` with `value = 1`

* what protobuf subprotocol client in this group `group` receives the binary frame and can use the [DownstreamMessage](#responses) to deserialize.

* What subprotocol client in this group `group` receives:

```json
{
    "type": "message",
    "from": "group",
    "group": "G",
    "dataType" : "protobuf",
    "data" : "Ci90eXBlLmdvb2dsZWFwaXMuY29tL2F6dXJlLndlYnB1YnN1Yi5UZXN0TWVzc2FnZRICCAE=" // Base64 encoded bytes
}
```

Note the data is a base64 encoded deserializeable protobuf binary. You can use the following protobuf definition and use `Any.unpack()` to deserialize it:

```protobuf
syntax = "proto3";

message MyMessage {
    int32 value = 1;
}
```

* What the raw client in this group `group` receives is the binary frame.

```
# Show in Hex
0A 2F 74 79 70 65 2E 67 6F 6F 67 6C 65 61 70 69 73 2E 63 6F 6D 2F 61 7A 75 72 65 2E 77 65 62 70 75 62 73 75 62 2E 54 65 73 74 4D 65 73 73 61 67 65 12 02 08 01
```

#### Case 3: publish binary data:

Set `send_to_group_message.group` to `group` and `send_to_group_message.data.binary_data` to `[1, 2, 3]`.

* what protobuf subprotocol client in this group `group` receives the binary frame and can use the [DownstreamMessage](#responses) to deserialize.

* What json subprotocol client in this group `group` receives:

```json
{
    "type": "message",
    "from": "group",
    "group": "group",
    "dataType" : "binary",
    "data" : "AQID", // Base64 encoded [1,2,3]
}
```

As json subprotocol client only support text-based message, binary always encode with base64.

* What the raw client in this group `group` receives is the **binary** data in the binary frame.

```
# Show in Hex
01 02 03
```

### Send custom events

There's an implicit `dataType` which can be one of `protobuf`, `text`, or `binary`, base on the dataType you set. The receiver clients can leverage the `dataType` to handle the content correctly.

* `protobuf`: If you set `event_message.data.protobuf_data`, the implicit is `protobuf`. `protobuf_data` can be any supported protobuf type. Event handler will receive protobuf encoded binary which can be deserialized by any protobuf SDK.

* `text`: If you set `event_message.data.text_data`, the implicit is `text`. `text_data` should be a string. Event handler will receive a UTF-8 encoded string;

* `binary`: If you set `event_message.data.binary_data`, the implicit is `binary`. `binary_data` should be a byte array. Event handler will receive raw binary frame

#### Case 1: send event with text data:

Set `event_message.data.text_data` to `"text data"`.

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

#### Case 2: send event with protobuf data:

Assume you have a customer message:

```
message MyMessage {
    int32 value = 1;
}
```

Set `event_message.data.protobuf_data` to `any.pack(MyMessage)` with `value = 1`

What the upstream event handler receives like below, please note that the `Content-Type` for the CloudEvents HTTP request is `application/x-protobuf` for `dataType`=`protobuf`

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

// Just show in hex, you need to read as binary
0A 2F 74 79 70 65 2E 67 6F 6F 67 6C 65 61 70 69 73 2E 63 6F 6D 2F 61 7A 75 72 65 2E 77 65 62 70 75 62 73 75 62 2E 54 65 73 74 4D 65 73 73 61 67 65 12 02 08 01
```

The data is a valid protobuf binary. You can use the following `proto` and `any.unpack()` to deserialize it:

```protobuf
syntax = "proto3";

message MyMessage {
    int32 value = 1;
}
```

#### Case 3: send event with binary data:

Set `send_to_group_message.binary_data` to `[1, 2, 3]`.

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

// Just show in hex, you need to read as binary
01 02 03 
```

The WebSocket frame can be `text` format for text message frames or UTF8 encoded binaries for `binary` message frames.

Service declines the client if the message does not match the described format.

## Responses

All response messages follow the following protobuf format:

```protobuf
message DownstreamMessage {
    oneof message {
        AckMessage ack_message = 1;
        DataMessage data_message = 2;
        SystemMessage system_message = 3;
    }
    
    message AckMessage {
        int32 ack_id = 1;
        bool success = 2;
        optional ErrorMessage error = 3;
    
        message ErrorMessage {
            string name = 1;
            string message = 2;
        }
    }

    message DataMessage {
        string from = 1;
        optional string group = 2;
        MessageData data = 3;
    }

    message SystemMessage {
        oneof message {
            ConnectedMessage connected_message = 1;
            DisconnectedMessage disconnected_message = 2;
        }
    
        message ConnectedMessage {
            string connection_id = 1;
            string user_id = 2;
        }

        message DisconnectedMessage {
            string reason = 2;
        }
    }
}
```

Messages received by the client can be several types: `ack`, `message`, and `system`: 

### Ack response

If the request contains `ackId`, the service will return an ack response for this request. The client implementation should handle this ack mechanism, including waiting for the ack response for an `async` `await` operation, and having a timeout check when the ack response is not received during a certain period.

The client implementation SHOULD always check if the `success` is `true` or `false` first. Only when `success` is `false` the client reads from `error`.

### Message response

Clients can receive messages published from one group the client joined, or from the server management role that the server sends messages to the specific client or the specific user.

You will always get a `DownstreamMessage.DataMessage`

- When the message is from a group, `from` will be `group`. When the message is from the server. `from` will be `server`

- When the message is from a group, `group` will be the group name.

- The sender's `dateType` will cause in one of the messages being set. If `dateType` is `text`, you should use `message_response_message.data.text_data`. If `dateType` is `binary`, you should use `message_response_message.data.binary_data`. If `dateType` is `protobuf`, you should use `message_response_message.data.protobuf_data`. If `dateType` is `json`, you should use `message_response_message.data.text_data` and the content is serialized json string.

### System response

The Web PubSub service can also send system-related responses to the client. 

#### Connected

When the connection connects to service. You will receive a `DownstreamMessage.SystemMessage.ConnectedMessage`

#### Disconnected

When the server closes the connection, or when the service declines the client. You will receive a `DownstreamMessage.SystemMessage.DisconnectedMessage`

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]