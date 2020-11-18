---
title: Telemetry, property, and command payloads in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the telemetry, properties, and commands of a device must implement. Understand the format of the data a device can exchange with IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: device-developer
---

# Telemetry, property, and command payloads

_This article applies to device developers._

A device template in Azure IoT Central is a blueprint that defines the:

* Telemetry a device sends to IoT Central.
* Properties a device synchronizes with IoT Central.
* Commands that IoT Central calls on a device.

This article describes, for device developers, the JSON payloads that devices send and receive for telemetry, properties, and commands defined in a device template.

The article doesn't describe every possible type of telemetry, property, and command payload, but the examples illustrate all the key types.

Each example shows a snippet from the device capability model (DCM) that defines the type and example JSON payloads to illustrate how the device should interact with the IoT Central application.

> [!NOTE]
> IoT Central accepts any valid JSON but it can only be used for visualizations if it matches a definition in the DCM. You can export data that doesn't match a definition, see [Export IoT data to destinations in Azure](howto-export-data.md).

The JSON file that defines the DCM uses the [Digital Twin Definition Language (DTDL) V1](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v1-preview/dtdlv1.md). This specification includes the definition of the `@id` property format.

For sample device code that shows some of these payloads in use, see the [Create and connect a client application to your Azure IoT Central application (Node.js)](tutorial-connect-device-nodejs.md) and [Create and connect a client application to your Azure IoT Central application (Python)](tutorial-connect-device-python.md) tutorials.

## View raw data

IoT Central lets you view the raw data that a device sends to an application. This view is useful for troubleshooting issues with the payload sent from a device. To view the raw data a device is sending:

1. Navigate to the device from the **Devices** page.

1. Select the **Raw data** tab:

    :::image type="content" source="media/concepts-telemetry-properties-commands/raw-data.png" alt-text="Raw data view":::

    On this view, you can select the columns to display and set a time range to view. The **Unmodeled data** column shows data from the device that doesn't match any property or telemetry definitions in the device template.

## Telemetry

### Primitive types

This section shows examples of primitive telemetry types that a device streams to an IoT Central application.

The following snippet from a DCM shows the definition of a `boolean` telemetry type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of a `string` telemetry type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of an `integer` telemetry type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of a `double` telemetry type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of a `dateTime` telemetry type:

```json
{
  "@id": "<element id>",
  "@type": "Telemetry",
  "displayName": {
    "en": "DateTimeTelemetry"
  },
  "name": "DateTimeTelemetry",
  "schema": "dateTime"
}
```

A device client should send the telemetry as JSON that looks like the following example - `DateTime` types must be ISO 8061 compliant:

```json
{ "DateTimeTelemetry": "2020-08-30T19:16:13.853Z" }
```

The following snippet from a DCM shows the definition of a `duration` telemetry type:

```json
{
  "@id": "<element id>",
  "@type": "Telemetry",
  "displayName": {
    "en": "DurationTelemetry"
  },
  "name": "DurationTelemetry",
  "schema": "duration"
}
```

A device client should send the telemetry as JSON that looks like the following example - durations must be ISO 8601 Duration compliant:

```json
{ "DurationTelemetry": "PT10H24M6.169083011336625S" }
```

### Complex types

This section shows examples of complex telemetry types that a device streams to an IoT Central application.

The following snippet from a DCM shows the definition of a `geopoint` telemetry type:

```json
{
  "@id": "<element id>",
  "@type": "Telemetry",
  "displayName": {
    "en": "GeopointTelemetry"
  },
  "name": "GeopointTelemetry",
  "schema": "geopoint"
}
```

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

The following snippet from a DCM shows the definition of an `Enum` telemetry type:

```json
{
  "@id": "<element id>",
  "@type": "Telemetry",
  "displayName": {
    "en": "EnumTelemetry"
  },
  "name": "EnumTelemetry",
  "schema": {
    "@id": "<element id>",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
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

The following snippet from a DCM shows the definition of an `Object` telemetry type. This object has three fields with types `dateTime`, `integer`, and `Enum`:

```json
{
  "@id": "<element id>",
  "@type": "Telemetry",
  "displayName": {
    "en": "ObjectTelemetry"
  },
  "name": "ObjectTelemetry",
  "schema": {
    "@id": "<element id>",
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "@id": "<element id>",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property1"
        },
        "name": "Property1",
        "schema": "dateTime"
      },
      {
        "@id": "<element id>",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property2"
        },
        "name": "Property2",
        "schema": "integer"
      },
      {
        "@id": "<element id>",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property3"
        },
        "name": "Property3",
        "schema": {
          "@id": "<element id>",
          "@type": "Enum",
          "displayName": {
            "en": "Enum"
          },
          "valueSchema": "integer",
          "enumValues": [
            {
              "@id": "<element id>",
              "@type": "EnumValue",
              "displayName": {
                "en": "Item1"
              },
              "enumValue": 0,
              "name": "Item1"
            },
            {
              "@id": "<element id>",
              "@type": "EnumValue",
              "displayName": {
                "en": "Item2"
              },
              "enumValue": 1,
              "name": "Item2"
            },
            {
              "@id": "<element id>",
              "@type": "EnumValue",
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

The following snippet from a DCM shows the definition of a `vector` telemetry type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of a `integer` event type:

```json
{
  "@id": "<element id>",
  "@type": [
    "Telemetry",
    "SemanticType/Event"
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

The following snippet from a DCM shows the definition of a `integer` state type:

```json
{
  "@id": "<element id>",
  "@type": [
    "Telemetry",
    "SemanticType/State"
  ],
  "displayName": {
    "en": "IntegerState"
  },
  "name": "IntegerState",
  "schema": {
    "@id": "<element id>",
    "@type": "Enum",
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Level1"
        },
        "enumValue": 1,
        "name": "Level1"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Level2"
        },
        "enumValue": 2,
        "name": "Level2"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
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

> [!NOTE]
> The payload formats for properties applies to applications created on or after 07/14/2020.

### Primitive types

This section shows examples of primitive property types that a device sends to an IoT Central application.

The following snippet from a DCM shows the definition of a `boolean` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "BooleanProperty"
  },
  "name": "BooleanProperty",
  "schema": "boolean"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "BooleanProperty": false }
```

The following snippet from a DCM shows the definition of a `boolean` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "LongProperty"
  },
  "name": "LongProperty",
  "schema": "long"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "LongProperty": 439 }
```

The following snippet from a DCM shows the definition of a `date` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "DateProperty"
  },
  "name": "DateProperty",
  "schema": "date"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin. `Date` types must be ISO 8061 compliant:

```json
{ "DateProperty": "2020-05-17" }
```

The following snippet from a DCM shows the definition of a `duration` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "DurationProperty"
  },
  "name": "DurationProperty",
  "schema": "duration"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin - durations must be ISO 8601 Duration compliant:

```json
{ "DurationProperty": "PT10H24M6.169083011336625S" }
```

The following snippet from a DCM shows the definition of a `float` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "FloatProperty"
  },
  "name": "FloatProperty",
  "schema": "float"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "FloatProperty": 1.9 }
```

The following snippet from a DCM shows the definition of a `string` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "StringProperty"
  },
  "name": "StringProperty",
  "schema": "string"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "StringProperty": "A string value - could be a URL" }
```

### Complex types

This section shows examples of complex property types that a device sends to an IoT Central application.

The following snippet from a DCM shows the definition of a `geopoint` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "GeopointProperty"
  },
  "name": "GeopointProperty",
  "schema": "geopoint"
}
```

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

The following snippet from a DCM shows the definition of an `Enum` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "EnumProperty"
  },
  "name": "EnumProperty",
  "schema": {
    "@id": "<element id>",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
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

The following snippet from a DCM shows the definition of an `Object` property type. This object has two fields with types `string` and `integer`:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "ObjectProperty"
  },
  "name": "ObjectProperty",
  "schema": {
    "@id": "<element id>",
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "@id": "<element id>",
        "@type": "SchemaField",
        "displayName": {
          "en": "Field1"
        },
        "name": "Field1",
        "schema": "integer"
      },
      {
        "@id": "<element id>",
        "@type": "SchemaField",
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

The following snippet from a DCM shows the definition of an `vector` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "VectorProperty"
  },
  "name": "VectorProperty",
  "schema": "vector"
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

### Writeable property types

This section shows examples of writeable property types that a device receives from an IoT Central application.

IoT Central expects a response from the device to writeable property updates. The response message should include the `ac` and `av` fields. The `ad` field is optional. See the following snippets for examples.

`ac` is a numeric field that uses the values in the following table:

| Value | Label | Description |
| ----- | ----- | ----------- |
| `'ac': 200` | Completed | The property change operation was successfully completed. |
| `'ac': 202`  or `'ac': 201` | Pending | The property change operation is pending or in progress |
| `'ac': 4xx` | Error | The requested property change was not valid or had an error |
| `'ac': 5xx` | Error | The device experienced an unexpected error when processing the requested change. |

`av` is the version number sent to the device.

`ad` is an option string description.

The following snippet from a DCM shows the definition of a writeable `string` property type:

```json
{
  "@id": "<element id>",
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

The following snippet from a DCM shows the definition of a writeable `Enum` property type:

```json
{
  "@id": "<element id>",
  "@type": "Property",
  "displayName": {
    "en": "EnumPropertyWritable"
  },
  "name": "EnumPropertyWritable",
  "writable": true,
  "schema": {
    "@id": "<element id>",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "<element id>",
        "@type": "EnumValue",
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

### Synchronous command types

The following snippet from a DCM shows the definition of a synchronous command that has no parameters and that doesn't expect the device to return anything:

```json
{
  "@id": "<element id>",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "displayName": {
    "en": "SynchronousCommandBasic"
  },
  "name": "SynchronousCommandBasic"
}
```

The device receives an empty payload in the request and should return an empty payload in the response with a `200` HTTP response code to indicate success.

The following snippet from a DCM shows the definition of a synchronous command that has an integer parameter and that expects the device to return an integer value:

```json
{
  "@id": "<element id>",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "request": {
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": "integer"
  },
  "displayName": {
    "en": "SynchronousCommandSimple"
  },
  "name": "SynchronousCommandSimple"
}
```

The device receives an integer value as the request payload. The device should return an integer value as the response payload with a `200` HTTP response code to indicate success.

The following snippet from a DCM shows the definition of a synchronous command that has an object parameter and that expects the device to return an object. In this example, both objects have integer and string fields:

```json
{
  "@id": "<element id>",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "request": {
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": {
      "@id": "<element id>",
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "@id": "<element id>",
          "@type": "SchemaField",
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "@id": "<element id>",
          "@type": "SchemaField",
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
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": {
      "@id": "<element id>",
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "@id": "<element id>",
          "@type": "SchemaField",
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "@id": "<element id>",
          "@type": "SchemaField",
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
    "en": "SynchronousCommandComplex"
  },
  "name": "SynchronousCommandComplex"
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

### Asynchronous command types

The following snippet from a DCM shows the definition of an asynchronous command. The command has an integer parameter and expects the device to return an integer value:

```json
{
  "@id": "<element id>",
  "@type": "Command",
  "commandType": "asynchronous",
  "durable": false,
  "request": {
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@id": "<element id>",
    "@type": "SchemaField",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": "integer"
  },
  "displayName": {
    "en": "AsynchronousCommandSimple"
  },
  "name": "AsynchronousCommandSimple"
}
```

The device receives an integer value as the request payload. The device should return an empty response payload with a `202` HTTP response code to indicate the device has accepted the request for asynchronous processing.

When the device has finished processing the request, it should send a property to IoT Central that looks like the following example. The property name must be the same as the command name:

```json
{
  "AsynchronousCommandSimple": {
    "value": 87
  }
}
```

## Next steps

As a device developer, now that you"ve learned about device templates, a suggested next steps is to read [Get connected to Azure IoT Central](./concepts-get-connected.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.
