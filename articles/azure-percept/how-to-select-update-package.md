---
title: Select the best update package for your Azure Percept DK
description: How to identify your Azure Percept DK version and select the best update package for it 
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 05/04/2021
ms.custom: template-how-to
---

# How to determine and download the best update package for OTA and USB updates

This page provides guidance on how to select the update package that is best for your dev kit and the download locations for the update packages.

For more information on how to update your device, see these articles:
- [Update your Azure Percept DK over-the-air](https://docs.microsoft.com/azure/azure-percept/how-to-update-over-the-air)
- [Update your Azure Percept DK via USB](https://docs.microsoft.com/azure/azure-percept/how-to-update-via-usb)


## Prerequisites

- An [Azure Percept DK](https://go.microsoft.com/fwlink/?linkid=2155270) that has been [set up and connected to Azure Percept Studio and IoT Hub](https://docs.microsoft.com/azure/azure-percept/quickstart-percept-dk-set-up).

## Identify the model name and software version of your dev kit
To ensure you apply the correct update package to your dev kit, you must first determine which software version it's currently running.

> [!WARNING]
> Applying the incorrect update package could result in your dev kit becoming inoperable. It is important that you follow these steps to ensure you apply the correct update package.

1. Power on your dev kit and ensure it's connected to Azure Percept Studio.
1. In Azure Percept Studio, select **Devices** from the left menu.
1. From the device list, select the name of the device that is currently connected. The status will say **Connected**.
1. Select **Open device in IoT Hub**
1. You may be asked to sign into your Azure account again.
1. Select **Device twin**.
1. Scroll through the device twin properties and locate **"model"** and **"swVersion"** under **"deviceInformation"** and make a note of their values.

## Determine the correct update package
Using the **model** and **swVersion** identified in the previous section, check the table below to determine which update package to download.


|model  |swVersion  |Update method  |Download links  |Note  |
|---------|---------|---------|---------|---------|
|PE-101     |2020.108.101.105, <br>2020.108.114.120, <br>2020.109.101.122, <br>2020.109.116.120, <br>2021.101.106.118        |**USB only**         |[2021.104.110.103 USB update package](https://go.microsoft.com/fwlink/?linkid=2155734)         |Public Preview major release         |
|PE-101     |2021.102.108.112, <br>         |OTA or USB        |[2021.104.110.103 OTA manifest](https://go.microsoft.com/fwlink/?linkid=2155625)<br>[2021.104.110.103 OTA update package](https://go.microsoft.com/fwlink/?linkid=2161538)<br>[2021.104.110.103 USB update package](https://go.microsoft.com/fwlink/?linkid=2155734)          |Public Preview major release         |
|APDK-101     |All swVersions        |OTA or USB       | [2021.105.111.112 OTA manifest](https://go.microsoft.com/fwlink/?linkid=2163554)<br>[2021.105.111.112 OTA update package](https://go.microsoft.com/fwlink/?linkid=2163456)<br>[2021.105.111.112 USB update package](https://go.microsoft.com/fwlink/?linkid=2163555)        |Latest monthly release (May)         |


## Next steps
Update your dev kits via the methods and update packages determined in the previous section.
- [Update your Azure Percept DK over-the-air](https://docs.microsoft.com/azure/azure-percept/how-to-update-over-the-air)
- [Update your Azure Percept DK via USB](https://docs.microsoft.com/azure/azure-percept/how-to-update-via-usb)
