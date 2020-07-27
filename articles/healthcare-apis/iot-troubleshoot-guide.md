---
title: Azure IoT Connector for FHIR (IoT Connector) - Troubleshooting guide and how-to
description: How to troubleshoot common IoT Connector error messages and conditions and copy mapping files
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: conceptual
ms.date: 07/16/2020
ms.author: jasteppe
---
# IoT Connector (preview) troubleshooting guide

This article provides steps for troubleshooting common IoT Connector (preview) error messages and conditions.  

You'll also learn how to create copies of the IoT Connector (preview) JSON-mapping files for editing and archiving outside of the Azure portal.

## Error messages and fixes

|Message   |Condition  |Fix         |
|----------|-----------|------------|
|Invalid mapping name, mapping name should be device or FHIR|Mapping type supplied isn't device or FHIR|Use one of the two supported mapping types (for example: Device or FHIR)|
|Regenerate key parameters not defined|Regenerate key request|Include the parameters in the regeneration key request|
|Reached the maximum number of IoT Connector instances that can be provisioned in this subscription|IoT Connector subscription quota reached (Default is 2 per subscription)|Delete one of the existing Connectors, use a different subscription that has not reached the (2) Connectors per subscription quota or request a subscription quota increase|
|Move resource is not supported for IoT Connector enabled Azure API for FHIR resource|Attempting to do a move operation on an Azure API for FHIR resource that has one or more IoT Connectors|Delete existing Connectors in order to perform/complete the move operation(s)|
|Azure API for FHIR resource has Private Link enabled.  Private Link is not supported with IoT Connector|Attempting to add an IoT Connector to an Azure API for FHIR resource that has private link enabled|Select or create an Azure API for FHIR resource (version R4) which does not have private link enabled|
|IoT Connector not provisioned|Attempting to use child services (connections & mappings) when parent (IoT Connector) hasn't been provisioned|Provision an IoT Connector|
|The request is not supported|Specific API request isn't supported|Use the correct API request|
|Account does not exist|Attempting to add an IoT Connector and the Azure API for FHIR resource doesn't exist|Create the Azure API for FHIR resource and then reattempt the operation|
|Azure API for FHIR resource FHIR version is not supported for IoT Connector|Attempting to use an IoT Connector with an incompatible version of the Azure API for FHIR resource|Create a new Azure API for FHIR resource (version R4) or use an existing Azure API for FHIR resource (version R4)

## Creating copies of the IoT Connector (preview) mapping files
> [!NOTE]
> JSON is the only supported format for Device and FHIR mapping files at this time.

> [!TIP]
> The copying of IoT Connector mapping files can be useful for editing and archiving outside of the Azure Portal website and  for providing to Azure Technical Support when opening a support ticket.
> 
> Learn more about the IoT Connector [Device and FHIR mapping JSON files](https://docs.microsoft.com/azure/healthcare-apis/iot-mapping-templates)

1. Select **"IoT Connector (preview)"** on the lower left side of the Azure API for FHIR resource dashboard in the **"Add-ins"** section.

   :::image type="content" source="media/iot-troubleshoot/map-files-main-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-main-with-box.png":::

2. Select the **"Connector"** that you'll be copying the mapping files from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

3. Select **"Configure device mapping"**.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-with-box.png":::

> [!NOTE]
> This process can also be used for copying/saving the contents of the **"Configure FHIR mapping"** JSON.

4. Select the contents of the JSON and do a copy operation (for example: Select Ctrl + c). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="IoT Connector" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

5. Do a paste operation (for example: Select Ctrl + v) into a new file within an editor (for example: Visual Studio Code, Notepad) and save the file with an *.json extension.

> [!TIP]
> If you'll be opening a [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the IoT Connector, make sure to include copies of your mapping files to help with the troubleshooting process.

## Next steps

Check out frequently asked questions on IoT Connector

>[!div class="nextstepaction"]
>[IoT Connector FAQs](fhir-faq.md#iot-connector-preview)


FHIR is the registered trademark of HL7 and is used with the permission of HL7.