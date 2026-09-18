---
title: Reference - Azure Web PubSub-supported protobuf WebSocket subprotocol `protobuf.webpubsub.azure.v1`
description: The reference describes the Azure Web PubSub-supported WebSocket subprotocol `protobuf.webpubsub.azure.v1`.
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 11/08/2021
---

#  The Azure Web PubSub-supported protobuf WebSocket subprotocol
     
This document describes the subprotocol `protobuf.webpubsub.azure.v1`.

When a client is using this subprotocol, both the outgoing and incoming data frames are expected to be protocol buffers (protobuf) payloads.

## Overview

Subprotocol `protobuf.webpubsub.azure.v1` empowers the client to do a publish-subscribe (PubSub) directly instead of doing a round trip to the upstream server. The WebSocket connection with the `protobuf.webpubsub.azure.v1` subprotocol is called a PubSub WebSocket client.

For example, in JavaScript, you can create a PubSub WebSocket client with the protobuf subprotocol by using:

```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.webpubsub.azure.v1');
```

For a simple WebSocket client, the server has the *necessary* role of handling events from clients. A simple WebSocket connection always triggers a `message` event when it sends messages, and it always relies on the server side to process messages and do other operations. With the help of the `protobuf.webpubsub.azure.v1` subprotocol, an authorized client can join a group by using [join requests](#join-groups) and publish messages to a group by using [publish requests](#publish-messages) directly. The client can also route messages to various upstream event handlers by using [event requests](#send-custom-events) to customize the *event* that the message belongs to.

> [!NOTE]
> Currently, the Web PubSub service supports only [proto3](https://developers.google.com/protocol-buffers/docs/proto3).

[!INCLUDE [reference-permission](includes/reference-permission.md)]

## Requests

All request messages adhere to the following protobuf format:

```protobuf
syntax = "proto3";

import "google/protobuf/any.proto";

message UpstreamMessage {
    oneof message {
        SendToGroupMessage send_to_group_message = 1;
        EventMessage event_message = 5;
        JoinGroupMessage join_group_message = 6;
        LeaveGroupMessage leave_group_message = 7;
        SequenceAckMessage sequence_ack_message = 8;
        PingMessage ping_message = 9;
        StreamDataMessage stream_data_message = 13;
        StreamEndMessage stream_end_message = 14;
    }

    message SendToGroupMessage {
        string group = 1;
        optional uint64 ack_id = 2;
        MessageData data = 3;
        optional bool no_echo = 4;
        StreamStartInfo stream = 7;
    }

    message StreamStartInfo {
        string stream_id = 1;
        optional uint32 idle_timeout_ms = 2;
    }

    message EventMessage {
        string event = 1;
        MessageData data = 2;
        optional uint64 ack_id = 3;
    }
    
    message JoinGroupMessage {
        string group = 1;
        optional uint64 ack_id = 2;
    }

    message LeaveGroupMessage {
        string group = 1;
        optional uint64 ack_id = 2;
    }

    message SequenceAckMessage {
        uint64 sequence_id = 1;
    }

    message PingMessage {
    }

    message StreamDataMessage {
        string stream_id = 1;
        optional uint64 stream_sequence_id = 2;
        MessageData data = 3;
    }

    message StreamEndMessage {
        string stream_id = 1;
        optional StreamEndError error = 2;

        message StreamEndError {
            optional string message = 1;
            optional string user_error_code = 2;
        }
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

[!INCLUDE [reference-protobuf-requests](includes/reference-protobuf-requests.md)]

## Responses

All response messages adhere to the following protobuf format:

```protobuf
message DownstreamMessage {
    oneof message {
        AckMessage ack_message = 1;
        DataMessage data_message = 2;
        SystemMessage system_message = 3;
        PongMessage pong_message = 4;
        StreamAckMessage stream_ack_message = 6;
        StreamNackMessage stream_nack_message = 7;
        StreamClosedMessage stream_closed_message = 8;
    }
    
    message AckMessage {
        uint64 ack_id = 1;
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
        StreamInfo stream = 6;
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

    message PongMessage {
    }

    message StreamAckMessage {
        string stream_id = 1;
        uint64 expected_sequence_id = 2;
    }

    message StreamNackMessage {
        string stream_id = 1;
        string name = 2;
        string message = 3;
        uint64 expected_sequence_id = 4;
    }

    message StreamClosedMessage {
        string stream_id = 1;
        optional StreamClosedError error = 2;

        message StreamClosedError {
            string name = 1;
            string message = 2;
        }
    }
}

message StreamInfo {
    string stream_id = 1;
    uint64 stream_sequence_id = 2;
    optional bool end_of_stream = 3;
    optional StreamError error = 4;

    message StreamError {
        string name = 1;
        string message = 2;
        string user_error_code = 3;
    }
}
```

Messages received by the client can be `ack`, `message`, `system`, `pong`, `streamAck`, `streamNack`, or `streamClosed`.

### Ack response

If the request contains `ackId`, the service returns an ack response for this request. The client implementation should handle this ack mechanism, including:
* Waiting for the ack response for an `async` `await` operation. 
* Having a timeout check when the ack response isn't received during a certain period.

The client implementation should always check first to see whether the `success` status is `true` or `false`. When the `success` status is `false`, the client can read from the `error` property for error details.

### Message response

Clients can receive messages published from a group that the client has joined. Or they can receive messages from the server management role when the server sends messages to a specific client or a specific user.

You'll always get a `DownstreamMessage.DataMessage` message in the following scenarios:

- When the message is from a group, `from` is `group`. When the message is from the server, `from` is `server`.
- When the message is from a group, `group` is the group name.

The sender's `dataType` will cause one of the following messages to be sent: 
* If `dataType` is `text`, use `message_response_message.data.text_data`. 
* If `dataType` is `binary`, use `message_response_message.data.binary_data`. 
* If `dataType` is `protobuf`, use `message_response_message.data.protobuf_data`. 
* If `dataType` is `json`, use `message_response_message.data.text_data`, and the content is a serialized JSON string.

When a group message belongs to a stream, `DownstreamMessage.DataMessage.stream` is set.

* `stream.stream_id` is the logical stream identifier.
* `stream.stream_sequence_id` is the sequence number of the message in the stream.
* `stream.end_of_stream` is optional. When set to `true`, the message is the terminal message of the stream.
* `stream.error` is optional and is present only when the stream ends with an error. `user_error_code` is present only for `UserError`.

### Stream ack response

The service sends `DownstreamMessage.StreamAckMessage` to acknowledge accepted stream data and to report the next stream sequence ID it expects.

* `stream_id` is the logical stream identifier.
* `expected_sequence_id` is the next stream sequence ID the service expects.

### Stream nack response

The service sends `DownstreamMessage.StreamNackMessage` for a retriable stream error.

* `stream_id` is the logical stream identifier.
* `expected_sequence_id` is the next stream sequence ID the service expects.
* `name` can be `InvalidSequenceId` or `TransientError`.
* `message` contains error details.

### Stream closed response

The service sends `DownstreamMessage.StreamClosedMessage` when the publisher-side stream is closed.

* `stream_id` is the logical stream identifier.
* `error` is omitted when the stream is closed normally.
* `error.name` can be `StreamNotFound`, `Forbidden`, `BadRequest`, `InternalServerError`, or `IdleTimeout`.
* `error.message` contains error details.

### System response

The Web PubSub service can also send system-related responses to the client.

#### Connected

When the client connects to the service, you receive a `DownstreamMessage.SystemMessage.ConnectedMessage` message.

#### Disconnected

When the server closes the connection or the service declines the client, you receive a `DownstreamMessage.SystemMessage.DisconnectedMessage` message.

### Pong response

The Web PubSub service sends a `PongMessage` to the client when it receives a `PingMessage` from the client.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
