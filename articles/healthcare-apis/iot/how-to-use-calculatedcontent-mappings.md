---
title: How to use CalculatedContent mappings with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use CalculatedContent mappings with the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/04/2023
ms.author: jasteppe
---

# How to use CalculatedContent mappings with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article describes how to use CalculatedContent mappings with MedTech service device mappings in Azure Health Data Services.

## Overview of CalculatedContent mappings

The MedTech service provides an expression-based content template to both match the wanted template and extract values. Either JSONPath or JMESPath can use expressions. Each expression within the template can use its own expression language.

> [!NOTE]
> If you don't define an expression language, MedTech service device mappings use the default expression language that's configured for the template. The default is JSONPath, but you can overwrite it if necessary.

An expression is defined as:

```json
<name of expression> : {
        "value" : <the expression>,
        "language": <the expression language>
    }
```

In the following example, `typeMatchExpression` is defined as:

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
> If you want to use JSON instead of the default JSONPath expression language, you can supply the expression alone.

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

You can explicitly set the default expression language for MedTech service device mappings by using the `defaultExpressionLanguage` parameter:

```json
"templateType": "CalculatedContent",
    "template": {
        "typeName": "heartrate",
        "defaultExpressionLanguage": "JsonPath",
        "typeMatchExpression": "$..[?(@heartRate)]",
        ...
    }
```

CalculatedContent mappings allow matching on, and extracting values from, an Azure Event Hubs message through the following expressions:

|Property|Description|Example|
|--------|-----------|-------|
|`TypeName`|The type to associate with measurements that match the template.|`heartrate`|
|`TypeMatchExpression`|The expression that the MedTech service evaluates against the `EventData` payload. If the service finds a matching `JToken` value, it considers the template a match. The service evaluates all later expressions against the extracted `JToken` value matched here.|`$..[?(@heartRate)]`|
|`TimestampExpression`|The expression to extract the timestamp value for the measurement's `OccurrenceTimeUtc` value.|`$.matchedToken.endDate`|
|`DeviceIdExpression`|The expression to extract the device identifier.|`$.matchedToken.deviceId`|
|`PatientIdExpression`|The expression to extract the patient identifier. *Required* when `IdentityResolution` is in `Create` mode, and *optional* when `IdentityResolution` is in `Lookup` mode.|`$.matchedToken.patientId`|
|`EncounterIdExpression`|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|
|`CorrelationIdExpression`|*Optional*: The expression to extract the correlation identifier. You can use this output to group values into a single observation in the FHIR destination mappings.|`$.matchedToken.correlationId`|
|`Values[].ValueName`|The name to associate with the value that the next expression extracts. Used to bind the wanted value or component in the FHIR destination mapping.|`hr`|
|`Values[].ValueExpression`|The expression to extract the wanted value.|`$.matchedToken.heartRate`|
|`Values[].Required`|Requires the value to be present in the payload. If the MedTech service doesn't find the value, it won't generate a measurement, and it will create an `InvalidOperationException` instance.|`true`|

## Expression languages

When you're specifying the language to use for the expression, the following values are valid:

| Expression language | Value        |
|---------------------|--------------|
| JSONPath            | `JsonPath` |
| JMESPath            | `JmesPath` |

>[!TIP]
> For more information on JSONPath, see [JSONPath - XPath for JSON](https://goessner.net/articles/JsonPath/). CalculatedContent mappings use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.
>
> For more information on JMESPath, see [JMESPath Specification](https://jmespath.org/specification.html). CalculatedContent mappings use the [JMESPath .NET implementation](https://github.com/jdevillard/JmesPath.Net) for resolving JMESPath expressions.

## Custom functions

A set of custom functions for the MedTech service is also available. The MedTech service custom functions are outside the functions provided as part of the JMESPath specification. For more information on the MedTech service custom functions, see [How to use custom functions](how-to-use-custom-functions.md).

## Matched token

The MedTech service evaluates `TypeMatchExpression` against the incoming `EventData` payload. If the service finds a matching `JToken` value, it considers the template a match.

The MedTech service evaluates all later expressions against a new `JToken` value. This new `JToken` value contains both the original `EventData` payload and the extracted `JToken` value matched here.

In this way, the original payload and the matched object are available to each later expression. The extracted `JToken` value will be available as the property `matchedToken`.

Here's an example message:

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

The MedTech service extracts two matches by using the preceding expression and uses them to create `JToken` values. The MedTech service will evaluate later expressions by using the following `JToken` values:

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

## Examples

### Heart rate

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

### Blood pressure

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

### Projection of multiple measurements from a single message

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

### Projection of multiple measurements from an array in a message

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

### Projection of data from a matched token and an original event

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

### Selection and transformation of incoming data

In the following example, height data arrives in either inches or meters. Assume that you want all normalized height data to be in meters. To achieve this outcome, you create a template that targets only height data in inches and transforms it into meters. Another template targets height data in meters and simply stores it as is.

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
> For assistance in fixing MedTech service errors, see [Troubleshoot MedTech service errors](troubleshoot-errors.md).

## Next steps

In this article, you learned how to configure MedTech service device mappings by using CalculatedContent mappings.

To learn how to configure FHIR destination mappings, see:

> [!div class="nextstepaction"]
> [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office, and is used with permission.
