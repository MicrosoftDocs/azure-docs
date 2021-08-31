---
title: IoT Connector for FHIR (preview)
description: How to troubleshoot common Azure IoT Connector for FHIR (preview) error messages and conditions and copying mapping files
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 11/13/2020
ms.author: jasteppe
---
# IoT Connector for FHIR (preview) troubleshooting guide

This article provides steps for troubleshooting common Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;)* error messages and conditions.  

You'll also learn how to create copies of the Azure IoT Connector for FHIR conversion mappings JSON (for example: Device and FHIR).  

You can use the conversion mapping JSON copies for editing and archiving outside of the Azure portal.  

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

## Device and FHIR Conversion Mapping JSON Template Validations for Azure IoT Connector for FHIR (preview)
In this section, you'll learn about the validation process that Azure IoT Connector for FHIR performs to validate the Device and FHIR conversion mapping JSON templates before allowing them to be saved for use.  These elements are required in the Device and FHIR Conversion Mapping JSON.

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

|Message|Displayed|Condition|Fix| 
|-------|---------|---------|---|
|Invalid mapping name, mapping name should be device or FHIR.|API|Mapping type supplied isn't device or FHIR.|Use one of the two supported mapping types (for example: Device or FHIR).|
|Validation failed. Required information is missing or not valid.|API and Azure portal|Attempting to save a conversion mapping missing needed information or element.|Add missing conversion mapping information or element and attempt to save the conversion mapping again.|
|Regenerate key parameters not defined.|API|Regenerate key request.|Include the parameters in the regeneration key request.|
|Reached the maximum number of IoT Connector instances that can be provisioned in this subscription.|API and Azure portal|Azure IoT Connector for FHIR subscription quota reached (Default is (2) per subscription).|Delete one of the existing instances of Azure IoT Connector for FHIR.  Use a different subscription that hasn't reached the subscription quota.  Request a subscription quota increase.|
|Move resource is not supported for IoT Connector enabled Azure API for FHIR resource.|API and Azure portal|Attempting to do a move operation on an Azure API for FHIR resource that has one or more instances of the Azure IoT Connector for FHIR.|Delete existing instance(s) of Azure IoT Connector for FHIR to do the move operation.|
|IoT Connector not provisioned.|API|Attempting to use child services (connections & mappings) when parent (Azure IoT Connector for FHIR) hasn't been provisioned.|Provision an Azure IoT Connector for FHIR.|
|The request is not supported.|API|Specific API request isn't supported.|Use the correct API request.|
|Account does not exist.|API|Attempting to add an Azure IoT Connector for FHIR and the Azure API for FHIR resource doesn't exist.|Create the Azure API for FHIR resource and then reattempt the operation.|
|Azure API for FHIR resource FHIR version is not supported for IoT Connector.|API|Attempting to use an Azure IoT Connector for FHIR with an incompatible version of the Azure API for FHIR resource.|Create a new Azure API for FHIR resource (version R4) or use an existing Azure API for FHIR resource (version R4).

## Why is my Azure IoT Connector for FHIR (preview) data not showing up in Azure API for FHIR?

|Potential issues|Fixes|
|----------------|-----|
|Data is still being processed.|Data is egressed to the Azure API for FHIR in batches (every ~15 minutes).  It’s possible the data is still being processed and additional time is needed for the data to be persisted in the Azure API for FHIR.|
|Device conversion mapping JSON hasn't been configured.|Configure and save conforming device conversion mapping JSON.|
|FHIR conversion mapping JSON has not been configured.|Configure and save conforming FHIR conversion mapping JSON.|
|The device message doesn't contain an expected expression defined in the device mapping.|Verify JsonPath expressions defined in the device mapping match tokens defined in the device message.|
|A Device Resource hasn't been created in the Azure API for FHIR (Resolution Type: Lookup only)*.|Create a valid Device Resource in the Azure API for FHIR. Be sure the Device Resource contains an Identifier that matches the device identifier provided in the incoming message.|
|A Patient Resource has not been created in the Azure API for FHIR (Resolution Type: Lookup only)*.|Create a valid Patient Resource in the Azure API for FHIR.|
|The Device.patient reference isn't set, or the reference is invalid (Resolution Type: Lookup only)*.|Make sure the Device Resource contains a valid [Reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient Resource.| 

*Reference [Quickstart: Deploy Azure IoT Connector (preview) using Azure portal](iot-fhir-portal-quickstart.md#create-new-azure-iot-connector-for-fhir-preview) for a functional description of the Azure IoT Connector for FHIR resolution types (For example: Lookup or Create).

## Use Metrics to troubleshoot issues in Azure IoT Connector for FHIR (preview)

Azure IoT Connector for FHIR generates multiple metrics to provide insights into the data flow process. One of the supported metrics is called *Total Errors*, which provides the count for all errors that occur within an instance of Azure IoT Connector for FHIR.

Each error gets logged with a number of associated properties. Every property provides a different aspect about the error, which could help you to identify and troubleshoot issues. This section lists different properties captured for each error in the *Total Errors* metric, and possible values for these properties.

> [!NOTE]
> You can navigate to the *Total Errors* metric for an instance of Azure IoT Connector for FHIR (preview) as described on the [Azure IoT Connector for FHIR (preview) Metrics page](iot-metrics-display.md).

Click on the *Total Errors* graph and then click on *Add filter* button to slice and dice the error metric using any of the properties mentioned below.

### The operation performed by the Azure IoT Connector for FHIR (preview)

This property represents the operation being performed by IoT Connector when the error has occurred. An operation generally represents the data flow stage while processing a device message. Here is the list of possible values for this property.

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

This property represents the severity of the occurred error. Here is the list of possible values for this property.

|Severity|Description|
|---------------|-----------|
|Warning|Some minor issue exists in the data flow process, but processing of the device message doesn't stop|
|Error|Processing of a specific device message has run into an error and other messages may continue to execute as expected|
|Critical|Some system level issue exists with the IoT Connector and no messages are expected to process|

### The type of the error

This property signifies a category for a given error, which basically represents a logical grouping for similar type of errors. Here is the list of possible value for this property.

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
|MultipleResourceFoundException|Error occurred when multiple patient or device resources are found in the FHIR server for respective identifiers present in the device message|FHIRResourceError|Error|FHIRConversion|
|TemplateNotFoundException|A device or FHIR mapping template isn't configured with the instance of IoT Connector|DeviceTemplateError, FHIRTemplateError|Critical|Normalization, FHIRConversion|
|CorrelationIdNotDefinedException|Correlation ID isn't specified in the device mapping template. CorrelationIdNotDefinedException is a conditional error that would occur only when FHIR Observation must group device measurements using a correlation ID but it's not configured correctly|DeviceMessageError|Error|Normalization|
|PatientDeviceMismatchException|This error occurs when the device resource on the FHIR server has a reference to a patient resource, which doesn't match with the patient identifier present in the message|FHIRResourceError|Error|FHIRConversionError|
|PatientNotFoundException|No Patient FHIR resource is referenced by the Device FHIR resource associated with the device identifier present in the device message. Note this error will only occur when IoT Connector instance is configured with *Lookup* resolution type|FHIRConversionError|Error|FHIRConversion|
|DeviceNotFoundException|No device resource exists on the FHIR Server associated with the device identifier present in the device message|DeviceMessageError|Error|Normalization|
|PatientIdentityNotDefinedException|This error occurs when expression to parse patient identifier from the device message isn't configured on the device mapping template or patient identifer isn't present in the device message. Note this error occurs only when IoT Connector's resolution type is set to *Create*|DeviceTemplateError|Critical|Normalization|
|DeviceIdentityNotDefinedException|This error occurs when expression to parse device identifier from the device message isn't configured on the device mapping template or device identifer isn't present in the device message|DeviceTemplateError|Critical|Normalization|
|NotSupportedException|Error occurred when device message with unsupported format is received|DeviceMessageError|Error|Normalization|

## Creating copies of the Azure IoT Connector for FHIR (preview) conversion mapping JSON

The copying of Azure IoT Connector for FHIR mapping files can be useful for editing and archiving outside of the Azure portal website.

The mapping file copies should be provided to Azure Technical Support when opening a support ticket to assist in troubleshooting.

> [!NOTE]
> JSON is the only supported format for Device and FHIR mapping files at this time.

> [!TIP]
> Learn more about the Azure IoT Connector for FHIR [Device and FHIR conversion mapping JSON](iot-mapping-templates.md)

1. Select **"IoT Connector (preview)"** on the lower left side of the Azure API for FHIR resource dashboard in the **"Add-ins"** section.

   :::image type="content" source="media/iot-troubleshoot/map-files-main-with-box.png" alt-text="IoT Connector1" lightbox="media/iot-troubleshoot/map-files-main-with-box.png":::

2. Select the **"Connector"** that you'll be copying the conversion mapping JSON from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="IoT Connector2" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

> [!NOTE]
> This process may also be used for copying and saving the contents of the **"Configure FHIR mapping"** JSON.

3. Select **"Configure device mapping"**.

    :::image type="content" source="media/iot-troubleshoot/map-files-select-device-with-box.png" alt-text="IoT Connector3" lightbox="media/iot-troubleshoot/map-files-select-device-with-box.png":::

4. Select the contents of the JSON and do a copy operation (for example: Select Ctrl + c). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="IoT Connector4" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

5. Do a paste operation (for example: Select Ctrl + v) into a new file within an editor (for example: Visual Studio Code, Notepad) and save the file with an *.json extension.

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](fhir-faq.yml)

*In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview). FHIR is a registered trademark of HL7 and is used with the permission of HL7.