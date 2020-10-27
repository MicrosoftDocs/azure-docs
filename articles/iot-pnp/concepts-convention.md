---
title: IoT Plug and Play conventions | Microsoft Docs
description: Description of the conventions IoT Plug and Play expects devices to use when they send telemetry and properties, and handle commands and property updates.
author: rido-min
ms.author: rmpablos
ms.date: 07/10/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play conventions

IoT Plug and Play devices should follow a set of conventions when they exchange messages with an IoT hub. IoT Plug and Play devices use the MQTT protocol to communicate with IoT Hub.

Devices can include [modules](../iot-hub/iot-hub-devguide-module-twins.md), or be implemented in an [IoT Edge module](../iot-edge/about-iot-edge.md) hosted by the IoT Edge runtime.

You describe the telemetry, properties, and commands that an IoT Plug and Play device implements with a [Digital Twins Definition Language v2 (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) _model_. There are two types of model referred to in this article:

- **No component** - A model with no components. The model declares telemetry, properties, and commands as top-level properties in the contents section of the main interface. In the Azure IoT explorer tool, this model appears as a single _default component_.
- **Multiple components** - A model composed of two or more interfaces. A main interface, which appears as the _default component_, with telemetry, properties, and commands. One or more interfaces declared as components with additional telemetry, properties, and commands.

For more information, see [IoT Plug and Play components in models](concepts-components.md).

## Identify the model

To announce the model it implements, an IoT Plug and Play device or module includes the model ID in the MQTT connection packet by adding `model-id` to the `USERNAME` field.

To identify the model that a device or module implements, a service can get the model ID from:

- The device twin `modelId` field.
- The digital twin `$metadata.$model` field.
- A digital twin change notification.

## Telemetry

Telemetry sent from a no component device doesn't require any extra metadata. The system adds the `dt-dataschema` property.

Telemetry sent from a multiple component device must add `$.sub` as a message property. The system adds the `dt-subject` and `dt-dataschema` properties.

## Read-only properties

### Sample no component read-only property

A device or module can send any valid JSON that follows the DTDL v2 rules.

DTDL:

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

DTDL:

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

## Writable properties

The device or module should confirm that it received the property by sending a reported property. The reported property should include:

- `value` - the actual value of the property (typically the received value, but the device may decide to report a different value).
- `ac` - an acknowledgment code that uses an HTTP status code.
- `av` - an acknowledgment version that refers to the `$version` of the desired property. You can find this value in the desired property JSON payload.
- `ad` - an optional acknowledgment description.

When a device starts up, it should request the device twin, and check for any writable property updates. If the version of a writable property increased while the device was offline, the device should send a reported property response to confirm that it received the update.

When a device starts up for the first time, it can send an initial value for a reported property if it doesn't receive an initial desired property from the hub. In this case, the device should set `av` to `1`. For example:

```json
"reported": {
  "targetTemperature": {
    "value": 20.0,
    "ac": 200,
    "av": 1,
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

When the device reaches the target temperature it sends the following message:

```json
"reported": {
  "targetTemperature": {
    "value": 20.0,
    "ac": 200,
    "av": 3,
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

### Sample no component writable property

When a device receives multiple reported properties in a single payload, it can send the reported property responses across multiple payloads.

A device or module can send any valid JSON that follows the DTDL v2 rules:

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
    }
  ]
}
```

Sample desired property payload:

```json
"desired" :
{
  "targetTemperature" : 21.3,
  "targetHumidity" : 80
},
"$version" : 3
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

### Sample multiple components writable property

The device or module must add the `{"__t": "c"}` marker to indicate that the element refers to a component.

The marker is sent only for updates to properties defined in a component. Updates to properties defined in the default component don't include the marker, see [Sample no component writable property](#sample-no-component-writable-property)

When a device receives multiple reported properties in a single payload, it can send the reported property responses across multiple payloads.

The device or module should confirm that it received the properties by sending reported properties:

DTDL:

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
    "targetHumidity": 80
  }
},
"$version" : 3
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

## Commands

No component interfaces use the command name without a prefix.

On a device or module, multiple component interfaces use command names with the following format: `componentName*commandName`.

## Next steps

Now that you've learned about IoT Plug and Play conventions, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl)
- [C device SDK](/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](/rest/api/iothub/device)
- [Model components](./concepts-components.md)