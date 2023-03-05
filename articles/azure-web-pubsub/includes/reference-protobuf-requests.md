---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 01/24/2023
---

### Join groups

Format:

Set `join_group_message.group` to the group name.

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

### Leave groups

Format:

Set `leave_group_message.group` to the group name.

* `ackId` is the identity of each request and should be unique. The service sends a [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

### Publish messages

Format:

* `ackId`: The unique identity of each request. The service sends an [ack response message](#ack-response) to notify the process result of the request. More details can be found at [AckId and Ack Response](../concept-client-protocols.md#ackid-and-ack-response)

* `dataType`:  The data format, which can be `protobuf`, `text`, or `binary` depending on the `data` in `MessageData`. The receiving clients can use `dataType` to correctly process the content.

* `protobuf`: When you set `send_to_group_message.data.protobuf_data`, the implicit `dataType` is `protobuf`. `protobuf_data` can be of the [Any](https://developers.google.com/protocol-buffers/docs/proto3#any) message type. All other clients receive a protobuf-encoded binary, which can be deserialized by the protobuf SDK. Clients that support only text-based content (for example, `json.webpubsub.azure.v1`) receive a Base64-encoded binary.

* `text`: When you set `send_to_group_message.data.text_data`, the implicit `dataType` is `text`. `text_data` should be a string. All clients with other protocols receive a UTF-8-encoded string.

* `binary`: When you set `send_to_group_message.data.binary_data`, the implicit `dataType` is `binary`. `binary_data` should be a byte array. All clients with other protocols receive a raw binary without protobuf encoding. Clients that support only text-based content (for example, `json.webpubsub.azure.v1`) receive a Base64-encoded binary.

#### Case 1: Publish text data

Set `send_to_group_message.group` to `group`, and set `send_to_group_message.data.text_data` to `"text data"`.

* The protobuf subprotocol client in group `group` receives the binary frame and can use [DownstreamMessage](#responses) to deserialize it.

* The JSON subprotocol clients in `group` receive:

    ```json
    {
        "type": "message",
        "from": "group",
        "group": "group",
        "dataType" : "text",
        "data" : "text data"
    }
    ```

* The simple WebSocket clients in `group` receive string `text data`.

#### Case 2: Publish protobuf data

Let's assume that you have a custom message:

```
message MyMessage {
    int32 value = 1;
}
```

Set `send_to_group_message.group` to `group` and `send_to_group_message.data.protobuf_data` to `Any.pack(MyMessage)` with `value = 1`.

* The protobuf subprotocol clients in `group` receive the binary frame and can use [DownstreamMessage](#responses) to deserialize it.

* The subprotocol client in `group` receives:

    ```json
    {
        "type": "message",
        "from": "group",
        "group": "G",
        "dataType" : "protobuf",
        "data" : "Ci90eXBlLmdvb2dsZWFwaXMuY29tL2F6dXJlLndlYnB1YnN1Yi5UZXN0TWVzc2FnZRICCAE=" // Base64-encoded bytes
    }
    ```

    > [!NOTE]
    > The data is a Base64-encoded, deserializeable protobuf binary. 

You can use the following protobuf definition and use `Any.unpack()` to deserialize it:

```protobuf
syntax = "proto3";

message MyMessage {
    int32 value = 1;
}
```

* The simple WebSocket clients in `group` receive the binary frame:

    ```
    # Show in hexadecimal
    0A 2F 74 79 70 65 2E 67 6F 6F 67 6C 65 61 70 69 73 2E 63 6F 6D 2F 61 7A 75 72 65 2E 77 65 62 70 75 62 73 75 62 2E 54 65 73 74 4D 65 73 73 61 67 65 12 02 08 01
    ```

#### Case 3: Publish binary data

Set `send_to_group_message.group` to `group`, and set `send_to_group_message.data.binary_data` to `[1, 2, 3]`.

* The protobuf subprotocol client in group `group` receives the binary frame and can use [DownstreamMessage](#responses) to deserialize it.

* The JSON subprotocol client in group `group` receives:

    ```json
    {
        "type": "message",
        "from": "group",
        "group": "group",
        "dataType" : "binary",
        "data" : "AQID", // Base64-encoded [1,2,3]
    }
    ```

    Because the JSON subprotocol client supports only text-based messaging, the binary is always Base64-encoded.

* The simple WebSocket clients in `group` receive the binary data in the binary frame:

    ```
    # Show in hexadecimal
    01 02 03
    ```

### Send custom events

There's an implicit `dataType`, which can be `protobuf`, `text`, or `binary`, depending on the `dataType` you set. The receiver clients can use `dataType` to handle the content correctly.

* `protobuf`: When you set `event_message.data.protobuf_data`, the implicit `dataType` is `protobuf`. The `protobuf_data` value can be any supported protobuf type. The event handler receives the protobuf-encoded binary, which can be deserialized by any protobuf SDK.

* `text`: When you set `event_message.data.text_data`, the implicit `dataType` is `text`. The `text_data` value should be a string. The event handler receives a UTF-8-encoded string.

* `binary`: When you set `event_message.data.binary_data`, the implicit `dataType` is `binary`. The `binary_data` value should be a byte array. The event handler receives the raw binary frame.

#### Case 1: Send an event with text data

Set `event_message.data.text_data` to `"text data"`.

The upstream event handler receives a request similar to: 

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

The `Content-Type` for the CloudEvents HTTP request is `text/plain`, where `dataType`=`text`.

#### Case 2: Send an event with protobuf data

Assume that you've received the following customer message:

```
message MyMessage {
    int32 value = 1;
}
```

Set `event_message.data.protobuf_data` to `any.pack(MyMessage)` with `value = 1`

The upstream event handler receives a request that's similar to:

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

// Just show in hexadecimal; read it as binary
0A 2F 74 79 70 65 2E 67 6F 6F 67 6C 65 61 70 69 73 2E 63 6F 6D 2F 61 7A 75 72 65 2E 77 65 62 70 75 62 73 75 62 2E 54 65 73 74 4D 65 73 73 61 67 65 12 02 08 01
```

The `Content-Type` for the CloudEvents HTTP request is `application/x-protobuf`, where `dataType`=`protobuf`.

The data is a valid protobuf binary. You can use the following `proto` and `any.unpack()` to deserialize it:

```protobuf
syntax = "proto3";

message MyMessage {
    int32 value = 1;
}
```

#### Case 3: Send an event with binary data

Set `send_to_group_message.binary_data` to `[1, 2, 3]`.

The upstream event handler receives a request similar to: 

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

// Just show in hexadecimal; you need to read it as binary
01 02 03 
```
For `dataType`=`binary`, the `Content-Type` for the CloudEvents HTTP request is `application/octet-stream`.  The WebSocket frame can be in `text` format for text message frames or UTF-8-encoded binaries for `binary` message frames.

The service declines the client if the message doesn't match the prescribed format.
