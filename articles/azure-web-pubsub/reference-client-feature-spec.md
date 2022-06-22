---
title: Reference - Azure Web PubSub client feature spec
description: The reference describes Azure Web PubSub client feature spec
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 6/21/2022
---

#  Web PubSub Client Spec

This document outlines the complete feature set of the pub sub client of Azure Web PubSub Service. It is expected that every client library developer refers to this document to ensure that their client library provides the right behavior and features

The Web PubSub Service supports predefined subprotocols and custom subprotocols. The spec focus on predefined subprotocols and client libraries should mainly focus on implement features that predefined subprotocols support.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

Although that protocol (subprotocols and the feature spec) is published, we reserve the right to change the protocol and drop support for superseded protocol versions at any time. Of course, we don’t want to make life difficult for client library developers, so any incompatible changes will be very carefully considered, but nonetheless developers must regard the protocol definition as being subject to change.

## 1. Connection

Connection connects to the Azure Web PubSub Service using a websocket connection. The connection is designed to  multiplex operations across different groups within one hub.

### 1.1 Connect

1. Client libraries SHOULD contain a `connect` function. It's used to explicitly connect to the Web PubSub Service if not already connected.

2. The host endpoint to connect is provided by Azure WebPubSub Service and the following path or query string should be used to open a new connection.
    1. Base URI is `wss://{host}/client`
    2. Either additional path `/hubs/{hub}` or query string `hub={hub}` MUST be used to indicate the hub to connect to.
    3. query string parameter `access_token` SHOULD contains the token string unless the hub supports anonymous websocket clients. See details in [Access token](#21-access-token)
    
A sample URI is `wss://{host}/client/hubs/{hub}?access_token={accessToken}`

3. The service supports various subprotocols, connection uses these subprotocols by setting the websocket [subprotocol](https://datatracker.ietf.org/doc/html/rfc6455#section-1.9). The service predefined the following subprotocols to provide more functionality:

    - Reliable subprotocols: `json.reliable.webpubsub.azure.v1`, `protobuf.reliable.webpubsub.azure.v1`
    - Non-reliable subprotocols: `json.webpubsub.azure.v1`, `protobuf.webpubsub.azure.v1`

4. If the websocket connection doesn't specify the subprotocol or specify non-predefined subprotocols. The connection will be a "simple websocket client". It's not the target of this spec or client libraries. See details in [The simple Websocket client](./concept-client-protocols.md#the-simple-websocket-client)

5. Client libraries are RECOMMENDED to implement reliable subprotocols as they have advantages over others on connection reliability and message delivery.

6. Connections can set more than one subprotocol, but in this case, an event handler MUST be configured to handle `connect` event and select one subprotocol from list. If there's no event handler in such case, unexpected behavior MAY occur in different languages.

7. Client libraries SHOULD provide [callback functions](#callback-function) on getting `access_token`. It's because of clients usually have there own logic to get access token, such as request from separate authentication server.

### 1.2 Connected

1. The client connection is considered connected once the websocket connection is open and the initial `ConnectedMessage` has been received.

2. The `ConnectedMessage` contains `connectionId` property, which SHOULD be recorded in local. The connectionId can be used in log or return to user for future usage.

3. For reliable subprotocols, the `ConnectedMessage` also contains `reconnectionToken` property. The token is crucial for connection recovery, and also MUST be recorded locally together with `connectionId`.

4. A client MAY receive `ConnectedMessage` after recovery. The client library SHOULD update local `reconnectionToken` after receiving `ConnectedMessage`. Client libraries MUST only trigger a `connected` [callback functions](#callback-function) when receives `ConnectedMessage` the first time after making a new connection. In particular, the library MUST NOT trigger `connected` [callback functions](#callback-function) after connection recovery. The `connected` [callback functions](#callback-function) is implemented by user to do some initialization work, such as joining groups.

### 1.3 Connection drop

Connections may drop after connection is connected:

1. The connection receives a `DisconnectedMessage` and then the transport will be closed. Client libraries SHOULD record property `message` in `DisconnectedMessage` as the reason of disconnection.

2. The transport is disconnected unexpectedly.

When connection drops, client libraries SHOULD mark all messages sent but not receive `AckMessage` as failed. If the connection is using non-reliable protocols, connection state will be removed from the service. The client library MAY support auto reconnecting by making a new connection. 

### 1.4 Connection recovery

Connection recovery is specific to reliable subprotocols. Client libraries SHOULD implement reliable subprotocols and make it as the default subprotocols to provide a high reliable experience.

After connection drop, the client library SHOULD attempt to recover the connection unless meets the sign to stop recovering. The Web PubSub Service will keep the connection state in service side for at least 30 seconds. And the service makes sure all group info that the connection joined will be retained and all messages not delivered will be queued.

In order to recovery the connection, the client library MUST:

1. Make new websocket connection to the host with the following query strings together with hub info:

    1. `awps_connection_id`: The `connectionId` received from `ConnectedMessage`.

    1. `awps_reconnection_token`: The `reconnectionToken` received from `ConnectedMessage`. See details in [Reconnection token](#22-reconnection-token)
    
    A sample URI will be `wss://{host}/client/hubs/{hub}?awps_connection_id={connectionId}&awps_reconnection_token={reconnectionToken}`

2. The service will response to the recovery request:

    1. The websocket connection connects. In this case, it means the recovery is success.

    2. Receive websocket closure with websocket status code 1008. In this case, the recovery is failed. Usually, it's because the connection expires the retain timeout. Or the service meets some unrecoverable errors. And the client library MUST make a new connection.
    
    3. Other cases like unexpected HTTP response with code like 502. In this case, it doesn't means the recovery will eventually fail. Client SHOULD keep making recover requests.

3. The client library MUST stop try recovering the connection, instead making a new connection when:

    1. The service respond with websocket status code 1008

    2. The recovery attempts last more than 30 seconds.

If the recovery failed, the client library MUST reset the local sequenceId and mark all messages sent but not receive `AckMessage` as failed. 

4. 

## 2. Authentication

### 2.1 Access token

1. The client uses JWT based authentication. When making a new connection, token MUST be in the query string parameter `access_token`.

2. The [`exp`](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4) of the access token is only checked at the time you're making the new connection. In particular, the service won't terminate the connection if the access token expires after connection is connected.

### 2.2 Reconnection token

1. Reconnection token is for connection recovery. It's provided by the `reconnectionToken` property in `ConnectedMessage` and it's only available in reliable protocols.

2. Reconnection token has a long expire time (~ 1 week) and has a limited scope. It can be only used to recover the connection you've received `reconnectionToken` from.

## 3. Groups and messages

A group is a subset of connections to the hub. Client connections can join groups and send messages to groups. Group info is attached to a connection (identified by `connectionId`). That means the service won't save your group info and you SHOULD save group info in your business layer and join groups that the connection belongs to when a new connection is connected.

### 3.1 Ack messages

1. `JoinGroupMessage`, `LeaveGroupMessage`, `SendToGroupMessage` and `EventMessage` has `ackId` property. The `ackId` property is an optional property. Only when the `ackId` property is provided in message, the service will give an ack response. Otherwise, it's fire-and-forget. Even there're errors, you have no way to get notified. 

2. `ackId` is a uint64 number and should be unique within a client with the same connectionId. It's designed for idempotent publishing. The service records the ackId and messages with the same ackId will be treated as the same message. The service refuses to execute the same message more than once, which is useful in retry to avoid duplicated messages.

3. Client libraries that support reliable protocols MUST support ackId. And in this case, client libraries MUST provide a [callback functions](#callback-function) (or other language-idiomatic equivalent, such as async method in C#) to let user get the result of message execution. The service will respond with `AckMessage`, and the result will be one of the following:

    1. property `success` is true. In this case, the client library SHOULD invoke callback function with success result.
    
    2. property `success` is false. In this case, the client library SHOULD invoke callback function with error result in `error` property.

If the client library supports auto retry, it MUST NOT retry once `success` is false and `error.name` is `Duplicate`. In this case, the message with the same `ackId` has already been executed by the service.

4. Client libraries MAY support library-generated `ackId` function. In this case, client libraries can have a base id by random, and add incremental number to the base id for each message.

5. It's unnecessary to add timeout for every message. Instead the client library can rely on: the service will send an `AckMessage` or the websocket transport will fail. Once connection drop, the client SHOULD treat messages that not receive `AckMessage` as failed.

### 3.2 SequenceId

Once the client connection is using reliable subprotocols, many messages from the service will contains `sequenceId` property. If using non-reliable subprotocols, there's no `sequenceId` property in messages.

1. `sequenceId` is a non-zero uint64 incremental number within a connectionId and gives all messages sent to the client connection an order. Service use this `sequenceId` to get the knowledge of how many messages the client has been received. As the `sequenceId` is incremental and the transport layer guarantee the order, once the service has acknowledged the `sequenceId` `x` is received, the service can know all messages before `x` has been received.

2. Client libraries that support reliable protocols MUST handle `sequenceId` by sending a `SequenceAckMessage` to the service. As the service will queue all the message that not ack-ed, it has a capacity of 1000 messages or 16 MB. Once queued messages exceed the capacity, the service will close the connection and in this case, the connection is unrecoverable. Therefore, client libraries SHOULD respond `SequenceAckMessage` as soon as possible.

3. Client libraries SHOULD respond `SequenceAckMessage` once received the message rather than after processing the message. The `sequenceId` is only designed for acknowledging the client has received the message rather than having successfully processed the message. It's RECOMMENDED to transparently respond rather than having an explicit function to let user do it.

4. Client libraries SHOULD record the largest `sequenceId` ever received in messages in local and set `sequenceId` in `SequenceAckMessage` to this largest number. The service may send older queued message after recovery, responding with the largest `sequenceId` number can help the service to skip received messages.

5. Client libraries MAY support periodically respond the `SequenceAckMessage` to avoid responding for every received message. But the period SHOULD NOT be too long to cause the queue exceed the capacity.

### 3.3 Join group and leave group

1. Client libraries SHOULD have the `joinGroup` function, and `leaveGroup` function.

2. When `joinGroup` is called, a `JoinGroupMessage` is sent to the service and wait for the ack response. And when `leaveGroup` is called, a `LeaveGroupMessage` is sent to the service and wait for the ack response.

3. It's RECOMMENDED that `JoinGroupMessage` and `LeaveGroupMessage` always use idempotent publishing to get the result of execution. Client libraries SHOULD provide a [callback functions](#callback-function) (or other language-idiomatic equivalent) to get the result of join leave group operation.

### 3.4 Send group messages

1. Client libraries SHOULD have the `sendToGroup` function with fire-and-forget and idempotent publishing separately.

2. When `sendToGroup` is called, a `SendToGroupMessage` will be sent to the service. If the `ackId` property is set, means client expects the send result. If the client library supports reliable protocols, the function is REQUIRED. Client libraries SHOULD provide a [callback functions](#callback-function) (or other language-idiomatic equivalent) to get the result of broadcasting message.

### 3.5 Send event messages

1. Client libraries SHOULD have the `sendEvent` function with fire-and-forget and idempotent publishing separately.

2. When `sendToGroup` is called, a `EventMessage` will be sent to the service. If the `ackId` property is set, means client expects the send result. If the client library supports reliable protocols, the function is REQUIRED. Client libraries SHOULD provide a [callback functions](#callback-function) (or other language-idiomatic equivalent) to get the result of event message.

## 4. Message Object Reference

Different subprotocols have different format for message. Find the reference to messages format.

# [json.reliable.webpubsub.azure.v1](#tab/json-reliable)

- [ConnectedMessage](./reference-json-reliable-webpubsub-subprotocol.md#connected)
- [DisconnectedMessage](./reference-json-reliable-webpubsub-subprotocol.md#disconnected)
- [JoinGroupMessage](./reference-json-reliable-webpubsub-subprotocol.md#join-groups)
- [LeaveGroupMessage](./reference-json-reliable-webpubsub-subprotocol.md#leave-groups)
- [SendToGroupMessage](./reference-json-reliable-webpubsub-subprotocol.md#publish-messages)
- [EventMessage](./reference-json-reliable-webpubsub-subprotocol.md#send-custom-events)
- [AckMessage](./reference-json-reliable-webpubsub-subprotocol.md#ack-response)
- [SequenceAckMessage](./reference-json-reliable-webpubsub-subprotocol.md#sequence-ack)

# [protobuf.reliable.webpubsub.azure.v1](#tab/protobuf-reliable)

- [ConnectedMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#connected)
- [DisconnectedMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#disconnected)
- [JoinGroupMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#join-groups)
- [LeaveGroupMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#leave-groups)
- [SendToGroupMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#publish-messages)
- [EventMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#send-custom-events)
- [AckMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#ack-response)
- [SequenceAckMessage](./reference-protobuf-reliable-webpubsub-subprotocol.md#sequence-ack)

# [json.webpubsub.azure.v1](#tab/json)

- [ConnectedMessage](./reference-json-webpubsub-subprotocol.md#connected)
- [DisconnectedMessage](./reference-json-webpubsub-subprotocol.md#disconnected)
- [JoinGroupMessage](./reference-json-webpubsub-subprotocol.md#join-groups)
- [LeaveGroupMessage](./reference-json-webpubsub-subprotocol.md#leave-groups)
- [SendToGroupMessage](./reference-json-webpubsub-subprotocol.md#publish-messages)
- [EventMessage](./reference-json-webpubsub-subprotocol.md#send-custom-events)
- [AckMessage](./reference-json-webpubsub-subprotocol.md#ack-response)

# [protobuf.webpubsub.azure.v1](#tab/protobuf)

- [ConnectedMessage](./reference-protobuf-webpubsub-subprotocol.md#connected)
- [DisconnectedMessage](./reference-protobuf-webpubsub-subprotocol.md#disconnected)
- [JoinGroupMessage](./reference-protobuf-webpubsub-subprotocol.md#join-groups)
- [LeaveGroupMessage](./reference-protobuf-webpubsub-subprotocol.md#leave-groups)
- [SendToGroupMessage](./reference-protobuf-webpubsub-subprotocol.md#publish-messages)
- [EventMessage](./reference-protobuf-webpubsub-subprotocol.md#send-custom-events)
- [AckMessage](./reference-protobuf-webpubsub-subprotocol.md#ack-response)

***

## 5. Term definition

### Callback function

Callback functions are denoted as (argName: Type, ...) -> ReturnType. And callback function are implemented by users, and invoke by client libraries. Client libraries use callback functions to get customer returned value or notify custom defined logic. 

Callback function is also one of the ways to achieve asynchronize. In different language, it can be implemented by language-idiomatic equivalent, such as [Task-based asynchronous pattern](/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap) in C#.

### Function name

The function name, such as `connect`, `joinGroup` described in the spec is just an example of naming. Different languages should follow their language conventions.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
