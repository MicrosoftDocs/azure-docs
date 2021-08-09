---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
---

Here are some important terms used by the service:

- **Connection**: A connection, also known as a client or a client connection, respresents an individual WebSocket connection connected to the Web PubSub service. When successfully connected, an unique connection ID is assigned to this connectio by the Web PubSub service.

- **Hub**: Hub is a logical concept for a set of client connections. Usually you use one hub for one purpose, for example, a *chat* hub, or a *notification* hub. When a client connection connects, it connects to a hub, and during its lifetime, it belongs to that hub. Different applications can share one Azure Web PubSub service by using different hub names.

- **Group**: Group is a subset of connections to the hub. Group is relatively light-weighted, you can add a client connection to a group or remove the client connection from the group anytime you want. For example, a client joins a chat room, the client leaves the chat room, such chat room can be a group. A client can join multiple groups, and a group can contain multiple clients.

- **User**: Connections to Web PubSub can belong to one user. A user might have multiple connections, for example when a single user is connected across multiple devices or multiple browser tabs.

- **Message**: When the client is connected, it can send messages to the upstream or receive messages from the upstream from the WebSocket connection.
