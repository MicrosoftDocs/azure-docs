---
title: Developer guide - IoT Plug and Play Preview | Microsoft Docs
description: Description of device modeling for IoT Plug and Play developers
author: rido-min
ms.author: rmpablos
ms.date: 04/22/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview modeling developer guide

IoT Plug and Play Preview lets you build devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

To build an IoT Plug and Play device, you create a _model_ to describe the device using the [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL).

## Device model

With DTDL, you create a model to describe the parts of your device. A typical IoT device is made up of:

- Custom parts, which are the things that make your device unique.
- Standard parts, which are things that are common to all devices.

These parts are called _components_ in a device model. Components use interfaces to define the details of each part your device implements.

The following example shows the model for a thermostat device:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "displayName": "Sample thermostat with remote control",
  "contents": [
    {
      "@type": "Component",
      "schema": "dtmi:com:example:TemperatureSensor;1",
      "name": "tempSensor1"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1",
      "name": "deviceInfo"
    }
  ]
}
```

A model has some required fields:

- `@id`: a unique ID in the form of a digital twin model identifier (DTMI).
- `@type`: declares that this object is an interface.
- `@context`: specifies the DTDL version used for the capability model.
- `contents`: lists the interfaces that your device implements.

Each entry in the list of interfaces in the contents section has a:

- `@type`: This must be `Component`
- `name`: the programming name of the component.
- `schema`: the interface the components implements.

There are other optional fields you can use to add more details to the model, such as display name and description.

## Interfaces

With DTDL, you describe the model of your device using interfaces. An interface describes the _properties_, _telemetry_, and _commands_ a part of your device implements:

- `Properties`. Properties are data fields that represent the state of your device. Use properties to represent the durable state of the device, such as the on-off state of a coolant pump. Properties can also represent basic device properties, such as the firmware version of the device. You can declare properties as read-only or writable.
- `Telemetry`. Telemetry fields represent measurements from sensors. Whenever your device takes a sensor measurement, it should send a telemetry event containing the sensor data.
- `Commands`. Commands represent methods that users of your device can execute on the device. For example, a reset command or a command to switch a fan on or off.

The following example shows the interface for a temperature sensor:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:TemperatureSensor;1",
  "@type": "Interface",
  "displayName": "Temperature Sensor",
  "description": "Provides functionality to report temperature, and write property to set the target Temperature",
  "comment": "Requires temperature sensors.",
  "contents": [
    {
      "@type": [
        "Telemetry",
        "Temperature"
      ],
      "description": "Current temperature on the device",
      "displayName": "Temperature",
      "name": "temperature",
      "schema": "double",
      "unit": "degreeCelsius"
    }
  ]
}
```

An interface has some required fields:

- `@id`: a unique ID in the form of a DTMI.
- `@type`: declares that this object is an interface.
- `@context`: specifies the DTDL version used for the interface.
- `contents`: lists the properties, telemetry, and commands that make up your device.

In this simple example, there's only a single telemetry field. A minimal field description has a:

- `@type`: specifies the type of capability: `Telemetry`, `Property`, or `Command`.
- `name`: provides the name of the telemetry value.
- `schema`: specifies the data type for the telemetry. This value can be a primitive type, such as double, integer, boolean, or string. Complex object types, arrays, and maps are also supported.

Other optional fields, such as display name and description let you add more details to the interface and capabilities.

### Properties

By default, properties are read-only. Read-only properties mean that the device reports property value updates to your IoT hub. Your IoT hub can't set the value of a read-only property.

You can also mark a property as writeable on an interface. A device can receive an update to a writeable property from your IoT hub as well as reporting property value updates to your hub.

Devices don't have to be connected to set property values. The updated values are transferred when the device next connects to the hub. This behavior applies to both read-only and writeable properties.

Don't use properties to send telemetry from your device. For example, a readonly property such as `temperatureSetting=80` should mean that the device temperature has been set to 80, and the device is trying to get to, or stay at, this temperature.

For writable properties, the device application returns a desired state status code, version, and description to indicate whether it received and applied the property value.

### Telemetry

By default, IoT Hub routes all telemetry messages from devices to its [built-in service-facing endpoint (**messages/events**)](../iot-hub/iot-hub-devguide-messages-read-builtin.md) that's compatible with [Event Hubs](https://azure.microsoft.com/documentation/services/event-hubs/).

You can use [IoT Hub's custom endpoints and routing rules](../iot-hub/iot-hub-devguide-messages-d2c.md) to send telemetry to other destinations such as blob storage or other event hubs. Routing rules use message properties to select messages.

### Commands

A command must execute within 30 seconds by default, and the device must be connected when the command arrives. If the device doesn't respond in time, or the device isn't connected, then the command fails.

## Register a device

IoT Plug and Play makes it easy to advertise the capabilities of your device. A Plug and Play device must send it's **Model ID** when it connects to IoT Hub. The ID will be available in the Digital Twin associated to your device, under the `$metadata.$model` property.

This guide shows you how to connect a device and advertise the Model ID using the Azure IoT Device SDK for C.

```c
#define DIGITALTWIN_SAMPLE_DEVICE_MODEL_ID "dtmi:com:example:Thermostat;1"
deviceHandle = IoTHubDeviceClient_CreateFromConnectionString(connectionString, MQTT_Protocol);
DigitalTwin_DeviceClient_CreateFromDeviceHandle(deviceHandle, DIGITALTWIN_SAMPLE_DEVICE_MODEL_ID, &dtDeviceClientHandle)
```

For each interface your device implements, you must create an interface and connect it to its implementation.

For the thermostat interface shown previously, using the C SDK, you create and connect your thermostat interface to its implementation:

```c
DIGITALTWIN_INTERFACE_HANDLE thermostatInterfaceHandle;

DIGITALTWIN_CLIENT_RESULT result = DigitalTwin_InterfaceClient_Create(
    "tempSensor",
    "dtmi:com:example:TemperatureSensor;1",
    null, null,
    &thermostatInterfaceHandle);
```

Repeat this code for each interface your device implements.

After you create an interface, register your device capability model and interfaces with your IoT hub:

```c
DIGITALTWIN_INTERFACE_CLIENT_HANDLE interfaces[2];
interfaces[0] = thermostatInterfaceHandle;
interfaces[1] = deviceInfoInterfaceHandle;

result = DigitalTwin_DeviceClient_RegisterInterfacesAsync(
    digitalTwinClientHandle, // The handle for the connection to Azure IoT
    interfaces, // The array with interface clients.
    2, // number of interfaces);
```

## Use a device

IoT Plug and Play lets you use devices that have registered their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

To use an IoT Plug and Play device that's connected to your IoT hub, use either the IoT Hub REST API or one of the IoT language SDKs. The following examples use the IoT Hub REST API. The current version of the API is `2020-05-31-preview`. Append `?api-version=2020-05-31` to your REST PI calls.

To get the value of a device property, such as the firmware version (`fwVersion`) in the `DeviceInformation` interface in the thermostat, you use the digital twins REST API.

If your thermostat device is called `t-123`, you get the all the properties on all the interfaces implemented by your device with a REST API GET call:

```REST
GET /digitalTwins/t-123
```

More generally, all properties on all interfaces are accessed with the `GET /DigitalTwin/{device-id}` REST API template where `{device-id}` is the identifier for the device:

```REST
GET /digitalTwins/{device-id}
```

You can call IoT Plug and Play device commands directly. If the `Thermostat` component in the `t-123` device has a `restart` command, you can call it with a REST API POST call:

```REST
POST /digitalTwins/t-123/components/Thermostat/commands/restart
```

More generally, commands can be called through this REST API template:

- `device-id`: the identifier for the device.
- `component-name`: the name of the interface from the implements section in the device capability model.
- `command-name`: the name of the command.

```REST
/digitalTwins/{device-id}/components/{component-name}/commands/{command-name}
```

## Next steps

Now that you've learned about device modeling, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)
