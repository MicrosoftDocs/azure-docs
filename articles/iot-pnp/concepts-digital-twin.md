---
title: Understand IoT Plug and Play digital twins
description: Understand how IoT Plug and Play uses digital twins
author: prashmo
ms.author: prashmo
ms.date: 07/17/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Understand IoT Plug and Play digital twins

An IoT Plug and Play device implements a model described by the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) schema. A model describes the set of components, properties, commands, and telemetry messages that a particular device can have. A device twin and a digital twin are initialized the first time an IoT Plug and Play device connects to an IoT hub.

IoT Plug and Play uses DTDL version 2. For more information about this version, see the [Digital Twins Definition Language (DTDL) - version 2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) specification on GitHub.

DTDL isn't exclusive to IoT Plug and Play. Other IoT services, such as [Azure Digital Twins](../digital-twins/overview.md), use it to represent entire environments such as buildings and energy networks. To learn more, see [Understand twin models in Azure Digital Twins](../digital-twins/concepts-models.md).

This article describes how components and properties are represented in the *desired* and *reported* sections of a device twin. It also describes how these concepts map to the corresponding digital twin.

The IoT plug and play device in this article that implements [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) with [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) component.

## Device twins and digital twins

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. To learn more, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md). Both device and solution builders can continue to use the same set of Device Twin APIs and SDKs to implement devices and solutions using IoT Plug and Play conventions.

Digital Twin APIs operate on high-level constructs in the Digital Twins Definition Language (DTDL) such as components, properties, and commands. The Digital Twin APIs make it easier for solution builders to create IoT Plug and Play solutions.

In a device twin, the state of a writable property is split across the desired and reported sections. All read-only properties are available within the reported section.

In a digital twin, there's a unified view of the current and desired state of the property. The synchronization state for a given property is stored in the corresponding default component `$metadata` section.

### Digital twin JSON format

When represented as a JSON object, a digital twin includes the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the device digital twin |
| `{propertyName}` | The value of a property in JSON |
| `$metadata.$model` | [Optional] The ID of the model interface that characterizes this digital twin |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value maintained by IoT Hub|
| `$metadata.{propertyName}.ackVersion` | [Required, only for writable properties] The version acknowledged by the device implementing the digital twin, it must by greater or equal to desired version |
| `$metadata.{propertyName}.ackCode` | [Required, only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [Optional, only for writable properties] The `ack` description returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.lastUpdateTime` | IoT Hub maintains the timestamp of the last update of the property by the device. The timestamps are in UTC and encoded in the ISO8601 format YYYY-MM-DDTHH:MM:SS.mmmZ |
| `{componentName}` | A JSON object containing the component's property values and metadata. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON |
| `{componentName}.$metadata` | The metadata information for the component. |

#### Device Twin sample

The following snippet shows an IoT Plug and Play device twin formatted as a JSON object:

```json
{
    "deviceId": "sample-device",
    "modelId": "dtmi:com:example:TemperatureController;1",
    "version": 15,
    "properties": {
        "desired": {
            "thermostat1": {
                "__t": "c",
                "targetTemperature": 21.8
            },
            "$metadata": {...},
            "$version": 4
        },
        "reported": {
            "serialNumber": "alwinexlepaho8329",
            "thermostat1": {
                "maxTempSinceLastReboot": 25.3,
                "__t": "c",
                "targetTemperature": {
                    "value": 21.8,
                    "ac": 200,
                    "ad": "Successfully executed patch",
                }
            },
            "$metadata": {...},
            "$version": 11
        }
    }
}
```

#### Digital Twin sample

The following snippet shows the digital twin formatted as a JSON object:

```json
{
    "$dtId": "sample-device",
    "serialNumber": "alwinexlepaho8329",
    "thermostat1": {
        "maxTempSinceLastReboot": 25.3,
        "targetTemperature": 21.8,
        "$metadata": {
            "targetTemperature": {
                "desiredValue": 21.8,
                "desiredVersion": 4,
                "ackVersion": 4,
                "ackCode": 200,
                "ackDescription": "Successfully executed patch",
                "lastUpdateTime": "2020-07-17T06:11:04.9309159Z"
            },
            "maxTempSinceLastReboot": {
                "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
            }
        }
    },
    "$metadata": {
        "$model": "dtmi:com:example:TemperatureController;1",
        "serialNumber": {
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

### Properties

Properties are data fields that represent the state of an entity (like the properties in many object-oriented programming languages).

#### Read-only Property

Schema:

```json
{
    "@type": "Property",
    "name": "serialNumber",
    "displayName": "Serial Number",
    "description": "Serial number of the device.",
    "schema": "string"
}
```

In this example, `alwinexlepaho8329` is the current value of the `serialNumber` read-only property reported by the device.
The following snippets show the side-by-side JSON representation of the `serialNumber` property:

:::row:::
   :::column span="":::
      **Device twin**

```json
"properties": {
    "reported": {
        "serialNumber": "alwinexlepaho8329"
    }
}
```

   :::column-end:::
   :::column span="":::
      **Digital twin**

```json
"serialNumber": "alwinexlepaho8329"
```

   :::column-end:::
:::row-end:::

#### Writable Property

Let's say device also had the following writable property in the default component:

```json
{
    "@type": "Property",
    "name": "fanSpeed",
    "displayName": "Fan Speed",
    "writable": true,
    "schema": "double"
}
```

:::row:::
   :::column span="":::
      **Device twin**

```json
{
    "properties": {
        "desired": {
            "fanSpeed": 2.0,
        },
        "reported": {
            "fanSpeed": {
                "value": 3.0,
                "ac": 200,
                "av": 1,
                "ad": "Successfully executed patch version 1"
            }
        }
    },
}
```

   :::column-end:::
   :::column span="":::
      **Digital twin**

```json
{
    "fanSpeed": 3.0,
    "$metadata": {
        "fanSpeed": {
            "desiredValue": 2.0,
            "desiredVersion": 2,
            "ackVersion": 1,
            "ackCode": 200,
            "ackDescription": "Successfully executed patch version 1",
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

   :::column-end:::
:::row-end:::

In this example, `3.0` is the current value of the `fanSpeed` property reported by the device. `2.0` is the desired value set by the solution. The desired value and synchronization state of a root-level property is set within root-level `$metadata` for a digital twin. When the device comes online, it can apply this update and report back the updated value.

### Components

Components allow building model interface as an assembly of other interfaces.
Consider [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) interface, which is defined as a model.
This interface can now be incorporated as a component thermostat1(and another component thermostat2) when defining [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json).

In a device twin, a component is identified by the `{ "__t": "c"}` marker. In a digital twin, the presence of `$metadata` marks a component.

In this example, `thermostat1` is a component with two properties:

- `maxTempSinceLastReboot` is a read-only property.
- `targetTemperature` is a writable property that's been successfully synchronized by the device. The desired value and synchronization state of these properties are in the component's `$metadata`.

The following snippets show the side-by-side JSON representation of the `thermostat1` component:

:::row:::
   :::column span="":::
      **Device twin**

```json
"properties": {
    "desired": {
        "thermostat1": {
            "__t": "c",
            "targetTemperature": 21.8
        },
        "$metadata": {
        },
        "$version": 4
    },
    "reported": {
        "thermostat1": {
            "maxTempSinceLastReboot": 25.3,
            "__t": "c",
            "targetTemperature": {
                "value": 21.8,
                "ac": 200,
                "ad": "Successfully executed patch",
                "av": 4
            }
        },
        "$metadata": {
        },
        "$version": 11
    }
}
```

   :::column-end:::
   :::column span="":::
      **Digital twin**

```json
"thermostat1": {
    "maxTempSinceLastReboot": 25.3,
    "targetTemperature": 21.8,
    "$metadata": {
        "targetTemperature": {
            "desiredValue": 21.8,
            "desiredVersion": 4,
            "ackVersion": 4,
            "ackCode": 200,
            "ackDescription": "Successfully executed patch",
            "lastUpdateTime": "2020-07-17T06:11:04.9309159Z"
        },
        "maxTempSinceLastReboot": {
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

   :::column-end:::
:::row-end:::

## Digital twin APIs

Azure Digital Twins comes equipped with **Get Digital Twin**, **Update Digital Twin**, **Invoke Component Command** and **Invoke Command** for managing device digital twin. You can either use the [REST APIs](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin) directly or through a [Service SDK](../iot-pnp/libraries-sdks.md).

## Digital twin change events

When digital twin change events are enabled, an event is triggered whenever the current or desired value of the component or property changes. Digital twin change events are generated in [JSON Patch](http://jsonpatch.com/) format. Corresponding events are generated in the device twin format if twin change events are enabled.

To learn how to enable routing for device and digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events). To understand the message format, see [Create and read IoT Hub messages](../iot-hub/iot-hub-devguide-messages-construct.md).

For example, the following digital twin change event is triggered when `targetTemperature` is set by the solution:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/17/2020 6:11:04 AM
iothub-message-source:digitalTwinChangeEvents
correlation-id:275d463fa034
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature",
    "value": {
      "desiredValue": 21.8,
      "desiredVersion": 4
    }
  }
]
```

The following digital twin change event is triggered when the device reports that the above desired change was applied:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/17/2020 6:11:05 AM
iothub-message-source:digitalTwinChangeEvents
correlation-id:275d464a2c80
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackCode",
    "value": 200
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackDescription",
    "value": "Successfully executed patch"
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/ackVersion",
    "value": 4
  },
  {
    "op": "add",
    "path": "/thermostat1/$metadata/targetTemperature/lastUpdateTime",
    "value": "2020-07-17T06:11:04.9309159Z"
  },
  {
    "op": "add",
    "path": "/thermostat1/targetTemperature",
    "value": 21.8
  }
]
```

> [!NOTE]
> Twin change notification messages are doubled when turned on in both device and digital twin change notification.

## Next steps

Now that you've learned about digital twins, here are some additional resources:

- [How to use IoT Plug and Play digital twin APIs](howto-manage-digital-twin.md)
- [Interact with a device from your solution](quickstart-service-node.md)
- [IoT Digital Twin REST API](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](howto-use-iot-explorer.md)
