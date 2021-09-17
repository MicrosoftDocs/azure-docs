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

For more information about the JSON subprotocol, see [JSON subprotocol](./reference-json-webpubsub-subprotocol.md).

For more information about the protobuf subprotocol, see [Protobuf subprotocol](./reference-protobuf-webpubsub-subprotocol.md).

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
