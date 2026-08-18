---
title: What is Azure Web PubSub service?
description: Better understand what typical use cases and app scenarios Azure Web PubSub service enables, and learn the key benefits of the service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: overview
ms.date: 07/30/2024
---

# What is Azure Web PubSub service?

Azure Web PubSub is a fully managed service for building applications that deliver updates in real time. It manages long-lived client connections and message delivery at scale, so you don't have to operate the underlying real-time infrastructure.

Use Web PubSub to build chat apps, stream AI-generated tokens, update dashboards, deliver notifications, coordinate multiplayer games, track locations, and create other experiences where waiting for the next HTTP request isn't fast enough.

Instead of spending development time managing connections, scaling messaging servers, and implementing message fan-out, your team can focus on the experience your application provides.

## Choose the development experience that fits your application

Web PubSub offers multiple ways to build real-time applications. Each option solves a different development need while providing managed, scalable real-time communication.

| Capability | Choose it when you want to | Developer value |
| --- | --- | --- |
| **Web PubSub (base service)** | Design a custom real-time application by using connections, users, groups, and events. | Get flexible messaging primitives without operating WebSocket infrastructure. |
| **[Socket.IO on Azure](./socketio-overview.md)** | Use the Socket.IO programming model or move an existing Socket.IO application to Azure. | Keep familiar Socket.IO APIs while Azure manages connection scaling and coordination. |
| **[MQTT support](./overview-mqtt.md)** | Connect MQTT clients over WebSocket or exchange messages between MQTT and native Web PubSub clients. | Reuse MQTT libraries and add protocol interoperability without building a translation layer. |
| **[Web PubSub chat](./chat-overview.md)** | Build chat with rooms, members, ordered messages, and message history. | Start with chat-specific APIs and managed capabilities instead of assembling a chat backend yourself. |

If you're not sure which option fits your application, see [Choose an Azure Web PubSub capability](./choose-web-pubsub-capability.md).

## What can you build with the base service?

The base Web PubSub service is a good fit when your application needs low-latency communication and you want control over its event model, message format, and business logic.

### Stream tokens in AI-assisted applications

Use Web PubSub to stream generated tokens to connected clients as they become available. Users can see a response take shape immediately instead of waiting for the entire response to finish.

For applications that need a complete chat model with rooms, members, and message history, consider [Web PubSub chat](./chat-overview.md).

### Deliver real-time updates

Web PubSub helps a publisher deliver a data update to one or more subscribers as soon as the update is available. This pattern applies across many industries and application types.

| Use case | Example applications |
| --- | --- |
| High-frequency data updates | Multiplayer games, social media voting, opinion polling, and online auctions |
| Live dashboards and monitoring | Company dashboards, financial market data, sales updates, game leaderboards, and IoT monitoring |
| Custom chat and messaging | Live chat rooms, customer support, shopping assistants, messengers, and in-game chat |
| Location tracking | Asset tracking, delivery status, transportation updates, and ride-hailing apps |
| Multiuser collaboration | Coauthoring, collaborative whiteboards, and team meeting apps |
| Push notifications | Social media, email, game status, and travel alerts |
| Connected devices | Live IoT metrics, electric vehicle charging networks, and live event engagement |
| Automation | Real-time triggers from upstream events |

## Why use Azure Web PubSub?

### Support enterprise application requirements

Web PubSub provides controls for running real-time communication as part of a secure, observable, and resilient enterprise architecture.

| Requirement | What Web PubSub provides | Developer value |
| --- | --- | --- |
| Scale with demand | A single resource can scale to 1 million concurrent connections. The Premium tier supports [Azure Monitor autoscale](./howto-scale-autoscale.md) based on service metrics or a schedule. | Maintain performance as traffic changes and avoid manually adjusting capacity for every peak or quiet period. |
| Control network exposure | Use [private endpoints](./howto-secure-private-endpoints.md), disable public network access, apply IP rules, and allow or deny request types for public and private endpoints with [network access control](./howto-secure-network-access-control.md). | Keep service traffic on private networks where required and restrict sensitive operations, such as REST API calls, to approved network paths. |
| Use identity-based access | Authorize requests by using [Microsoft Entra ID and Azure role-based access control](./concept-azure-ad-authorization.md). Web PubSub can also use a [managed identity](./howto-use-managed-identity.md) to authenticate requests to event handlers and access Key Vault references. | Apply least-privilege access and reduce the need to distribute or manage access keys in application code. |
| Design for failures and global users | The Premium tier provides automatic zone redundancy in supported regions. [Geo-replication](./howto-enable-geo-replication.md) can route clients to a healthy, nearby replica and handles communication across replicas. | Build for availability zone or regional failures and serve geographically distributed users without creating your own cross-region messaging layer. |
| Observe service health | Built-in [service metrics](./concept-metrics.md) cover connections, quota utilization, server load, traffic, REST API response time, and client request status. You can use Azure Monitor to create metric-based alerts. | Detect capacity and reliability issues early and integrate Web PubSub into existing operational monitoring. |

> [!NOTE]
> Autoscale, zone redundancy, and geo-replication require the Premium tier. Zone redundancy is available in supported regions.

For production reliability recommendations and failover behavior, see [Reliability in Azure Web PubSub Service](/azure/reliability/reliability-web-pubsub).

### Reach clients across platforms and languages

Web PubSub works with web and mobile browsers, desktop and mobile apps, server processes, IoT devices, and game consoles. Server and client SDKs are available for C#, Java, JavaScript, and Python. Because the base service supports standard WebSocket and REST APIs, applications can also integrate without an SDK.

### Control how messages reach clients

The base service supports common delivery patterns without requiring you to build the connection routing layer.

| Messaging pattern | What it enables |
| --- | --- |
| Broadcast to all clients | Send an update to every connected client. |
| Send to a group | Reach a subset of clients defined by your application. |
| Send to a user | Synchronize all connections that belong to a user, including multiple devices or browser tabs. |
| Client pub/sub | Allow authorized clients in a group to exchange messages without routing every message through your application server. |
| Client-to-server messaging | Receive client events in your application backend with low latency. |

## How can you use the base service?

Choose the integration model that best fits your architecture:

- **Build serverless real-time applications:** Use Azure Functions integration with Web PubSub in JavaScript, C#, Java, or Python.
- **Enable client pub/sub:** Use a Web PubSub subprotocol so authorized clients can publish messages to other clients.
- **Integrate an application server:** Use a service SDK to send messages, manage groups, and close connections.
- **Call the REST API:** Send messages from any backend that can make REST requests.

## Next steps

### Choose a capability

Compare the available programming models and the work each one handles for you.

> [!div class="nextstepaction"]
> [Choose an Azure Web PubSub capability](./choose-web-pubsub-capability.md)

### Try a live demo

Experience real-time messaging with no setup.

> [!div class="nextstepaction"]
> [Play with a chat demo app](https://azure.github.io/azure-webpubsub/demos/chat)

### Explore the base service

Experiment with core Web PubSub features directly in the Azure portal, or build a local pub/sub application.

> [!div class="nextstepaction"]
> [Explore the Web PubSub playground](./quickstarts-playground.md)
>
> [Build a pub/sub application](./quickstarts-pubsub-among-clients.md)
