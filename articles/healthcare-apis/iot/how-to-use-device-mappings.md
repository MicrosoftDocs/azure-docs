---
title: Device mappings in IoT Connector - Azure Healthcare APIs
description: This article describes how to configure and use Device mapping templates with Azure Healthcare APIs IoT Connector. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/16/2021
ms.author: jasteppe
---

# How to use Device mappings

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting IoT connector Device and FHIR destination mappings. Export mappings for uploading to IoT connector in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of IoT connector.

This article describes how to configure IoT connector using Device mappings.

IoT connector requires two types of JSON-based mappings. The first type, **Device mapping**, is responsible for mapping the device payloads sent to the `devicedata` Azure Event Hub end point. It extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, **Fast Healthcare Interoperability Resources (FHIR&#174;) destination mapping**, controls the mapping for FHIR resource. It allows configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

The two types of mappings are composed into a JSON document based on their type. These JSON documents are then added to your IoT connector through the Azure portal. The Device mapping document is added through the **Device mapping** page and the FHIR destination mapping document through the **Destination** page.

> [!NOTE]
> Mappings are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately. 

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
|[JsonPathContentTemplate](./how-to-use-jsonpath-content-mappings.md)     |A template that supports writing expressions using JsonPath                  
|[CollectionContentTemplate](./how-to-use-collection-content-mappings.md) |A template used to represent a list of templates that will be used during the normalization.                                                            |                                                           
|[CalculatedContentTemplate](./how-to-use-calculated-functions-mappings.md)|A template that supports writing expressions using one of several expression languages. Supports data transformation via the use of JmesPath functions.|
|[IotJsonPathContentTemplate](./how-to-use-iot-jsonpath-content-mappings.md)|A template that supports messages sent from Azure Iot Hub or the Legacy Export Data feature of Azure Iot Central.|
|[IotCentralJsonPathContentTemplate](./how-to-use-iot-central-json-content-mappings.md)|A template that supports messages sent via the Export Data feature of Azure Iot Central.|  

## Next steps

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

>[!div class="nextstepaction"]
>[How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
