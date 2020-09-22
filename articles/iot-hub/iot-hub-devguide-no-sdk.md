---
title: Develop without the Azure IoT SDKs | Microsoft Docs
description: Developer guide - information about and links to topics that you can use to build device apps and back-end apps without using an Azure IoT SDK.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/21/2020
ms.custom: [mqtt, amqp, 'Role: IoT Device', 'Role: Cloud Development']
---

# Develop without using an Azure IoT Hub SDK

This topic provides helpful information and links for developers who want to develop device or back-end apps without using the Azure IoT SDKs.

Microsoft strongly advises using an Azure IoT SDK. The Azure IoT SDKs are published on many popular platforms. They're regularly updated to provide the latest features exposed by IoT Hub as well as security updates. To learn more, see [Azure IoT Device and Service SDKs](iot-hub-devguide-sdks.md).

## Development prerequisites

Before you begin development, you should have a thorough knowledge of IoT Hub and the features you want your device or back-end app to implement. The following is an extremely abbreviated list of topics that you should be familiar with:

* Make sure you understand the endpoints exposed by IoT Hub and the protocols supported on each endpoint. To learn more, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* Where a choice of protocol is involved for device apps, make sure you also understand the limitations imposed by each protocol. To learn more, see [Choose a communication protocol](iot-hub-devguide-protocols.md)

* To understand authentication with IoT Hub, see [Control access to IoT Hub](iot-hub-devguide-security.md).

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

## Help on different protocols

For help using the following protocols directly without an Azure IoT SDK:

* Device or back-end apps on **AMQP**, see [AMQP support](iot-hub-amqp-support.md).

* Device apps on **MQTT**, see [MQTT support](iot-hub-mqtt-support.md). Most of this topic treats using the MQTT protocol directly. It also contains information about using the [IoT MQTT Sample repository](https://github.com/Azure-Samples/IoTMQTTSample). This repository contains C samples that use the Eclipse Mosquitto library to send messages to IoT Hub.

* Device or back-end apps on **HTTPS**, consult the [Azure IoT Hub REST APIs](https://docs.microsoft.com/rest/api/iothub/). Be aware, as noted in [Development prerequisites](#development-prerequisites), that you can't use X.509 certificate authority (CA) authentication with HTTPS.
