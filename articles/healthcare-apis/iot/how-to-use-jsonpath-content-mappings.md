---
title: JsonPathContentTemplate mappings in MedTech service Device mappings - Azure Health Data Services
description: This article describes how to use JsonPathContentTemplate mappings with the MedTech service Device mappings templates. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 02/16/2022
ms.author: jasteppe
---

# How to use JsonPathContentTemplate mappings

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting the MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

This article describes how to use JsonPathContentTemplate mappings with the MedTech service Device mappings templates.

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

> [!TIP]
> See the MedTech service [troubleshooting guide](./iot-troubleshoot-guide.md) for assistance fixing common errors and issues.

## Next steps

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

>[!div class="nextstepaction"]
>[How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
