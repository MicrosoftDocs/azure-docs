---
title: Choose an Azure Web PubSub capability
description: Compare base Azure Web PubSub, Socket.IO, MQTT, and Web PubSub chat, and choose the capability that best fits your application.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: overview
ms.date: 08/06/2026
---

# Choose an Azure Web PubSub capability

Azure Web PubSub provides multiple ways to add real-time communication to an application. You can start with flexible messaging primitives, keep an established protocol and programming model, or use APIs designed for a specific application scenario.

The right choice lets you avoid building or operating capabilities that don't differentiate your application. This article explains what each option provides, what remains under your control, and where each option delivers the most value.

## Choose based on what you want to build

| If you need to... | Start with... | Why |
| --- | --- | --- |
| Design custom real-time behavior for dashboards, games, notifications, AI token streaming, signaling, or other application scenarios | [Web PubSub (base service)](#web-pubsub-base-service) | You control the application protocol and business logic while Azure manages connections and message delivery. |
| Scale an existing Socket.IO application or use the Socket.IO APIs and ecosystem | [Socket.IO on Azure](#socketio-on-azure) | You keep the Socket.IO programming model without operating Socket.IO connection infrastructure or an adapter. |
| Connect MQTT clients over WebSocket or exchange messages between MQTT and Web PubSub clients | [MQTT support](#mqtt-support) | You can use MQTT client libraries and let Web PubSub translate between supported MQTT and native concepts. |
| Add one-to-one or group chat with rooms, membership, message ordering, and history | [Web PubSub chat](#web-pubsub-chat) | You get chat-specific APIs and managed chat capabilities instead of designing them from low-level messaging primitives. |

## Understand how the capabilities differ

Think of base Web PubSub as a flexible real-time foundation. It gives you building blocks such as connections, users, groups, and events. You decide what those building blocks mean in your application.

The other capabilities remove work for a more specific need:

- **Socket.IO on Azure** preserves the programming model that Socket.IO developers already know.
- **MQTT support** adapts a supported subset of MQTT to Web PubSub so MQTT clients can participate in real-time messaging.
- **Web PubSub chat** provides a higher-level application model for rooms, members, messages, and history.

They're not interchangeable names for the same API. The best option is the one that matches the abstractions your application already uses or would otherwise have to build.

| Area | Web PubSub (base service) | Socket.IO on Azure | MQTT support | Web PubSub chat |
| --- | --- | --- | --- | --- |
| Primary value | Flexible real-time building blocks | Familiar Socket.IO development without self-hosted scaling | MQTT client compatibility and protocol interoperability | A ready-to-use chat model |
| Programming surface | Web PubSub SDKs, WebSocket subprotocols, event handlers, and REST APIs | Socket.IO client and server APIs | Supported MQTT packets and concepts over WebSocket | Chat client and server APIs |
| Main application concepts | Connections, users, groups, and events | Sockets, rooms, namespaces, and events | Clients, topics, subscriptions, and messages | Users, rooms, members, messages, and history |
| Azure handles | Connection lifecycle, scaling, routing, and message fan-out | Connection hosting, scaling, and coordination between app servers | Translation between supported MQTT and Web PubSub concepts | Real-time delivery, fan-out, room membership, message ordering, and persistence |
| You design | Event model, payloads, authorization flow, business logic, and any persistence | Application events and business logic | Topic design, business logic, and capabilities outside the supported MQTT subset | Chat experience, application identities, authorization assignments, and business logic |
| Best fit | Custom or mixed real-time workloads | New or existing Socket.IO applications | Web clients that use MQTT libraries or mixed MQTT and Web PubSub clients | Applications where chat is a product feature |

## Web PubSub (base service)

Choose base Web PubSub when flexibility is more valuable than a purpose-built application model. It provides managed real-time transport and routing while leaving your event model and business behavior under your control.

For example, your application can:

- Send an update to all connected clients, a group, one user, or one connection.
- Receive client events in an application server or Azure Functions.
- Allow authorized clients to publish messages directly to a group.
- Use custom payloads and events for application-specific workflows.

This flexibility is useful for live dashboards, multiplayer coordination, notifications, collaborative experiences, device updates, signaling, and AI token streaming. You avoid operating WebSocket servers, but you still design domain features such as message persistence, history, or chat membership when your application needs them.

## Socket.IO on Azure

Choose Socket.IO on Azure when your team already uses Socket.IO or wants its event-driven APIs and ecosystem.

In a self-hosted Socket.IO application, your team must maintain stateful client connections and coordinate multiple Socket.IO servers by using an adapter. Socket.IO on Azure manages the connection infrastructure and server coordination. This management lets your application servers focus on event handling and business logic.

The key value is continuity: you can retain the Socket.IO programming model and migrate an existing application with only limited code changes instead of redesigning it around a different real-time API.

To learn more, see [Overview Socket.IO on Azure](./socketio-overview.md).

## MQTT support

Choose MQTT support when clients use MQTT libraries and connect over WebSocket, or when MQTT clients need to exchange messages with native Web PubSub clients.

Web PubSub recognizes supported MQTT messages and maps MQTT concepts, such as topics and subscriptions, to Web PubSub concepts. This mapping saves you from building and operating a separate protocol translation layer.

MQTT support in Web PubSub is a lightweight adaptation, not a full MQTT broker. It supports only the MQTT features that map to Web PubSub. Features such as wildcard subscriptions, retained messages, shared subscriptions, and topic aliases aren't supported.

If your solution requires a comprehensive MQTT broker, consider [MQTT support in Azure Event Grid](../event-grid/overview.md). For supported Web PubSub scenarios and protocol details, see [MQTT in Azure Web PubSub service](./overview-mqtt.md).

## Web PubSub chat

Choose Web PubSub chat when chat is a product feature and you want to spend development time on the user experience rather than creating the underlying chat model.

By using base Web PubSub, you can build custom chat, but your team defines message payloads and implements concerns such as rooms, membership, message ordering, and history. Web PubSub chat provides those concepts through purpose-built APIs and SDKs.

Web PubSub chat is a higher-level capability built on Web PubSub's real-time infrastructure. It provides:

- One-to-one and group chat.
- Rooms and member management.
- Ordered real-time messages.
- Message persistence and room history.
- Roles and permissions for chat operations.

You continue to own your application's identity integration, user experience, and business rules, while the service handles common chat infrastructure.

To learn more, see [What is Web PubSub chat?](./chat-overview.md)

## Make the choice

Use these questions to narrow the decision:

1. Do you need to preserve Socket.IO APIs or migrate a Socket.IO application? Choose **Socket.IO on Azure**.
1. Do your clients need to communicate by using the supported MQTT protocol over WebSocket? Choose **MQTT support**.
1. Do you need built-in rooms, members, message ordering, and message history for a chat experience? Choose **Web PubSub chat**.
1. Do you need a custom event model or a real-time scenario that doesn't fit the preceding options? Choose **Web PubSub (base service)**.

Choosing a more specialized capability can shorten development time because Azure provides more of the application model. Choosing the base service gives you more control when your requirements are unique. Start with the highest-level capability that meets your needs, and use the base service when that flexibility creates value for your application.
