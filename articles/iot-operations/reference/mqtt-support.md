---
title: MQTT feature support in MQTT broker
description: MQTT feature and control support in MQTT broker.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: reference
ms.date: 07/02/2024

# CustomerIntent: As an operator, I want to understand what MQTT specifications are supported by MQTT broker so that I can configure my MQTT client to connect to MQTT broker.
---

# MQTT feature support in MQTT broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

MQTT broker currently supports the following MQTT features and control packets.

| Feature or control packet | MQTT v3.1.1 | MQTT v5 |
|---|:---:|:---:|
| CONNECT Keep-Alive | Supported | Supported |
| CONNECT Will Messages | Supported | Supported |
| CONNECT Clean Start | | Supported |
| CONNECT Persistent session | | Supported |
| CONNECT Session Expiry Interval | | Supported |
| CONNECT Receive Maximum | | Supported |
| CONNECT Maximum Packet Size | | |
| CONNECT Topic Alias Maximum | | |
| CONNECT Request Response Information | | |
| CONNECT User Properties | | Supported |
| CONNECT Authentication Data | | |
| CONNECT Authentication Method | | |
| CONNECT Session Present flag (Persistent session) | Supported | Supported |
| CONNECT Server Generated Client ID | Supported | Supported |
| AUTH | | |
| PUBLISH QoS0 Delivery | Supported | Supported |
| PUBLISH QoS1 Delivery | Supported | Supported |
| PUBLISH QoS0 Offline messages for persistent sessions | Supported | Supported |
| PUBLISH QoS1 Offline messages for persistent sessions | Supported | Supported |
| PUBLISH QoS1 Flow control <br> Currently, the broker sends out as many publishes as possible without waiting for the client to acknowledge them. | Supported | Supported |
| PUBLISH QoS1 Message delivery retry | Supported | Supported |
| PUBLISH QoS0 Retain | Supported | Supported |
| PUBLISH QoS1 Retain | Supported | Supported |
| PUBLISH Correlation Data | | Supported |
| PUBLISH Response Topic | | Supported |
| PUBLISH Payload Format Indicator | | Supported |
| PUBLISH Message Expiry Interval | | Supported |
| PUBLISH Topic Alias | | |
| PUBLISH User Properties | | Supported |
| SUBSCRIBE | Supported | Supported |
| SUBSCRIBE Retain as Published | | Supported |
| SUBSCRIBE Retain Handling | | Supported |
| SUBSCRIBE Wildcards | Supported | Supported |
| SUBSCRIBE No Local | | |
| UNSUBSCRIBE | Supported | Supported |
| SUBSCRIBE $SYS topics | | |
| SUBSCRIBE Subscription Identifiers | | |
| SUBSCRIBE Shared Subscriptions |Supported | Supported |
| SUBSCRIBE Max subscriptions per client | | |
| PINGREQ | Supported | Supported |
| DISCONNECT | Supported | Supported |
| DISCONNECT Session Expiry Interval | | |
