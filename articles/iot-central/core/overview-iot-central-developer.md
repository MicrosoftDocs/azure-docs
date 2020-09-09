---
title: Device development for Azure IoT Central | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of developing devices to connect to your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 05/05/2020
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# IoT Central device development overview

*This article applies to device developers.*

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This overview is intended for device developers who implement code to run on devices that connect to IoT Central.

Devices interact with an IoT Central application using the following primitives:

- _Telemetry_ is data that a device sends to IoT Central. For example, a stream of temperature values from an onboard sensor.
- _Properties_ are state values that a device reports to IoT Central. For example, the current firmware version of the device. You can also have writable properties that IoT Central can update on the device.
- _Commands_ are called from IoT Central to control the behavior a device. For example, your IoT Central application might call a command to reboot a device.

A solution builder is responsible for configuring dashboards and views in the IoT Central web UI to visualize telemetry, manage properties, and call commands.

## Types of device

The following sections describe the main types of device you can connect to an IoT Central application:

### Standalone device

A standalone device connects directly to IoT Central. A standalone device typically sends telemetry from its onboard or connected sensors to your IoT Central application. Standalone devices can also report property values, receive writable property values, and respond to commands.

### Gateway device

A gateway device manages one or more downstream devices that connect to your IoT Central application. You use IoT Central to configure the relationships between the downstream devices and the gateway device. To learn more, see [Define a new IoT gateway device type in your Azure IoT Central application](./tutorial-define-gateway-device-type.md).

### Edge device

An edge device connects directly to IoT Central, but acts as an intermediary for other devices known as _leaf devices_. An edge device is typically located close to the leaf devices for which it's acting as an intermediary. Scenarios that use edge devices include:

- Enable devices that can't connect directly to IoT Central to connect through the edge device. For example, a leaf device might use bluetooth to connect to the edge device, which then connects over the internet to IoT Central.
- Aggregate telemetry before it's sent to IoT Central. This approach can help to reduce the costs of sending data to IoT Central.
- Control leaf devices locally to avoid the latency associated with connecting to IoT Central over the internet.

An edge device can also send its own telemetry, report its properties, and respond to writable property updates and commands.

IoT Central only sees the edge device, not the leaf devices connected to the edge device.

To learn more, see [Add an Azure IoT Edge device to your Azure IoT Central application](./tutorial-add-edge-as-leaf-device.md).

## Connect a device

Azure IoT Central uses the [Azure IoT Hub Device Provisioning service (DPS)](../../iot-dps/about-iot-dps.md) to manage all device registration and connection.

Using DPS enables:

- IoT Central to support onboarding and connecting devices at scale.
- You to generate device credentials and configure the devices offline without registering the devices through IoT Central UI.
- You to use your own device IDs to register devices in IoT Central. Using your own device IDs simplifies integration with existing back-office systems.
- A single, consistent way to connect devices to IoT Central.

To learn more, see [Get connected to Azure IoT Central](./concepts-get-connected.md).

### Security

The connection between a device and your IoT Central application is secured using either [shared access signatures](./concepts-get-connected.md#connect-devices-at-scale-using-sas) or industry-standard [X.509 certificates](./concepts-get-connected.md#connect-devices-using-x509-certificates).

### Communication protocols

Communication protocols that a device can use to connect to IoT Central include MQTT, AMQP, and HTTPS. Internally, IoT Central uses an IoT hub to enable device connectivity. For more information about the communication protocols that IoT Hub supports for device connectivity, see [Choose a communication protocol](../../iot-hub/iot-hub-devguide-protocols.md).

## Implement the device

Use one of the [Azure IoT device SDKs](#languages-and-sdks) to implement the behavior of your device. The code should:

- Register the device with DPS and use the information from DPS to connect to the internal IoT hub in your IoT Central application.
- Send telemetry in the format that the device template in IoT Central specifies. IoT Central uses the device template to determine how to use the telemetry for visualizations and analysis.
- Synchronize property values between the device and IoT Central. The device template specifies the property names and data types so that IoT Central can display the information.
- Implement command handlers for the commands specifies in the device template. The device template specifies the command names and parameters that the device should use.

For more information about the role of device templates, see [What are device templates?](./concepts-device-templates.md).

For some sample code, see [Create and connect a Node.js client application](./tutorial-connect-device-nodejs.md) or [Create and connect a Python client application](./tutorial-connect-device-python.md).

### Languages and SDKs

For more information about the supported languages and SDKs, see [Understand and use Azure IoT Hub device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks).

## Next steps

If you're a device developer and want to dive into some code, the suggested next step is to [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device-nodejs.md).

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
