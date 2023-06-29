---
title: How to use IotJsonPathContent templates with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use IotJsonPathContent templates with the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/29/2023
ms.author: jasteppe
---

# How to use IotJsonPathContent templates with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of how to use IotJsonPathContent templates within a MedTech service device mapping.

## IotJsonPathContent template basics

The MedTech service IotJsonPathContent templates support the JSON expression language JSONPath. Expressions are used to identify which template to use with a given JSON device message (for example: TypeMatchExpression) and to extract specific values that are required to create a normalized message (for example: TimestampExpression, DeviceIdExpression, etc.). IotJsonPathContent templates are similar to the CalculatedContent templates except the DeviceIdExpression and TimestampExpression aren't required.

> [!IMPORTANT]
> JMESPath is not supported by IotJsonPathContent templates.

An expression is defined as:

```json
<name of expression> : {
   "value" : <the expression>,
   "language": <the expression language>
}
```

In the following example, `typeMatchExpression` is defined as:

```json
"templateType": "IotJsonPathContent",
"template": {
   "typeName": "heartrate",
   "typeMatchExpression": {
      "value" : "$..[?(@heartRate)]",
      "language": "JsonPath"
   },
...
}
```

It is recommended that IotJsonPathContent templates are used when the device messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

> [!IMPORTANT]
> Make sure that you're using a device identifier from Azure IoT Hub or Azure IoT Central that is registered as an identifier for a device resource on the destination FHIR service.

If you're using Azure IoT Hub Device SDKs, you can still use CalculatedContent templates, assuming that you're using custom properties in the device message body for the device identity or measurement timestamp.

The IotJsonPathContent templates allow matching on and extracting values from a device message read from an Azure Event Hubs event hub through the following expressions:

|Element|Description|JSONPath expression|
|:------|:----------|:------------------|
|typeMatchExpression|The expression that the MedTech service evaluates against the device message payload. If the service finds a matching token value, it considers the template a match. The service evaluates all later expressions against the extracted token value matched here.|`$..[?(@heartRate)]`|
|patientIdExpression|The expression to extract the patient identifier. *Required* when the MedTech services's **Resolution type** is set to **Create**, and *optional* when the MedTech service's **Resolution type** is set to **Lookup**.|`$.matchedToken.patientId`|
|encounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|
|correlationIdExpression|*Optional*: The expression to extract the correlation identifier. You can use this output to group values into a single observation in the FHIR destination mapping.|`$.matchedToken.correlationId`|
|values[].valueExpression|The expression to extract the wanted value.|`$.matchedToken.heartRate`|

## Expression languages

When you're specifying the language to use for the expression, the following values are valid:

| Expression language |Value       |
|---------------------|------------|
| JSONPath            | `JsonPath` |

Because JSONPath is the default expression language, it's not required to include the expression language within a CalculatedContent template:

```json
"templateType": "IotJsonPathContent",
   "template": {
      "typeName": "heartrate",
      "typeMatchExpression": "$..[?(@heartRate)]",
...
}
```

You can also explicitly set the default expression language for a IotJsonPathContent template by using the `defaultExpressionLanguage` parameter:

```json
"templateType": "IotJsonPathContent",
   "template": {
      "typeName": "heartrate",
      "defaultExpressionLanguage": "JsonPath",
      "typeMatchExpression": "[Body][?contains(keys(@), `heartRate`)] | @[0]",
...
}
```

> [!TIP]
> For more information on JSONPath, see [JSONPath - XPath for JSON](https://goessner.net/articles/JsonPath/). IotJsonPathContent templates use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.

## Example

When the MedTech service is processing a device message, the templates in the CollectionContent are used to evaluate the message. The `typeMatchExpression` is used to determine whether or not the template should be used to create a normalized message from the device message. If the `typeMatchExpression` evaluates to true, then the `valueExpression` value is used to locate and extract the JSON values from the device message and create a normalized message. In this example, all expressions are written in JSONPath.

> [!TIP]
> [Visual Studio Code with the Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a recommended method for sending IoT device messages to your IoT hub for testing and troubleshooting.
> 
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

In this example, we're using a device message that is capturing `heartRate` data:

```json
{“heartRate” : “78”}
```

> [!NOTE]
> To avoid device spoofing in device-to-cloud (D2C) messages, Azure IoT Hub enriches all device messages with additional properties before routing them to the event hub. For example: **Properties**: `iothub-creation-time-utc` and **SystemProperties**: `iothub-connection-device-id`. For more information, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties). 
>
> `patientIdExpression` is only required for MedTech services in the **Create** mode; however, if **Lookup** is being used, a device resource with a matching device identifier must exist in the destination FHIR service. These examples assume your MedTech service is in the **Create** mode. For more information on the **Create** and **Lookup** **Destination properties**, see [Configure Destination properties](deploy-manual-portal.md#configure-the-destination-tab).

The IoT hub enriches and routes the device message to the event hub before the MedTech service reads the device message from the event hub:

```json
{
  "Body": {
    "heartRate": "78"
  },
  "Properties": {
    "iothub-creation-time-utc": "2023-03-13T22:46:01.875Z"
  },
  "SystemProperties": {
    "iothub-connection-device-id": "device01"
  }
}    
```
We're using this device mapping for the normalization stage:

```json
{
  "templateType": "CollectionContent",
  "template": [
    {
      "templateType": "IotJsonPathContent",
      "template": {
        "typeName": "heartRate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
        "patientIdExpression": "$.SystemProperties.iothub-connection-device-id",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.Body.heartRate",
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

> [!NOTE]
> When using `IotJsonPathContent`, the `typeMatchExpression` should resolve to the entire device message as a token.

```json
{
  "Body": {
    "heartRate": "78",
    "endDate": "2023-03-13T22:46:01.875",
    "deviceId": "device01"
  },
  "matchedToken": {
    "heartRate": "78",
    "endDate": "2023-03-13T22:46:01.875",
    "deviceId": "device01"
  }
}
```

The resulting normalized message will look like this after the normalization stage:

```json
{
  "type": "heartRate",
  "occurrenceTimeUtc": "2023-03-13T22:46:01.875Z",
  "deviceId": "device01",
  "properties": [
    {
      "name": "hr",
      "value": "78"
    }
  ]
}
```

> [!TIP]
> For assistance fixing common MedTech service deployment errors, see [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md).
>
> For assistance fixing MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Next steps

In this article, you learned how to use IotJsonPathContent templates with the MedTech service device mapping.

To deploy the MedTech service with device message routing through an Azure IoT Hub, see

> [!div class="nextstepaction"]
> [Receive device messages through Azure IoT Hub](device-messages-through-iot-hub.md) 

For an overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
