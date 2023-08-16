---
title: Understand IoT Plug and Play digital twins
description: Understand how IoT Plug and Play uses digital twins
author: dominicbetts
ms.author: dobett
ms.date: 04/25/2023
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
---

# Understand IoT Plug and Play digital twins

An IoT Plug and Play device implements a model described by the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md) schema. A model describes the set of components, properties, commands, and telemetry messages that a particular device can have.

> [!NOTE]
> DTDL isn't exclusive to IoT Plug and Play. Other IoT services, such as [Azure Digital Twins](../digital-twins/overview.md), use it to represent entire environments such as buildings and energy networks.

The Azure IoT service SDKs include APIs that let a service interact a device's digital twin. For example, a service can read device properties from the digital twin or use the digital twin to call a command on a device. To learn more, see [IoT Hub digital twin examples](concepts-developer-guide-service.md#iot-hub-digital-twin-examples).

The example IoT Plug and Play device in this article implements a [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) that has [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) components.

## Device twins and digital twins

Along with a digital twin, Azure IoT Hub also maintains a *device twin* for every connected device. A device twin is similar to a digital twin in that it's a representation of a device's properties. An IoT hub initializes a digital twin and a device twin the first time an IoT Plug and Play device is provisioned. The Azure IoT service SDKs include APIs for interacting with device twins.

Device twins are JSON documents that store device state information, including metadata, configurations, and conditions. To learn more, see [IoT Hub service client examples](concepts-developer-guide-service.md#iot-hub-service-client-examples). Device and solution builders can both use the same set of device twin APIs and SDKs to implement devices and solutions using IoT Plug and Play conventions. In a device twin, the state of a writable property is split across the *desired properties* and *reported properties* sections. All read-only properties are available within the reported properties section.

The digital twin APIs operate on high-level DTDL constructs such as components, properties, and commands and makes it easier for solution builders to create IoT Plug and Play solutions. In a digital twin, there's a unified view of the current and desired state of the property. The synchronization state for a given property is stored in the corresponding default component `$metadata` section.

### Device twin JSON example

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

### Digital twin example

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

The following table describes the fields in the digital twin JSON object:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the device digital twin. |
| `{propertyName}` | The value of a property in JSON. |
| `$metadata.$model` | [Optional] The ID of the model interface that characterizes this digital twin. |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property. |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value maintained by IoT Hub.|
| `$metadata.{propertyName}.ackVersion` | [Required, only for writable properties] The version acknowledged by the device implementing the digital twin, it must by greater or equal to desired version. |
| `$metadata.{propertyName}.ackCode` | [Required, only for writable properties] The `ack` code returned by the device app implementing the digital twin. |
| `$metadata.{propertyName}.ackDescription` | [Optional, only for writable properties] The `ack` description returned by the device app implementing the digital twin. |
| `$metadata.{propertyName}.lastUpdateTime` | IoT Hub maintains the timestamp of the last update of the property by the device. The timestamps are in UTC and encoded in the ISO8601 format YYYY-MM-DDTHH:MM:SS.mmmZ. |
| `{componentName}` | A JSON object containing the component's property values and metadata. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON. |
| `{componentName}.$metadata` | The metadata information for the component. |

### Properties

Properties are data fields that represent the state of an entity just like the properties in many object-oriented programming languages.

#### Read-only property

DTDL schema:

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

#### Writable property

The following examples show a writable property in the default component.

DTDL:

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

Components let you build a model interface as an assembly of other interfaces. For example, the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json) interface can be incorporated as components `thermostat1` and  `thermostat2` in the [Temperature Controller model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) model.

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

The digital twin APIs include **Get Digital Twin**, **Update Digital Twin**, **Invoke Component Command** and **Invoke Command** operations more managing a digital twin. You can either use the [REST APIs](/rest/api/iothub/service/digitaltwin) directly or through one of the [service SDKs](concepts-developer-guide-service.md#service-sdks).

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

Now that you've learned about digital twins, here are some more resources:

- [How to use IoT Plug and Play digital twin APIs](howto-manage-digital-twin.md)
- [Interact with a device from your solution](tutorial-service.md)
- [IoT Digital Twin REST API](/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](../iot/howto-use-iot-explorer.md)
