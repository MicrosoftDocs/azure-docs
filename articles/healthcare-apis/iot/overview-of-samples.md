---
title: MedTech service scenario-based mappings samples - Azure Health Data Services
description: Learn about the MedTech service scenario-based mappings samples.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: sample
ms.date: 07/25/2023
ms.author: jasteppe
---

# Overview of the MedTech service scenario-based mappings samples

The [MedTech service](overview.md) scenario-based [samples](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/medtech-service-mappings) provide conforming and valid [device](overview-of-device-mapping.md) and [FHIR&reg; destination](overview-of-fhir-destination-mapping.md) mappings and test device messages. Theses samples can be used to help with the authoring and troubleshooting of your own MedTech service mappings.

## Sample resources

Each MedTech service scenario-based sample contains the following resources:

* Device mapping
* FHIR destination mapping
* README
* Test device message(s)

> [!TIP]
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

## CalculatedContent

[Conversions using functions](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/medtech-service-mappings/calculatedcontent/conversions-using-functions)

## IotJsonPathContent

[Single device message into multiple resources](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/medtech-service-mappings/iotjsonpathcontent/single-device-message-into-multiple-resources)

## Next steps

[What is MedTech service?](overview.md)

[Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

[Choose a deployment method for the MedTech service](deploy-choose-method.md)

[Overview of the MedTech service device mapping](overview-of-device-mapping.md)

[Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
