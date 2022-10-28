---
title: How to configure device mappings in MedTech service - Azure Health Data Services
description: This article provides an overview and describes how to configure the MedTech service device mappings within the Azure Health Data Services. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/25/2022
ms.author: jasteppe
---

# Device mappings overview

This article provides an overview and describes how to configure the MedTech service device mappings.

The MedTech service requires two types of JSON-based mappings. The first type, **device mappings**, is responsible for mapping the device payloads sent to the MedTech service device message event hub endpoint. The device mapping extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, **Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings**, controls the mapping for FHIR resource. The FHIR destination mappings allow configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

> [!NOTE]
> Device and FHIR destination mappings are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately.

The two types of mappings are composed into a JSON document based on their type. These JSON documents are then added to your MedTech service through the Azure portal. The device mapping is added through the **Device mapping** page and the FHIR destination mapping through the **Destination** page.
  
## How to configure device mappings

Device mappings provide functionality to extract device message content into a common format for further evaluation. Each device message received is evaluated against all device mapping templates. A single inbound device message can be separated into multiple outbound messages that are later mapped to different observations in the FHIR service. The result is a normalized data object representing the value or values parsed by the device mapping templates. 

The normalized data model has a few required properties that must be found and extracted:

|Property|Description|
|--------|-----------|
|**Type**|The name/type to classify the measurement. This value is used to bind to the required FHIR destination mapping. Multiple mappings can output to the same type allowing you to map different representations across multiple devices to a single common output.|
|**OccurenceTimeUtc**|The time the measurement occurred.|
|**DeviceId**|The identifier for the device. This value should match an identifier on the device resource that exists on the destination FHIR service.|
|**Properties**|Extract at least one property so the value can be saved in the Observation resource created. Properties are a collection of key value pairs extracted during normalization.|

> [!IMPORTANT]
> The full normalized model is defined by the [IMeasurement](https://github.com/microsoft/iomt-fhir/blob/master/src/lib/Microsoft.Health.Fhir.Ingest.Schema/IMeasurement.cs) interface.

Below is an example of what happens during normalization and transformation process within the MedTech service. For the purposes of the device mapping, we'll be focusing on the **Normalized data** process:

:::image type="content" source="media/iot-data-transformation/iot-data-normalization-high-level.png" alt-text="Diagram of IoT data normalization flow example zoomed out." lightbox="media/iot-data-transformation/iot-data-normalization-high-level.png":::

The content payload itself is an Azure Event Hubs message, which is composed of three parts: Body, Properties, and SystemProperties. The `Body` is a byte array representing an UTF-8 encoded string. During template evaluation, the byte array is automatically converted into the string value. `Properties` is a key value collection for use by the message creator. `SystemProperties` is also a key value collection reserved by the Azure Event Hubs framework with entries automatically populated by it.

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
## CollectionContentTemplate

The CollectionContentTemplate is the **root** template type used by the MedTech service device mappings template and represents a list of all templates that will be used during the normalization process.
                                                             
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

## Mapping with JSONPath

The device mapping content types supported by the MedTech service rely on JSONPath to both match the required mapping and extracted values. More information on JSONPath can be found [here](https://goessner.net/articles/JsonPath/). All template types use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.

### Example

**Heart rate**

*A device message from the Azure Event Hubs event hub received by the MedTech service*

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

*A conforming MedTech service device mapping template that could be used during the normalization process with the example device message*

```json
{
  "templateType": "CollectionContent",
  "template": [
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
   ]
}
```
JSONPath allows matching on and extracting values from a device message.

|Property|Description|Example|
|--------|-----------|-------|
|TypeName|The type to associate with measurements that match the template|`heartrate`|
|TypeMatchExpression|The JSONPath expression that is evaluated against the EventData payload. If a matching JToken is found, the template is considered a match. All later expressions are evaluated against the extracted JToken matched here.|`$..[?(@heartRate)]`|
|DeviceIdExpression|The JSONPath expression to extract the device identifier.|`$.matchedToken.deviceId`|
|TimestampExpression|The JSONPath expression to extract the timestamp value for the measurement's OccurrenceTimeUtc.|`$.matchedToken.endDate`|
|PatientIdExpression|*Required* when IdentityResolution is in **Create** mode and *Optional* when IdentityResolution is in **Lookup** mode. The expression to extract the patient identifier.|`$.matchedToken.patientId`|
|EncounterIdExpression|*Optional*: The expression to extract the encounter identifier.|`$.matchedToken.encounterId`|
|CorrelationIdExpression|*Optional*: The expression to extract the correlation identifier. This output can be used to group values into a single observation in the FHIR destination mappings.|`$.matchedToken.correlationId`|
|Values[].ValueName|The name to associate with the value extracted by the next expression. Used to bind the wanted value/component in the FHIR destination mapping template.|`hr`|
|Values[].ValueExpression|The JSONPath expression to extract the wanted value.|`$.matchedToken.heartRate`|
|Values[].Required|Will require the value to be present in the payload. If not found, a measurement won't be generated, and an InvalidOperationException will be created.|`true`|

## Other supported template types

You can define one or more templates within the MedTech service device mapping. Each device message received is evaluated against all device mapping templates.

|Template Type|Description|
|-------------|-----------|   
|[CalculatedContentTemplate](how-to-use-calculated-functions-mappings.md)|A template that supports writing expressions using one of several expression languages. Supports data transformation via the use of JMESPath functions.|
|[IotJsonPathContentTemplate](how-to-use-iot-jsonpath-content-mappings.md)|A template that supports messages sent from Azure Iot Hub or the Legacy Export Data feature of Azure Iot Central.
 
> [!TIP]
> See the MedTech service article [Troubleshoot MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md) for assistance fixing common errors and issues related to MedTech service mappings. 

## Next steps

In this article, you learned how to use device mappings. To learn how to use FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to use the FHIR destination mappings](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
