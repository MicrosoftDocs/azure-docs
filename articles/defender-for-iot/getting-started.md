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
ms.date: 12/16/2020
ms.author: shhazam
---

# Getting started with Defender for IoT

**OVERVIEW**  TBD


This article provides an overview of the steps required to set up Defender for IoT.  The process is initiated by following instructions in the Welcome to Azure Defender for IoT page and subsequent pages.


To open the Azure Welcome page:

1. Log in to your Azure account and search for Azure Defender for IoT.

:::image type="content" source="media/updates/image4.png" alt-text="Screenshot of Azure welcome page view":::

**Before you Begin**

 Before you verify that you have:

- Set up Azure Account. Set up an Azure Account. For more information, see [Create an Azure account](/learn/modules/create-an-azure-account/). If you have a firewall or similar intervening network device that is configured to allow specific connections verify that either *.azure-devices.net:443 is opened to the firewall or proxy. If wildcards are not supported or you want more control, the specific IoT Hub FQDN should be opened in your FW or proxy. For more information, see [Reference - IoT Hub endpoints](../iot-hub/iot-hub-devguide-endpoints.md).

- Set Up Azure Subscriptions and Permissions

## 1. Acquire hardware 

Azure Defender for IoT supports various certified appliances:

**For sensor deployment, purchase**:

- Certified pre-configured appliances, on which software is already installed.
- Non-configured certified appliances on which you can download and install sensor software.

**For on-premises management console deployment, purchase**:

- Your own certified device and install the on-premises management console software on it. The on-premises management console is not available as a pre-configured appliance.

For more information see, [Acquire hardware and software](how-to-identify-required-appliances.md).

## 2. Acquire and Install on-premises management console software

After acquiring your on-premises management console appliances, you can download your software package from the Azure Defender for IoT portal, and install management console Defender for IoT software.

After sensor installation, securely record the sensor sign-in credentials. You'll need the credentials to upload the activation file to the sensor.

If you are working with sensors that are locally connected, securely record the IP address of the sensor or the sensor name defined in the installation. You may want to use it when creating a sensor name during sensor registration in the Defender for IoT portal. You can use them later to ensure easier tracking and consistent naming between the registration name in the Defender for IoT portal and the IP address of the deployed sensor displayed in the sensor console.

- Register the sensor with the Defender for IoT portal and download a sensor activation file.

- Upload the activation file to your sensor.

## 3. Acquire and Install sensor software

After acquiring your sensor appliances, you can download your software package from the Azure Defender for IoT portal, and install Defender for IoT software.

After sensor installation, securely record the sensor sign-in credentials. You'll need the credentials to upload the activation file to the sensor.

If you are working with sensors that are locally connected, securely record the IP address of the sensor or the sensor name defined in the installation. You may want to use it when creating a sensor name during sensor registration in the Defender for IoT portal. You can use them later to ensure easier tracking and consistent naming between the registration name in the Defender for IoT portal and the IP address of the deployed sensor displayed in the sensor console.

- Register the sensor with the Defender for IoT portal and download a sensor activation file.

- Upload the activation file to your sensor.

## 4. Onboard sensors and the management console 

 

## 5. Perform network setup

- Connect your sensors to the network.

## 6. Start discovering your network

- Tweak system settings in the sensor console.

- Connect sensors to an on-premises management console.
[Identify required appliances](how-to-identify-required-appliances.md)
## 7. Populate Azure Sentinel with alert information

- To send alert information to Azure Sentinel, configure Azure Sentinel: [Connect your data from Defender for IoT to Azure Sentinel](how-to-configure-with-sentinel.md).
 

## Next steps

- [Acquire hardware and software](how-to-acquire-hardware-and-software.md)
- [Identify required appliances](how-to-identify-required-appliances.md)
- [About Azure Defender for IoT Network Setup](how-to-set-up-your-network.md)