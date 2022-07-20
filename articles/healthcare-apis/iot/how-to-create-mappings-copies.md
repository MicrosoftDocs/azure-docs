---
title: Create copies of the MedTech service device and FHIR destination mappings - Azure Health Data Services
description: This article helps users create copies of their MedTech service device and FHIR destination mappings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 07/20/2022
ms.author: jasteppe
---

# How to create copies of the MedTech service device and FHIR destination mappings

This article provides steps for creating copies of your MedTech service's device and Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings that can be used outside of Azure. These copies can be used for editing, troubleshooting, and archiving.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

> [!NOTE]
> When opening an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket for your MedTech service, include copies of your device and FHIR destination mappings to assist in the troubleshooting process.

## Copy creation process

1. Select **"MedTech service"** on the left side of your Azure Health Data Services workspace under **Services**.

   :::image type="content" source="media/iot-mappings-copies/iot-mappings-copies-select-medtech-service-in-workspace.png" alt-text="Screenshot of select MedTech service." lightbox="media/iot-mappings-copies/iot-mappings-copies-select-medtech-service-in-workspace.png":::

2. Select the name of the **MedTech service** that you'll be copying the device and FHIR destination mappings from. In this example, we'll be making copies from a MedTech service name **mt-azuredocsdemo**. You'll be selecting your MedTech service as part of this process.

   :::image type="content" source="media/iot-mappings-copies/iot-mappings-copies-select-medtech-service.png" alt-text="Screenshot of select the MedTech service that you'll be making mappings copies from." lightbox="media/iot-mappings-copies/iot-mappings-copies-select-medtech-service.png":::  

   > [!TIP]
   > This process can also be used for copying and saving the contents of the Destination (also know as the FHIR destination) mapping also under **Settings**.
   >
   > This example will be for copying and saving the device mapping for your MedTech service within Notepad

3. Select the **Device mapping** button under **Settings**.

   :::image type="content" source="media/iot-mappings-copies/iot-mappings-copies-select-device-mapping.png" alt-text="Screenshot of select Device mapping button." lightbox="media/iot-mappings-copies/iot-mappings-copies-select-device-mapping.png":::

4. Select the contents of the JSON (for example: press **Ctrl + a**) and do a copy operation (for example: press **Ctrl + c**). 

   :::image type="content" source="media/iot-mappings-copies/iot-mappings-copies-select-device-mapping-contents.png" alt-text="Screenshot of select and copy contents of the mapping." lightbox="media/iot-mappings-copies/iot-mappings-copies-select-device-mapping-contents.png":::

5. Do a paste operation (for example: Press **Ctrl + v**) into a new file within an editor application like Notepad or [Microsoft Visual Studio Code](https://code.visualstudio.com/) and do a save operation (for example: press **Ctrl + s**). For this example, we'll be using Notepad. 

   :::image type="content" source="media/iot-mappings-copies/iot-mappings-copies-save-in-notepad.png" alt-text="Screenshot of using Notepad with the device mapping copy." lightbox="media/iot-mappings-copies/iot-mappings-copies-save-in-notepad.png":::

   1. Select the folder to save the file in.
   2. Name your file.
   3. Leave the remaining fields at their defaults (for example: **Save as type** and **Encoding**) 
   4. Select the **Save** button to save your file. 

## Next steps

In this article, you learned how to make copies of the MedTech service device and FHIR destination mappings. To learn how to troubleshoot device and FHIR destination mappings, see

>[!div class="nextstepaction"]
>[Troubleshoot the MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
