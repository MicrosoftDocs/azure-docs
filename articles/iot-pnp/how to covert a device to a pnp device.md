---
title: Enable PnP in your existing devices | Microsoft Docs
description: How to enable Azure IoT Plug and Play for your devices.
author: ericmitt
ms.author: ericmitt
ms.date: 3/16/2021
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp
---

# Tutorial: Convert a device to an IoT Plug and Play device

To convert or create an Azure IoT Plug and Play device, you need to create a model that describe the device. This article will present steps and design question developer should address to be able to create or enable device to be Plug and Play.

## Design the Plug and Play Model for your device

The  essence of Azure IoT Plug and Play, is to have a model describing the features and capabilities the device. The model describe device's capabilities with the [Digital Twin Definition Language- DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) syntax.

The Digital Twins Definition Language (DTDL) is made up of a set of metamodel classes that are used to define the behavior of all digital twins including devices. There are six metamodel classes that describe these behaviors: Interface, Telemetry, Property, Command, Relationship, and Component. In addition, because data is a key element in IoT solutions, the DTDL provides a data description language that is compatible with many popular serialization formats, including JSON and binary serialization formats.

The first concept to use when designing a Plug and Play model is **Interface**. Interface describes the content (Properties, Telemetries, Commands, Relationships, or Components) of any digital twin. Interfaces are reusable and can be reused as the schema for Components in another Interface.

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

PnP models contains mainly 3 type of content:

- **[telemetry](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#telemetry)**: data that the device push to the cloud at regular interval (D2C)
- **[property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property)**: properties shared by the devices as device twin (D2C and C2D)  
- **[command](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#command)**: method exposed by device called by the cloud (C2D)

So the essential question to ask when creating a PnP Model for a given device are:

- What data the device wil send on regular basis?
- What are the properties the device should expose? And then identify the read only and  writable ones.
- To which command your device should react?

More details on the [PnP convention here](https://docs.microsoft.com/en-us/azure/iot-pnp/concepts-convention).

## No component models

When the device is created without a PnP model, all the properties telemetry and command can be seen as they are at the 'same level'. There is no hierarchy in this "de facto" model, all properties telemetry and command constitute a list of "capabilities" of the device.

The direct migration path of such device, is to create a "non component" model for them. (in fact a single "default component" at the root level).

In the [components article](https://docs.microsoft.com/en-us/azure/iot-pnp/concepts-components)  you will find a section presenting the non [component structure](https://docs.microsoft.com/en-us/azure/iot-pnp/concepts-components)

As you can see, all model start with the same 'header': Id, type name

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

@context define the version of DTDL language to be used
@id is the modelID used at the connection time.
@type: identify this model as an interface (ie, every model is an interface) [see more about type](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#interface)

All the device data/properties/command is contained in the "contents" array. Here we have one telemetry data (temp) and one property (setPointTemp) and one command (reboot).

In this model, all the 'device data' are at the root level, and act as a default component.

The direct/simle mapping is the following
direct method     = command
twin prop         = property (R / RW)
telemetry         = telemetry

No component model are useful for simple devices with only one sensor for example a thermostat with a temperature sensor.
This kind of model have few data to host and transmit, or few sensor with data easy to agglomerate ( air speed + compass for example)

## Component models

Components enable interfaces to be composed of other interfaces. Components  describe contents that are directly part of the interface.

In DTDL v2, a Component cannot contain another Component. The maximum depth of Components is 1.

Let look at a multi component model:

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

We recognize the 'header, dtdl version, ModelID
Here we see a list of component (2 time the same thermostat to illustrate the re usability and device information)
Each component will have its own model definition exposing properties command and telemetry. 

This component approach can for example be used for a device with multiple sensors, one component by sensor.
A "descriptive design" exposing sensor by sensor  or grouping couple of sensor in a more advanced 'feature'.  

With component we have a way to describe complex system/devices/set of sensors/features.
Component can be from catalog, or created with tools like (IOt Central)[link to IOTC] for example, that provide a UI to create PnP Model.
Component can be translated from other descriptive language like OPC.

As for Object oriented syntax, DTDL allow to define interfaces and inherit from it. This way we can express more advanced concept as inheritance:

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

 In this example, the ConferenceRoom interface inherits from the Room interface. Through inheritance, the ConferenceRoom has two properties: the occupied property (from Room) and the capacity property (from *ConferenceRoom()).

## The PnP convention has Impact on the code

It is important to apply any rules defining the PnP convention in your model, as seen above, but also in your implementation. As explained in the [PnP Device Developer Guide](https://docs.microsoft.com/en-us/azure/iot-pnp/concepts-developer-guide-device?pivots=programming-language-csharp) Updating properties for example need to send back ack message, with very specific value. Read only and Writable properties nedd specific value, and a code in the case a component is used or not.

For example when updating a properties for a component, the marker is the following (here in C#):

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
component["maxTemperature"] = 38.7;
component["__t"] = "c"; // marker to identify a component
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```  

For writable property, then ack is defined the convention and should be used (here in C#):

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

## Discussion on the design - Caveat

### The design of a new model can come:

- From migrating an existing device. See above the discussion on no component.
- From existing device 'network", OPC mapping could be translated into PnP models. In this case too, we can approach the design by component or by the data flow we want.
- From service/feature, GPS position of a truck, wind speed at the top of a pylone
- From sensor semantic, thermostat and temperature sensor, same for pressure sensor, humidity sensor, light, magnetometer sensor...
- From the functional specification, the device should preserve battery for 5 years and emit a signal oce a month, vs device should report telemetry every 10 secondes...

### Some caveat to think twice at design time:

- Risk to introduce complexity with too much components
- DTDL v2, doesn't allow array in properties
- Message explosion, that potentially mean, more network usage, energy and cost, regrouping telemetry in complex object can help control this:
Consider for example the following telemetry from a model of a telescope, that combine data from sensor and motors with a global status (pointing to a position, following an object, offline...) In this approach the telescope below doesn't expose its temperature sensors or its motor steps, it aggregate it in  "logic" form.

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

To build a model, you have to create a json file with valid DTDL syntax, some tools can help you:

- [VSCode extension](link) to edit DTDL file.
- [IoT EXplorer](link) to look at your model, interfaces, telemetry command and propertis by PnP component.
- [DTDL Model validation](link) to validate on your dev box model validity.
- [IoT Central Model design](link) and import/export feature, allow you to build and edit model with a UI.
