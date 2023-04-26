---
title: Query on Azure IoT Hub message routing
description: Learn about the IoT Hub message routing query language that you can use to apply rich queries to messages to receive the data that matters to you. 
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/22/2023
ms.custom: ['Role: Cloud Development', 'Role: Data Analytics']
---

# IoT Hub message routing query syntax

Message routing enables users to route different data types, including device telemetry messages, device lifecycle events, and device twin change events, to various endpoints. You can also apply rich queries to this data before routing it to receive the data that matters to you. This article describes the IoT Hub message routing query language, and provides some common query patterns.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Message routing allows you to query on the message properties and message body as well as device twin tags and device twin properties. If the message body isn't in JSON format, message routing can still route the message, but queries can't be applied to the message body.  Queries are described as Boolean expressions where, if true, the query succeeds and routes all the incoming data; otherwise, the query fails and the incoming data isn't routed. If the expression evaluates to a null or undefined value, it's treated as a Boolean false value, and generates an error in the IoT Hub [routes resource logs](monitor-iot-hub-reference.md#routes). The query syntax must be correct for the route to be saved and evaluated.  

## Query based on message properties

IoT Hub defines a [common format](iot-hub-devguide-messages-construct.md) for all device-to-cloud messaging for interoperability across protocols. IoT Hub assumes the following JSON representation of the message. System properties are added for all users and identify content of the message. Users can selectively add application properties to the message. We recommend using unique property names because IoT Hub device-to-cloud messaging isn't case-sensitive. For example, if you have multiple properties with the same name, IoT Hub will only send one of the properties.  

```json
{ 
  "message": { 
    "systemProperties": { 
      "contentType": "application/json", 
      "contentEncoding": "UTF-8", 
      "iothub-message-source": "deviceMessages", 
      "iothub-enqueuedtime": "2017-05-08T18:55:31.8514657Z" 
    }, 
    "appProperties": { 
      "processingPath": "{cold | warm | hot}", 
      "verbose": "{true, false}", 
      "severity": 1-5, 
      "testDevice": "{true | false}" 
    }, 
    "body": "{\"Weather\":{\"Temperature\":50}}" 
  } 
} 
```

### System properties

System properties help identify the contents and source of the messages, some of which are described in the following table:

| Property | Type | Description |
| -------- | ---- | ----------- |
| contentType | string | The user specifies the content type of the message. To allow querying on the message body, this value should be set to `application/JSON`. |
| contentEncoding | string | The user specifies the encoding type of the message. If the contentType property is set to `application/JSON`, then allowed values are `UTF-8`, `UTF-16`, and `UTF-32`. |
| iothub-connection-device-id | string | This value is set by IoT Hub and identifies the ID of the device. To query, use `$connectionDeviceId`. |
| iothub-connection-module-id | string | This value is set by IoT Hub and identifies the ID of the edge module. To query, use `$connectionModuleId`. |
| iothub-enqueuedtime | string | This value is set by IoT Hub and represents the actual time of enqueuing the message in UTC. To query, use `$enqueuedTime`. |
| dt-dataschema | string |  This value is set by IoT Hub on device-to-cloud messages. It contains the device model ID set in the device connection. To query, use `$dt-dataschema`. |
| dt-subject | string | The name of the component that is sending the device-to-cloud messages. To query, use `$dt-subject`. |

For more information about the other available system properties, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).

### Application properties

Application properties are user-defined strings that can be added to the message. These fields are optional.  

### Message properties query expressions

A query on message system properties must be prefixed with the `$` symbol. Queries on application properties are accessed with their name and shouldn't be prefixed with the `$`symbol. If an application property name begins with `$`, then IoT Hub first searches for it in the system properties, and if it's not found will then search for it in the application properties. The following examples show how to query on system properties and application properties.

To query on the system property contentEncoding:

```sql
$contentEncoding = 'UTF-8'
```

To query on the application property processingPath:

```sql
processingPath = 'hot'
```

To combine these queries, you can use Boolean expressions and functions:

```sql
$contentEncoding = 'UTF-8' AND processingPath = 'hot'
```

A full list of supported operators and functions is provided in the [expression and conditions](iot-hub-devguide-query-language.md#expressions-and-conditions) section of [IoT Hub query language for device and module twins, jobs, and message routing](iot-hub-devguide-query-language.md).

## Query based on message body

To enable querying on a message body, the message should be in a JSON format and encoded in either UTF-8, UTF-16 or UTF-32. The `contentType` system property must be `application/JSON`. The `contentEncoding` system property must be one of the UTF encoding values supported by that system property. If these system properties aren't specified, IoT Hub won't evaluate the query expression on the message body.

The following JavaScript example shows how to create a message with a properly formed and encoded JSON body:

```javascript
var messageBody = JSON.stringify(Object.assign({}, {
    "Weather": {
        "Temperature": 50,
        "Time": "2017-03-09T00:00:00.000Z",
        "PrevTemperatures": [
            20,
            30,
            40
        ],
        "IsEnabled": true,
        "Location": {
            "Street": "One Microsoft Way",
            "City": "Redmond",
            "State": "WA"
        },
        "HistoricalData": [
            {
                "Month": "Feb",
                "Temperature": 40
            },
            {
                "Month": "Jan",
                "Temperature": 30
            }
        ]
    }
}));

// Encode message body using UTF-8  
var messageBytes = Buffer.from(messageBody, "utf8");

var message = new Message(messageBytes);

// Set message body type and content encoding 
message.contentEncoding = "utf-8";
message.contentType = "application/json";

// Add other custom application properties   
message.properties.add("Status", "Active");

deviceClient.sendEvent(message, (err, res) => {
    if (err) console.log('error: ' + err.toString());
    if (res) console.log('status: ' + res.constructor.name);
});
```

For a message encoding sample in C#, see the [HubRoutingSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/how%20to%20guides/HubRoutingSample) provided in the Microsoft Azure IoT SDK for .NET. This sample is the same one used in the [Message Routing tutorial](tutorial-routing.md). The Program.cs file also has a method named `ReadOneRowFromFile`, which reads one of the encoded files, decodes it, and writes it back out as ASCII so you can read it.

### Message body query expressions

A query on a message body needs to be prefixed with `$body`. You can use a body reference, body array reference, or multiple body references in the query expression. Your query expression can also combine a body reference with a message system properties reference or a message application properties reference. For example, the following examples are all valid query expressions:

```sql
$body.Weather.HistoricalData[0].Month = 'Feb' 
```

```sql
$body.Weather.Temperature = 50 AND $body.Weather.IsEnabled 
```

```sql
length($body.Weather.Location.State) = 2 
```

```sql
$body.Weather.Temperature = 50 AND processingPath = 'hot'
```

You can run queries and functions only on properties in the body reference. You can't run queries or functions on the entire body reference. For example, the following query is *not* supported and returns `undefined`:

```sql
$body[0] = 'Feb'
```

To filter a twin notification payload based on what changed, run your query on the message body. For example, to filter when there's a desired property change on `sendFrequency` and the value is greater than 10:

```sql
$body.properties.desired.telemetryConfig.sendFrequency > 10
```

To filter messages that contains a property change, no matter the value of the property, you can use the `is_defined()` function (when the value is a primitive type):

```sql
is_defined($body.properties.desired.telemetryConfig.sendFrequency)
```

## Query based on device or module twin

Message routing enables you to query on [device twin](iot-hub-devguide-device-twins.md) or [module twin](iot-hub-devguide-module-twins.md) tags and properties, which are JSON objects. The following sample illustrates a device twin with tags and properties:

```JSON
{
    "tags": { 
        "deploymentLocation": { 
            "building": "43", 
            "floor": "1" 
        } 
    }, 
    "properties": { 
        "desired": { 
            "telemetryConfig": { 
                "sendFrequency": "5m" 
            }, 
            "$metadata" : {...}, 
            "$version": 1 
        }, 
        "reported": { 
            "telemetryConfig": { 
                "sendFrequency": "5m", 
                "status": "success" 
            },
            "batteryLevel": 55, 
            "$metadata" : {...}, 
            "$version": 4 
        } 
    } 
} 
```

> [!NOTE]
> Modules do not inherit twin tags from their corresponding devices. Twin queries for messages originating from device modules (for example, from IoT Edge modules) query against the module twin and not the corresponding device twin.

### Twin query expressions

A query on a device twin or module twin needs to be prefixed with `$twin`. Your query expression can also combine a twin tag or property reference with a body reference, a message system properties reference, or a message application properties reference. We recommend using unique names in tags and properties because the query isn't case-sensitive. This recommendation applies to both device twins and module twins. We also recommend that you avoid using `twin`, `$twin`, `body`, or `$body` as property names. For example, the following examples are all valid query expressions: 

```sql
$twin.properties.desired.telemetryConfig.sendFrequency = '5m'
```

```sql
$body.Weather.Temperature = 50 AND $twin.properties.desired.telemetryConfig.sendFrequency = '5m'
```

```sql
$twin.tags.deploymentLocation.floor = 1 
```

## Limitations

Routing queries don't support using whitespace or any of the following characters in property names, the message body path, or the device/module twin path: `()<>@,;:\"/?={}`.

## Next steps

* Learn about [message routing](iot-hub-devguide-messages-d2c.md).
* Try the [message routing tutorial](tutorial-routing.md).
