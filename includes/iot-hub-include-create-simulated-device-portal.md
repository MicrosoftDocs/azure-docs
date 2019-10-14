---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 02/26/2019
ms.author: robinsh
ms.custom: include file
---
<!-- This is the instructions for creating a simulated device you can use for testing routing.-->

Next, create a device identity and save its key for later use. This device identity is used by the simulation application to send messages to the IoT hub. This capability is not available in PowerShell or when using an Azure Resource Manager template. The following steps tell you how to create the simulated device using the [Azure portal](https://portal.azure.com).

1. Open the [Azure portal](https://portal.azure.com) and log into your Azure account.

2. Select **Resource groups** and then choose your resource group. This tutorial uses **ContosoResources**.

3. In the list of resources, select your IoT hub. This tutorial uses **ContosoTestHub**. Select **IoT Devices** from the Hub pane.

4. Select **+ Add**. On the Add Device pane, fill in the device ID. This tutorial uses **Contoso-Test-Device**. Leave the keys empty, and check **Auto Generate Keys**. Make sure **Connect device to IoT hub** is enabled. Select **Save**.

   ![The add-device screen](./media/iot-hub-include-create-simulated-device-portal/add-device.png)

5. Now that it's been created, select the device to see the generated keys. Select the Copy icon on the Primary key and save it somewhere such as Notepad for the testing phase of this tutorial.

   ![The device details, including the keys](./media/iot-hub-include-create-simulated-device-portal/device-details.png)