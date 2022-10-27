---
title: CalculatedContentTemplate mappings in MedTech service Device mappings - Azure Health Data Services
description: This article describes how to use CalculatedContentTemplate mappings with MedTech service Device mappings templates. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/25/2022
ms.author: jasteppe
---

# How to use CalculatedContentTemplate mappings

This article describes how to use CalculatedContentTemplate mappings with MedTech service device mapping template.

## CalculatedContentTemplate

MedTech service provides an expression-based content template to both match the wanted template and extract values. **Expressions** may be used by either JSONPath or JMESPath. Each expression within the template may choose its own expression language. 

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
> The default expression language to use for a MedTech service device mapping template is JsonPath. If you want to use JsonPath, the expression alone may be supplied.

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

The default expression language to use for a MedTech service device template can be explicitly set using the `defaultExpressionLanguage` parameter:

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "defaultExpressionLanguage": "JsonPath",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

The CalculatedContentTemplate allows matching on and extracting values from an Azure Event Hubs message using **Expressions** as defined below:

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
|Values[].Required|Will require the value to be present in the payload. If not found, a measurement won't be generated, and an InvalidOperationException will be created.|`true`|

### Expression Languages

When specifying the language to use for the expression, the below values are valid:

| Expression Language | Value        |
|---------------------|--------------|
| JSONPath            | **JsonPath** |
| JMESPath            | **JmesPath** |

>[!TIP]
> For more information on JSONPath, see [JSONPath](https://goessner.net/articles/JsonPath/). The [CalculatedContentTemplate](#calculatedcontenttemplate) uses the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.
>
> For more information on JMESPath, see [JMESPath](https://jmespath.org/specification.html). The [CalculatedContentTemplate](#calculatedcontenttemplate) uses the [JMESPath .NET implementation](https://github.com/jdevillard/JmesPath.Net) for resolving JMESPath expressions.

### Custom functions

A set of MedTech service custom functions is also available. The MedTech service custom functions are outside of the functions provided as part of the JMESPath specification. For more information on the MedTech service custom functions, see [How to use MedTech service custom functions](how-to-use-custom-functions.md).

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
              "value": "multiply(to_number(matchedToken.height), `0.0254`)", // Convert inches to meters. Notice we utilize JMESPath as that gives us access to transformation functions
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

> [!TIP]
> See the MedTech service article [Troubleshoot MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md) for assistance fixing common errors and issues related to MedTech service mappings.

## Next steps

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
