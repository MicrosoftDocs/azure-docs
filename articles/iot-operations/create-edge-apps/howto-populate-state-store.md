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

The state store runs on the cluster and is accessed via MQTT broker using the MQTT5 protocol. The current method to populate the state store is using a CLI application.



## State store CLI

The state store CLI tool allows you to interact with the state store from a shell running on any machine.

1. Generate an x.509 certificate chain for authenticating with MQTT broker
1. Create a `BrokerAuthentication` using x.509 certificates
1. Create a `BrokerListener` as a LoadBalancer to enable off-cluster access
1. Open ports so allow access to the MQTT broker.

For instructions on downloading and using the tool, refer to [state store CLI GitHub](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/state-store-cli).

