---
title: Use the Azure portal to configure file upload | Microsoft Docs
description: How to use the Azure portal to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 915f1597-272d-4fd4-8c5b-a0ccb1df0d91
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2017
ms.author: dobett

---
# Configure IoT Hub file uploads using the Azure portal

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

## File upload

To use the [file upload functionality in IoT Hub][lnk-upload], you must first associate an Azure Storage account with your hub. Select the **File upload** settings to display a list of file upload properties for the IoT hub that is being modified.

![View IoT Hub file upload settings in the portal][13]

**Storage container**: Use the Azure portal to select a blob container in an Azure Storage account in your current Azure subscription to associate with your IoT Hub. If necessary, you can create an Azure Storage account on the **Storage accounts** blade and blob container on the **Containers** blade. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

![View storage containers for file upload in the portal][14]

**Receive notifications for uploaded files**: Enable or disable file upload notifications via the toggle.

**SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default but can be customized to other values using the slider.

**File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default but can be customized to other values using the slider.

**File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default but can be customized to other values using the slider.

![Configure IoT Hub file upload in the portal][15]

## Next steps

For more information about the file upload capabilities of IoT Hub, see [Upload files from a device][lnk-upload] in the IoT Hub developer guide.

Follow these links to learn more about managing Azure IoT Hub:

* [Bulk manage IoT devices][lnk-bulk]
* [IoT Hub metrics][lnk-metrics]
* [Operations monitoring][lnk-monitor]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with the IoT Gateway SDK][lnk-gateway]
* [Secure your IoT solution from the ground up][lnk-securing]

[13]: ./media/iot-hub-configure-file-upload/file-upload-settings.png
[14]: ./media/iot-hub-configure-file-upload/file-upload-container-selection.png
[15]: ./media/iot-hub-configure-file-upload/file-upload-selected-container.png

[lnk-upload]: iot-hub-devguide-file-upload.md

[lnk-bulk]: iot-hub-bulk-identity-mgmt.md
[lnk-metrics]: iot-hub-metrics.md
[lnk-monitor]: iot-hub-operations-monitoring.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-securing]: iot-hub-security-ground-up.md
