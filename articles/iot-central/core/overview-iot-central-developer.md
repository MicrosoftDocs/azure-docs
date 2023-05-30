---
title: Device connectivity guide
description: This guide describes how IoT devices connect to and communicate with your IoT Central application. The article describes telemetry, properties, and commands.
author: dominicbetts
ms.author: dobett
ms.date: 02/13/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, device-developer, iot-central-frontdoor]

# This article applies to device developers.
---

# IoT Central device connectivity guide

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is for device developers who implement the code to run on devices that connect to IoT Central.

Devices interact with an IoT Central application by using the following primitives:

- _Telemetry_ is data that a device sends to IoT Central. For example, a stream of temperature values from an onboard sensor.
- _Properties_ are state values that a device reports to IoT Central. For example, the current firmware version of the device. You can also have writable properties that IoT Central can update on the device such as a target temperature.
- _Commands_ are called from IoT Central to control the behavior a device. For example, your IoT Central application might call a command to reboot a device.

## Types of device

The following sections describe the main types of device you can connect to an IoT Central application:

### IoT device

An IoT device is a standalone device that connects directly to IoT Central. An IoT device typically sends telemetry from its onboard or connected sensors to your IoT Central application. Standalone devices can also report property values, receive writable property values, and respond to commands.

### IoT Edge device

An IoT Edge device connects directly to IoT Central. An IoT Edge device can send its own telemetry, report its properties, and respond to writable property updates and commands. IoT Edge modules process data locally on the IoT Edge device. An IoT Edge device can also act as an intermediary for other devices known as downstream devices. Scenarios that use IoT Edge devices include:

- Aggregate or filter telemetry before it's sent to IoT Central. This approach can help reduce the costs of sending data to IoT Central.
- Enable devices that can't connect directly to IoT Central to connect through the IoT Edge device. For example, a downstream device might use bluetooth to connect to the IoT Edge device, which then connects over the internet to IoT Central.
- Control downstream devices locally to avoid the latency associated with connecting to IoT Central over the internet.

IoT Central only sees the IoT Edge device, not the downstream devices connected to the IoT Edge device.

To learn more, see [Add an Azure IoT Edge device to your Azure IoT Central application](/training/modules/connect-iot-edge-device-to-iot-central/).

### Gateways

A gateway device manages one or more downstream devices that connect to your IoT Central application. A gateway device can process the telemetry from the downstream devices before it's forwarded to your IoT Central application. Both IoT devices and IoT Edge devices can act as gateways. To learn more, see [Define a new IoT gateway device type in your Azure IoT Central application](./tutorial-define-gateway-device-type.md) and [How to connect devices through an IoT Edge transparent gateway](how-to-connect-iot-edge-transparent-gateway.md).

## How devices connect

As you connect a device to IoT Central, it goes through the following stages: _registered_, _provisioned_, and _connected_.

To learn how to monitor the status of a device, see [Monitor your devices](howto-manage-devices-individually.md#monitor-your-devices).

### Register a device

When you register a device with IoT Central, you're telling IoT Central the ID of a device that you want to connect to the application. Optionally at this stage, you can assign the device to a [device template](concepts-device-templates.md) that declares the capabilities of the device to your application.

> [!TIP]
> A device ID can contain letters, numbers, and the `-` character.

There are three ways to register a device in an IoT Central application:

- Automatically register devices when they first try to connect. This scenario enables OEMs to mass manufacture devices that can connect without being registered first. To learn more, see [Automatically register devices](concepts-device-authentication.md#automatically-register-devices).
- Add devices in bulk from a CSV file. To learn more, see [Import devices](howto-manage-devices-in-bulk.md#import-devices).
- Use the **Devices** page in your IoT Central application to register devices individually. To learn more, see [Add a device](howto-manage-devices-individually.md#add-a-device).

  Optionally, you can require an operator to approve the device before it starts sending data.

  > [!TIP]
  > On the **Permissions > Device connection groups** page, the **Auto approve** option controls whether an operator must manually approve the device before it can start sending data.

You only need to register a device once in your IoT Central application.

### Provision a device

When a device first tries to connect to your IoT Central application, it starts the process by connecting to the Device Provisioning Service (DPS). DPS checks the device's credentials and, if they're valid, provisions the device with the connection string for one of IoT Central's internal IoT hubs. DPS uses the _group enrollment_ configurations in your IoT Central application to manage this provisioning process for you.

> [!TIP]
> The device also sends the **ID scope** value that tells DPS which IoT Central application the device is connecting to. You can look up the **ID scope** in your IoT Central application on the **Permissions > Device connection groups** page.

Typically, a device should cache the connection string it receives from DPS but should be prepared to retrieve new connection details if the current connection fails. To learn more, see [Handle connect failures](concepts-device-implementation.md#handle-connection-failures).

Using DPS enables:

- IoT Central to onboard and connect devices at scale.
- You to generate device credentials and configure the devices offline without registering the devices through the IoT Central UI.
- You to use your own device IDs to register devices in IoT Central. Using your own device IDs simplifies integration with existing back-office systems.
- A single, consistent way to connect devices to IoT Central.

### Authenticate and connect device

A device uses its credentials and the connection string it received from DPS to connect to and authenticate with your IoT Central application. A device should also send a [model ID that identifies the device template it's assigned to](concepts-device-templates.md#assign-a-device-to-a-device-template).

IoT Central supports two types of device credential:

- Shared access signatures
- X.509 certificates

To learn more, see [Device authentication concepts](concepts-device-authentication.md).

All data exchanged between devices and your Azure IoT Central is encrypted. IoT Hub authenticates every request from a device that connects to any of the device-facing IoT Hub endpoints. To avoid exchanging credentials over the wire, a device uses signed tokens to authenticate. For more information, see, [Control access to IoT Hub](../../iot-hub/iot-hub-devguide-security.md).

## Connectivity patterns

Device developers typically use one of the device SDKs to implement devices that connect to an IoT Central application. Some scenarios, such as for devices that can't connect to the internet, also require a gateway.

A solution design must take into account the required device connectivity pattern. These patterns fall into two broad categories. Both categories include devices sending telemetry to your IoT Central application:

### Persistent connections

Persistent connections are required your solution needs _command and control_ capabilities. In command and control scenarios, the IoT Central application sends commands to devices to control their behavior in near real time. Persistent connections maintain a network connection to the cloud and reconnect whenever there's a disruption. Use either the MQTT or the AMQP protocol for persistent device connections to IoT Central.

The following options support persistent device connections:

- Use the IoT device SDKs to connect devices and send telemetry:

  The device SDKs enable both the MQTT and AMQP protocols for creating persistent connections to IoT Central.

- Connect devices over a local network to an IoT Edge device that forwards telemetry to IoT Central:

  An IoT Edge device can make a persistent connection to IoT Central. For devices that can't connect to the internet or that require network isolation, use an IoT Edge device as a local gateway. The gateway forwards device telemetry to IoT Central. This option enables command and control of the downstream devices connected to the IoT Edge device.

  To learn more, see [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md).

- Use IoT Central Device Bridge to connect devices that use a custom protocol:

  Some devices use a protocol or encoding, such as LWM2M or COAP, that IoT Central doesn't currently support. IoT Central Device Bridge acts as a translator that forwards telemetry to IoT Central.

  To learn more, see the [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge) GitHub repository.

### Ephemeral connections

Ephemeral connections are brief connections for devices to send telemetry to your IoT Central application. After a device sends the telemetry, it drops the connection. The device reconnects when it has more telemetry to send. Ephemeral connections aren't suitable for command and control scenarios.

The following options support ephemeral device connections:

- Connect devices and send telemetry by using HTTP:

  IoT Central supports device clients that use the HTTP API to send telemetry. To learn more, see the [Send Device Event](/rest/api/iothub/device/send-device-event) API documentation.

  > [!NOTE]
  > Use DPS to provision and register your device with IoT Central before you use the HTTP API to send telemetry.

- Use IoT Central Device Bridge in stateless mode to connect devices:
  
  Deploy IoT Central Device Bridge as an Azure Function. The function accepts incoming telemetry data as HTTP requests and forwards it to IoT Central. IoT Central Device Bridge integrates with DPS and automatically handles device provisioning for you.

  To learn more, see [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge) GitHub repository.

- Use IoT Central Device Bridge in stateless mode to connect external clouds:
  
  Use Azure IoT Central Device Bridge to forward messages to IoT Central from other IoT clouds, such as SigFox, Particle, and The Things Network.

  To learn more, see [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge) GitHub repository.

### Data transformation and custom computation on ingress

Some scenarios require device telemetry augmented with data from external systems or stores. Augmenting telemetry before it reaches IoT Central enables features such as dashboards and rules to use the augmented data.

Some scenarios require you to transform telemetry before it reaches IoT Central. For example, transforming telemetry from legacy formats.

The following options are available for custom transformations or computations before IoT Central ingests the telemetry:

- Use IoT Edge:
  
  Use custom modules in IoT Edge for custom transformations and computations. Use IoT Edge when your devices use the Azure IoT device SDKs.

- Use IoT Central Device Bridge:
  
  Use IoT Central Device Bridge adapters for custom transformations and computations.

To learn more, see [Transform data for IoT Central](howto-transform-data.md).

## Next steps

If you're a device developer and want to dive into some code, the suggested next step is to [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md).

If you want to learn more about device implementation, see [Device implementation and best practices for IoT central](concepts-device-implementation.md).

To learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
