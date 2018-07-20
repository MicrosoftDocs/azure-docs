---
title: Manage Azure IoT Hub cloud device messaging with Azure IoT Toolkit extension for Visual Studio Code | Microsoft Docs
description: Learn how to use Azure IoT Toolkit extension for Visual Studio Code to monitor device to cloud (D2C) messages and send cloud to device (C2D) messages in Azure IoT Hub.
author: junhan
manager: 
keywords: azure iot toolkit, visual studio code, cloud device messaging, iot hub cloud to device, cloud to device messaging
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 7/20/2018
ms.author: junhan
---

# Use Azure IoT Toolkit extension for Visual Studio Code to send and receive messages between your device and IoT Hub

![End-to-end diagram](media/iot-hub-get-started-e2e-diagram/2.png)

[!INCLUDE [iot-hub-get-started-note](../../includes/iot-hub-get-started-note.md)]

[Azure IoT Toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a useful Visual Studio Code extension that makes IoT Hub management easier. This tutorial focuses on how to use Azure IoT Toolkit extension for Visual Studio Code to send and receive messages between your device and your IoT hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## What you will learn

You learn how to use Azure IoT Toolkit extension for Visual Studio Code to monitor device-to-cloud messages and to send cloud-to-device messages. Device-to-cloud messages could be sensor data that your device collects and then sends to your IoT hub. Cloud-to-device messages could be commands that your IoT hub sends to your device to blink an LED that is connected to your device.

## What you will do

- Use Azure IoT Toolkit extension for Visual Studio Code to monitor device-to-cloud messages.
- Use Azure IoT Toolkit extension for Visual Studio Code to send cloud-to-device messages.

## What you need

- Tutorial [Setup your device](iot-hub-raspberry-pi-kit-node-get-started.md) completed which covers the following requirements:
  - An active Azure subscription.
  - An Azure IoT hub under your subscription.
  - A client application that sends messages to your Azure IoT hub.
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure IoT Toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit)

## Select IoT Hub

1. In Explorer of VS Code, click **Azure IoT Hub Devices** tab in the bottom left corner.
1. Click **Select IoT Hub** in context menu.
1. If you have not signed in to Azure, a pop-up will show in the bottom right corner to let you sign in to Azure.
1. After you sign in, your Azure Subscription list will be shown, then select Azure Subscription and IoT Hub.
1. The device list will be shown in **Azure IoT Hub Devices** tab in a few seconds.

## Monitor device-to-cloud messages

To monitor messages that are sent from your device to your IoT hub, follow these steps:

1. Right-click your device and select **Start Monitoring D2C Message**.
1. The monitored messages will be shown in **OUTPUT** > **Azure IoT Toolkit** view.
1. To stop monitoring, right-click the **OUTPUT** view and select **Stop Monitoring D2C Message**.

## Send cloud-to-device messages

To send a message from your IoT hub to your device, follow these steps:

1. Right-click your device and select **Send C2D message to Device**. 
1. Enter the message in input box.
1. Results will be shown in **OUTPUT** > **Azure IoT Toolkit** view.

## Next steps

You’ve learned how to monitor device-to-cloud messages and send cloud-to-device messages between your IoT device and Azure IoT Hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
