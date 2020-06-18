---
title: Use Azure IoT Tools for VSCode to manager IT Hub messaging
description: Learn how to use Azure IoT Tools for Visual Studio Code to monitor device to cloud messages and send cloud to device messages in Azure IoT Hub.
author: formulahendry
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 01/18/2019
ms.author: junhan
---
# Use Azure IoT Tools for Visual Studio Code to send and receive messages between your device and IoT Hub

![End-to-end diagram](./media/iot-hub-vscode-iot-toolkit-cloud-device-messaging/e-to-e-diagram.png)

[Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a useful Visual Studio Code extension that makes IoT Hub management and IoT application development easier. This article focuses on how to use Azure IoT Tools for Visual Studio Code to send and receive messages between your device and your IoT hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## What you will learn

You learn how to use Azure IoT Tools for Visual Studio Code to monitor device-to-cloud messages and to send cloud-to-device messages. Device-to-cloud messages could be sensor data that your device collects and then sends to your IoT hub. Cloud-to-device messages could be commands that your IoT hub sends to your device to blink an LED that is connected to your device.

## What you will do

* Use Azure IoT Tools for Visual Studio Code to monitor device-to-cloud messages.

* Use Azure IoT Tools for Visual Studio Code to send cloud-to-device messages.

## What you need

* An active Azure subscription.

* An Azure IoT hub under your subscription.

* [Visual Studio Code](https://code.visualstudio.com/)

* [Azure IoT Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) or copy and paste this URL into a browser window: `vscode:extension/vsciot-vscode.azure-iot-tools`

## Sign in to access your IoT hub

1. In **Explorer** view of VS Code, expand **Azure IoT Hub Devices** section in the bottom left corner.

2. Click **Select IoT Hub** in context menu.

3. A pop-up will show in the bottom right corner to let you sign in to Azure for the first time.

4. After you sign in, your Azure Subscription list will be shown, then select Azure Subscription and IoT Hub.

5. The device list will be shown in **Azure IoT Hub Devices** tab in a few seconds.

   > [!Note]
   > You can also complete the set up by choosing **Set IoT Hub Connection String**. Enter the **iothubowner** policy connection string for the IoT hub that your IoT device connects to in the pop-up window.

## Monitor device-to-cloud messages

To monitor messages that are sent from your device to your IoT hub, follow these steps:

1. Right-click your device and select **Start Monitoring Built-in Event Endpoint**.

2. The monitored messages will be shown in **OUTPUT** > **Azure IoT Hub** view.

3. To stop monitoring, right-click the **OUTPUT** view and select **Stop Monitoring Built-in Event Endpoint**.

## Send cloud-to-device messages

To send a message from your IoT hub to your device, follow these steps:

1. Right-click your device and select **Send C2D Message to Device**.

2. Enter the message in input box.

3. Results will be shown in **OUTPUT** > **Azure IoT Hub** view.

## Next steps

You’ve learned how to monitor device-to-cloud messages and send cloud-to-device messages between your IoT device and Azure IoT Hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]