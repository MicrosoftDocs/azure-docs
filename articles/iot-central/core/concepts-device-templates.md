---
title: What are device templates in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the behavior of the devices connected to your application.
author: dominicbetts
ms.author: dobett
ms.date: 05/21/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# What are device templates?

_This article applies to device developers and solution builders._

A device template in Azure IoT Central is a blueprint that defines the characteristics and behaviors of a type of device that connects to your application. For example, the device template defines the telemetry that a device sends so that IoT Central can create visualizations that use the correct units and data types.

A solution builder adds device templates to an IoT Central application. A device developer writes the device code that implements the behaviors defined in the device template.

A device template includes the following sections:

- _A device capability model (DCM)_. This part of the device template defines how the device interacts with your application. A device developer implements the behaviors defined in the DCM.
- _Cloud properties_. This part of the device template lets the solution developer specify any device metadata to store. Cloud properties are never synchronized with devices and only exist in the application. Cloud properties don't affect the code that a device developer writes to implement the DCM.
- _Customizations_. This part of the device template lets the solution developer override some of the definitions in the DCM. Customizations are useful if the solution developer wants to refine how the application handles a value, such as changing the display name for a property or the color used to display a telemetry value. Customizations don't affect the code that a device developer writes to implement the DCM.
- _Views_. This part of the device template lets the solution developer define visualizations to view data from the device, and forms to manage and control a device. The views use the DCM, cloud properties, and customizations. Views don't affect the code that a device developer writes to implement the DCM.

## Device capability models

A DCM defines how a device interacts with your IoT Central application. The device developer must make sure that the device implements the behaviors defined in the DCM so that IoT Central can monitor and manage the device. A DCM is made up of one or more _interfaces_, and each interface can define a collection of _telemetry_ types, _device properties_, and _commands_. A solution developer can import a JSON file that defines the DCM into a device template, or use the web UI in IoT Central to create or edit a DCM. Changes to a DCM made using the Web UI require the [device template to be versioned](./howto-version-device-template.md).

A solution developer can also export a JSON file that contains the DCM. A device developer can use this JSON document to understand how the device should communicate with the IoT Central application.

The JSON file that defines the DCM uses the [Digital Twin Definition Language (DTDL) V1](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). IoT Central expects the JSON file to contain the DCM with the interfaces defined inline, rather than in separate files.

A typical IoT device is made up of:

- Custom parts, which are the things that make your device unique.
- Standard parts, which are things that are common to all devices.

These parts are called _interfaces_ in a DCM. Interfaces define the details of each part your device implements. Interfaces are reusable across DCMs.

The following example shows the outline of device capability model for an environmental sensor device with two interfaces:

```json
{
  "@id": "urn:contoso:sensor_device:1",
  "@type": "CapabilityModel",
  "displayName": "Environment Sensor Capability Model",
  "implements": [
    {
      "@type": "InterfaceInstance",
      "name": "deviceinfo",
      "schema": {
        "@id": "urn:azureiot:DeviceManagement:DeviceInformation:1",
        "@type": "Interface",
        "displayName": "Device Information",
        "@context": "http://azureiot.com/v1/contexts/IoTModel.json",
        "contents": [
          ...
        ]
      }
    },
    {
      "@type": "InterfaceInstance",
      "name": "sensor",
      "schema": {
        "@id": "urn:contoso:EnvironmentalSensor:1",
        "@type": "Interface",
        "displayName": "Environmental Sensor",
        "@context": "http://azureiot.com/v1/contexts/IoTModel.json",
        "contents": [
          ...
        ]
      }
    }
  ],
  "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
}
```

A capability model has some required fields:

- `@id`: a unique ID in the form of a simple Uniform Resource Name.
- `@type`: declares that this object is a capability model.
- `@context`: specifies the DTDL version used for the capability model.
- `implements`: lists the interfaces that your device implements.

Each entry in the list of interfaces in the implements section has a:

- `name`: the programming name of the interface.
- `schema`: the interface the capability model implements.

An interface has some required fields:

- `@id`: a unique ID in the form of a simple Uniform Resource Name.
- `@type`: declares that this object is an interface.
- `@context`: specifies the DTDL version used for the interface.
- `contents`: lists the properties, telemetry, and commands that make up your device.

There are some optional fields you can use to add more details to the capability model, such as display name and description.

### Interface

The DTDL lets you describe the capabilities of your device. Related capabilities are grouped into interfaces. Interfaces describe the properties, telemetry, and commands a part of your device implements:

- `Properties`. Properties are data fields that represent the state of your device. Use properties to represent the durable state of the device, such as the on-off state of a coolant pump. Properties can also represent basic device properties, such as the firmware version of the device. You can declare properties as read-only or writable.
- `Telemetry`. Telemetry fields represent measurements from sensors. Whenever your device takes a sensor measurement, it should send a telemetry event containing the sensor data.
- `Commands`. Commands represent methods that users of your device can execute on the device. For example, a reset command or a command to switch a fan on or off.

The following example shows the environmental sensor interface definition:

```json
{
  "@type": "Property",
  "displayName": "Device State",
  "description": "The state of the device. Two states online/offline are available.",
  "name": "state",
  "schema": "boolean"
},
{
  "@type": "Property",
  "displayName": "Customer Name",
  "description": "The name of the customer currently operating the device.",
  "name": "name",
  "schema": "string",
  "writable": true
},
{
  "@type": [
    "Telemetry",
    "SemanticType/Temperature"
  ],
  "description": "Current temperature on the device",
  "displayName": "Temperature",
  "name": "temp",
  "schema": "double",
  "unit": "Units/Temperature/fahrenheit"
},
{
  "@type": "Command",
  "name": "turnon",
  "comment": "This Commands will turn-on the LED light on the device.",
  "commandType": "synchronous"
},
{
  "@type": "Command",
  "name": "turnoff",
  "comment": "This Commands will turn-off the LED light on the device.",
  "commandType": "synchronous"
}
```

This example shows two properties, a telemetry type, and two commands. A minimal field description has a:

- `@type` to specify the type of capability: `Telemetry`, `Property`, or `Command`.  In some cases, the type includes a semantic type to enable IoT Central to make some assumptions about how to handle the value.
- `name` for the telemetry value.
- `schema` to specify the data type for the telemetry or the property. This value can be a primitive type, such as double, integer, boolean, or string. Complex object types, arrays, and maps are also supported.
- `commandType` to specify how the command should be handled.

Optional fields, such as display name and description, let you add more details to the interface and capabilities.

### Properties

By default, properties are read-only. Read-only properties mean that the device reports property value updates to your IoT Central application. Your IoT Central application can't set the value of a read-only property.

You can also mark a property as writeable on an interface. A device can receive an update to a writeable property from your IoT Central application as well as reporting property value updates to your application.

Devices don't need to be connected to set property values. The updated values are transferred when the device next connects to the application. This behavior applies to both read-only and writeable properties.

Don't use properties to send telemetry from your device. For example, a readonly property such as `temperatureSetting=80` should mean that the device temperature has been set to 80, and the device is trying to get to, or stay at, this temperature.

For writable properties, the device application returns a desired state status code, version, and description to indicate whether it received and applied the property value.

### Telemetry

IoT Central lets you view telemetry on dashboards and charts, and use rules to trigger actions when thresholds are reached. IoT Central uses the information in the DCM, such as data types, units and display names, to determine how to display telemetry values.

You can use the IoT Central data export feature to stream telemetry to other destinations such as storage or Event Hubs.

### Commands

Commands are either synchronous or asynchronous. A synchronous command must execute within 30 seconds by default, and the device must be connected when the command arrives. If the device does respond in time, or the device isn't connected, then the command fails.

Use asynchronous commands for long-running operations. The device sends progress information using telemetry messages. These progress messages have the following header properties:

- `iothub-command-name`: the command name, for example `UpdateFirmware`.
- `iothub-command-request-id`: the request ID generated on the server side and sent to the device in the initial call.
- `iothub-interface-id`:  The ID of the interface this command is defined on, for example `urn:example:AssetTracker:1`.
 `iothub-interface-name`: the instance name of this interface, for example `myAssetTracker`.
- `iothub-command-statuscode`: the status code returned from the device, for example `202`.

## Cloud properties

Cloud properties are part of the device template, but aren't part of the DCM. Cloud properties let the solution developer specify any device metadata to store in the IoT Central application. Cloud properties don't affect the code that a device developer writes to implement the DCM.

A solution developer can add cloud properties to dashboards and views alongside device properties to enable an operator to manage the devices connected to the application. A solution developer can also use cloud properties as part of a rule definition to make a threshold value editable by an operator.

## Customizations

Customizations are part of the device template, but aren't part of the DCM. Customizations let the solution developer enhance or override some of the definitions in the DCM. For example, a solution developer can change the display name for a telemetry type or property. A solution developer can also use customizations to add validation such as a minimum or maximum length for a string device property.

Customizations may affect the code that a device developer writes to implement the DCM. For example, a customization could set minimum and maximum string lengths or minimum and maximum numeric values for telemetry.

## Views

A solution developer creates views that let operators monitor and manage connected devices. Views are part of the device template, so a view is associated with a specific device type. A view can include:

- Charts to plot telemetry.
- Tiles to display read-only device properties.
- Tiles to let the operator edit writable device properties.
- Tiles to let the operator edit  cloud properties.
- Tiles to let the operator call commands, including commands that expect a payload.
- Tiles to display labels, images, or markdown text.

The telemetry, properties, and commands that you can add to a view are determined by the DCM, cloud properties, and customizations in the device template.

## Next steps

As a device developer, now that you've learned about device templates, a suggested next steps is to read [Get connected to Azure IoT Central](./concepts-get-connected.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.

As a solution developer, a suggested next step is to read [Define a new IoT device type in your Azure IoT Central application](./howto-set-up-template.md) to learn more about how to create a device template.
