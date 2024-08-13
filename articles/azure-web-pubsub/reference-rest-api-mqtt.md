---
title: Azure Web PubSub service data plane REST API Specification for MQTT
description: Clarifies the meanings of the Web PubSub data-plane REST API in the context of MQTT
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 07/23/2024
---

# REST API specification for MQTT

This document clarifies the meanings of the Web PubSub data-plane REST API in the context of MQTT. The existing Web PubSub REST API documentation is focused on Web PubSub’s own protocols, which may make its application to MQTT unclear.

## Term Mappings

To begin, familiarize yourself with the term mappings between Web PubSub and MQTT. If you are already familiar with these terms, you may skip this section.

[!INCLUDE [MQTT-Term-Mappings](includes/mqtt-term-mappings.md)]

## Operation Mappings

For a comprehensive list of available operations, refer to the [REST API reference](/rest/api/webpubsub/dataplane/web-pub-sub).

The REST API operations are categorized into the following groups:

* [Message Sending Operations](#message-sending-operations)
* [Subscription Management Operations](#subscription-management-operations)
* [Permission Management Operations](#permission-management-operations)
* [Existence Management Operations](#existence-management-operations)
* [Client Token Generation Operations](#client-token-generation-operations)

Each of these categories is defined below.

### Message Sending Operations

| REST API Operation | Effect on MQTT |
| ------------------ | -------------- |
| Send to Group | MQTT connections subscribed to the topic named with the group name will receive the message. |
| Send to All<br>Send to User<br>Send to Connection | The respective MQTT connections will receive a message with the topic `$webpubsub/server/messages`. |

Messages are published with a QoS of 1. The QoS of received messages may be downgraded based on the clients' subscription options, following the standard MQTT downgrading rules.

### Subscription Management Operations

| REST API Operation | Effect on MQTT |
| ------------------ | -------------- |
| Add Connections to Groups<br>Add Connection to Group | Adds a subscription for the specified connections. |
| Add User to Group | Adds a subscription for all connections of the specified user. |
| Remove Connection from All Groups<br>Remove Connection from Group<br>Remove Connections from Groups<br>Remove User from All Groups<br>Remove User from Group | Removes one or all subscriptions for the specified connections or users. |

The group name corresponds to the MQTT topic filter. When adding connections or users to groups, default MQTT subscription options are used.

### Permission Management Operations

These operations are straightforward in the context of MQTT and thus the definition is ignored.
* Check Permission
* Grant Permission
* Revoke Permission

### Existence Management Operations

| REST API Operation | Effect on MQTT |
| ------------------ | -------------- |
| Connection Exists<br>Group Exists<br>User Exists | Checks whether a session exists for the specified connection, user, or group. Note that this differs from checking if a connection is currently online. |
| Close All Connections<br>Close Group Connections<br>Close User Connections | Ends the specified sessions and terminates the corresponding physical connections. |

### Client Token Generation Operations

| REST API Operation | Effect on MQTT |
| ------------------ | -------------- |
| Generate Client Token | Generates the connection token and URL for MQTT clients to connect. |

Please note that MQTT support is available starting from REST API version `2024-01-01`. You must specify the query parameter `clientType=MQTT` for MQTT clients.
