---
title: How to use IotJsonPathContent templates with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use IotJsonPathContent templates with the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/01/2023
ms.author: jasteppe
---

# How to use IotJsonPathContent templates with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of how to use IotJsonPathContent templates within a MedTech service device mapping.

## IotJsonPathContent template basics

IotJsonPathContent templates can be used when the MedTech service ingests device messages [routed](../../iot-hub/iot-concepts-and-iot-hub.md#message-routing-sends-data-to-other-endpoints) from an [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md). When IotJsonPathContent templates are used within the [device mapping](overview-of-device-mapping.md), the MedTech service extracts the device ID and measurement timestamp from metadata provided by an IoT hub. The DeviceIdExpression and TimestampExpression shouldn't be included in IotJsonPathContent templates.

The MedTech service IotJsonPathContent templates support the JSON expression language JSONPath. Expressions are used to identify which template to use with a given JSON device message (for example: TypeMatchExpression) and to extract specific values that are required to create a normalized message (for example: PatientIdExpression, ValueExpression, etc.). IotJsonPathContent templates are similar to the [CalculatedContent templates](how-to-use-calculatedcontent-templates.md) except the DeviceIdExpression and TimestampExpression aren't supported.

> [!NOTE]
> JMESPath is not supported by IotJsonPathContent templates.

An expression is defined as:

```json
<name of expression> : <the expression>
```

In the following example, `typeMatchExpression` is defined as:

```json
"templateType": "IotJsonPathContent",
"template": {
   "typeName": "heartrate",
   "typeMatchExpression": "$..[?(@heartRate)]",
...
}
``` 

If your MedTech service is set up to ingest device messages from an IoT hub, you aren't required to use IotJsonPathContent templates. CalculatedContent templates can be used assuming that you correctly define the DeviceIdExpression and TimestampExpression.

The IotJsonPathContent templates allow matching on and extracting values from a device message read from an Azure Event Hubs event hub through the following expressions:

|Element|Description|JSONPath expression example|
|:------|:----------|:--------------------------|
|typeMatchExpression|The expression that the MedTech service evaluates against the device message payload. If the service finds a matching token value, it considers the template a match.|`$..[?(@heartRate)]`|
|patientIdExpression|The expression to extract the patient identifier. *Required* when the MedTech services's **Resolution type** is set to **Create**, and *optional* when the MedTech service's **Resolution type** is set to **Lookup**.|`$.SystemProperties.iothub-connection-device-id`|
|encounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.Body.encounterId`|
|correlationIdExpression|*Optional*: The expression to extract the correlation identifier. You can use this output to group values into a single observation in the FHIR destination mapping.|`$.Body.correlationId`|
|values[].valueExpression|The expression to extract the wanted value.|`$.Body.heartRate`|

> [!IMPORTANT]
> The MedTech service will use the device ID defined in IoT hub as the FHIR resource device identifier. If the MedTech service is set up to use an identity resolution type of **Lookup**, a Device resource with a matching device identifier **must** exist in the FHIR service or an error will occur when the device message is processed. If the MedTech service's identity resolution type is set to **Create**, a `patientIdExpression` must be included in the device mapping so that a new Patient resource and Device resource can be created if they do not already exist.

> [!NOTE]
> The **Resolution type** specifies how the MedTech service associates device data with Device resources and Patient resources. The MedTech service reads Device and Patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/r4/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/r4/patient-definitions.html#Patient.identifier). If an [encounter identifier](https://hl7.org/fhir/r4/encounter-definitions.html#Encounter.identifier) is specified and extracted from the device data payload, it's linked to the observation if an encounter exists on the FHIR service with that identifier.  If the [encounter identifier](../../healthcare-apis/release-notes.md#medtech-service) is successfully normalized, but no FHIR Encounter exists with that encounter identifier, a **FhirResourceNotFound** exception is thrown. For more information on configuring the MedTech service **Resolution type**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

## Expression languages

JSONPath is the default expression language, and inclusion of an expression language within an IotJsonPathContent template isn't supported. If you attempt to specify the expression language in an expression object, the IotJsonPathContent template containing the expression object fails.

```json
"templateType": "IotJsonPathContent",
   "template": {
      "typeName": "heartrate",
      "typeMatchExpression": "$..[?(@heartRate)]",
...
}
```

> [!TIP]
> For more information on JSONPath, see [JSONPath - XPath for JSON](https://goessner.net/articles/JsonPath/). IotJsonPathContent templates use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.

## Example

When the MedTech service is processing a device message, the templates in the CollectionContent are used to evaluate the message. The `typeMatchExpression` is used to determine whether or not the template should be used to create a normalized message from the device message. If the `typeMatchExpression` evaluates to true, then the `valueExpression` value is used to locate and extract the JSON values from the device message and create a normalized message.

> [!TIP]
> [Visual Studio Code with the Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a recommended method for sending IoT device messages to your IoT hub for testing and troubleshooting.
> 
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

In this example, we're using a device message that is capturing `heartRate` data:

```json
{
    "PatientId": "patient1",
    "HeartRate" : "78"
}
```

> [!NOTE]
> To avoid device spoofing in device-to-cloud (D2C) messages, Azure IoT Hub enriches all device messages with additional properties before routing them to the event hub. For example: **Properties**: `iothub-creation-time-utc` and **SystemProperties**: `iothub-connection-device-id`. For more information, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties). 
>
> `patientIdExpression` is only required for MedTech services in the **Create** mode; however, if **Lookup** is being used, a Device resource with a matching device identifier must exist in the destination FHIR service. These examples assume your MedTech service is in the **Create** mode. For more information on the **Create** and **Lookup** **Destination properties**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

The IoT hub enriches and routes the device message to the event hub before the MedTech service reads the device message from the event hub:

```json
{
    "Body": {
        "PatientId": "patient1",
        "HeartRate": "78"
    },
    "SystemProperties": {
        "iothub-enqueuedtime": "2023-07-25T20:41:26.046Z",
        "iothub-connection-device-id": "sampleDeviceId"
    },
    "Properties": {
        "iothub-creation-time-utc": "2023-07-25T20:41:26.046Z"
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
                "typeName": "HeartRate",
                "typeMatchExpression": "$..[?(@Body.HeartRate)]",
                "patientIdExpression": "$.Body.PatientId",
                "values": [
                    {
                        "required": true,
                        "valueExpression": "$.Body.HeartRate",
                        "valueName": "HeartRate"
                    }
                ]
            }
        }
    ]    
}
```

The resulting normalized message will look like this after the normalization stage:

```json
{
    "type": "HeartRate",
    "occurrenceTimeUtc": "2023-07-25T20:41:26.046Z",
    "deviceId": "sampleDeviceId",
    "patientId": "patient1",
    "properties": [
        {
            "name": "HeartRate",
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

To deploy the MedTech service with device message routing enabled through an Azure IoT Hub, see

> [!div class="nextstepaction"]
> [Receive device messages through Azure IoT Hub](device-messages-through-iot-hub.md) 

For an overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md)

For an overview of the MedTech service scenario-based mappings samples, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
