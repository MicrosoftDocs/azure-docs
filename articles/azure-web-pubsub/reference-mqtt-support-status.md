---
title: MQTT feature support status in Azure Web PubSub service
description: Comprehensive list of MQTT feature supported and unsupported by Azure Web PubSub service
keywords: MQTT, MQTT on Azure Web PubSub, MQTT over WebSocket
author: kevinguo-ed
ms.author: kevinguo
ms.date: 10/17/2024
ms.service: azure-web-pubsub
ms.topic: reference
---
# MQTT feature support status in Azure Web PubSub service

Azure Web PubSub service supports MQTT protocol by translating MQTT messages into its native protocol, enabling cross-communication between MQTT web clients and other Web PubSub clients. Since the MQTT support is a lightweight adaptation of the MQTT protocol, it extends only to the features already supported by Azure Web PubSub service. Refer to the list for what's supported and not supported.

## Feature support for MQTT version 3.1.1 and 5.0
Azure Web PubSub support MQTT protocol version 3.1.1 and 5.0. The supported features include but not limited to:

- All the levels of Quality Of Service including at most once, at least once and exactly once.
- Persistent session. MQTT sessions are preserved for up to 30 seconds when client connections are interrupted and restored when the client re-establishes a connection with the service. Beyond 30 seconds, the service makes no guarantee that the disrupted session is restored. 
- Last will & testament
- Client certificate authentication

## More features supported for MQTT 5.0
- Message expiry interval and session expiry interval
- Subscription identifier
- Assigned client ID
- Flow control
- Server-sent disconnect

## Not supported features
- Wildcard subscription
- Retained messages
- Topic alias
- Shared subscription
