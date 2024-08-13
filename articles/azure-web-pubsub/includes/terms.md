---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 01/23/2024
---

- **Connection**: A connection, also known as a client or a **client connection**, it's a logical relationship between a client and the Web PubSub service. Over a 'connection', the client and the service engage in a series of stateful interactions. **Connections** using different protocols might behave differently, for example, some **connection** are limited to the duration of a network connection, while others can extend across multiple successive network connections between a client and the service.

- **Hub**: A hub is a logical concept for a set of client connections. Usually you use one hub for one scenario, for example, a *chat* hub, or a *notification* hub. When a client connection connects, it connects to a hub, and during its lifetime it belongs to that hub. Once a client connection connects to the hub, the hub exists. Different applications can share one Azure Web PubSub service by using different hub names. While there is no strict limit on the number of hubs, a **hub** consumes more service load comparing to a **group**. It is recommended to have a predetermined set of hubs rather than generating them dynamically.

- **Group**: A group is a subset of connections to the hub. You can add a client connection to a group, or remove the client connection from the group, anytime you want. For example, when a client joins a chat room, or when a client leaves the chat room, this chat room can be considered to be a group. A client can join multiple groups, and a group can contain multiple clients. The group is like a group "session", the group session is created once someone joins the group, and the session is gone when no one is in the group. Messages sent to the group are delivered to all of the clients connected to the group.

- **User**: Connections to Web PubSub can belong to one user. A user might have multiple connections, for example when a single user is connected across multiple devices or multiple browser tabs.

- **Message**: When the client is connected, it can send messages to the upstream application, or receive messages from the upstream application, through the WebSocket connection. Messages can be in plain text, binary, or JSON format and have a maximum size of 1 MB.

- **Client Events**: Events are created during the lifecycle of a client connection. For example, a simple WebSocket client connection creates a `connect` event when it tries to connect to the service, a `connected` event when it successfully connected to the service, a `message` event when it sends messages to the service and a `disconnected` event when it disconnects from the service. Details about *client events* are illustrated in [Client protocol](..\concept-service-internals.md#client-protocol) section.

- **Event Handler**: The event handler contains the logic to handle the client events. Register and configure event handlers in the service through the portal or Azure CLI beforehand. Details are described in [Event handler](..\concept-service-internals.md#event-handler) section.

- **Event Listener(preview)**: The event listener just listens to the client events but can't interfere the lifetime of your clients through their response. Details are described in [Event listener](..\concept-service-internals.md#event-listener) section.

- **Server**: The server can handle client events, manage client connections, or publish messages to groups. Both event handler and event listener are considered to be server-side. Details about **server** are described in the [Server protocol](..\concept-service-internals.md#server-protocol) section.
