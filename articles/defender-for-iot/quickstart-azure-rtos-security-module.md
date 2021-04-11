---
title: "Quickstart: Configure and enable the Defender-IoT-micro-agent for Azure RTOS"
description: Learn how to onboard and enable the Defender-IoT-micro-agent for Azure RTOS service in your Azure IoT Hub.
services: defender-for-iot
ms.topic: quickstart
ms.date: 01/24/2021
---


# Quickstart: Defender-IoT-micro-agent for Azure RTOS (preview)

This article provides an explanation of the prerequisites before getting started and explains how to enable the Defender-IoT-micro-agent for Azure RTOS service on an IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md) to get started.

## Prerequisites 

### Supported devices

- ST STM32F746G Discovery Kit
- NXP i.MX RT1060 EVK
- Microchip SAM E54 Xplained Pro EVK

Download, compile, and run one of the .zip files for the specific board and tool (IAR, semi's IDE or PC) of your choice from the [Defender-IoT-micro-agent for Azure RTOS GitHub resource](https://github.com/azure-rtos/azure-iot-preview/releases).

### Azure resources

The next stage for getting started is preparing your Azure resources. You'll need an IoT Hub and we suggest a Log Analytics workspace. For IoT Hub, you'll need your IoT Hub connection string to connect to your device. 
  
### IoT Hub connection

An IoT Hub connection is required to get started. 

1. Open your **IoT Hub** in Azure portal.

1. Navigate to **IoT Devices**.

1. Select **Create**.

1. Copy the IoT connection string to the [configuration file](how-to-azure-rtos-security-module.md).

The connections credentials are taken from the user application configuration **HOST_NAME**, **DEVICE_ID**, and **DEVICE_SYMMETRIC_KEY**.

The Defender-IoT-micro-agent for Azure RTOS uses Azure IoT Middleware connections based on the **MQTT** protocol.

## Next steps

Advance to the next article to finish configuring and customizing your solution.

> [!div class="nextstepaction"]
> [Configure and customize Defender-IoT-micro-agent for Azure RTOS (preview)](how-to-azure-rtos-security-module.md)
