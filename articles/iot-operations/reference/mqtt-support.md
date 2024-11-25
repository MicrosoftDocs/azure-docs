---
title: MQTT feature support in MQTT broker
description: MQTT feature and control support in MQTT broker.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: reference
ms.date: 10/22/2024

# CustomerIntent: As an operator, I want to understand what MQTT specifications are supported by MQTT broker so that I can configure my MQTT client to connect to MQTT broker.
ms.service: azure-iot-operations
---

# MQTT feature support in MQTT broker

MQTT broker currently supports the following MQTT features and control packets.

| Feature or control packet | MQTT v3.1.1 | MQTT v5 |
|---|:---:|:---:|
| CONNECT Keep-Alive | Supported | Supported |
| CONNECT Will Messages | Supported | Supported |
| CONNECT Will Messages Delay | N/A | Supported |
| CONNECT Will Messages Expiry Interval | N/A | Supported |
| CONNECT Will Messages User Properties | N/A | Supported |
| CONNECT Clean Start | Supported | Supported |
| CONNECT Persistent session | Supported | Supported |
| CONNECT Session Expiry Interval | N/A | Supported |
| CONNECT Client Receive Maximum | N/A | Supported |
| CONNECT Client Maximum Packet Size | N/A | Not Supported |
| CONNECT Topic Alias Maximum | N/A | Not Supported |
| CONNECT Request Response Information | N/A | Not Supported |
| CONNECT User Properties | N/A | Supported |
| CONNECT Authentication Data | N/A | Supported |
| CONNECT Authentication Method | N/A | Supported |
| CONNECT Server Generated Client ID | N/A | Supported |
| CONNACK Session Present | Supported | Supported |
| CONNACK Server Maximum Packet Size <br>  _(Server sets maximum allowed incoming packet size based on the memory profile)_ | N/A | Supported |
| AUTH | N/A | Supported |
| PUBLISH QoS0 Delivery | Supported | Supported |
| PUBLISH QoS1 Delivery | Supported | Supported |
| PUBLISH QoS2 Delivery | Not Supported | Not Supported |
| PUBLISH QoS0 Offline messages for persistent sessions <br> _(QoS0 messages are dropped for offline sessions)_  | Not Supported | Not Supported |
| PUBLISH QoS1 Offline messages for persistent sessions | Supported | Supported |
| PUBLISH QoS1 Flow control <br> _(The broker sends out as many publishes as possible without waiting up to the client's Receive Maximum)_ | N/A | Supported |
| PUBLISH Retain flag | Supported | Supported |
| PUBLISH Correlation Data | N/A | Supported |
| PUBLISH Response Topic | N/A | Supported |
| PUBLISH Payload Format Indicator | N/A | Supported |
| PUBLISH Message Expiry Interval | N/A | Supported |
| PUBLISH Topic Alias | N/A | Not Supported |
| PUBLISH User Properties | N/A | Supported |
| SUBSCRIBE | Supported | Supported |
| SUBSCRIBE Retain as Published | N/A | Supported |
| SUBSCRIBE Retain Handling | N/A | Supported |
| SUBSCRIBE Wildcards | Supported | Supported |
| SUBSCRIBE No Local | N/A | Supported |
| UNSUBSCRIBE | Supported | Supported |
| SUBSCRIBE $SYS topics | Not Supported | Not Supported |
| SUBSCRIBE Subscription Identifiers | N/A | Not Supported |
| SUBSCRIBE Shared Subscriptions | Supported | Supported |
| SUBSCRIBE Max subscriptions per client | Not Supported | Not Supported |
| PINGREQ | Supported | Supported |
| DISCONNECT | Supported | Supported |
| DISCONNECT Session Expiry Interval | N/A | Supported |
