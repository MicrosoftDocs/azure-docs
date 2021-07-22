---
title: Azure IoT Connector for FHIR (preview) - Troubleshooting guide and how-to
description: How to troubleshoot common Azure IoT Connector for FHIR (preview) error messages and conditions and copying mapping files
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 07/20/2021
ms.author: jasteppe
---
# Azure IoT Connector for FHIR (preview) troubleshooting guide

This article provides steps for troubleshooting common Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;)* error messages and conditions.  

You'll also learn how to create copies of the Azure IoT Connector for FHIR conversion mappings JSON (for example: Device and FHIR).  

You can use the conversion mapping JSON copies for editing and archiving outside of the Azure portal.  

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

## Device and FHIR conversion mapping JSON template validations for Azure IoT Connector for FHIR (preview)
This section describes the validation process that the Azure IoT Connector for FHIR (preview) performs. This validation process validates the device and FHIR conversion mapping JSON templates before allowing them to be saved for use. These elements are required in the device and FHIR conversion mapping JSON.

**Device Mapping**

|Element|Required|
|:-------|:------|
|TypeName|True|
|TypeMatchExpression|True|
|DeviceIdExpression|True|
|TimestampExpression|True|
|Values[].ValueName|True|
|Values[].ValueExpression|True|

> [!NOTE]
> Values[].ValueName and Values[].ValueExpression
>
> These elements are only required if you have a value entry in the array - it is valid to have no values mapped. This is used when the telemetry being sent is an event. For example: When a wearable IoMT device is put on or removed. The element(s) do not have any values except for a name that Azure IoT Connector for FHIR  matches and emits. On the FHIR conversion, Azure IoT Connector for FHIR maps it to a code-able concept based on the semantic type - no actual values are populated.

**FHIR Mapping**

|Element|Required|
|:------|:-------|
|TypeName|True|

> [!NOTE]
> This is the only required FHIR Mapping element validated at this time.

## Error messages and fixes for Azure IoT Connector for FHIR (preview)

### IoT Connector Resource

|Message|Displayed|Condition|Fix| 
|-------|---------|---------|---|
|The maximum number of resource type `iotconnectors` has been reached.|API and Azure portal|Azure IoT Connector for FHIR subscription quota reached (Default is (25) per subscription).|Delete one of the existing instances of Azure IoT Connector for FHIR. Use a different subscription that hasn't reached the subscription quota. Request a subscription quota increase.
|Invalid `deviceMapping` mapping. Validation errors: {List of errors}|API and Azure portal|The `properties.deviceMapping` provided in the IoT Connector Resource provisioning request is invalid.|Correct the errors in the mapping JSON provided in the `properties.deviceMapping` property.
|`fullyQualifiedEventHubNamespace` is null, empty, or formatted incorrectly.|API and Azure portal|The IoT Connector provisioning request `properties.ingestionEndpointConfiguration.fullyQualifiedEventHubNamespace` is not valid.|Update the IoT Connector `properties.ingestionEndpointConfiguration.fullyQualifiedEventHubNamespace` to the correct format. Should be `{YOUR_NAMESPACE}.servicebus.windows.net`.
|Ancestor resources must be fully provisioned before a child resource can be provisioned.|API|The parent Workspace is still provisioning.|Wait until the parent workspace provisioning has completed and submit the provisioning request again.
|`Location` property of child resources must match the `Location` property of parent resources.|API|The IoT Connector provisioning request `location` property is different from the parent Workspace `location` property.|Set the `location` property of the IoT Connector in the provisioning request to the same value as the parent Workspace `location` property.

### Destination Resource

|Message|Displayed|Condition|Fix| 
|-------|---------|---------|---|
|The maximum number of resource type `iotconnectors/destinations` has been reached.|API and Azure portal|IoT Connector Destination Resource quota reached (Default is (1) per IoT Connector).|Delete the existing instance of IoT Connector Destination. Only 1 Destination is permitted per IoT Connector.
|The `fhirServiceResourceId` provided is invalid.|API and Azure portal|The `properties.fhirServiceResourceId` provided in the Destination Resource provisioning request is not a valid resource ID for an instance of Azure API for FHIR.|Make sure the resource ID is formatted correctly, and make sure the resource ID is for an Azure API for FHIR instance. The format should be: `/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP_NAME}/providers/Microsoft.HealthcareApis/services/{FHIR_SERVER_NAME} or /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP_NAME}/providers/Microsoft.HealthcareApis/workspaces/{WORKSPACE_NAME}/`
|Ancestor resources must be fully provisioned before a child resource can be provisioned.|API|The parent Workspace or the parent IoT Connector is still provisioning.|Wait until the parent Workspace or the parent IoT Connector provisioning has completed and submit the provisioning request again.
|`Location` property of child resources must match the `Location` property of parent resources.|API|The Destination provisioning request `location` property is different from the parent IoT Connector `location` property.|Set the `location` property of the Destination in the provisioning request to the same value as the parent IoT Connector `location` property.

## Why is my Azure IoT Connector for FHIR (preview) data not showing up in FHIR service?

|Potential issues|Fixes|
|----------------|-----|
|Data is still being processed.|Data is egressed to the FHIR service in batches (every ~15 minutes).  It’s possible the data is still being processed and extra time is needed for the data to be persisted in the FHIR service.|
|Device conversion mapping JSON hasn't been configured.|Configure and save conforming device conversion mapping JSON.|
|FHIR conversion mapping JSON hasn't been configured.|Configure and save conforming FHIR conversion mapping JSON.|
|The device message doesn't contain an expected expression defined in the device mapping.|Verify JsonPath expressions defined in the device mapping match tokens defined in the device message.|
|A Device Resource hasn't been created in the FHIR service (Resolution Type: Lookup only)*.|Create a valid Device Resource in the FHIR service. Be sure the Device Resource contains an Identifier that matches the device identifier provided in the incoming message.|
|A Patient Resource hasn't been created in the FHIR service (Resolution Type: Lookup only)*.|Create a valid Patient Resource in the FHIR service.|
|The Device.patient reference isn't set, or the reference is invalid (Resolution Type: Lookup only)*.|Make sure the Device Resource contains a valid [Reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient Resource.| 

*Reference [Quickstart: Deploy Azure IoT Connector (preview) using Azure portal](deploy-iot-connector-in-azure.md) for a functional description of the Azure IoT Connector for FHIR resolution types (For example: Lookup or Create).

### The operation performed by the Azure IoT Connector for FHIR (preview)

This property represents the operation being performed by the IoT Connector when the error has occurred. An operation generally represents the data flow stage while processing a device message. Here's the list of possible values for this property.

> [!NOTE]
> You can read more about different stages of data flow in Azure IoT Connector for FHIR (preview) [here](iot-data-flow.md).

|Data flow stage|Description|
|---------------|-----------|
|Setup|Operation specific to setting up your instance of IoT Connector|
|Normalization|Data flow stage where device data gets normalized|
|Grouping|Data flow stage where normalized data gets grouped|
|FHIRConversion|Data flow stage where grouped-normalized data is transformed into a FHIR resource|
|Unknown|The operation type is unknown when error occurred|

### The severity of the error

This property represents the severity of the occurred error. Here's the list of possible values for this property.

|Severity|Description|
|---------------|-----------|
|Warning|Some minor issue exists in the data flow process, but processing of the device message doesn't stop|
|Error|Processing of a specific device message has run into an error and other messages may continue to execute as expected|
|Critical|Some system level issue exists with the IoT Connector and no messages are expected to process|

### The type of the error

This property signifies a category for a given error, which it basically represents a logical grouping for similar types of errors. Here's the list of possible values for this property.

|Error type|Description|
|----------|-----------|
|DeviceTemplateError|Errors related to device mapping templates|
|DeviceMessageError|Errors occurred when processing a specific device message|
|FHIRTemplateError|Errors related to FHIR mapping templates|
|FHIRConversionError|Errors occurred when transforming a message into a FHIR resource|
|FHIRResourceError|Errors related to existing resources in the FHIR server that are referenced by IoT Connector|
|FHIRServerError|Errors that occur when communicating with FHIR server|
|GeneralError|All other types of errors|

### The name of the error

This property provides the name for a specific error. Here is the list of all error names with their description and associated error type(s), severity, and data flow stage(s).

|Error name|Description|Error type(s)|Error severity|Data flow stage(s)|
|----------|-----------|-------------|--------------|------------------|
|MultipleResourceFoundException|Error occurred when multiple patient or device resources are found in the FHIR server for respective identifiers present in the device message.|FHIRResourceError|Error|FHIRConversion|
|TemplateNotFoundException|A device or FHIR mapping template isn't configured with the instance of IoT Connector.|DeviceTemplateError, FHIRTemplateError|Critical|Normalization, FHIRConversion|
|CorrelationIdNotDefinedException|Correlation ID isn't specified in the device mapping template. CorrelationIdNotDefinedException is a conditional error that occurs only when the FHIR Observation must group device measurements using a correlation ID, but it's not configured correctly.|DeviceMessageError|Error|Normalization|
|PatientDeviceMismatchException|This error occurs when the device resource on the FHIR server has a reference to a patient resource, which it doesn't match with the patient identifier present in the message.|FHIRResourceError|Error|FHIRConversionError|
|PatientNotFoundException|No Patient FHIR resource is referenced by the Device FHIR resource associated with the device identifier present in the device message. Note this error will only occur when the IoT Connector instance is configured with the *Lookup* resolution type.|FHIRConversionError|Error|FHIRConversion|
|DeviceNotFoundException|No device resource exists on the FHIR Server associated with the device identifier present in the device message.|DeviceMessageError|Error|Normalization|
|PatientIdentityNotDefinedException|This error occurs when expression to parse patient identifier from the device message isn't configured on the device mapping template or patient identifer isn't present in the device message. Note this error occurs only when IoT Connector's resolution type is set to *Create*.|DeviceTemplateError|Critical|Normalization|
|DeviceIdentityNotDefinedException|This error occurs when the expression to parse device identifier from the device message isn't configured on the device mapping template or device identifer isn't present in the device message.|DeviceTemplateError|Critical|Normalization|
|NotSupportedException|Error occurred when device message with unsupported format is received.|DeviceMessageError|Error|Normalization|

## Creating copies of the Azure IoT Connector for FHIR (preview) conversion mapping JSON

The copying of Azure IoT Connector for FHIR mapping files can be useful for editing and archiving outside of the Azure portal website.

The mapping file copies should be provided to Azure Technical Support when opening a support ticket to help troubleshooting.

> [!NOTE]
> JSON is the only supported format for Device and FHIR mapping files at this time.

> [!TIP]
> Learn more about the Azure IoT Connector for FHIR [Device and FHIR conversion mapping JSON](how-to-use-fhir-mapping-iot.md)

1. Select the **"IoT Connector (preview)"** blade on the left side of the Azure Healthcare APIs Workspace.

   :::image type="content" source="media/iot-troubleshoot/iot-connector-blade.png" alt-text="Select IoT Connector blade." lightbox="media/iot-troubleshoot/iot-connector-blade.png":::

2. Select the name of **IoT Connector** that you'll be copying the conversion mapping JSON from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="IoT Connector2" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

> [!NOTE]
> This process may also be used for copying and saving the contents of the **"Configure FHIR mapping"** JSON.

3. Select the contents of the JSON and do a copy operation (for example: Press **Ctrl + C**). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="IoT Connector4" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

4. Do a paste operation (for example: Press **Ctrl + V**) into a new file within an editor like Microsoft Visual Studio Code or Notepad. Ensure to save the file with the extension **.json**.

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](iot-faq.md)

*In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview). FHIR is a registered trademark of HL7 and is used with the permission of HL7.
