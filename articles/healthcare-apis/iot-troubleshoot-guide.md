---
title: Azure IoT Connector for FHIR (preview) - Troubleshooting guide and how-to
description: How to troubleshoot common Azure IoT Connector for FHIR (preview) error messages and conditions and copy mapping files
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: conceptual
ms.date: 08/03/2020
ms.author: jasteppe
---
# Azure IoT Connector for FHIR (preview) troubleshooting guide

This article provides steps for troubleshooting common Azure IoT Connector for FHIR* error messages and conditions.  

You'll also learn how to create copies of the Azure IoT Connector for FHIR JSON-mapping files for editing and archiving outside of the Azure portal or for providing to Azure Technical Support when opening a support ticket. 

## Error messages and fixes

|Message   |Condition  |Fix         |
|----------|-----------|------------|
|Invalid mapping name, mapping name should be device or FHIR|Mapping type supplied isn't device or FHIR|Use one of the two supported mapping types (for example: Device or FHIR)|
|Regenerate key parameters not defined|Regenerate key request|Include the parameters in the regeneration key request|
|Reached the maximum number of IoT Connector* instances that can be provisioned in this subscription|Azure IoT Connector for FHIR subscription quota reached (Default is (2) per subscription)|Delete one of the existing instances of Azure IoT Connector for FHIR, use a different subscription that has not reached the subscription quota or request a subscription quota increase|
|Move resource is not supported for IoT Connector enabled Azure API for FHIR resource|Attempting to do a move operation on an Azure API for FHIR resource that has one or more instances of the Azure IoT Connector for FHIR|Delete existing instance(s) of Azure IoT Connector for FHIR to perform and complete the move operation|
|IoT Connector not provisioned|Attempting to use child services (connections & mappings) when parent (Azure IoT Connector for FHIR) hasn't been provisioned|Provision an Azure IoT Connector for FHIR|
|The request is not supported|Specific API request isn't supported|Use the correct API request|
|Account does not exist|Attempting to add an Azure IoT Connector for FHIR and the Azure API for FHIR resource doesn't exist|Create the Azure API for FHIR resource and then reattempt the operation|
|Azure API for FHIR resource FHIR version is not supported for IoT Connector|Attempting to use an Azure IoT Connector for FHIR with an incompatible version of the Azure API for FHIR resource|Create a new Azure API for FHIR resource (version R4) or use an existing Azure API for FHIR resource (version R4)

## Creating copies of the Azure IoT Connector for FHIR (preview) mapping files
The copying of Azure IoT Connector for FHIR mapping files can be useful for editing and archiving outside of the Azure portal website and for providing to Azure Technical Support when opening a support ticket.

> [!NOTE]
> JSON is the only supported format for Device and FHIR mapping files at this time.

> [!TIP]
> Learn more about the Azure IoT Connector for FHIR [Device and FHIR mapping JSON files](https://docs.microsoft.com/azure/healthcare-apis/iot-mapping-templates)

1. Select **"IoT Connector (preview)"** on the lower left side of the Azure API for FHIR resource dashboard in the **"Add-ins"** section.

   :::image type="content" source="media/iot-troubleshoot/map-files-main-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-main-with-box.png":::

2. Select the **"Connector"** that you'll be copying the mapping files from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

> [!NOTE]
> This process may also be used for copying and saving the contents of the **"Configure FHIR mapping"** JSON.

3. Select **"Configure device mapping"**.

    :::image type="content" source="media/iot-troubleshoot/map-files-select-device-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-with-box.png":::

4. Select the contents of the JSON and do a copy operation (for example: Select Ctrl + c). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

5. Do a paste operation (for example: Select Ctrl + v) into a new file within an editor (for example: Visual Studio Code, Notepad) and save the file with an *.json extension.

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the Azure IoT Connector for FHIR, make sure to include copies of your mapping files to help with the troubleshooting process.

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](fhir-faq.md#azure-iot-connector-for-fhir-preview)

*In the Azure portal, the Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

FHIR is the registered trademark of HL7 and is used with the permission of HL7.