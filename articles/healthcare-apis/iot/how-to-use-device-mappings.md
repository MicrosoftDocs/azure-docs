---
title: Device mappings in MedTech service - Azure Health Data Services
description: This article describes how to configure and use Device mapping templates with Azure Health Data Services MedTech service. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 09/12/2022
ms.author: jasteppe
---

# How to use device mappings

This article describes how to configure the MedTech service device mapping.

The MedTech service requires two types of JSON-based mappings. The first type, **device mapping**, is responsible for mapping the device payloads sent to the MedTech service device message event hub end point. The device mapping extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, **Fast Healthcare Interoperability Resources (FHIR&#174;) destination mapping**, controls the mapping for FHIR resource. The FHIR destination mapping allows configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

> [!NOTE]
> Device and FHIR destination mappings are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately.

The two types of mappings are composed into a JSON document based on their type. These JSON documents are then added to your MedTech service through the Azure portal. The device mapping is added through the **Device mapping** page and the FHIR destination mapping through the **Destination** page.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting the MedTech service device and FHIR destination mappings; and export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

> [!NOTE]
> Links to OSS projects on the GitHub website are for informational purposes only and do not constitute an endorsement or guarantee of any kind.  You should review the information and licensing terms on the OSS projects on GitHub before using it.   

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

Below are conceptual examples of what happens during normalization and transformation process within the MedTech service:

:::image type="content" source="media/iot-data-transformation/iot-data-normalization-high-level.png" alt-text="Diagram of IoT data normalization flow example zoomed out." lightbox="media/iot-data-transformation/iot-data-normalization-high-level.png":::

:::image type="content" source="media/concepts-iot-mapping-templates/normalization-example.png" alt-text="Diagram of IoT data normalization flow example zoomed in." lightbox="media/concepts-iot-mapping-templates/normalization-example.png":::

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
## Mapping with JSONPath

The five device content-mapping types supported today rely on JSONPath to both match the required mapping and extracted values. More information on JSONPath can be found [here](https://goessner.net/articles/JsonPath/). All five template types use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSONPath expressions.

You can define one or more templates within the MedTech service device mapping. Each event hub device message received is evaluated against all device mapping templates. 

A single inbound device message can be separated into multiple outbound messages that are later mapped to different observations in the FHIR service. 

Various template types exist and may be used when building the MedTech service device mapping.

|Name                                                                     | Description                                                                   |  
|-------------------------------------------------------------------------|-------------------------------------------------------------------------------|
|[JsonPathContentTemplate](./how-to-use-jsonpath-content-mappings.md)     |A template that supports writing expressions using JsonPath                  
|[CollectionContentTemplate](./how-to-use-collection-content-mappings.md) |A template used to represent a list of templates that will be used during the normalization.                                                            |                                                           
|[CalculatedContentTemplate](./how-to-use-calculated-functions-mappings.md)|A template that supports writing expressions using one of several expression languages. Supports data transformation via the use of JmesPath functions.|
|[IotJsonPathContentTemplate](./how-to-use-iot-jsonpath-content-mappings.md)|A template that supports messages sent from Azure Iot Hub or the Legacy Export Data feature of Azure Iot Central.|
|[IotCentralJsonPathContentTemplate](./how-to-use-iot-central-json-content-mappings.md)|A template that supports messages sent via the Export Data feature of Azure Iot Central.| 

> [!TIP]
> See the MedTech service [troubleshooting guide](./iot-troubleshoot-guide.md) for assistance fixing common errors and issues. 

## Next steps

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

>[!div class="nextstepaction"]
>[How to use the FHIR destination mapping](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
