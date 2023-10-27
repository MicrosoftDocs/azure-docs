---
title: How to use the MedTech service Mapping debugger - Azure Health Data Services
description: Learn how to use the MedTech service Mapping debugger.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 08/01/2023
ms.author: jasteppe
---

# How to use the MedTech service Mapping debugger

> [!IMPORTANT]
> This feature is currently in Public Preview. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn how to use the MedTech service Mapping debugger. The Mapping debugger is a self-service tool that is used for creating, updating, and troubleshooting the MedTech service [device](overview-of-device-mapping.md) and [FHIR destination](overview-of-fhir-destination-mapping.md) mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

> [!TIP]
> To learn about how the MedTech service transforms and persists device message data into the FHIR service see, [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md).

The following video presents an overview of the Mapping debugger:
>
> [!VIDEO https://youtube.com/embed/OEGuCSGnECY]

## Overview of the Mapping debugger

1. To access the MedTech service's Mapping debugger, select **Mapping debugger** within your MedTech service on the Azure portal. For this article, we're using a MedTech service named **mt-azuredocsdemo**. Select your own MedTech service. From this screen, we can see the Mapping debugger is presenting the device and FHIR destination mappings associated with this MedTech service and has provided a **Validation** of those mappings.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-main-screen.png" alt-text="Screenshot of the Mapping debugger main screen." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-main-screen.png":::

2. The Mapping debugger provides convenient features to help make the management, editing, and troubleshooting of device and FHIR destination mappings easier.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-upload-and-download.png" alt-text="Screenshot of the Mapping debugger main screen with Upload and Download buttons highlighted." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-upload-and-download.png":::

   **Upload** - With this selection, you can upload:
    * **Device mapping**: Can be edited and saved (optional) to the MedTech service.
    * **FHIR destination mapping**: Can be edited and saved (optional) to the MedTech service.
    * **Test device message**: Used by the validation service to produce a sample normalized measurement and FHIR Observation based on the supplied mappings.

   **Download** - With this selection you can download copies of:
     * **Device mapping**: The device mapping currently used by your MedTech service.
     * **FHIR destination mapping**: The FHIR destination mapping currently used by your MedTech service.
     * **Mappings**: Both mappings currently used by your MedTech service

## How to troubleshoot the device and FHIR destination mappings using the Mapping debugger

For this troubleshooting example, we're using a test device message that is [message routed](../../iot-hub/iot-hub-devguide-messages-d2c.md) through an [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md) and a [device mapping](overview-of-device-mapping.md) that uses [IotJsonPathContent templates](how-to-use-iotjsonpathcontent-templates.md).

1. If there are errors with the device or FHIR destination mappings, the Mapping debugger displays the issues. In this example, we can see that there are error *warnings* at **Line 12** in the **Device mapping** and at **Line 20** in the **FHIR destination mapping**.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-with-errors.png" alt-text="Screenshot of the Mapping debugger with device and FHIR destination mappings warnings." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-with-errors.png":::

2. If you place your mouse cursor over an error warning, the Mapping debugger provides you with more error information.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-with-error-details.png" alt-text="Screenshot of the Mapping debugger with error details for the device mappings warning." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-with-error-details.png":::

3. We've used the suggestions provided by the Mapping debugger, and the error warnings are fixed. We're ready to select **Save** to commit our updated device and FHIR destination mappings to the MedTech service.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-save-mappings.png" alt-text="Screenshot of the Mapping debugger and the Save button." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-save-mappings.png":::

   > [!NOTE]
   > The MedTech service only saves the mappings that have been changed/updated. For example: If you only made a change to the **device mapping**, only those changes are saved to your MedTech service and no changes would be saved to the **FHIR destination mapping**. This is by design and to help with performance of the MedTech service.

4. Once the device and FHIR destination mappings are successfully saved, a confirmation from **Notifications** is created within the Azure portal.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-successful-save.png" alt-text="Screenshot of the Mapping debugger and a successful the save of the device and FHIR destination mappings." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-successful-save.png":::

## View a normalized message and FHIR Observation

1. The Mapping debugger gives you the ability to view sample outputs of the normalization and FHIR transformation stages by supplying a test device message. Select **Upload** and **Test device message**.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-select-upload-and-test-device-message.png" alt-text="Screenshot of the Mapping debugger and test device message box." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-select-upload-and-test-device-message.png":::

2. The **Select a file** box opens. For this example, select **Enter manually**.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-select-test-device-message-manual.png" alt-text="Screenshot of the Mapping debugger and Select a file box." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-select-test-device-message-manual.png":::

3. Copy/paste or type the test device message into the **Upload test device message** box. The **Validation** box may still be *red* if the either of the mappings has an error/warning. As long as **No errors** is *green*, the test device message is valid with the provided device and FHIR destination mappings. 

   > [!NOTE]
   >The Mapping debugger also displays [enrichments](../../iot-hub/iot-hub-message-enrichments-overview.md) performed on the test device message if it has been [messaged routed](../../iot-hub/iot-hub-devguide-messages-d2c.md) from an [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md) (for example: the addition of the **Body**, **Properties**, and **SystemProperties** elements).   

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-input-test-device-message.png" alt-text="Screenshot of the Enter manually box with a validated test device message in the box." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-input-test-device-message.png":::

   Select the **X** in the right corner to close the **Upload test device message** box.

4. Once a valid test device message is uploaded, the **View normalized message** and **View FHIR observation** buttons become available so that you may view the sample outputs of the normalization and FHIR transformation stages. These sample outputs can be used to validate your device and FHIR destination mappings are properly configured for processing device messages according to your requirements.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-normalized-and-FHIR-selections-available.png" alt-text="Screenshot View normalized message and View FHIR observation available." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-normalized-and-FHIR-selections-available.png":::

5. Use the **X** in the corner to close the **Normalized message** and **FHIR observation** boxes.

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-normalized-message.png" alt-text="Screenshot of the normalized message." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-normalized-and-FHIR-selections-available.png":::

   :::image type="content" source="media\how-to-use-mapping-debugger\mapping-debugger-fhir-observation.png" alt-text="Screenshot of the FHIR observation available." lightbox="media\how-to-use-mapping-debugger\mapping-debugger-fhir-observation.png":::

## Next steps

In this article, you were provided with an overview and learned about how to use the Mapping debugger to edit and troubleshoot the MedTech service device and FHIR destination mappings.

For an overview of the MedTech service device mapping, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service device mapping](overview-of-device-mapping.md)

For an overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md)


For an overview of the MedTech service scenario-based mappings samples, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)


FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
 