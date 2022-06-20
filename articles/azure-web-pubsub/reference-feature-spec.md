---
title: Reference - Azure Web PubSub client feature spec
description: The reference describes Azure Web PubSub client feature spec
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 6/17/2022
---

#  Client Feature Spec

This document outlines the complete feature set of the client of Azure Web PubSub Service. It is expected that every client library developer refers to this document to ensure that their client library provides the same API and features.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

Although that protocol is published, we reserve the right to change the protocol and drop support for superseded protocol versions at any time. Of course, we don’t want to make life difficult for client library developers, so any incompatible changes will be very carefully considered, but nonetheless developers must regard the protocol definition as being subject to change.

## 1. Connection

Connection connects to the Azure Web PubSub Service using a websocket connection. The connection is designed to  multiplex operations across different groups within one hub.

### 1.1 Connect

1. The host to connect is provided by Azure WebPubSub Service and the following path or query string should be used to open a new connection.
    1. Base URI is `wss://{host}/client`
    2. Either additional path `/hubs/{hub}` or query string `hub={hub}` MUST be used to indicate the hub to connect to.
    3. query string `access_token` SHOULD contains the token string unless the hub supports anonymous websocket clients.

2. The service supports various subprotocols, connection uses these subprotocols by setting the websocket [subprotocol](https://datatracker.ietf.org/doc/html/rfc6455#section-1.9). The service predefined the following subprotocols to provide more functionality:

    - Reliable subprotocols: `json.reliable.webpubsub.azure.v1`, `protobuf.reliable.webpubsub.azure.v1`
    - Non-reliable subprotocols: `json.webpubsub.azure.v1`, `protobuf.webpubsub.azure.v1`

The term `PubSub Client` is used when the connection is using predefined subprotocol.

3. Client libraries are RECOMMENDED to implement reliable subprotocols as they have advantages over others on connection reliability and message delivery.

Setting subprotocols to non-predefined subprotocols or setting zero subprotocol will result in the client not  supporting many functionality like client pubsub. The term `Simple Client` is used when the connection is not using predefined subprotocols.

4. If the connection sets more than one subprotocols, an event handler SHOULD be configured to handle `connect` event and select one subprotocol from list. If there's no event handler in such case, unexpected behavior MAY occur in different languages.

5. Client libraries SHOULD contains a `connect` function. It's used to explicitly connects to the Web PubSub Service if not already connected.

### 1.2 Connected

1. For `PubSub Client`, the connection is considered connected once the websocket connection is open and the initial `Connected` message has been received.

2. The `Connected` messages contains `connectionId` property, which SHOULD be recorded in local. For reliable subprotocols, the `Connected` message also contains `reconnectionToken` property. The toke is crucial for connection recovery, and also SHOULD be recorded locally together with `connectionId`.

3. A client MAY receive `Connected` message after recovery. The client library SHOULD update local `reconnectionToken` after received `Connected` message. Client libraries MUST only trigger a `Connected` callback when receives `Connected` message the first time after making a new connection. In particular, the library MUST NOT trigger `Connected` function after connection recovery.

### 1.3 Connection disconnection and recovery

Connection recovery is specific to reliable subprotocols. Client libraries SHOULD implement reliable subprotocols and make it as the default subprotocols to provide a high reliable experience.

Connections may drop after connected:

    1. The connection receives a `Disconnected` message and then the transport will be closed.

    2. The transport is disconnected unexpectedly.

After connection drop, the client library SHOULD attempt to recover the connection. The Web PubSub Service will keep the connection state in service side for at least 30 seconds. And the service make sure all group info that the connection joined will be retained and all messages not delivered will be queued.

In order to recovery the connection, the client library MUST:

1. Make new websocket connection to the host with the following query strings together with hub info:

    1. `awps_connection_id`: The `connectionId` received from `Connected` message.

    1. `awps_reconnection_token`: The `reconnectionToken` received from `Connected` message.
    
    A sample URI will be `wss://{host}/client/hubs/{hub}?awps_connection_id={connectionId}&awps_reconnection_token={reconnectionToken}`

2. The service will response to the recovery request:

    1. Unexpected HTTP response with code like 502. In this case, it doesn't means the recovery will eventually fail. Client SHOULD keep making recover requests.

    2. The websocket connection connects. In this case, it means the recovery is success.

    3. Receive websocket closure with websocket status code 1008. In this case, the recovery is failed. Usually, it's because the connection expire the retain timeout. Or the service meets some unrecoverable errors. And the client library MUST make a new connection.

## 2. Groups and group messages

A group is a subset of connections to the hub. Client connections can join groups and send messages to groups. Group info is attached to a connection (identified by `connectionId`). That means the service won't save your group info and you SHOULD save group info in your business layer and join groups that the connection belongs to when a new connection is connected.

### 2.1 Join group and leave group

1. Client libraries SHOULD have the `joinGroup` function, and `leaveGroup` function.

2. When `joinGroup` is called, a `JoinGroupMessage` is sent to the service and wait for the ack response. And when `leaveGroup` is called, a `LeaveGroupMessage` is sent to the service and wait for the ack response.

3. Client libraries SHOULD provide a callback (or other language-idiomatic equivalent, such as async method in C#) to get the result of join leave group operation.

4. Once the `JoinGroupMessage` or `LeaveGroupMessage` is sent and the ack message is not received in time or received an non-success ack, an error or exception SHOULD be provided with error details.

### 2.2 Send group messages

1. Client libraries SHOULD have the `sendToGroup` function with and without `ackId`.

2. When `sendToGroup` without `ackId` is called, a `SendToGroupMessage` is sent to the service. And the message is fire-and-forget. 
1. When `sendToGroup` with `ackId` is called, a `SendToGroupMessage`

## 3. Sending events

## 5. Message Object Reference

### 5.1 Connected

|Protocol  |Link  |
|---------|---------|
|json.reliable.webpubsub.azure.v1     |         |     
|protobuf.reliable.webpubsub.azure.v1 |         |
|json.webpubsub.azure.v1              |         |
|protobuf.webpubsub.azure.v1          |         |

### 5.2 Disconnected

### 5.3 Join group

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
