---
title: What are device templates in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the behavior of the devices connected to your application. A device template specifies the telemetry, properties, and commands the device must implement. A device template also defines the UI for the device in IoT Central such as the forms and views an operator uses.
author: dominicbetts
ms.author: dobett
ms.date: 12/19/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: device-developer
# This article applies to device developers and solution builders.
---

# What are device templates?

A device template in Azure IoT Central is a blueprint that defines the characteristics and behaviors of a type of device that connects to your application. For example, the device template defines the telemetry that a device sends so that IoT Central can create visualizations that use the correct units and data types.

A solution builder adds device templates to an IoT Central application. A device developer writes the device code that implements the behaviors defined in the device template.

A device template includes the following sections:

- _A device model_. This part of the device template defines how the device interacts with your application. A device developer implements the behaviors defined in the model.
    - _Root component_. Every device model has a root component. The root component's interface describes capabilities that are specific to the device model.
    - _Components_. A device model may include components in addition to the root component to describe device capabilities. Each component has an interface that describes the component's capabilities. Component interfaces may be reused in other device models. For example several phone device models could use the same camera interface.
    - _Inherited interfaces_. A device model contains one or more interfaces that extend the capabilities of the root component.
- _Cloud properties_. This part of the device template lets the solution developer specify any device metadata to store. Cloud properties are never synchronized with devices and only exist in the application. Cloud properties don't affect the code that a device developer writes to implement the device model.
- _Customizations_. This part of the device template lets the solution developer override some of the definitions in the device model. Customizations are useful if the solution developer wants to refine how the application handles a value, such as changing the display name for a property or the color used to display a telemetry value. Customizations don't affect the code that a device developer writes to implement the device model.
- _Views_. This part of the device template lets the solution developer define visualizations to view data from the device, and forms to manage and control a device. The views use the device model, cloud properties, and customizations. Views don't affect the code that a device developer writes to implement the device model.

## Device models

A device model defines how a device interacts with your IoT Central application. The device developer must make sure that the device implements the behaviors defined in the device model so that IoT Central can monitor and manage the device. A device model is made up of one or more _interfaces_, and each interface can define a collection of _telemetry_ types, _device properties_, and _commands_. A solution developer can import a JSON file that defines the device model into a device template, or use the web UI in IoT Central to create or edit a device model.

To learn more about editing a device model, see [Edit an existing device template](howto-edit-device-template.md)

A solution developer can also export a JSON file that contains the device model. A device developer can use this JSON document to understand how the device should communicate with the IoT Central application.

The JSON file that defines the device model uses the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). IoT Central expects the JSON file to contain the device model with the interfaces defined inline, rather than in separate files. To learn more, see [IoT Plug and Play modeling guide](../../iot-develop/concepts-modeling-guide.md).

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
> This option is only available in the IoT Central web UI. This setting isn't included if you export a model or interface from the device template.

## Cloud properties

Cloud properties are part of the device template, but aren't part of the device model. Cloud properties let the solution developer specify any device metadata to store in the IoT Central application. Cloud properties don't affect the code that a device developer writes to implement the device model.

A solution developer can add cloud properties to device views and forms alongside device properties to enable an operator to manage the devices connected to the application. A solution developer can also use cloud properties as part of a rule definition to make a threshold value editable by an operator.

## Customizations

Customizations are part of the device template, but aren't part of the device model. Customizations let the solution developer enhance or override some of the definitions in the device model. For example, a solution developer can change the display name for a telemetry type or property. A solution developer can also use customizations to add validation such as a minimum or maximum length for a string device property.

Customizations may affect the code that a device developer writes to implement the device model. For example, a customization could set minimum and maximum string lengths or minimum and maximum numeric values for telemetry.

## Views

A solution developer creates views that let operators monitor and manage connected devices. Views are part of the device template, so a view is associated with a specific device type. A view can include:

- Charts to plot telemetry.
- Tiles to display read-only device properties.
- Tiles to let the operator edit writable device properties.
- Tiles to let the operator edit  cloud properties.
- Tiles to let the operator call commands, including commands that expect a payload.
- Tiles to display labels, images, or markdown text.

The telemetry, properties, and commands that you can add to a view are determined by the device model, cloud properties, and customizations in the device template.

## Next steps

Now that you've learned about device templates, a suggested next steps is to read [Telemetry, property, and command payloads](./concepts-telemetry-properties-commands.md) to learn more about the data a device exchanges with IoT Central.
