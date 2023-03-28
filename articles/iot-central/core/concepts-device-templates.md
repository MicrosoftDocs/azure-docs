---
title: What are device templates in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the behavior of the devices connected to your application. A device template specifies the telemetry, properties, and commands the device must implement. A device template also defines the UI for the device in IoT Central such as the forms and views an operator uses.
author: dominicbetts
ms.author: dobett
ms.date: 06/03/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: device-developer
# This article applies to device developers and solution builders.
---

# What are device templates?

A device template in Azure IoT Central is a blueprint that defines the characteristics and behaviors of a type of device that connects to your application. For example, the device template defines the telemetry that a device sends so that IoT Central can create visualizations that use the correct units and data types.

A solution builder adds device templates to an IoT Central application. A device developer writes the device code that implements the behaviors defined in the device template. To learn more about the data that a device exchanges with IoT Central, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md).

A device template includes the following sections:

- _A device model_. This part of the device template defines how the device interacts with your application. Every device model has a unique ID. A device developer implements the behaviors defined in the model.
  - _Root component_. Every device model has a root component. The root component's interface describes capabilities that are specific to the device model.
  - _Components_. A device model may include components in addition to the root component to describe device capabilities. Each component has an interface that describes the component's capabilities. Component interfaces may be reused in other device models. For example, several phone device models could use the same camera interface.
  - _Inherited interfaces_. A device model contains one or more interfaces that extend the capabilities of the root component.
- _Views_. This part of the device template lets the solution developer define visualizations to view data from the device, and forms to manage and control a device. Views don't affect the code that a device developer writes to implement the device model.

## Assign a device to a device template

For a device to interact with IoT Central, it must be assigned to a device template. This assignment is done in one of four ways:

- When you register a device on the **Devices** page, you can identify the template the device should use.
- When you bulk import a list of devices, you can choose the device template all the devices on the list should use.
- You can manually assign an unassigned device to a device template after it connects.
- You can automatically assign a device to a device template by sending a model ID when the device first connects to your application.

### Automatic assignment

IoT Central can automatically assign a device to a device template when the device connects. A device should send a [model ID](../../iot/iot-glossary.md?toc=/azure/iot-central/toc.json&bc=/azure/iot-central/breadcrumb/toc.json#model-id) when it connects. IoT Central uses the model ID to identify the device template for that specific device model. The discovery process works as follows:

1. If the device template is already published in the IoT Central application, the device is assigned to the device template.
1. If the device template isn't already published in the IoT Central application, IoT Central looks for the device model in the [public model repository](https://github.com/Azure/iot-plugandplay-models). If IoT Central finds the model, it uses it to generate a basic device template.
1. If IoT Central doesn't find the model in the public model repository, the device is marked as **Unassigned**. An operator can either create a device template for the device and then migrate the unassigned device to the new device template, or [autogenerate a device template](howto-set-up-template.md#autogenerate-a-device-template) based on the data the device sends.

The following screenshot shows you how to view the model ID of a device template in IoT Central. In a device template, select a component, and then select **Edit identity**:

:::image type="content" source="media/concepts-device-templates/model-id.png" alt-text="Screenshot showing model ID in thermostat device template." lightbox="media/concepts-device-templates/model-id.png":::

You can view the [thermostat model](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/thermostat-1.json) in the public model repository. The model ID definition looks like:

```json
"@id": "dtmi:com:example:Thermostat;1"
```

Use the following DPS payload to assign the device to a device template:

```json
{
  "modelId":"dtmi:com:example:TemperatureController;2"
}
```

To lean more about the DPS payload, see the sample code used in the [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).
 

## Device models

A device model defines how a device interacts with your IoT Central application. The device developer must make sure that the device implements the behaviors defined in the device model so that IoT Central can monitor and manage the device. A device model is made up of one or more _interfaces_, and each interface can define a collection of _telemetry_ types, _device properties_, and _commands_. A solution developer can import a JSON file that defines a complete device model or individual interface into a device template, or use the web UI in IoT Central to create or edit a device model.

To learn more about editing a device model, see [Edit an existing device template](howto-edit-device-template.md)

A solution developer can also export a JSON file from the device template that contains a complete device model or individual interface. A device developer can use this JSON document to understand how the device should communicate with the IoT Central application.

The JSON file that defines the device model uses the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md). IoT Central expects the JSON file to contain the device model with the interfaces defined inline, rather than in separate files. To learn more, see [IoT Plug and Play modeling guide](../../iot-develop/concepts-modeling-guide.md).

A typical IoT device is made up of:

- Custom parts, which are the things that make your device unique.
- Standard parts, which are things that are common to all devices.

These parts are called _interfaces_ in a device model. Interfaces define the details of each part your device implements. Interfaces are reusable across device models. In DTDL, a component refers to another interface, which may defined in a separate DTDL file or in a separate section of the file.

The following example shows the outline of device model for a [temperature controller device](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/temperaturecontroller-2.json). The root component includes definitions for `workingSet`, `serialNumber`, and `reboot`. The device model also includes two `thermostat` components and a `deviceInformation` component. The contents of the three components have been removed for the sake of brevity:

```json
[
  {
    "@context": [
      "dtmi:iotcentral:context;2",
      "dtmi:dtdl:context;2"
    ],
    "@id": "dtmi:com:example:TemperatureController;2",
    "@type": "Interface",
    "contents": [
      {
        "@type": [
          "Telemetry",
          "DataSize"
        ],
        "description": {
          "en": "Current working set of the device memory in KiB."
        },
        "displayName": {
          "en": "Working Set"
        },
        "name": "workingSet",
        "schema": "double",
        "unit": "kibibit"
      },
      {
        "@type": "Property",
        "displayName": {
          "en": "Serial Number"
        },
        "name": "serialNumber",
        "schema": "string",
        "writable": false
      },
      {
        "@type": "Command",
        "commandType": "synchronous",
        "description": {
          "en": "Reboots the device after waiting the number of seconds specified."
        },
        "displayName": {
          "en": "Reboot"
        },
        "name": "reboot",
        "request": {
          "@type": "CommandPayload",
          "description": {
            "en": "Number of seconds to wait before rebooting the device."
          },
          "displayName": {
            "en": "Delay"
          },
          "name": "delay",
          "schema": "integer"
        }
      },
      {
        "@type": "Component",
        "displayName": {
          "en": "thermostat1"
        },
        "name": "thermostat1",
        "schema": "dtmi:com:example:Thermostat;2"
      },
      {
        "@type": "Component",
        "displayName": {
          "en": "thermostat2"
        },
        "name": "thermostat2",
        "schema": "dtmi:com:example:Thermostat;2"
      },
      {
        "@type": "Component",
        "displayName": {
          "en": "DeviceInfo"
        },
        "name": "deviceInformation",
        "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1"
      }
    ],
    "displayName": {
      "en": "Temperature Controller"
    }
  },
  {
    "@context": "dtmi:dtdl:context;2",
    "@id": "dtmi:com:example:Thermostat;2",
    "@type": "Interface",
    "displayName": "Thermostat",
    "description": "Reports current temperature and provides desired temperature control.",
    "contents": [
      ...
    ]
  },
  {
    "@context": "dtmi:dtdl:context;2",
    "@id": "dtmi:azure:DeviceManagement:DeviceInformation;1",
    "@type": "Interface",
    "displayName": "Device Information",
    "contents": [
      ...
    ]
  }
]
```

An interface has some required fields:

- `@id`: a unique ID in the form of a simple Uniform Resource Name.
- `@type`: declares that this object is an interface.
- `@context`: specifies the DTDL version used for the interface.
- `contents`: lists the properties, telemetry, and commands that make up your device. The capabilities may be defined in multiple interfaces.

There are some optional fields you can use to add more details to the capability model, such as display name and description.

Each entry in the list of interfaces in the implements section has a:

- `name`: the programming name of the interface.
- `schema`: the interface the capability model implements.

## Interfaces

The DTDL lets you describe the capabilities of your device. Related capabilities are grouped into interfaces. Interfaces describe the properties, telemetry, and commands a part of your device implements:

- `Properties`. Properties are data fields that represent the state of your device. Use properties to represent the durable state of the device, such as the on-off state of a coolant pump. Properties can also represent basic device properties, such as the firmware version of the device. You can declare properties as read-only or writable. Only devices can update the value of a read-only property. An operator can set the value of a writable property to send to a device.
- `Telemetry`. Telemetry fields represent measurements from sensors. Whenever your device takes a sensor measurement, it should send a telemetry event containing the sensor data.
- `Commands`. Commands represent methods that users of your device can execute on the device. For example, a reset command or a command to switch a fan on or off.

The following example shows the thermostat interface definition:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;2",
  "@type": "Interface",
  "displayName": "Thermostat",
  "description": "Reports current temperature and provides desired temperature control.",
  "contents": [
    {
      "@type": [
        "Telemetry",
        "Temperature"
      ],
      "name": "temperature",
      "displayName": "Temperature",
      "description": "Temperature in degrees Celsius.",
      "schema": "double",
      "unit": "degreeCelsius"
    },
    {
      "@type": [
        "Property",
        "Temperature"
      ],
      "name": "targetTemperature",
      "schema": "double",
      "displayName": "Target Temperature",
      "description": "Allows to remotely specify the desired target temperature.",
      "unit": "degreeCelsius",
      "writable": true
    },
    {
      "@type": [
        "Property",
        "Temperature"
      ],
      "name": "maxTempSinceLastReboot",
      "schema": "double",
      "unit": "degreeCelsius",
      "displayName": "Max temperature since last reboot.",
      "description": "Returns the max temperature since last device reboot."
    },
    {
      "@type": "Command",
      "name": "getMaxMinReport",
      "displayName": "Get Max-Min report.",
      "description": "This command returns the max, min and average temperature from the specified time to the current time.",
      "request": {
        "name": "since",
        "displayName": "Since",
        "description": "Period to return the max-min report.",
        "schema": "dateTime"
      },
      "response": {
        "name": "tempReport",
        "displayName": "Temperature Report",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "maxTemp",
              "displayName": "Max temperature",
              "schema": "double"
            },
            {
              "name": "minTemp",
              "displayName": "Min temperature",
              "schema": "double"
            },
            {
              "name": "avgTemp",
              "displayName": "Average Temperature",
              "schema": "double"
            },
            {
              "name": "startTime",
              "displayName": "Start Time",
              "schema": "dateTime"
            },
            {
              "name": "endTime",
              "displayName": "End Time",
              "schema": "dateTime"
            }
          ]
        }
      }
    }
  ]
}
```

This example shows two properties (one read-only and one writable), a telemetry type, and a command. A minimal field description has a:

- `@type` to specify the type of capability: `Telemetry`, `Property`, or `Command`.  In some cases, the type includes a semantic type to enable IoT Central to make some assumptions about how to handle the value.
- `name` for the telemetry value.
- `schema` to specify the data type for the telemetry or the property. This value can be a primitive type, such as double, integer, boolean, or string. Complex object types and maps are also supported.

Optional fields, such as display name and description, let you add more details to the interface and capabilities.

## Properties

By default, properties are read-only. Read-only properties mean that the device reports property value updates to your IoT Central application. Your IoT Central application can't set the value of a read-only property.

You can also mark a property as writable on an interface. A device can receive an update to a writable property from your IoT Central application as well as reporting property value updates to your application.

Devices don't need to be connected to set property values. The updated values are transferred when the device next connects to the application. This behavior applies to both read-only and writable properties.

Don't use properties to send telemetry from your device. For example, a readonly property such as `temperatureSetting=80` should mean that the device temperature has been set to 80, and the device is trying to get to, or stay at, this temperature.

For writable properties, the device application returns a desired state status code, version, and description to indicate whether it received and applied the property value.

### Cloud properties

You can also add cloud properties to the root component of the model. Cloud properties let you specify any device metadata to store in the IoT Central application. Cloud property values are stored in the IoT Central application and are never synchronized with a device. Cloud properties don't affect the code that a device developer writes to implement the device model.

A solution developer can add cloud properties to device views and forms alongside device properties to enable an operator to manage the devices connected to the application. A solution developer can also use cloud properties as part of a rule definition to make a threshold value editable by an operator.

The following DTDL snippet shows an example cloud property definition:

```json
{
    "@id": "dtmi:azureiot:Thermostat:CustomerName",
    "@type": [
        "Property",
        "Cloud",
        "StringValue"
    ],
    "displayName": {
        "en": "Customer Name"
    },
    "name": "CustomerName",
    "schema": "string"
}
```

## Telemetry

IoT Central lets you view telemetry in device views and charts, and use rules to trigger actions when thresholds are reached. IoT Central uses the information in the device model, such as data types, units and display names, to determine how to display telemetry values. You can also display telemetry values on application and personal dashboards.

You can use the IoT Central data export feature to stream telemetry to other destinations such as storage or Event Hubs.

## Commands

A command must execute within 30 seconds by default, and the device must be connected when the command arrives. If the device does respond in time, or the device isn't connected, then the command fails.

Commands can have request parameters and return a response.

### Offline commands

You can choose queue commands if a device is currently offline by enabling the **Queue if offline** option for a command in the device template.

Offline commands are one-way notifications to the device from your solution. Offline commands can have request parameters but don't return a response.

> [!NOTE]
> Offline commands are marked as `durable` if you export the model as DTDL.

## Views

A solution developer creates views that let operators monitor and manage connected devices. Views are part of the device template, so a view is associated with a specific device type. A view can include:

- Charts to plot telemetry.
- Tiles to display read-only device properties.
- Tiles to let the operator edit writable device properties.
- Tiles to let the operator edit cloud properties.
- Tiles to let the operator call commands, including commands that expect a payload.
- Tiles to display labels, images, or markdown text.

## Next steps

Now that you've learned about device templates, a suggested next steps is to read [Telemetry, property, and command payloads](./concepts-telemetry-properties-commands.md) to learn more about the data a device exchanges with IoT Central.
