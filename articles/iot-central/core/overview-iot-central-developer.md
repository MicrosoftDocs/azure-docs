---
title: Azure IoT Central device connectivity guide | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This guide describes how to connect IoT devices to your IoT Central application. After a device connects, it uses telemetry to send streaming data and properties to report device state. Iot Central can set device state using writable properties and call commands on a device. This article outlines best practices for device connectivity.
author: dominicbetts
ms.author: dobett
ms.date: 01/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, device-developer]

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

A IoT device is a standalone device connects directly to IoT Central. A IoT device typically sends telemetry from its onboard or connected sensors to your IoT Central application. Standalone devices can also report property values, receive writable property values, and respond to commands.

### IoT Edge device

An IoT Edge device connects directly to IoT Central. An IoT Edge device can send its own telemetry, report its properties, and respond to writable property updates and commands. IoT Edge modules process data locally on the IoT Edge device. An IoT Edge device can also act as an intermediary for other devices known as downstream devices. Scenarios that use IoT Edge devices include:

- Aggregate or filter telemetry before it's sent to IoT Central. This approach can help to reduce the costs of sending data to IoT Central.
- Enable devices that can't connect directly to IoT Central to connect through the IoT Edge device. For example, a downstream device might use bluetooth to connect to the IoT Edge device, which then connects over the internet to IoT Central.
- Control downstream devices locally to avoid the latency associated with connecting to IoT Central over the internet.

IoT Central only sees the IoT Edge device, not the downstream devices connected to the IoT Edge device.

To learn more, see [Add an Azure IoT Edge device to your Azure IoT Central application](/learn/modules/connect-iot-edge-device-to-iot-central/).

### Gateways

A gateway device manages one or more downstream devices that connect to your IoT Central application. A gateway device can process the telemetry from the downstream devices before it's forwarded to your IoT Central application. Both IoT devices and IoT Edge devices can act as gateways. To learn more, see [Define a new IoT gateway device type in your Azure IoT Central application](./tutorial-define-gateway-device-type.md) and [How to connect devices through an IoT Edge transparent gateway](how-to-connect-iot-edge-transparent-gateway.md).

## Connect a device

Azure IoT Central uses the [Azure IoT Hub Device Provisioning service (DPS)](../../iot-dps/about-iot-dps.md) to manage all device registration and connection.

Using DPS enables:

- IoT Central to support onboarding and connecting devices at scale.
- You to generate device credentials and configure the devices offline without registering the devices through IoT Central UI.
- You to use your own device IDs to register devices in IoT Central. Using your own device IDs simplifies integration with existing back-office systems.
- A single, consistent way to connect devices to IoT Central.

To learn more, see [Get connected to Azure IoT Central](./concepts-get-connected.md) and [Best practices](concepts-best-practices.md).

### Security

The connection between a device and your IoT Central application is secured by using either [shared access signatures](./concepts-get-connected.md#sas-group-enrollment) or industry-standard [X.509 certificates](./concepts-get-connected.md#x509-group-enrollment).

### Communication protocols

Communication protocols that a device can use to connect to IoT Central include MQTT, AMQP, and HTTPS. Internally, IoT Central uses an IoT hub to enable device connectivity. For more information about the communication protocols that IoT Hub supports for device connectivity, see [Choose a communication protocol](../../iot-hub/iot-hub-devguide-protocols.md).

## Connectivity patterns

Device developers typically use one of the device SDKs to implement devices that connect to an IoT Central application. Some scenarios, such as for devices that can't connect to the internet, also require a gateway. To learn more about the device connectivity options available to device developers, see:

- [Get connected to Azure IoT Central](concepts-get-connected.md)
- [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md)

A solution design must take into account the required device connectivity pattern. These patterns fall in to two broad categories. Both categories include devices sending telemetry to your IoT Central application:

### Persistent connections

Persistent connections are required your solution needs *command and control* capabilities. In command and control scenarios, the IoT Central application sends commands to devices to control their behavior in near real time. Persistent connections maintain a network connection to the cloud and reconnect whenever there's a disruption. Use either the MQTT or the AMQP protocol for persistent device connections to IoT Central.

The following options support persistent device connections:

- Use the IoT device SDKs to connect devices and send telemetry:

  The device SDKs enable both the MQTT and AMQP protocols for creating persistent connections to IoT Central. To learn more, see [Get connected to Azure IoT Central](concepts-get-connected.md).

- Connect devices over a local network to an IoT Edge device that forwards telemetry to IoT Central:

  An IoT Edge device can make a persistent connection to IoT Central. For devices that can't connect to the internet or that require network isolation, use an IoT Edge device as a local gateway. The gateway forwards device telemetry to IoT Central. This option enables command and control of the downstream devices connected to the IoT Edge device.

  To learn more, see [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md).

- Use IoT Central Device Bridge to connect devices that use a custom protocol:

  Some devices use a protocol or encoding, such as LWM2M or COAP, that IoT Central doesn't currently support. IoT Central Device Bridge acts as a translator that forwards telemetry to IoT Central. Because the bridge maintains a persistent connection, this option enables command and control of the devices connected to the bridge.

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

## Implement the device

An IoT Central device template includes a _model_ that specifies the behaviors a device of that type should implement. Behaviors include telemetry, properties, and commands.

To learn more, see [Edit an existing device template](howto-edit-device-template.md).

> [!TIP]
> You can export the model from IoT Central as a [Digital Twins Definition Language (DTDL) v2](https://github.com/Azure/opendigitaltwins-dtdl) JSON file.

Each model has a unique _device twin model identifier_ (DTMI), such as `dtmi:com:example:Thermostat;1`. When a device connects to IoT Central, it sends the DTMI of the model it implements. IoT Central can then associate the correct device template with the device.

[IoT Plug and Play](../../iot-develop/overview-iot-plug-and-play.md) defines a set of [conventions](../../iot-develop/concepts-convention.md) that a device should follow when it implements a DTDL model.

The [Azure IoT device SDKs](#languages-and-sdks) include support for the IoT Plug and Play conventions.

### Device model

A device model is defined by using the [DTDL](https://github.com/Azure/opendigitaltwins-dtdl) modeling language. This language lets you define:

- The telemetry the device sends. The definition includes the name and data type of the telemetry. For example, a device sends temperature telemetry as a double.
- The properties the device reports to IoT Central. A property definition includes its name and data type. For example, a device reports the state of a valve as a Boolean.
- The properties the device can receive from IoT Central. Optionally, you can mark a property as writable. For example, IoT Central sends a target temperature as a double to a device.
- The commands a device responds to. The definition includes the name of the command, and the names and data types of any parameters. For example, a device responds to a reboot command that specifies how many seconds to wait before rebooting.

A DTDL model can be a _no-component_ or a _multi-component_ model:

- No-component model: A simple model doesn't use embedded or cascaded components. All the telemetry, properties, and commands are defined a single _root component_. For an example, see the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) model.
- Multi-component model. A more complex model that includes two or more components. These components include a single root component, and one or more nested components. For an example, see the [Temperature Controller](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) model.

To learn more, see [IoT Plug and Play modeling guide](../../iot-develop/concepts-modeling-guide.md)

### Conventions

A device should follow the IoT Plug and Play conventions when it exchanges data with IoT Central. The conventions include:

- Send the DTMI when it connects to IoT Central.
- Send correctly formatted JSON payloads and metadata to IoT Central.
- Correctly respond to writable properties and commands from IoT Central.
- Follow the naming conventions for component commands.

> [!NOTE]
> Currently, IoT Central does not fully support the DTDL **Array** and **Geospatial** data types.

To learn more about the format of the JSON messages that a device exchanges with IoT Central, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md).

To learn more about the IoT Plug and Play conventions, see [IoT Plug and Play conventions](../../iot-develop/concepts-convention.md).

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

## Best practices

These recommendations show how to implement devices to take advantage of the built-in disaster recovery and automatic scaling in IoT Central.

The following steps show the high-level flow when a device connects to IoT Central:

1. Use DPS to provision the device and get a device connection string.

1. Use the connection string to connect IoT Central's internal IoT Hub endpoint. Send data to and receive data from your IoT Central application.

1. If the device gets connection failures, then depending on the error type, either retry the connection or reprovision the device.

### Use DPS to provision the device

To provision a device with DPS, use the scope ID, credentials, and device ID from your IoT Central application. To learn more about the credential types, see [X.509 group enrollment](concepts-get-connected.md#x509-group-enrollment) and [SAS group enrollment](concepts-get-connected.md#sas-group-enrollment). To learn more about device IDs, see [Device registration](concepts-get-connected.md#device-registration).

On success, DPS returns a connection string the device can use to connect to your IoT Central application. To troubleshoot provisioning errors, see [Check the provisioning status of your device](troubleshoot-connection.md#check-the-provisioning-status-of-your-device).

The device can cache the connection string to use for later connections. However, the device must be prepared to [handle connection failures](#handle-connection-failures).

### Handle connection failures

For scaling or disaster recovery purposes, IoT Central may update its underlying IoT hub. To maintain connectivity, your device code should handle specific connection errors by establishing a connection to the new IoT Hub endpoint.

If the device gets any of the following errors when it connects, it should reprovision the device with DPS to get a new connection string. These errors mean the connection string is no longer valid:

- Unreachable IoT Hub endpoint.
- Expired security token.
- Device disabled in IoT Hub.

If the device gets any of the following errors when it connects, it should use a back-off strategy to retry the connection. These errors mean the connection string is still valid, but transient conditions are stopping the device from connecting:

- Operator blocked device.
- Internal error 500 from the service.

To learn more about device error codes, see [Troubleshooting device connections](troubleshoot-connection.md).

### Test failover capabilities

The Azure CLI lets you test the failover capabilities of your device code. The CLI command works by temporarily switching a device registration to a different internal IoT hub. To verify the device failover worked, check that the device still sends telemetry and responds to commands.

To run the failover test for your device, run the following command:

```azurecli
az iot central device manual-failover \
    --app-id {Application ID of your IoT Central application} \
    --device-id {Device ID of the device you're testing} \
    --ttl-minutes {How to wait before moving the device back to it's original IoT hub}
```

> [!TIP]
> To find the **Application ID**, navigate to **Administration > Your application** in your IoT Central application.

If the command succeeds, you see output that looks like the following:

```output
Command group 'iot central device' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
{
  "hubIdentifier": "6bd4...bafa",
  "message": "Success! This device is now being failed over. You can check your device'’'s status using 'iot central device registration-info' command. The device will revert to its original hub at Tue, 18 May 2021 11:03:45 GMT. You can choose to failback earlier using device-manual-failback command. Learn more: https://aka.ms/iotc-device-test"
}
```

To learn more about the CLI command, see [az iot central device manual-failover](/cli/azure/iot/central/device#az_iot_central_device_manual_failover).

You can now check that telemetry from the device still reaches your IoT Central application.

> [!TIP]
> To see sample device code that handles failovers in various programing languages, see [IoT Central high availability clients](/samples/azure-samples/iot-central-high-availability-clients/iotc-high-availability-clients/).

## Next steps

If you're a device developer and want to dive into some code, the suggested next step is to [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md).

To learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
