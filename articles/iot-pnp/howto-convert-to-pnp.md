---
title: Convert an existing device to use IoT Plug and Play | Microsoft Docs
description: How to enable IoT Plug and Play for your existing devices.
author: ericmitt
ms.author: ericmitt
ms.date: 3/16/2021
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
---

# How to convert an existing device to be an IoT Plug and Play device

This article outlines the steps a device developer should follow to convert an existing device to an IoT Plug and Play device. It describes how the developer can create the model that every IoT Plug and Play device requires, and the code changes that are necessary to enable the device to function as an IoT Plug and Play device.

## Design the model for your device

Every IoT Plug and Play device has a model that describes the features and capabilities of the device. The model uses the [Digital Twin Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) to describe the device capabilities.

IoT Plug and Play use the following DTDL elements to describe devices: *Interface*, *Telemetry*, *Property*, *Command*, *Relationship*, and *Component*. DTDL provides a data description language that's compatible with common serialization formats such as JSON and binary serialization formats.

The core element in an IoT Plug and Play model is the interface. The interface describes the content of any digital twin and contains definitions for properties, telemetry, commands, relationships, and components. Interfaces are reusable as the schema for components in another interface.

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "displayName": "Thermostat",
  "contents": [
      {
          "@type": "Telemetry",
          "name": "temp",
          "schema": "double"
      },
```

IoT Plug and Play interfaces typically contain definitions for:

- [Telemetry](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#telemetry): data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or an information message.
- [Properties](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property): represent the read-only or writable state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a writable property.  
- [Commands](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#command): describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

To create an IoT Plug and Play model, you need to know for a given device:

- The data the device sends on regular basis.
- The read-only and writable properties the device should expose.
- The commands the device should respond to.

To learn more, see [IoT Plug and Play conventions](concepts-convention.md).

## No component models

When the device is created without a IoT Plug and Play model, the properties, telemetry, and commands aren't grouped or organized in any way.

The simplest way to model this device is to use a model with a single interface that contains all the capability definitions. IoT Plug and Play refers to such a model as a _no component_ model.

To learn more, see [No components](concepts-modeling-guide.md#no-components).

The following snippet shows an example of an interface that defines a no component model. This model defines the capabilities of a thermostat device:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "displayName": "Thermostat",
  "contents": [
    {
      "@type": "Telemetry",
      "name": "temp",
      "schema": "double"
    },
    {
      "@type": "Property",
      "name": "setPointTemp",
      "writable": true,
      "schema": "double"
    },
    {
      "@type": "Command",
      "name": "reboot",
      "request": {
        "name": "rebootTime",
        "displayName": "Reboot Time",
        "description": "Requested time to reboot the device.",
        "schema": "dateTime"
      },
      "response": {
        "name": "scheduledTime",
        "schema": "dateTime"
      }
    }
  ]   
}
```

In the interface definition:

- `@context` defines the DTDL version.
- `@id` is the unique model ID. To learn how an IoT solution uses this model, see [Use IoT Plug and Play models in an IoT solution](concepts-model-discovery.md)
- `@type` identifies this model as an interface.

The device telemetry, properties, and command definitions are contained in the `contents` array.

The following table shows the mapping between the DTDL elements and types in the IoT device SDKs:

| IoT device SDK | DTDL |
| -------------- | ---- |
| Direct method  |   Command |
| Device twin properties | Properties (read-only or writable) |
| Telemetry      | Telemetry |

No component models are useful for simple devices with a single sensor such as a thermostat with a temperature sensor.

No component models are useful for devices that send small quantities of data, or have a few sensors with data that's easy to aggregate.

## Component models

Components let you compose interfaces from other interfaces. Components describe contents that are directly part of the interface.

In DTDL v2, a component cannot contain another component.

The following example shows a model that uses components. The temperature controller is composed of two thermostat components and a device information component. There are separate interface definitions for the thermostat and device information models:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:TemperatureController;1",
  "@type": "Interface",
  "displayName": "Temperature Controller",
  "description": "Device with two thermostats and remote reboot.",
  "contents": [
...
    {
      "@type" : "Component",
      "schema": "dtmi:com:example:Thermostat;1",
      "name": "thermostat1",
      "displayName": "Thermostat One",
      "description": "Thermostat One of Two."
    },
    {
      "@type" : "Component",
      "schema": "dtmi:com:example:Thermostat;1",
      "name": "thermostat2",
      "displayName": "Thermostat Two",
      "description": "Thermostat Two of Two."
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1",
      "name": "deviceInformation",
      "displayName": "Device Information interface",
      "description": "Optional interface with basic device hardware information."
    }
...
```

This component approach is useful for devices with multiple sensors. You can use one component for each sensor or group related sensors that make up a feature into a component. Using components in the model helps to clarify the design of the device to someone using the model.

A component definition referenced by a model could be:

- Retrieved from a catalog
- Created using a tool such as the IoT Central device template builder.
- Translated from another descriptive language such as OPC.

## Inheritance

DTDL lets you extend interface capabilities using inheritance. The following example shows how the `ConferenceRoom` interface inherits from the `Room` interface. Because of inheritance, `ConferenceRoom` has both the `occupied` and `capacity` properties:

```json
[
    {
        "@id": "dtmi:com:example:Room;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": "Property",
                "name": "occupied",
                "schema": "boolean"
            }
        ],
        "@context": "dtmi:dtdl:context;2"
    },
    {
        "@id": "dtmi:com:example:ConferenceRoom;1",
        "@type": "Interface",
        "extends": "dtmi:com:example:Room;1",
        "contents": [
            {
                "@type": "Property",
                "name": "capacity",
                "schema": "integer"
            }
        ],
        "@context": "dtmi:dtdl:context;2"
    }
]
```

## Impact on the code

The [IoT Plug and Play conventions](concepts-convention.md) describe how an IoT Plug and Play device should exchange messages with an IoT hub. The [IoT Plug and Play device developer guide](concepts-developer-guide-device.md) provides detailed guidance on how to implement telemetry, properties, and commands in different programming languages.

For example, when you update a property value in a component, it's important to include a marker identifying it as component:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
component["maxTemperature"] = 38.7;
component["__t"] = "c"; // marker to identify a component
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```  

For writable properties, the convention defines how to acknowledge a property update. The following example shows how to acknowledge a property update in a component:

```csharp
await client.SetDesiredPropertyUpdateCallbackAsync(async (desired, ctx) =>
{
  JObject thermostatComponent = desired["thermostat1"];
  JToken targetTempProp = thermostatComponent["targetTemperature"];
  double targetTemperature = targetTempProp.Value<double>();

  TwinCollection reportedProperties = new TwinCollection();
  TwinCollection component = new TwinCollection();
  TwinCollection ackProps = new TwinCollection();
  component["__t"] = "c"; // marker to identify a component
  ackProps["value"] = targetTemperature;
  ackProps["ac"] = 200; // using HTTP status codes
  ackProps["av"] = desired.Version; // not readed from a desired property
  ackProps["ad"] = "desired property received";
  component["targetTemperature"] = ackProps;
  reportedProperties["thermostat1"] = component;

  await client.UpdateReportedPropertiesAsync(reportedProperties);
}, null);
```

## Design discussion

The design of a new model can come from:

- Migrating an existing device. The starting point for this type of design would be a no component model as described previously.
- An existing device network. You could translate an OPC mapping into an IoT Plug and Play model. You can approach the design using components or by the required data flow.
- A service or feature. For example, the GPS position of a truck or the wind speed at the top of a pylon.
- Sensor semantics. For example, a thermostat and temperature sensor, or a  pressure sensor.
- The functional specification. For example, the device battery should last for five years and emit a signal once a month, or the device should report telemetry every 10 seconds.

Consider the following design issues:

- There's a risk associated with the complexity of the design if you have too many components.
- DTDL v2 doesn't allow the array data type in properties.
- Message explosion, that can lead to more network and energy usage, and higher costs. Grouping telemetry into complex objects can help control this. For example, the following telemetry definition from a telescope model combines data from sensor and motors with a global status value. In this approach, the telescope provides an aggregated view instead of the detailed temperature sensor data and motor steps:

```json
"contents": [
  {"@type": "Telemetry",
  "name": "overallStatus",
  "displayName": "Overall Status",
  "description": "Overall status",
  "schema": {
    "@type":"Object",
    "@id"  :"dtmi:com:example:Telescope:TelescopeStatus;1", 
    "fields": 
      [
        {
          "name": "status",
          "schema": {
            "@type": "Enum",
            "valueSchema": "integer",
            "enumValues": [
                ... ommited for concision ...
            ]
          }
        },
        {
          "name": "pointingAt",
          "schema": "dtmi:com:example:Telescope:CelestialCoordinate;1"
        },
        {
          "name": "AtmosphericPressure",
          "schema": "double",
          "description": "High atmospheric pressure give better quality image"
        },
        {
          "name": "TemperatureDelta",
          "schema": "double",
          "description": "Exterior temperature compared to interior Temperature, has an impact on the image quality"
        }
      ]
  }
```

## Model design and tooling

To build a model, you need to create a valid DTDL file. The following tools can help you:

- [VSCode extension](link) to edit DTDL file.
- [IoT Explorer](link) to look at your model, interfaces, telemetry, commands, and properties by IoT Plug and Play component.
- [DTDL Model validation](link) to validate on your dev box model validity.
- [IoT Central Model design](link) and import/export feature, allow you to build and edit model with a UI.
