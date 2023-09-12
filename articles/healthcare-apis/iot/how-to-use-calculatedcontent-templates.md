---
title: How to use CalculatedContent templates with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use CalculatedContent templates with the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/01/2023
ms.author: jasteppe
---

# How to use CalculatedContent templates with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of how to use CalculatedContent templates within a MedTech service device mapping.

## CalculatedContent template basics

The MedTech service CalculatedContent templates support two JSON expression languages: JSONPath and JMESPath. Expressions are used to identify which template to use with a given JSON device message (for example: TypeMatchExpression) and to extract specific values that are required to create a normalized message (for example: TimestampExpression, DeviceIdExpression, etc.).

> [!NOTE] 
>If you don't define an expression language, the MedTech service device mapping templates use the default expression language that's configured for the template. The default is JSONPath, but you can overwrite it if necessary.

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

The CalculatedContent templates allow matching on and extracting values from a device message read from an Azure Event Hubs event hub through the following expressions:

|Element|Description|JSONPath expression example|JMESPath expression example|
|:------|:----------|:--------------------------|:--------------------------|
|typeMatchExpression|The expression that the MedTech service evaluates against the device message payload. If the service finds a matching token value, it considers the template a match. The service evaluates all later expressions against the extracted token value matched here.|`$..[?(@heartRate)]`|``[Body][?contains(keys(@), `heartRate`)] \| @[0]``|
|deviceIdExpression|The expression to extract the device identifier.|`$.matchedToken.deviceId`|`@.matchedToken.deviceId`|
|timestampExpression|The expression to extract the timestamp value for the measurement's `OccurrenceTimeUtc` value.|`$.matchedToken.endDate`|`@.matchedToken.endDate`|
|patientIdExpression|The expression to extract the patient identifier. *Required* when the MedTech services's **Resolution type** is set to **Create**, and *optional* when the MedTech service's **Resolution type** is set to **Lookup**.|`$.matchedToken.patientId`|`@.matchedToken.patientId`|
|encounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|`@.matchedToken.encounterId`
|correlationIdExpression|*Optional*: The expression to extract the correlation identifier. You can use this output to group values into a single observation in the FHIR destination mapping.|`$.matchedToken.correlationId`|`@.matchedToken.correlationId`|
|values[].valueExpression|The expression to extract the wanted value.|`$.matchedToken.heartRate`|`@.matchedToken.heartRate`|

> [!NOTE]
> The **Resolution type** specifies how the MedTech service associates device data with Device resources and Patient resources. The MedTech service reads Device and Patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/r4/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/r4/patient-definitions.html#Patient.identifier). If an [encounter identifier](https://hl7.org/fhir/r4/encounter-definitions.html#Encounter.identifier) is specified and extracted from the device data payload, it's linked to the observation if an encounter exists on the FHIR service with that identifier.  If the [encounter identifier](../../healthcare-apis/release-notes.md#medtech-service) is successfully normalized, but no FHIR Encounter exists with that encounter identifier, a **FhirResourceNotFound** exception is thrown. For more information on configuring the MedTech service **Resolution type**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

## Expression languages

When you're specifying the language to use for the expression, the following values are valid:

| Expression language |Value       |
|---------------------|------------|
| JSONPath            | `JsonPath` |
| JMESPath            | `JmesPath` |

Because JSONPath is the default expression language, it's not required to include the expression language within a CalculatedContent template.

```json
"templateType": "CalculatedContent",
   "template": {
      "typeName": "heartrate",
      "typeMatchExpression": "$..[?(@heartRate)]",
...
}
```

You can also explicitly set the default expression language for a CalculatedContent template by using the `defaultExpressionLanguage` parameter:

```json
"templateType": "CalculatedContent",
   "template": {
      "typeName": "heartrate",
      "defaultExpressionLanguage": "JmesPath",
      "typeMatchExpression": "[Body][?contains(keys(@), `heartRate`)] | @[0]",
...
}
```

> [!TIP]
> For more information on JSONPath, see [JSONPath - XPath for JSON](https://goessner.net/articles/JsonPath/). CalculatedContent templates use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.
>
> For more information on JMESPath, see [JMESPath Specification](https://jmespath.org/specification.html). CalculatedContent templates use the [JMESPath .NET implementation](https://github.com/jdevillard/JmesPath.Net) for resolving JMESPath expressions.

## Custom functions

A set of custom functions for the MedTech service is also available. The MedTech service custom functions are outside the functions provided as part of the JMESPath specification. For more information on the MedTech service custom functions, see [How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md).

## Example

When the MedTech service is processing a device message, the templates in the CollectionContent are used to evaluate the message. The `typeMatchExpression` is used to determine whether or not the template should be used to create a normalized message from the device message. If the `typeMatchExpression` evaluates to true, then the `deviceIdExpression`, `timestampExpression`, and `valueExpression` values are used to locate and extract the JSON values from the device message and create a normalized message. In this example, all expressions are written in JSONPath, however, it would be valid to write all the expressions in JMESPath. It's up to the template author to determine which expression language is most appropriate.

> [!TIP]
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

In this example, we're using a device message that is capturing `heartRate` data:

```json
{
    "heartRate": "78",
    "endDate": "2023-03-13T22:46:01.8750000",
    "deviceId": "device01"
}
```

The event hub enriches the device message before the MedTech service reads the device message from the event hub:

```json
{
    "Body": {
        "heartRate": "78",
        "endDate": "2023-03-13T22:46:01.8750000",
        "deviceId": "device01"
    }
}
```

We're using this device mapping for the normalization stage:

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
                        "required": true,
                        "valueExpression": "$.matchedToken.heartRate",
                        "valueName": "hr"
                    }
                ]
            }
        }
    ]
}
```

> [!IMPORTANT]
> The MedTech service evaluates `typeMatchExpression` against the incoming device data payload. If the service finds a matching token value, it considers the template a match.
>
> The MedTech service evaluates all later expressions against a new token value. This new token value contains both the original device data payload and the extracted token value matched here.
>
> In this way, the original device data payload and the matched object are available to each later expression. The extracted token value is available as the property `matchedToken`.

```json
{
    "Body": {
        "heartRate": "78",
        "endDate": "2023-03-13T22:46:01.8750000",
        "deviceId": "device01"
    },
    "matchedToken": {
        "heartRate": "78",
        "endDate": "2023-03-13T22:46:01.8750000",
        "deviceId": "device01"
    }
}
```

The resulting normalized message will look like this after the normalization stage:

```json
[
    {
        "type": "heartrate",
        "occurrenceTimeUtc": "2023-03-13T22:46:01.875Z",
        "deviceId": "device01",
        "properties": [
            {
                "name": "hr",
                "value": "78"
            }
        ]
    }
]
```

> [!TIP]
> For assistance troubleshooting MedTech service deployment errors, see [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md).
>
> For assistance troubleshooting MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Next steps

In this article, you learned how to use CalculatedContent templates with the MedTech service device mapping.

To learn how to use the MedTech service custom functions, see

> [!div class="nextstepaction"]
> [How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md)

For an overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md)

For an overview of the MedTech service scenario-based mappings samples, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office, and is used with permission.
