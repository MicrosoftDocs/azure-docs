---
title: Deployment planning - Persistence
description: Plan MQTT broker persistence settings for your Azure IoT Operations deployment.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 04/21/2026
ai-usage: ai-assisted
#customer intent: As an IT administrator, I want to understand MQTT broker persistence options so I can decide whether to enable data persistence before deploying Azure IoT Operations.
---

# Deployment planning - Persistence

Data persistence writes critical MQTT broker data to disk so it survives cluster restarts. Decide before deployment whether you need data persistence for the MQTT broker.

Persistence complements the broker's replication system. Replication keeps data available across nodes, but a cluster-wide shutdown can still cause data loss — persistence prevents that. Persistence is different from the [disk-backed message buffer](deployment-planning-disk-buffer.md), which uses disk as an extension of memory and doesn't provide durability guarantees.

Writing data to disk has a significant performance cost. The exact cost depends on the type and speed of the underlying storage.

> [!IMPORTANT]
> Persistence is enabled at deployment and can't be turned off afterward. Some related options can be changed later — see [Runtime persistence options](#runtime-persistence-options).

## Persistent volume settings

[!INCLUDE [Azure IoT Operations MQTT broker persistent volume settings](../includes/mqtt-broker-persistent-volume-settings.md)]

## Configure persistence

[!INCLUDE [Azure IoT Operations MQTT broker configure persistence](../includes/mqtt-broker-configure-persistence.md)]

## Encryption

[!INCLUDE [Azure IoT Operations MQTT broker persistence encryption](../includes/mqtt-broker-persistence-encryption.md)]

## Runtime persistence options

Some persistence options — retained messages, subscriber queues, and state store — can be configured after deployment. For details on those options, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

## Next steps

- [Review diagnostics settings](deployment-planning-diagnostics.md)
- [Review advanced MQTT options](deployment-planning-mqtt-options.md)
- [Review disk-backed message buffer settings](deployment-planning-disk-buffer.md)
- [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md)
