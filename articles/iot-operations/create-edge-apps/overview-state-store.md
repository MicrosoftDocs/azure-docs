---
title: Persisting data in the MQTT broker state store
description: Understand how to develop application that persist data between sessions using the state store.
author: PatAltimore
ms.subservice: azure-mqtt-broker
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 11/12/2024

#CustomerIntent: As an developer, I want understand how to develop application that persist data between sessions using the state store.
ms.service: azure-iot-operations
---

# Persisting data in the state store

The state store is a distributed storage system, deployed as part of Azure IoT Operations. Using the state store, applications can get, set, and delete key-value pairs, without needing to install more services, such as Redis. The state store also provides versioning of the data, and also the primitives for building distributed locks, ideal for highly available applications.

Like Redis, the state store uses in memory storage. Stopping or restarting the Kubernetes cluster causes the state store contents to be lost.

The state store is implemented via MQTTv5. Its service is integrated directly into MQTT broker and is automatically started when the broker starts. The state store provides the same high availability as the MQTT broker.

## Why use the state store?

The state store allows an edge application to persist data on the edge. Typical uses of the state store include:

* Creating stateless applications
* Sharing state between applications
* Developing highly available applications
* Storing data to be used by dataflows

## State store authorization

The state store extends MQTT broker's authorization mechanism, allowing individual clients to have optional read and write access to specific keys. Read more on how to [configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md) for the state store.

## Interacting with the state store

A [state store CLI](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/statestore-cli) tool is available which enables interaction with the state store from a shell running on a off-cluster computer. The documentation will guide you through:

1. Generating an X.509 certificate chain for authenticating with MQTT broker
1. Creating a `BrokerAuthentication` using x.509 certificates
1. Creating a `BrokerListener` of type LoadBalancer to enable off-cluster access

For instructions on using the tool, refer to the [state store CLI GitHub](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/statestore-cli) page.

> [!NOTE]
> SDKs to interact with the state store are currently in active development, and will be available in the near future to enable edge applications to interact with the state store.

## Related content

* [Learn about the MQTT broker state store protocol](concept-about-state-store-protocol.md)
* [Configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md)
