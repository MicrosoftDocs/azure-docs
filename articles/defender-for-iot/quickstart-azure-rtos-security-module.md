---
title: "Quickstart: Configure and enable the Security Module for Azure RTOS"
description: Learn how to onboard and enable the Security Module for Azure RTOS service in your Azure IoT Hub.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/24/2020
ms.author: rkarlin
---

# Quickstart: Security Module for Azure RTOS (preview)

This article provides an explanation of the prerequisites before getting started and explains how to enable the Security Module for Azure RTOS service on an IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) to get started.

> [!NOTE]
> Security Module for Azure RTOS is only supported in standard tier IoT Hubs.

## Prerequisites 

### Supported devices

- ST STM32F746G Discovery Kit
- NXP i.MX RT1060 EVK
- Microchip SAM E54 Xplained Pro EVK

Download, compile, and run one of the .zip files for the specific board and tool (IAR, semi's IDE or PC) of your choice from the [Security Module for Azure RTOS GitHub resource](https://github.com/azure-rtos/azure-iot-preview/releases).

### Azure resources

The next stage for getting started is preparing your Azure resources. You'll need an IoT Hub and we suggest a Log Analytics workspace. For IoT Hub, you'll need your IoT Hub connection string to connect to your device. 
  
### IoT Hub connection

An IoT Hub connection is required to get started. 

1. Open your **IoT Hub** in Azure portal.
1. Copy the IoT connection string to the [configuration file](how-to-azure-rtos-security-module.md).


The connections credentials are taken from the user application configuration **HOST_NAME**, **DEVICE_ID**,and **DEVICE_SYMMETRIC_KEY**.

The Security Module for Azure RTOS uses Azure IoT Middleware connections based on the **MQTT** protocol.


### Log Analytics workspace

Log Analytics ingestion in IoT Hub is off by default Defender for IoT solution. To enable it for working with Security Module for Azure RTOS, do the following: 
1. In the Azure portal, go to your IoT Hub.
1. Select **Settings** under the **Security** menu.
   :::image type="content" source="media/quickstart/azure-rtos-hub-settings.png" alt-text="Access data collection option for Azure RTOS"::: 
1. Select **Data Collection**. 
1. From the **Workspace configuration** option, switch the toggle to **On**. 
1. Create a new Log Analytics workspace or attach an existing one. Make sure the **Access to raw security data** option is selected. 
 :::image type="content" source="media/quickstart/azure-rtos-data-collection-on.png" alt-text="Azure RTOS configuration showing data collection option and raw security data options both selected":::
1. Select **Save**
1. Return to your Azure resources list and confirm you see the Log Analytics Workspace you created or attached is enabled for the IoT Hub.
    :::image type="content" source="media/quickstart/verify-azure-resource-list.png" alt-text="Check your Azure resource list to confirm the addition of the correct Log Analytics Workspace added for an IoT Hub"::: 

## Next steps

Advance to the next article to finish configuring and customizing your solution.

> [!div class="nextstepaction"]
> [Configure Security Module for Azure RTOS](how-to-azure-rtos-security-module.md)
