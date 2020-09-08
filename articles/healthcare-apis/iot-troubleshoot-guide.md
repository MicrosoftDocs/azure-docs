---
title: Azure IoT Connector for FHIR (preview) - Troubleshooting guide and how-to
description: How to troubleshoot common Azure IoT Connector for FHIR (preview) error messages and conditions and copying mapping files
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 08/07/2020
ms.author: jasteppe
---
# Azure IoT Connector for FHIR (preview) troubleshooting guide

This article provides steps for troubleshooting common Azure IoT Connector for FHIR* error messages and conditions.  

You'll also learn how to create copies of the Azure IoT Connector for FHIR conversion mappings JSON (for example: Device and FHIR).  

You can use the conversion mapping JSON copies for editing and archiving outside of the Azure portal.  

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

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

##  Why is my Azure IoT Connector for FHIR (preview) data not showing up in Azure API for FHIR?

|Potential issues  |Fixes            |
|------------------|-----------------|
|Data is still being processed.|Data is egressed to the Azure API for FHIR in batches (every ~15 minutes).  It’s possible the data is still being processed and additional time is needed for the data to be persisted in the Azure API for FHIR.|
|Device conversion mapping JSON hasn't been configured.|Configure and save conforming device conversion mapping JSON.|
|FHIR conversion mapping JSON has not been configured.|Configure and save conforming FHIR conversion mapping JSON.|
|The device message doesn't contain an expected expression defined in the device mapping.|Verify JsonPath expressions defined in the device mapping match tokens defined in the device message.|
|A Device Resource hasn't been created in the Azure API for FHIR (Resolution Type: Lookup only)*.|Create a valid Device Resource in the Azure API for FHIR. Be sure the Device Resource contains an Identifier that matches the device identifier provided in the incoming message.|
|A Patient Resource has not been created in the Azure API for FHIR (Resolution Type: Lookup only)*.|Create a valid Patient Resource in the Azure API for FHIR.|
|The Device.patient reference isn't set, or the reference is invalid (Resolution Type: Lookup only)*.|Make sure the Device Resource contains a valid [Reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient Resource.| 

*Reference [Quickstart: Deploy Azure IoT Connector (preview) using Azure portal](iot-fhir-portal-quickstart.md#create-new-azure-iot-connector-for-fhir-preview) for a functional description of the Azure IoT Connector for FHIR resolution types (For example: Lookup or Create).

## Creating copies of the Azure IoT Connector for FHIR (preview) conversion mapping JSON
The copying of Azure IoT Connector for FHIR mapping files can be useful for editing and archiving outside of the Azure portal website.

The mapping file copies should be provided to Azure Technical Support when opening a support ticket to assist in troubleshooting.

> [!NOTE]
> JSON is the only supported format for Device and FHIR mapping files at this time.

> [!TIP]
> Learn more about the Azure IoT Connector for FHIR [Device and FHIR conversion mapping JSON](https://docs.microsoft.com/azure/healthcare-apis/iot-mapping-templates)

1. Select **"IoT Connector (preview)"** on the lower left side of the Azure API for FHIR resource dashboard in the **"Add-ins"** section.

   :::image type="content" source="media/iot-troubleshoot/map-files-main-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-main-with-box.png":::

2. Select the **"Connector"** that you'll be copying the conversion mapping JSON from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

> [!NOTE]
> This process may also be used for copying and saving the contents of the **"Configure FHIR mapping"** JSON.

3. Select **"Configure device mapping"**.

    :::image type="content" source="media/iot-troubleshoot/map-files-select-device-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-with-box.png":::

4. Select the contents of the JSON and do a copy operation (for example: Select Ctrl + c). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

5. Do a paste operation (for example: Select Ctrl + v) into a new file within an editor (for example: Visual Studio Code, Notepad) and save the file with an *.json extension.

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your conversion mapping JSON to help with the troubleshooting process.

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](fhir-faq.md#azure-iot-connector-for-fhir-preview)

*In the Azure portal, the Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

FHIR is the registered trademark of HL7 and is used with the permission of HL7.
