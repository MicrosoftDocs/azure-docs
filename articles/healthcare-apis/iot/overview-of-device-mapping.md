---
title: Overview the MedTech service device mapping - Azure Health Data Services
description: This article provides an overview of the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 03/17/2023
ms.author: jasteppe
---

# Overview of the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of the MedTech service device mapping.

The MedTech service requires two types of [JSON](https://www.json.org/) mappings that are added to your MedTech service through the Azure portal or Azure Resource Manager API. 

The device mapping is the first type and is responsible for mapping values in the device message data sent to the MedTech service event hub endpoint to an internal, normalized data object. The device mapping contains expressions that the MedTech service uses to extract types, device identifiers, measurement date time, and measurement value(s). The FHIR destination mapping is the second type and controls the mapping for FHIR Observations. 

> [!NOTE]
> The device and FHIR destination mappings are reevaluated each time a message is processed. Any updates to either mapping will take effect immediately.
  
## Device mapping basics

The device mapping contains collections of expression templates used to extract device message data into an internal, normalized format for further evaluation. Each device message received is evaluated against **all** expression templates in the collection.  This evaluation means that a single device message can be separated into multiple outbound messages that can be mapped to multiple FHIR Observations in the FHIR service.

> [!TIP]
> For more information about how the MedTech service processes device message data into FHIR Observation resources for persistence on the FHIR service, see [Understand the MedTech service device message data transformation](understand-service.md).

This diagram provides an illustration of what happens during the normalization processing stage within the MedTech service.

:::image type="content" source="media/overview-of-device-mapping/normalization-processing-stage-diagram.png" alt-text="Diagram example of the MedTech service device message data normalization processing stage." lightbox="media/overview-of-device-mapping/normalization-processing-stage-diagram.png":::

## Device mapping validations

The validation process validates the device mapping before allowing it to be saved for use. These elements are required in the device mapping templates.

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
> For example, some scenarios may require creating an Observation resource in the FHIR service that does not contain a value.

## CollectionContent

CollectionContent is the root template type used by the MedTech service device mapping. CollectionContent is a list of all templates that are used during the normalization processing stage. You can define one or more templates within CollectionContent, with each device message received by the MedTech service being evaluated against all templates.

You can use these template types within the CollectionContent depending on your use case:

 - [CalculatedContent](how-to-use-calculatedcontent-mappings.md) for device messages sent directly to your MedTech service event hub. CalculatedContent also supports the advanced features of [JMESPath](https://jmespath.org/), [JMESPath functions](https://jmespath.org/specification.html#built-in-functions) and the MedTech service [custom functions](how-to-use-custom-functions.md).

  and/or

- [IotJsonPathContentTemplate](how-to-use-iotjsonpathcontenttemplate-mappings.md) for device messages being routed through [Azure IoT Hub](/azure/iot-hub/iot-concepts-and-iot-hub) to your MedTech service event hub. 

:::image type="content" source="media/overview-of-device-mapping/device-mapping-templates-diagram.png" alt-text="Diagram showing MedTech service device mapping templates architecture." lightbox="media/overview-of-device-mapping/device-mapping-templates-diagram.png":::
                                                             
### Example

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
We're using this MedTech service device mapping for the normalization processing stage:

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

With the resulting normalized message looking like this after the MedTech service normalization processing stage:

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
> See [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md) for assistance fixing common MedTech service deployment errors.  
>
> See [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md) for assistance fixing MedTech service errors. 

## Next steps

In this article, you've been provided an overview of the MedTech service device mapping. 

To learn how to use CalculatedContent mapping templates with the MedTech service device mapping, see

> [!div class="nextstepaction"]
> [How to use CalculatedContent templates with the MedTech service device mapping](how-to-use-calculatedcontent-mappings.md).

To learn how to use IotContentPathTemplates mapping templates with the MedTech service device mapping, see

> [!div class="nextstepaction"]
> [How to use IotContentPathTemplates templates with the MedTech service device mapping](how-to-use-iotjsonpathcontenttemplate-mappings.md).

To learn how to use custom functions with the MedTech service device mapping, see

> [!div class="nextstepaction"]
> [How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md).

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
