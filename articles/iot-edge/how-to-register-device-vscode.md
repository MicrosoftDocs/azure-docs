---
title: Register a new Azure IoT Edge device (VS Code) | Microsoft Docs 
description: Use Visual Studio Code to create a new IoT Edge device in your Azure IoT hub
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 06/14/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Register a new Azure IoT Edge device from Visual Studio Code

Before you can use your IoT devices with Azure IoT Edge, you need to register them with your IoT hub. Once you register a device, you receive a connection string that can be used to set up your device for Edge workloads. 

This article shows how to register a new IoT Edge device using Visual Studio Code (VS Code). There are multiple ways to perform most operations in VS Code. This article uses the Explorer, but you can also use the Command Palette to run most of the steps. 

## Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription
* [Visual Studio Code](https://code.visualstudio.com/) 
* [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) for Visual Studio Code

## Sign in to access your IoT hub

You can use the Azure IoT extensions for Visual Studio Code to perform operations with your IoT hub. For these operations to work, you need to sign in to your Azure account and select the IoT hub that you are working on.

1. In Visual Studio Code, open the **Explorer** view.

2. At the bottom of the Explorer, expand the **Azure IoT Hub Devices** section. 

   ![Expand Azure IoT Hub Devices](./media/how-to-register-device-vscode/azure-iot-hub-devices.png)

3. Click on the **...** in the **Azure IoT Hub Devices** section header. If you don't see the ellipsis, hover over the header. 

4. Choose **Select IoT Hub**.

5. If you are not signed in to your Azure account, follow the prompts to do so. 

6. Select your Azure subscription. 

7. Select your IoT hub. 

## Create a device

1. In the VS Code Explorer, expand the **Azure IoT Hub Devices** section. 

2. Click on the **...** in the **Azure IoT Hub Devices** section header. If you don't see the ellipsis, hover over the header. 

3. Select **Create IoT Edge Device**. 

4. In the text box that opens, give your device an ID. 

In the output screen, you see the result of the command. The device info is printed, which includes the **deviceId** that you provided and the **connectionString** that you can use to connect your physical device to your IoT hub. 

## View all devices

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub Devices** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices with a different icon, and the fact that they can be expanded to show the modules deployed to each device. 

   ![View devices in VS Code](./media/how-to-register-device-vscode/view-devices.png)

## Retrieve the connection string

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. Right-click on the ID of your device in the **Azure IoT Hub Devices** section. 
2. Select **Copy Device Connection String**.

   The connection string is copied to your clipboard. 

You can also select **Get Device Info** from the right-click menu to see all the device info, including the connection string, in the output window. 


## Next steps

Learn how to [Deploy modules to a device with Visual Studio Code](how-to-deploy-modules-vscode.md).
