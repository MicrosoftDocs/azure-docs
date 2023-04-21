---
title: Azure IoT Hub device management with the Azure IoT Hub extension for Visual Studio Code
description: Use the Azure IoT Hub extension for Visual Studio Code for Azure IoT Hub device management, featuring the Direct methods and the Twin's desired properties management options.
author: formulahendry

ms.author: junhan
ms.service: iot-hub
ms.topic: how-to
ms.date: 01/04/2019
---

# Use the Azure IoT Hub extension for Visual Studio Code for Azure IoT Hub device management

![End-to-end diagram](media/iot-hub-get-started-e2e-diagram/2.png)

In this article, you learn how to use the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) with various management options on your development machine. The IoT Hub extension is a useful Visual Studio (VS) Code extension that makes IoT Hub management and IoT application development easier. It comes with management options that you can use to perform various tasks.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

| Management option          | Task                    |
|----------------------------|--------------------------------|
| Direct methods             | Make a device act such as starting or stopping sending messages or rebooting the device.                                        |
| Read device twin           | Get the reported state of a device. For example, the device reports the LED is blinking now.                                    |
| Update device twin         | Put a device into certain states, such as setting an LED to green or setting the telemetry send interval to 30 minutes.         |
| Cloud-to-device messages   | Send notifications to a device. For example, "It's likely to rain today. Don't forget to bring an umbrella."              |

For more detailed explanation on the differences and guidance on using these options, see [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communication guidance](iot-hub-devguide-c2d-guidance.md).

Device twins are JSON documents that store device state information (metadata, configurations, and conditions). IoT Hub persists a device twin for each device that connects to it. For more information about device twins, see [Get started with device twins](device-twins-node.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

* An active Azure subscription.
* An Azure IoT hub under your subscription.
* [Visual Studio Code](https://code.visualstudio.com/)
* [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) or copy this URL and paste it into a browser window:`vscode:extension/vsciot-vscode.azure-iot-toolkit`.

## Sign in to access your IoT hub

Follow these steps to sign into Azure and access your IoT hub from your Azure subscription:

1. In the **Explorer** view of VS Code, expand the **Azure IoT Hub** section in the side bar.

1. Select the ellipsis (…) button of the **Azure IoT Hub** section to display the action menu, and then select **Select IoT Hub** from the action menu.

1. If you're not signed into Azure, a pop-up notification is shown in the bottom right corner to let you sign in to Azure. Select **Sign In** and follow the instructions to sign into Azure.

1. From the command palette at the top of VS Code, select your Azure subscription from the **Select Subscription** dropdown list.

1. Select your IoT hub from the **Select IoT Hub** dropdown list.

1. The devices for your IoT hub are retrieved from IoT Hub and shown under the **Devices** node in the **Azure IoT Hub** section of the side bar.

   > [!NOTE]
   > You can also use a connection string to access your IoT hub, by selecting **Set IoT Hub Connection String** from the action menu and entering the **iothubowner** policy connection string for your IoT hub in the **IoT Hub Connection String** input box. 

## Direct methods

To invoke a direct method from your IoT device, follow these steps:

1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.

1. Right-click your IoT device and select **Invoke Device Direct Method**. 

1. Enter the method name in the input box, and then select the Enter key.

1. Enter the payload in the input box, and then select the Enter key.

1. The results are shown in the **Output** panel.

## Read device twin

To display the JSON document for the device twin of your IoT device, follow these steps:

1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.
 
1. Right-click your IoT device and select **Edit Device Twin**. 

1. The JSON document for the device twin, named **azure-iot-device-twin.json**, is shown in the editor.

## Update device twin

After [reading the device twin](#read-device-twin), follow these steps to update the device twin for your IoT device:

1. Make changes to arrays or values in the JSON document for the device twin. For example, add tags in the **tags** array, or change the values of desired properties in the **properties.desired** array.

1. Right-click the content area of the **azure-iot-device-twin.json** file and select **Update Device Twin**.

## Send cloud-to-device messages

To send a message from your IoT hub to your device, follow these steps:
 
1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.

1. Right-click your IoT device and select **Send C2D Message to Device**. 

1. Enter the message in the input box, and then select the Enter key.

1. The results are shown in the **Output** panel.

## Next steps

You've learned how to use the Azure IoT Hub extension for Visual Studio Code with various management options.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
