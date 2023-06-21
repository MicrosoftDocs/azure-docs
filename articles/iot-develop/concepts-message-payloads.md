---
title: Plug and Play device message payloads
description: Understand the format of the telemetry, property, and command messages that a Plug and Play device can exchange with a service.
author: dominicbetts
ms.author: dobett
ms.date: 06/05/2023
ms.topic: conceptual
ms.service: iot
services: iot
ms.custom: device-developer

# This article applies to device developers.
---

# Telemetry, property, and command payloads

A [device model](concepts-modeling-guide.md) defines the:

* Telemetry a device sends to a service.
* Properties a device synchronizes with a service.
* Commands that the service calls on a device.

> [!TIP]
> Azure IoT Central is a service that follows the Plug and Play conventions. In IoT Central, the device model is part of a [device template](../iot-central/core/concepts-device-templates.md). IoT Central currently supports [DTDL v2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md) with an [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md). An IoT Central application expects to receive UTF-8 encoded JSON data.

This article describes the JSON payloads that devices send and receive for telemetry, properties, and commands defined in a DTDL device model.

The article doesn't describe every possible type of telemetry, property, and command payload, but the examples illustrate key types.

Each example shows a snippet from the device model that defines the type and example JSON payloads to illustrate how the device should interact with a Plug and Play aware service such as IoT Central.

The example JSON snippets in this article use [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md). There are also some [DTDL extensions that IoT Central](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md) uses.

For sample device code that shows some of these payloads in use, see the [Connect a sample IoT Plug and Play device application running on Linux or Windows to IoT Hub](tutorial-connect-device.md) tutorial or the [Create and connect a client application to your Azure IoT Central application](../iot-central/core/tutorial-connect-device.md) tutorial.

## View raw data

If you're using IoT Central, you can view the raw data that a device sends to an application. This view is useful for troubleshooting issues with the payload sent from a device. To view the raw data a device is sending:

1. Navigate to the device from the **Devices** page.

1. Select the **Raw data** tab:

    :::image type="content" source="media/concepts-message-payloads/raw-data.png" alt-text="Screenshot that shows the raw data view." lightbox="media/concepts-message-payloads/raw-data.png":::

    On this view, you can select the columns to display and set a time range to view. The **Unmodeled data** column shows data from the device that doesn't match any property or telemetry definitions in the device template.

For more troubleshooting tips, see [Troubleshoot why data from your devices isn't showing up in Azure IoT Central](../iot-central/core/troubleshoot-connection.md).

## Telemetry

To learn more about the DTDL telemetry naming rules, see [DTDL > Telemetry](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#telemetry). You can't start a telemetry name using the `_` character.

Don't create telemetry types with the following names. IoT Central uses these reserved names internally. If you try to use these names, IoT Central will ignore your data:

* `EventEnqueuedUtcTime`
* `EventProcessedUtcTime`
* `PartitionId`
* `EventHub`
* `User`
* `$metadata`
* `$version`

### Telemetry in components

If the telemetry is defined in a component, add a custom message property called `$.sub` with the name of the component as defined in the device model. To learn more, see [Tutorial: Connect an IoT Plug and Play multiple component device applications](tutorial-multiple-components.md). This tutorial shows how to use different programming languages to send telemetry from a component.

> [!IMPORTANT]
> To display telemetry from components hosted in IoT Edge modules correctly, use [IoT Edge version 1.2.4](https://github.com/Azure/azure-iotedge/releases/tag/1.2.4) or later. If you use an earlier version, telemetry from your components in IoT Edge modules displays as *_unmodeleddata*.

### Telemetry in inherited interfaces

If the telemetry is defined in an inherited interface, your device sends the telemetry as if it is defined in the root interface. Given the following device model:

```json
[
    {
        "@id": "dtmi:contoso:device;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": {
                    "en": "Device Name"
                },
                "name": "DeviceName",
                "schema": "string"
            }
        ],
        "displayName": {
            "en": "Contoso Device"
        },
        "extends": [
            "dtmi:contoso:sensor;1"
        ],
        "@context": [
            "dtmi:iotcentral:context;2",
            "dtmi:dtdl:context;2"
        ]
    },
    {
        "@context": [
            "dtmi:iotcentral:context;2",
            "dtmi:dtdl:context;2"
        ],
        "@id": "dtmi:contoso:sensor;1",
        "@type": [
            "Interface",
            "NamedInterface"
        ],
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "NumberValue"
                ],
                "displayName": {
                    "en": "Meter Voltage"
                },
                "name": "MeterVoltage",
                "schema": "double"
            }
        ],
        "displayName": {
            "en": "Contoso Sensor"
        },
        "name": "ContosoSensor"
    }
]
```

The device sends meter voltage telemetry using the following payload. The device doesn't include the interface name in the payload:

```json
{
    "MeterVoltage": 5.07
}
```

### Primitive types

This section shows examples of primitive telemetry types that a device can stream.

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

This section shows examples of complex telemetry types that a device can stream.

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
> The **geopoint** schema type is part of the [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md) to DTDL. IoT Central currently supports the **geopoint** schema type and the **location** semantic type for backwards compatibility.

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

### Event and state types

This section shows examples of telemetry events and states that a device sends to an IoT Central application.

> [!NOTE]
> The **event** and **state** schema types are part of the [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md) to DTDL.

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

To learn more about the DTDL property naming rules, see [DTDL > Property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#property). You can't start a property name using the `_` character.

### Properties in components

If the property is defined in a component, wrap the property in the component name. The following example sets the `maxTempSinceLastReboot` in the `thermostat2` component. The marker `__t` indicates that this section defines a component:

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

This section shows examples of primitive property types that a device sends to a service.

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

This section shows examples of complex property types that a device sends to a service.

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
> The **geopoint** schema type is part of the [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md) to DTDL. IoT Central currently supports the **geopoint** schema type and the **location** semantic type for backwards compatibility.

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

### Writable property types

This section shows examples of writable property types that a device receives from a service.

If the writable property is defined in a component, the desired property message includes the component name. The following example shows the message requesting the device to update the `targetTemperature` in the `thermostat2` component. The marker `__t` indicates that this section defines a component:

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

To learn more, see [Connect an IoT Plug and Play multiple component device applications](tutorial-multiple-components.md).

The device or module should confirm that it received the property by sending a reported property. The reported property should include:

* `value` - the actual value of the property (typically the received value, but the device may decide to report a different value).
* `ac` - an acknowledgment code that uses an HTTP status code.
* `av` - an acknowledgment version that refers to the `$version` of the desired property. You can find this value in the desired property JSON payload.
* `ad` - an optional acknowledgment description.

To learn more about these fields, see [IoT Plug and Play conventions > Acknowledgment responses](concepts-convention.md#acknowledgment-responses)

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

The device receives the following payload from the service:

```json
{  
  "StringPropertyWritable": "A string from IoT Central", "$version": 7
}
```

The device should send the following JSON payload to the service after it processes the update. This message includes the version number of the original update received from the service.

> [!TIP]
> If the service is IoT Central, it marks the property as **synced** in the UI when it receives this message:

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

The device receives the following payload from the service:

```json
{  
  "EnumPropertyWritable":  1 , "$version": 10
}
```

The device should send the following JSON payload to the service after it processes the update. This message includes the version number of the original update received from the service.

> [!TIP]
> If the service is IoT Central, it marks the property as **synced** in the UI when it receives this message:

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

To learn more about the DTDL command naming rules, see [DTDL > Command](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#command). You can't start a command name using the `_` character.

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

> [!TIP]
> IoT Central has its own conventions for implementing [Long-running commands](../iot-central/core/howto-use-commands.md#long-running-commands) and [Offline commands](../iot-central/core/howto-use-commands.md#offline-commands).

## Next steps

Now that you've learned about device payloads, a suggested next steps is to read the [Device developer guide](concepts-developer-guide-device.md).
