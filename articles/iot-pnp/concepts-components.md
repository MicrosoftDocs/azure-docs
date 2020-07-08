---
title: Understand components in Azure IoT Plug and Play models | Microsoft Docs
description: Understand difference between IoT Plug and Play DTDL models that use components and models that don't use components.
author: ericmitt
ms.author: ericmitt
ms.date: 07/07/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp

# As a device developer, I want to understand difference between DTDL models that use components and models that don't use components.
---

# IoT Plug and Play components in models

In the IoT Plug and Play convention, a device is an IoT Plug and Play device if it presents its digital twins definition language (DTDL) model ID when it connects to an IoT hub.

The following snippet shows some example model IDs:

```json
 "@id": "dtmi:com:example:TemperatureController;1"
 "@id": "dtmi:com:example:Thermostat;1",
```

## No components

A simple, or component-less, model doesn't have embedded or cascaded components. It includes header information and a contents section to define telemetry, properties, and commands.

The following example shows part of a simple, component-less model:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
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
...
```

Although the model doesn't explicitly define a component, it behaves as if there is a single, default component with all the telemetry, property, and command definitions.

The following screenshot shows how the model displays in the Azure IoT explorer tool:

:::image type="content" source="media/concepts-components/default-component.png" alt-text="Default component in Azure IoT explorer":::

The model ID is stored in a device twin property as the following screenshot shows:

:::image type="content" source="media/concepts-components/twin-model-id.png" alt-text="Model ID in digital twin property":::

A DTDL model without components is a useful simplification for a device with a single set of telemetry, properties, and commands. A model that doesn't use components makes it easy to migrate an existing device to be an IoT Plug and Play device - you create a DTDL model that describes your actual device without the need to define any components.

## Multiple components

For a DTDL model with multiple components, there are two or more component sections. Each section has `@type` set to `Component` and explicitly refers to a schema as shown in the following snippet:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "displayName": "Thermostat",
  "description": "Reports current temperature and provides desired temperature control.",
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

This model has three components defined in the contents section -  two `Thermostat` components and a `DeviceInformation` component. There's also a default root component.

## Next steps

Now that you've learned about model components, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [Model repositories](./concepts-model-repository.md)