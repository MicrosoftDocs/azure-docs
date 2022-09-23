---
title: Telemetry, property, and command payloads in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the telemetry, properties, and commands of a device must implement. Understand the format of the data a device can exchange with IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/08/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: device-developer

# This article applies to device developers.
---

# Telemetry, property, and command payloads

A [device template](concepts-device-templates.md) in Azure IoT Central is a blueprint that defines the:

* Telemetry a device sends to IoT Central.
* Properties a device synchronizes with IoT Central.
* Commands that IoT Central calls on a device.

This article describes the JSON payloads that devices send and receive for telemetry, properties, and commands defined in a device template.

> [!IMPORTANT]
> IoT Central expects to receive UTF-8 encoded JSON data.

The article doesn't describe every possible type of telemetry, property, and command payload, but the examples illustrate all the key types.

Each example shows a snippet from the device model that defines the type and example JSON payloads to illustrate how the device should interact with the IoT Central application.

> [!NOTE]
> IoT Central accepts any valid JSON but it can only be used for visualizations if it matches a definition in the device model. You can export data that doesn't match a definition, see  [Export IoT data to cloud destinations using Blob Storage](howto-export-to-blob-storage.md).

The JSON file that defines the device model uses the [Digital Twin Definition Language (DTDL) v2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).

For sample device code that shows some of these payloads in use, see the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial.

## View raw data

IoT Central lets you view the raw data that a device sends to an application. This view is useful for troubleshooting issues with the payload sent from a device. To view the raw data a device is sending:

1. Navigate to the device from the **Devices** page.

1. Select the **Raw data** tab:

    :::image type="content" source="media/concepts-telemetry-properties-commands/raw-data.png" alt-text="Raw data view":::

    On this view, you can select the columns to display and set a time range to view. The **Unmodeled data** column shows data from the device that doesn't match any property or telemetry definitions in the device template.

## Telemetry

To learn more about the DTDL telemetry naming rules, see [DTDL > Telemetry](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#telemetry). You can't start a telemetry name using the `_` character.

Don't create telemetry types with the following names. IoT Central uses these reserved names internally. If you try to use these names, IoT Central will ignore your data:

* `EventEnqueuedUtcTime`
* `EventProcessedUtcTime`
* `PartitionId`
* `EventHub`
* `User`
* `$metadata`
* `$version`

### Telemetry timestamps

By default, IoT Central uses the message enqueued time when it displays telemetry on dashboards and charts. Message enqueued time is set internally when IoT Central receives the message from the device.

A device can set the `iothub-creation-time-utc` property when it creates a message to send to IoT Central. If this property is present, IoT Central uses it when it displays telemetry on dashboards and charts.

You can export both the enqueued time and the `iothub-creation-time-utc` property when you export telemetry from your IoT Central application.

To learn more about message properties, see [System Properties of device-to-cloud IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md#system-properties-of-d2c-iot-hub-messages).

### Telemetry in components

If the telemetry is defined in a component, add a custom message property called `$.sub` with the name of the component as defined in the device model. To learn more, see [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).

> [!IMPORTANT]
> To display telemetry from components hosted in IoT Edge modules correctly, use [IoT Edge version 1.2.4](https://github.com/Azure/azure-iotedge/releases/tag/1.2.4) or later. If you use an earlier version, telemetry from your components in IoT Edge modules displays as *_unmodeleddata*.

### Primitive types

This section shows examples of primitive telemetry types that a device streams to an IoT Central application.

The following snippet from a device model shows the definition of a `boolean` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "BooleanTelemetry"
  },
  "name": "BooleanTelemetry",
  "schema": "boolean"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "BooleanTelemetry": true }
```

The following snippet from a device model shows the definition of a `string` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "StringTelemetry"
  },
  "name": "StringTelemetry",
  "schema": "string"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "StringTelemetry": "A string value - could be a URL" }
```

The following snippet from a device model shows the definition of an `integer` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "IntegerTelemetry"
  },
  "name": "IntegerTelemetry",
  "schema": "integer"
}

```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "IntegerTelemetry": 23 }
```

The following snippet from a device model shows the definition of a `double` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "DoubleTelemetry"
  },
  "name": "DoubleTelemetry",
  "schema": "double"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "DoubleTelemetry": 56.78 }
```

The following snippet from a device model shows the definition of a `dateTime` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "DateTimeTelemetry"
  },
  "name": "DateTimeTelemetry",
  "schema": "dateTime"
}
```

A device client should send the telemetry as JSON that looks like the following example - `DateTime` types must be in ISO 8061 format:

```json
{ "DateTimeTelemetry": "2020-08-30T19:16:13.853Z" }
```

The following snippet from a device model shows the definition of a `duration` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "DurationTelemetry"
  },
  "name": "DurationTelemetry",
  "schema": "duration"
}
```

A device client should send the telemetry as JSON that looks like the following example - durations must be in ISO 8601 format:

```json
{ "DurationTelemetry": "PT10H24M6.169083011336625S" }
```

### Complex types

This section shows examples of complex telemetry types that a device streams to an IoT Central application.

The following snippet from a device model shows the definition of a `geopoint` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "GeopointTelemetry"
  },
  "name": "GeopointTelemetry",
  "schema": "geopoint"
}
```

> [!NOTE]
> The **geopoint** schema type is not part of the [Digital Twins Definition Language specification](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). IoT Central currently supports the **geopoint** schema type and the **location** semantic type for backwards compatibility.

A device client should send the telemetry as JSON that looks like the following example. IoT Central displays the value as a pin on a map:

```json
{
  "GeopointTelemetry": {
    "lat": 47.64263,
    "lon": -122.13035,
    "alt": 0
  }
}
```

The following snippet from a device model shows the definition of an `Enum` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "EnumTelemetry"
  },
  "name": "EnumTelemetry",
  "schema": {
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "displayName": {
          "en": "Item3"
        },
        "enumValue": 2,
        "name": "Item3"
      }
    ]
  }
}
```

A device client should send the telemetry as JSON that looks like the following example. Possible values are `0`, `1`, and `2` that display in IoT Central as `Item1`, `Item2`, and `Item3`:

```json
{ "EnumTelemetry": 1 }
```

The following snippet from a device model shows the definition of an `Object` telemetry type. This object has three fields with types `dateTime`, `integer`, and `Enum`:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "ObjectTelemetry"
  },
  "name": "ObjectTelemetry",
  "schema": {
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "displayName": {
          "en": "Property1"
        },
        "name": "Property1",
        "schema": "dateTime"
      },
      {
        "displayName": {
          "en": "Property2"
        },
        "name": "Property2",
        "schema": "integer"
      },
      {
        "displayName": {
          "en": "Property3"
        },
        "name": "Property3",
        "schema": {
          "@type": "Enum",
          "displayName": {
            "en": "Enum"
          },
          "valueSchema": "integer",
          "enumValues": [
            {
              "displayName": {
                "en": "Item1"
              },
              "enumValue": 0,
              "name": "Item1"
            },
            {
              "displayName": {
                "en": "Item2"
              },
              "enumValue": 1,
              "name": "Item2"
            },
            {
              "displayName": {
                "en": "Item3"
              },
              "enumValue": 2,
              "name": "Item3"
            }
          ]
        }
      }
    ]
  }
}
```

A device client should send the telemetry as JSON that looks like the following example. `DateTime` types must be ISO 8061 compliant. Possible values for `Property3` are `0`, `1`, and that display in IoT Central as `Item1`, `Item2`, and `Item3`:

```json
{
  "ObjectTelemetry": {
      "Property1": "2020-09-09T03:36:46.195Z",
      "Property2": 37,
      "Property3": 2
  }
}
```

The following snippet from a device model shows the definition of a `vector` telemetry type:

```json
{
  "@type": "Telemetry",
  "displayName": {
    "en": "VectorTelemetry"
  },
  "name": "VectorTelemetry",
  "schema": "vector"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{
  "VectorTelemetry": {
    "x": 74.72395045538597,
    "y": 74.72395045538597,
    "z": 74.72395045538597
  }
}
```

### Event and state types

This section shows examples of telemetry events and states that a device sends to an IoT Central application.

The following snippet from a device model shows the definition of a `integer` event type:

```json
{
  "@type": [
    "Telemetry",
    "Event"
  ],
  "displayName": {
    "en": "IntegerEvent"
  },
  "name": "IntegerEvent",
  "schema": "integer"
}
```

A device client should send the event data as JSON that looks like the following example:

```json
{ "IntegerEvent": 74 }
```

The following snippet from a device model shows the definition of a `integer` state type:

```json
{
  "@type": [
    "Telemetry",
    "State"
  ],
  "displayName": {
    "en": "IntegerState"
  },
  "name": "IntegerState",
  "schema": {
    "@type": "Enum",
    "valueSchema": "integer",
    "enumValues": [
      {
        "displayName": {
          "en": "Level1"
        },
        "enumValue": 1,
        "name": "Level1"
      },
      {
        "displayName": {
          "en": "Level2"
        },
        "enumValue": 2,
        "name": "Level2"
      },
      {
        "displayName": {
          "en": "Level3"
        },
        "enumValue": 3,
        "name": "Level3"
      }
    ]
  }
}
```

A device client should send the state as JSON that looks like the following example. Possible integer state values are `1`, `2`, or `3`:

```json
{ "IntegerState": 2 }
```

## Properties

To learn more about the DTDL property naming rules, see [DTDL > Property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property). You can't start a property name using the `_` character.

> [!NOTE]
> The payload formats for properties applies to applications created on or after 07/14/2020.

### Properties in components

If the property is defined in a component, wrap the property in the component name. The following example sets the `maxTempSinceLastReboot` in the `thermostat2` component. The marker `__t` indicates that this a component:

```json
{
  "thermostat2" : {  
    "__t" : "c",  
    "maxTempSinceLastReboot" : 38.7
    } 
}
```

To learn more, see [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).

### Primitive types

This section shows examples of primitive property types that a device sends to an IoT Central application.

The following snippet from a device model shows the definition of a `boolean` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "BooleanProperty"
  },
  "name": "BooleanProperty",
  "schema": "boolean",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "BooleanProperty": false }
```

The following snippet from a device model shows the definition of a `long` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "LongProperty"
  },
  "name": "LongProperty",
  "schema": "long",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "LongProperty": 439 }
```

The following snippet from a device model shows the definition of a `date` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "DateProperty"
  },
  "name": "DateProperty",
  "schema": "date",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin. `Date` types must be ISO 8061 compliant:

```json
{ "DateProperty": "2020-05-17" }
```

The following snippet from a device model shows the definition of a `duration` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "DurationProperty"
  },
  "name": "DurationProperty",
  "schema": "duration",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin - durations must be ISO 8601 Duration compliant:

```json
{ "DurationProperty": "PT10H24M6.169083011336625S" }
```

The following snippet from a device model shows the definition of a `float` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "FloatProperty"
  },
  "name": "FloatProperty",
  "schema": "float",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "FloatProperty": 1.9 }
```

The following snippet from a device model shows the definition of a `string` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "StringProperty"
  },
  "name": "StringProperty",
  "schema": "string",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "StringProperty": "A string value - could be a URL" }
```

### Complex types

This section shows examples of complex property types that a device sends to an IoT Central application.

The following snippet from a device model shows the definition of a `geopoint` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "GeopointProperty"
  },
  "name": "GeopointProperty",
  "schema": "geopoint",
  "writable": false
}
```

> [!NOTE]
> The **geopoint** schema type is not part of the [Digital Twins Definition Language specification](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). IoT Central currently supports the **geopoint** schema type and the **location** semantic type for backwards compatibility.

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{
  "GeopointProperty": {
    "lat": 47.64263,
    "lon": -122.13035,
    "alt": 0
  }
}
```

The following snippet from a device model shows the definition of an `Enum` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "EnumProperty"
  },
  "name": "EnumProperty",
  "writable": false,
  "schema": {
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "displayName": {
          "en": "Item3"
        },
        "enumValue": 2,
        "name": "Item3"
      }
    ]
  }
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin. Possible values are `0`, `1`, and that display in IoT Central as `Item1`, `Item2`, and `Item3`:

```json
{ "EnumProperty": 1 }
```

The following snippet from a device model shows the definition of an `Object` property type. This object has two fields with types `string` and `integer`:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "ObjectProperty"
  },
  "name": "ObjectProperty",
  "writable": false,
  "schema": {
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "displayName": {
          "en": "Field1"
        },
        "name": "Field1",
        "schema": "integer"
      },
      {
        "displayName": {
          "en": "Field2"
        },
        "name": "Field2",
        "schema": "string"
      }
    ]
  }
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{
  "ObjectProperty": {
    "Field1": 37,
    "Field2": "A string value"
  }
}
```

The following snippet from a device model shows the definition of an `vector` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "VectorProperty"
  },
  "name": "VectorProperty",
  "schema": "vector",
  "writable": false
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{
  "VectorProperty": {
    "x": 74.72395045538597,
    "y": 74.72395045538597,
    "z": 74.72395045538597
  }
}
```

### Writable property types

This section shows examples of writable property types that a device receives from an IoT Central application.

If the writable property is defined in a component, the desired property message includes the component name. The following example shows the message requesting the device to update the `targetTemperature` in the `thermostat2` component. The marker `__t` indicates that this a component:

```json
{
  "thermostat2": {
    "targetTemperature": {
      "value": 57
    },
    "__t": "c"
  },
  "$version": 3
}
```

To learn more, see [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md).

IoT Central expects a response from the device to writable property updates. The response message should include the `ac` and `av` fields. The `ad` field is optional. See the following snippets for examples.

`ac` is a numeric field that uses the values in the following table:

| Value | Label | Description |
| ----- | ----- | ----------- |
| `'ac': 200` | Completed | The property change operation was successfully completed. |
| `'ac': 202`  or `'ac': 201` | Pending | The property change operation is pending or in progress |
| `'ac': 203` | Pending | The property change operation was initiated by the device |
| `'ac': 4xx` | Error | The requested property change wasn't valid or had an error |
| `'ac': 5xx` | Error | The device experienced an unexpected error when processing the requested change. |

`av` is the version number sent to the device.

`ad` is an option string description.

The following snippet from a device model shows the definition of a writable `string` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "StringPropertyWritable"
  },
  "name": "StringPropertyWritable",
  "writable": true,
  "schema": "string"
}
```

The device receives the following payload from IoT Central:

```json
{  
  "StringPropertyWritable": "A string from IoT Central", "$version": 7
}
```

The device should send the following JSON payload to IoT Central after it processes the update. This message includes the version number of the original update received from IoT Central. When IoT Central receives this message, it marks the property as **synced** in the UI:

```json
{
  "StringPropertyWritable": {
    "value": "A string from IoT Central",
    "ac": 200,
    "ad": "completed",
    "av": 7
  }
}
```

The following snippet from a device model shows the definition of a writable `Enum` property type:

```json
{
  "@type": "Property",
  "displayName": {
    "en": "EnumPropertyWritable"
  },
  "name": "EnumPropertyWritable",
  "writable": true,
  "schema": {
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "displayName": {
          "en": "Item3"
        },
        "enumValue": 2,
        "name": "Item3"
      }
    ]
  }
}
```

The device receives the following payload from IoT Central:

```json
{  
  "EnumPropertyWritable":  1 , "$version": 10
}
```

The device should send the following JSON payload to IoT Central after it processes the update. This message includes the version number of the original update received from IoT Central. When IoT Central receives this message, it marks the property as **synced** in the UI:

```json
{
  "EnumPropertyWritable": {
    "value": 1,
    "ac": 200,
    "ad": "completed",
    "av": 10
  }
}
```

## Commands

To learn more about the DTDL command naming rules, see [DTDL > Command](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#command). You can't start a command name using the `_` character.

If the command is defined in a component, the name of the command the device receives includes the component name. For example, if the command is called `getMaxMinReport` and the component is called `thermostat2`, the device receives a request to execute a command called `thermostat2*getMaxMinReport`.

The following snippet from a device model shows the definition of a command that has no parameters and that doesn't expect the device to return anything:

```json
{
  "@type": "Command",
  "displayName": {
    "en": "CommandBasic"
  },
  "name": "CommandBasic"
}
```

The device receives an empty payload in the request and should return an empty payload in the response with a `200` HTTP response code to indicate success.

The following snippet from a device model shows the definition of a command that has an integer parameter and that expects the device to return an integer value:

```json
{
  "@type": "Command",
  "request": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": "integer"
  },
  "displayName": {
    "en": "CommandSimple"
  },
  "name": "CommandSimple"
}
```

The device receives an integer value as the request payload. The device should return an integer value as the response payload with a `200` HTTP response code to indicate success.

The following snippet from a device model shows the definition of a command that has an object parameter and that expects the device to return an object. In this example, both objects have integer and string fields:

```json
{
  "@type": "Command",
  "request": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": {
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "displayName": {
            "en": "Field2"
          },
          "name": "Field2",
          "schema": "string"
        }
      ]
    }
  },
  "response": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": {
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "displayName": {
            "en": "Field2"
          },
          "name": "Field2",
          "schema": "string"
        }
      ]
    }
  },
  "displayName": {
    "en": "CommandComplex"
  },
  "name": "CommandComplex"
}
```

The following snippet shows an example request payload sent to the device:

```json
{ "Field1": 56, "Field2": "A string value" }
```

The following snippet shows an example response payload sent from the device. Use a `200` HTTP response code to indicate success:

```json
{ "Field1": 87, "Field2": "Another string value" }
```

### Long running commands

The following snippet from a device model shows the definition of a command. The command has an integer parameter and expects the device to return an integer value:

```json
{
  "@type": "Command",
  "request": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@type": "CommandPayload",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": "integer"
  },
  "displayName": {
    "en": "LongRunningCommandSimple"
  },
  "name": "LongRunningCommandSimple"
}
```

The device receives an integer value as the request payload. If the device needs time to process this command, it should return an empty response payload with a `202` HTTP response code to indicate the device has accepted the request for processing.

When the device has finished processing the request, it should send a property to IoT Central that looks like the following example. The property name must be the same as the command name:

```json
{
  "LongRunningCommandSimple": {
    "value": 87
  }
}
```

### Offline commands

In the IoT Central web UI, you can select the **Queue if offline** option for a command. Offline commands are one-way notifications to the device from your solution that are delivered as soon as a device connects. Offline commands can have a request parameter but don't return a response.

Offline commands are marked as `durable` if you export the model as DTDL.

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

## Next steps

Now that you've learned about device templates, a suggested next steps is to read [IoT Central device connectivity guide](overview-iot-central-developer.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.
