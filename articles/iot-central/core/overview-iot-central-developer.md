---
title: Device development for Azure IoT Central | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of developing devices to connect to your IoT Central application. Devices use telemetry to send streaming data and properties to report device state. Iot Central can set device state using writable properties and call commands on a device.
author: dominicbetts
ms.author: dobett
ms.date: 05/05/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, device-developer]
---

# IoT Central device development guide

*This article applies to device developers.*

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is intended for device developers who implement code to run on devices that connect to IoT Central.

Devices interact with an IoT Central application using the following primitives:

- _Telemetry_ is data that a device sends to IoT Central. For example, a stream of temperature values from an onboard sensor.
- _Properties_ are state values that a device reports to IoT Central. For example, the current firmware version of the device. You can also have writable properties that IoT Central can update on the device such as a target temperature.
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

To learn more, see [Get connected to Azure IoT Central](./concepts-get-connected.md) and [Best practices](concepts-best-practices.md).

### Security

The connection between a device and your IoT Central application is secured using either [shared access signatures](./concepts-get-connected.md#sas-group-enrollment) or industry-standard [X.509 certificates](./concepts-get-connected.md#x509-group-enrollment).

### Communication protocols

Communication protocols that a device can use to connect to IoT Central include MQTT, AMQP, and HTTPS. Internally, IoT Central uses an IoT hub to enable device connectivity. For more information about the communication protocols that IoT Hub supports for device connectivity, see [Choose a communication protocol](../../iot-hub/iot-hub-devguide-protocols.md).

## Implement the device

An IoT Central device template includes a _model_ that specifies the behaviors a device of that type should implement. Behaviors include telemetry, properties, and commands.

> [!TIP]
> You can export the model from IoT Central as a [Digital Twins Definition Language (DTDL) v2](https://github.com/Azure/opendigitaltwins-dtdl) JSON file.

Each model has a unique _device twin model identifier_ (DTMI), such as `dtmi:com:example:Thermostat;1`. When a device connects to IoT Central, it sends the DTMI of the model it implements. IoT Central can then associate the correct device template with the device.

[IoT Plug and Play](../../iot-pnp/overview-iot-plug-and-play.md) defines a set of conventions that a device should follow when it implements a DTDL model.

The [Azure IoT device SDKs](#languages-and-sdks) include support for the IoT Plug and Play conventions.

### Device model

A device model is defined using the [DTDL](https://github.com/Azure/opendigitaltwins-dtdl). This language lets you define:

- The telemetry the device sends. The definition includes the name and data type of the telemetry. For example, a device sends temperature telemetry as a double.
- The properties the device reports to IoT Central. A property definition includes its name and data type. For example, a device reports the state of a valve as a Boolean.
- The properties the device can receive from IoT Central. Optionally, you can mark a property as writable. For example, IoT Central sends a target temperature as a double to a device.
- The commands a device responds to. The definition includes the name of the command, and the names and data types of any parameters. For example, a device responds to a reboot command that specifies how many seconds to wait before rebooting.

A DTDL model can be a _no-component_ or a _multi-component_ model:

- No-component model: A simple model doesn't use embedded or cascaded components. All the telemetry, properties, and commands are defined a single _default component_. For an example, see the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) model.
- Multi-component model. A more complex model that includes two or more components. These components include a single default component, and one or more additional nested components. For an example, see the [Temperature Controller](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) model.

To learn more, see [IoT Plug and Play modeling guide](../../iot-pnp/concepts-modeling-guide.md)

### Conventions

A device should follow the IoT Plug and Play conventions when it exchanges data with IoT Central. The conventions include:

- Send the DTMI when it connects to IoT Central.
- Send correctly formatted JSON payloads and metadata to IoT Central.
- Correctly respond to writable properties and commands from IoT Central.
- Follow the naming conventions for component commands.

> [!NOTE]
> Currently, IoT Central does not fully support the DTDL **Array** and **Geospatial** data types.

To learn more about the format of the JSON messages that a device exchanges with IoT Central, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md).

To learn more about the IoT Plug and Play conventions, see [IoT Plug and Play conventions](../../iot-pnp/concepts-convention.md).

### Device SDKs

Use one of the [Azure IoT device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) to implement the behavior of your device. The code should:

- Register the device with DPS and use the information from DPS to connect to the internal IoT hub in your IoT Central application.
- Announce the DTMI of the model the device implements.
- Send telemetry in the format that the device model specifies. IoT Central uses the model in the device template to determine how to use the telemetry for visualizations and analysis.
- Synchronize property values between the device and IoT Central. The model specifies the property names and data types so that IoT Central can display the information.
- Implement command handlers for the commands specified in the model. The model specifies the command names and parameters that the device should use.

For more information about the role of device templates, see [What are device templates?](./concepts-device-templates.md).

For some sample code, see [Create and connect a client application](./tutorial-connect-device.md).

### Languages and SDKs

For more information about the supported languages and SDKs, see [Understand and use Azure IoT Hub device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks).

## Next steps

If you're a device developer and want to dive into some code, the suggested next step is to [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md).

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
