---
title: Overview of the MedTech service device mapping - Azure Health Data Services
description: Learn about the MedTech service device mapping.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: overview
ms.date: 08/01/2023
ms.author: jasteppe
---

# Overview of the MedTech service device mapping

This article provides an overview of the MedTech service device mapping.

The MedTech service requires two types of [JSON](https://www.json.org/) mappings that are added to your MedTech service through the Azure portal or Azure Resource Manager (ARM) API. The device mapping is the first type and controls mapping values in the device data sent to the MedTech service to an internal, normalized data object. The device mapping contains expressions that the MedTech service uses to extract types, device identifiers, measurement date time, and measurement value(s). The [FHIR&reg; destination mapping](overview-of-fhir-destination-mapping.md) is the second type and controls the mapping for [FHIR Observations](https://www.hl7.org/fhir/observation.html).

> [!NOTE]
> The device and FHIR destination mappings are re-evaluated each time a device message is processed. Any updates to either mapping will take effect immediately.

## Device mapping basics

The device mapping contains collections of expression templates used to extract device message data into an internal, normalized format for further evaluation. Each received device message is evaluated against **all** expression templates in the collection. This evaluation means that a single device message can be separated into multiple outbound messages that can be mapped to multiple FHIR Observations in the FHIR service.

> [!TIP]
> For more information about how the MedTech service processes device message data into FHIR Observations for persistence in the FHIR service, see [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md).

This diagram provides an illustration of what happens during the normalization stage within the MedTech service.

:::image type="content" source="media/overview-of-device-mapping/normalization-stage-diagram.png" alt-text="Diagram example of the MedTech service device message normalization stage." lightbox="media/overview-of-device-mapping/normalization-stage-diagram.png":::

## Device mapping validations

The normalization process validates the device mapping before allowing it to be saved for use. These elements are required in the device mapping templates.

**Device mapping**

|Element                 |Required in CalculatedContent|Required in IotJsonPathContent|
|:-----------------------|:----------------------------|:-----------------------------|
|typeName                |True                         |True                          |
|typeMatchExpression     |True                         |True                          |
|deviceIdExpression      |True                         |False and ignored completely. |
|timestampExpression     |True                         |False and ignored completely. |
|patientIdExpression     |True when the MedTech services's **Resolution type** is set to **Create**; False when the MedTech service's **Resolution type** is set to **Lookup**.|True when the MedTech service's **Resolution type** is set to **Create**; False when the MedTech service's **Resolution type** is set to **Lookup**.|
|encounterIdExpression   |False                        |False                         |
|correlationIdExpression |False                        |False                         |
|values[].valueName      |True                         |True                          |
|values[].valueExpression|True                         |True                          |
|values[].required       |True                         |True                          |

> [!IMPORTANT]
> The **Resolution type** specifies how the MedTech service associates device data with Device resources and Patient resources. The MedTech service reads Device and Patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/r4/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/r4/patient-definitions.html#Patient.identifier). If an [encounter identifier](https://hl7.org/fhir/r4/encounter-definitions.html#Encounter.identifier) is specified and extracted from the device data payload, it's linked to the observation if an encounter exists on the FHIR service with that identifier.  If the [encounter identifier](../../healthcare-apis/release-notes.md#medtech-service) is successfully normalized, but no FHIR Encounter exists with that encounter identifier, a **FhirResourceNotFound** exception is thrown. For more information on configuring the MedTech service **Resolution type**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

> [!NOTE] 
> The `values[].valueName, values[].valueExpression`, and `values[].required` elements are only required if you have a value entry in the array. It's valid to have no values mapped. These elements are used when the telemetry being sent is an event.
>
> For example, some scenarios may require creating a FHIR Observation in the FHIR service that does not contain a value.

## CollectionContent

CollectionContent is the root template type used by the MedTech service device mapping. CollectionContent is a list of all templates that are used during the normalization stage. You can define one or more templates within CollectionContent, with each device message received by the MedTech service being evaluated against all templates.

You can use these template types within CollectionContent depending on your use case:

- [CalculatedContent](how-to-use-calculatedcontent-mappings.md) for device messages sent directly to your MedTech service event hub. CalculatedContent supports [JSONPath](https://goessner.net/articles/JsonPath/), [JMESPath](https://jmespath.org/), [JMESPath functions](https://jmespath.org/specification.html#built-in-functions), and the MedTech service [custom functions](how-to-use-custom-functions.md).

and/or

- [IotJsonPathContent](how-to-use-iotjsonpathcontent-mappings.md) for device messages being routed through an [Azure IoT Hub](/azure/iot-hub/iot-concepts-and-iot-hub) to your MedTech service event hub. IotJsonPathContent supports [JSONPath](https://goessner.net/articles/JsonPath/). 

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
When the MedTech service is processing the device message, the templates in the CollectionContent are used to evaluate the message. The `typeMatchExpression` is used to determine whether or not the template should be used to create a normalized message from the device message. If the `typeMatchExpression` evaluates to true, then the `deviceIdExpression`, `timestampExpression`, and `valueExpression` values are used to locate and extract the JSON values from the device message and create a normalized message. In this example, all expressions are written in JSONPath, however, it would be valid to write all the expressions in JMESPath. It's up to the template author to determine which expression language is most appropriate.

> [!TIP]
> For assistance fixing common MedTech service deployment errors, see [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md).
>
> For assistance fixing MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Next steps

[How to use CalculatedContent templates with the MedTech service device mapping](how-to-use-calculatedcontent-templates.md)

[How to use IotJsonPathContent templates with the MedTech service device mapping](how-to-use-iotjsonpathcontent-templates.md)

[How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md)

[Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md)

[Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
