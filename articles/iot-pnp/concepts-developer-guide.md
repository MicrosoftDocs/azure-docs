---
title: Developer guide - IoT Plug and Play | Microsoft Docs
description: Description of device modeling for IoT Plug and Play developers
author: dominicbetts
ms.author: dobett
ms.date: 07/05/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Plug and Play modeling developer guide

IoT Plug and Play lets you build devices that advertise their capabilities to Azure IoT applications. Plug and Play devices don't require manual configuration when a customer connects them to Plug and Play-enabled applications. IoT Central is an example of a Plug and Play-enabled application.

To build a Plug and Play device, you need to create a device description. The description is done with a simple definition language called Digital Twins Definition Language (DTDL).

## Device capability model

With DTDL, you create a _device capability model_ to describe the parts of your device. A typical IoT device is made up of:

- Custom parts, which are the things that make your device unique.
- Standard parts, which are things that are common to all devices.

These parts are called _interfaces_ in a device capability model. Interfaces define the details of each part your device implements.

The following example shows the device capability model for a thermostat device:

```json
{
  "@id": "urn:example:Thermostat_T_1000:1",
  "@type": "CapabilityModel",
  "implements": [
    {
      "name": "thermostat",
      "schema": "urn:example:Thermostat:1"
    },
    {
      "name": "urn_azureiot_deviceManagement_DeviceInformation",
      "schema": "urn:azureiot:deviceManagement:DeviceInformation:1"
    }
  ],
  "@context": "http://azureiot.com/v1/contexts/CapabilityModel.json"
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

There are additional optional fields you can use to add more details to the capability model, such as display name and description.

## Interface

With DTDL, you describe the capabilities of your device using interfaces. Interfaces describe the _properties_, _telemetry_, and _commands_ a part of your device implements:

- `Properties`. Properties are data fields that represent the state of your device. Use properties to represent the durable state of the device, such as the on-off state of a coolant pump. Properties can also represent basic device properties, such as the firmware version of the device. You can declare properties as read-only or writable.
- `Telemetry`. Telemetry fields represent measurements from sensors. Whenever your device takes a sensor measurement, it should send a telemetry event containing the sensor data.
- `Commands`. Commands represent methods that users of your device can execute on the device. For example, a reset command or a command to switch a fan on or off.

The following example shows the interface for a thermostat device:

```json
{
  "@id": "urn:example:Thermostat:1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Telemetry",
      "name": "temperature",
      "schema": "double"
    }
  ],
  "@context": "http://azureiot.com/v1/contexts/Interface.json"
}
```

An interface has some required fields:

- `@id`: a unique ID in the form of a simple Uniform Resource Name.
- `@type`: declares that this object is an interface.
- `@context`: specifies the DTDL version used for the interface.
- `contents`: lists the properties, telemetry, and commands that make up your device.

In this simple example, there's only a single telemetry field. A minimal field description has a:

- `@type`: specifies the type of capability: `Telemetry`, `Property`, or `Command`.
- `name`: provides the name of the telemetry value.
- `schema`: specifies the data type for the telemetry. This value can be a primitive type, such as double, integer, boolean, or string. Complex object types, arrays, and maps are also supported.

Other optional fields, such as display name and description, let you add more details to the interface and capabilities.

## Register a device

Plug and Play makes it easy to advertise the capabilities of your device. With Plug and Play, after your device connects to IoT Hub, you must register your device capability model. Registration enables customers to use the Plug and Play capabilities of your device.

This guide shows you how to register a device using the Azure IoT Device SDK for C.

For each interface your device implements, you must create an interface and connect it to its implementation.

For the thermostat interface shown previously, using the C SDK, you create and connect your thermostat interface to its implementation:

```c
DIGITALTWIN_INTERFACE_HANDLE thermostatInterfaceHandle;

DIGITALTWIN_CLIENT_RESULT result = DigitalTwin_InterfaceClient_Create(
    "thermostat",
    "urn:example:Thermostat:1",
    null, null,
    &thermostatInterfaceHandle);

result = DigitalTwin_Interface_SetCommandsCallbacks(
    thermostatInterfaceHandle,
    commandsCallbackTable);

result = DigitalTwin_Interface_SetPropertiesUpdatedCallbacks(
    thermostatInterfaceHandle,
    propertiesCallbackTable);

```

Repeat this code for each interface your device implements.

After you create an interface, register your device capability model and interfaces with your IoT hub:

```c
DIGITALTWIN_INTERFACE_CLIENT_HANDLE interfaces[2];
interfaces[0] = thermostatInterfaceHandle;
interfaces[1] = deviceInfoInterfaceHandle;

result = DigitalTwin_DeviceClient_RegisterInterfacesAsync(
    digitalTwinClientHandle, // The handle for the connection to Azure IoT
    "urn:example:Thermostat_T_1000:1",
    interfaceHandleList, 2,
    null, null);
```

## Use a device

Plug and Play lets you use devices that have registered their capabilities with your IoT hub. For example, you can access the properties and commands of a device directly.

To use a Plug and Play device that's connected to your IoT hub, use either the IoT Hub REST API or one of the IoT language SDKs. The following examples use the IoT Hub REST API.

To get the value of a device property, such as the firmware version (`fwVersion`) in the `DeviceInformation` interface in the thermostat, you use the digital twins REST API.

If your thermostat device is called `t-123`, you get the all the properties implemented by your device with a REST API GET call:

```REST
GET /digitalTwins/t-123/interfaces
```

More generally, all properties are accessed with this REST API template where `{device-id}` is the identifier for the device:

```REST
GET /digitalTwins/{device-id}/interfaces
```

If you know the name of the interface and want to get properties for that specific interface, scope the request to a specific interface by name:

```REST
GET /digitalTwins/t-123/interfaces/info
```

More generally, properties for a specific interface can be accessed through this REST API template where `device-id` is the identifier for the device and `{interface-name}` is the name of the interface:

```REST
GET /digitalTwins/{device-id}/interfaces/{interface-name}
```

You can call Plug and Play device commands directly. If the `Thermostat` interface in the `t-123` device has a `restart` command, you can call it with a REST API POST call:

```REST
POST /digitalTwins/t-123/interfaces/thermostat/commands/restart
```

More generally, commands can be called through this REST API template:

- `device-id`: the identifier for the device.
- `interface-name`: the name of the interface from the implements section in the device capability model.
- `command-name`: the name of the command.

```REST
/digitalTwins/{device-id}/interfaces/{interface-name}/commands/{command-name}
```

## Next steps

Now that you've learned about device modeling, here are some additional resources:

- [Digital Twin Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
