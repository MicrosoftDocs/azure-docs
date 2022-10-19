---
title: Determine your update strategy for Azure Percept DK
description: Pros and cons of Azure Percept DK OTA or USB cable updates. Recommendation for choosing the best update approach for different users. 
author: yvonne-dq
ms.author: hschang
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/04/2022
ms.custom: template-concept
---

# Determine your update strategy for Azure Percept DK

[!INCLUDE [Retirement note](./includes/retire.md)]


>[!CAUTION]
>**The OTA update on Azure Percept DK is no longer supported. For information on how to proceed, please visit [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md).**

To keep your Azure Percept DK software update-to-date, Microsoft offers two update methods for the dev kit. **Update over USB cable** or **Over-the-air (OTA) update**.

Update over USB cable does a clean install to the dev kit. Existing configurations and all the user data in each partition will be wiped out after the new image is deployed. To do that, connect the dev kit to a host system with a type-c USB cable. The host system can be a Windows/Linux machine.  You can also use this update method as the factory reset. To do that, redeployed the exact same version to the dev kit. Refer to [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md) for detail about the USB cable update.

The OTA update is built on top of the [Device Update for IoT Hub](../iot-hub-device-update/device-update-resources.md) Azure service. Connect the dev kit to Azure IoT Hub to do this type of update. Configurations and user data will be preserved after the OTA update. Refer to [Update your Azure Percept DK over-the-air (OTA)](./how-to-update-over-the-air.md) for detail about doing the OTA update.

Check the pros and cons for both USB cable update and OTA update, then follow the Microsoft recommendations for different scenarios.

## USB cable update

- Pros
  - You don't need to connect the dev kit to internet/Azure.
  - Latest image is always applicable no matter what version of software and firmware are currently loaded on the dev kit.
- Cons
  - Reimages the device and will remove configurations, and user data.
  - Need to rerun OOBE and download any non-preloaded container.
  - Cannot be performed remotely.

## OTA update

- Pros
  - Preserves user data, configurations, and downloaded containers. Dev kit will keep working as it was after the OTA.
  - Update can be performed remotely.
  - Several similar devices can be updated at the same time. Updates can also be schedule to happen, for example during night-time.
- Cons
  - There may be hard-stop version(s) that cannot be skipped. Refer to [Hard-Stop Version of OTA](./software-releases-over-the-air-updates.md#hard-stop-version-of-ota).
  - The device needs to connect to a IoT Hub, which has been properly configured the “Device Update for IoT Hub” feature.
  - It won't work well for downgrade.

> [!IMPORTANT]
> Device Update for IoT Hub does not block deployment of image with version that is older than the currently running OS. However doing so to dev kit will result in loss of data and functionality.

## Microsoft recommendations

|Type|Scenario|Update Method|
|:---:|---|:---:|
|Production|Keep dev kit up to date for latest fix and security patch while it's already running your solution or deployed to the field.|OTA|
|Production/Develop|Unboxing a new dev kit and update it to the latest software.|USB|
|Production/Develop|Want to update to the latest software version while have already skipped several monthly releases.|USB|
|Production/Develop|Factory rest a dev kit.|USB|
|Develop|During solution development, want to keep the dev kit OS and F/W up to date.|USB/OTA|
|Develop|Jump to any specific (older) version for issue investigation/debugging.|USB|

## Next steps

After deciding the update method of choice, visit the following pages for getting ready to do update:

USB cable update

- [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md)
- [Azure Percept DK software releases for USB cable update](./software-releases-usb-cable-updates.md)

OTA

- [Update your Azure Percept DK over-the-air (OTA)](./how-to-update-over-the-air.md)
- [Azure Percept DK software releases for OTA update](./software-releases-over-the-air-updates.md)
