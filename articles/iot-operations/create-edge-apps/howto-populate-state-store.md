---
title: Populate the state store
description: Learn how to populate the state store with data
author: PatAltimore 
ms.author: patricka 
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
ms.date: 11/8/2024
ms.service: azure-iot-operations
---

# Populating the state store

The state store runs on the cluster and is accessed via MQTT broker using the MQTT5 protocol. There are currently two main ways of using the state store:

1. Using the Azure IoT Operations SDKs to interact with the state store in your edge applications.
1. Using the CLI tool to push data into the state store from an external computer.

## Azure IoT Operations SDKs

The SDKs are the recommended way to interact with the state store when developing edge applications. To read more about the SDKs and their available functions, refer to [Azure IoT Operations SDKs](overview-sdk-apps.md).

## State store CLI

The state store CLI tool allows you to interact with the state store from a shell running on any machine.

1. Generate an x.509 certificate chain for authenticating with MQTT broker
1. Create a `BrokerAuthentication` using x.509 certificates
1. Create a `BrokerListener` as a LoadBalancer to enable off-cluster access
1. Open ports so allow access to the MQTT broker.

For instructions on downloading and using the tool, refer to [state store CLI GitHub](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/state-store-cli).

