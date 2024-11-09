---
title: Persisting data in the state store
description: Using the state store to persist data between sessions
author: PatAltimore
ms.subservice: azure-mqtt-broker
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/22/2024

#CustomerIntent: As an developer, I want understand how to develop application that persist data between sessions using the state store.
ms.service: azure-iot-operations
---

# Storing data in the state store

The state store is a distributed storage system, deployed as part of Azure IoT Operations. Using the state store, applications can get, set and delete key-value pairs, without needing to install additional services, such as Redis. The state store also provides versioning of the data, and also the primitives for building distributed locks, ideal for highly available applications.

Like Redis, the state store uses in memory storage. Stopping or restarting the Kubernetes cluster will cause the state store data to be lost.

The state store is implemented via MQTTv5. Its service is integrated directly into MQTT broker and is automatically started when the broker starts. The state store provides the same high availability as the MQTT broker.

## Why use the state store?

The state store allows an edge application to persist data on the edge. Typical uses of the state store include:

1. Creating stateless applications
1. Sharing state between applications
1. Developing highly available applications
1. Store data to be used by dataflow

## Interacting with the state store

The state store protocol is documented in [state store protocol](concept-about-state-store-protocol.md). SDKs are available for the state store for Go, C#, and Rust. Using an SDK is the recommended method of interacting with the state store, as implementing the interface can be complex.

Additional information about the [Azure IoT Operations SDKs](overview-sdk-apps.md) is available.

## State store authorization

The state store extends MQTT broker's authorization mechanism, allowing individual clients to have optional read and write access to specific keys. Read more on how to [Configure MQTT broker authorization](manage-mqtt-broker/howto-configure-authorization.md).

## Related content

* [Learn about the MQTT broker state store protocol](concept-about-state-store-protocol.md)
* [Learn how to populate the state store with data](howto-populate-state-store.md)
* [Configure MQTT broker authorization](manage-mqtt-broker/howto-configure-authorization.md)
