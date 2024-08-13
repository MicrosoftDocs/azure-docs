---
title: Overview Socket.IO Serverless Mode
description: Get an overview of Azure's support for the open-source Socket.IO library on serverless mode.
keywords: Socket.IO, Socket.IO on Azure, serverless, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 08/5/2024
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Socket.IO Serverless Mode Spec

## Lifetime workflow

In the Socket.IO Serverless mode, the client's connection lifecycle is managed through a combination of persistent connections and webhooks. The workflow ensures that the serverless architecture can efficiently handle real-time communication while maintaining control over the client's connection state.

### Client Connects

In the client side, you should use a Socket.IO compatible client. In the following client code, we uses the (official JavaScript client SDK)[https://www.npmjs.com/package/socket.io-client].

Client:

```javascript
// Initiate a socket
var socket = io("<service-endpoint>", {
    path: "/clients/socketio/hubs/<hub-name>",
    query: { access_token: "<access-token>"}
});

// handle the connection to the namespace
socket.on("connect", () => {
  // ...
});
```

Explaination of the previous sample:
- The `<service-endpoint>` is the `Endpoint` of the service resource.
- The `<hub-name>` in `path` is a concept in Web PubSub for Socket.IO, which provides isolation between hubs.
- The `<access-token>` is a JWT used to authenticate with the service. See (How to generate access token)[] for details. 

### Authentication

When a client is trying to connect with the service, in detil, it's devided into two step: connect an Engine.IO (physical) connection and then connect to a namespace, which is also known as `socket` in the concept of Socket.IO. Authentication is differenct for these two steps:
1. For the Engine.IO connection, the service execute the authentication using access-token and decide whether accept or not. If the corresponding hub has configured `anonymous mode`, Engine.IO connection can connnect without checking the access token.
2. After Engine.IO connection is successfully connected, once the service receives a socket connect request, it will 

## RESTful APIs

## Sample Session