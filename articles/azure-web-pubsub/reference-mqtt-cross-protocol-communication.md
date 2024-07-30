---
title: Cross-protocol communication between MQTT clients and Web PubSub clients
description: Describes the behavior of cross-protocol communication between MQTT clients and Web PubSub clients
keywords: MQTT, MQTT on Azure Web PubSub, MQTT over WebSocket
author: Y-Sindo
ms.author: zityang
ms.date: 07/30/2024
ms.service: azure-web-pubsub
ms.topic: reference
---

# Cross-protocol Communication Between MQTT Clients and Web PubSub Clients

Sometimes you'd like to have MQTT clients and other clients using Azure Web PubSub's protocols together in one hub, enabling cross-protocol communication. This document defines the behavior of such communication.

## Concepts

First, we need to clarify the concepts of our subjects in the context of cross-protocol communication.

* **MQTT Clients**: Clients using [MQTT](https://mqtt.org/) protocols.
* **Web PubSub Clients**: Clients using Web PubSub's own protocols with pub/sub capabilities. Examples include `json.webpubsub.azure.v1`, `protobuf.webpubsub.azure.v1`, `json.reliable.webpubsub.azure.v1`, and `protobuf.reliable.webpubsub.azure.v1`. An overview of Web PubSub's client protocols can be found [here](./concept-client-protocols.md).
* **Reliable Web PubSub Clients**: A subset of Web PubSub Clients using Web PubSub reliable protocols, specifically `json.reliable.webpubsub.azure.v1` and `protobuf.reliable.webpubsub.azure.v1`.

## Concept Mappings

### Message Routing Behavior

From the [Overview: MQTT in Azure Web PubSub Service](./overview-mqtt.md), we learn that joining a group in Web PubSub's protocols has the same effect as subscribing to the same named topic in MQTT. Similarly, sending to a group corresponds to publishing to the same named topic. This means if a client using Web PubSub protocols joins group `a`, it will receive messages from MQTT clients sending to topic `a`, and vice versa.

### Message Content Type Conversion

In Web PubSub protocols, there are four message data types: Text, Binary, JSON, and Protobuf.

In MQTT protocols, there's no such field to indicate message content type in MQTT 3.1.1, but there's a string "content type" field in MQTT 5.0.

We define a conversion between the MQTT "content type" field and Web PubSub message data type:

| MQTT "content type"            | Web PubSub "message data type" |
|--------------------------------|--------------------------------|
| `application/json`             | JSON                           |
| `text/plain`                   | Text                           |
| `application/x-protobuf`       | Protobuf                       |
| `application/octet-stream`     | Binary                         |
| Absent or MQTT 3.1.1           | Binary                         |

### Message Content Conversion

For text-based Web PubSub message data types, including `Text` and `Json`, they are converted to and from MQTT by UTF-8 encoding. For binary-based Web PubSub message data types, including `Protobuf` and `Binary`, they are exactly the same in the MQTT message content.

### Message Quality of Service (QoS) Conversion

In Web PubSub protocols, the QoS of a message received by a client is determined by the client's protocol. Reliable clients receive only QoS 1 messages, while other clients receive only QoS 0 messages.

In MQTT protocols, the QoS of a message received by a client is determined by both the message QoS (sending QoS) and the granted subscription QoS, specifically the smaller value of the two.

When messages are transferred across protocols, the received QoS is defined as follows:

| Message Sender | Message Receiver | QoS Evaluation |
|----------------|------------------|----------------|
| MQTT Clients   | Reliable Web PubSub Clients | QoS is always 1 |
| MQTT Clients   | Other Web PubSub Clients    | QoS is always 0 |
| Web PubSub Clients | MQTT Clients           | Min(1, granted subscription QoS) |

### Others

Message properties listed here take effect across protocols, the others don't.

* MQTT Message expiry interval
