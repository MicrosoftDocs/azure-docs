---
title: MQTT support in Azure Web PubSub service
description: Get an overview of Azure Web PubSub's support for the MQTT protocols, understand typical use case scenarios of when to use MQTT in Azure Web PubSub, and learn the key benefits of MQTT in Azure Web PubSub.
keywords: MQTT, MQTT on Azure Web PubSub, MQTT over WebSocket
author: Y-Sindo
ms.author: zityang
ms.date: 10/17/2024
ms.service: azure-web-pubsub
ms.topic: overview
---
# MQTT in Azure Web PubSub service (Preview)

> [!NOTE]
> MQTT support in Azure Web PubSub is in preview stage.

## Overview
[MQTT](https://mqtt.org/) is a lightweight pub/sub messaging protocol designed for devices with constrained resources. Azure Web PubSub service now natively supports MQTT over WebSocket transport, enabling cross-communication between MQTT web clients and other Web PubSub clients

This new capability addresses two key use cases: 
1. Real-time applications with mixed protocols: You can allow clients using different protocols to exchange data in real-time through Azure Web PubSub service. 

2. Support for more programming languages: You can use any MQTT library to connect with the service, making it possible to integrate with applications written in languages like C++, beyond the available SDKs in C#, JavaScript, Python, and Java. 

It’s important to note that this MQTT support is a lightweight adaptation of the MQTT protocol and extends only to the features already supported by Azure Web PubSub. Some MQTT features that aren't supported include: 
- Wildcard subscriptions 
- Retained messages 
- Shared subscriptions 
- Topic alias

For a comprehensive list of what MQTT features are supported, read [this documentation article](./reference-mqtt-support-status.md). 

For a more comprehensive MQTT broker solution on Azure, we recommend exploring [Azure Event Grid](../event-grid/overview.md). 

## Real-time data exchange patterns enabled by the MQTT support
- Pub/Sub among MQTT web clients and Web PubSub native clients
- Broadcast messages to MQTT web clients
- Receive notifications for lifetime events of MQTT web client

## How MQTT is adapted into Web PubSub's system

> [!NOTE]
> This section assumes you have basic knowledge about MQTT protocols and Azure Web PubSub. 

Azure Web PubSub service now recognizes MQTT messages and translates them to its native protocols. The following table shows similar or equivalent term mappings between MQTT and Web PubSub. It helps you understand how we adapt MQTT concepts into those found in Web PubSub. It's essential if you want to use the [data-plane REST API](./reference-rest-api-data-plane.md) or [client event handlers](./howto-develop-eventhandler.md) to interact with MQTT web clients.

[!INCLUDE [MQTT-Term-Mappings](includes/mqtt-term-mappings.md)]

## Next step

> [!div class="nextstepaction"]
> [How To Connect MQTT Clients to Web PubSub](./howto-connect-mqtt-websocket-client.md)
> [!div class="nextstepaction"]
> [Quickstart: Pub/Sub among MQTT clients](./howto-mqtt-pubsub-among-mqtt-clients.md)

