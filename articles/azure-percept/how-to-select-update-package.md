---
title: Select your Azure Percept DK update package
description: How to identify your Azure Percept DK version and select the best update package for it 
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 07/23/2021
ms.custom: template-how-to
---

# How to determine and download the best update package for OTA and USB updates

This page provides guidance on how to select the update package that is best for your dev kit and the download locations for the update packages.

For more information on how to update your device, see these articles:
- [Update your Azure Percept DK over-the-air](./how-to-update-over-the-air.md)
- [Update your Azure Percept DK via USB](./how-to-update-via-usb.md)


## Prerequisites

- An [Azure Percept DK](https://go.microsoft.com/fwlink/?linkid=2155270) that has been [set up and connected to Azure Percept Studio and IoT Hub](./quickstart-percept-dk-set-up.md).

## Identify the model name and software version of your dev kit
To ensure you apply the correct update package to your dev kit, you must first determine which software version it's currently running.

> [!WARNING]
> Applying the incorrect update package could result in your dev kit becoming inoperable. It is important that you follow these steps to ensure you apply the correct update package.

Option 1:
1. Log in to the [Azure Percept Studio](./overview-azure-percept-studio.md).
2. In **Devices**, choose your devkit device.
3. In the **General** tab, look for the **Model** and **SW Version** information.

Option 2:
1. View the **IoT Edge Device** of **IoT Hub** service from Microsoft Azure Portal.
2. Choose your devkit device from the device list.
3. Select **Device twin**.
4. Scroll through the device twin properties and locate **"model"** and **"swVersion"** under **"deviceInformation"** and make a note of their values.

## Determine the correct update package
Using the **model** and **swVersion** identified in the previous section, check the table below to determine which update package to download.


|model  |swVersion  |Update method  |Download links  |Note  |
|---------|---------|---------|---------|---------|
|PE-101     |All swVersions       |**USB only**         |[2021.107.129.116 USB update package](https://go.microsoft.com/fwlink/?linkid=2169086)         |July release (2107)         |
|APDK-101     |Any swVersion earlier than 2021.106.111.115 |**USB only**         |[2021.107.129.116 USB update package](https://go.microsoft.com/fwlink/?linkid=2169086)         |July release (2107)         |
|APDK-101     |2021.106.111.115        |OTA or USB       |[2021.107.129.116 OTA update package](https://go.microsoft.com/fwlink/?linkid=2169245)<br>[2021.107.129.116 USB update package](https://go.microsoft.com/fwlink/?linkid=2169086)        |July release (2107)         |


## Next steps
Update your dev kits via the methods and update packages determined in the previous section.
- [Update your Azure Percept DK over-the-air](./how-to-update-over-the-air.md)
- [Update your Azure Percept DK via USB](./how-to-update-via-usb.md)
