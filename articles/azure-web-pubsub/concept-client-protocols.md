---
title: WebSocket client protocols for Azure Web PubSub
description: This article presents an overview of the client protocols for Azure Web PubSub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/16/2021
---

#  WebSocket client protocols for Azure Web PubSub

Clients connect to Azure Web PubSub by using the standard [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) protocol.

## Service endpoints
The Web PubSub service provides two types of endpoints for clients to connect to:
* `/client/hubs/{hub}`
* `/client/?hub={hub}`

`{hub}` is a mandatory parameter that acts as isolation for various applications. You can set it in either the path or the query.

## Authorization

Clients connect to the service with a JSON Web Token (JWT). The token can be in either the query string, as `/client/?hub={hub}&access_token={token}`, or the `Authorization` header, as `Authorization: Bearer {token}`.

Here is a general authorization workflow:

1. The client negotiates with your application server. The application server contains the authorization middleware, which handles the client request and signs a JWT for the client to connect to the service.
1. The application server returns the JWT and the service URL to the client.
1. The client tries to connect to the Web PubSub service by using the URL and the JWT that's returned from the application server.

<a name="simple_client"></a>

## The simple WebSocket client

A simple WebSocket client, as the naming indicates, is a simple WebSocket connection. It can also have its own custom subprotocol. 

For example, in JavaScript, you can create a simple WebSocket client by using the following code:

```js
// simple WebSocket client1
var client1 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1');

// simple WebSocket client2 with some custom subprotocol
var client2 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'custom.subprotocol')
```

## The PubSub WebSocket client

The PubSub WebSocket client supports two subprotocols:
* `json.webpubsub.azure.v1`
* `protobuf.webpubsub.azure.v1`

#### The JSON subprotocol

For example, in JavaScript, you can create a PubSub WebSocket client with a JSON subprotocol by using:

```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.webpubsub.azure.v1');
```

#### The protobuf subprotocol

Protocol buffers (protobuf) is a language-neutral, platform-neutral, binary-based protocol that simplifies sending binary data. Protobuf provides tools to generate clients for many languages, such as Java, Python, Objective-C, C#, and C++. [Learn more about protobuf](https://developers.google.com/protocol-buffers).

For example, in JavaScript, you can create a PubSub WebSocket client with a protobuf subprotocol by using the following code:

```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'protobuf.webpubsub.azure.v1');
```

When the client is using a subprotocol, both the outgoing and incoming data frames are expected to be JSON payloads. An authorized client can publish messages to other clients directly through the Azure Web PubSub service.

### Permissions

As you likely noticed in the earlier PubSub WebSocket client description, a client can publish to other clients only when it's *authorized* to do so. A client's permissions can be granted when it's being connected or during the lifetime of the connection.

| Role | Permission |
|---|---|
| Not specified | The client can send event requests. |
| `webpubsub.joinLeaveGroup` | The client can join or leave any group. |
| `webpubsub.sendToGroup` | The client can publish messages to any group. |
| `webpubsub.joinLeaveGroup.<group>` | The client can join or leave group `<group>`. |
| `webpubsub.sendToGroup.<group>` | The client can publish messages to group `<group>`. |
| | |

## AckId and Ack Response

The PubSub WebSocket Client supports `ackId` property for `joinGroup`, `leaveGroup`, `sendToGroup` and `event` messages. Although `ackId` is optional, when enabled, you can receive an ack response message when your request is finished. In the article, we describe the behavior differences between specifying `ackId` or not.

### Behavior when No `ackId` specified

If `ackId` is not specified, it's fire-and-forget. Even there're errors when brokering messages, you have no way to get it.

### Behavior when `ackId` specified

#### Idempotent publish

`ackId` is a int32 number and should be unique with in a client with the same connection id. Web PubSub Service recodes the `ackId` and messages with same `ackId` will be treat as the same message. The service refuses to broker the same message more than once, which is useful in retry to avoid duplicated messages. For example, if a client sends a message with `ackId=5` and fails to receive ack response with `ackId=5`, then client retries and sends the same message again. In some cases, the message is already brokered and the ack response is lost for some reason, the service will reject the retry and response an ack response with `Duplicate` reason.

#### Ack Response

Web PubSub Service send ack response for each request with `ackId`.

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

* The `ackId` associates the request.

* `success` is a bool and indicate whether the request is successfully processed by the service. If it's `false`, clients need to check the `error`.

* `error` only exists when `success` is `false` and clients should have different logic for different `name`
    - `Forbidden`: The client don't have the permission to the request. The client needs to be added relevant roles.
    - `InternalServerError`: Some internal error happened in the service. Retry is required.
    - `Duplicate`: The message with the same `ackId` has been already processed by the service.
    - `InvocationFailed`: Event handler is not registered or the invocation is failed.


For more information about the JSON subprotocol, see [JSON subprotocol](./reference-json-webpubsub-subprotocol.md).

For more information about the protobuf subprotocol, see [Protobuf subprotocol](./reference-protobuf-webpubsub-subprotocol.md).

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
