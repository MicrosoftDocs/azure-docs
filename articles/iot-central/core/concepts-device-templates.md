---
title: What are device templates in Azure IoT Central
description: Device templates let you specify the behavior of the devices connected to your application. They also define a UI for the device in IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/05/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: device-developer
# This article applies to device developers and solution builders.
---

# What are device templates?

A device template in Azure IoT Central is a blueprint that defines the characteristics and behaviors of a type of device that connects to your application. For example, the device template defines the telemetry that a device sends so that IoT Central can create visualizations that use the correct units and data types.

A solution builder adds device templates to an IoT Central application. A device developer writes the device code that implements the behaviors defined in the device template. To learn more about the data that a device exchanges with IoT Central, see [Telemetry, property, and command payloads](../../iot/concepts-message-payloads.md).

A device template includes the following sections:

- _A device model_. This part of the device template defines how the device interacts with your application. Every device model has a unique ID. A device developer implements the behaviors defined in the model.
  - _Root component_. Every device model has a root component. The root component's interface describes capabilities that are specific to the device model.
  - _Components_. A device model may include components in addition to the root component to describe device capabilities. Each component has an interface that describes the component's capabilities. Component interfaces may be reused in other device models. For example, several phone device models could use the same camera interface.
  - _Inherited interfaces_. A device model contains one or more interfaces that extend the capabilities of the root component.
- _Views_. This part of the device template lets the solution developer define visualizations to view data from the device, and forms to manage and control a device. Views don't affect the code that a device developer writes to implement the device model.

## Assign a device to a device template

For a device to interact with IoT Central, it must be assigned to a device template. This assignment is done in one of four ways:

- When you register a device on the **Devices** page, you can identify the template the device should use.
- When you bulk import a list of devices, you can choose the device template all the devices on the list should use.
- You can manually assign an unassigned device to a device template after it connects.
- You can automatically assign a device to a device template by sending a model ID when the device first connects to your application.

### Automatic assignment

IoT Central can automatically assign a device to a device template when the device connects. A device should send a [model ID](../../iot/iot-glossary.md?toc=/azure/iot-central/toc.json&bc=/azure/iot-central/breadcrumb/toc.json#model-id) when it connects. IoT Central uses the model ID to identify the device template for that specific device model. The discovery process works as follows:

1. If the device template is already published in the IoT Central application, the device is assigned to the device template.
1. If the device template isn't already published in the IoT Central application, IoT Central looks for the device model in the public device model repository. If IoT Central finds the model, it uses it to generate a basic device template.
1. If IoT Central doesn't find the model in the public model repository, the device is marked as **Unassigned**. An operator can:

    - Create a device template for the device and then migrate the unassigned device to the new device template.
    - [Autogenerate a device template](howto-set-up-template.md#autogenerate-a-device-template) based on the data the device sends.

The following screenshot shows you how to view the model ID of a device template in IoT Central. In a device template, select a component, and then select **Edit identity**:

:::image type="content" source="media/concepts-device-templates/model-id.png" alt-text="Screenshot showing model ID in thermostat device template." lightbox="media/concepts-device-templates/model-id.png":::

You can view the [thermostat model](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/thermostat-1.json) in the public model repository. The model ID definition looks like:

```json
"@id": "dtmi:com:example:Thermostat;1"
```

Use the following DPS payload to assign the device to a device template:

```json
{
  "modelId":"dtmi:com:example:TemperatureController;2"
}
```

To learn more about the DPS payload, see the sample code used in the [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).

## Device models

A device model defines how a device interacts with your IoT Central application. The device developer must make sure that the device implements the behaviors defined in the device model so that IoT Central can monitor and manage the device. A device model is made up of one or more _interfaces_, and each interface can define a collection of _telemetry_ types, _device properties_, and _commands_. A solution developer can:

- Import a JSON file that defines a complete device model or individual interface into a device template.
- Use the web UI in IoT Central to create or edit a device model.

> [!NOTE]
> IoT Central accepts any valid JSON payload from a device but it can only use the data for visualizations if it matches a definition in the device model. You can export data that doesn't match a definition, see  [Export IoT data to cloud destinations using Blob Storage](howto-export-to-blob-storage.md).

To learn more about editing a device model, see [Edit an existing device template](howto-edit-device-template.md)

A solution developer can also export a JSON file from the device template that contains a complete device model or individual interface. A device developer can use this JSON document to understand how the device should communicate with the IoT Central application.

The JSON file that defines the device model uses the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md). IoT Central expects the JSON file to contain the device model with the interfaces defined inline, rather than in separate files. Models created in IoT Central have the context `dtmi:iotcentral:context;2` defined to indicate that the model was created in IoT Central:

```json
"@context": [
  "dtmi:iotcentral:context;2",
  "dtmi:dtdl:context;2"
]
```

To learn more about DTDL models, see the [IoT Plug and Play modeling guide](../../iot/concepts-modeling-guide.md).

> [!NOTE]
> IoT Central defines some extensions to the DTDL v2 language. To learn more, see [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md).

## Properties

By default, properties are read-only. Read-only properties mean that the device reports property value updates to your IoT Central application. Your IoT Central application can't set the value of a read-only property.

You can also mark a property as writable on an interface. A device can receive an update to a writable property from your IoT Central application and report property value updates to your application.

Devices don't need to be connected to set property values. The updated values are transferred when the device next connects to the application. This behavior applies to both read-only and writable properties.

Don't use properties to send telemetry from your device. For example, a readonly property such as `temperatureSetting=80` should mean that the device temperature has been set to 80, and the device is trying to get to, or stay at, this temperature.

For writable properties, the device application returns a desired state status code, version, and description to indicate whether it received and applied the property value.

### Cloud properties

You can also add cloud properties to the root component of the model. Cloud properties let you specify any device metadata to store in the IoT Central application. Cloud property values are stored in the IoT Central application and are never synchronized with a device. Cloud properties don't affect the code that a device developer writes to implement the device model.

A solution developer can add cloud properties to device views and forms alongside device properties to enable an operator to manage the devices connected to the application. A solution developer can also use cloud properties as part of a rule definition to make a threshold value editable by an operator.

The following DTDL snippet shows an example cloud property definition:

```json
{
    "@id": "dtmi:azureiot:Thermostat:CustomerName",
    "@type": [
        "Property",
        "Cloud",
        "StringValue"
    ],
    "displayName": {
        "en": "Customer Name"
    },
    "name": "CustomerName",
    "schema": "string"
}
```

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
> Offline commands are marked as `durable` if you export the model as DTDL.

Offline commands use [IoT Hub cloud-to-device messages](../../iot-hub/iot-hub-devguide-messages-c2d.md) to send the command and payload to the device.

The payload of the message the device receives is the raw value of the parameter. A custom property called `method-name` stores the name of the IoT Central command. The following table shows some example payloads:

| IoT Central request schema | Example payload received by device |
| -------------------------- | ---------------------------------- |
| No request parameter       | `@`                                |
| Double                     | `1.23`                             |
| String                     | `sample string`                    |
| Object                     | `{"StartTime":"2021-01-05T08:00:00.000Z","Bank":2}` |

The following snippet from a device model shows the definition of a command. The command has an object parameter with a datetime field and an enumeration:

```json
{
  "@type": "Command",
  "displayName": {
    "en": "Generate Diagnostics"
  },
  "name": "GenerateDiagnostics",
  "request": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "Payload"
    },
    "name": "Payload",
    "schema": {
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "displayName": {
            "en": "StartTime"
          },
          "name": "StartTime",
          "schema": "dateTime"
        },
        {
          "displayName": {
            "en": "Bank"
          },
          "name": "Bank",
          "schema": {
            "@type": "Enum",
            "displayName": {
              "en": "Enum"
            },
            "enumValues": [
              {
                "displayName": {
                  "en": "Bank 1"
                },
                "enumValue": 1,
                "name": "Bank1"
              },
              {
                "displayName": {
                  "en": "Bank2"
                },
                "enumValue": 2,
                "name": "Bank2"
              },
              {
                "displayName": {
                  "en": "Bank3"
                },
                "enumValue": 3,
                "name": "Bank3"
              }
            ],
            "valueSchema": "integer"
          }
        }
      ]
    }
  }
}
```

If you enable the **Queue if offline** option in the device template UI for the command in the previous snippet, then the message the device receives includes the following properties:

| Property name | Example value |
| ---------- | ----- |
| `custom_properties` | `{'method-name': 'GenerateDiagnostics'}` |
| `data` | `{"StartTime":"2021-01-05T08:00:00.000Z","Bank":2}` |

## Views

A solution developer creates views that let operators monitor and manage connected devices. Views are part of the device template, so a view is associated with a specific device type. A view can include:

- Charts to plot telemetry.
- Tiles to display read-only device properties.
- Tiles to let the operator edit writable device properties.
- Tiles to let the operator edit cloud properties.
- Tiles to let the operator call commands, including commands that expect a payload.
- Tiles to display labels, images, or markdown text.

## Next steps

Now that you've learned about device templates, a suggested next step is to read [Telemetry, property, and command payloads](../../iot/concepts-message-payloads.md) to learn more about the data a device exchanges with IoT Central.
