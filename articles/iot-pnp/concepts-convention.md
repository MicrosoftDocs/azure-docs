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

IoT Plug and Play Preview devices should follow a set of conventions when they exchange messages with an IoT hub. IoT Plug and Play Preview devices use the MQTT protocol to communicate with IoT Hub.

You describe the telemetry, properties, and commands that an IoT Plug and Play device implements with a [Digital Twins Definition Language v2 (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) _model_. There are two types of model referred to in this article:

- **No component** - A model with no components. The model declares telemetry, properties, and commands as top-level properties in the contents section of the main interface.
- **Multiple components** - A model composed of two or more interfaces. A main interface with telemetry, properties, and commands. One or more interfaces declared as components with additional telemetry, properties, and commands.

For more information, see [IoT Plug and Play components in models](concepts-components.md).

## Identify the model

To announce the model it implements, an IoT Plug and Play device includes the model ID in the MQTT connection packet by adding `model-id` to the `USERNAME` field.

To identify the model that a device implements, a service can get the model ID from:

- The device twin `modelId` field.
- The digital twin `$metadata.$model` field.
- A digital twin change notification.

## Telemetry

Telemetry sent from a no component device doesn't require any extra metadata. The system adds the `dt-dataschema` property.

Telemetry sent from a multiple component device must add `$.sub` as a message property. The system adds the `dt-subject` and `dt-dataschema` properties.

## Read-only properties

### Sample no component read-only property

A device can send any valid JSON that follows the DTDL v2 rules.

:::row:::
   :::column span="":::
      **DTDL**

      ```json
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
      ```
   :::column-end:::
   :::column span="":::
      **Sample payload**

      ```json
      "reported" :
      {
        "temperature" : 21.3
      }
      ```
   :::column-end:::
:::row-end:::

### Sample multiple components read-only property

The device must add the `{"__t": "c"}` marker to indicate that the element refers to a component.

:::row:::
   :::column span="":::
      **DTDL**

      ```json
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
      ```
   :::column-end:::
   :::column span="":::
      **Reported property**

      ```json
      "reported": {
        "thermostat1": {
          "__t": "c",
          "temperature": 21.3
        }
      }
      ```
   :::column-end:::
:::row-end:::

## Writable properties

The device should confirm that it received the property by sending a reported property. The reported property should include:

- `value` - the actual value of the property (typically the received value, but the device may decide to report a different value).
- `ac` - an acknowledgment code that uses an HTTP status code.
- `av` - an acknowledgment version that refers to the `$version` of the desired property.
- `ad` - an optional acknowledgment description.

### Sample no component writable property

A device can send any valid JSON that follows the DTDL v2 rules:

:::row:::
   :::column span="":::
      **DTDL**

      ```json
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
      ```
   :::column-end:::
   :::column span="":::
      **Desired property**

      ```json
      "desired" :
      {
        "targetTemperature" : 21.3
      },
      "$version" : 3
      ```
   :::column-end:::
   :::column span="":::
      **Reported property**

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
   :::column-end:::
:::row-end:::

### Sample multiple components writable property

The device must add the `{"__t": "c"}` marker to indicate that the element refers to a component.

The marker is sent only for component level updates, so devices mustn't check for this flag.

The device should confirm that it received the property by sending a reported property:

:::row:::
   :::column span="":::
      **DTDL**

      ```json
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
      ```
   :::column-end:::
   :::column span="":::
      **Desired property**

      ```json
      "desired": {
        "thermostat1": {
          "__t": "c",
          "targetTemperature": 21.3
        }
      },
      "$version" : 3
      ```
   :::column-end:::
   :::column span="":::
      **Reported property**

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
   :::column-end:::
:::row-end:::

## Commands

No component interfaces use the command name without a prefix.

On a device, multiple component interfaces use command names with the following format: `componentName*commandName`.

## Next steps

Now that you've learned about IoT Plug and Play conventions, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)
