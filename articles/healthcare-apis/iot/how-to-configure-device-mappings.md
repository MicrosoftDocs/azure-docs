---
title: How to configure the MedTech service device mapping - Azure Health Data Services
description: This article describes how to configure the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 03/08/2023
ms.author: jasteppe
---

# How to configure the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview and describes how to configure the MedTech service device mapping.

The MedTech service requires two types of [JSON-based](https://www.json.org/) mappings. The first type, device mapping, is responsible for mapping the device message data sent to the MedTech service device message event hub endpoint. The device mapping extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, FHIR destination mapping, controls the mapping for FHIR Observation resources. The FHIR destination mappings allow configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

The device and FHIR destination mappings are JSON documents based on their type and composed of different templates based on requirements. These JSON documents are then added to your MedTech service through the Azure portal or ARM API (Azure Resource Manage API).

> [!NOTE]
> The device and FHIR destination mappings are stored in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction) and loaded from blob storage per compute execution. Once updated, the mappings should take effect immediately.

> [!TIP]
> For more information about how the MedTech service processes device message data into FHIR Observation resources for persistence on the FHIR service, see [Understand the MedTech service device message data transformation](understand-service.md).
  
## Overview of the device mapping

The device mapping provides functionality to extract device message data into a common format for further evaluation. Each device message received is evaluated against all device mapping templates. A single inbound device message can be separated into multiple outbound messages that are later mapped to different FHIR  Observations in the FHIR service. The result is a normalized data object representing the value or values parsed by the device mapping templates. 

The normalized data model has a few required properties that must be found and extracted:

|Property|Description|
|--------|-----------|
|**Type**|The name/type to classify the measurement. This value is used to bind to the required FHIR destination mapping. Multiple mappings can output to the same type allowing you to map different representations across multiple devices to a single common output.|
|**OccurenceTimeUtc**|The time the measurement occurred.|
|**DeviceId**|The identifier for the device. This value should match an identifier on the device resource that exists on the destination FHIR service.|
|**Properties**|Extract at least one property so the value can be saved in the Observation resource created. Properties are a collection of key value pairs extracted during normalization.|

> [!IMPORTANT]
> The full normalized model is defined by the [IMeasurement](https://github.com/microsoft/iomt-fhir/blob/master/src/lib/Microsoft.Health.Fhir.Ingest.Schema/IMeasurement.cs) interface.

Below is an example of what happens during the  normalization and transformation stage processes within the MedTech service.

:::image type="content" source="media/how-to-configure-device-mappings/normalization-process-diagram.png" alt-text="Diagram example of the MedTech service device message data normalization processing flow." lightbox="media/how-to-configure-device-mappings/normalization-process-diagram.png":::

The content of the device message itself is an Azure Event Hubs message, which is composed of three parts: `Body`, `Properties`, and `SystemProperties`. The `Body` is a byte array representing an UTF-8 encoded string. During device mapping template evaluation, the byte array is automatically converted into the string value. `Properties` is a key value collection for use by the message creator. `SystemProperties` is also a key value collection reserved by the Azure Event Hubs framework with entries automatically populated by it.

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

## Device mapping validations

The validation process validates the device mapping before allowing them to be saved for use. These elements are required in the device mapping templates.

**Device mapping**

|Element|Required|
|:-------|:------|
|TypeName|True|
|TypeMatchExpression|True|
|DeviceIdExpression|True|
|TimestampExpression|True|
|Values[].ValueName|True|
|Values[].ValueExpression|True|

> [!NOTE]
> `Values[].ValueName and Values[].ValueExpression` elements are only required if you have a value entry in the array. It's valid to have no values mapped. This is used when the telemetry being sent is an event. 
>
> For example:
> 
> Some scenarios may require creating an Observation Resource in the FHIR service that does not contain a value.

## CollectionContentTemplate

The CollectionContentTemplate is the root template type used by the MedTech service device mapping and represents a list of all templates that will be used during the normalization process.

:::image type="content" source="media/how-to-configure-device-mappings/device-mapping-diagram.png" alt-text="Diagram showing MedTech service device mapping architecture." lightbox="media/how-to-configure-device-mappings/device-mapping-diagram.png":::
                                                             
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
            "required": true,
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
            "required": true,
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

An example of device message capturing `heartRate` received from an event hub by the MedTech service.

```json
{
    "Body": {
        "heartRate": "78",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {
        "iothub-creation-time-utc" : "2022-02-01T22:46:01.8750000Z"
    },
    "SystemProperties": {
        "iothub-connection-device-id" : "device123"
   }
}
```

A conforming MedTech service device mapping that could be used during the normalization process with the example device message.

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
                "required": true,
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
         ]
       }
     }
   ]
}
```

An example of a normalized message using the example device message and FHIR destination mapping.

```json
[
    {
        "type": "heartrate",
        "occurrenceTimeUtc": "2021-02-01T22:46:01.875Z",
        "deviceId": "device123",
        "properties": [
            {
                "name": "hr",
                "value": "78"
            }
        ]
    }
]
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
|[CalculatedContent](how-to-use-calculatedcontent-mappings.md)|A template that supports writing expressions using one of several expression languages. Supports data transformation via the use of JMESPath functions.|
|[IotJsonPathContentTemplate](how-to-use-iot-jsonpath-content-mappings.md)|A template that supports messages sent from Azure Iot Hub or the Legacy Export Data feature of Azure Iot Central.
 
> [!TIP]
> See [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md) for assistance fixing common MedTech service deployment errors.  
>
> See [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md) for assistance fixing MedTech service errors. 

## Next steps

In this article, you learned how the MedTech service device mapping is used and how to configure. 

To learn how the MedTech service FHIR destination mapping is used and configured to configure, see

> [!div class="nextstepaction"]
> [How to configure FHIR destination mappings](how-to-configure-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
