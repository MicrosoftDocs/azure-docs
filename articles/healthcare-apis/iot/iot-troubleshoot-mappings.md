---
title: Troubleshoot MedTech service device and FHIR destination mappings - Azure Health Data Services
description: This article helps users troubleshoot the MedTech service device and FHIR destination mappings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 10/25/2022
ms.author: jasteppe
---

# Troubleshoot MedTech service device and FHIR destination mappings

This article provides the validation steps the MedTech service performs on the device and Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings and can be used for troubleshooting mappings error messages and conditions. 

> [!TIP]
> Having access to metrics and logs are essential tools for assisting you in troubleshooting and assessing the overall performance of your MedTech service. Check out these MedTech service articles to learn more about how to enable, configure, and use these monitoring features:
>  
> [How to use the MedTech service monitoring tab](how-to-use-monitoring-tab.md) 
>
> [How to configure the MedTech service metrics](how-to-configure-metrics.md)
>
> [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

> [!NOTE]
> When you open an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the MedTech service, include [copies of your device and FHIR destination mappings](how-to-create-mappings-copies.md) to assist in the troubleshooting process.

## Device and FHIR destination mappings validations

The validation process validates the device and FHIR destination mappings before allowing them to be saved for use. These elements are required in the device and FHIR destination mappings templates.

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

> [!div class="nextstepaction"]
> [Troubleshoot MedTech service error messages and conditions](iot-troubleshoot-error-messages-and-conditions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
