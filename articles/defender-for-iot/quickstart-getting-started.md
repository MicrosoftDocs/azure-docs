---
title: Deployment options
description: Get started in understanding the basic workflow of Defender for IoT features and service.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: shhazam-ms
manager: rkarlin
editor: ''
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/09/2020
ms.author: shhazam
---

# Getting started with Defender for IoT

This article describes the deployment and onboarding processes necessary to get Defender for IoT running. Additional steps are also required. It is recommended that you understand these steps and familiarize yourself with information in accompanying documents.

Once you complete all the steps, Defender for IoT sensors will monitor your network. Depending on how you set up your solution, detections can also be sent to the on-premises management console, or to the IoT Hub.

Complete the following steps to get Defender for IoT up and running.

## 1. Set up Azure

- Set up an Azure Account. For more information, see [Create an Azure account](/learn/modules/create-an-azure-account/).

- Firewall or proxy: If you have a firewall or similar intervening network device that is configured to allow specific connections verify that either *.azure-devices.net:443 is opened to the firewall or proxy. If wildcards are not supported or you want more control, the specific IoT Hub FQDN should be opened in your FW or proxy. For more information, see [Reference - IoT Hub endpoints](../iot-hub/iot-hub-devguide-endpoints.md).

## 2. Deploy hardware, software, and onboard to sensor

- Purchase sensor hardware and install software. See TBD

  - After you install your sensor, securely record the sensor sign-in credentials. You'll need the credentials to upload the activation file to the sensor.

  - If you are working with sensors that are locally connected, securely record the IP address of the sensor or the sensor name defined in the installation. You may want to use it when creating a sensor name during sensor registration in the Defender for IoT portal. You can use them later to ensure easier tracking and consistent naming between the registration name in the Defender for IoT portal and the IP address of the deployed sensor displayed in the sensor console.

- Register the sensor with the Defender for IoT portal and download a sensor activation file.

- Upload the activation file to your sensor.

## 3. Perform network setup for sensor monitoring and management

- Connect your sensors to the network. 

## 4. Start discovering your network

- Tweak system settings in the sensor console.

- Connect sensors to an on-premises management console.

For more information, see the [Defender for IoT Sensor User Guide](https://aka.ms/AzureDefenderforIoTUserGuide) and the [Defender for IoT on-premises management console user's guide](https://aka.ms/DefenderForIoTManagementConsole).

## 5. Populate Azure Sentinel with alert information

- To send alert information to Azure Sentinel, configure Azure Sentinel: [Connect your data from Defender for IoT to Azure Sentinel](how-to-configure-with-sentinel.md).
 

## Next steps

- [Acquire hardware and software](how-to-acquire-hardware-and-software.md)
- [About the Defender for IoT Installation](how-to-install-software.md)
- [About Azure Defender for IoT Network Setup](how-to-set-up-your-network.md)