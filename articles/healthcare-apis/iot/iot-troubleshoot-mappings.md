---
title: Troubleshoot IoT connector Device and FHIR destination mappings - Azure Healthcare APIs
description: This article helps users troubleshoot IoT connector Device and FHIR destination mappings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 12/10/2021
ms.author: jasteppe
---

# Troubleshoot IoT connector Device and FHIR destination mappings

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

This article provides the validation steps IoT connector performs on the Device and Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings and can be used for troubleshooting mappings error messages and conditions. 

> [!IMPORTANT]
> Having access to IoT connector Metrics is essential for monitoring and troubleshooting.  IoT connector assists you to do these actions through [Metrics](./how-to-display-metrics.md).

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting IoT connector Device and FHIR destination mappings. Export mappings for uploading to IoT connector in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of IoT connector.

> [!NOTE]
> When opening an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for IoT connector, include [copies of your Device and FHIR destination mappings](./how-to-create-mappings-copies.md) to assist in the troubleshooting process.

## Device and FHIR destination mappings validations

This section describes the validation process that IoT connector performs. The validation process validates the Device and FHIR destination mappings before allowing them to be saved for use. These elements are required in the Device and FHIR destination mappings.

**Device mappings**

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
>For example:
> 
>Some IoMT scenarios may require creating an Observation Resource in the FHIR service that does not contain a value.

**FHIR destination mappings**

|Element|Required|
|:------|:-------|
|TypeName|True|

> [!NOTE]
> This is the only required FHIR destination mapping element validated at this time.

## Next steps

In this article, you learned the validation process that IoT connector performs on the Device and FHIR destination mappings. To learn how to troubleshoot IoT connector errors and conditions, see

>[!div class="nextstepaction"]
>[Troubleshoot IoT connector error messages and conditions](iot-troubleshoot-error-messages-and-conditions.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
