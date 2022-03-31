---
title: Troubleshoot MedTech service Device and FHIR destination mappings - Azure Health Data Services
description: This article helps users troubleshoot the MedTech service Device and FHIR destination mappings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 02/16/2022
ms.author: jasteppe
---

# Troubleshoot MedTech service Device and FHIR destination mappings

This article provides the validation steps MedTech service performs on the Device and Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings and can be used for troubleshooting mappings error messages and conditions. 

> [!IMPORTANT]
> Having access to MedTech service Metrics is essential for monitoring and troubleshooting.  MedTech service assists you to do these actions through [Metrics](./how-to-display-metrics.md).

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting the MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

> [!NOTE]
> When you open an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the MedTech service, include [copies of your Device and FHIR destination mappings](./how-to-create-mappings-copies.md) to assist in the troubleshooting process.

## Device and FHIR destination mappings validations

This section describes the validation process that the MedTech service performs. The validation process validates the Device and FHIR destination mappings before allowing them to be saved for use. These elements are required in the Device and FHIR destination mappings.

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

In this article, you learned the validation process that the MedTech service performs on the Device and FHIR destination mappings. To learn how to troubleshoot MedTech service errors and conditions, see

>[!div class="nextstepaction"]
>[Troubleshoot MedTech service error messages and conditions](iot-troubleshoot-error-messages-and-conditions.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
