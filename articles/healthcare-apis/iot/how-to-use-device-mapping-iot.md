---
title: Device mapping template in IoT Connector - Azure Healthcare APIs
description: This article describes how to use the Device mapping template in the IoT Connector. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/05/2021
ms.author: jasteppe
---

# How to use Device mappings

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

IoT connector requires two types of JSON-based mappings. The first type, **Device mapping**, is responsible for mapping the device payloads sent to the `devicedata` Azure Event Hub end point. It extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, **Fast Healthcare Interoperability Resources (FHIR&#174;) destination mapping**, controls the mapping for FHIR resource. It allows configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

The two types of mappings are composed into a JSON document based on their type. These JSON documents are then added to your IoT connector through the Azure portal. The Device mapping document is added through the **Device mapping** page and the FHIR destination mapping document through the **Destination** page.

> [!NOTE]
> Mappings are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately. 

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting IoT connector Device and FHIR destination mappings. Export mappings for uploading to IoT connector in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of IoT connector.

## Device mappings overview

Device mappings provide functionality to extract device message content into a common format for further evaluation. Each device message received is evaluated against all device mapping templates. 

A single inbound device message can be separated into multiple outbound messages that are later mapped to different observations in the FHIR service. 

The result is a normalized data object representing the value or values parsed by the templates. 

The normalized data model has a few required properties that must be found and extracted:

|Property|Description|
|--------|-----------|
|**Type**|The name/type to classify the measurement. This value is used to bind to the required FHIR destination mapping. Multiple mappings can output to the same type allowing you to map different representations across multiple devices to a single common output.|
|**OccurenceTimeUtc**|The time the measurement occurred.|
|**DeviceId**|The identifier for the device. This value should match an identifier on the device resource that exists on the destination FHIR service.|
|**Properties**|Extract at least one property so the value can be saved in the Observation resource created. Properties are a collection of key value pairs extracted during normalization.|

> [!IMPORTANT]
> The full normalized model is defined by the [IMeasurement](https://github.com/microsoft/iomt-fhir/blob/master/src/lib/Microsoft.Health.Fhir.Ingest.Schema/IMeasurement.cs) interface.

Below are conceptual examples of what happens during normalization and and transformation process within IoT connector:

:::image type="content" source="media/iot-data-normalization-high-level.png" alt-text="IoT data normalization flow example1" lightbox="media/iot-data-normalization-high-level.png":::

:::image type="content" source="media/concepts-iot-mapping-templates/normalization-example.png" alt-text="IoT data normalization flow example2" lightbox="media/concepts-iot-mapping-templates/normalization-example.png":::

The content payload itself is an Azure Event Hub message, which is composed of three parts: Body, Properties, and SystemProperties. The `Body` is a byte array representing an UTF-8 encoded string. During template evaluation, the byte array is automatically converted into the string value. `Properties` is a key value collection for use by the message creator. `SystemProperties` is also a key value collection reserved by the Azure Event Hub framework with entries automatically populated by it.

```json
{
    "Body": {
        "content": "value"
    },
    "Properties": {
        "key1": "value1",
        "key2": "value2"
    },
    "SystemProperties": {
        "x-opt-sequence-number": 1,
        "x-opt-enqueued-time": "2021-02-01T22:46:01.8750000Z",
        "x-opt-offset": 1,
        "x-opt-partition-key": "1"
    }
}
```
## Mapping with JSONPath

The five device content-mapping types supported today rely on JSONPath to both match the required mapping and extracted values. More information on JSONPath can be found [here](https://goessner.net/articles/JsonPath/). All five template types use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.

You can define one or more templates within the Device mapping template. Each Event Hub device message received is evaluated against all device mapping templates. 

A single inbound device message can be separated into multiple outbound messages that are later mapped to different observations in the FHIR service. 

Various template types exist and may be used when building the Device mapping file.

|Name                                                                     | Description                                                                   |  
|-------------------------------------------------------------------------|-------------------------------------------------------------------------------|
|[JsonPathContentTemplate](#jsonpathcontenttemplate)                      |A template that supports writing expressions using JsonPath                  
|[CollectionContentTemplate](#collectioncontenttemplate)                  |A template used to represent a list of templates that will be used during the normalization.                                                            |                                                           
|[CalculatedContentTemplate](#calculatedcontenttemplate)                  |A template that supports writing expressions using one of several expression languages. Supports data transformation via the use of JmesPath functions.|
|[IotJsonPathContentTemplate](#iotjsonpathcontenttemplate)                |A template that supports messages sent from Azure Iot Hub or the Legacy Export Data feature of Azure Iot Central.                                        |
|[IotCentralJsonPathContentTemplate](#iotcentraljsonpathcontenttemplate)  |A template that supports messages sent via the Export Data feature of Azure Iot Central.|  

## JsonPathContentTemplate

The JsonPathContentTemplate allows matching on and extracting values from an Azure Event Hub message using JSONPath.

|Property|Description|Example|
|--------|-----------|-------|
|TypeName|The type to associate with measurements that match the template|`heartrate`|
|TypeMatchExpression|The JSONPath expression that is evaluated against the EventData payload. If a matching JToken is found, the template is considered a match. All later expressions are evaluated against the extracted JToken matched here.|`$..[?(@heartRate)]`|
|TimestampExpression|The JSONPath expression to extract the timestamp value for the measurement's OccurrenceTimeUtc.|`$.matchedToken.endDate`|
|DeviceIdExpression|The JSONPath expression to extract the device identifier.|`$.matchedToken.deviceId`|
|PatientIdExpression|*Required* when IdentityResolution is in **Create** mode and *Optional* when IdentityResolution is in **Lookup** mode. The expression to extract the patient identifier.|`$.matchedToken.patientId`|
|EncounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|
|CorrelationIdExpression|*Optional*: The expression to extract the correlation identifier. This output can be used to group values into a single observation in the FHIR destination mappings.|`$.matchedToken.correlationId`|
|Values[].ValueName|The name to associate with the value extracted by the next expression. Used to bind the wanted value/component in the FHIR destination mapping template.|`hr`|
|Values[].ValueExpression|The JSONPath expression to extract the wanted value.|`$.matchedToken.heartRate`|
|Values[].Required|Will require the value to be present in the payload. If not found, a measurement won't be generated and an InvalidOperationException will be created.|`true`|

### Examples

**Heart rate**

*Message*

```json
{
    "Body": {
        "heartRate": "78",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```

*Template*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```
**Blood pressure**

*Message*

```json
{
    "Body": {
        "systolic": "123",
        "diastolic" : "87",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```

*Template*

```json
{
    "typeName": "bloodpressure",
    "typeMatchExpression": "$..[?(@systolic && @diastolic)]",
    "deviceIdExpression": "$.deviceId",
    "timestampExpression": "$.endDate",
    "values": [
        {
            "required": "true",
            "valueExpression": "$.systolic",
            "valueName": "systolic"
        },
        {
            "required": "true",
            "valueExpression": "$.diastolic",
            "valueName": "diastolic"
        }
    ]
}
```
**Project multiple measurements from single message**

*Message*

```json
{
    "Body": {
        "heartRate": "78",
        "steps": "2",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```

*Template 1*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

*Template 2*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "stepcount",
        "typeMatchExpression": "$..[?(@steps)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.steps",
                "valueName": "steps"
            }
        ]
    }
}
```

**Project multiple measurements from array in message**

*Message*

```json
{
    "Body": [
        {
            "heartRate": "78",
            "endDate": "2021-02-01T22:46:01.8750000Z",
            "deviceId": "device123"
        },
        {
            "heartRate": "81",
            "endDate": "2021-02-01T23:46:01.8750000Z",
            "deviceId": "device123"
        },
        {
            "heartRate": "72",
            "endDate": "2021-02-01T24:46:01.8750000Z",
            "deviceId": "device123"
        }
    ],
    "Properties": {},
    "SystemProperties": {}
}
```
*Template*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

## CollectionContentTemplate

The CollectionContentTemplate may be used to represent a list of templates that will be used during normalization.
                                                             
### Example

```json
{
  "templateType": "CollectionContent",
  "template": [
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.heartRate",
            "valueName": "hr"
          }
        ]
      }
    },
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "stepcount",
        "typeMatchExpression": "$..[?(@steps)]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.steps",
            "valueName": "steps"
          }
        ]
      }
    }
  ]
}
```

## CalculatedContentTemplate

IoT connector provides an expression-based content template to both match the wanted template and extract values. **Expressions** may be used by either JSONPath or JmesPath. Each expression within the template may choose its own expression language. 

> [!NOTE]
> If an expression language isn't defined, the default expression language configured for the template will be used. The default is JSONPath but can be overwritten if needed.

An expression is defined as:

```json
<name of expression> : {
        "value" : <the expression>,
        "language": <the expression language>
    }
```

In the example below, *typeMatchExpression* is defined as:

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": {
            "value" : "$..[?(@heartRate)]",
            "language": "JsonPath"
        },
        ...
    }
```
> [!TIP]
> The default expression language to use for a Device mapping template is JsonPath. If you want to use JsonPath, the expression alone may be supplied.

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

The default expression language to use for a template can be explicitly set using the `defaultExpressionLanguage` parameter:

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "defaultExpressionLanguage": "JsonPath",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

The CalculatedContentTemplate allows matching on and extracting values from an Azure Event Hub message using **Expressions** as defined below:

|Property|Description|Example|
|--------|-----------|-------|
|TypeName|The type to associate with measurements that match the template|`heartrate`|
|TypeMatchExpression|The expression that is evaluated against the EventData payload. If a matching JToken is found, the template is considered a match. All later expressions are evaluated against the extracted JToken matched here.|`$..[?(@heartRate)]`|
|TimestampExpression|The expression to extract the timestamp value for the measurement's OccurrenceTimeUtc.|`$.matchedToken.endDate`|
|DeviceIdExpression|The expression to extract the device identifier.|`$.matchedToken.deviceId`|
|PatientIdExpression|*Required* when IdentityResolution is in **Create** mode and *Optional* when IdentityResolution is in **Lookup** mode. The expression to extract the patient identifier.|`$.matchedToken.patientId`|
|EncounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|
|CorrelationIdExpression|*Optional*: The expression to extract the correlation identifier. This output can be used to group values into a single observation in the FHIR destination mappings.|`$.matchedToken.correlationId`|
|Values[].ValueName|The name to associate with the value extracted by the next expression. Used to bind the wanted value/component in the FHIR destination mapping template.|`hr`|
|Values[].ValueExpression|The expression to extract the wanted value.|`$.matchedToken.heartRate`|
|Values[].Required|Will require the value to be present in the payload. If not found, a measurement won't be generated and an InvalidOperationException will be created.|`true`|

### Expression Languages

When specifying the language to use for the expression, the below values are valid:

| Expression Language | Value        |
|---------------------|--------------|
| JSONPath            | **JsonPath** |
| JmesPath            | **JmesPath** |

>[!TIP]
>For more information on JSONPath, see [JSONPath](https://goessner.net/articles/JsonPath/). The [CalculatedContentTemplate](#calculatedcontenttemplate) uses the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.
>
>For more information on JmesPath, see [JmesPath](https://jmespath.org/specification.html). The [CalculatedContentTemplate](#calculatedcontenttemplate) uses the [JmesPath .NET implementation](https://github.com/jdevillard/JmesPath.Net) for resolving JmesPath expressions.

### Custom Functions

A set of IoT connector custom functions is also available. These custom functions are outside of the functions provided as part of the JmesPath specification. For more information on IoT connector custom functions, see [IoT connector customer functions](./iot-connector-custom-functions.md).

### Matched Token

The **TypeMatchExpression** is evaluated against the incoming EventData payload. If a matching JToken is found, the template is considered a match. 

All later expressions are evaluated against a new JToken. This new JToken contains both the original EventData payload and the extracted JToken matched here. 

In this way, the original payload and the matched object are available to each later expression. The extracted JToken will be available as the property **matchedToken**.

Given this example message:

*Message*

```json
{
  "Body": {
    "deviceId": "device123",
    "data": [
      {
        "systolic": "120", // Match
        "diastolic": "80", // Match 
        "date": "2021-07-13T17:29:01.061144Z"
      },
      {
        "systolic": "122", // Match
        "diastolic": "82", // Match
        "date": "2021-07-13T17:28:01.061122Z"
      }
    ]
  },
  "Properties": {},
  "SystemProperties": {}
}
```

*Template*

```json
{
  "templateType": "CollectionContent",
  "template": [
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@systolic && @diastolic)]", // Expression
        "deviceIdExpression": "$.Body.deviceId", // This accesses the attribute 'deviceId' which belongs to the original event data
        "timestampExpression": "$.matchedToken.date", 
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.systolic",
            "valueName": "systolic"
          },
          {
            "required": "true",
            "valueExpression": "$.matchedToken.diastolic",
            "valueName": "diastolic"
          }
        ]
      }
    }
  ]
}
```

Two matches will be extracted using the above expression and used to create JTokens. Later expressions will be evaluated using the following JTokens:

```json
{
  "Body": {
    "deviceId": "device123",
    "data": [
      {
        "systolic": "120", 
        "diastolic": "80",
        "date": "2021-07-13T17:29:01.061144Z"
      },
      {
        "systolic": "122",
        "diastolic": "82",
        "date": "2021-07-13T17:28:01.061122Z"
      }
    ]
  },
  "Properties": {},
  "SystemProperties": {},
  "matchedToken" : {
      "systolic": "120",
      "diastolic": "80",
      "date": "2021-07-13T17:29:01.061144Z"
  }
}
```

And

```json
{
  "Body": {
    "deviceId": "device123",
    "data": [
      {
        "systolic": "120",
        "diastolic": "80",
        "date": "2021-07-13T17:29:01.061144Z"
      },
      {
        "systolic": "122", 
        "diastolic": "82", 
        "date": "2021-07-13T17:28:01.061122Z"
      }
    ]
  },
  "Properties": {},
  "SystemProperties": {},
  "matchedToken" : {
      "systolic": "122",
      "diastolic": "82",
      "date": "2021-07-13T17:28:01.061122Z"
    }
  }
}
```

### Examples

**Heart Rate**

*Message*

```json
{
  "Body": {
    "heartRate": "78",
    "endDate": "2019-02-01T22:46:01.8750000Z",
    "deviceId": "device123"
  },
  "Properties": {},
  "SystemProperties": {}
}
```

*Template*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.heartRate",
            "valueName": "hr"
          }
        ]
      }
    }
```

**Blood Pressure**

*Message*

```json
{
    "Body": {
        "systolic": "123", // Match
        "diastolic" : "87", // Match
        "endDate": "2019-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```

*Template*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "bloodpressure",
        "typeMatchExpression": "$..[?(@systolic && @diastolic)]", // Expression
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.systolic",
            "valueName": "systolic"
          },
          {
            "required": "true",
            "valueExpression": "$.matchedToken.diastolic",
            "valueName": "diastolic"
          }
        ]
      }
    }
```

**Project Multiple Measurements from Single Message**

*Message*

```json
{
    "Body": {
        "heartRate": "78", // Match (Template 1)
        "steps": "2", // Match (Template 2)
        "endDate": "2019-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```

*Template 1*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]", // Expression
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.heartRate",
            "valueName": "hr"
          }
        ]
      }
    },
```

*Template 2*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "stepcount",
        "typeMatchExpression": "$..[?(@steps)]", // Expression
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.steps",
            "valueName": "steps"
          }
        ]
      }
    }
```

**Project Multiple Measurements from Array in Message**

*Message*

```json
{
  "Body": [
    {
      "heartRate": "78", // Match
      "endDate": "2019-02-01T20:46:01.8750000Z",
      "deviceId": "device123"
    },
    {
      "heartRate": "81", // Match
      "endDate": "2019-02-01T21:46:01.8750000Z",
      "deviceId": "device123"
    },
    {
      "heartRate": "72", // Match
      "endDate": "2019-02-01T22:46:01.8750000Z",
      "deviceId": "device123"
    }
  ],
  "Properties": {},
  "SystemProperties": {}
}
```

*Template*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]", // Expression
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.heartRate",
            "valueName": "hr"
          }
        ]
      }
    }
```

**Project Data From Matched Token And Original Event**

*Message*

```json
{
  "Body": {
    "deviceId": "device123",
    "data": [
      {
        "systolic": "120", // Match
        "diastolic": "80", // Match 
        "date": "2021-07-13T17:29:01.061144Z"
      },
      {
        "systolic": "122", // Match
        "diastolic": "82", // Match
        "date": "2021-07-13T17:28:01.061122Z"
      }
    ]
  },
  "Properties": {},
  "SystemProperties": {}
}
```

*Template*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@systolic && @diastolic)]", // Expression
        "deviceIdExpression": "$.Body.deviceId", // This accesses the attribute 'deviceId' which belongs to the original event data
        "timestampExpression": "$.matchedToken.date", 
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.systolic",
            "valueName": "systolic"
          },
          {
            "required": "true",
            "valueExpression": "$.matchedToken.diastolic",
            "valueName": "diastolic"
          }
        ]
      }
    }
```

**Select and transform incoming data**

In the below example, height data arrives in either inches or meters. We want all normalized height data to be in meters. To achieve this outcome, we create a template that targets only height data in inches and transforms it into meters. Another template targets height data in meters and simply stores it as is.

*Message*

```json
{
  "Body": [
    {
      "height": "78",
      "unit": "inches", // Match (Template 1)
      "endDate": "2019-02-01T22:46:01.8750000Z",
      "deviceId": "device123"
    },
    {
      "height": "1.9304",
      "unit": "meters", // Match (Template 2)
      "endDate": "2019-02-01T23:46:01.8750000Z",
      "deviceId": "device123"
    }
  ],
  "Properties": {},
  "SystemProperties": {}
}
```

*Template 1*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heightInMeters",
        "typeMatchExpression": "$..[?(@unit == 'inches')]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": {
              "value": "multiply(to_number(matchedToken.height), `0.0254`)", // Convert inches to meters. Notice we utilize JmesPath as that gives us access to transformation functions
              "language": "JmesPath"
            },
            "valueName": "height"
          }
        ]
      }
    }
```

*Template 2*

```json
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heightInMeters",
        "typeMatchExpression": "$..[?(@unit == 'meters')]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.height", // Simply extract the height as it is already in meters
            "valueName": "height"
          }
        ]
      }
    }
```
## IotJsonPathContentTemplate

The IotJsonPathContentTemplate is similar to the JsonPathContentTemplate except the `DeviceIdExpression` and `TimestampExpression` aren't required.

The assumption, when using this template, is the messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

>[!IMPORTANT]
>Make sure that you're using a device identifier from Azure Iot Hub or Azure IoT Central that is registered as an identifer for a device resource on the destination FHIR service.

If you're using Azure IoT Hub Device SDKs, you can still use the JsonPathContentTemplate, assuming that you're using custom properties in the message body for the device identity or measurement timestamp

> [!NOTE]
> When using `IotJsonPathContentTemplate`, the `TypeMatchExpression` should resolve to the entire message as a JToken. For more information, see the following examples:

### Examples

**Heart rate**

*Message*

```json
{
    "Body": {
        "heartRate": "78"        
    },
    "Properties": {
        "iothub-creation-time-utc" : "2021-02-01T22:46:01.8750000Z"
    },
    "SystemProperties": {
        "iothub-connection-device-id" : "device123"
    }
}
```

*Template*

```json

    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.Body.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

**Blood pressure**

*Message*

```json
{
    "Body": {
        "systolic": "123",
        "diastolic" : "87"
    },
    "Properties": {
        "iothub-creation-time-utc" : "2021-02-01T22:46:01.8750000Z"
    },
    "SystemProperties": {
        "iothub-connection-device-id" : "device123"
    }
}
```

*Template*

```json
{
    "typeName": "bloodpressure",
    "typeMatchExpression": "$..[?(@Body.systolic && @Body.diastolic)]",
    "values": [
        {
            "required": "true",
            "valueExpression": "$.Body.systolic",
            "valueName": "systolic"
        },
        {
            "required": "true",
            "valueExpression": "$.Body.diastolic",
            "valueName": "diastolic"
        }
    ]
}
```
## IotCentralJsonPathContentTemplate

The IotCentralJsonPathContentTemplate also doesn't require DeviceIdExpression and TimestampExpression. It gets used when the messages being evaluated are sent through the [Export Data](../../iot-central/core/howto-export-data.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

If you're using Azure IoT Central's Data Export feature and custom properties in the message body for the device identity or measurement timestamp, you can still use the JsonPathContentTemplate.

> [!NOTE]
> When using `IotCentralJsonPathContentTemplate`, `TypeMatchExpression` should resolve to the entire message as a JToken. For more information, see the following examples:
 
### Examples

**Heart rate**

*Message*

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:26:55.455Z",
    "telemetry": {
        "Activity": "running",
        "BloodPressure": {
            "Diastolic": 7,
            "Systolic": 71
        },
        "BodyTemperature": 98.73447010562934,
        "HeartRate": 88,
        "HeartRateVariability": 17,
        "RespiratoryRate": 13
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "messageProperties": {
      "messageProp": "value"
    }
}
```

*Template*

```json
{
    "templateType": "IotCentralJsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@telemetry.HeartRate)]",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.telemetry.HeartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

**Blood pressure**

*Message*

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:26:55.455Z",
    "telemetry": {
        "Activity": "running",
        "BloodPressure": {
            "Diastolic": 7,
            "Systolic": 71
        },
        "BodyTemperature": 98.73447010562934,
        "HeartRate": 88,
        "HeartRateVariability": 17,
        "RespiratoryRate": 13
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "messageProperties": {
      "messageProp": "value"
    }
}
```

*Template*

```json
{
    "templateType": "IotCentralJsonPathContent",
    "template": {
        "typeName": "bloodPressure",
        "typeMatchExpression": "$..[?(@telemetry.BloodPressure.Diastolic && @telemetry.BloodPressure.Systolic)]",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.telemetry.BloodPressure.Diastolic",
                "valueName": "bp_diastolic"
            },
            {
                "required": "true",
                "valueExpression": "$.telemetry.BloodPressure.Systolic",
                "valueName": "bp_systolic"
            }
        ]
    }
}
```

## Next steps

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

>[!div class="nextstepaction"]
>[How to use FHIR destination mappings](how-to-use-fhir-mapping-iot.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
