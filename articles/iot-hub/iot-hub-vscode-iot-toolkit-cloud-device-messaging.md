---
title: Use the Azure IoT Hub extension for Visual Studio Code to manage IoT Hub messaging
description: Learn how to use the Azure IoT Hub extension for Visual Studio Code to monitor device to cloud messages and send cloud to device messages in Azure IoT Hub.
author: formulahendry

ms.author: junhan
ms.service: iot-hub
ms.topic: how-to
ms.date: 01/18/2019
ms.custom: ['Role: Cloud Development']
---

# Use the Azure IoT Hub extension for Visual Studio Code to send and receive messages between your device and IoT Hub

![End-to-end diagram](./media/iot-hub-vscode-iot-toolkit-cloud-device-messaging/e-to-e-diagram.png)

In this article, you learn how to use the Azure IoT Hub extension for Visual Studio Code to monitor device-to-cloud messages and to send cloud-to-device messages. Device-to-cloud messages could be sensor data that your device collects and then sends to your IoT hub. Cloud-to-device messages could be commands that your IoT hub sends to your device to blink an LED that is connected to your device.

The [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a useful extension that makes IoT Hub management and IoT application development easier. This article focuses on how to use the extension to send and receive messages between your device and your IoT hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Prerequisites

* An active Azure subscription.

* An Azure IoT hub under your subscription.

* [Visual Studio Code](https://code.visualstudio.com/)

* [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) or copy and paste this URL into a browser window: `vscode:extension/vsciot-vscode.azure-iot-toolkit`

## Sign in to access your IoT hub

Follow these steps to sign into Azure and access your IoT hub from your Azure subscription:

1. In the **Explorer** view of VS Code, expand the **Azure IoT Hub** section in the side bar.

1. Select the ellipsis (…) button of the **Azure IoT Hub** section to display the action menu, and then select **Select IoT Hub** from the action menu.

1. If you're not signed into Azure, a pop-up notification is shown in the bottom right corner to let you sign in to Azure. Select **Sign In** and follow the instructions to sign into Azure.

1. Select your Azure subscription from the **Select Subscription** dropdown list.

1. Select your IoT hub from the **Select IoT Hub** dropdown list.

1. The devices for your IoT hub are retrieved from IoT Hub and shown under the **Devices** node in the **Azure IoT Hub** section of the side bar.

   > [!NOTE]
   > You can also use a connection string to access your IoT hub, by selecting **Set IoT Hub Connection String** from the action menu and entering the **iothubowner** policy connection string for your IoT hub in the **IoT Hub Connection String** input box. 

## Monitor device-to-cloud messages

To monitor messages that are sent from your device to your IoT hub, follow these steps:

1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.

1. Right-click your IoT device and select **Start Monitoring Built-in Event Endpoint**. 

1. The monitored messages are shown in the **Output** panel.

1. To stop monitoring messages, right-click the **Output** panel and select **Stop Monitoring Built-in Event Endpoint**.

## Send cloud-to-device messages

To send a message from your IoT hub to your device, follow these steps:
 
1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.

1. Right-click your IoT device and select **Send C2D Message to Device** from the context menu. 

1. Enter the message in the input box, and then select the Enter key.

1. The results are shown in the **Output** panel.

## Next steps

You’ve learned how to monitor device-to-cloud messages and send cloud-to-device messages between your IoT device and Azure IoT Hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
