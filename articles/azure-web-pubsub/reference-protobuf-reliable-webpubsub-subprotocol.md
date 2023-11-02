---
title: Reference - Azure Web PubSub-supported protobuf WebSocket subprotocol `protobuf.reliable.webpubsub.azure.v1`
description: The reference describes the Azure Web PubSub-supported WebSocket subprotocol `protobuf.reliable.webpubsub.azure.v1`.
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 11/08/2021
---

#  The Azure Web PubSub-supported reliable protobuf WebSocket subprotocol
     
This document describes the subprotocol `protobuf.reliable.webpubsub.azure.v1`.

When a client is using this subprotocol, both the outgoing and incoming data frames are expected to be protocol buffers (protobuf) payloads.

## Overview

Subprotocol `protobuf.reliable.webpubsub.azure.v1` empowers the client to have a high reliable message delivery experience under network issues and do a publish-subscribe (PubSub) directly instead of doing a round trip to the upstream server. The WebSocket connection with the `protobuf.reliable.webpubsub.azure.v1` subprotocol is called a Reliable PubSub WebSocket client.

For example, in JavaScript, you can create a Reliable PubSub WebSocket client with the protobuf subprotocol by using:

```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.reliable.webpubsub.azure.v1');
```

To correctly use `json.reliable.webpubsub.azure.v1` subprotocol, the client must follow the [How to create reliable clients](./howto-develop-reliable-clients.md) to implement reconnection, publisher and subscriber.

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
    }

    message SendToGroupMessage {
        string group = 1;
        optional uint64 ack_id = 2;
        MessageData data = 3;
        optional bool no_echo = 4;
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

### Sequence Ack

Reliable PubSub WebSocket client must send `SequenceAckMessage` once it received a message from the service. Find more in [How to create reliable clients](./howto-develop-reliable-clients.md#subscriber)
 
* `sequence_id` is an incremental uint64 number from the message received.

## Responses

All response messages adhere to the following protobuf format:

```protobuf
message DownstreamMessage {
    oneof message {
        AckMessage ack_message = 1;
        DataMessage data_message = 2;
        SystemMessage system_message = 3;
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
        uint64 sequence_id = 4;
    }

    message SystemMessage {
        oneof message {
            ConnectedMessage connected_message = 1;
            DisconnectedMessage disconnected_message = 2;
        }
    
        message ConnectedMessage {
            string connection_id = 1;
            string user_id = 2;
            string reconnection_token = 3;
        }

        message DisconnectedMessage {
            string reason = 2;
        }
    }
}
```

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

`DownstreamMessage.DataMessage` has `sequence_id` property. Client must send [Sequence Ack](#sequence-ack) to the service once it receives a message.

### System response

The Web PubSub service can also send system-related responses to the client. 

#### Connected

When the client connects to the service, you receive a `DownstreamMessage.SystemMessage.ConnectedMessage` message.
`connection_id` and `reconnection_token` are used for reconnection. Make connect request with uri for reconnection:

```
wss://<service-endpoint>/client/hubs/<hub>?awps_connection_id=<connectionId>&awps_reconnection_token=<reconnectionToken>
```

Find more details in [Connection Recovery](./howto-develop-reliable-clients.md#connection-recovery)

#### Disconnected

When the server closes the connection or the service declines the client, you receive a `DownstreamMessage.SystemMessage.DisconnectedMessage` message.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
