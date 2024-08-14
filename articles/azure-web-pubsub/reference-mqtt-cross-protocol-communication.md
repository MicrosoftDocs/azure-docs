---
title: Cross-protocol communication between MQTT clients and Azure Web PubSub clients
description: Describes the behavior of cross-protocol communication between MQTT clients and Web PubSub clients
keywords: MQTT, MQTT on Azure Web PubSub, MQTT over WebSocket
author: Y-Sindo
ms.author: zityang
ms.date: 07/30/2024
ms.service: azure-web-pubsub
ms.topic: reference
---

# Cross-protocol communication between MQTT clients and Web PubSub clients

Sometimes you'd like to have MQTT clients and other clients using Azure Web PubSub's protocols together in one hub, enabling cross-protocol communication. This document defines how such communication works.

## Concepts

First, let's clarify the concepts in the context of cross-protocol communication.

* **MQTT clients**: Clients using [MQTT](https://mqtt.org/) protocols.
* **Web PubSub clients**: Clients using Web PubSub's own protocols with pub/sub capabilities. Examples include `json.webpubsub.azure.v1`, `protobuf.webpubsub.azure.v1`, `json.reliable.webpubsub.azure.v1`, and `protobuf.reliable.webpubsub.azure.v1`. You can find an overview of Web PubSub's client protocols [here](./concept-client-protocols.md).
* **Reliable Web PubSub clients**: A subset of Web PubSub clients using Web PubSub reliable protocols, specifically `json.reliable.webpubsub.azure.v1`, and `protobuf.reliable.webpubsub.azure.v1`.

## Concept mappings

### Message routing behavior

From the [Overview: MQTT in Azure Web PubSub Service](./overview-mqtt.md), we learn that joining a group in Web PubSub's protocols works the same as subscribing to the same named topic in MQTT. Similarly, sending to a group means publishing to the same named topic. This means if a client using Web PubSub protocols joins group `a`, it'll' get messages from MQTT clients sending to topic `a`, and vice versa.

### Message content type conversion

In Web PubSub protocols, there are four message data types: Text, Binary, JSON, and Protobuf.

In MQTT protocols, there's no field to indicate message content type in MQTT 3.1.1, but there's a string "content type" field in MQTT 5.0.

Here's the conversion between the MQTT "content type" field and Web PubSub message data type:

| MQTT "content type"            | Web PubSub "message data type" |
|--------------------------------|--------------------------------|
| `application/json`             | JSON                           |
| `text/plain`                   | Text                           |
| `application/x-protobuf`       | Protobuf                       |
| `application/octet-stream`     | Binary                         |
| Absent or MQTT 3.1.1           | Binary                         |

### Message content conversion

For text-based Web PubSub message data types, including `Text` and `Json`, they convert to and from MQTT by UTF-8 encoding. For binary-based Web PubSub message data types, including `Protobuf` and `Binary`, they remain exactly the same in the MQTT message content.

### Message quality of service (QoS) conversion

In Web PubSub protocols, the QoS of a message a client receives is determined by the client's protocol. Reliable clients get only QoS 1 messages, while other clients get only QoS 0 messages.

In MQTT protocols, the QoS of a message a client receives is determined by both the message QoS (sending QoS) and the granted subscription QoS, specifically the smaller value of the two.

When messages transfer across protocols, the received QoS is defined as follows:

| Message sender | Message receiver | QoS evaluation |
|----------------|------------------|----------------|
| MQTT clients   | Reliable Web PubSub clients | QoS is always 1 |
| MQTT clients   | Other Web PubSub clients    | QoS is always 0 |
| Web PubSub clients | MQTT clients           | Min(1, granted subscription QoS) |

### Others

Message properties listed here take effect across protocols. The others don't.

* MQTT message expiry interval
