---
title: WebSocket client protocols for Azure Web PubSub
description: An overview of the client protocols for Azure Web PubSub
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/16/2021
---

#  WebSocket client protocols for Azure Web PubSub

Clients connect to Azure Web PubSub using the standard [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) protocol.

## Service Endpoint
The service provides two types of endpoints for the clients to connect to:
1. `/client/hubs/{hub}`
2. `/client/?hub={hub}`

`{hub}` is a mandatory parameter that acts as isolation for different applications. It can be set either in the path or in the query.

## Auth
1. Client connects to the service with JWT token

### 1. The client connects using the JWT token

JWT token can be either in query string `/client/?hub={hub}&access_token={token}` or in `Authorization` header: `Authorization: Bearer {token}`.

A general workflow is:
1. Client negotiates with your application server. The application server has Auth middleware to handle the client request and sign a JWT token for the client to connect to the service.
2. The application server returns the JWT token and the service URL to the client
3. The client tries to connect to the Web PubSub service using the URL and JWT token returned from the application server

<a name="simple_client"></a>

## The simple WebSocket client
A simple WebSocket client, as the naming indicates, is a simple WebSocket connection. It can also have its custom subprotocol. 

For example, in JS, a simple WebSocket client can be created using:
```js
// simple WebSocket client1
var client1 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1');

// simple WebSocket client2 with some custom subprotocol
var client2 = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'custom.subprotocol')

```

## The PubSub WebSocket client

The PubSub WebSocket client connects with subprotocol `json.webpubsub.azure.v1`.

For example, in JS, a PubSub WebSocket client can be created using:
```js
// PubSub WebSocket client
var pubsub = new WebSocket('wss://test.webpubsub.azure.com/client/hubs/hub1', 'json.webpubsub.azure.v1');
```

When the client is using this subprotocol, both outgoing data frame and incoming data frame are expected to be JSON payloads. An auth-ed client can publish messages to other clients directly through the Azure Web PubSub service.

### Permissions

As you may have noticed when we describe the PubSub WebSocket clients, that a client can publish to other clients only when it is *authorized* to. The permission of the client can be granted when it is connected or during the lifetime of the connection.

| Role | Permission |
|---|---|
| Not specified | The client can send event requests.
| `webpubsub.joinLeaveGroup` | The client can join/leave any group.
| `webpubsub.sendToGroup` | The client can publish messages to any group.
| `webpubsub.joinLeaveGroup.<group>` | The client can join/leave group `<group>`.
| `webpubsub.sendToGroup.<group>` | The client can publish messages to group `<group>`.

Details of the subprotocol is described in [JSON subprotocol](./reference-json-webpubsub-subprotocol.md).

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
