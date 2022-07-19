---
title: Create copies of the MedTech service device and FHIR destination mappings - Azure Health Data Services
description: This article helps users create copies of their MedTech service device and FHIR destination mappings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 07/19/2022
ms.author: jasteppe
---

# How to create copies of device and FHIR destination mappings

This article provides steps for creating copies of your MedTech service's device and Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings that can be used outside of Azure. These copies can be used for editing, troubleshooting, and archiving.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

> [!NOTE]
> When opening an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for the MedTech service, include copies of your device and FHIR destination mappings to assist in the troubleshooting process.

## Copy creation process

1. Select **"MedTech service"** on the left side of the Azure Health Data Services workspace.

   :::image type="content" source="media/iot-troubleshoot/iot-connector-blade.png" alt-text="Screenshot of select MedTech service." lightbox="media/iot-troubleshoot/iot-connector-blade.png":::

2. Select the name of the **MedTech service** that you'll be copying the device and FHIR destination mappings from.

   :::image type="content" source="media/iot-troubleshoot/map-files-select-connector-with-box.png" alt-text="Screenshoot of select the MedTech service that you will be making mappings copies from" lightbox="media/iot-troubleshoot/map-files-select-connector-with-box.png":::

   > [!NOTE]
   > This process may also be used for copying and saving the contents of the **"Destination"** FHIR destination mapping.

3. Select the contents of the JSON and do a copy operation (for example: Press **Ctrl + C**). 

   :::image type="content" source="media/iot-troubleshoot/map-files-select-device-json-with-box.png" alt-text="Screenshot of select and copy contents of the mapping" lightbox="media/iot-troubleshoot/map-files-select-device-json-with-box.png":::

4. Do a paste operation (for example: Press **Ctrl + V**) into a new file within an editor like Microsoft Visual Studio Code or Notepad. Make sure to save the file with the **.json** extension.

## Next steps

In this article, you learned how to make copies of the MedTech service device and FHIR destination mappings. To learn how to troubleshoot device and FHIR destination mappings, see

>[!div class="nextstepaction"]
>[Troubleshoot the MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
