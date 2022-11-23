---
title: Troubleshoot MedTech service error messages and conditions - Azure Health Data Services
description: This article helps users troubleshoot MedTech service errors messages and conditions.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 10/25/2022
ms.author: jasteppe
---

# Troubleshoot MedTech service error messages and conditions

This article provides steps for troubleshooting and fixing MedTech service error messages and conditions.

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

## Error messages and conditions

### The operation being performed by the MedTech service

This property represents the operation being performed by the MedTech service when the error has occurred. An operation generally represents the data flow stage while processing a device message. Below is a list of possible values for this property.

> [!NOTE]
> For information about the different stages of data flow in the MedTech service, see [MedTech service data flow](iot-data-flow.md).

|Data flow stage|Description|
|---------------|-----------|
|Setup|The setup data flow stage is the operation specific to setting up your instance of the MedTech service.|
|Normalization|Normalization is the data flow stage where the device data gets normalized.|
|Grouping|The grouping data flow stage where the normalized data gets grouped.|
|FHIRConversion|FHIRConversion is the data flow stage where the grouped-normalized data is transformed into a FHIR resource.|
|Unknown|Unknown is the operation type that's unknown when an error occurs.|

#### The severity of the error

This property represents the severity of the occurred error. Below is a list of possible values for this property.

|Severity|Description|
|---------------|-----------|
|Warning|Some minor issue exists in the data flow process, but processing of the device message doesn't stop.|
|Error|This message occurs when the processing of a specific device message has run into an error and other messages may continue to execute as expected.|
|Critical|This error is when some system level issue exists with the MedTech service and no messages are expected to process.|

#### The type of error

This property signifies a category for a given error, which it basically represents a logical grouping for similar types of errors. Below is a list of possible values for this property.

|Error type|Description|
|----------|-----------|
|`DeviceTemplateError`|This error type is related to the Device mapping.|
|`DeviceMessageError`|This error type occurs when processing a specific device message.|
|`FHIRTemplateError`|This error type is related to the FHIR destination mapping|
|`FHIRConversionError`|This error type occurs when transforming a message into a FHIR resource.|
|`FHIRResourceError`|This error type is related to existing resources in the FHIR service that are referenced by the MedTech service.|
|`FHIRServerError`|This error type occurs when communicating with the FHIR service.|
|`GeneralError`|This error type is about all other types of errors.|

#### The name of the error

This property provides the name for a specific error. Below is the list of all error names with their description and associated error type(s), severity, and data flow stage(s).

|Error name|Description|Error type(s)|Error severity|Data flow stage(s)|
|----------|-----------|-------------|--------------|------------------|
|`MultipleResourceFoundException`|This error occurs when multiple patient or device resources are found in the FHIR service for the respective identifiers present in the device message.|`FHIRResourceError`|Error|`FHIRConversion`|
|`TemplateNotFoundException`|A device or FHIR destination mapping that isn't configured with the instance of the MedTech service.|`DeviceTemplateError`, `FHIRTemplateError`|Critical|`Normalization`, `FHIRConversion`|
|`CorrelationIdNotDefinedException`|The correlation ID isn't specified in the Device mapping. `CorrelationIdNotDefinedException` is a conditional error that occurs only when the FHIR Observation must group device measurements using a correlation ID because it's not configured correctly.|`DeviceMessageError`|Error|Normalization|
|`PatientDeviceMismatchException`|This error occurs when the device resource on the FHIR service has a reference to a patient resource. This error type means it doesn't match with the patient identifier present in the message.|`FHIRResourceError`|Error|`FHIRConversionError`|
|`PatientNotFoundException`|No Patient FHIR resource is referenced by the Device FHIR resource associated with the device identifier present in the device message. Note this error will only occur when the MedTech service instance is configured with the *Lookup* resolution type.|`FHIRConversionError`|Error|`FHIRConversion`|
|`DeviceNotFoundException`|No device resource exists on the FHIR service associated with the device identifier present in the device message.|`DeviceMessageError`|Error|Normalization|
|`PatientIdentityNotDefinedException`|This error occurs when expression to parse patient identifier from the device message isn't configured on the device mapping or patient identifer isn't present in the device message. Note this error occurs only when MedTech service's resolution type is set to *Create*.|`DeviceTemplateError`|Critical|Normalization|
|`DeviceIdentityNotDefinedException`|This error occurs when the expression to parse device identifier from the device message isn't configured on the device mapping or device identifer isn't present in the device message.|`DeviceTemplateError`|Critical|Normalization|
|`NotSupportedException`|Error occurred when device message with unsupported format is received.|`DeviceMessageError`|Error|Normalization|

### MedTech service resource

|Message|Displayed|Condition|Fix| 
|-------|---------|---------|---|
|The maximum number of resource type `iotconnectors` has been reached.|API and Azure portal|MedTech service subscription quota is reached (default is 10 MedTech services per workspace and 10 workspaces per subscription).|Delete one of the existing instances of the MedTech service. Use a different subscription that hasn't reached the subscription quota. Request a subscription quota increase.
|Invalid `deviceMapping` mapping. Validation errors: {List of errors}|API and Azure portal|The `properties.deviceMapping` provided in the MedTech service Resource provisioning request is invalid.|Correct the errors in the mapping JSON provided in the `properties.deviceMapping` property.
|`fullyQualifiedEventHubNamespace` is null, empty, or formatted incorrectly.|API and Azure portal|The MedTech service provisioning request `properties.ingestionEndpointConfiguration.fullyQualifiedEventHubNamespace` isn't valid.|Update the MedTech service `properties.ingestionEndpointConfiguration.fullyQualifiedEventHubNamespace` to the correct format. Should be `{YOUR_NAMESPACE}.servicebus.windows.net`.
|Ancestor resources must be fully provisioned before a child resource can be provisioned.|API|The parent workspace is still provisioning.|Wait until the parent workspace provisioning has completed and submit the provisioning request again.
|`Location` property of child resources must match the `Location` property of parent resources.|API|The MedTech service provisioning request `location` property is different from the parent workspace `location` property.|Set the `location` property of the MedTech service in the provisioning request to the same value as the parent workspace `location` property.

### Destination resource

|Message|Displayed|Condition|Fix| 
|-------|---------|---------|---|
|The maximum number of resource type `iotconnectors/destinations` has been reached.|API and Azure portal|MedTech service Destination Resource quota is reached and the default is 1 per MedTech service).|Delete the existing instance of MedTech service Destination Resource. Only one Destination Resource is permitted per MedTech service.
|The `fhirServiceResourceId` provided is invalid.|API and Azure portal|The `properties.fhirServiceResourceId` provided in the Destination Resource provisioning request isn't a valid resource ID for an instance of the Azure Health Data Services FHIR service.|Ensure the resource ID is formatted correctly, and make sure the resource ID is for an Azure Health Data Services FHIR service instance. The format should be: `/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP_NAME}/providers/Microsoft.HealthcareApis/workspaces/{workspace_NAME}/fhirservices/{FHIR_SERVICE_NAME}`
|Ancestor resources must be fully provisioned before a child resource can be provisioned.|API|The parent workspace or the parent MedTech service is still provisioning.|Wait until the parent workspace or the parent MedTech service provisioning completes, and then submit the provisioning request again.
|`Location` property of child resources must match the `Location` property of parent resources.|API|The Destination provisioning request `location` property is different from the parent MedTech service `location` property.|Set the `location` property of the Destination in the provisioning request to the same value as the parent MedTech service `location` property.

## Why is MedTech service data not showing up in the FHIR service?

|Potential issues|Fixes|
|----------------|-----|
|Data is still being processed.|Data is egressed to the FHIR service in batches (every ~5 minutes). It’s possible the data is still being processed and extra time is needed for the data to be persisted in the FHIR service.|
|Device mapping hasn't been configured.|Configure and save conforming Device mapping.|
|FHIR destination mapping hasn't been configured.|Configure and save conforming FHIR destination mapping.|
|The device message doesn't contain an expected expression defined in the Device mapping.|Verify `JsonPath` expressions defined in the Device mapping match tokens defined in the device message.|
|A Device Resource hasn't been created in the FHIR service (Resolution Type: Look up only)*.|Create a valid Device Resource in the FHIR service. Ensure the Device Resource contains an identifier that matches the device identifier provided in the incoming message.|
|A Patient Resource hasn't been created in the FHIR service (Resolution Type: Look up only)*.|Create a valid Patient Resource in the FHIR service.|
|The `Device.patient` reference isn't set, or the reference is invalid (Resolution Type: Look up only)*.|Make sure the Device Resource contains a valid [Reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient Resource.| 

*Reference [Quickstart: Deploy MedTech service using Azure portal](deploy-05-new-config.md#destination-properties) for a functional description of the MedTech service resolution types (For example: Create or Lookup).

## Next steps

In this article, you learned how to troubleshoot MedTech service error messages and conditions. To learn how to troubleshoot a MedTech service Device and FHIR destination mappings, see

> [!div class="nextstepaction"]
> [Troubleshoot MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
