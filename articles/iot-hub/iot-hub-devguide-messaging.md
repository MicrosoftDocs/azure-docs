---
title: Understand Azure IoT Hub messaging
description: This article describes device-to-cloud and cloud-to-device messaging with IoT Hub. Includes information about message formats and supported communications protocols.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 12/20/2022
ms.custom: ['Role: Cloud Development']
---

# Send device-to-cloud and cloud-to-device messages with IoT Hub

IoT Hub allows for bi-directional communication with your devices. Use IoT Hub messaging to communicate with your devices by sending messages from your devices to your IoT solution back end, and by sending messages from your IoT solution back end to your devices. For more information about working with IoT Hub messages, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).

## Sending device-to-cloud messages to IoT Hub

IoT Hub has a built-in service endpoint that can be used by back-end services to read telemetry messages from your devices. This endpoint is compatible with [Azure Event Hubs](../event-hubs/index.yml) and you can use standard IoT Hub SDKs to [read from this built-in endpoint](iot-hub-devguide-messages-read-builtin.md).

IoT Hub also supports [custom endpoints](iot-hub-devguide-endpoints.md#custom-endpoints) that can be defined by users to send device telemetry data and events to Azure services using [message routing](iot-hub-devguide-messages-d2c.md).

## Sending cloud-to-device messages from IoT Hub

You can send [cloud-to-device](iot-hub-devguide-messages-c2d.md) messages from the IoT solution back end to your devices.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Core properties of IoT Hub messaging functionality are the reliability and durability of messages. These properties enable resilience to intermittent connectivity on the device side, and to load spikes in event processing on the cloud side. IoT Hub implements *at least once* delivery guarantees for both device-to-cloud and cloud-to-device messaging.

## Choosing the right type of IoT Hub messaging

Use device-to-cloud messages for sending time series telemetry and alerts from your device app, and cloud-to-device messages for one-way notifications to your device app.

* For more information about choosing between device-to-cloud messages, reported properties, or file upload, see [Device-to-cloud communications guidance](./iot-hub-devguide-d2c-guidance.md).

* For more information about choosing between cloud-to-device messages, desired properties, or direct methods, see [Cloud-to-device communications guidance](./iot-hub-devguide-c2d-guidance.md).

## Next steps

* Learn about IoT Hub [message routing](iot-hub-devguide-messages-d2c.md).

* Learn about IoT Hub [cloud-to-device messaging](iot-hub-devguide-messages-c2d.md).