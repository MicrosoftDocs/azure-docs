---
title: Device connectivity in Azure IoT Central | Microsoft Docs
description: This article introduces key concepts relating to device connectivity in Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 11/30/2017
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: timlt
---

# Device connectivity in Azure IoT Central

This article introduces key concepts relating to device connectivity in Microsoft Azure IoT Central.

Every device that connects to your Azure IoT Central application, connects to the [endpoints](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-endpoints) that are exposed by the IoT hub Azure IoT Central uses. IoT Hub enables scalable, secure, and reliable connections from your connected devices.

## SDK support

The Azure Device SDKs offer the easiest way for you implement the code on your devices that connects to your Azure IoT Central application. The following device SDKs are available:

- [Azure IoT SDK for C](https://github.com/azure/azure-iot-sdk-c)
- [Azure IoT SDK for Python](https://github.com/azure/azure-iot-sdk-python)
- [Azure IoT SDK for Node.js](https://github.com/azure/azure-iot-sdk-node)
- [Azure IoT SDK for Java](https://github.com/azure/azure-iot-sdk-java)
- [Azure IoT SDK for .NET](https://github.com/azure/azure-iot-sdk-csharp)

Each device connects using a unique connection string that identifies the device. A device can only connect to the IoT hub where it is registered. When you create a real device in your Azure IoT Central application, the application generates a connection string for you to use.

## SDK features and IoT Hub connectivity

All device communication with IoT Hub uses the following IoT Hub connectivity options:

- [Device-to-cloud messaging](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)
- [Device twins](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-device-twins)

The following table summarizes how Azure IoT Central device features map on to IoT Hub features:

| Azure IoT Central | Azure IoT Hub |
| ----------- | ------- |
| Measurement: Telemetry | Device-to-cloud messaging |
| Device properties | Device twin reported properties |
| Settings | Device twin desired and reported properties |

To learn more about using the Device SDKs, see one of the following articles for example code:

- [Connect a generic Node.js client to your Azure IoT Central application](howto-connect-nodejs.md)
- [Connect a Raspberry Pi device to your Azure IoT Central application](howto-connect-raspberry-pi-python.md)
- [Connect a DevDiv kit device to your Azure IoT Central application](howto-connect-devkit.md).

The following video presents an overview of how to connect a real device to Azure IoT Central:

>[!VIDEO https://channel9.msdn.com/Shows/Internet-of-Things-Show/Connect-real-devices-to-Microsoft-IoT-Central/Player]

## Protocols

The Device SDKs support the following network protocols for connecting to an IoT hub:

- MQTT
- AMQP
- HTTPS

For information about these difference protocols and guidance on choosing one, see [Choose a communication protocol](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-protocols).

If your device can't use any of the supported protocols, you can use Azure IoT Edge to do protocol conversion. IoT Edge supports other intelligence-on-the-edge scenarios to offload processing to the edge from the Azure IoT Central application.

## Security

All data exchanged between devices and your Azure IoT Central is encrypted. IoT Hub authenticates every request from a device that connects to any of the device-facing IoT Hub endpoints. To avoid exchanging credentials over the wire, a device uses signed tokens to authenticate. For more information, see, [Control access to IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security).

> [!NOTE]
> Currently, devices that connect to Azure IoT Central must use SAS tokens. X.509 certificates are not supported for devices that connect to Azure IoT Central.

## Next steps

Now that you have learned about device connectivity in Azure IoT Central, here are the suggested next steps:

- [Prepare and connect a DevKit device](howto-connect-devkit.md)
- [Prepare and connect a Raspberry Pi](howto-connect-raspberry-pi-python.md)
- [Connect a generic Node.js client to your Azure IoT Central application](howto-connect-nodejs.md)
