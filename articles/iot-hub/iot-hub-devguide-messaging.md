---
title: Understand Azure IoT Hub messaging
titleSuffix: Azure IoT Hub
description: This article describes device-to-cloud and cloud-to-device messaging with IoT Hub, with information about message formats and supported communications protocols.
author: SoniaLopezBravo

ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 03/27/2025
ms.custom: ['Role: Cloud Development']
---

# Send and receive messages with IoT Hub

IoT Hub enables bi-directional communication with your devices. Use IoT Hub messaging to communicate with your devices by sending messages from your devices to your IoT solution back end, and by sending messages from your IoT solution back end to your devices.

## Send device-to-cloud messages to IoT Hub

IoT Hub has a built-in service endpoint that back-end services can use to read telemetry messages from your devices. This endpoint is compatible with [Azure Event Hubs](../event-hubs/index.yml) and you can use standard IoT Hub SDKs to read from this built-in endpoint.

IoT Hub also supports custom endpoints that users can define to send device telemetry data and events to Azure services using message routing.

Learn more from the following articles:

* [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).

* [Read device-to-cloud messages from the built-in endpoint](iot-hub-devguide-messages-read-builtin.md)

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing)

* [Use IoT Hub message routing to send device-to-cloud messages to Azure services](iot-hub-devguide-messages-d2c.md)

## Send cloud-to-device messages from IoT Hub

You can send cloud-to-device messages from the IoT solution back end to your devices.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Core properties of IoT Hub messaging functionality are the reliability and durability of messages. These properties enable resilience to intermittent connectivity on the device side, and to load spikes in event processing on the cloud side. IoT Hub implements *at least once* delivery guarantees for both device-to-cloud and cloud-to-device messaging.

Learn more from the following articles:

* [Understand cloud-to-device messaging from an IoT hub](iot-hub-devguide-messages-c2d.md)

## Choose the right type of IoT Hub messaging

Use device-to-cloud messages for sending time series telemetry and alerts from your device app, and cloud-to-device messages for one-way notifications to your device app.

Learn more from the following articles:

* Understand the use cases for device-to-cloud messages, reported properties, and file upload: [Device-to-cloud communications guidance](./iot-hub-devguide-d2c-guidance.md).

* Understand the use cases for cloud-to-device messages, desired properties, and direct methods: [Cloud-to-device communications guidance](./iot-hub-devguide-c2d-guidance.md).
