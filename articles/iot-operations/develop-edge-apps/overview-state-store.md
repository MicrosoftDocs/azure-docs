---
title: Data persistence in the MQTT broker state store
description: Understand how to develop applications that persist data between sessions using the state store.
author: dominicbetts
ms.subservice: azure-mqtt-broker
ms.author: dobett
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 05/09/2025

#CustomerIntent: As an developer, I want understand how to develop application that persist data between sessions using the state store.
---

# Data persistence in the MQTT broker state store

The state store is a distributed storage system, deployed as part of Azure IoT Operations. Using the state store, applications can get, set, and delete key-value pairs, without needing to install more services, such as Redis. The state store also provides versioning of the data, and also the primitives for building distributed locks, ideal for highly available applications.

Like Redis, the state store uses in memory storage. Stopping or restarting the Kubernetes cluster causes the state store contents to be lost.

The state store is implemented via MQTTv5. Its service is integrated directly into MQTT broker and is automatically started when the broker starts. The state store provides the same high availability as the MQTT broker.

## Why use the state store?

The state store allows an edge application to persist data on the edge. Typical uses of the state store include:

* Creating stateless applications
* Sharing state between applications
* Developing highly available applications
* Storing data to be used by data flows

## State store authorization

The state store extends MQTT broker's authorization mechanism, allowing individual clients to have optional read and write access to specific keys. Read more on how to [configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md) for the state store.

## Interacting with the state store

A [state store CLI](https://github.com/Azure/iot-operations-sdks/blob/main/tools/statestore-cli/readme.md) tool is available which enables interaction with the state store from a shell running on an off-cluster computer.

## Related content

* [Learn about the MQTT broker state store protocol](reference-state-store-protocol.md)
* [Configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md)
