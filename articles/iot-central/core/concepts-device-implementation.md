---
title: Device implementation
description: This article introduces the key concepts and best practices for implementing a device that connects to your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 06/06/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central

ms.custom:  [amqp, mqtt, device-developer]

# This article applies to device developers.
---

# Device implementation and best practices for IoT central

This article provides information about how to implement devices that connect to your IoT central application. It also includes some best practices. To learn more about the overall connection process, see [Connect a device](overview-iot-central-developer.md#how-devices-connect).

For sample device implementation code, see [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).

## Implement the device

Devices that connect to IoT Central should follow the _IoT Plug and Play conventions_. One of these conventions is that a device should send the _model ID_ of the device model it implements when it connects. The model ID enables the IoT Central application to assign the device to the correct device template.

An IoT Central device template includes a _model_ that specifies the behaviors a device of that type should implement. Behaviors include telemetry, properties, and commands.

Each model has a unique _digital twin model identifier_ (DTMI), such as `dtmi:com:example:Thermostat;1`. When a device connects to IoT Central, it sends the DTMI of the model it implements. IoT Central can then assign the correct device template to the device.

[IoT Plug and Play](../../iot-develop/overview-iot-plug-and-play.md) defines a set of [conventions](../../iot-develop/concepts-convention.md) that a device should follow when it implements a Digital Twin Definition Language (DTDL) model.

The [Azure IoT device SDKs](#device-sdks) include support for the IoT Plug and Play conventions.

### Device model

A device model is defined by using the [DTDL V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md) modeling language. This language lets you define:

- The telemetry the device sends. The definition includes the name and data type of the telemetry. For example, a device sends temperature telemetry as a double.
- The properties the device reports to IoT Central. A property definition includes its name and data type. For example, a device reports the state of a valve as a Boolean.
- The properties the device can receive from IoT Central. Optionally, you can mark a property as writable. For example, IoT Central sends a target temperature as a double to a device.
- The commands a device responds to. The definition includes the name of the command, and the names and data types of any parameters. For example, a device responds to a reboot command that specifies how many seconds to wait before rebooting.

> [!NOTE]
> IoT Central defines some extensions to the DTDL v2 language. To learn more, see [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md).

A DTDL model can be a _no-component_ or a _multi-component_ model:

- No-component model: A simple model doesn't use embedded or cascaded components. All the telemetry, properties, and commands are defined a single _root component_. For an example, see the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) model.
- Multi-component model. A more complex model that includes two or more components. These components include a single root component, and one or more nested components. For an example, see the [Temperature Controller](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) model.

> [!TIP]
> You can [import and export a complete device model or individual interface](howto-set-up-template.md#interfaces-and-components) from an IoT Central device template as a DTDL v2 file.

To learn more about device models, see the [IoT Plug and Play modeling guide](../../iot-develop/concepts-modeling-guide.md)

### Conventions

A device should follow the IoT Plug and Play conventions when it exchanges data with IoT Central. The conventions include:

- Send the DTMI when it connects to IoT Central.
- Send correctly formatted JSON payloads and metadata to IoT Central.
- Correctly respond to writable properties and commands from IoT Central.
- Follow the naming conventions for component commands.

> [!NOTE]
> Currently, IoT Central does not fully support the DTDL **Array** and **Geospatial** data types.

To learn more about the IoT Plug and Play conventions, see [IoT Plug and Play conventions](../../iot-develop/concepts-convention.md).

To learn more about the format of the JSON messages that a device exchanges with IoT Central, see [Telemetry, property, and command payloads](../../iot-develop/concepts-message-payloads.md).

### Device SDKs

Use one of the [Azure IoT device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) to implement the behavior of your device. The code should:

- Register the device with DPS and use the information from DPS to connect to the internal IoT hub in your IoT Central application.
- Announce the DTMI of the model the device implements.
- Send telemetry in the format that the device model specifies. IoT Central uses the model in the device template to determine how to use the telemetry for visualizations and analysis.
- Synchronize property values between the device and IoT Central. The model specifies the property names and data types so that IoT Central can display the information.
- Implement command handlers for the commands specified in the model. The model specifies the command names and parameters that the device should use.

For more information about the role of device templates, see [What are device templates?](./concepts-device-templates.md).

The following table summarizes how Azure IoT Central device features map on to IoT Hub features:

| Azure IoT Central | Azure IoT Hub |
| ----------- | ------- |
| Telemetry | [Device-to-cloud messaging](../../iot-hub/iot-hub-devguide-messages-d2c.md) |
| Offline commands | [Cloud-to-device messaging](../../iot-hub/iot-hub-devguide-messages-c2d.md) |
| Property | [Device twin reported properties](../../iot-hub/iot-hub-devguide-device-twins.md) |
| Property (writable) | [Device twin desired and reported properties](../../iot-hub/iot-hub-devguide-device-twins.md) |
| Command | [Direct methods](../../iot-hub/iot-hub-devguide-direct-methods.md) |

### Communication protocols

Communication protocols that a device can use to connect to IoT Central include MQTT, AMQP, and HTTPS. Internally, IoT Central uses an IoT hub to enable device connectivity. For more information about the communication protocols that IoT Hub supports for device connectivity, see [Choose a communication protocol](../../iot-hub/iot-hub-devguide-protocols.md).

If your device can't use any of the supported protocols, use Azure IoT Edge to do protocol conversion. IoT Edge supports other intelligence-on-the-edge scenarios to offload processing from the Azure IoT Central application.

## Telemetry timestamps

By default, IoT Central uses the message enqueued time when it displays telemetry on dashboards and charts. Message enqueued time is set internally when IoT Central receives the message from the device.

A device can set the `iothub-creation-time-utc` property when it creates a message to send to IoT Central. If this property is present, IoT Central uses it when it displays telemetry on dashboards and charts.

You can export both the enqueued time and the `iothub-creation-time-utc` property when you export telemetry from your IoT Central application.

To learn more about message properties, see [System Properties of device-to-cloud IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md#system-properties-of-d2c-iot-hub-messages).

## Best practices

These recommendations show how to implement devices to take advantage of the [built-in high availability, disaster recovery, and automatic scaling](concepts-faq-scalability-availability.md) in IoT Central.

### Handle connection failures

For scaling or disaster recovery purposes, IoT Central may update its underlying IoT hubs. To maintain connectivity, your device code should handle specific connection errors by establishing a connection to a new IoT Hub endpoint.

If the device gets any of the following errors when it connects, it should reprovision the device with DPS to get a new connection string. These errors mean the connection string is no longer valid:

- Unreachable IoT Hub endpoint.
- Expired security token.
- Device disabled in IoT Hub.

If the device gets any of the following errors when it connects, it should use a back-off strategy to retry the connection. These errors mean the connection string is still valid, but transient conditions are stopping the device from connecting:

- Operator blocked device.
- Internal error 500 from the service.

To learn more about device error codes, see [Troubleshooting device connections](troubleshoot-connection.md).

To learn more about implementing automatic reconnections, see [Manage device reconnections to create resilient applications](../../iot-develop/concepts-manage-device-reconnections.md).

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
> To find the **Application ID**, navigate to **Application > Management** in your IoT Central application.

If the command succeeds, you see output that looks like the following example:

```output
Command group 'iot central device' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
{
  "hubIdentifier": "6bd4...bafa",
  "message": "Success! This device is now being failed over. You can check your device'’'s status using 'iot central device registration-info' command. The device will revert to its original hub at Tue, 18 May 2021 11:03:45 GMT. You can choose to failback earlier using device-manual-failback command. Learn more: https://aka.ms/iotc-device-test"
}
```

To learn more about the CLI command, see [az iot central device manual-failover](/cli/azure/iot/central/device#az-iot-central-device-manual-failover).

You can now check that telemetry from the device still reaches your IoT Central application.

> [!TIP]
> To see sample device code that handles failovers in various programing languages, see [IoT Central high availability clients](/samples/azure-samples/iot-central-high-availability-clients/iotc-high-availability-clients/).

## Next steps

Some suggested next steps are to:

- Complete the  tutorial [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)
- Review [Device authentication concepts in IoT Central](concepts-device-authentication.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
- Read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md)
