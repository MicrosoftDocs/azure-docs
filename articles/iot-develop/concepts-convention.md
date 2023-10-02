---
title: IoT Plug and Play conventions | Microsoft Docs
description: Description of the conventions IoT Plug and Play expects devices to use when they send telemetry and properties, and handle commands and property updates.
author: rido-min
ms.author: rmpablos
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
---

# IoT Plug and Play conventions

IoT Plug and Play devices should follow a set of conventions when they exchange messages with an IoT hub. IoT Plug and Play devices use the MQTT protocol to communicate with IoT Hub. IoT Hub also supports the AMQP protocol which available in some IoT device SDKs.

A device can include [modules](../iot-hub/iot-hub-devguide-module-twins.md), or be implemented in an [IoT Edge module](../iot-edge/about-iot-edge.md) hosted by the IoT Edge runtime.

You describe the telemetry, properties, and commands that an IoT Plug and Play device implements with a [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md) _model_. There are two types of model referred to in this article:

- **No component** - A model with no components. The model declares telemetry, properties, and commands as top-level elements in the contents section of the main interface. In the Azure IoT explorer tool, this model appears as a single _default component_.
- **Multiple components** - A model composed of two or more interfaces. A main interface, which appears as the _default component_, with telemetry, properties, and commands. One or more interfaces declared as components with more telemetry, properties, and commands.

For more information, see [IoT Plug and Play modeling guide](concepts-modeling-guide.md).

## Identify the model

To announce the model it implements, an IoT Plug and Play device or module includes the model ID in the MQTT connection packet by adding `model-id` to the `USERNAME` field.

To identify the model that a device or module implements, a service can get the model ID from:

- The device twin `modelId` field.
- The digital twin `$metadata.$model` field.
- A digital twin change notification.

## Telemetry

- Telemetry sent from a no component device doesn't require any extra metadata. The system adds the `dt-dataschema` property.
- Telemetry sent from a device using components must add the component name to the telemetry message.
- When using MQTT, add the `$.sub` property with the component name to the telemetry topic, the system adds the `dt-subject` property.
- When using AMQP, add the `dt-subject` property with the component name as a message annotation.

> [!NOTE]
> Telemetry from components requires one message per component.

For more telemetry examples, see [Payloads > Telemetry](concepts-message-payloads.md#telemetry)

## Read-only properties

A device sets a read-only property which it then reports to the back-end application.

### Sample no component read-only property

A device or module can send any valid JSON that follows the DTDL rules.

DTDL that defines a property on an interface:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:example: Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Property",
      "name": "temperature",
      "schema": "double"
    }
  ]
}
```

Sample reported property payload:

```json
"reported" :
{
  "temperature" : 21.3
}
```

### Sample multiple components read-only property

The device or module must add the `{"__t": "c"}` marker to indicate that the element refers to a component.

DTDL that references a component:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:TemperatureController;1",
  "@type": "Interface",
  "displayName": "Temperature Controller",
  "contents": [
    {
      "@type" : "Component",
      "schema": "dtmi:com:example:Thermostat;1",
      "name": "thermostat1"
    }
  ]
}
```

DTDL that defines the component:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Property",
      "name": "temperature",
      "schema": "double"
    }
  ]
}
```

Sample reported property payload:

```json
"reported": {
  "thermostat1": {
    "__t": "c",
    "temperature": 21.3
  }
}
```

For more read-only property examples, see [Payloads > Properties](concepts-message-payloads.md#properties).

## Writable properties

A back-end application sets a writable property that IoT Hub then sends to the device.

The device or module should confirm that it received the property by sending a reported property. The reported property should include:

- `value` - the actual value of the property (typically the received value, but the device may decide to report a different value).
- `ac` - an acknowledgment code that uses an HTTP status code.
- `av` - an acknowledgment version that refers to the `$version` of the desired property. You can find this value in the desired property JSON payload.
- `ad` - an optional acknowledgment description.

### Acknowledgment responses

When reporting writable properties the device should compose the acknowledgment message, by using the four fields in the previous list, to indicate the actual device state, as described in the following table:

|Status(ac)|Version(av)|Value(value)|Description(av)|
|:---|:---|:---|:---|
|200|Desired version|Desired value|Desired property value accepted|
|202|Desired version|Value accepted by the device|Desired property value accepted, update in progress (should finish with 200)|
|203|0|Value set by the device|Property set from the device, not reflecting any desired|
|400|Desired version|Actual value used by the device|Desired property value not accepted|
|500|Desired version|Actual value used by the device|Exception when applying the property|

When a device starts up, it should request the device twin, and check for any writable property updates. If the version of a writable property increased while the device was offline, the device should send a reported property response to confirm that it received the update.

When a device starts up for the first time, it can send an initial value for a reported property if it doesn't receive an initial desired property from the IoT hub. In this case, the device can send the default value with `av` to `0` and `ac` to `203`. For example:

```json
"reported": {
  "targetTemperature": {
    "value": 20.0,
    "ac": 203,
    "av": 0,
    "ad": "initialize"
  }
}
```

A device can use the reported property to provide other information to the hub. For example, the device could respond with a series of in-progress messages such as:

```json
"reported": {
  "targetTemperature": {
    "value": 35.0,
    "ac": 202,
    "av": 3,
    "ad": "In-progress - reporting current temperature"
  }
}
```

When the device reaches the target temperature, it sends the following message:

```json
"reported": {
  "targetTemperature": {
    "value": 20.0,
    "ac": 200,
    "av": 4,
    "ad": "Reached target temperature"
  }
}
```

A device could report an error such as:

```json
"reported": {
  "targetTemperature": {
    "value": 120.0,
    "ac": 500,
    "av": 3,
    "ad": "Target temperature out of range. Valid range is 10 to 99."
  }
}
```

### Object type

If a writable property is defined as an object, the service must send a complete object to the device. The device should acknowledge the update by sending sufficient information back to the service for the service to understand how the device has acted on the update. This response could include:

- The entire object.
- Just the fields that the device updated.
- A subset of the fields.

For large objects, consider minimizing the size of the object you include in the acknowledgment.

The following example shows a writable property defined as an `Object` with four fields:

DTDL:

```json
{
  "@type": "Property",
  "name": "samplingRange",
  "schema": {
    "@type": "Object",
    "fields": [
      {
        "name": "startTime",
        "schema": "dateTime"
      },
      {
        "name": "lastTime",
        "schema": "dateTime"
      },
      {
        "name": "count",
        "schema": "integer"
      },
      {
        "name": "errorCount",
        "schema": "integer"
      }
    ]
  },
  "displayName": "Sampling range"
  "writable": true
}
```

To update this writable property, send a complete object from the service that looks like the following example:

```json
{
  "samplingRange": {
    "startTime": "2021-08-17T12:53:00.000Z",
    "lastTime": "2021-08-17T14:54:00.000Z",
    "count": 100,
    "errorCount": 5
  }
}
```

The device responds with an acknowledgment that looks like the following example:

```json
{
  "samplingRange": {
    "ac": 200,
    "av": 5,
    "ad": "Weighing status updated",
    "value": {
      "startTime": "2021-08-17T12:53:00.000Z",
      "lastTime": "2021-08-17T14:54:00.000Z",
      "count": 100,
      "errorCount": 5
    }
  }
}
```

### Sample no component writable property

When a device receives multiple desired properties in a single payload, it can send the reported property responses across multiple payloads or combine the responses into a single payload.

A device or module can send any valid JSON that follows the DTDL rules.

DTDL:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:example: Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Property",
      "name": "targetTemperature",
      "schema": "double",
      "writable": true
    },
    {
      "@type": "Property",
      "name": "targetHumidity",
      "schema": "double",
      "writable": true
    }
  ]
}
```

Sample desired property payload:

```json
"desired" :
{
  "targetTemperature" : 21.3,
  "targetHumidity" : 80,
  "$version" : 3
}
```

Sample reported property first payload:

```json
"reported": {
  "targetTemperature": {
    "value": 21.3,
    "ac": 200,
    "av": 3,
    "ad": "complete"
  }
}
```

Sample reported property second payload:

```json
"reported": {
  "targetHumidity": {
    "value": 80,
    "ac": 200,
    "av": 3,
    "ad": "complete"
  }
}
```

> [!NOTE]
> You could choose to combine these two reported property payloads into a single payload.

### Sample multiple components writable property

The device or module must add the `{"__t": "c"}` marker to indicate that the element refers to a component.

The marker is sent only for updates to properties defined in a component. Updates to properties defined in the default component don't include the marker, see [Sample no component writable property](#sample-no-component-writable-property).

When a device receives multiple reported properties in a single payload, it can send the reported property responses across multiple payloads or combine the responses into a single payload.

The device or module should confirm that it received the properties by sending reported properties:

DTDL that references a component:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:TemperatureController;1",
  "@type": "Interface",
  "displayName": "Temperature Controller",
  "contents": [
    {
      "@type" : "Component",
      "schema": "dtmi:com:example:Thermostat;1",
      "name": "thermostat1"
    }
  ]
}
```

DTDL that defines the component:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Property",
      "name": "targetTemperature",
      "schema": "double",
      "writable": true
    }
  ]
}
```

Sample desired property payload:

```json
"desired": {
  "thermostat1": {
    "__t": "c",
    "targetTemperature": 21.3,
    "targetHumidity": 80,
    "$version" : 3
  }
}
```

Sample reported property first payload:

```json
"reported": {
  "thermostat1": {
    "__t": "c",
    "targetTemperature": {
      "value": 23,
      "ac": 200,
      "av": 3,
      "ad": "complete"
    }
  }
}
```

Sample reported property second payload:

```json
"reported": {
  "thermostat1": {
    "__t": "c",
    "targetHumidity": {
      "value": 80,
      "ac": 200,
      "av": 3,
      "ad": "complete"
    }
  }
}
```

> [!NOTE]
> You could choose to combine these two reported property payloads into a single payload.

For more writable property examples, see [Payloads > Properties](concepts-message-payloads.md#writable-property-types).

## Commands

No component interfaces use the command name without a prefix.

On a device or module, multiple component interfaces use command names with the following format: `componentName*commandName`.

For more command examples, see [Payloads > Commands](concepts-message-payloads.md#commands).

> [!TIP]
> IoT Central has its own conventions for implementing [Long-running commands](../iot-central/core/howto-use-commands.md#long-running-commands) and [Offline commands](../iot-central/core/howto-use-commands.md#offline-commands).

## Next steps

Now that you've learned about IoT Plug and Play conventions, here are some other resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md)
- [C device SDK](https://github.com/Azure/azure-iot-sdk-c/)
- [IoT REST API](/rest/api/iothub/device)
- [IoT Plug and Play modeling guide](concepts-modeling-guide.md)
