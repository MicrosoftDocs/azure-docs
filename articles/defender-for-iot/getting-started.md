---
title: Deployment options
description: Get started in understanding the basic workflow of Defender for IoT features and service.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/09/2020
ms.author: mlottner
---

# Getting started with Azure Defender for IoT

This article describes the deployment and onboarding processes necessary to get Azure Defender for IoT running. Additional steps are also required. It is recommended that you understand these steps and familiarize yourself with information in accompanying documents.

Once you complete all the steps, Azure Defender for IoT sensors will monitor your network. Depending on how you set up your solution, detections can also be sent to the on-premises management console, or to the IoT Hub.

Complete the following steps to get Azure Defender for IoT up and running.

## 1. Set up Azure

- Set up an Azure Account. For more information, see [Create an Azure account](https://docs.microsoft.com/learn/modules/create-an-azure-account/).

- Firewall or proxy: If you have a firewall or similar intervening network device that is configured to allow specific connections verify that either *.azure-devices.net:443 is opened to the firewall or proxy. If wildcards are not supported or you want more control, the specific IoT Hub FQDN should be opened in your FW or proxy. For more information, see [Reference - IoT Hub endpoints](/azure/iot-hub/iot-hub-devguide-endpoints).

## 2. Deploy hardware, software, and onboard to sensor

- Purchase sensor hardware and install software. Follow the steps outlined here, and for more information, see this article and the [Defender for IoT Hardware Guide](https://aka.ms/AzureDefenderforIoTBareMetalAppliance) and the [Installation Guide](https://aka.ms/AzureDefenderforIoTInstallSensorISO).

  - After you install your sensor, securely record the sensor sign-in credentials. You'll need the credentials to upload the activation file to the sensor.

  - If you are working with sensors that are locally managed, securely record the IP address of the sensor or the sensor name defined in the installation. You may want to use it when creating a sensor name during sensor registration in the Defender for IoT portal. You can use them later to ensure easier tracking and consistent naming between the registration name in the Azure Defender for IoT portal and the IP address of the deployed sensor displayed in the sensor console.

- Register the sensor with the Defender for IoT portal and download a sensor activation file.

- Upload the activation file to your sensor.

## 3. Perform network setup for sensor monitoring and management

- Connect your sensor to the network. Described in the [Network setup guide](https://aka.ms/AzureDefenderForIoTNetworkSetup).

## 4. Start discovering your network

- Tweak system settings in the sensor console.

- Connect sensors to an on-premises management console.

For more information, see the [Azure Defender for IoT Sensor User Guide](https://aka.ms/AzureDefenderforIoTUserGuide) and the [Defender for IoT on-premises management console user's guide](https://aka.ms/DefenderForIoTManagementConsole).

## 5. Populate Azure Sentinel with alert information

- To send alert information to Azure Sentinel, configure Azure Sentinel: [Connect your data from Defender for IoT to Azure Sentinel](how-to-configure-with-sentinel.md).
 

## Next steps

- Enable [Defender for IoT](quickstart-onboard-iot-hub.md)
- Configure your [solution](quickstart-configure-your-solution.md)
- [Create security modules](quickstart-create-security-twin.md)
- Configure [custom alerts](quickstart-create-custom-alerts.md)
- [Deploy a security agent](how-to-deploy-agent.md)
