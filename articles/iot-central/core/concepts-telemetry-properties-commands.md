---
title: Telemetry, property, and command payloads in Azure IoT Central | Microsoft Docs
description: Azure IoT Central device templates let you specify the telemetry, properties, and commands of a device must implement. Understand the format of the data a device can exchange with IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Telemetry, property, and command payloads

_This article applies to device developers._

A device template in Azure IoT Central is a blueprint that defines the:

* Telemetry a device sends to IoT Central.
* Properties a device synchronizes with IoT Central.
* Commands that IoT Central calls on a device.

This article describes, for device developers, the JSON payloads that devices send and receive for telemetry, properties, and commands defined in a device template.

The article doesn"t describe every possible type of telemetry, property, and command payload, but the examples illustrate all the key types.

Each example shows a snippet from the device capability model (DCM) that defines the type and example JSON payloads to illustrate how the device should interact with the IoT Central application.

For sample device code that shows some of these payloads in use, see the [Create and connect a client application to your Azure IoT Central application (Node.js)](tutorial-connect-device-nodejs.md) and [Create and connect a client application to your Azure IoT Central application (Python)](tutorial-connect-device-python.md) tutorials.

## Simple telemetry types

This section shows examples of simple telemetry types that a device streams to an IoT Central application.

The following snippet from a DCM shows the definition of a `boolean` telemetry type:

```json
{
  "@id": "urn:samples:TelemetryTypes:BooleanTelemetry:1",
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
  "@id": "urn:samples:TelemetryTypes:StringTelemetry:1",
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
  "@id": "urn:samples:TelemetryTypes:IntegerTelemetry:1",
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
  "@id": "urn:samples:TelemetryTypes:DoubleTelemetry:1",
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
  "@id": "urn:samples:TelemetryTypes:DateTimeTelemetry:1",
  "@type": "Telemetry",
  "displayName": {
    "en": "DateTimeTelemetry"
  },
  "name": "DateTimeTelemetry",
  "schema": "dateTime"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "DateTimeTelemetry": "2020-08-30T19:16:13.853Z" }
```

The following snippet from a DCM shows the definition of a `duration` telemetry type:

```json
{
  "@id": "urn:samples:TelemetryTypes:DurationTelemetry:1",
  "@type": "Telemetry",
  "displayName": {
    "en": "DurationTelemetry"
  },
  "name": "DurationTelemetry",
  "schema": "duration"
}
```

A device client should send the telemetry as JSON that looks like the following example:

```json
{ "DurationTelemetry": "PT10H24M6.169083011336625S" }
```

## Complex telemetry types

This section shows examples of complex telemetry types that a device streams to an IoT Central application.

The following snippet from a DCM shows the definition of a `geopoint` telemetry type:

```json
{
  "@id": "urn:samples:TelemetryTypes:GeopointTelemetry:1",
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
  "@id": "urn:samples:TelemetryTypes:EnumTelemetry:1",
  "@type": "Telemetry",
  "displayName": {
    "en": "EnumTelemetry"
  },
  "name": "EnumTelemetry",
  "schema": {
    "@id": "urn:samples:TelemetryTypes:EnumTelemetry:bgqdpvgy0:1",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "urn:samples:TelemetryTypes:EnumTelemetry:bgqdpvgy0:Item1:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "urn:samples:TelemetryTypes:EnumTelemetry:bgqdpvgy0:Item2:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "urn:samples:TelemetryTypes:EnumTelemetry:bgqdpvgy0:Item3:1",
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

A device client should send the telemetry as JSON that looks like the following example. Possible values are `0`, `1`, and  that display in IoT Central as `Item1`, `Item2`, and `Item3`:

```json
{ "EnumTelemetry": 1 }
```

The following snippet from a DCM shows the definition of an `Object` telemetry type. This object has three fields with types `dateTime`, `integer`, and `Enum`:

```json
{
  "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:1",
  "@type": "Telemetry",
  "displayName": {
    "en": "ObjectTelelmetry"
  },
  "name": "ObjectTelelmetry",
  "schema": {
    "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:1",
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property1:1",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property1"
        },
        "name": "Property1",
        "schema": "dateTime"
      },
      {
        "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property2:1",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property2"
        },
        "name": "Property2",
        "schema": "integer"
      },
      {
        "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property3:1",
        "@type": "SchemaField",
        "displayName": {
          "en": "Property3"
        },
        "name": "Property3",
        "schema": {
          "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property3:lz01rb8pn3:1",
          "@type": "Enum",
          "displayName": {
            "en": "Enum"
          },
          "valueSchema": "integer",
          "enumValues": [
            {
              "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property3:lz01rb8pn3:Item1:1",
              "@type": "EnumValue",
              "displayName": {
                "en": "Item1"
              },
              "enumValue": 0,
              "name": "Item1"
            },
            {
              "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property3:lz01rb8pn3:Item2:1",
              "@type": "EnumValue",
              "displayName": {
                "en": "Item2"
              },
              "enumValue": 1,
              "name": "Item2"
            },
            {
              "@id": "urn:samples:TelemetryTypes:ObjectTelelmetry:rphnephnv0:Property3:lz01rb8pn3:Item3:1",
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

A device client should send the telemetry as JSON that looks like the following example. Possible values for `Property3` are `0`, `1`, and that display in IoT Central as `Item1`, `Item2`, and `Item3`:

```json
{
  "ObjectTelelmetry": {
      "Property1": "2020-09-09T03:36:46.195Z",
      "Property2": 37,
      "Property3": 2
  }
}
```

The following snippet from a DCM shows the definition of a `vector` telemetry type:

```json
{
  "@id": "urn:samples:TelemetryTypes:VectorTelemetry:1",
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

## Event and state telemetry types

This section shows examples of telemetry events and states that a device sends to an IoT Central application.

The following snippet from a DCM shows the definition of a `integer` event type:

```json
{
  "@id": "urn:samples:TelemetryTypes:IntegerEvent:1",
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
  "@id": "urn:samples:TelemetryTypes:IntegerState:1",
  "@type": [
    "Telemetry",
    "SemanticType/State"
  ],
  "displayName": {
    "en": "IntegerState"
  },
  "name": "IntegerState",
  "schema": {
    "@id": "urn:samples:TelemetryTypes:IntegerState:2dn7xccf3g:1",
    "@type": "Enum",
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "urn:samples:TelemetryTypes:IntegerState:2dn7xccf3g:Level1:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Level1"
        },
        "enumValue": 1,
        "name": "Level1"
      },
      {
        "@id": "urn:samples:TelemetryTypes:IntegerState:2dn7xccf3g:Level2:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Level2"
        },
        "enumValue": 2,
        "name": "Level2"
      },
      {
        "@id": "urn:samples:TelemetryTypes:IntegerState:2dn7xccf3g:Level3:1",
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

## Simple property types

This section shows examples of simple property types that a device sends to an IoT Central application.

The following snippet from a DCM shows the definition of a `boolean` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:BooleanProperty:1",
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
  "@id": "urn:samples:PropertyTypes:LongProperty:1",
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
  "@id": "urn:samples:PropertyTypes:DateProperty:1",
  "@type": "Property",
  "displayName": {
    "en": "DateProperty"
  },
  "name": "DateProperty",
  "schema": "date"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "DateProperty": "2020-05-17" }
```

The following snippet from a DCM shows the definition of a `duration` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:DurationProperty:1",
  "@type": "Property",
  "displayName": {
    "en": "DurationProperty"
  },
  "name": "DurationProperty",
  "schema": "duration"
}
```

A device client should send a JSON payload that looks like the following example as a reported property in the device twin:

```json
{ "DurationProperty": "PT10H24M6.169083011336625S" }
```

The following snippet from a DCM shows the definition of a `float` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:FloatProperty:1",
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
  "@id": "urn:samples:PropertyTypes:StringProperty:1",
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

## Complex property types

This section shows examples of complex property types that a device sends to an IoT Central application.

The following snippet from a DCM shows the definition of a `geopoint` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:GeopointProperty:1",
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
    "value" : {
      "lat": 47.64263,
      "lon": -122.13035,
      "alt": 0
    }
  }
}
```

The following snippet from a DCM shows the definition of an `Enum` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:EnumProperty:1",
  "@type": "Property",
  "displayName": {
    "en": "EnumProperty"
  },
  "name": "EnumProperty",
  "schema": {
    "@id": "urn:samples:PropertyTypes:EnumProperty:ny5x4b3ji:1",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "urn:samples:PropertyTypes:EnumProperty:ny5x4b3ji:Item1:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "urn:samples:PropertyTypes:EnumProperty:ny5x4b3ji:Item2:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "urn:samples:PropertyTypes:EnumProperty:ny5x4b3ji:Item3:1",
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

The following snippet from a DCM shows the definition of an `Object` property type. This object has three fields with types `string` and `integer`:

```json
{
  "@id": "urn:samples:PropertyTypes:ObjectProperty:1",
  "@type": "Property",
  "displayName": {
    "en": "ObjectProperty"
  },
  "name": "ObjectProperty",
  "schema": {
    "@id": "urn:samples:PropertyTypes:ObjectProperty:qhgjwl9wy:1",
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "@id": "urn:samples:PropertyTypes:ObjectProperty:qhgjwl9wy:Field1:1",
        "@type": "SchemaField",
        "displayName": {
          "en": "Field1"
        },
        "name": "Field1",
        "schema": "integer"
      },
      {
        "@id": "urn:samples:PropertyTypes:ObjectProperty:qhgjwl9wy:Field2:1",
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
    "value" : {
      "Field1": 37,
      "Field2": "A string value"
    }
  }
}
```

The following snippet from a DCM shows the definition of an `vector` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:VectorProperty:1",
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
    "value" : {
      "x": 74.72395045538597,
      "y": 74.72395045538597,
      "z": 74.72395045538597
    }
  }
}
```

## Writeable property types

This section shows examples of writeable property types that a device receives from an IoT Central application.

The following snippet from a DCM shows the definition of a writeable `string` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:StringPropertyWritable:1",
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
  StringPropertyWritable: { value: "A string from IoT Central" },
  "$version": 7
}
```

The device sends the following JSON payload to IoT Central after it processes the update. This message includes the version number of the original update received from IoT Central. When IoT Central receives this message, it marks the property as **synced** in the UI:

```json
{
  StringPropertyWritable: {
    value: "A string from IoT Central",
    statusCode: 200,
    status: "completed",
    desiredVersion: 7
  }
}
```

The following snippet from a DCM shows the definition of a writeable `Enum` property type:

```json
{
  "@id": "urn:samples:PropertyTypes:EnumPropertyWritable:1",
  "@type": "Property",
  "displayName": {
    "en": "EnumPropertyWritable"
  },
  "name": "EnumPropertyWritable",
  "writable": true,
  "schema": {
    "@id": "urn:samples:PropertyTypes:EnumPropertyWritable:in2thlbx4p:1",
    "@type": "Enum",
    "displayName": {
      "en": "Enum"
    },
    "valueSchema": "integer",
    "enumValues": [
      {
        "@id": "urn:samples:PropertyTypes:EnumPropertyWritable:in2thlbx4p:Item1:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item1"
        },
        "enumValue": 0,
        "name": "Item1"
      },
      {
        "@id": "urn:samples:PropertyTypes:EnumPropertyWritable:in2thlbx4p:Item2:1",
        "@type": "EnumValue",
        "displayName": {
          "en": "Item2"
        },
        "enumValue": 1,
        "name": "Item2"
      },
      {
        "@id": "urn:samples:PropertyTypes:EnumPropertyWritable:in2thlbx4p:Item3:1",
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
  EnumPropertyWritable: { value: 1 },
  "$version": 10
}
```

The device sends the following JSON payload to IoT Central after it processes the update. This message includes the version number of the original update received from IoT Central. When IoT Central receives this message, it marks the property as **synced** in the UI:

```json
{
  EnumPropertyWritable: {
    value: 1,
    statusCode: 200,
    status: "completed",
    desiredVersion: 10
  }
}
```

## Synchronous command types

The following snippet from a DCM shows the definition of a synchronous command that has no parameters and that doesn"t expect the device to return anything:

```json
{
  "@id": "urn:samples:CommandTypes:SynchronousCommandBasic:1",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "displayName": {
    "en": "SynchronousCommandBasic"
  },
  "name": "SynchronousCommandBasic"
}
```

The device receives an empty payload in the request and returns an empty payload in the response with a `200` HTTP response code to indicate success.

The following snippet from a DCM shows the definition of a synchronous command that has an integer parameter and that expects the device to return an integer value:

```json
{
  "@id": "urn:samples:CommandTypes:SynchronousCommandSimple:1",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "request": {
    "@id": "urn:samples:CommandTypes:SynchronousCommandSimple:RequestParam:1",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@id": "urn:samples:CommandTypes:SynchronousCommandSimple:ResponseParam:1",
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

The device receives an integer value as the request payload. The device returns an integer value as the response payload with a `200` HTTP response code to indicate success.

The following snippet from a DCM shows the definition of a synchronous command that has an object parameter and that expects the device to return an object. In this example, both objects have integer and string fields:

```json
{
  "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:1",
  "@type": "Command",
  "commandType": "synchronous",
  "durable": false,
  "request": {
    "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:RequestParam:1",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": {
      "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:RequestParam:ctg6a3sjk:1",
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:RequestParam:ctg6a3sjk:Field1:1",
          "@type": "SchemaField",
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:RequestParam:ctg6a3sjk:Field2:1",
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
    "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:ResponseParam:1",
    "@type": "SchemaField",
    "displayName": {
      "en": "ResponseParam"
    },
    "name": "ResponseParam",
    "schema": {
      "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:ResponseParam:qfrlpaclcw:1",
      "@type": "Object",
      "displayName": {
        "en": "Object"
      },
      "fields": [
        {
          "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:ResponseParam:qfrlpaclcw:Field1:1",
          "@type": "SchemaField",
          "displayName": {
            "en": "Field1"
          },
          "name": "Field1",
          "schema": "integer"
        },
        {
          "@id": "urn:samples:CommandTypes:SynchronousCommandComplex:ResponseParam:qfrlpaclcw:Field2:1",
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
{ Field1: 56, Field2: "A string value" }
```

The following snippet shows an example response payload sent from the device. Use a `200` HTTP response code to indicate success:

```json
{ Field1: 87, Field2: "Another string value" }
```

## Asynchronous command types

The following snippet from a DCM shows the definition of an asynchronous command. The command has an integer parameter and expects the device to return an integer value:

```json
{
  "@id": "urn:samples:CommandTypes:AsynchronousCommandSimple:1",
  "@type": "Command",
  "commandType": "asynchronous",
  "durable": false,
  "request": {
    "@id": "urn:samples:CommandTypes:AsynchronousCommandSimple:RequestParam:1",
    "@type": "SchemaField",
    "displayName": {
      "en": "RequestParam"
    },
    "name": "RequestParam",
    "schema": "integer"
  },
  "response": {
    "@id": "urn:samples:CommandTypes:AsynchronousCommandSimple:ResponseParam:1",
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

The device receives an integer value as the request payload. The device returns an empty response payload with a `202` HTTP response code to indicate the device has accepted the request for asynchronous processing.

When the device has finished processing the request, it sends a property to IoT Central that looks like the following example. The property name must be the same as the command name:

```json
{
  AsynchronousCommandSimple: {
    value: 87
  }
}
```

## Next steps

As a device developer, now that you"ve learned about device templates, a suggested next steps is to read [Get connected to Azure IoT Central](./concepts-get-connected.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.
