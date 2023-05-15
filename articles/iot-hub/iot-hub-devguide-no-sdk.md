---
title: Develop without an Azure IoT SDK
description: This article provides information about and links to topics that you can use to build device apps and back-end apps without using an Azure IoT SDK.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 10/12/2020
ms.custom: [mqtt, amqp, 'Role: IoT Device', 'Role: Cloud Development']
---

# Develop without using an Azure IoT Hub SDK

This topic provides helpful information and links for developers who want to develop device or back-end apps without using the Azure IoT SDKs.

Microsoft strongly advises using an Azure IoT SDK. The Azure IoT device and service SDKs are published on many popular platforms. The SDKs provide a convenience layer that handles much of the complexity of the underlying communication protocol, including device connection and reconnection, and retry policy. The SDKs are regularly updated to provide the latest features exposed by IoT Hub as well as security updates. Using the SDKs can help you reduce development time and time devoted to code maintenance. To learn more about the Azure IoT SDKs, see [Azure IoT Device and Service SDKs](iot-hub-devguide-sdks.md). For more detail about the advantages of using an Azure IoT SDK, see the [Benefits of using the Azure IoT SDKs and pitfalls to avoid if you don’t](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/) blog post.

Although IoT Hub supports AMQP, AMQP over WebSockets, HTTPS, MQTT, and MQTT over WebSockets for communication with devices, we recommend using MQTT if your device supports it.

## Development prerequisites

Before you begin development, you should have a thorough knowledge of IoT Hub and the features you want your device or back-end app to implement. Here's a very abbreviated list of topics that you should be familiar with:

* Make sure you understand the endpoints exposed by IoT Hub and the protocols supported on each endpoint. To learn more, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* Where a choice of protocol is involved for device apps, we strongly recommend that you use MQTT. Before choosing a protocol, though, make sure you understand the limitations imposed by each. To learn more, see [Choose a communication protocol](iot-hub-devguide-protocols.md).

* To understand authentication with IoT Hub, see [Control access to IoT Hub](iot-hub-devguide-security.md).

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

## Help on different protocols

For help using the following protocols without an Azure IoT SDK:

* Device or back-end apps on **AMQP**, see [AMQP support](iot-hub-amqp-support.md).

* Device apps on **MQTT**, see [MQTT support](../iot/iot-mqtt-connect-to-iot-hub.md). Most of this topic treats using the MQTT protocol directly. It also contains information about using the [IoT MQTT Sample repository](https://github.com/Azure-Samples/IoTMQTTSample). This repository contains C samples that use the Eclipse Mosquitto library to send messages to IoT Hub.

* Device or back-end apps on **HTTPS**, consult the [Azure IoT Hub REST APIs](/rest/api/iothub/). Be aware, as noted in [Development prerequisites](#development-prerequisites), that you can't use X.509 certificate authority (CA) authentication with HTTPS.

For devices, we strongly recommend using MQTT if your device supports it.

## Next steps

* [MQTT support](../iot/iot-mqtt-connect-to-iot-hub.md)